"use strict";


const CatchTrackSettingsModule = {


    version: "1.0",


    settings: {},



    init() {


        console.log(

            "CatchTrack Einstellungen Modul aktiv."

        );


        this.loadSettings();


        this.bindEvents();


    },



    loadSettings() {


        const saved =

        localStorage.getItem(

            "catchtrack_settings"

        );



        if (saved) {


            this.settings =

            JSON.parse(

                saved

            );


        }

        else {


            this.settings = {


                language:

                "de",


                units:

                "metric",


                theme:

                "light",


                notifications:

                true


            };



            this.saveSettings();


        }



        this.displaySettings();


    },



    saveSettings() {


        localStorage.setItem(

            "catchtrack_settings",

            JSON.stringify(

                this.settings

            )

        );


    },



    bindEvents() {


        const saveButton =

        document.getElementById(

            "save-settings"

        );



        if (!saveButton) {


            return;


        }



        saveButton.onclick = () => {


            this.updateSettings();


        };


    },



    updateSettings() {


        const language =

        document.getElementById(

            "settings-language"

        );



        const theme =

        document.getElementById(

            "settings-theme"

        );



        if (language) {


            this.settings.language =

            language.value;


        }



        if (theme) {


            this.settings.theme =

            theme.value;


        }



        this.saveSettings();


        this.displayMessage(

            "Einstellungen gespeichert."

        );


    },



    displaySettings() {


        const language =

        document.getElementById(

            "settings-language"

        );



        const theme =

        document.getElementById(

            "settings-theme"

        );



        if (language) {


            language.value =

            this.settings.language;


        }



        if (theme) {


            theme.value =

            this.settings.theme;


        }


    },



    displayMessage(message) {


        const output =

        document.getElementById(

            "settings-result"

        );



        if (output) {


            output.innerHTML = `

                <p>

                    ${message}

                </p>

            `;


        }


    },



    getSettings() {


        return this.settings;


    }


};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/settings/settings.js

Version 1.0 Final Master
==================================================
*/