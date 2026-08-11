/*
 * CatchTrack Core Module Registry
 * Version: 1.0
 *
 * Technisches Verzeichnis der verfügbaren Module.
 * Die fachliche Funktionalität bleibt innerhalb der Module.
 */

(() => {
    'use strict';

    const modules = new Map();

    const CoreModuleRegistry = {
        register(definition) {
            if (!definition || typeof definition !== 'object') {
                throw new TypeError('Module definition is required.');
            }

            if (!definition.id || typeof definition.id !== 'string') {
                throw new Error('Module ID is required.');
            }

            if (modules.has(definition.id)) {
                throw new Error(
                    `Module already exists: ${definition.id}`
                );
            }

            modules.set(definition.id, {
                ...definition
            });

            window.CatchTrackCoreEvents?.emit(
                'module-registry:registered',
                {
                    id: definition.id
                }
            );
        },

        unregister(moduleId) {
            if (!modules.has(moduleId)) {
                return false;
            }

            modules.delete(moduleId);

            window.CatchTrackCoreEvents?.emit(
                'module-registry:unregistered',
                {
                    id: moduleId
                }
            );

            return true;
        },

        get(moduleId) {
            return modules.get(moduleId) || null;
        },

        has(moduleId) {
            return modules.has(moduleId);
        },

        getAll() {
            return Array.from(modules.values());
        },

        clear() {
            modules.clear();
        }
    };

    window.CatchTrackCoreModuleRegistry =
        Object.freeze(CoreModuleRegistry);
})();