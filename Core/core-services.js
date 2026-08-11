/*
 * CatchTrack Core Services
 * Version: 1.0
 *
 * Zentrale Registrierung technischer Services.
 * Fachliche Services werden nicht im Core implementiert.
 */

(() => {
    'use strict';

    const services = new Map();

    const CoreServices = {
        register(name, service) {
            if (typeof name !== 'string' || !name.trim()) {
                throw new Error('Service name is required.');
            }

            if (!service) {
                throw new Error(`Service is required: ${name}`);
            }

            if (services.has(name)) {
                throw new Error(`Service already registered: ${name}`);
            }

            services.set(name, service);

            window.CatchTrackCoreEvents?.emit('service:registered', {
                name
            });
        },

        unregister(name) {
            if (!services.has(name)) {
                return false;
            }

            services.delete(name);

            window.CatchTrackCoreEvents?.emit('service:unregistered', {
                name
            });

            return true;
        },

        get(name) {
            return services.get(name) || null;
        },

        has(name) {
            return services.has(name);
        },

        getAll() {
            return Object.fromEntries(services.entries());
        }
    };

    window.CatchTrackCoreServices = Object.freeze(CoreServices);
})();