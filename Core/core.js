/*
 * CatchTrack Core
 * Version: 1.0
 *
 * Zentrale technische Grundlage der Anwendung.
 * Fachliche Funktionen werden nicht im Core implementiert.
 */

(() => {
    'use strict';

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

        events: new Map(),

        on(eventName, callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('Event callback must be a function.');
            }

            if (!this.events.has(eventName)) {
                this.events.set(eventName, new Set());
            }

            this.events.get(eventName).add(callback);

            return () => this.off(eventName, callback);
        },

        off(eventName, callback) {
            const listeners = this.events.get(eventName);

            if (!listeners) {
                return;
            }

            listeners.delete(callback);

            if (listeners.size === 0) {
                this.events.delete(eventName);
            }
        },

        emit(eventName, data = null) {
            const listeners = this.events.get(eventName);

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