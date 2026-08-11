/*
 * CatchTrack Core Bootstrap
 * Version: 1.0
 *
 * Letzte Initialisierungsstufe des Core.
 * Stellt sicher, dass die Core-Komponenten in der
 * vorgesehenen Reihenfolge bereitstehen.
 */

(() => {
    'use strict';

    const CoreBootstrap = {
        started: false,

        start() {
            if (this.started) {
                return;
            }

            if (!window.CatchTrackCore) {
                throw new Error('CatchTrack Core is not available.');
            }

            if (!window.CatchTrackCoreLoader) {
                throw new Error('CatchTrack Core Loader is not available.');
            }

            if (!window.CatchTrackCoreAPI) {
                throw new Error('CatchTrack Core API is not available.');
            }

            if (!window.CatchTrackCoreEvents) {
                throw new Error('CatchTrack Core Events are not available.');
            }

            if (!window.CatchTrackCoreStorage) {
                throw new Error('CatchTrack Core Storage is not available.');
            }

            if (!window.CatchTrackCoreRouter) {
                throw new Error('CatchTrack Core Router is not available.');
            }

            if (!window.CatchTrackCoreUI) {
                throw new Error('CatchTrack Core UI is not available.');
            }

            if (!window.CatchTrackCoreContext) {
                throw new Error('CatchTrack Core Context is not available.');
            }

            window.CatchTrackCoreLoader.init();

            window.CatchTrackCoreContext.setRuntimeValue(
                'initialized',
                true
            );

            window.CatchTrackCoreContext.setRuntimeValue(
                'startedAt',
                new Date().toISOString()
            );

            this.started = true;

            window.CatchTrackCoreEvents.emit('core:bootstrapped', {
                version: window.CatchTrackCoreConfig.core.version
            });
        }
    };

    window.CatchTrackCoreBootstrap = CoreBootstrap;
})();