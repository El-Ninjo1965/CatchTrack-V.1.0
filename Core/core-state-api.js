/*
 * CatchTrack Core State API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * zentralen Laufzeitstatus des Core.
 */

(() => {
    'use strict';

    const StateAPI = {
        set(key, value) {
            return window.CatchTrackCoreState.set(
                key,
                value
            );
        },

        get(key, defaultValue = null) {
            return window.CatchTrackCoreState.get(
                key,
                defaultValue
            );
        },

        has(key) {
            return window.CatchTrackCoreState.has(key);
        },

        remove(key) {
            return window.CatchTrackCoreState.remove(key);
        },

        getAll() {
            return window.CatchTrackCoreState.getAll();
        },

        clear() {
            return window.CatchTrackCoreState.clear();
        }
    };

    window.CatchTrackCoreStateAPI =
        Object.freeze(StateAPI);
})();