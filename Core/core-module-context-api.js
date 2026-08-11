/*
 * CatchTrack Core Module Context API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Bereitstellung des Modul-Kontexts.
 */

(() => {
    'use strict';

    const ModuleContextAPI = {
        create(moduleId) {
            return window.CatchTrackCoreModuleContext.create(
                moduleId
            );
        },

        get(moduleId) {
            return window.CatchTrackCoreModuleContext.get(
                moduleId
            );
        },

        remove(moduleId) {
            return window.CatchTrackCoreModuleContext.remove(
                moduleId
            );
        },

        clear() {
            return window.CatchTrackCoreModuleContext.clear();
        }
    };

    window.CatchTrackCoreModuleContextAPI =
        Object.freeze(ModuleContextAPI);
})();