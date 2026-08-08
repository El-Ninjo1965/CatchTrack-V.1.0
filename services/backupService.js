const CatchTrackBackupService = {

    version: "1.0",


    init() {

        console.log(
            "CatchTrack Backup Service bereit."
        );

    },


    createBackup(data) {

        const backup = {

            timestamp:
                new Date()
                .toISOString(),

            data: data

        };


        console.log(
            "Backup erstellt:",
            backup
        );


        return backup;

    },


    restoreBackup(backup) {

        if (!backup) {

            console.warn(
                "Kein Backup vorhanden."
            );

            return null;

        }


        return backup.data;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackBackupService.init();

    }
);