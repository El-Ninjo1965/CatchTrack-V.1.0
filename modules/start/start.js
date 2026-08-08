"use strict";


window.CatchTrackStartModule = {


    version: "1.0",



    init() {


        console.log(

            "Start Modul aktiv"

        );


        this.loadStatus();


    },



    loadStatus() {


        const status =

        document.getElementById(

            "catchtrack-status"

        );



        if (!status) {


            return;


        }



        let moduleCount = 0;



        if (

            window.CatchTrackModuleManager

        ) {


            moduleCount =

            CatchTrackModuleManager

            .getModules()

            .length;


        }



        let databaseStatus =

        "nicht verbunden";



        if (

            window.CatchTrack &&

            CatchTrack.database

        ) {


            databaseStatus =

            "verbunden";


        }



        status.innerHTML = `

            <p>

                System:

                bereit

            </p>


            <p>

                Module:

                ${moduleCount}

            </p>


            <p>

                Datenbank:

                ${databaseStatus}

            </p>

        `;


    }


};