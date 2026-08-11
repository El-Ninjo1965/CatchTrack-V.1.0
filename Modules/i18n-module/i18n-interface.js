/*
 * CatchTrack i18n Module Interface
 * Version: 1.0.0
 */

(() => {
    'use strict';

    const I18nModuleInterface = {
        name:        'i18n-module',
        version:     '1.0.0',
        description: 'Internationalisierung – DE / EN',

        definition: {
            onActivate(moduleContext) {
                if (!window.CatchTrackI18n) {
                    throw new Error('CatchTrackI18n nicht geladen');
                }
                window.CatchTrackI18n.init();

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('i18n:activated', {
                        version: moduleContext.version,
                        locale:  window.CatchTrackI18n.getLocale()
                    });
                }
            },

            onDeactivate(moduleContext) {
                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('i18n:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            api: {
                t:                    (key, params) => window.CatchTrackI18n ? window.CatchTrackI18n.t(key, params) : undefined,
                setLocale:            (locale)      => window.CatchTrackI18n ? window.CatchTrackI18n.setLocale(locale) : undefined,
                getLocale:            ()            => window.CatchTrackI18n ? window.CatchTrackI18n.getLocale() : undefined,
                getStoredPreference:  ()            => window.CatchTrackI18n ? window.CatchTrackI18n.getStoredPreference() : undefined,
                getSupportedLocales:  ()            => window.CatchTrackI18n ? window.CatchTrackI18n.getSupportedLocales() : undefined,
                getDeviceLocale:      ()            => window.CatchTrackI18n ? window.CatchTrackI18n.getDeviceLocale() : undefined
            }
        }
    };

    if (!window.CatchTrackI18nInterface) {
        window.CatchTrackI18nInterface = Object.freeze(I18nModuleInterface);
    }
})();
