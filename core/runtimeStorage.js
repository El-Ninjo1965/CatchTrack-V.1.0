"use strict";

window.CatchTrackRuntimeStorage = {

    version: "1.0.0",

    statusPath: "runtime/runtime_status.json",

    logPath: "runtime/error.log",

    maxLogEntries: 1000,

    lastStatus: null,

    lastStatusJson: null,

    logEntries: [],

    lastLogLine: null,


    async saveStatus(status) {

        if (!status) {

            throw new Error(
                "Kein Runtime-Status zum Speichern vorhanden."
            );

        }

        this.lastStatus = status;

        this.lastStatusJson =
            JSON.stringify(
                status,
                null,
                2
            );

        return this.lastStatusJson;

    },


    async writeLog(entry) {

        if (!entry) {

            throw new Error(
                "Kein Logeintrag vorhanden."
            );

        }

        const line =
            this.formatLogEntry(
                entry
            );

        this.logEntries.push(
            line
        );

        if (
            this.logEntries.length >
            this.maxLogEntries
        ) {

            this.logEntries =
                this.logEntries.slice(
                    -this.maxLogEntries
                );

        }

        this.lastLogLine =
            line;

        return line;

    },


    async write(line) {

        if (
            typeof line === "string"
        ) {

            return this.writeLog({

                level: "ERROR",

                message: line

            });

        }

        return this.writeLog(
            line
        );

    },


    formatLogEntry(entry) {

        const timestamp =
            entry.timestamp ||
            new Date().toISOString();

        const level =
            entry.level ||
            "ERROR";

        const source =
            entry.source ||
            "unknown";

        const message =
            entry.message ||
            "Unbekannter Fehler.";

        let result =
            `[${timestamp}] ` +
            `${level} ` +
            `${source}: ` +
            `${message}`;

        if (entry.stack) {

            result +=
                `\n${entry.stack}`;

        }

        return result;

    },


    getStatusJson() {

        return this.lastStatusJson || null;

    },


    getLogEntries() {

        return [
            ...this.logEntries
        ];

    },


    getLogText() {

        return this.logEntries.join(
            "\n"
        );

    },


    clearRuntimeBuffer() {

        this.logEntries = [];

        this.lastLogLine = null;

    }

};