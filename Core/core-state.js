/*
 * CatchTrack Core State
 * Version: 1.0
 *
 * Zentraler Laufzeitzustand des Systems.
 * Fachliche Modulzustände gehören in die jeweiligen Module.
 */

(() => {
    'use strict';

    const state = new Map();

    const CoreState = {
        set(key, value) {
            this.validateKey(key);

            state.set(key, value);

            window.CatchTrackCoreEvents?.emit('state:changed', {
                key,
                value
            });
        },

        get(key, defaultValue = null) {
            this.validateKey(key);

            return state.has(key)
                ? state.get(key)
                : defaultValue;
        },

        has(key) {
            this.validateKey(key);

            return state.has(key);
        },

        remove(key) {
            this.validateKey(key);

            const existed = state.delete(key);

            if (existed) {
                window.CatchTrackCoreEvents?.emit('state:removed', {
                    key
                });
            }

            return existed;
        },

        getAll() {
            return Object.fromEntries(state.entries());
        },

        clear() {
            state.clear();

            window.CatchTrackCoreEvents?.emit('state:cleared');
        },

        validateKey(key) {
            if (typeof key !== 'string' || !key.trim()) {
                throw new Error('State key is required.');
            }
        }
    };

    window.CatchTrackCoreState = Object.freeze(CoreState);
})();