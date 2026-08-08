"use strict";


const CatchTrackSafetyModule = {


    version: "1.0",



    init() {


        console.log(

            "CatchTrack Sicherheits Modul aktiv."

        );


        this.bindEvents();


    },



    bindEvents() {


        const button =

        document.getElementById(

            "safety-location"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.showLocation();


        };


    },



    showLocation() {


        if (

            !navigator.geolocation

        ) {


            this.displayMessage(

                "GPS nicht verfügbar."

            );


            return;


        }



        navigator.geolocation.getCurrentPosition(


            position => {


                const latitude =

                position.coords.latitude;



                const longitude =

                position.coords.longitude;



                this.displayMessage(

                    `

                    Standort:

                    ${latitude},

                    ${longitude}

                    `

                );


            },


            () => {


                this.displayMessage(

                    "Standort konnte nicht ermittelt werden."

                );


            }


        );


    },



    displayMessage(message) {


        const output =

        document.getElementById(

            "safety-result"

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
modules/safety/safety.js

Version 1.0 Final Master
==================================================
*/