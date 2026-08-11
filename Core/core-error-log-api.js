/*
 * CatchTrack Core Error Log API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für das
 * zentrale Fehlerprotokoll.
 */

(() => {
    'use strict';

    const ErrorLogAPI = {
        add(error, context = {}) {
            return window.CatchTrackErrorLog.add(
                error,
                context
            );
        },

        getAll() {
            return window.CatchTrackErrorLog.getAll();
        },

        getLast() {
            return window.CatchTrackErrorLog.getLast();
        },

        clear() {
            return window.CatchTrackErrorLog.clear();
        },

        count() {
            return window.CatchTrackErrorLog.count();
        }
    };

    window.CatchTrackCoreErrorLogAPI =
        Object.freeze(ErrorLogAPI);
})();