/*
 * CatchTrack Core Module Config API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Konfiguration einzelner Module.
 */

(() => {
    'use strict';

    const ConfigAPI = {
        set(moduleId, config = {}) {
            return window.CatchTrackCoreModuleConfig.set(
                moduleId,
                config
            );
        },

        get(moduleId, defaultConfig = {}) {
            return window.CatchTrackCoreModuleConfig.get(
                moduleId,
                defaultConfig
            );
        },

        has(moduleId) {
            return window.CatchTrackCoreModuleConfig.has(
                moduleId
            );
        },

        remove(moduleId) {
            return window.CatchTrackCoreModuleConfig.remove(
                moduleId
            );
        },

        getAll() {
            return window.CatchTrackCoreModuleConfig.getAll();
        }
    };

    window.CatchTrackCoreModuleConfigAPI =
        Object.freeze(ConfigAPI);
})();