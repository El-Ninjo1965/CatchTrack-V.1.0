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
                getWeather:           (forceRefresh) => window.CatchTrackWeatherModule?.getWeather(forceRefresh),
                getLastData:          ()             => window.CatchTrackWeatherModule?.getLastData(),
                getState:             ()             => window.CatchTrackWeatherModule?.getState(),
                setLocation:          (lat, lon, name) => window.CatchTrackWeatherModule?.setLocation(lat, lon, name),
                getLocation:          ()             => window.CatchTrackWeatherModule?.getLocation(),
                clearCache:           ()             => window.CatchTrackWeatherModule?.clearCache(),
                windDirectionLabel:   (deg)          => window.CatchTrackWeatherModule?.windDirectionLabel(deg)
            }
        }
    };

    if (!window.CatchTrackWeatherModuleInterface) {
        window.CatchTrackWeatherModuleInterface = Object.freeze(WeatherModuleInterface);
    }
})();
