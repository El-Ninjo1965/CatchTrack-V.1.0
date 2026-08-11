/*
 * CatchTrack Core Utils API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für allgemeine
 * Core-Hilfsfunktionen.
 */

(() => {
    'use strict';

    const UtilsAPI = {
        generateId(prefix = 'id') {
            return window.CatchTrackCoreUtils.generateId(prefix);
        },

        now() {
            return window.CatchTrackCoreUtils.now();
        },

        clone(value) {
            return window.CatchTrackCoreUtils.clone(value);
        },

        isObject(value) {
            return window.CatchTrackCoreUtils.isObject(value);
        }
    };

    window.CatchTrackCoreUtilsAPI =
        Object.freeze(UtilsAPI);
})();