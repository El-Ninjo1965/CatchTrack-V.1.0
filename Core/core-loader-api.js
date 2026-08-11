/*
 * CatchTrack Core Loader API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * kontrollierten Start und das Laden des Core.
 */

(() => {
    'use strict';

    const LoaderAPI = {
        init() {
            return window.CatchTrackCoreLoader.init();
        },

        loadScript(src) {
            return window.CatchTrackCoreLoader.loadScript(src);
        },

        loadScripts(sources = []) {
            return window.CatchTrackCoreLoader.loadScripts(
                sources
            );
        },

        isLoaded(src) {
            return window.CatchTrackCoreLoader.isLoaded(src);
        },

        getLoaded() {
            return window.CatchTrackCoreLoader.getLoaded();
        }
    };

    window.CatchTrackCoreLoaderAPI =
        Object.freeze(LoaderAPI);
})();