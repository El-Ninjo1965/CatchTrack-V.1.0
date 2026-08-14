/*
 * Generic User Module Loader
 * Version: 1.0.0
 *
 * Registers and activates the neutral user module in the framework core.
 */

(() => {
    'use strict';

    if (!window.Core || !window.ModuleInterface || !window.ModuleManager) {
        return;
    }

    if (!window.UserModuleInterface) {
        console.error('[Framework] UserModuleInterface not available');
        return;
    }

    const UserModuleDefinition = window.UserModuleInterface.definition;
    const UserModule = window.ModuleInterface.create({
        id: 'user-module',
        name: 'User Module',
        version: UserModuleDefinition.version || '1.0.0',
        description: 'User management and authentication',
        onActivate: UserModuleDefinition.onActivate,
        onDeactivate: UserModuleDefinition.onDeactivate
    });

    try {
        window.ModuleManager.register(UserModule);
        window.ModuleManager.activate(UserModule.id);

        window.Core.emit('user-module:registered-and-loaded', {
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        if (window.CoreErrorHandler) {
            window.CoreErrorHandler.handle(error, {
                type: 'user-module-loader'
            });
        }
    }
})();
