/*
 * CatchTrack GPS Module Interface
 * Version: 1.0.0
 *
 * Öffentliche Schnittstelle des GPS-Moduls für den CatchTrack-Core.
 * Andere Module verwenden ausschließlich diese API.
 */

(() => {
    'use strict';

    const GpsModuleInterface = {
        name:        'gps-module',
        version:     '1.0.0',
        description: 'GPS-Positionsbestimmung und Standortbereitstellung',

        definition: {
            onActivate(moduleContext) {
                if (!window.CatchTrackGpsModule) {
                    throw new Error('CatchTrackGpsModule nicht geladen');
                }
                window.CatchTrackGpsModule.init();

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('gps-module:activated', {
                        version: moduleContext.version
                    });
                }
            },

            onDeactivate(moduleContext) {
                if (window.CatchTrackGpsModule) {
                    window.CatchTrackGpsModule.stopTracking();
                }
                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('gps-module:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            // Öffentliche GPS-API – verwendbar von anderen Modulen ohne direkten Zugriff auf gps-module.js
            api: {
                isSupported:            ()                => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.isSupported() : undefined,
                getStatus:              ()                => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.getStatus() : undefined,
                getLastPosition:        ()                => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.getLastPosition() : undefined,
                hasValidPosition:       ()                => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.hasValidPosition() : undefined,
                checkPermission:        ()                => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.checkPermission() : undefined,
                getCurrentPosition:     (opts)            => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.getCurrentPosition(opts) : undefined,
                startTracking:          (opts, upd, err)  => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.startTracking(opts, upd, err) : undefined,
                stopTracking:           ()                => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.stopTracking() : undefined,
                isTracking:             ()                => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.isTracking() : undefined,
                reverseGeocode:         (lat, lon)        => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.reverseGeocode(lat, lon) : undefined,
                setLocationInfo:        (city, prov, country) => window.CatchTrackGpsModule ? window.CatchTrackGpsModule.setLocationInfo(city, prov, country) : undefined
            }
        }
    };

    if (!window.CatchTrackGpsModuleInterface) {
        window.CatchTrackGpsModuleInterface = Object.freeze(GpsModuleInterface);
    }
})();
