/*
 * CatchTrack Core Logger API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für das
 * zentrale Laufzeit-Logging.
 */

(() => {
    'use strict';

    const LoggerAPI = {
        debug(message, context = {}) {
            return window.CatchTrackCoreLogger.debug(
                message,
                context
            );
        },

        info(message, context = {}) {
            return window.CatchTrackCoreLogger.info(
                message,
                context
            );
        },

        warn(message, context = {}) {
            return window.CatchTrackCoreLogger.warn(
                message,
                context
            );
        },

        error(message, context = {}) {
            return window.CatchTrackCoreLogger.error(
                message,
                context
            );
        },

        getEntries() {
            return window.CatchTrackCoreLogger.getEntries();
        },

        clear() {
            return window.CatchTrackCoreLogger.clear();
        }
    };

    window.CatchTrackCoreLoggerAPI =
        Object.freeze(LoggerAPI);
})();