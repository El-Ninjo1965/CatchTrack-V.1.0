/*
 * CatchTrack i18n Module Loader
 * Version: 1.0.0
 */

(() => {
    'use strict';

    if (!window.CatchTrackCore || !window.CatchTrackModuleInterface || !window.CatchTrackModuleManager) {
        return;
    }

    if (!window.CatchTrackI18nInterface) {
        console.error('[CatchTrack] I18nModuleInterface nicht verfügbar');
        return;
    }

    const def = window.CatchTrackI18nInterface.definition;

    const I18nModuleInstance = window.CatchTrackModuleInterface.create({
        id:           'i18n-module',
        name:         'CatchTrack i18n Module',
        version:      '1.0.0',
        description:  'Internationalisierung – DE / EN',
        onActivate:   def.onActivate,
        onDeactivate: def.onDeactivate
    });

    try {
        window.CatchTrackModuleManager.register(I18nModuleInstance);
        window.CatchTrackModuleManager.activate(I18nModuleInstance.id);
    } catch (error) {
        window.CatchTrackCoreErrorHandler?.handle(error, { type: 'i18n-module-loader' });
    }
})();
