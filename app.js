"use strict";


window.CatchTrack = {


    version: "1.0",


    database: null,


    config: null,


    modules: [],



    async init() {


        try {


            console.log(
                "CatchTrack Start"
            );



            const SQL =

            await initSqlJs({

                locateFile: file =>
                "libraries/" + file

            });



            this.database =

            CatchTrackDatabase.loadDatabase(

                SQL

            );



            CatchTrackDatabase.connect(

                this.database

            );



            const schema =

            await (

                await fetch(

                    "database/schema.sql"

                )

            ).text();



            this.database.exec(

                schema

            );



            const seed =

            await (

                await fetch(

                    "database/fish_seed.sql"

                )

            ).text();



            this.database.exec(

                seed

            );



            const configResponse =

            await fetch(

                "config/app.json"

            );



            this.config =

            await configResponse.json();



            const moduleResponse =

            await fetch(

                "config/modules.json"

            );



            const moduleData =

            await moduleResponse.json();



            this.modules =

            moduleData.modules;



            CatchTrackModuleManager.loadModules(

                this.modules

            );



            console.log(

                "CatchTrack gestartet"

            );


        }


        catch(error) {


            console.error(

                "CatchTrack Fehler:",

                error

            );


            document.getElementById(

                "app"

            ).innerHTML =

            "<h2>CatchTrack</h2><p>"

            +

            error.message

            +

            "</p>";

        }


    }


};



document.addEventListener(

    "DOMContentLoaded",

    () => {

        CatchTrack.init();

    }

);