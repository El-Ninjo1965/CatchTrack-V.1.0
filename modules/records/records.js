"use strict";


const CatchTrackRecordsModule = {


    version: "1.0",


    records: [],



    init() {


        console.log(

            "CatchTrack Rekord Modul aktiv."

        );


        this.loadRecords();


    },



    loadRecords() {


        if (

            window.CatchTrackDatabase

        ) {


            try {


                this.records =

                CatchTrackDatabase.query(

                    `

                    SELECT *

                    FROM catches

                    ORDER BY weight DESC

                    LIMIT 20

                    `

                );


            }

            catch(error) {


                console.error(

                    "Rekord Fehler:",

                    error

                );


            }


        }



        this.displayRecords();


    },



    getBiggestCatch() {


        if (

            !this.records.length

        ) {


            return null;


        }



        return this.records[0];


    },



    getSpeciesRecords() {


        const species = {};



        this.records.forEach(

            item => {


                if (

                    item.species

                ) {


                    if (

                        !species[item.species]

                        ||

                        item.weight >

                        species[item.species].weight

                    ) {


                        species[item.species] = item;


                    }


                }


            }

        );



        return species;


    },



    displayRecords() {


        const output =

        document.getElementById(

            "records-result"

        );



        if (!output) {


            return;


        }



        if (!this.records.length) {


            output.innerHTML = `

                <p>

                    Keine Rekorde vorhanden.

                </p>

            `;


            return;


        }



        output.innerHTML =

        this.records.map(

            record => `

                <div>

                    ${record.species || "Unbekannt"}

                    -

                    ${record.weight || 0}

                </div>

            `

        )

        .join("");



    }



};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/records/records.js

Version 1.0 Final Master
==================================================
*/