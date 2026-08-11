/*
 * CatchTrack Core Storage API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * zentralen Anwendungsspeicher.
 */

(() => {
    'use strict';

    const StorageAPI = {
        set(key, value) {
            return window.CatchTrackCoreStorage.set(
                key,
                value
            );
        },

        get(key, defaultValue = null) {
            return window.CatchTrackCoreStorage.get(
                key,
                defaultValue
            );
        },

        has(key) {
            return window.CatchTrackCoreStorage.has(key);
        },

        remove(key) {
            return window.CatchTrackCoreStorage.remove(key);
        },

        clear() {
            return window.CatchTrackCoreStorage.clear();
        },

        getAll() {
            return window.CatchTrackCoreStorage.getAll();
        }
    };

    window.CatchTrackCoreStorageAPI =
        Object.freeze(StorageAPI);
})();