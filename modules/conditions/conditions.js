"use strict";


const CatchTrackConditionsModule = {


    version: "1.0",


    conditions: {},



    init() {


        console.log(

            "CatchTrack Bedingungen Modul aktiv."

        );


        this.loadConditions();


    },



    loadConditions() {


        this.conditions = {


            temperature:

            null,


            pressure:

            null,


            wind:

            null,


            moon:

            null,


            tide:

            null,


            score:

            null


        };



        this.displayConditions();


    },



    calculateScore() {


        /*
        
        Vorbereitung:
        
        Später:
        - Wetterdaten
        - Luftdrucktrend
        - Mondphase
        - Tide
        - Fischart
        
        */


        let score = 0;



        if (

            this.conditions.temperature

        ) {


            score += 1;


        }



        if (

            this.conditions.pressure

        ) {


            score += 1;


        }



        this.conditions.score = score;



        return score;


    },



    displayConditions() {


        const output =

        document.getElementById(

            "conditions-result"

        );



        if (!output) {


            return;


        }



        output.innerHTML = `

            <p>

                Angelbedingungen vorbereitet.

            </p>


            <p>

                Bewertung:

                ${this.calculateScore()}

            </p>

        `;


    },



    getConditions() {


        return this.conditions;


    }



};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/conditions/conditions.js

Version 1.0 Final Master
==================================================
*/