/*
 * CatchTrack Admin Module Interface
 * Version: 1.0
 *
 * Definiert die öffentliche Schnittstelle des Admin-Moduls für den CatchTrack-Core.
 */

(() => {
    'use strict';

    const AdminModuleInterface = {
        name: 'admin-module',
        version: '1.0.0',
        description: 'Verwaltungs- und Steuerwerkzeug für die Anwendung',

        definition: {
            /**
             * Wird beim Aktivieren des Moduls aufgerufen
             */
            onActivate(moduleContext) {
                if (!window.CatchTrackAdminModule) {
                    throw new Error('AdminModule nicht geladen');
                }

                window.CatchTrackAdminModule.init();

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('admin-module:activated', {
                        version: this.version
                    });
                }
            },

            /**
             * Wird beim Deaktivieren des Moduls aufgerufen
             */
            onDeactivate(moduleContext) {
                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('admin-module:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            /**
             * Öffentliche API des Admin-Moduls
             */
            api: {
                getSystemStats: () => window.CatchTrackAdminModule ? window.CatchTrackAdminModule.getSystemStats() : undefined,
                getLoadedModules: () => window.CatchTrackAdminModule ? window.CatchTrackAdminModule.getLoadedModules() : undefined,
                getErrorLog: () => window.CatchTrackAdminModule ? window.CatchTrackAdminModule.getErrorLog() : undefined,
                clearErrorLog: () => window.CatchTrackAdminModule ? window.CatchTrackAdminModule.clearErrorLog() : undefined,
                performHealthCheck: () => window.CatchTrackAdminModule ? window.CatchTrackAdminModule.performHealthCheck() : undefined,
                getDebugInfo: () => window.CatchTrackAdminModule ? window.CatchTrackAdminModule.getDebugInfo() : undefined,
                logError: (error) => window.CatchTrackAdminModule ? window.CatchTrackAdminModule.logError(error) : undefined
            }
        }
    };

    if (!window.CatchTrackAdminModuleInterface) {
        window.CatchTrackAdminModuleInterface = Object.freeze(AdminModuleInterface);
    }
})();
