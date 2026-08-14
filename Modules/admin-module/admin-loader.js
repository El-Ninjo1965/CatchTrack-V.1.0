/*
 * Generic Admin Module Loader
 * Version: 1.0.0
 *
 * Registers and activates the neutral admin module in the framework core.
 */

(() => {
    'use strict';

    if (!window.Core || !window.ModuleInterface || !window.ModuleManager) {
        return;
    }

    if (!window.AdminModuleInterface) {
        console.error('[Framework] AdminModuleInterface not available');
        return;
    }

    const AdminModuleDefinition = window.AdminModuleInterface.definition;
    const AdminModule = window.ModuleInterface.create({
        id: 'admin-module',
        name: 'Admin Module',
        version: AdminModuleDefinition.version || '1.0.0',
        description: 'Administration and system management',
        onActivate: AdminModuleDefinition.onActivate,
        onDeactivate: AdminModuleDefinition.onDeactivate
    });

    try {
        window.ModuleManager.register(AdminModule);
        window.ModuleManager.activate(AdminModule.id);

        window.Core.emit('admin-module:registered-and-loaded', {
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        if (window.CoreErrorHandler) {
            window.CoreErrorHandler.handle(error, {
                type: 'admin-module-loader'
            });
        }
    }
})();
