/*
 * CatchTrack GPS Module Loader
 * Version: 1.0.0
 *
 * Registriert und aktiviert das GPS-Modul im CatchTrack-Core.
 */

(() => {
    'use strict';

    if (!window.CatchTrackCore || !window.CatchTrackModuleInterface || !window.CatchTrackModuleManager) {
        return;
    }

    if (!window.CatchTrackGpsModuleInterface) {
        console.error('[CatchTrack] GpsModuleInterface nicht verfügbar');
        return;
    }

    const def = window.CatchTrackGpsModuleInterface.definition;

    const GpsModuleInstance = window.CatchTrackModuleInterface.create({
        id:           'gps-module',
        name:         'CatchTrack GPS Module',
        version:      '1.0.0',
        description:  'GPS-Positionsbestimmung via Browser Geolocation API',
        onActivate:   def.onActivate,
        onDeactivate: def.onDeactivate
    });

    try {
        window.CatchTrackModuleManager.register(GpsModuleInstance);
        window.CatchTrackModuleManager.activate(GpsModuleInstance.id);
    } catch (error) {
        window.CatchTrackCoreErrorHandler?.handle(error, { type: 'gps-module-loader' });
    }
})();
