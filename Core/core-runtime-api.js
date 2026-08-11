/*
 * CatchTrack Core Runtime API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle zur Steuerung
 * der Core-Laufzeit.
 */

(() => {
    'use strict';

    const RuntimeAPI = {
        start() {
            return window.CatchTrackCoreRuntime.start();
        },

        stop() {
            return window.CatchTrackCoreRuntime.stop();
        },

        isRunning() {
            return window.CatchTrackCoreRuntime.isRunning();
        }
    };

    window.CatchTrackCoreRuntimeAPI =
        Object.freeze(RuntimeAPI);
})();