/*
 * CatchTrack Core Database Migration API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Datenbank-Migrationsverwaltung.
 */

(() => {
    'use strict';

    const MigrationAPI = {
        register(migration) {
            return window.CatchTrackCoreDatabaseMigration.register(
                migration
            );
        },

        unregister(migrationId) {
            return window.CatchTrackCoreDatabaseMigration.unregister(
                migrationId
            );
        },

        getPending() {
            return window.CatchTrackCoreDatabaseMigration.getPending();
        },

        getApplied() {
            return window.CatchTrackCoreDatabaseMigration.getApplied();
        },

        run() {
            return window.CatchTrackCoreDatabaseMigration.run();
        }
    };

    window.CatchTrackCoreDatabaseMigrationAPI =
        Object.freeze(MigrationAPI);
})();