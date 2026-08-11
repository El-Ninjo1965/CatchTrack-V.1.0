/*
 * CatchTrack Core Router API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Navigation zwischen Core- und Modulansichten.
 */

(() => {
    'use strict';

    const RouterAPI = {
        register(route, handler) {
            return window.CatchTrackCoreRouter.register(
                route,
                handler
            );
        },

        unregister(route) {
            return window.CatchTrackCoreRouter.unregister(
                route
            );
        },

        navigate(route, data = null) {
            return window.CatchTrackCoreRouter.navigate(
                route,
                data
            );
        },

        getCurrent() {
            return window.CatchTrackCoreRouter.getCurrent();
        },

        getRoutes() {
            return window.CatchTrackCoreRouter.getRoutes();
        }
    };

    window.CatchTrackCoreRouterAPI =
        Object.freeze(RouterAPI);
})();