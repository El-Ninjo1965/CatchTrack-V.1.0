const CatchTrackStorageManager = {

    version: "1.0",

    storageType: "localStorage",


    init() {

        console.log(
            "CatchTrack Storage Manager bereit."
        );

    },


    save(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );


            return true;

        } catch (error) {

            console.error(
                "Speicherfehler:",
                error
            );


            return false;

        }

    },


    load(key) {

        try {

            const value =
                localStorage.getItem(key);


            return value
                ? JSON.parse(value)
                : null;


        } catch (error) {

            console.error(
                "Ladefehler:",
                error
            );


            return null;

        }

    },


    remove(key) {

        localStorage.removeItem(key);

        return true;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackStorageManager.init();

    }
);