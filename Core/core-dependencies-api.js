/*
 * CatchTrack Core Dependencies API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Verwaltung von Core-/Modul-Abhängigkeiten.
 */

(() => {
    'use strict';

    const DependenciesAPI = {
        register(moduleId, dependencies = []) {
            return window.CatchTrackCoreDependencyManager.register(
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

        getAll() {
            return window.CatchTrackCoreDependencyManager.getAll();
        },

        clear(moduleId) {
            return window.CatchTrackCoreDependencyManager.clear(
                moduleId
            );
        }
    };

    window.CatchTrackCoreDependenciesAPI =
        Object.freeze(DependenciesAPI);
})();