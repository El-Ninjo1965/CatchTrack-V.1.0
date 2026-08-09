"use strict";


window.CatchTrackErrorHandler = {

    version: "2.0.0",

    errors: [],

    maxErrors: 1000,

    initialized: false,


    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        window.addEventListener(
            "error",
            event => {

                this.handle(

                    event.error ||
                    event.message ||
                    "Unbekannter JavaScript-Fehler",

                    "window"

                );

            }
        );


        window.addEventListener(
            "unhandledrejection",
            event => {

                this.handle(

                    event.reason ||
                    "Unbehandelte Promise-Ablehnung",

                    "unhandledrejection"

                );

            }
        );

    },


    handle(
        error,
        source = "unknown"
    ) {

        const entry = {

            level:
                "ERROR",

            message:
                this.getErrorMessage(
                    error
                ),

            source,

            timestamp:
                new Date().toISOString()

        };


        const stack =
            this.getErrorStack(
                error
            );


        if (stack) {

            entry.stack =
                stack;

        }


        this.errors.push(
            entry
        );


        if (
            this.errors.length >
            this.maxErrors
        ) {

            this.errors =
                this.errors.slice(
                    -this.maxErrors
                );

        }


        console.error(
            "CatchTrack Fehler:",
            entry
        );


        this.writeToRuntime(
            entry
        );


        return entry;

    },


    getErrorMessage(
        error
    ) {

        if (
            error &&
            typeof error.message ===
            "string"
        ) {

            return error.message;

        }


        if (
            typeof error ===
            "string"
        ) {

            return error;

        }


        try {

            return JSON.stringify(
                error
            );

        }

        catch (_) {

            return String(
                error
            );

        }

    },


    getErrorStack(
        error
    ) {

        return (
            error &&
            typeof error.stack ===
            "string"
        )
            ? error.stack
            : null;

    },


    writeToRuntime(
        entry
    ) {

        try {

            if (
                window.CatchTrackRuntimeStorage
            ) {

                CatchTrackRuntimeStorage.writeLog(
                    entry
                );

            }


            if (
                window.CatchTrackRuntimeStatus
            ) {

                CatchTrackRuntimeStatus.registerError(
                    entry
                );

            }

        }

        catch (runtimeError) {

            console.warn(
                "Runtime-Fehler konnte nicht gespeichert werden.",
                runtimeError
            );

        }

    },


    getErrors() {

        return [
            ...this.errors
        ];

    },


    getLastError() {

        return this.errors.length
            ? this.errors[
                this.errors.length - 1
            ]
            : null;

    },


    clear() {

        this.errors =
            [];

    }

};


CatchTrackErrorHandler.init();