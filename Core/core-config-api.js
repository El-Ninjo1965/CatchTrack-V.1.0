/*
 * CatchTrack Core Config API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * zentrale Core-Konfiguration.
 */

(() => {
    'use strict';

    const ConfigAPI = {
        get(key, defaultValue = null) {
            return window.CatchTrackCoreConfig.get(
                key,
                defaultValue
            );
        },

        set(key, value) {
            return window.CatchTrackCoreConfig.set(
                key,
                value
            );
        },

        has(key) {
            return window.CatchTrackCoreConfig.has(key);
        },

        remove(key) {
            return window.CatchTrackCoreConfig.remove(key);
        },

        getAll() {
            return window.CatchTrackCoreConfig.getAll();
        }
    };

    window.CatchTrackCoreConfigAPI =
        Object.freeze(ConfigAPI);
})();