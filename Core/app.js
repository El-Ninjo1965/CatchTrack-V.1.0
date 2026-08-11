/*
 * CatchTrack Application Bootstrap
 * Version: 1.0
 *
 * Startpunkt der Anwendung.
 * Der Core wird vor den Modulen initialisiert.
 */

(() => {
    'use strict';

    const App = {
        version: '1.0.0',

        start() {
            if (!window.CatchTrackCore) {
                throw new Error('CatchTrack Core is not available.');
            }

            if (!window.CatchTrackModuleManager) {
                throw new Error('CatchTrack Module Manager is not available.');
            }

            this.registerSystemEvents();

            window.CatchTrackCore.emit('app:started', {
                version: this.version
            });
        },

        registerSystemEvents() {
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