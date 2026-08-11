/*
 * CatchTrack Core Module Lifecycle API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * Lebenszyklus einzelner Module.
 */

(() => {
    'use strict';

    const LifecycleAPI = {
        setState(moduleId, state) {
            return window.CatchTrackCoreModuleLifecycle.setState(
                moduleId,
                state
            );
        },

        getState(moduleId) {
            return window.CatchTrackCoreModuleLifecycle.getState(
                moduleId
            );
        },

        getStates() {
            return window.CatchTrackCoreModuleLifecycle.getStates();
        },

        remove(moduleId) {
            return window.CatchTrackCoreModuleLifecycle.remove(
                moduleId
            );
        }
    };

    window.CatchTrackCoreModuleLifecycleAPI =
        Object.freeze(LifecycleAPI);
})();