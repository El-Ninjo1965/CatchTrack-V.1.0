"use strict";
window.CatchTrackRuntimeStorage = {
    version: "1.2.0",
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
    initialized: false,
    init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
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
                this.lastStatus = null;
                this.lastStatusJson = null;
                return null;
            }
            this.lastStatusJson = stored;
            this.lastStatus =
                JSON.parse(stored);
            return this.lastStatus;
        }
        catch (error) {
            console.warn(
                "CatchTrack Runtime Status konnte nicht geladen werden.",
                error
            );
            this.lastStatus = null;
            this.lastStatusJson = null;
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
                this.lastLogLine = null;
                return [];
            }
            const parsed =
                JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                this.logEntries = [];
                this.lastLogLine = null;
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
                "CatchTrack Runtime Error Log konnte nicht geladen werden.",
                error
            );
            this.logEntries = [];
            this.lastLogLine = null;
            return [];
        }
    },
    async saveStatus(status) {
        if (
            !status ||
            typeof status !== "object"
        ) {
            throw new Error(
                "Kein gültiger Runtime-Status zum Speichern vorhanden."
            );
        }
        this.lastStatus = {
            ...status
        };
        this.lastStatusJson =
            JSON.stringify(
                this.lastStatus,
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
                "CatchTrack Runtime Status konnte nicht im LocalStorage gespeichert werden.",
                error
            );
            throw error;
        }
        return this.lastStatusJson;
    },
    async writeLog(entry) {
        if (
            !entry ||
            typeof entry !== "object"
        ) {
            throw new Error(
                "Kein gültiger Runtime-Logeintrag vorhanden."
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
                "CatchTrack Runtime Error Log konnte nicht im LocalStorage gespeichert werden.",
                error
            );
            throw error;
        }
        return line;
    },
    async write(line) {
        if (
            typeof line === "string"
        ) {
            return this.writeLog({
                level: "ERROR",
                source: "runtime",
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
    getStatus() {
        return this.lastStatus
            ? {
                ...this.lastStatus
            }
            : null;
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
    getSnapshot() {
        return {
            [this.statusStorageKey]:
                this.lastStatusJson,
            [this.logStorageKey]:
                JSON.stringify(
                    this.logEntries
                )
        };
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
                "CatchTrack Runtime Error Log konnte nicht gelöscht werden.",
                error
            );
        }
    }
};
window.CatchTrackRuntimeStorage.init();