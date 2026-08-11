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
                // i18n zuerst – andere Module können t() nutzen
                'Modules/i18n-module/i18n-module.js',
                'Modules/i18n-module/i18n-interface.js',
                'Modules/i18n-module/i18n-loader.js',
                // Weather Module (Provider vor Modul laden)
                'Modules/weather-module/weather-provider.js',
                'Modules/weather-module/weather-module.js',
                'Modules/weather-module/weather-interface.js',
                'Modules/weather-module/weather-loader.js',
                // GPS Module
                'Modules/gps-module/gps-module.js',
                'Modules/gps-module/gps-interface.js',
                'Modules/gps-module/gps-loader.js',
                // User und Admin Module
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

            if (window.CatchTrackCoreEntry) {
                window.CatchTrackCoreEntry.start();
            }

            window.CatchTrackCore.emit('app:started', {
                version: this.version
            });

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
