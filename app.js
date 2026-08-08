"use strict";

/*
 * CatchTrack Database Manager
 * Version 2.1
 *
 * Zentrale SQLite-Datenbank
 * Versioniertes Migrationssystem
 * Browser-localStorage Persistenz
 */

window.CatchTrackDatabase = {

    version: "2.1",

    database: null,

    storageKey: "catchtrack_database_v2",

    schemaVersion: 0,

    migrations: [],

    isMigrating: false,

    initialized: false,


    init() {

        this.initialized = true;

        console.log(
            "CatchTrack Database Manager V2.1 bereit."
        );

    },


    registerMigration(
        version,
        description,
        migration
    ) {

        if (
            version === undefined ||
            version === null ||
            typeof migration !== "function"
        ) {

            console.error(
                "Ungültige Migration."
            );

            return false;

        }

        const migrationVersion =
            String(version);

        if (
            this.migrations.some(
                item =>
                    item.version === migrationVersion
            )
        ) {

            return false;

        }

        this.migrations.push({

            version: migrationVersion,

            description:
                description || "",

            migration

        });

        this.migrations.sort(
            (a, b) =>
                Number(a.version) -
                Number(b.version)
        );

        return true;

    },


    connect(db) {

        if (!db) {

            console.error(
                "Keine SQLite-Datenbank übergeben."
            );

            return false;

        }

        this.database = db;

        console.log(
            "SQLite-Datenbank verbunden."
        );

        if (!this.checkDatabase()) {

            return false;

        }

        if (!this.ensureMigrationTable()) {

            return false;

        }

        return this.runMigrations();

    },


    loadDatabase(SQL) {

        try {

            const saved =
                localStorage.getItem(
                    this.storageKey
                );

            if (!saved) {

                console.log(
                    "Neue SQLite-Datenbank erstellt."
                );

                return new SQL.Database();

            }

            const data =
                JSON.parse(saved);

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                console.log(
                    "Ungültige gespeicherte Datenbank. Neue Datenbank wird erstellt."
                );

                return new SQL.Database();

            }

            const buffer =
                new Uint8Array(data);

            console.log(
                "SQLite-Datenbank geladen."
            );

            return new SQL.Database(
                buffer
            );

        }

        catch (error) {

            console.error(
                "Datenbank laden Fehler:",
                error
            );

            localStorage.removeItem(
                this.storageKey
            );

            return new SQL.Database();

        }

    },


    saveDatabase() {

        if (
            !this.database ||
            this.isMigrating
        ) {

            return false;

        }

        try {

            const data =
                this.database.export();

            localStorage.setItem(

                this.storageKey,

                JSON.stringify(
                    Array.from(data)
                )

            );

            return true;

        }

        catch (error) {

            console.error(
                "Datenbank speichern Fehler:",
                error
            );

            return false;

        }

    },


    checkDatabase() {

        if (!this.database) {

            return false;

        }

        try {

            this.database.exec(
                "SELECT 1;"
            );

            return true;

        }

        catch (error) {

            console.error(
                "SQLite-Prüfung Fehler:",
                error
            );

            return false;

        }

    },


    ensureMigrationTable() {

        if (!this.database) {

            return false;

        }

        try {

            this.database.run(`

                CREATE TABLE IF NOT EXISTS migrations (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    version TEXT NOT NULL UNIQUE,

                    description TEXT,

                    applied_at DATETIME
                        NOT NULL
                        DEFAULT CURRENT_TIMESTAMP

                );

            `);

            return true;

        }

        catch (error) {

            console.error(
                "Migrationstabelle Fehler:",
                error
            );

            return false;

        }

    },


    getAppliedMigrations() {

        if (!this.database) {

            return [];

        }

        try {

            const statement =
                this.database.prepare(`

                    SELECT
                        version,
                        description,
                        applied_at

                    FROM migrations

                    ORDER BY
                        CAST(version AS INTEGER);

                `);

            const rows = [];

            while (
                statement.step()
            ) {

                rows.push(
                    statement.getAsObject()
                );

            }

            statement.free();

            return rows;

        }

        catch (error) {

            console.error(
                "Migrationen lesen Fehler:",
                error
            );

            return [];

        }

    },


    hasMigration(version) {

        if (!this.database) {

            return false;

        }

        try {

            const statement =
                this.database.prepare(`

                    SELECT id

                    FROM migrations

                    WHERE version = ?

                    LIMIT 1;

                `);

            statement.bind([
                String(version)
            ]);

            const exists =
                statement.step();

            statement.free();

            return exists;

        }

        catch (error) {

            console.error(
                "Migration-Prüfung Fehler:",
                error
            );

            return false;

        }

    },


    runMigrations() {

        if (
            !this.database ||
            this.isMigrating
        ) {

            return false;

        }

        this.isMigrating = true;

        let success = true;

        try {

            this.ensureMigrationTable();

            for (
                const migration
                of this.migrations
            ) {

                if (
                    this.hasMigration(
                        migration.version
                    )
                ) {

                    continue;

                }

                console.log(

                    "Migration wird ausgeführt:",

                    migration.version,

                    migration.description

                );

                this.database.run(
                    "BEGIN TRANSACTION;"
                );

                try {

                    migration.migration(
                        this.database
                    );

                    const statement =
                        this.database.prepare(`

                            INSERT INTO migrations
                            (
                                version,
                                description
                            )

                            VALUES
                            (
                                ?,
                                ?
                            );

                        `);

                    statement.run([
                        migration.version,
                        migration.description
                    ]);

                    statement.free();

                    this.database.run(
                        "COMMIT;"
                    );

                    console.log(

                        "Migration erfolgreich:",

                        migration.version

                    );

                }

                catch (migrationError) {

                    try {

                        this.database.run(
                            "ROLLBACK;"
                        );

                    }
                    catch (_) {}

                    throw migrationError;

                }

            }

            this.updateSchemaVersion();

        }

        catch (error) {

            success = false;

            console.error(
                "Migration Fehler:",
                error
            );

        }

        this.isMigrating = false;

        this.saveDatabase();

        return success;

    },


    updateSchemaVersion() {

        const migrations =
            this.getAppliedMigrations();

        if (
            !migrations.length
        ) {

            this.schemaVersion = 0;

            return;

        }

        const versions =
            migrations.map(
                migration =>
                    Number(
                        migration.version
                    )
            );

        this.schemaVersion =
            Math.max(...versions);

    },


    execute(
        sql,
        params = []
    ) {

        if (!this.database) {

            return null;

        }

        try {

            const statement =
                this.database.prepare(
                    sql
                );

            if (
                Array.isArray(params) &&
                params.length > 0
            ) {

                statement.bind(params);

            }

            statement.step();

            const result =
                statement.getAsObject();

            statement.free();

            this.saveDatabase();

            return result;

        }

        catch (error) {

            console.error(
                "SQL-Fehler:",
                error
            );

            return null;

        }

    },


    query(
        sql,
        params = []
    ) {

        if (!this.database) {

            return [];

        }

        let statement = null;

        try {

            statement =
                this.database.prepare(
                    sql
                );

            if (
                Array.isArray(params) &&
                params.length > 0
            ) {

                statement.bind(params);

            }

            const rows = [];

            while (
                statement.step()
            ) {

                rows.push(
                    statement.getAsObject()
                );

            }

            statement.free();

            return rows;

        }

        catch (error) {

            if (statement) {

                try {

                    statement.free();

                }
                catch (_) {}

            }

            console.error(
                "Query-Fehler:",
                error
            );

            return [];

        }

    },


    getSchemaVersion() {

        this.updateSchemaVersion();

        return this.schemaVersion;

    },


    getConnection() {

        return this.database;

    },


    isReady() {

        return (
            this.initialized &&
            !!this.database
        );

    }

};


CatchTrackDatabase.init();