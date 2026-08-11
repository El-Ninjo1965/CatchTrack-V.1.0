/*
 * CatchTrack Module Manager
 * Version: 1.0
 *
 * Verwaltet Registrierung, Aktivierung und Deaktivierung
 * der eigenständigen CatchTrack-Module.
 */

(() => {
    'use strict';

    const ModuleManager = {
        core: null,

        init() {
            if (!window.CatchTrackCore) {
                throw new Error('CatchTrack Core is not available.');
            }

            this.core = window.CatchTrackCore;
        },

        register(module) {
            this.ensureInitialized();
            this.core.registerModule(module);
        },

        unregister(moduleId) {
            this.ensureInitialized();
            return this.core.unregisterModule(moduleId);
        },

        activate(moduleId) {
            this.ensureInitialized();
            this.core.activateModule(moduleId);
        },

        deactivate(moduleId) {
            this.ensureInitialized();
            return this.core.deactivateModule(moduleId);
        },

        get(moduleId) {
            this.ensureInitialized();
            return this.core.getModule(moduleId);
        },

        getAll() {
            this.ensureInitialized();
            return this.core.getModules();
        },

        ensureInitialized() {
            if (!this.core) {
                throw new Error('Module Manager is not initialized.');
            }
        }
    };

    ModuleManager.init();

    window.CatchTrackModuleManager = ModuleManager;
})();