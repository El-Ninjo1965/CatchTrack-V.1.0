/*
 * CatchTrack Core Module Manager
 * Version: 1.0
 *
 * Zentrale technische Verwaltung der Modul-Lebenszyklen.
 */

(() => {
    'use strict';

    const ModuleManager = {
        register(module) {
            const validation =
                window.CatchTrackCoreModuleValidator?.validate(
                    module
                );

            if (!validation?.valid) {
                throw new Error(
                    `Invalid module: ${validation?.errors?.join(', ') || 'Unknown error'}`
                );
            }

            window.CatchTrackCore.registerModule(module);

            window.CatchTrackCoreModuleLifecycle?.setState(
                module.id,
                window.CatchTrackCoreModuleLifecycle.states.REGISTERED
            );
        },

        activate(moduleId) {
            const module =
                window.CatchTrackCore.getModule(moduleId);

            if (!module) {
                throw new Error(
                    `Module not found: ${moduleId}`
                );
            }

            window.CatchTrackCore.activateModule(moduleId);

            window.CatchTrackCoreModuleLifecycle?.setState(
                moduleId,
                window.CatchTrackCoreModuleLifecycle.states.ACTIVE
            );
        },

        deactivate(moduleId) {
            const module =
                window.CatchTrackCore.getModule(moduleId);

            if (!module) {
                return false;
            }

            window.CatchTrackCore.deactivateModule(moduleId);

            window.CatchTrackCoreModuleLifecycle?.setState(
                moduleId,
                window.CatchTrackCoreModuleLifecycle.states.INACTIVE
            );

            return true;
        },

        remove(moduleId) {
            const removed =
                window.CatchTrackCore.unregisterModule(moduleId);

            if (removed) {
                window.CatchTrackCoreModuleLifecycle?.remove(
                    moduleId
                );

                window.CatchTrackCoreModuleState?.remove(
                    moduleId
                );

                window.CatchTrackCoreModuleConfig?.remove(
                    moduleId
                );
            }

            return removed;
        }
    };

    window.CatchTrackCoreModuleManager =
        Object.freeze(ModuleManager);
})();