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

    const CoreLoader = {
        initialized: false,

        init() {
            if (this.initialized) {
                return;
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
                throw new Error(
                    `Missing Core components: ${missingComponents.join(', ')}`
                );
            }

            this.initialized = true;

            window.Core.emit('core:ready', {
                version: window.CoreConfig.core.version
            });
        }
    };

    window.CoreLoader = CoreLoader;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CoreLoader.init();
        });
    } else {
        CoreLoader.init();
    }
})();
