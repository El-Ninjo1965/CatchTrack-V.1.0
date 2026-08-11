/*
 * CatchTrack Core Entry Point
 * Version: 1.0
 *
 * Zentraler Einstiegspunkt des Core.
 * Diese Datei wird als letzte Core-Datei geladen.
 */

(() => {
    'use strict';

    if (!window.CatchTrackCoreEntry) {
        throw new Error('CatchTrack Core Entry is not available.');
    }

    window.CatchTrackCoreEntry.start();
})();