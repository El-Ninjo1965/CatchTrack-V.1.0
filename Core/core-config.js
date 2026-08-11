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
        }),

        modules: Object.freeze({
            directory: 'Modules'
        }),

        development: Object.freeze({
            enabled: true
        })
    });

    window.CatchTrackCoreConfig = CoreConfig;
})();