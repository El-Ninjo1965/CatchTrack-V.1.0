const CatchTrackExportService = {

    version: "1.0",


    init() {

        console.log(
            "CatchTrack Export Service bereit."
        );

    },


    exportData(data, format = "json") {

        if (!data) {

            console.warn(
                "Keine Daten zum Export."
            );

            return null;

        }


        const exportObject = {

            format: format,

            timestamp:
                new Date()
                .toISOString(),

            data: data

        };


        console.log(
            "Export erstellt:",
            exportObject
        );


        return exportObject;

    },


    download(data) {

        console.log(
            "Download vorbereitet:",
            data
        );


        return true;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackExportService.init();

    }
);