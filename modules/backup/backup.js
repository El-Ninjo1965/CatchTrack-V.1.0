"use strict";


const CatchTrackBackupModule = {


    version: "1.0",



    init() {


        console.log(

            "CatchTrack Backup Modul aktiv."

        );


        this.bindEvents();


    },



    bindEvents() {


        const exportButton =

        document.getElementById(

            "create-backup"

        );



        if (exportButton) {


            exportButton.onclick = () => {


                this.createBackup();


            };


        }



        const importButton =

        document.getElementById(

            "restore-backup"

        );



        if (importButton) {


            importButton.onclick = () => {


                this.restoreBackup();


            };


        }


    },



    createBackup() {


        if (

            !window.CatchTrackDatabase

        ) {


            this.showMessage(

                "Datenbank nicht verfügbar."

            );


            return;


        }



        const data =

        CatchTrackDatabase.export();



        const backup = {


            date:

            new Date().toISOString(),


            data:

            data


        };



        const file =

        new Blob(

            [

                JSON.stringify(

                    backup,

                    null,

                    2

                )

            ],

            {

                type:

                "application/json"

            }

        );



        const url =

        URL.createObjectURL(

            file

        );



        const link =

        document.createElement(

            "a"

        );



        link.href = url;


        link.download =

        "catchtrack-backup.json";



        link.click();



        URL.revokeObjectURL(

            url

        );


    },



    restoreBackup() {


        this.showMessage(

            "Wiederherstellung vorbereitet."

        );


    },



    showMessage(message) {


        const output =

        document.getElementById(

            "backup-result"

        );



        if (output) {


            output.innerHTML = `

                <p>

                    ${message}

                </p>

            `;


        }


    }


};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/backup/backup.js

Version 1.0 Final Master
==================================================
*/