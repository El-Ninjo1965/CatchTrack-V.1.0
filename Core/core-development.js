/*
 * CatchTrack Core Development
 * Version: 1.0
 *
 * Technische Entwicklungsfunktionen für den Aufbau
 * und Test der Anwendung.
 *
 * Diese Datei enthält keine produktive Benutzer-
 * oder Rechteverwaltung.
 */

(() => {
    'use strict';

    const Development = {
        getStatus() {
            return {
                mode:
                    window.CatchTrackCoreTestMode?.isEnabled()
                        ? 'test'
                        : 'development',

                core:
                    window.CatchTrackCore?.version || null,

                runtime:
                    window.CatchTrackCoreRuntime?.isRunning()
                        || false,

                modules:
                    window.CatchTrackCore?.getModules?.() || []
            };
        },

        enableTestMode() {
            window.CatchTrackCoreTestMode?.enable();
        },

        disableTestMode() {
            window.CatchTrackCoreTestMode?.disable();
        }
    };

    window.CatchTrackCoreDevelopment =
        Object.freeze(Development);
})();