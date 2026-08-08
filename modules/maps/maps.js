"use strict";


const CatchTrackMapsModule = {


    version: "1.0",


    map: null,


    currentMarker: null,



    init() {


        console.log(

            "CatchTrack Karten Modul aktiv."

        );


        this.bindEvents();


    },



    bindEvents() {


        const button =

        document.getElementById(

            "load-map-position"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.showCurrentPosition();


        };


    },



    showCurrentPosition() {


        if (

            !window.CatchTrackGPSModule

        ) {


            this.showMessage(

                "GPS Modul nicht verfügbar."

            );


            return;


        }



        const position =

        CatchTrackGPSModule

        .getCoordinates();



        if (!position) {


            this.showMessage(

                "Keine GPS Position vorhanden."

            );


            return;


        }



        this.displayCoordinates(

            position

        );


    },



    displayCoordinates(position) {


        const output =

        document.getElementById(

            "map-result"

        );



        if (!output) {


            return;


        }



        output.innerHTML = `

            <p>

                Position:

                ${position.latitude},

                ${position.longitude}

            </p>


            <a

                href="https://maps.google.com/?q=${position.latitude},${position.longitude}"

                target="_blank"

            >

                In Google Maps öffnen

            </a>

        `;


    },



    addCatchMarker(catchData) {


        console.log(

            "Fang Marker vorbereitet:",

            catchData

        );


        // Vorbereitung für Kartenbibliothek

        // z.B. Leaflet / OpenStreetMap

    },



    showMessage(message) {


        const output =

        document.getElementById(

            "map-result"

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
modules/maps/maps.js

Version 1.0 Final Master
==================================================
*/