/*
 * CatchTrack Core Entry API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * zentralen Einstiegspunkt des Core.
 */

(() => {
    'use strict';

    const EntryAPI = {
        start() {
            return window.CatchTrackCoreEntry.start();
        },

        stop() {
            return window.CatchTrackCoreEntry.stop();
        }
    };

    window.CatchTrackCoreEntryAPI =
        Object.freeze(EntryAPI);
})();