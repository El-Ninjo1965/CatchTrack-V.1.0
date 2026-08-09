"use strict";


const CatchTrackWeatherModule = {


    version: "1.0",


    currentWeather: null,



    init() {


        console.log(

            "CatchTrack Wetter Modul aktiv."

        );


        this.bindEvents();


    },



    bindEvents() {


        const button =

        document.getElementById(

            "load-weather"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.loadWeather();


        };


    },



    loadWeather() {


        if (

            !navigator.geolocation

        ) {


            this.showMessage(

                "GPS nicht verfügbar."

            );


            return;


        }



        navigator.geolocation.getCurrentPosition(


            position => {


                const coordinates = {


                    latitude:

                    position.coords.latitude,


                    longitude:

                    position.coords.longitude


                };



                this.getWeatherData(

                    coordinates

                );


            },


            () => {


                this.showMessage(

                    "Standort konnte nicht bestimmt werden."

                );


            }


        );


    },



    async getWeatherData(position) {


        /*
        
        Vorbereitung:
        
        Hier wird später ein Wetterdienst
        angebunden.

        Offline Cache vorbereitet.

        */


        this.currentWeather = {


            temperature:

            null,


            pressure:

            null,


            clouds:

            null,


            location:

            position


        };



        this.displayWeather();


    },



    displayWeather() {


        const output =

        document.getElementById(

            "weather-result"

        );



        if (!output) {


            return;


        }



        output.innerHTML = `

            <p>

                Wetterdaten vorbereitet.

            </p>


            <p>

                GPS:

                ${this.currentWeather.location.latitude},

                ${this.currentWeather.location.longitude}

            </p>

        `;


    },



    showMessage(message) {


        const output =

        document.getElementById(

            "weather-result"

        );



        if (output) {


            output.innerHTML = `

                <p>

                    ${message}

                </p>

            `;


        }


    },



    getWeather() {


        return this.currentWeather;


    }


};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/weather/weather.js

Version 1.0 Final-Master
==================================================
*/