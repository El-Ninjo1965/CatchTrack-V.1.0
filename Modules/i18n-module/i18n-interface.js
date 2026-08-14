/*
 * Generic i18n Module Interface
 * Version: 1.0.0
 */

(() => {
    'use strict';

    const I18nModuleInterface = {
        name: 'i18n-module',
        version: '1.0.0',
        description: 'Internationalization – DE / EN',

        definition: {
            onActivate(moduleContext) {
                if (!window.I18nModule) {
                    throw new Error('I18nModule not loaded');
                }

                window.I18nModule.init();

                if (window.Core) {
                    window.Core.emit('i18n:activated', {
                        version: moduleContext && moduleContext.version,
                        locale: window.I18nModule.getLocale()
                    });
                }
            },

            onDeactivate() {
                if (window.Core) {
                    window.Core.emit('i18n:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            api: {
                t: (key, params) => window.I18nModule ? window.I18nModule.t(key, params) : undefined,
                setLocale: (locale) => window.I18nModule ? window.I18nModule.setLocale(locale) : undefined,
                getLocale: () => window.I18nModule ? window.I18nModule.getLocale() : undefined,
                getStoredPreference: () => window.I18nModule ? window.I18nModule.getStoredPreference() : undefined,
                getSupportedLocales: () => window.I18nModule ? window.I18nModule.getSupportedLocales() : undefined,
                getDeviceLocale: () => window.I18nModule ? window.I18nModule.getDeviceLocale() : undefined
            }
        }
    };

    if (!window.I18nModuleInterface) {
        window.I18nModuleInterface = Object.freeze(I18nModuleInterface);
    }
})();
