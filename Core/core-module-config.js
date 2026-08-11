/*
 * CatchTrack Core Module Configuration
 * Version: 1.0
 *
 * Technische Verwaltung der Konfiguration einzelner Module.
 * Fachliche Einstellungen bleiben innerhalb des jeweiligen Moduls.
 */

(() => {
    'use strict';

    const configurations = new Map();

    const ModuleConfig = {
        set(moduleId, config = {}) {
            this.validateModuleId(moduleId);

            if (
                config === null ||
                typeof config !== 'object' ||
                Array.isArray(config)
            ) {
                throw new TypeError(
                    'Module configuration must be an object.'
                );
            }

            configurations.set(moduleId, {
                ...config
            });

            window.CatchTrackCoreEvents?.emit(
                'module-config:changed',
                {
                    moduleId,
                    config: configurations.get(moduleId)
                }
            );
        },

        get(moduleId, defaultConfig = {}) {
            this.validateModuleId(moduleId);

            return configurations.has(moduleId)
                ? { ...configurations.get(moduleId) }
                : defaultConfig;
        },

        has(moduleId) {
            this.validateModuleId(moduleId);

            return configurations.has(moduleId);
        },

        remove(moduleId) {
            this.validateModuleId(moduleId);

            return configurations.delete(moduleId);
        },

        getAll() {
            return Object.fromEntries(
                Array.from(configurations.entries()).map(
                    ([moduleId, config]) => [
                        moduleId,
                        { ...config }
                    ]
                )
            );
        },

        clear() {
            configurations.clear();
        },

        validateModuleId(moduleId) {
            if (
                typeof moduleId !== 'string' ||
                !moduleId.trim()
            ) {
                throw new Error('Module ID is required.');
            }
        }
    };

    window.CatchTrackCoreModuleConfig =
        Object.freeze(ModuleConfig);
})();