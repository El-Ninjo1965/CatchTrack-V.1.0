/*
 * CatchTrack Core Diagnostics API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für
 * Entwicklungs- und Laufzeitdiagnosen.
 */

(() => {
    'use strict';

    const DiagnosticsAPI = {
        getStatus() {
            return window.CatchTrackCoreDiagnostics.getStatus();
        },

        getModules() {
            return window.CatchTrackCoreDiagnostics.getModules();
        },

        getErrors() {
            return window.CatchTrackCoreDiagnostics.getErrors();
        },

        run() {
            return window.CatchTrackCoreDiagnostics.run();
        }
    };

    window.CatchTrackCoreDiagnosticsAPI =
        Object.freeze(DiagnosticsAPI);
})();