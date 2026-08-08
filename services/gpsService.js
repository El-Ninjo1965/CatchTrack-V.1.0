const CatchTrackGPSService = {

    version: "1.0",


    position: null,


    init() {

        console.log(
            "CatchTrack GPS Service bereit."
        );

    },


    getPosition() {

        if (!navigator.geolocation) {

            console.warn(
                "GPS nicht verfügbar."
            );

            return false;

        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                this.position = {

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude

                };


                console.log(
                    "GPS Position:",
                    this.position
                );

            },


            (error) => {

                console.error(
                    "GPS Fehler:",
                    error
                );

            }

        );


        return true;

    },


    getLastPosition() {

        return this.position;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackGPSService.init();

    }
);