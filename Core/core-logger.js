/*
 * CatchTrack Core Logger
 * Version: 1.0
 *
 * Zentrale Laufzeitprotokollierung für Core und Module.
 * Fehler werden zusätzlich über den Error Log erfasst.
 */

(() => {
    'use strict';

    const CoreLogger = {
        levels: Object.freeze({
            INFO: 'info',
            WARN: 'warn',
            ERROR: 'error'
        }),

        log(level, message, context = {}) {
            if (typeof message !== 'string') {
                message = String(message);
            }

            const entry = {
                timestamp: new Date().toISOString(),
                level,
                message,
                context
            };

            if (level === this.levels.ERROR) {
                console.error(`[CatchTrack] ${message}`, context);

                window.CatchTrackErrorLog?.record(
                    new Error(message),
                    context
                );

                return entry;
            }

            if (level === this.levels.WARN) {
                console.warn(`[CatchTrack] ${message}`, context);
                return entry;
            }

            console.info(`[CatchTrack] ${message}`, context);

            return entry;
        },

        info(message, context = {}) {
            return this.log(this.levels.INFO, message, context);
        },

        warn(message, context = {}) {
            return this.log(this.levels.WARN, message, context);
        },

        error(message, context = {}) {
            return this.log(this.levels.ERROR, message, context);
        }
    };

    window.CatchTrackCoreLogger = Object.freeze(CoreLogger);
})();