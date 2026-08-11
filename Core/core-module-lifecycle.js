/*
 * CatchTrack Core Module Lifecycle
 * Version: 1.0
 *
 * Technische Verwaltung des Lebenszyklus einzelner Module.
 */

(() => {
    'use strict';

    const states = Object.freeze({
        REGISTERED: 'registered',
        LOADED: 'loaded',
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        ERROR: 'error'
    });

    const moduleStates = new Map();

    const ModuleLifecycle = {
        states,

        setState(moduleId, state) {
            this.validateModuleId(moduleId);

            if (!Object.values(states).includes(state)) {
                throw new Error(
                    `Invalid module lifecycle state: ${state}`
                );
            }

            const previousState =
                moduleStates.get(moduleId) || null;

            moduleStates.set(moduleId, state);

            window.CatchTrackCoreEvents?.emit(
                'module-lifecycle:changed',
                {
                    moduleId,
                    previousState,
                    state
                }
            );
        },

        getState(moduleId) {
            this.validateModuleId(moduleId);

            return moduleStates.get(moduleId) || null;
        },

        is(moduleId, state) {
            return this.getState(moduleId) === state;
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

    window.CatchTrackCoreModuleLifecycle =
        Object.freeze(ModuleLifecycle);
})();