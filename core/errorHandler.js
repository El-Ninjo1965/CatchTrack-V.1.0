"use strict";
window.CatchTrackErrorHandler = {
    version: "1.4.0",
    errors: [],
    logFile:
        "runtime/error.log",
    initialized: false,
    init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        window.addEventListener(
            "error",
            (event) => {
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
            (event) => {
                this.handle(
                    event.reason ||
                    "Unbehandelte Promise-Ablehnung",
                    "unhandledrejection"
                );
            }
        );
        console.log(
            "CatchTrack Error Handler V1.4.0 bereit."
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
            source:
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
        console.error(
            "CatchTrack Fehler:",
            entry
        );
        this.writeToLog(
            entry
        );
        this.registerRuntimeStatus(
            entry
        );
        return entry;
    },
    getErrorMessage(error) {
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
        catch {
            return String(
                error
            );
        }
    },
    getErrorStack(error) {
        if (
            error &&
            typeof error.stack ===
            "string"
        ) {
            return error.stack;
        }
        return null;
    },
    writeToLog(entry) {
        const storage =
            window.CatchTrackRuntimeStorage;
        if (
            storage &&
            typeof storage.writeLog ===
            "function"
        ) {
            try {
                storage.writeLog(
                    entry
                );
                return true;
            }
            catch (error) {
                console.warn(
                    "CatchTrack Runtime Storage konnte den Fehler nicht speichern.",
                    error
                );
            }
        }
        console.warn(
            "CatchTrack Runtime Storage nicht verfügbar. " +
            "Fehler bleibt im Error Handler gespeichert."
        );
        return false;
    },
    registerRuntimeStatus(entry) {
        const status =
            window.CatchTrackRuntimeStatus;
        if (
            status &&
            typeof status.registerError ===
            "function"
        ) {
            try {
                status.registerError(
                    entry
                );
            }
            catch (error) {
                console.warn(
                    "CatchTrack Runtime Status konnte den Fehler nicht registrieren.",
                    error
                );
            }
        }
    },
    getErrors() {
        return [
            ...this.errors
        ];
    },
    getLastError() {
        if (
            this.errors.length ===
            0
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
/*
 * Absichtlich sofort initialisieren.
 *
 * Dadurch werden auch Fehler erfasst,
 * die vor DOMContentLoaded auftreten.
 */
window.CatchTrackErrorHandler.init();