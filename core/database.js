const CatchTrackDatabase = {

    version: "1.0",

    connection: null,


    init() {

        console.log(
            "CatchTrack Database Manager bereit."
        );

    },


    connect(database) {

        this.connection = database;


        console.log(
            "Datenbank verbunden."
        );


        return true;

    },


    execute(query, params = []) {

        if (!this.connection) {

            console.warn(
                "Keine Datenbankverbindung vorhanden."
            );

            return null;
        }


        console.log(
            "SQL Anfrage:",
            query,
            params
        );


        return true;

    },


    getConnection() {

        return this.connection;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackDatabase.init();

    }
);