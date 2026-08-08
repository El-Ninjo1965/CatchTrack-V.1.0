"use strict";


const CatchTrackGPSModule = {


    version: "1.0",



    currentPosition: null,



    init() {


        console.log(

            "CatchTrack GPS Modul aktiv."

        );


        this.bindEvents();


    },



    bindEvents() {


        const button =

        document.getElementById(

            "get-gps-position"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.getPosition();


        };


    },



    getPosition() {


        if (

            !navigator.geolocation

        ) {


            this.showMessage(

                "GPS wird nicht unterstützt."

            );


            return;


        }



        this.showMessage(

            "GPS Position wird ermittelt..."

        );



        navigator.geolocation.getCurrentPosition(


            position => {


                this.currentPosition = {


                    latitude:

                    position.coords.latitude,


                    longitude:

                    position.coords.longitude,


                    accuracy:

                    position.coords.accuracy


                };



                this.displayPosition();


            },


            error => {


                console.error(

                    "GPS Fehler:",

                    error

                );



                this.showMessage(

                    "GPS Position konnte nicht ermittelt werden."

                );


            },


            {


                enableHighAccuracy:

                true,


                timeout:

                10000,


                maximumAge:

                0


            }


        );


    },



    displayPosition() {


        const output =

        document.getElementById(

            "gps-result"

        );



        if (!output) {


            return;


        }



        output.innerHTML = `

            <p>

                Breitengrad:

                ${this.currentPosition.latitude}

            </p>


            <p>

                Längengrad:

                ${this.currentPosition.longitude}

            </p>


            <p>

                Genauigkeit:

                ${this.currentPosition.accuracy}

                Meter

            </p>

        `;


    },



    showMessage(message) {


        const output =

        document.getElementById(

            "gps-result"

        );



        if (output) {


            output.innerHTML = `

                <p>

                    ${message}

                </p>

            `;


        }


    },



    getCoordinates() {


        return this.currentPosition;


    }


};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/gps/gps.js

Version 1.0 Final Master
==================================================
*/