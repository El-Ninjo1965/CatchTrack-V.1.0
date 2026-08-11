/*
 * CatchTrack Core Error Handler
 * Version: 1.0
 *
 * Zentrale Behandlung von Laufzeitfehlern.
 * Die Fehler werden an den zentralen Error Log weitergeleitet.
 */

(() => {
    'use strict';

    const CoreErrorHandler = {
        handle(error, context = {}) {
            const normalizedError =
                error instanceof Error
                    ? error
                    : new Error(String(error));

            const entry = window.CatchTrackErrorLog
                ? window.CatchTrackErrorLog.record(
                    normalizedError,
                    context
                )
                : null;

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit(
                    'error:handled',
                    {
                        error: normalizedError,
                        context,
                        entry
                    }
                );
            }

            return entry;
        }
    };

    window.CatchTrackCoreErrorHandler =
        Object.freeze(CoreErrorHandler);
})();
