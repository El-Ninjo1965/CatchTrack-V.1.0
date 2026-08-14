/*
 * Generic Admin Module Interface
 * Version: 1.0.0
 *
 * Public interface for the neutral admin module in the framework.
 */

(() => {
    'use strict';

    const AdminModuleInterface = {
        name: 'admin-module',
        version: '1.0.0',
        description: 'Administration and system management',

        definition: {
            onActivate() {
                if (!window.AdminModule) {
                    throw new Error('AdminModule not loaded');
                }

                window.AdminModule.init();

                if (window.Core) {
                    window.Core.emit('admin-module:activated', {
                        version: this.version
                    });
                }
            },

            onDeactivate() {
                if (window.Core) {
                    window.Core.emit('admin-module:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            api: {
                getSystemStats: () => window.AdminModule ? window.AdminModule.getSystemStats() : undefined,
                getLoadedModules: () => window.AdminModule ? window.AdminModule.getLoadedModules() : undefined,
                getErrorLog: () => window.AdminModule ? window.AdminModule.getErrorLog() : undefined,
                clearErrorLog: () => window.AdminModule ? window.AdminModule.clearErrorLog() : undefined,
                performHealthCheck: () => window.AdminModule ? window.AdminModule.performHealthCheck() : undefined,
                getDebugInfo: () => window.AdminModule ? window.AdminModule.getDebugInfo() : undefined,
                logError: (error) => window.AdminModule ? window.AdminModule.logError(error) : undefined
            }
        }
    };

    if (!window.AdminModuleInterface) {
        window.AdminModuleInterface = Object.freeze(AdminModuleInterface);
    }
})();
