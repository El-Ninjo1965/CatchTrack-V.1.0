"use strict";
window.CatchTrackRuntimeStorage = {
    version: "1.1.0",
    statusPath: "runtime/runtime_status.json",
    logPath: "runtime/error.log",
    statusStorageKey:
        "catchtrack_runtime_status_v1",
    logStorageKey:
        "catchtrack_runtime_error_log_v1",
    maxLogEntries: 1000,
    lastStatus: null,
    lastStatusJson: null,
    logEntries: [],
    lastLogLine: null,
    init() {
        this.loadStatus();
        this.loadLog();
    },
    loadStatus() {
        try {
            const stored =
                window.localStorage.getItem(
                    this.statusStorageKey
                );
            if (!stored) {
                return null;
            }
            this.lastStatusJson =
                stored;
            this.lastStatus =
                JSON.parse(stored);
            return this.lastStatus;
        }
        catch (error) {
            console.warn(
                "Runtime Status konnte nicht geladen werden.",
                error
            );
            return null;
        }
    },
    loadLog() {
        try {
            const stored =
                window.localStorage.getItem(
                    this.logStorageKey
                );
            if (!stored) {
                this.logEntries = [];
                return [];
            }
            const parsed =
                JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                this.logEntries = [];
                return [];
            }
            this.logEntries =
                parsed.slice(
                    -this.maxLogEntries
                );
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
            console.warn(
                "Runtime Error Log konnte nicht geladen werden.",
                error
            );
            this.logEntries = [];
            this.lastLogLine = null;
            return [];
        }
    },
    async saveStatus(status) {
        if (!status) {
            throw new Error(
                "Kein Runtime-Status zum Speichern vorhanden."
            );
        }
        this.lastStatus =
            status;
        this.lastStatusJson =
            JSON.stringify(
                status,
                null,
                2
            );
        try {
            window.localStorage.setItem(
                this.statusStorageKey,
                this.lastStatusJson
            );
        }
        catch (error) {
            console.warn(
                "Runtime Status konnte nicht persistent gespeichert werden.",
                error
            );
        }
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
        try {
            window.localStorage.setItem(
                this.logStorageKey,
                JSON.stringify(
                    this.logEntries
                )
            );
        }
        catch (error) {
            console.warn(
                "Runtime Error Log konnte nicht persistent gespeichert werden.",
                error
            );
        }
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
        try {
            window.localStorage.removeItem(
                this.logStorageKey
            );
        }
        catch (error) {
            console.warn(
                "Runtime Error Log konnte nicht gelöscht werden.",
                error
            );
        }
    }
};
window.CatchTrackRuntimeStorage.init();