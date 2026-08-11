/*
 * CatchTrack Core Version API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für
 * Versionsinformationen des Core.
 */

(() => {
    'use strict';

    const VersionAPI = {
        get() {
            return window.CatchTrackCoreVersion.get();
        },

        getCoreVersion() {
            return window.CatchTrackCoreVersion.getCoreVersion();
        },

        getBuild() {
            return window.CatchTrackCoreVersion.getBuild();
        }
    };

    window.CatchTrackCoreVersionAPI =
        Object.freeze(VersionAPI);
})();