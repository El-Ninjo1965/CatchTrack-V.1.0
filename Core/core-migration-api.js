/*
 * CatchTrack Core Migration API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für
 * Datenbank-Migrationen.
 *
 * Fachliche Tabellen und Migrationen gehören in Module.
 */

(() => {
    'use strict';

    const MigrationAPI = {
        register(migration) {
            return window.CatchTrackCoreMigration.register(
                migration
            );
        },

        unregister(migrationId) {
            return window.CatchTrackCoreMigration.unregister(
                migrationId
            );
        },

        getPending() {
            return window.CatchTrackCoreMigration.getPending();
        },

        run() {
            return window.CatchTrackCoreMigration.run();
        },

        getApplied() {
            return window.CatchTrackCoreMigration.getApplied();
        }
    };

    window.CatchTrackCoreMigrationAPI =
        Object.freeze(MigrationAPI);
})();