/*
 * CatchTrack Core Environment API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Ermittlung der aktuellen Laufzeitumgebung.
 */

(() => {
    'use strict';

    const EnvironmentAPI = {
        get() {
            return window.CatchTrackCoreEnvironment.get();
        },

        isDevelopment() {
            return window.CatchTrackCoreEnvironment.isDevelopment();
        },

        isProduction() {
            return window.CatchTrackCoreEnvironment.isProduction();
        },

        isTest() {
            return window.CatchTrackCoreEnvironment.isTest();
        }
    };

    window.CatchTrackCoreEnvironmentAPI =
        Object.freeze(EnvironmentAPI);
})();