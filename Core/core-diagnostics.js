/*
 * CatchTrack Core Diagnostics
 * Version: 1.0
 *
 * Stellt grundlegende Laufzeitinformationen für Entwicklung
 * und Fehlersuche bereit.
 */

(() => {
    'use strict';

    const CoreDiagnostics = {
        getStatus() {
            return {
                application: window.CatchTrackCoreConfig?.application || null,
                core: window.CatchTrackCoreConfig?.core || null,
                initialized:
                    window.CatchTrackCore?.state?.initialized === true,
                moduleCount:
                    window.CatchTrackCore?.getModules()?.length || 0,
                currentRoute:
                    window.CatchTrackCoreRouter?.getCurrentRoute() || null,
                errorCount:
                    window.CatchTrackErrorLog?.getAll()?.length || 0
            };
        },

        getModules() {
            return window.CatchTrackCore?.getModules() || [];
        },

        getErrors() {
            return window.CatchTrackErrorLog?.getAll() || [];
        },

        clearErrors() {
            window.CatchTrackErrorLog?.clear();
        }
    };

    window.CatchTrackCoreDiagnostics = Object.freeze(CoreDiagnostics);
})();