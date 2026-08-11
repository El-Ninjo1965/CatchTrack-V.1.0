/*
 * CatchTrack Core Configuration
 * Version: 1.0
 *
 * Zentrale, unveränderliche Grundeinstellungen des Core.
 * Modulspezifische Einstellungen gehören nicht hier hinein.
 */

(() => {
    'use strict';

    const CoreConfig = Object.freeze({
        application: Object.freeze({
            name: 'CatchTrack',
            version: '1.0.0'
        }),

        core: Object.freeze({
            version: '1.0.0'
        })
    });

    if (!window.CatchTrackCoreConfig) {
        window.CatchTrackCoreConfig = CoreConfig;
    }
})();
