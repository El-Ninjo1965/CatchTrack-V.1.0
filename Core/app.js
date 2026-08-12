/*
 * CatchTrack Application Bootstrap
 * Version: 1.0
 *
 * Generischer Anwendungseinstiegspunkt.
 * Der Core wird gestartet, ohne konkrete Fachmodule zu laden.
 */

(() => {
    'use strict';

    let systemEventsRegistered = false;

    const App = {
        version: '1.0.0',

        start() {
            if (!window.CatchTrackCore) {
                throw new Error('CatchTrack Core is not available.');
            }

            if (!window.CatchTrackCoreEntry) {
                throw new Error('CatchTrack Core Entry is not available.');
            }

            this.registerSystemEvents();
            window.CatchTrackCoreEntry.start();
            window.CatchTrackCore.emit('app:started', {
                version: this.version
            });
        },

        registerSystemEvents() {
            if (systemEventsRegistered || !window.CatchTrackCore) {
                return;
            }

            systemEventsRegistered = true;

            window.CatchTrackCore.on('module:registered', (event) => {
                console.info(`[CatchTrack] Module registered: ${event.id}`);
            });

            window.CatchTrackCore.on('module:activated', (event) => {
                console.info(`[CatchTrack] Module activated: ${event.id}`);
            });

            window.CatchTrackCore.on('module:deactivated', (event) => {
                console.info(`[CatchTrack] Module deactivated: ${event.id}`);
            });
        }
    };

    window.CatchTrackApp = App;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            App.start();
        });
    } else {
        App.start();
    }
})();
