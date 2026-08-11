/*
 * CatchTrack Core Router
 * Version: 1.0
 *
 * Einfache zentrale Navigation zwischen den Bereichen
 * der Anwendung.
 */

(() => {
    'use strict';

    const CoreRouter = {
        currentRoute: null,

        routes: new Map(),

        register(route, handler) {
            if (typeof route !== 'string' || !route.trim()) {
                throw new Error('Route is required.');
            }

            if (typeof handler !== 'function') {
                throw new TypeError('Route handler must be a function.');
            }

            this.routes.set(route, handler);
        },

        navigate(route, data = null) {
            if (!this.routes.has(route)) {
                throw new Error(`Route not found: ${route}`);
            }

            this.currentRoute = route;

            const handler = this.routes.get(route);

            handler(data);

            window.CatchTrackCoreEvents?.emit('route:changed', {
                route,
                data
            });
        },

        getCurrentRoute() {
            return this.currentRoute;
        },

        has(route) {
            return this.routes.has(route);
        }
    };

    window.CatchTrackCoreRouter = CoreRouter;
})();