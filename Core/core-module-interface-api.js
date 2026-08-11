/*
 * CatchTrack Core Module Interface API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * standardisierte Kommunikation zwischen Core und Modulen.
 */

(() => {
    'use strict';

    const ModuleInterfaceAPI = {
        validate(moduleDefinition) {
            return window.CatchTrackCoreModuleInterface.validate(
                moduleDefinition
            );
        },

        create(moduleDefinition) {
            return window.CatchTrackCoreModuleInterface.create(
                moduleDefinition
            );
        },

        get(moduleId) {
            return window.CatchTrackCoreModuleInterface.get(
                moduleId
            );
        },

        getAll() {
            return window.CatchTrackCoreModuleInterface.getAll();
        }
    };

    window.CatchTrackCoreModuleInterfaceAPI =
        Object.freeze(ModuleInterfaceAPI);
})();