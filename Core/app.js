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
            this.registerSmokeTestModule();

            if (window.CatchTrackCoreEntry) {
                window.CatchTrackCoreEntry.start();
            }

            window.CatchTrackCore.emit('app:started', {
                version: this.version
            });
        },

        registerSmokeTestModule() {
            if (
                !window.CatchTrackModuleInterface ||
                !window.CatchTrackModuleManager ||
                !window.CatchTrackCore
            ) {
                return;
            }

            const smokeTestModule = window.CatchTrackModuleInterface.create({
                id: 'smoke-test-module',
                name: 'CatchTrack Smoke Test Module',
                version: '1.0.0',
                description:
                    'Minimalmodul zur Überprüfung der Core-Modulregistrierung und des Event-Systems.',
                onActivate(module) {
                    window.CatchTrackCore.emit('smoke-test:activated', {
                        id: module.id,
                        time: new Date().toISOString()
                    });

                    window.CatchTrackCore.on('smoke-test:ping', (payload) => {
                        console.info(
                            '[CatchTrack] smoke-test:ping empfangen',
                            payload
                        );
                    });

                    window.CatchTrackCore.emit('smoke-test:ping', {
                        source: module.id,
                        startedAt: new Date().toISOString()
                    });
                },
                onDeactivate(module) {
                    window.CatchTrackCore.emit('smoke-test:deactivated', {
                        id: module.id,
                        time: new Date().toISOString()
                    });
                }
            });

            try {
                window.CatchTrackModuleManager.register(smokeTestModule);
                window.CatchTrackModuleManager.activate(smokeTestModule.id);
            } catch (error) {
                window.CatchTrackCoreErrorHandler?.handle(error, {
                    type: 'smoke-test-module'
                });
            }
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
