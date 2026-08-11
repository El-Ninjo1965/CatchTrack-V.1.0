/*
 * CatchTrack Weather Module Loader
 * Version: 1.0.0
 *
 * Registriert und aktiviert das Weather-Modul im CatchTrack-Core.
 */

(() => {
    'use strict';

    if (!window.CatchTrackCore || !window.CatchTrackModuleInterface || !window.CatchTrackModuleManager) {
        return;
    }

    if (!window.CatchTrackWeatherModuleInterface) {
        console.error('[CatchTrack] WeatherModuleInterface nicht verfügbar');
        return;
    }

    const def = window.CatchTrackWeatherModuleInterface.definition;

    const WeatherModuleInstance = window.CatchTrackModuleInterface.create({
        id:          'weather-module',
        name:        'CatchTrack Weather Module',
        version:     '1.0.0',
        description: 'Wetterdaten für Angelspots via Open-Meteo',
        onActivate:  def.onActivate,
        onDeactivate: def.onDeactivate
    });

    try {
        window.CatchTrackModuleManager.register(WeatherModuleInstance);
        window.CatchTrackModuleManager.activate(WeatherModuleInstance.id);
    } catch (error) {
        if (window.CatchTrackCoreErrorHandler) {
            window.CatchTrackCoreErrorHandler.handle(error, { type: 'weather-module-loader' });
        }
    }
})();
