/*
 * CatchTrack Core Migration
 * Version: 1.0
 *
 * Technische Grundlage für Datenbank-Migrationen.
 * Die eigentlichen Migrationen werden von den jeweiligen
 * Modulen bereitgestellt.
 */

(() => {
    'use strict';

    const migrations = new Map();

    const CoreMigration = {
        register(moduleId, migration) {
            if (typeof moduleId !== 'string' || !moduleId.trim()) {
                throw new Error('Module ID is required.');
            }

            if (!migration || typeof migration !== 'object') {
                throw new TypeError('Migration definition is required.');
            }

            if (typeof migration.version !== 'number') {
                throw new Error('Migration version is required.');
            }

            if (migrations.has(moduleId)) {
                throw new Error(
                    `Migrations already registered: ${moduleId}`
                );
            }

            migrations.set(moduleId, {
                ...migration
            });
        },

        get(moduleId) {
            return migrations.get(moduleId) || null;
        },

        getAll() {
            return Array.from(migrations.entries()).map(
                ([moduleId, migration]) => ({
                    moduleId,
                    ...migration
                })
            );
        },

        unregister(moduleId) {
            return migrations.delete(moduleId);
        }
    };

    window.CatchTrackCoreMigration =
        Object.freeze(CoreMigration);
})();