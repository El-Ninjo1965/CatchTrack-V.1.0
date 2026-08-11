/*
 * CatchTrack Core Loader
 * Version: 1.0
 *
 * Koordiniert die Initialisierung der Core-Komponenten.
 */

(() => {
    'use strict';

    const CoreLoader = {
        initialized: false,

        init() {
            if (this.initialized) {
                return;
            }

            if (!window.CatchTrackCore) {
                throw new Error('CatchTrack Core is not available.');
            }

            if (!window.CatchTrackModuleManager) {
                throw new Error('CatchTrack Module Manager is not available.');
            }

            if (!window.CatchTrackModuleInterface) {
                throw new Error('CatchTrack Module Interface is not available.');
            }

            if (!window.CatchTrackErrorLog) {
                throw new Error('CatchTrack Error Log is not available.');
            }

            if (!window.CatchTrackCoreConfig) {
                throw new Error('CatchTrack Core Config is not available.');
            }

            this.initialized = true;

            window.CatchTrackCore.emit('core:ready', {
                version: window.CatchTrackCoreConfig.core.version
            });
        }
    };

    window.CatchTrackCoreLoader = CoreLoader;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CoreLoader.init();
        });
    } else {
        CoreLoader.init();
    }
})();
