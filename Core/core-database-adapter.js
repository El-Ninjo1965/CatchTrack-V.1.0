/*
 * CatchTrack Core Database Adapter
 * Version: 1.0
 *
 * Einheitliche Adapter-Schnittstelle für die lokale Datenbank.
 * Die konkrete Implementierung wird später, beispielsweise über
 * SQLite/sql.js, bereitgestellt.
 */

(() => {
    'use strict';

    const DatabaseAdapter = {
        async execute() {
            throw new Error(
                'Database adapter execute() is not implemented.'
            );
        },

        async query() {
            throw new Error(
                'Database adapter query() is not implemented.'
            );
        },

        async transaction() {
            throw new Error(
                'Database adapter transaction() is not implemented.'
            );
        }
    };

    window.CatchTrackCoreDatabaseAdapter =
        Object.freeze(DatabaseAdapter);
})();