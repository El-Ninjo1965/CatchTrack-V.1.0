/*
 * CatchTrack Core Registry API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für das
 * zentrale Registry-System des Core.
 */

(() => {
    'use strict';

    const RegistryAPI = {
        register(type, id, value) {
            return window.CatchTrackCoreRegistry.register(
                type,
                id,
                value
            );
        },

        unregister(type, id) {
            return window.CatchTrackCoreRegistry.unregister(
                type,
                id
            );
        },

        get(type, id) {
            return window.CatchTrackCoreRegistry.get(
                type,
                id
            );
        },

        has(type, id) {
            return window.CatchTrackCoreRegistry.has(
                type,
                id
            );
        },

        getAll(type) {
            return window.CatchTrackCoreRegistry.getAll(type);
        }
    };

    window.CatchTrackCoreRegistryAPI =
        Object.freeze(RegistryAPI);
})();