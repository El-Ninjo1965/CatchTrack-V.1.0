/*
 * CatchTrack Weather Module Interface
 * Version: 1.0.0
 *
 * Öffentliche Schnittstelle des Weather-Moduls für den CatchTrack-Core.
 */

(() => {
    'use strict';

    const WeatherModuleInterface = {
        name:        'weather-module',
        version:     '1.0.0',
        description: 'Wetterdaten für Angelspots (Open-Meteo)',

        definition: {
            onActivate(moduleContext) {
                if (!window.CatchTrackWeatherModule) {
                    throw new Error('CatchTrackWeatherModule nicht geladen');
                }
                window.CatchTrackWeatherModule.init();

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('weather-module:activated', {
                        version: moduleContext.version
                    });
                }
            },

            onDeactivate(moduleContext) {
                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('weather-module:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            api: {
                getWeather:           (forceRefresh) => window.CatchTrackWeatherModule ? window.CatchTrackWeatherModule.getWeather(forceRefresh) : undefined,
                getLastData:          ()             => window.CatchTrackWeatherModule ? window.CatchTrackWeatherModule.getLastData() : undefined,
                getState:             ()             => window.CatchTrackWeatherModule ? window.CatchTrackWeatherModule.getState() : undefined,
                setLocation:          (lat, lon, name) => window.CatchTrackWeatherModule ? window.CatchTrackWeatherModule.setLocation(lat, lon, name) : undefined,
                getLocation:          ()             => window.CatchTrackWeatherModule ? window.CatchTrackWeatherModule.getLocation() : undefined,
                clearCache:           ()             => window.CatchTrackWeatherModule ? window.CatchTrackWeatherModule.clearCache() : undefined,
                windDirectionLabel:   (deg)          => window.CatchTrackWeatherModule ? window.CatchTrackWeatherModule.windDirectionLabel(deg) : undefined
            }
        }
    };

    if (!window.CatchTrackWeatherModuleInterface) {
        window.CatchTrackWeatherModuleInterface = Object.freeze(WeatherModuleInterface);
    }
})();
