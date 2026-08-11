/*
 * CatchTrack Core Startup API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * kontrollierten Start des Core.
 */

(() => {
    'use strict';

    const StartupAPI = {
        start() {
            return window.CatchTrackCoreStartup.start();
        },

        isStarted() {
            return window.CatchTrackCoreStartup.started;
        }
    };

    window.CatchTrackCoreStartupAPI =
        Object.freeze(StartupAPI);
})();