/*
 * CatchTrack Module Manager
 * Version: 1.0
 *
 * Zentrale Verwaltung der Module inklusive Registrierung,
 * Aktivierung, Deaktivierung und Lifecycle-Steuerung.
 */

(() => {
    'use strict';

    const ModuleManager = {
        registry: null,

        init() {
            if (!window.CatchTrackModuleRegistry) {
                throw new Error('CatchTrack Module Registry is not available.');
            }

            this.registry = window.CatchTrackModuleRegistry;
        },

        register(module) {
            this.ensureInitialized();

            const registeredModule = this.registry.register(module);

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('module:registered', {
                    id: registeredModule.id
                });
            }

            return registeredModule;
        },

        unregister(moduleId) {
            this.ensureInitialized();

            const removed = this.registry.unregister(moduleId);

            if (removed && window.CatchTrackCore) {
                window.CatchTrackCore.emit('module:unregistered', {
                    id: moduleId
                });
            }

            return removed;
        },

        get(moduleId) {
            this.ensureInitialized();
            return this.registry.get(moduleId);
        },

        getAll() {
            this.ensureInitialized();
            return this.registry.getAll();
        },

        activate(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                throw new Error(`Module not found: ${moduleId}`);
            }

            if (typeof module.activate === 'function') {
                module.activate();
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.state.activeModule = moduleId;
                window.CatchTrackCore.emit('module:activated', {
                    id: moduleId
                });
            }

            return module;
        },

        deactivate(moduleId) {
            this.ensureInitialized();

            const module = this.get(moduleId);

            if (!module) {
                return false;
            }

            if (typeof module.deactivate === 'function') {
                module.deactivate();
            }

            if (window.CatchTrackCore && window.CatchTrackCore.state.activeModule === moduleId) {
                window.CatchTrackCore.state.activeModule = null;
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('module:deactivated', {
                    id: moduleId
                });
            }

            return true;
        },

        ensureInitialized() {
            if (!this.registry) {
                throw new Error('Module Manager is not initialized.');
            }
        }
    };

    ModuleManager.init();

    window.CatchTrackModuleManager = ModuleManager;
})();