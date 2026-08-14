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
            id: 'user-module',
            name: 'User Module',
            version: '1.0.0',
            type: 'framework',
            description: 'Framework identity, session and permission layer.',
            dependencies: [],
            permissions: ['framework:read'],
            capabilities: ['identity', 'session'],
            globalName: 'UserModule',
            source: 'Modules/user-module/user-module.js'
        },
        {
            id: 'admin-module',
            name: 'Admin Module',
            version: '1.0.0',
            type: 'framework',
            description: 'Framework administration and health diagnostics.',
            dependencies: [],
            permissions: ['framework:read', 'system:view'],
            capabilities: ['diagnostics', 'health-check'],
            globalName: 'AdminModule',
            source: 'Modules/admin-module/admin-module.js'
        },
        {
            id: 'i18n-module',
            name: 'i18n Module',
            version: '1.0.0',
            type: 'framework',
            description: 'Framework localization and locale management.',
            dependencies: [],
            permissions: ['framework:read'],
            capabilities: ['localization'],
            globalName: 'I18nModule',
            source: 'Modules/i18n-module/i18n-module.js'
        }
    ]);

    const CoreLoader = {
        initialized: false,

        getDefaultFrameworkCatalog() {
            return [...defaultFrameworkCatalog];
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
                'CoreLifecycle'
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
    // Do not eagerly initialize here: browser script order can load the loader before the
    // Module registry, manager and interfaces are available. Those components are initialized
    // later by the startup flow and by the actual boot sequence.

})();
