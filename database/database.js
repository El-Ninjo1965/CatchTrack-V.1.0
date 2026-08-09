"use strict";


window.CatchTrackDatabase = {

    version: "3.0.0",

    database: null,

    storageKey:
        "catchtrack_database_v3",

    legacyStorageKeys: [

        "catchtrack_database_v2"

    ],

    schemaVersion: 0,

    migrations: [],

    isMigrating: false,

    initialized: false,

    freshDatabase: false,


    init() {

        this.initialized =
            true;

    },


    hasStoredDatabase() {

        try {

            if (
                localStorage.getItem(
                    this.storageKey
                )
            ) {

                return true;

            }


            return this.legacyStorageKeys.some(
                key =>
                    !!localStorage.getItem(
                        key
                    )
            );

        }

        catch (error) {

            console.warn(
                "Datenbank-Speicher konnte nicht geprüft werden.",
                error
            );

            return false;

        }

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

            throw new Error(
                "Ungültige Migration."
            );

        }


        const normalizedVersion =
            String(version);


        if (
            this.migrations.some(
                item =>
                    item.version ===
                    normalizedVersion
            )
        ) {

            return false;

        }


        this.migrations.push({

            version:
                normalizedVersion,

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


    loadDatabase(SQL) {

        try {

            let stored =
                localStorage.getItem(
                    this.storageKey
                );


            if (!stored) {

                for (
                    const key
                    of this.legacyStorageKeys
                ) {

                    stored =
                        localStorage.getItem(
                            key
                        );

                    if (stored) {

                        break;

                    }

                }

            }


            if (!stored) {

                this.freshDatabase =
                    true;

                return new SQL.Database();

            }


            const data =
                JSON.parse(stored);


            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                this.freshDatabase =
                    true;

                return new SQL.Database();

            }


            this.freshDatabase =
                false;


            return new SQL.Database(
                new Uint8Array(data)
            );

        }

        catch (error) {

            console.error(
                "Datenbank konnte nicht geladen werden.",
                error
            );


            this.freshDatabase =
                true;


            return new SQL.Database();

        }

    },


    connect(
        database,
        options = {}
    ) {

        if (!database) {

            return false;

        }


        this.database =
            database;


        this.freshDatabase =
            options.freshDatabase === true;


        try {

            this.database.exec(
                "PRAGMA foreign_keys = ON;"
            );


            if (
                this.freshDatabase &&
                options.schemaPath
            ) {

                this.loadBaseSchema(
                    options.schemaPath
                );

            }


            this.ensureMigrationTable();


            this.runMigrations();


            this.updateSchemaVersion();


            this.saveDatabase();


            return true;

        }

        catch (error) {

            console.error(
                "Datenbankinitialisierung fehlgeschlagen.",
                error
            );

            return false;

        }

    },


    loadBaseSchema(path) {

        const request =
            new XMLHttpRequest();

        request.open(
            "GET",
            path,
            false
        );

        request.send();


        if (
            request.status < 200 ||
            request.status >= 300
        ) {

            throw new Error(
                `Basisschema konnte nicht geladen werden: ${path}`
            );

        }


        const sql =
            request.responseText;


        if (!sql.trim()) {

            throw new Error(
                "Basisschema ist leer."
            );

        }


        this.database.exec(
            sql
        );


        this.markMigrationApplied(
            "1",
            "Initial database structure"
        );


        this.markMigrationApplied(
            "2",
            "User and privacy foundation"
        );

    },


    ensureMigrationTable() {

        this.database.exec(`

            CREATE TABLE IF NOT EXISTS migrations (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                version TEXT NOT NULL UNIQUE,

                description TEXT,

                applied_at DATETIME
                    NOT NULL
                    DEFAULT CURRENT_TIMESTAMP

            );

        `);


        const columns =
            this.getTableColumns(
                "migrations"
            );


        if (
            !columns.includes(
                "description"
            )
        ) {

            this.database.exec(`

                ALTER TABLE migrations
                ADD COLUMN description TEXT;

            `);

        }


        if (
            !columns.includes(
                "applied_at"
            )
        ) {

            this.database.exec(`

                ALTER TABLE migrations
                ADD COLUMN applied_at DATETIME;

            `);

        }


        return true;

    },


    getTableColumns(tableName) {

        if (!this.database) {

            return [];

        }


        const statement =
            this.database.prepare(
                `PRAGMA table_info(${tableName});`
            );


        const columns = [];


        while (
            statement.step()
        ) {

            const row =
                statement.getAsObject();

            columns.push(
                row.name
            );

        }


        statement.free();


        return columns;

    },


    markMigrationApplied(
        version,
        description
    ) {

        const statement =
            this.database.prepare(`

                INSERT OR IGNORE INTO migrations
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
            String(version),
            description || ""
        ]);


        statement.free();

    },


    hasMigration(version) {

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

    },


    runMigrations() {

        if (
            !this.database ||
            this.isMigrating
        ) {

            return false;

        }


        this.isMigrating =
            true;


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

                }

                catch (error) {

                    try {

                        this.database.run(
                            "ROLLBACK;"
                        );

                    }

                    catch (_) {}


                    throw error;

                }

            }


            this.updateSchemaVersion();


            return true;

        }

        finally {

            this.isMigrating =
                false;

        }

    },


    updateSchemaVersion() {

        const migrations =
            this.getAppliedMigrations();


        if (!migrations.length) {

            this.schemaVersion =
                0;

            return;

        }


        this.schemaVersion =
            Math.max(
                ...migrations.map(
                    item =>
                        Number(
                            item.version
                        ) || 0
                )
            );

    },


    getAppliedMigrations() {

        if (!this.database) {

            return [];

        }


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

    },


    execute(
        sql,
        params = []
    ) {

        if (!this.database) {

            throw new Error(
                "Keine Datenbankverbindung."
            );

        }


        const statement =
            this.database.prepare(
                sql
            );


        try {

            if (
                params &&
                (
                    Array.isArray(params) ||
                    typeof params === "object"
                )
            ) {

                statement.bind(
                    params
                );

            }


            statement.step();


            return statement.getAsObject();

        }

        finally {

            statement.free();

            this.saveDatabase();

        }

    },


    query(
        sql,
        params = []
    ) {

        if (!this.database) {

            return [];

        }


        const statement =
            this.database.prepare(
                sql
            );


        try {

            if (
                params &&
                (
                    Array.isArray(params) ||
                    typeof params === "object"
                )
            ) {

                statement.bind(
                    params
                );

            }


            const rows = [];


            while (
                statement.step()
            ) {

                rows.push(
                    statement.getAsObject()
                );

            }


            return rows;

        }

        finally {

            statement.free();

        }

    },


    executeScript(sql) {

        if (!this.database) {

            throw new Error(
                "Keine Datenbankverbindung."
            );

        }


        this.database.exec(
            sql
        );


        this.saveDatabase();


        return true;

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
                "Datenbank konnte nicht gespeichert werden.",
                error
            );

            return false;

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