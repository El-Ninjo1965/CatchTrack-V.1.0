const CatchTrackAPI = {

    version: "1.0",


    requests: [],


    init() {

        console.log(
            "CatchTrack API bereit."
        );

    },


    registerRequest(request) {

        if (!request) {

            console.warn(
                "Ungültige Anfrage."
            );

            return false;
        }


        this.requests.push(request);


        return true;

    },


    getRequests() {

        return this.requests;

    },


    send(action, data = {}) {

        const request = {

            action: action,

            data: data,

            timestamp: new Date()
                .toISOString()

        };


        this.registerRequest(request);


        console.log(
            "API Anfrage:",
            request
        );


        return request;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackAPI.init();

    }
);