/*
 * CatchTrack Core Version
 * Version: 1.0
 *
 * Zentrale Versionsinformationen des Core.
 */

(() => {
    'use strict';

    const CoreVersion = Object.freeze({
        application: '1.0.0',
        core: '1.0.0',

        get() {
            return {
                application: this.application,
                core: this.core
            };
        }
    });

    window.CatchTrackCoreVersion = CoreVersion;
})();