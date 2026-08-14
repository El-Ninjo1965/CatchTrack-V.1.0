/*
 * Generic i18n Module Loader
 * Version: 1.0.0
 */

(() => {
    'use strict';

    if (!window.Core || !window.ModuleInterface || !window.ModuleManager) {
        return;
    }

    if (!window.I18nModuleInterface) {
        console.error('[Framework] I18nModuleInterface not available');
        return;
    }

    const def = window.I18nModuleInterface.definition;
    const I18nModuleInstance = window.ModuleInterface.create({
        id: 'i18n-module',
        name: 'i18n Module',
        version: '1.0.0',
        description: 'Internationalization – DE / EN',
        onActivate: def.onActivate,
        onDeactivate: def.onDeactivate
    });

    try {
        window.ModuleManager.register(I18nModuleInstance);
        window.ModuleManager.activate(I18nModuleInstance.id);
    } catch (error) {
        if (window.CoreErrorHandler) {
            window.CoreErrorHandler.handle(error, { type: 'i18n-module-loader' });
        }
    }
})();
