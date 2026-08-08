"use strict";


window.CatchTrackDatabase = {


    version: "1.1",


    database: null,


    storageKey: "catchtrack_database_v2",


    schemaVersion: 1,


    isMigrating: false,


    initialized: false,



    init() {


        console.log(

            "CatchTrack Database Manager V1.1 bereit."

        );


        this.initialized = true;


    },



    connect(db) {


        if (!db) {


            console.error(

                "Keine SQLite Datenbank übergeben."

            );


            return false;


        }



        this.database = db;



        console.log(

            "SQLite Datenbank verbunden."

        );



        this.checkDatabase();



        this.runMigrations();



        return true;


    },



    loadDatabase(SQL) {


        try {


            const saved =

            localStorage.getItem(

                this.storageKey

            );



            if (!saved) {


                console.log(

                    "Neue SQLite Datenbank erstellt."

                );


                return new SQL.Database();


            }



            const data =

            JSON.parse(

                saved

            );



            if (

                !Array.isArray(data)

                ||

                data.length === 0

            ) {


                return new SQL.Database();


            }



            const buffer =

            new Uint8Array(

                data

            );



            console.log(

                "SQLite Datenbank geladen."

            );



            return new SQL.Database(

                buffer

            );


        }


        catch(error) {


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

            !this.database

            ||

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

                    Array.from(

                        data

                    )

                )

            );



            return true;


        }


        catch(error) {


            console.error(

                "Datenbank speichern Fehler:",

                error

            );


            return false;


        }


    },



    checkDatabase() {


        if (!this.database) {


            return;


        }



        try {


            this.database.exec(

                "SELECT 1"

            );



            console.log(

                "SQLite Prüfung erfolgreich."

            );


        }


        catch(error) {


            console.error(

                "SQLite Prüfung Fehler:",

                error

            );


        }


    },



    runMigrations() {


        if (!this.database) {


            return;


        }



        this.isMigrating = true;



        try {


            this.database.run(`

                CREATE TABLE IF NOT EXISTS system (

                    id INTEGER PRIMARY KEY,

                    key TEXT UNIQUE,

                    value TEXT

                )

            `);



            const version =

            this.query(`

                SELECT value

                FROM system

                WHERE key='schema_version'

            `);



            if (

                version.length === 0

            ) {


                this.database.run(`

                    INSERT INTO system

                    (

                        key,

                        value

                    )

                    VALUES

                    (

                        'schema_version',

                        ?

                    )

                `,

                [

                    String(

                        this.schemaVersion

                    )

                ]);


            }


        }


        catch(error) {


            console.error(

                "Migration Fehler:",

                error

            );


        }



        this.isMigrating = false;



        this.saveDatabase();


    },



    execute(sql, params = []) {


        if (!this.database) {


            return null;


        }



        try {


            const result =

            this.database.run(

                sql,

                params

            );



            this.saveDatabase();



            return result;


        }


        catch(error) {


            console.error(

                "SQL Fehler:",

                error

            );


            return null;


        }


    },



    query(sql, params = []) {


        if (!this.database) {


            return [];


        }



        try {


            const statement =

            this.database.prepare(

                sql

            );



            statement.bind(

                params

            );



            const rows = [];



            while(

                statement.step()

            ) {


                rows.push(

                    statement.getAsObject()

                );


            }



            statement.free();



            return rows;


        }


        catch(error) {


            console.error(

                "Query Fehler:",

                error

            );


            return [];


        }


    },



    getConnection() {


        return this.database;


    }


};



CatchTrackDatabase.init();