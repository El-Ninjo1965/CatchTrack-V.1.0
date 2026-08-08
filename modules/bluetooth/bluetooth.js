"use strict";


const CatchTrackBluetoothModule = {


    version: "1.0",


    device: null,


    connected: false,



    init() {


        console.log(

            "CatchTrack Bluetooth Modul aktiv."

        );


        this.bindEvents();


    },



    bindEvents() {


        const button =

        document.getElementById(

            "bluetooth-connect"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.connect();


        };


    },



    async connect() {


        if (

            !navigator.bluetooth

        ) {


            this.displayMessage(

                "Bluetooth wird nicht unterstützt."

            );


            return;


        }



        try {


            this.device =

            await navigator.bluetooth.requestDevice(


                {


                    acceptAllDevices:

                    true


                }


            );



            this.connected = true;



            this.displayMessage(

                "Bluetooth Gerät verbunden: "

                +

                this.device.name

            );



        }

        catch(error) {


            this.displayMessage(

                "Bluetooth Verbindung abgebrochen."

            );


        }


    },



    disconnect() {


        this.device = null;


        this.connected = false;



        this.displayMessage(

            "Bluetooth getrennt."

        );


    },



    getStatus() {


        return {


            connected:

            this.connected,


            device:

            this.device

        };


    },



    displayMessage(message) {


        const output =

        document.getElementById(

            "bluetooth-result"

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
modules/bluetooth/bluetooth.js

Version 1.0 Final Master
==================================================
*/