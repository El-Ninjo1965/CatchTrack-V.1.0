/*
 * CatchTrack Core Database API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den Zugriff
 * auf die zentrale Datenbankabstraktion.
 *
 * Datenstrukturen und fachliche Daten gehören in Module.
 */

(() => {
    'use strict';

    const DatabaseAPI = {
        connect(...args) {
            return window.CatchTrackCoreDatabase.connect(
                ...args
            );
        },

        disconnect(...args) {
            return window.CatchTrackCoreDatabase.disconnect(
                ...args
            );
        },

        execute(...args) {
            return window.CatchTrackCoreDatabase.execute(
                ...args
            );
        },

        query(...args) {
            return window.CatchTrackCoreDatabase.query(
                ...args
            );
        },

        transaction(...args) {
            return window.CatchTrackCoreDatabase.transaction(
                ...args
            );
        },

        isConnected() {
            return window.CatchTrackCoreDatabase.isConnected();
        }
    };

    window.CatchTrackCoreDatabaseAPI =
        Object.freeze(DatabaseAPI);
})();