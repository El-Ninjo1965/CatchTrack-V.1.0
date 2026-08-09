"use strict";

window.CatchTrack = {

    version: "2.2",

    database: null,

    config: null,

    modules: [],


    async loadMigration(version, description, path) {

        const response = await fetch(path);

        if (!response.ok) {

            throw new Error(
                `Migration ${version} konnte nicht geladen werden: ${path}`
            );

        }

        const sql =
            await response.text();

        if (!sql.trim()) {

            throw new Error(
                `Migration ${version} ist leer.`
            );

        }

        CatchTrackDatabase.registerMigration(
            version,
            description,
            database => {

                database.exec(sql);

            }
        );

    },


    async loadMigrations() {

        await this.loadMigration(
            "1",
            "Initial database structure",
            "database/migrations/001_initial.sql"
        );

        await this.loadMigration(
            "2",
            "User and privacy foundation",
            "database/migrations/002_users.sql"
        );

    },


    async init() {

        try {

            console.log(
                "CatchTrack Start"
            );


            /*
             * SQL.js laden
             */

            const SQL =
                await initSqlJs({

                    locateFile: file =>
                        "libraries/" + file

                });


            /*
             * Vorhandene Datenbank laden
             * oder neue Datenbank erstellen
             */

            this.database =
                CatchTrackDatabase.loadDatabase(
                    SQL
                );


            /*
             * Migrationen registrieren,
             * bevor die Datenbank verbunden wird.
             */

            await this.loadMigrations();


            /*
             * Database Manager verbinden.
             */

            const connected =
                CatchTrackDatabase.connect(
                    this.database
                );


            if (!connected) {

                throw new Error(
                    "Datenbank konnte nicht initialisiert werden."
                );

            }


            /*
             * Fisch-Stammdaten laden
             */

            const seedResponse =
                await fetch(
                    "database/fish_seed.sql"
                );


            if (seedResponse.ok) {

                const seed =
                    await seedResponse.text();

                if (seed.trim()) {

                    this.database.exec(
                        seed
                    );

                    CatchTrackDatabase.saveDatabase();

                }

            }


            /*
             * App-Konfiguration laden
             */

            const configResponse =
                await fetch(
                    "config/app.json"
                );


            if (!configResponse.ok) {

                throw new Error(
                    "config/app.json konnte nicht geladen werden."
                );

            }


            this.config =
                await configResponse.json();


            /*
             * Modul-Konfiguration laden
             */

            const moduleResponse =
                await fetch(
                    "config/modules.json"
                );


            if (!moduleResponse.ok) {

                throw new Error(
                    "config/modules.json konnte nicht geladen werden."
                );

            }


            const moduleData =
                await moduleResponse.json();


            this.modules =
                Array.isArray(
                    moduleData.modules
                )
                    ? moduleData.modules
                    : [];


            /*
             * Runtime Status
             *
             * Die Anwendungsversion und Umgebung
             * werden vor dem Modulstart bekanntgegeben.
             */

            if (
                window.CatchTrackRuntimeStatus
            ) {

                CatchTrackRuntimeStatus.application.version =
                    this.version;

                CatchTrackRuntimeStatus.application.environment =
                    this.config.environment ||
                    this.config.env ||
                    null;

                CatchTrackRuntimeStatus.updateStatus();

            }


            /*
             * Module Manager
             */

            if (
                window.CatchTrackModuleManager &&
                typeof
                    CatchTrackModuleManager.loadModules ===
                    "function"
            ) {

                CatchTrackModuleManager.loadModules(
                    this.modules
                );

            }


            /*
             * Start abgeschlossen
             */

            console.log(
                "CatchTrack gestartet"
            );

            console.log(
                "Datenbank-Version:",
                CatchTrackDatabase.getSchemaVersion()
            );

            console.log(
                "Ausgeführte Migrationen:",
                CatchTrackDatabase.getAppliedMigrations()
            );


            /*
             * Finaler Runtime-Status
             */

            if (
                window.CatchTrackRuntimeStatus
            ) {

                CatchTrackRuntimeStatus.updateStatus();

            }

        }

        catch (error) {

            console.error(
                "CatchTrack Fehler:",
                error
            );


            /*
             * Zentralen Error Handler verwenden.
             */

            if (
                window.CatchTrackErrorHandler &&
                typeof
                    CatchTrackErrorHandler.handle ===
                    "function"
            ) {

                CatchTrackErrorHandler.handle(
                    error,
                    "app:init"
                );

            }


            /*
             * Runtime Status über den Fehler informieren.
             */

            if (
                window.CatchTrackRuntimeStatus &&
                typeof
                    CatchTrackRuntimeStatus.registerError ===
                    "function"
            ) {

                CatchTrackRuntimeStatus.registerError({

                    level: "ERROR",

                    source: "app:init",

                    message:
                        error?.message ||
                        String(error),

                    stack:
                        error?.stack ||
                        null

                });

            }


            const app =
                document.getElementById(
                    "app"
                );


            if (app) {

                app.innerHTML =
                    "<h2>CatchTrack</h2>" +
                    "<p>" +
                    (
                        error?.message ||
                        "Unbekannter Fehler."
                    ) +
                    "</p>";

            }

        }

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrack.init();

    }
);