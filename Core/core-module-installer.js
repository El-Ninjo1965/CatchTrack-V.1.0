/*
 * CatchTrack Core Module Installer
 * Version: 1.0
 *
 * Technische Grundlage für die spätere Installation von Modulen.
 * Die konkrete Quelle und Speicherung von Modulen wird später ergänzt.
 */

(() => {
    'use strict';

    const ModuleInstaller = {
        async install(moduleDefinition) {
            if (
                !moduleDefinition ||
                typeof moduleDefinition !== 'object'
            ) {
                throw new TypeError(
                    'Module definition is required.'
                );
            }

            if (
                !moduleDefinition.id ||
                typeof moduleDefinition.id !== 'string'
            ) {
                throw new Error('Module ID is required.');
            }

            if (
                window.CatchTrackCore?.getModule(
                    moduleDefinition.id
                )
            ) {
                throw new Error(
                    `Module already installed: ${moduleDefinition.id}`
                );
            }

            window.CatchTrackCoreModuleRegistry?.register(
                moduleDefinition
            );

            window.CatchTrackCore?.registerModule(
                moduleDefinition
            );

            window.CatchTrackCoreEvents?.emit(
                'module:installed',
                {
                    id: moduleDefinition.id
                }
            );

            return moduleDefinition;
        },

        uninstall(moduleId) {
            if (
                typeof moduleId !== 'string' ||
                !moduleId.trim()
            ) {
                throw new Error('Module ID is required.');
            }

            const removed =
                window.CatchTrackCore?.unregisterModule(moduleId);

            window.CatchTrackCoreModuleRegistry?.unregister(
                moduleId
            );

            if (removed) {
                window.CatchTrackCoreEvents?.emit(
                    'module:uninstalled',
                    {
                        id: moduleId
                    }
                );
            }

            return removed;
        }
    };

    window.CatchTrackCoreModuleInstaller =
        Object.freeze(ModuleInstaller);
})();