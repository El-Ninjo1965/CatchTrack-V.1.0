const CatchTrackNotificationService = {

    version: "1.0",


    init() {

        console.log(
            "CatchTrack Notification Service bereit."
        );

    },


    show(message, type = "info") {

        const notification = {

            message: message,

            type: type,

            timestamp:
                new Date()
                .toISOString()

        };


        console.log(
            "Benachrichtigung:",
            notification
        );


        return notification;

    },


    requestPermission() {

        if (
            "Notification" in window
        ) {

            Notification.requestPermission();

        }

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackNotificationService.init();

    }
);