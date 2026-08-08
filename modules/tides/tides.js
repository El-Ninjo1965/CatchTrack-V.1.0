"use strict";


const CatchTrackTideModule = {


    version: "1.0",


    currentTide: null,



    init() {


        console.log(

            "CatchTrack Gezeiten Modul aktiv."

        );


        this.loadTide();


    },



    loadTide() {


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


                const location = {


                    latitude:

                    position.coords.latitude,


                    longitude:

                    position.coords.longitude


                };



                this.calculateTide(

                    location

                );


            },


            () => {


                this.displayMessage(

                    "Standort konnte nicht ermittelt werden."

                );


            }


        );


    },



    calculateTide(location) {


        /*
        
        Vorbereitung:
        
        Später Integration:
        - Gezeiten API
        - Offline Tabellen
        - lokale Berechnung
        
        */



        this.currentTide = {


            location:

            location,


            status:

            "Gezeitenberechnung vorbereitet",


            nextHigh:

            null,


            nextLow:

            null


        };



        this.displayTide();


    },



    displayTide() {


        const output =

        document.getElementById(

            "tide-result"

        );



        if (!output) {


            return;


        }



        output.innerHTML = `

            <p>

                ${this.currentTide.status}

            </p>


            <p>

                GPS:

                ${this.currentTide.location.latitude},

                ${this.currentTide.location.longitude}

            </p>

        `;


    },



    getTideData() {


        return this.currentTide;


    }



};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/tide/tide.js

Version 1.0 Final Master
==================================================
*/