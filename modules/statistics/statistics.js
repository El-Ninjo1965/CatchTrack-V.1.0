"use strict";


const CatchTrackStatisticsModule = {


    version: "1.0",


    statistics: {},



    init() {


        console.log(

            "CatchTrack Statistik Modul aktiv."

        );


        this.calculate();


    },



    calculate() {


        this.statistics = {


            totalCatches:

            0,


            totalWeight:

            0,


            biggestCatch:

            null,


            speciesCount:

            0,


            monthly:

            [],


            yearly:

            []


        };



        this.loadData();


    },



    loadData() {


        if (

            !window.CatchTrackDatabase

        ) {


            this.displayStatistics();


            return;


        }



        try {


            const catches =

            CatchTrackDatabase.query(

                `

                SELECT *

                FROM catches

                `

            );



            this.statistics.totalCatches =

            catches.length;



            this.processCatches(

                catches

            );


        }

        catch(error) {


            console.error(

                "Statistik Fehler:",

                error

            );


        }



        this.displayStatistics();


    },



    processCatches(catches) {


        let weight = 0;



        let species = [];



        catches.forEach(

            item => {


                if (

                    item.weight

                ) {


                    weight +=

                    Number(

                        item.weight

                    );


                }



                if (

                    item.species

                    &&

                    !species.includes(

                        item.species

                    )

                ) {


                    species.push(

                        item.species

                    );


                }


            }

        );



        this.statistics.totalWeight =

        weight;



        this.statistics.speciesCount =

        species.length;


    },



    displayStatistics() {


        const output =

        document.getElementById(

            "statistics-result"

        );



        if (!output) {


            return;


        }



        output.innerHTML = `

            <p>

                Fänge:

                ${this.statistics.totalCatches}

            </p>


            <p>

                Gesamtgewicht:

                ${this.statistics.totalWeight}

            </p>


            <p>

                Arten:

                ${this.statistics.speciesCount}

            </p>

        `;


    },



    getStatistics() {


        return this.statistics;


    }



};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/statistics/statistics.js

Version 1.0 Final Master
==================================================
*/