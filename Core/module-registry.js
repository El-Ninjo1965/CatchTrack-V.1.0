/*
 * Module Registry
 * Version: 1.0
 *
 * Zentrale Verwaltung der registrierten Core-Module.
 * Diese Registry enthält keine UI-Logik und keine fachliche
 * Modulimplementierung. Sie stellt nur die technische Registry
 * für Module bereit.
 */

(() => {
    'use strict';

    const registry = new Map();

    const ModuleRegistry = {
        register(module) {
            if (!module || typeof module !== 'object') {
                throw new TypeError('Invalid module definition.');
            }

            if (!module.id || typeof module.id !== 'string') {
                throw new Error('Module ID is required.');
            }

            if (registry.has(module.id)) {
                throw new Error(`Module already registered: ${module.id}`);
            }

            registry.set(module.id, module);

            return module;
        },

        unregister(moduleId) {
            if (!moduleId || typeof moduleId !== 'string') {
                throw new Error('Module ID is required.');
            }

            if (!registry.has(moduleId)) {
                return false;
            }

            registry.delete(moduleId);
            return true;
        },

        get(moduleId) {
            if (!moduleId || typeof moduleId !== 'string') {
                throw new Error('Module ID is required.');
            }

            return registry.get(moduleId) || null;
        },

        getAll() {
            return Array.from(registry.values());
        },

        has(moduleId) {
            if (!moduleId || typeof moduleId !== 'string') {
                throw new Error('Module ID is required.');
            }

            return registry.has(moduleId);
        },

        clear() {
            registry.clear();
        }
    };

    window.ModuleRegistry = Object.freeze(ModuleRegistry);
})();
