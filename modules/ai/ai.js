const AIModule = {


    name: "AI Assistant",

    version: "1.0.0",

    enabled: false,


    promptTemplate:

    "Analysiere dieses Bild. " +
    "Was ist darauf zu sehen? " +
    "Bitte nenne den Namen, mögliche Art, " +
    "wichtige Informationen und eine kurze Erklärung.",



    init() {


        console.log(
            "CatchTrack AI Modul geladen"
        );


        if (!this.enabled) {

            console.log(
                "AI Modul deaktiviert"
            );

            return;

        }


    },



    createPrompt(category = "Objekt") {


        return (

            "Ich benötige eine Identifikation. " +

            "Kategorie: "
            + category
            + ". " +

            this.promptTemplate

        );


    },



    prepareRequest(imageData, category) {


        return {


            image:
            imageData,


            prompt:
            this.createPrompt(category),


            timestamp:
            new Date().toISOString()


        };


    },



    checkBrowserSupport() {


        return (
            "mediaDevices"
            in navigator
        );


    }



};



if (
    typeof module !== "undefined"
    &&
    module.exports
) {

    module.exports =
    AIModule;

}