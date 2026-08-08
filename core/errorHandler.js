const CatchTrackErrorHandler = {

    version: "1.0",

    errors: [],


    init() {

        console.log(
            "CatchTrack Error Handler bereit."
        );

    },


    handle(error, source = "unknown") {

        const entry = {

            message: error?.message || error,

            source: source,

            timestamp: new Date()
                .toISOString()

        };


        this.errors.push(entry);


        console.error(
            "CatchTrack Fehler:",
            entry
        );


        return entry;

    },


    getErrors() {

        return this.errors;

    },


    clear() {

        this.errors = [];

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackErrorHandler.init();

    }
);