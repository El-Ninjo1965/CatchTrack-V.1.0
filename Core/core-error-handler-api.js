/*
 * CatchTrack Core Error Handler API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * zentrale Fehlerbehandlung des Core.
 */

(() => {
    'use strict';

    const ErrorHandlerAPI = {
        handle(error, context = {}) {
            return window.CatchTrackCoreErrorHandler.handle(
                error,
                context
            );
        },

        log(error, context = {}) {
            return window.CatchTrackCoreErrorHandler.log(
                error,
                context
            );
        },

        getLast() {
            return window.CatchTrackCoreErrorHandler.getLast();
        },

        getAll() {
            return window.CatchTrackCoreErrorHandler.getAll();
        },

        clear() {
            return window.CatchTrackCoreErrorHandler.clear();
        }
    };

    window.CatchTrackCoreErrorHandlerAPI =
        Object.freeze(ErrorHandlerAPI);
})();