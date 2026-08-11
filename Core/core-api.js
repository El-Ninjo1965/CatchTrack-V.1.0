/*
 * CatchTrack Core API
 * Version: 1.0
 *
 * Öffentliche Schnittstelle zwischen Core und Modulen.
 * Module greifen über diese API auf Core-Funktionen zu.
 */

(() => {
    'use strict';

    const CoreAPI = {
        getVersion() {
            return window.CatchTrackCoreConfig.application.version;
        },

        getCoreVersion() {
            return window.CatchTrackCoreConfig.core.version;
        },

        registerModule(module) {
            return window.CatchTrackModuleManager.register(module);
        },

        unregisterModule(moduleId) {
            return window.CatchTrackModuleManager.unregister(moduleId);
        },

        activateModule(moduleId) {
            return window.CatchTrackModuleManager.activate(moduleId);
        },

        deactivateModule(moduleId) {
            return window.CatchTrackModuleManager.deactivate(moduleId);
        },

        getModule(moduleId) {
            return window.CatchTrackModuleManager.get(moduleId);
        },

        getModules() {
            return window.CatchTrackModuleManager.getAll();
        },

        logError(error, context = {}) {
            return window.CatchTrackErrorLog.record(error, context);
        },

        getErrors() {
            return window.CatchTrackErrorLog.getAll();
        }
    };

    window.CatchTrackCoreAPI = Object.freeze(CoreAPI);
})();