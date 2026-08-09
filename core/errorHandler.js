"use strict";

window.CatchTrackErrorHandler = {

    version: "1.2.0",

    errors: [],

    logFile: "runtime/error.log",


    init() {

        window.addEventListener(
            "error",
            (event) => {

                this.handle(
                    event.error || event.message,
                    "window"
                );

            }
        );


        window.addEventListener(
            "unhandledrejection",
            (event) => {

                this.handle(
                    event.reason,
                    "unhandledrejection"
                );

            }
        );


        console.log(
            "CatchTrack Error Handler V1.2.0 bereit."
        );

    },


    handle(error, source = "unknown") {

        const entry = {

            level: "ERROR",

            message:
                error?.message ||
                String(error),

            source: source,

            timestamp:
                new Date().toISOString()

        };


        if (error?.stack) {

            entry.stack =
                error.stack;

        }


        this.errors.push(
            entry
        );


        console.error(
            "CatchTrack Fehler:",
            entry
        );


        this.writeToLog(
            entry
        );


        if (
            window.CatchTrackRuntimeStatus &&
            typeof
                window.CatchTrackRuntimeStatus.registerError ===
                "function"
        ) {

            window.CatchTrackRuntimeStatus.registerError(
                entry
            );

        }


        return entry;

    },


    writeToLog(entry) {

        if (
            window.CatchTrackRuntimeStorage &&
            typeof
                window.CatchTrackRuntimeStorage.writeLog ===
                "function"
        ) {

            window.CatchTrackRuntimeStorage.writeLog(
                entry
            );

            return;

        }


        console.warn(
            "Runtime Storage noch nicht verfügbar. " +
            "Fehler bleibt im Error Handler gespeichert."
        );

    },


    getErrors() {

        return [
            ...this.errors
        ];

    },


    getLastError() {

        if (
            this.errors.length === 0
        ) {

            return null;

        }


        return this.errors[
            this.errors.length - 1
        ];

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