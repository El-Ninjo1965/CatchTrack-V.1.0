/*
 * CatchTrack Core Context API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * zentralen Laufzeitkontext.
 */

(() => {
    'use strict';

    const ContextAPI = {
        set(key, value) {
            return window.CatchTrackCoreContext.setRuntimeValue(
                key,
                value
            );
        },

        get(key, defaultValue = null) {
            return window.CatchTrackCoreContext.getRuntimeValue(
                key,
                defaultValue
            );
        },

        has(key) {
            return window.CatchTrackCoreContext.hasRuntimeValue(
                key
            );
        },

        remove(key) {
            return window.CatchTrackCoreContext.removeRuntimeValue(
                key
            );
        },

        getAll() {
            return window.CatchTrackCoreContext.getRuntimeValues();
        }
    };

    window.CatchTrackCoreContextAPI =
        Object.freeze(ContextAPI);
})();