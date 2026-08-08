"use strict";


const CatchTrackMoonModule = {


    version: "1.0",


    currentMoon: null,



    init() {


        console.log(

            "CatchTrack Mond Modul aktiv."

        );


        this.calculateMoon();


    },



    calculateMoon() {


        const date =

        new Date();



        const phase =

        this.getMoonPhase(

            date

        );



        this.currentMoon = {


            date:

            date.toISOString(),


            phase:

            phase


        };



        this.displayMoon();


    },



    getMoonPhase(date) {


        const knownNewMoon =

        new Date(

            "2000-01-06"

        );



        const days =

        (

            date -

            knownNewMoon

        )

        /

        86400000;



        const cycle =

        29.530588;



        const phase =

        (

            days %

            cycle

        )

        /

        cycle;



        if (phase < 0.03) {


            return "Neumond";


        }


        if (phase < 0.25) {


            return "Zunehmender Mond";


        }


        if (phase < 0.28) {


            return "Vollmond";


        }


        if (phase < 0.75) {


            return "Abnehmender Mond";


        }



        return "Zunehmender Mond";


    },



    displayMoon() {


        const output =

        document.getElementById(

            "moon-result"

        );



        if (!output) {


            return;


        }



        output.innerHTML = `

            <p>

                Mondphase:

                ${this.currentMoon.phase}

            </p>

        `;


    },



    getMoonData() {


        return this.currentMoon;


    }


};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/moon/moon.js

Version 1.0 Final Master
==================================================
*/