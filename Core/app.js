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

        async start() {
            if (!window.CatchTrackCore) {
                throw new Error('CatchTrack Core is not available.');
            }

            if (!window.CatchTrackModuleManager) {
                throw new Error('CatchTrack Module Manager is not available.');
            }

            this.registerSystemEvents();

            // Lade alle Module
            await this.loadModuleScripts([
                // Core Infrastruktur
                'Config/config-manager.js',
                'Database/database-manager.js',
                'Services/service-manager.js',
                'Tests/test-runner.js',
                // User und Admin Module
                'Modules/test-module.js',
                'Modules/user-module/user-module.js',
                'Modules/user-module/user-interface.js',
                'Modules/user-module/user-loader.js',
                'Modules/admin-module/admin-module.js',
                'Modules/admin-module/admin-interface.js',
                'Modules/admin-module/admin-loader.js'
            ]);

            // Initialisiere Infrastruktur
            if (window.CatchTrackConfigManager) {
                window.CatchTrackConfigManager.init();
            }

            if (window.CatchTrackDatabaseManager) {
                await window.CatchTrackDatabaseManager.init();
            }

            if (window.CatchTrackServiceManager) {
                window.CatchTrackServiceManager.init();
            }

            this.registerSmokeTestModule();

            if (window.CatchTrackCoreEntry) {
                window.CatchTrackCoreEntry.start();
            }

            window.CatchTrackCore.emit('app:started', {
                version: this.version
            });

            // Starte automatisch Tests (optional)
            if (window.CatchTrackTestRunner && window.CatchTrackConfigManager?.getPath('app.debug')) {
                setTimeout(() => {
                    window.CatchTrackTestRunner.run();
                }, 2000);
            }
        },

        loadModuleScripts(modulePaths) {
            if (!Array.isArray(modulePaths)) {
                return Promise.resolve();
            }

            const loadScript = (path) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = path;
                    script.async = false;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error(`Failed to load module script: ${path}`));
                    document.head.appendChild(script);
                });
            };

            return Promise.all(modulePaths.map(loadScript));
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
