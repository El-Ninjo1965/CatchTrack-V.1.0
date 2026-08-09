"use strict";


window.CatchTrackRuntimeStorage = {

    version: "2.0.0",

    statusPath:
        "runtime/runtime_status.json",

    logPath:
        "runtime/error.log",

    statusStorageKey:
        "catchtrack_runtime_status_v2",

    logStorageKey:
        "catchtrack_runtime_error_log_v2",

    maxLogEntries: 1000,

    lastStatus: null,

    lastStatusJson: null,

    logEntries: [],

    lastLogLine: null,

    initialized: false,


    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        this.loadStatus();

        this.loadLog();

    },


    loadStatus() {

        try {

            const stored =
                localStorage.getItem(
                    this.statusStorageKey
                );


            if (!stored) {

                return null;

            }


            this.lastStatusJson =
                stored;


            this.lastStatus =
                JSON.parse(
                    stored
                );


            return this.lastStatus;

        }

        catch (error) {

            this.lastStatus =
                null;

            this.lastStatusJson =
                null;


            return null;

        }

    },


    loadLog() {

        try {

            const stored =
                localStorage.getItem(
                    this.logStorageKey
                );


            if (!stored) {

                this.logEntries =
                    [];

                return [];

            }


            const parsed =
                JSON.parse(
                    stored
                );


            this.logEntries =
                Array.isArray(parsed)
                    ? parsed.slice(
                        -this.maxLogEntries
                    )
                    : [];


            this.lastLogLine =
                this.logEntries.length
                    ? this.logEntries[
                        this.logEntries.length - 1
                    ]
                    : null;


            return [
                ...this.logEntries
            ];

        }

        catch (error) {

            this.logEntries =
                [];

            this.lastLogLine =
                null;


            return [];

        }

    },


    async saveStatus(
        status
    ) {

        if (
            !status ||
            typeof status !==
            "object"
        ) {

            throw new Error(
                "Ungültiger Runtime-Status."
            );

        }


        this.lastStatus =
            {
                ...status
            };


        this.lastStatusJson =
            JSON.stringify(
                this.lastStatus,
                null,
                2
            );


        localStorage.setItem(
            this.statusStorageKey,
            this.lastStatusJson
        );


        return this.lastStatusJson;

    },


    async writeLog(
        entry
    ) {

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


        localStorage.setItem(

            this.logStorageKey,

            JSON.stringify(
                this.logEntries
            )

        );


        return line;

    },


    formatLogEntry(
        entry
    ) {

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


        if (
            entry.stack
        ) {

            result +=
                `\n${entry.stack}`;

        }


        return result;

    },


    getStatus() {

        return this.lastStatus
            ? {
                ...this.lastStatus
            }
            : null;

    },


    getStatusJson() {

        return (
            this.lastStatusJson ||
            null
        );

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


    getSnapshot() {

        return {

            status:
                this.lastStatusJson,

            log:
                JSON.stringify(
                    this.logEntries
                )

        };

    },


    clearRuntimeBuffer() {

        this.logEntries =
            [];

        this.lastLogLine =
            null;


        localStorage.removeItem(
            this.logStorageKey
        );

    }

};


CatchTrackRuntimeStorage.init();