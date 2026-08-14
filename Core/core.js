/*
 * Core
 * Version: 1.0
 *
 * Zentrale technische Grundlage für generische Anwendungen.
 * Fachliche Funktionen werden nicht im Core implementiert.
 */

(() => {
    'use strict';

    const CatchTrackCore = {
        version: '1.0.0',

        state: {
            initialized: false,
            activeModule: null
        },

        init() {
            if (this.state.initialized) {
                return;
            }

            this.state.initialized = true;

            this.emit('core:initialized', {
                version: this.version
            });
        },

        getModuleRegistry() {
            return window.CatchTrackModuleRegistry || null;
        },

        getModuleManager() {
            return window.CatchTrackModuleManager || null;
        },

        getModules() {
            if (!window.CatchTrackModuleRegistry) {
                return [];
            }

            return window.CatchTrackModuleRegistry.getAll();
        },

        on(eventName, callback) {
            if (!window.CatchTrackCoreEventBus) {
                throw new Error('CatchTrack Core Event Bus is not available.');
            }

            return window.CatchTrackCoreEventBus.subscribe(eventName, callback);
        },

        off(eventName, callback) {
            if (!window.CatchTrackCoreEventBus) {
                return;
            }

            return window.CatchTrackCoreEventBus.unsubscribe(eventName, callback);
        },

        once(eventName, callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('Event callback must be a function.');
            }

            const wrapper = (data) => {
                this.off(eventName, wrapper);
                callback(data);
            };

            return this.on(eventName, wrapper);
        },

        emit(eventName, data = null) {
            if (!window.CatchTrackCoreEventBus) {
                return;
            }

            return window.CatchTrackCoreEventBus.publish(eventName, data);
        }
    };

    window.CatchTrackCore = CatchTrackCore;

    CatchTrackCore.init();
})();
