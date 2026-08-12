/*
 * CatchTrack Core
 * Version: 1.0
 *
 * Zentrale technische Grundlage der Anwendung.
 * Fachliche Funktionen werden nicht im Core implementiert.
 */

(() => {
    'use strict';

    const catchTrackEvents = new Map();

    const CatchTrackCore = {
        version: '1.0.0',

        state: {
            initialized: false,
            modules: new Map(),
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

        registerModule(module) {
            if (!module || typeof module !== 'object') {
                throw new TypeError('Invalid module definition.');
            }

            if (!module.id || typeof module.id !== 'string') {
                throw new Error('Module ID is required.');
            }

            if (this.state.modules.has(module.id)) {
                throw new Error(`Module already registered: ${module.id}`);
            }

            this.state.modules.set(module.id, module);

            this.emit('module:registered', {
                id: module.id
            });
        },

        unregisterModule(moduleId) {
            if (!this.state.modules.has(moduleId)) {
                return false;
            }

            this.state.modules.delete(moduleId);

            this.emit('module:unregistered', {
                id: moduleId
            });

            return true;
        },

        getModule(moduleId) {
            return this.state.modules.get(moduleId) || null;
        },

        getModules() {
            return Array.from(this.state.modules.values());
        },

        activateModule(moduleId) {
            const module = this.getModule(moduleId);

            if (!module) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            if (typeof module.activate === 'function') {
                module.activate();
            }

            this.state.activeModule = moduleId;

            this.emit('module:activated', {
                id: moduleId
            });
        },

        deactivateModule(moduleId) {
            const module = this.getModule(moduleId);

            if (!module) {
                return false;
            }

            if (typeof module.deactivate === 'function') {
                module.deactivate();
            }

            if (this.state.activeModule === moduleId) {
                this.state.activeModule = null;
            }

            this.emit('module:deactivated', {
                id: moduleId
            });

            return true;
        },

        on(eventName, callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('Event callback must be a function.');
            }

            if (window.CatchTrackCoreEventBus) {
                return window.CatchTrackCoreEventBus.subscribe(eventName, callback);
            }

            if (!catchTrackEvents.has(eventName)) {
                catchTrackEvents.set(eventName, new Set());
            }

            catchTrackEvents.get(eventName).add(callback);

            return () => this.off(eventName, callback);
        },

        off(eventName, callback) {
            if (window.CatchTrackCoreEventBus) {
                return window.CatchTrackCoreEventBus.unsubscribe(eventName, callback);
            }

            const listeners = catchTrackEvents.get(eventName);

            if (!listeners) {
                return;
            }

            listeners.delete(callback);

            if (listeners.size === 0) {
                catchTrackEvents.delete(eventName);
            }
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
            if (window.CatchTrackCoreEventBus) {
                return window.CatchTrackCoreEventBus.publish(eventName, data);
            }

            const listeners = catchTrackEvents.get(eventName);

            if (!listeners) {
                return;
            }

            listeners.forEach((callback) => {
                callback(data);
            });
        }
    };

    window.CatchTrackCore = CatchTrackCore;

    CatchTrackCore.init();
})();
