/*
 * CatchTrack Core Service API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle zur Registrierung
 * und Nutzung technischer Core-Dienste.
 *
 * Fachliche Funktionen gehören in Module.
 */

(() => {
    'use strict';

    const ServiceAPI = {
        register(serviceName, service) {
            return window.CatchTrackCoreServices.register(
                serviceName,
                service
            );
        },

        unregister(serviceName) {
            return window.CatchTrackCoreServices.unregister(
                serviceName
            );
        },

        get(serviceName) {
            return window.CatchTrackCoreServices.get(
                serviceName
            );
        },

        has(serviceName) {
            return window.CatchTrackCoreServices.has(
                serviceName
            );
        },

        getAll() {
            return window.CatchTrackCoreServices.getAll();
        }
    };

    window.CatchTrackCoreServiceAPI =
        Object.freeze(ServiceAPI);
})();