const CatchTrackLanguageManager = {

    version: "1.0",

    currentLanguage: null,

    defaultLanguage: "de",


    init() {

        this.currentLanguage =
            this.detectLanguage();


        console.log(
            "Sprache aktiviert:",
            this.currentLanguage
        );

    },


    detectLanguage() {

        const deviceLanguage =
            navigator.language
            ?.substring(0, 2);


        if (deviceLanguage) {

            return deviceLanguage;

        }


        return this.defaultLanguage;

    },


    setLanguage(language) {

        this.currentLanguage = language;


        console.log(
            "Sprache geändert:",
            language
        );


        return true;

    },


    getLanguage() {

        return this.currentLanguage;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackLanguageManager.init();

    }
);