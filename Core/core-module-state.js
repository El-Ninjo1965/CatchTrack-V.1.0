/*
 * CatchTrack Core Module State
 * Version: 1.0
 *
 * Verwaltet den technischen Laufzeitstatus einzelner Module.
 * Fachliche Zustände bleiben innerhalb der jeweiligen Module.
 */

(() => {
    'use strict';

    const moduleStates = new Map();

    const ModuleState = {
        set(moduleId, state) {
            this.validateModuleId(moduleId);

            moduleStates.set(moduleId, state);

            window.CatchTrackCoreEvents?.emit(
                'module-state:changed',
                {
                    moduleId,
                    state
                }
            );
        },

        get(moduleId, defaultState = null) {
            this.validateModuleId(moduleId);

            return moduleStates.has(moduleId)
                ? moduleStates.get(moduleId)
                : defaultState;
        },

        has(moduleId) {
            this.validateModuleId(moduleId);

            return moduleStates.has(moduleId);
        },

        remove(moduleId) {
            this.validateModuleId(moduleId);

            return moduleStates.delete(moduleId);
        },

        getAll() {
            return Object.fromEntries(moduleStates.entries());
        },

        clear() {
            moduleStates.clear();
        },

        validateModuleId(moduleId) {
            if (
                typeof moduleId !== 'string' ||
                !moduleId.trim()
            ) {
                throw new Error('Module ID is required.');
            }
        }
    };

    window.CatchTrackCoreModuleState =
        Object.freeze(ModuleState);
})();