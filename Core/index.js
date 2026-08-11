/*
 * CatchTrack Core Entry Point
 * Version: 1.0
 *
 * Zentraler Einstiegspunkt des Core.
 * Diese Datei wird als letzte Core-Datei geladen.
 */

(() => {
    'use strict';

    if (!window.CatchTrackCoreBootstrap) {
        throw new Error('CatchTrack Core Bootstrap is not available.');
    }

    window.CatchTrackCoreBootstrap.start();
})();