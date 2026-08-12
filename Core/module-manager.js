/*
 * CatchTrack Module Manager
 * Version: 1.0
 *
 * Zentrale Verwaltung der Module inklusive Registrierung,
 * Aktivierung, Deaktivierung und Lifecycle-Steuerung.
 */

(() => {
    'use strict';

    const ModuleManager = {
        registry: null,

        init() {
            if (!window.CatchTrackModuleRegistry) {
                throw new Error('CatchTrack Module Registry is not available.');
            }

            this.registry = window.CatchTrackModuleRegistry;
        },

        normalizeModule(module) {
            if (!module || typeof module !== 'object') {
                throw new TypeError('Invalid module definition.');
            }

            if (!module.id || typeof module.id !== 'string') {
                throw new Error('Module ID is required.');
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

            return module;
        },

        register(module) {
            this.ensureInitialized();

            const normalizedModule = this.normalizeModule(module);
            const registeredModule = this.registry.register(normalizedModule);

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('module:registered', {
                    id: registeredModule.id
                });
            }

            return registeredModule;
        },

        unregister(moduleId) {
            this.ensureInitialized();

            const removed = this.registry.unregister(moduleId);

            if (removed && window.CatchTrackCore) {
                window.CatchTrackCore.emit('module:unregistered', {
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

            module.status = 'enabled';
            module.active = true;

            if (typeof module.enable === 'function') {
                module.enable();
            } else if (typeof module.activate === 'function') {
                module.activate();
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.state.activeModule = moduleId;
                window.CatchTrackCore.emit('module:activated', {
                    id: moduleId
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

            module.status = 'disabled';
            module.active = false;

            if (typeof module.disable === 'function') {
                module.disable();
            } else if (typeof module.deactivate === 'function') {
                module.deactivate();
            }

            if (window.CatchTrackCore && window.CatchTrackCore.state.activeModule === moduleId) {
                window.CatchTrackCore.state.activeModule = null;
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('module:deactivated', {
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

    window.CatchTrackModuleManager = ModuleManager;
})();