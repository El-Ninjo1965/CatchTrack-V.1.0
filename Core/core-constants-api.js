/*
 * CatchTrack Core Constants API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für
 * unveränderliche Core-Konstanten.
 */

(() => {
    'use strict';

    const ConstantsAPI = {
        get(name, defaultValue = null) {
            return window.CatchTrackCoreConstants.get(
                name,
                defaultValue
            );
        },

        has(name) {
            return window.CatchTrackCoreConstants.has(name);
        },

        getAll() {
            return window.CatchTrackCoreConstants.getAll();
        }
    };

    window.CatchTrackCoreConstantsAPI =
        Object.freeze(ConstantsAPI);
})();