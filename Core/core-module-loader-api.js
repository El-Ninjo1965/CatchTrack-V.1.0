/*
 * CatchTrack Core Module Loader API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für das Laden
 * und Entladen von Modulen.
 */

(() => {
    'use strict';

    const ModuleLoaderAPI = {
        async load(moduleDefinition) {
            if (!window.CatchTrackCoreModuleLoader) {
                throw new Error(
                    'Core Module Loader is not available.'
                );
            }

            return window.CatchTrackCoreModuleLoader.load(
                moduleDefinition
            );
        },

        async unload(moduleId) {
            if (!window.CatchTrackCoreModuleLoader) {
                throw new Error(
                    'Core Module Loader is not available.'
                );
            }

            return window.CatchTrackCoreModuleLoader.unload(
                moduleId
            );
        },

        isLoaded(moduleId) {
            if (!window.CatchTrackCoreModuleLoader) {
                return false;
            }

            return window.CatchTrackCoreModuleLoader.isLoaded(
                moduleId
            );
        }
    };

    window.CatchTrackCoreModuleLoaderAPI =
        Object.freeze(ModuleLoaderAPI);
})();