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
                isSupported:            ()              => window.CatchTrackGpsModule?.isSupported(),
                getStatus:              ()              => window.CatchTrackGpsModule?.getStatus(),
                getLastPosition:        ()              => window.CatchTrackGpsModule?.getLastPosition(),
                hasValidPosition:       ()              => window.CatchTrackGpsModule?.hasValidPosition(),
                checkPermission:        ()              => window.CatchTrackGpsModule?.checkPermission(),
                getCurrentPosition:     (opts)          => window.CatchTrackGpsModule?.getCurrentPosition(opts),
                startTracking:          (opts, upd, err) => window.CatchTrackGpsModule?.startTracking(opts, upd, err),
                stopTracking:           ()              => window.CatchTrackGpsModule?.stopTracking(),
                isTracking:             ()              => window.CatchTrackGpsModule?.isTracking(),
                setSimulatedPosition:   (lat, lon, opts) => window.CatchTrackGpsModule?.setSimulatedPosition(lat, lon, opts),
                clearSimulatedPosition: ()              => window.CatchTrackGpsModule?.clearSimulatedPosition(),
                isSimulated:            ()              => window.CatchTrackGpsModule?.isSimulated(),
                reverseGeocode:         (lat, lon)      => window.CatchTrackGpsModule?.reverseGeocode(lat, lon)
            }
        }
    };

    if (!window.CatchTrackGpsModuleInterface) {
        window.CatchTrackGpsModuleInterface = Object.freeze(GpsModuleInterface);
    }
})();
