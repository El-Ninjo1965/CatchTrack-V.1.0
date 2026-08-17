/*
 * Module Manager
 * Version: 1.0
 *
 * Zentrale Verwaltung der Module inklusive Registrierung,
 * Aktivierung, Deaktivierung und Lifecycle-Steuerung.
 */

(() => {
    'use strict';

    const resolveGlobalName = (manifest, entry) => {
        if (entry && typeof entry.globalName === 'string' && entry.globalName.trim()) {
            return entry.globalName.trim();
        }

        if (manifest && typeof manifest.globalName === 'string' && manifest.globalName.trim()) {
            return manifest.globalName.trim();
        }

        const primaryName = (manifest && manifest.name) || (entry && entry.name) || (manifest && manifest.id) || '';
        const nameCandidates = [
            primaryName,
            (manifest && manifest.id) || '',
            (entry && entry.id) || ''
        ].filter(Boolean);

        const normalized = nameCandidates
            .map((name) => name
                .replace(/[^A-Za-z0-9]+/g, ' ')
                .trim()
                .split(/\s+/)
                .filter(Boolean))
            .flat()
            .map((part, index) => index === 0
                ? part.charAt(0).toUpperCase() + part.slice(1)
                : part.charAt(0).toUpperCase() + part.slice(1))
            .join('');

        return normalized || 'Module';
    };

    const ModuleManager = {
        registry: null,

        init() {
            if (!window.ModuleRegistry) {
                throw new Error('Module Registry is not available.');
            }

            this.registry = window.ModuleRegistry;
        },

        normalizeModule(module) {
            if (!module || typeof module !== 'object') {
                throw new TypeError('Invalid module definition.');
            }

            if (!module.id || typeof module.id !== 'string') {
                if (typeof module.name === 'string' && module.name.trim()) {
                    module.id = module.name.trim();
                } else {
                    throw new Error('Module ID is required.');
                }
            }

            if (!module.name || typeof module.name !== 'string') {
                module.name = module.id;
            }

            if (typeof module.status === 'undefined') {
                module.status = 'available';
            }

            if (typeof module.active === 'undefined') {
                module.active = false;
            }

            if (!Array.isArray(module.dependencies)) {
                module.dependencies = [];
            }

            if (!Array.isArray(module.permissions)) {
                module.permissions = [];
            }

            if (!Array.isArray(module.capabilities)) {
                module.capabilities = [];
            }

            if (!module.manifest) {
                module.manifest = {
                    id: module.id,
                    name: module.name,
                    version: module.version || '1.0.0',
                    type: 'framework',
                    description: module.description || '',
                    dependencies: [...module.dependencies],
                    permissions: [...module.permissions],
                    capabilities: [...module.capabilities]
                };
            }

            return module;
        },

        async discoverModules() {
            this.ensureInitialized();

            if (!window.ModuleRegistry || typeof window.ModuleRegistry.discover !== 'function') {
                return [];
            }

            const catalog = Array.isArray(window.FrameworkModuleCatalog)
                ? window.FrameworkModuleCatalog
                : [];

            const discovered = [];

            const externalModules = window.CoreLoader && typeof window.CoreLoader.discoverExternalModules === 'function'
                ? await window.CoreLoader.discoverExternalModules('app/modules')
                : [];

            const combinedCatalog = [...catalog, ...externalModules.map((module) => ({
                id: module.id,
                name: module.name,
                version: module.version,
                description: module.description || '',
                dependencies: Array.isArray(module.dependencies) ? module.dependencies : [],
                permissions: Array.isArray(module.permissions) ? module.permissions : [],
                capabilities: Array.isArray(module.capabilities) ? module.capabilities : [],
                source: module.source || module.modulePath,
                entry: module.source || module.modulePath,
                globalName: module.globalName || module.name || module.id,
                instance: module
            }))];

            for (const entry of combinedCatalog) {
                if (!entry || typeof entry !== 'object') {
                    continue;
                }

                const manifest = window.ModuleInterface && typeof window.ModuleInterface.validateManifest === 'function'
                    ? window.ModuleInterface.validateManifest(entry)
                    : null;

                if (!manifest) {
                    continue;
                }

                const globalName = resolveGlobalName(manifest, entry);
                const candidate = entry.instance || window[globalName] || null;
                if (!candidate) {
                    continue;
                }

                const moduleId = candidate.id || manifest.id;
                if (this.registry.has(moduleId)) {
                    discovered.push(this.get(moduleId));
                    continue;
                }

                const normalized = this.normalizeModule({
                    ...candidate,
                    id: moduleId,
                    name: candidate.name || manifest.name,
                    version: candidate.version || manifest.version,
                    description: candidate.description || manifest.description,
                    dependencies: Array.isArray(candidate.dependencies)
                        ? candidate.dependencies
                        : [...(manifest.dependencies || [])],
                    permissions: Array.isArray(candidate.permissions)
                        ? candidate.permissions
                        : [...(manifest.permissions || [])],
                    capabilities: Array.isArray(candidate.capabilities)
                        ? candidate.capabilities
                        : [...(manifest.capabilities || [])],
                    manifest
                });

                const registered = this.register(normalized);
                discovered.push(registered);

                try {
                    this.install(registered.id);
                    this.initialize(registered.id);
                    this.enable(registered.id);
                } catch (error) {
                    if (window.CoreErrorHandler) {
                        window.CoreErrorHandler.handle(error, {
                            type: 'module-discovery-activate',
                            moduleId: registered.id
                        });
                    }
                }
            }

            return discovered;
        },

        validateDependencies(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            const missingDependencies = (module.dependencies || []).filter(
                (dependency) => !this.registry.has(dependency)
            );

            if (missingDependencies.length > 0) {
                throw new Error(`Missing module dependencies for "${module.id}": ${missingDependencies.join(', ')}`);
            }

            return true;
        },

        register(module) {
            this.ensureInitialized();

            const normalizedModule = this.normalizeModule(module);
            const registeredModule = this.registry.register(normalizedModule);

            if (window.Core) {
                window.Core.emit('module:registered', {
                    id: registeredModule.id,
                    name: registeredModule.name,
                    version: registeredModule.version
                });
            }

            return registeredModule;
        },

        unregister(moduleId) {
            this.ensureInitialized();

            const removed = this.registry.unregister(moduleId);

            if (removed && window.Core) {
                window.Core.emit('module:unregistered', {
                    id: moduleId
                });
            }

            return removed;
        },

        get(moduleId) {
            this.ensureInitialized();
            return this.registry.get(moduleId);
        },

        getAll() {
            this.ensureInitialized();
            return this.registry.getAll();
        },

        getStatus(moduleId) {
            const module = this.get(moduleId);

            if (!module) {
                return null;
            }

            return module.status || (module.active ? 'enabled' : 'available');
        },

        install(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            this.validateDependencies(moduleId);

            if (typeof module.install === 'function') {
                module.install();
            }

            return module;
        },

        initialize(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            this.validateDependencies(moduleId);

            if (typeof module.initialize === 'function') {
                module.initialize();
            }

            return module;
        },

        enable(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            this.validateDependencies(moduleId);

            if (typeof module.enable === 'function') {
                module.enable();
            } else if (typeof module.activate === 'function') {
                module.activate();
            }

            if (window.Core) {
                window.Core.state.activeModule = moduleId;
                window.Core.emit('module:activated', {
                    id: moduleId,
                    name: module.name,
                    version: module.version
                });
            }

            return module;
        },

        disable(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                return false;
            }

            if (typeof module.disable === 'function') {
                module.disable();
            } else if (typeof module.deactivate === 'function') {
                module.deactivate();
            }

            if (
                window.Core &&
                window.Core.state.activeModule === moduleId
            ) {
                window.Core.state.activeModule = null;
            }

            if (window.Core) {
                window.Core.emit('module:deactivated', {
                    id: moduleId
                });
            }

            return true;
        },

        update(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            if (typeof module.update === 'function') {
                module.update();
            }

            return module;
        },

        uninstall(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                return false;
            }

            if (typeof module.uninstall === 'function') {
                module.uninstall();
            }

            return this.unregister(moduleId);
        },

        activate(moduleId) {
            return this.enable(moduleId);
        },

        deactivate(moduleId) {
            return this.disable(moduleId);
        },

        ensureInitialized() {
            if (!this.registry) {
                throw new Error('Module Manager is not initialized.');
            }
        }
    };

    ModuleManager.init();

    window.ModuleManager = ModuleManager;
})();