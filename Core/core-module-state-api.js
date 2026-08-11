/*
 * CatchTrack Core Module State API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * Laufzeitstatus einzelner Module.
 */

(() => {
    'use strict';

    const StateAPI = {
        set(moduleId, state) {
            return window.CatchTrackCoreModuleState.set(
                moduleId,
                state
            );
        },

        get(moduleId, defaultState = null) {
            return window.CatchTrackCoreModuleState.get(
                moduleId,
                defaultState
            );
        },

        has(moduleId) {
            return window.CatchTrackCoreModuleState.has(
                moduleId
            );
        },

        remove(moduleId) {
            return window.CatchTrackCoreModuleState.remove(
                moduleId
            );
        },

        getAll() {
            return window.CatchTrackCoreModuleState.getAll();
        }
    };

    window.CatchTrackCoreModuleStateAPI =
        Object.freeze(StateAPI);
})();