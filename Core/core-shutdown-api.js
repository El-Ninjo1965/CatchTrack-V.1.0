/*
 * CatchTrack Core Shutdown API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle zum
 * kontrollierten Beenden des Core.
 */

(() => {
    'use strict';

    const ShutdownAPI = {
        stop() {
            return window.CatchTrackCoreShutdown.stop();
        },

        isStopped() {
            return window.CatchTrackCoreShutdown.stopped;
        }
    };

    window.CatchTrackCoreShutdownAPI =
        Object.freeze(ShutdownAPI);
})();