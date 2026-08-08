"use strict";


const CatchTrackExportModule = {


    version: "1.0",



    init() {


        console.log(

            "CatchTrack Export Modul aktiv."

        );


        this.bindEvents();


    },



    bindEvents() {


        const jsonButton =

        document.getElementById(

            "export-json"

        );



        if (jsonButton) {


            jsonButton.onclick = () => {


                this.exportJSON();


            };


        }



        const csvButton =

        document.getElementById(

            "export-csv"

        );



        if (csvButton) {


            csvButton.onclick = () => {


                this.exportCSV();


            };


        }


    },



    getData() {


        if (

            !window.CatchTrackDatabase

        ) {


            return [];


        }



        return CatchTrackDatabase.query(

            `

            SELECT *

            FROM catches

            ORDER BY date DESC

            `

        );


    },



    exportJSON() {


        const data =

        this.getData();



        this.downloadFile(

            JSON.stringify(

                data,

                null,

                2

            ),

            "catchtrack-export.json",

            "application/json"

        );


    },



    exportCSV() {


        const data =

        this.getData();



        if (!data.length) {


            return;


        }



        const headers =

        Object.keys(

            data[0]

        );



        let csv =

        headers.join(

            ","

        )

        +

        "\n";



        data.forEach(

            row => {


                csv +=

                headers.map(

                    key =>

                    `"${row[key] ?? ""}"`

                )

                .join(

                    ","

                )

                +

                "\n";


            }

        );



        this.downloadFile(

            csv,

            "catchtrack-export.csv",

            "text/csv"

        );


    },



    downloadFile(content, filename, type) {


        const blob =

        new Blob(

            [

                content

            ],

            {

                type:

                type

            }

        );



        const url =

        URL.createObjectURL(

            blob

        );



        const link =

        document.createElement(

            "a"

        );



        link.href = url;


        link.download = filename;


        link.click();



        URL.revokeObjectURL(

            url

        );


    }



};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/export/export.js

Version 1.0 Final Master
==================================================
*/