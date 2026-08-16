/*
 * Core Loader
 * Version: 1.0
 *
 * Lädt und prüft die definierte Core-Infrastruktur.
 * Die technische Modulverwaltung liegt im Module Manager und
 * in der Module Registry; dieser Loader führt keine Fachmodule.
 */

(() => {
    'use strict';

    const defaultFrameworkCatalog = Object.freeze([
        {
            id: 'core-user',
            name: 'Core User',
            version: '1.0.0',
            type: 'framework',
            description: 'Framework identity, session and permission layer.',
            dependencies: [],
            permissions: ['framework:read'],
            capabilities: ['identity', 'session'],
            globalName: 'UserModule',
            source: 'platform/core-user.js'
        },
        {
            id: 'core-admin',
            name: 'Core Admin',
            version: '1.0.0',
            type: 'framework',
            description: 'Framework administration and health diagnostics.',
            dependencies: [],
            permissions: ['framework:read', 'system:view'],
            capabilities: ['diagnostics', 'health-check'],
            globalName: 'AdminModule',
            source: 'platform/core-admin.js'
        },
        {
            id: 'core-i18n',
            name: 'Core i18n',
            version: '1.0.0',
            type: 'framework',
            description: 'Framework localization and locale management.',
            dependencies: [],
            permissions: ['framework:read'],
            capabilities: ['localization'],
            globalName: 'I18nModule',
            source: 'platform/core-i18n.js'
        }
    ]);

    const toAbsolutePath = (basePath, candidate) => {
        if (!candidate) {
            return null;
        }

        if (/^(https?:)?\/\//i.test(candidate)) {
            return candidate;
        }

        if (candidate.startsWith('/')) {
            return candidate;
        }

        return `${basePath.replace(/\/$/, '')}/${candidate.replace(/^\.\//, '')}`;
    };

    const readTextFile = async (filePath) => {
        if (typeof fetch === 'function') {
            const response = await fetch(filePath, { cache: 'no-store' });

            if (!response.ok) {
                return null;
            }

            return response.text();
        }

        if (typeof require === 'function' && typeof process !== 'undefined') {
            const fs = require('fs');
            const path = require('path');
            const normalized = path.resolve(filePath);

            if (!fs.existsSync(normalized)) {
                return null;
            }

            return fs.readFileSync(normalized, 'utf8');
        }

        return null;
    };

    const readJsonFile = async (filePath) => {
        const text = await readTextFile(filePath);

        if (!text) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            return null;
        }
    };

    const evaluateModuleScript = (scriptText) => {
        if (!scriptText || typeof scriptText !== 'string') {
            return null;
        }

        try {
            const executor = new Function(scriptText);
            executor();
            return true;
        } catch (error) {
            if (window && window.CoreErrorHandler) {
                window.CoreErrorHandler.handle(error, {
                    type: 'module-script-eval',
                    scriptText: scriptText.slice(0, 120)
                });
            }
            return false;
        }
    };

    const CoreLoader = {
        initialized: false,

        getDefaultFrameworkCatalog() {
            return [...defaultFrameworkCatalog];
        },

        loadModuleManifest(moduleRootPath, candidateNames = ['module.json', 'manifest.json']) {
            const candidates = candidateNames
                .map((fileName) => toAbsolutePath(moduleRootPath, fileName))
                .filter(Boolean);

            return (async () => {
                for (const candidate of candidates) {
                    const manifest = await readJsonFile(candidate);
                    if (manifest) {
                        return {
                            ...manifest,
                            modulePath: moduleRootPath,
                            manifestPath: candidate
                        };
                    }
                }

                return null;
            })();
        },

        async loadModuleFromManifest(moduleRootPath, manifest, entryOverride = null) {
            const normalizedManifest = manifest && typeof manifest === 'object' ? manifest : null;

            if (!normalizedManifest || !normalizedManifest.id) {
                return null;
            }

            const entryName = entryOverride || normalizedManifest.entry || normalizedManifest.main || 'index.js';
            const entryPath = toAbsolutePath(moduleRootPath, entryName);
            const scriptText = await readTextFile(entryPath);

            if (!scriptText) {
                return null;
            }

            evaluateModuleScript(scriptText);

            const implementation = (
                normalizedManifest.globalName && window[normalizedManifest.globalName]
            ) || (
                normalizedManifest.name && window[normalizedManifest.name]
            ) || Object.keys(window).find((key) => key.toLowerCase() === String(normalizedManifest.id).toLowerCase().replace(/[^a-z0-9]/gi, ''))
                ? window[Object.keys(window).find((key) => key.toLowerCase() === String(normalizedManifest.id).toLowerCase().replace(/[^a-z0-9]/gi, ''))]
                : null;

            if (!implementation) {
                const globalCandidate = Object.keys(window)
                    .filter((key) => /^([A-Z].*)$/.test(key))
                    .find((key) => key.toLowerCase().includes(String(normalizedManifest.id).toLowerCase().replace(/[^a-z0-9]/gi, '')) || key.toLowerCase().includes(String(normalizedManifest.name || '').toLowerCase().replace(/[^a-z0-9]/gi, '')));

                if (globalCandidate) {
                    return {
                        ...window[globalCandidate],
                        id: normalizedManifest.id,
                        name: normalizedManifest.name || window[globalCandidate].name || normalizedManifest.id,
                        manifest: normalizedManifest,
                        modulePath: moduleRootPath,
                        source: entryPath
                    };
                }
            }

            if (!implementation) {
                return null;
            }

            return {
                ...implementation,
                id: implementation.id || normalizedManifest.id,
                name: implementation.name || normalizedManifest.name || normalizedManifest.id,
                version: implementation.version || normalizedManifest.version || '1.0.0',
                description: implementation.description || normalizedManifest.description || '',
                manifest: normalizedManifest,
                modulePath: moduleRootPath,
                source: entryPath
            };
        },

        async discoverExternalModules(basePath = 'Modules') {
            const rootPath = (typeof basePath === 'string' && basePath.trim()) ? basePath.trim() : 'Modules';
            const discovered = [];

            if (typeof require === 'function' && typeof process !== 'undefined') {
                const fs = require('fs');
                const path = require('path');
                const rootDirectory = path.resolve(rootPath);

                if (!fs.existsSync(rootDirectory)) {
                    return discovered;
                }

                const entries = fs.readdirSync(rootDirectory, { withFileTypes: true });

                for (const entry of entries) {
                    if (!entry.isDirectory()) {
                        continue;
                    }

                    const moduleDirectory = path.join(rootDirectory, entry.name);
                    const manifest = await this.loadModuleManifest(moduleDirectory);

                    if (!manifest) {
                        continue;
                    }

                    const loaded = await this.loadModuleFromManifest(moduleDirectory, manifest);
                    if (loaded) {
                        discovered.push(loaded);
                    }
                }

                return discovered;
            }

            const externalCatalog = Array.isArray(window.ExternalModuleCatalog)
                ? window.ExternalModuleCatalog
                : [];

            for (const entry of externalCatalog) {
                if (!entry || typeof entry !== 'object') {
                    continue;
                }

                const manifest = window.ModuleInterface && typeof window.ModuleInterface.validateManifest === 'function'
                    ? window.ModuleInterface.validateManifest(entry)
                    : null;

                if (!manifest) {
                    continue;
                }

                const loaded = await this.loadModuleFromManifest(
                    entry.modulePath || rootPath,
                    manifest,
                    entry.entry || manifest.entry || manifest.main || null
                );

                if (loaded) {
                    discovered.push(loaded);
                }
            }

            const manifestIndexCandidates = [
                `${rootPath}/modules.json`,
                `${rootPath}/index.json`,
                `${rootPath}/manifest.json`
            ];

            for (const manifestUrl of manifestIndexCandidates) {
                const manifestList = await readJsonFile(manifestUrl);

                if (!manifestList) {
                    continue;
                }

                const list = Array.isArray(manifestList)
                    ? manifestList
                    : Array.isArray(manifestList.modules)
                        ? manifestList.modules
                        : [];

                for (const entry of list) {
                    const manifest = window.ModuleInterface && typeof window.ModuleInterface.validateManifest === 'function'
                        ? window.ModuleInterface.validateManifest(entry)
                        : null;

                    if (!manifest) {
                        continue;
                    }

                    const moduleRoot = entry.modulePath || `${rootPath}/${manifest.id}`;
                    const loaded = await this.loadModuleFromManifest(moduleRoot, manifest, entry.entry || manifest.entry || manifest.main || null);

                    if (loaded) {
                        discovered.push(loaded);
                    }
                }
            }

            return discovered;
        },

        init() {
            if (this.initialized) {
                return true;
            }

            const requiredComponents = [
                'Core',
                'ModuleManager',
                'ModuleRegistry',
                'ModuleInterface',
                'ErrorLog',
                'CoreConfig',
                'CoreContext',
                'CoreState',
                'CoreEventBus',
                'CoreLifecycle',
                'CoreAuth',
                'CoreAccess',
                'CoreAudit',
                'CoreEventRing'
            ];

            const missingComponents = requiredComponents.filter(
                (component) => !window[component]
            );

            if (missingComponents.length > 0) {
                return false;
            }

            if (!Array.isArray(window.FrameworkModuleCatalog)) {
                window.FrameworkModuleCatalog = this.getDefaultFrameworkCatalog();
            }

            this.initialized = true;

            if (window.Core && window.Core.emit) {
                window.Core.emit('core:ready', {
                    version: window.CoreConfig && window.CoreConfig.core
                        ? window.CoreConfig.core.version
                        : 'unknown'
                });
            }

            return true;
        }
    };

    window.CoreLoader = CoreLoader;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CoreLoader.init();
        });
    }
})();
