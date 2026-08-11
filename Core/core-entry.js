/*
 * CatchTrack Core Entry
 * Version: 1.0
 *
 * Zentraler Einstiegspunkt für den technischen Core-Start.
 */

(() => {
    'use strict';

    const CoreEntry = {
        start() {
            if (!window.CatchTrackCoreRuntime) {
                throw new Error(
                    'CatchTrack Core Runtime is not available.'
                );
            }

            if (window.CatchTrackCoreRuntime.isRunning()) {
                return;
            }

            window.CatchTrackCoreRuntime.start();
        },

        stop() {
            if (!window.CatchTrackCoreRuntime) {
                throw new Error(
                    'CatchTrack Core Runtime is not available.'
                );
            }

            window.CatchTrackCoreRuntime.stop();
        }
    };

    window.CatchTrackCoreEntry =
        Object.freeze(CoreEntry);
})();