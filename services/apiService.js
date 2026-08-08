const CatchTrackAPIService = {

    version: "1.0",

    baseUrl: "",


    init() {

        console.log(
            "CatchTrack API Service bereit."
        );

    },


    configure(url) {

        this.baseUrl = url;


        return true;

    },


    async request(endpoint, options = {}) {

        try {

            const response =
                await fetch(
                    this.baseUrl + endpoint,
                    options
                );


            return await response.json();


        } catch (error) {

            console.error(
                "API Fehler:",
                error
            );


            return null;

        }

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackAPIService.init();

    }
);