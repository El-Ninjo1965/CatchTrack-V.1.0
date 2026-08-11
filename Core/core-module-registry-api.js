/*
 * CatchTrack Core Module Registry API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle zur Abfrage
 * des Modul-Registers.
 */

(() => {
    'use strict';

    const RegistryAPI = {
        register(moduleDefinition) {
            return window.CatchTrackCoreModuleRegistry.register(
                moduleDefinition
            );
        },

        unregister(moduleId) {
            return window.CatchTrackCoreModuleRegistry.unregister(
                moduleId
            );
        },

        get(moduleId) {
            return window.CatchTrackCoreModuleRegistry.get(
                moduleId
            );
        },

        getAll() {
            return window.CatchTrackCoreModuleRegistry.getAll();
        },

        has(moduleId) {
            return window.CatchTrackCoreModuleRegistry.has(
                moduleId
            );
        }
    };

    window.CatchTrackCoreModuleRegistryAPI =
        Object.freeze(RegistryAPI);
})();