/*
 * CatchTrack Core Constants
 * Version: 1.0
 *
 * Allgemeine technische Konstanten des Core.
 * Fachliche Werte gehören in die jeweiligen Module.
 */

(() => {
    'use strict';

    const CoreConstants = Object.freeze({
        events: Object.freeze({
            CORE_INITIALIZED: 'core:initialized',
            CORE_READY: 'core:ready',
            CORE_BOOTSTRAPPED: 'core:bootstrapped',

            MODULE_REGISTERED: 'module:registered',
            MODULE_UNREGISTERED: 'module:unregistered',
            MODULE_LOADED: 'module:loaded',
            MODULE_ACTIVATED: 'module:activated',
            MODULE_DEACTIVATED: 'module:deactivated',

            ROUTE_CHANGED: 'route:changed',
            LIFECYCLE_CHANGED: 'lifecycle:changed'
        }),

        storage: Object.freeze({
            PREFIX: 'catchtrack:'
        }),

        system: Object.freeze({
            DEFAULT_VERSION: '1.0.0'
        })
    });

    window.CatchTrackCoreConstants = CoreConstants;
})();