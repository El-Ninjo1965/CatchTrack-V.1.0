/*
 * CatchTrack Core Context
 * Version: 1.0
 *
 * Gemeinsamer Laufzeitkontext für Core und Module.
 * Enthält ausschließlich allgemeine Systeminformationen.
 */

(() => {
    'use strict';

    const context = {
        application: {
            name: 'CatchTrack',
            version: '1.0.0'
        },

        runtime: {
            initialized: false,
            startedAt: null
        },

        environment: {
            online: navigator.onLine,
            language: navigator.language || 'en',
            platform: navigator.platform || ''
        }
    };

    const CoreContext = {
        get() {
            return context;
        },

        setRuntimeValue(key, value) {
            if (typeof key !== 'string' || !key.trim()) {
                throw new Error('Runtime context key is required.');
            }

            context.runtime[key] = value;
        },

        updateOnlineState() {
            context.environment.online = navigator.onLine;
        }
    };

    window.addEventListener('online', () => {
        CoreContext.updateOnlineState();
    });

    window.addEventListener('offline', () => {
        CoreContext.updateOnlineState();
    });

    window.CatchTrackCoreContext = Object.freeze(CoreContext);
})();
