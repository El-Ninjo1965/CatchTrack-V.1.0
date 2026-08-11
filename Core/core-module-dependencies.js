/*
 * CatchTrack Core Module Dependencies
 * Version: 1.0
 *
 * Prüft und verwaltet die technischen Abhängigkeiten
 * zwischen Modulen.
 */

(() => {
    'use strict';

    const ModuleDependencies = {
        register(moduleId, dependencies = []) {
            if (
                typeof moduleId !== 'string' ||
                !moduleId.trim()
            ) {
                throw new Error('Module ID is required.');
            }

            if (!Array.isArray(dependencies)) {
                throw new TypeError(
                    'Dependencies must be an array.'
                );
            }

            window.CatchTrackCoreDependencyManager.register(
                moduleId,
                dependencies
            );
        },

        get(moduleId) {
            return window.CatchTrackCoreDependencyManager.get(
                moduleId
            );
        },

        validate(moduleId) {
            return window.CatchTrackCoreDependencyManager.validate(
                moduleId
            );
        },

        validateAll() {
            const registered =
                window.CatchTrackCoreDependencyManager.getAll();

            return Object.keys(registered).every((moduleId) => {
                return this.validate(moduleId);
            });
        }
    };

    window.CatchTrackCoreModuleDependencies =
        Object.freeze(ModuleDependencies);
})();