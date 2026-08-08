const CatchTrackImportService = {

    version: "1.0",


    init() {

        console.log(
            "CatchTrack Import Service bereit."
        );

    },


    importData(data) {

        if (!data) {

            console.warn(
                "Keine Importdaten vorhanden."
            );

            return null;

        }


        try {

            const result =
                typeof data === "string"
                    ? JSON.parse(data)
                    : data;


            console.log(
                "Daten importiert:",
                result
            );


            return result;


        } catch (error) {

            console.error(
                "Import Fehler:",
                error
            );


            return null;

        }

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackImportService.init();

    }
);