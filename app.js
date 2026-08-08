"use strict";

window.CatchTrack = {

    version: "2.0",

    database: null,

    config: null,

    modules: [],


    async init() {

        try {

            console.log(
                "CatchTrack Start"
            );


            /*
             * SQLite initialisieren
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
             * Database Manager verbinden
             *
             * Der Database Manager übernimmt
             * ab hier die Migrationen.
             */

            CatchTrackDatabase.connect(
                this.database
            );


            /*
             * Fischdaten laden
             *
             * fish_seed.sql enthält nur
             * Stammdaten und gehört nicht
             * zum eigentlichen Schema.
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
             * Module Manager
             */

            if (
                window.CatchTrackModuleManager &&
                typeof
                CatchTrackModuleManager.loadModules
                === "function"
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


        }

        catch(error) {

            console.error(
                "CatchTrack Fehler:",
                error
            );


            const app =
                document.getElementById(
                    "app"
                );


            if (app) {

                app.innerHTML =

                    "<h2>CatchTrack</h2>" +

                    "<p>" +

                    error.message +

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