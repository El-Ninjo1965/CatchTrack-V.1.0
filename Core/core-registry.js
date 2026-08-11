/*
 * CatchTrack Core Registry
 * Version: 1.0
 *
 * Zentrale Registrierung technischer Komponenten.
 * Fachliche Daten und Modul-Funktionen gehören nicht hier hinein.
 */

(() => {
    'use strict';

    const registry = new Map();

    const CoreRegistry = {
        register(key, value) {
            if (typeof key !== 'string' || !key.trim()) {
                throw new Error('Registry key is required.');
            }

            if (value === undefined || value === null) {
                throw new Error(`Registry value is required: ${key}`);
            }

            if (registry.has(key)) {
                throw new Error(`Registry key already exists: ${key}`);
            }

            registry.set(key, value);

            window.CatchTrackCoreEvents?.emit('registry:registered', {
                key
            });
        },

        unregister(key) {
            if (!registry.has(key)) {
                return false;
            }

            registry.delete(key);

            window.CatchTrackCoreEvents?.emit('registry:unregistered', {
                key
            });

            return true;
        },

        get(key) {
            return registry.get(key) || null;
        },

        has(key) {
            return registry.has(key);
        },

        getAll() {
            return Object.fromEntries(registry.entries());
        },

        clear() {
            registry.clear();
        }
    };

    window.CatchTrackCoreRegistry = Object.freeze(CoreRegistry);
})();