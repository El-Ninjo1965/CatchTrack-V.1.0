const CatchTrackErrorHandler = {
    version: "1.1",
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
            "CatchTrack Error Handler bereit."
        );
    },
    handle(error, source = "unknown") {
        const entry = {
            level: "ERROR",
            message: error?.message || String(error),
            source: source,
            timestamp: new Date()
                .toISOString()
        };
        if (error?.stack) {
            entry.stack = error.stack;
        }
        this.errors.push(entry);
        console.error(
            "CatchTrack Fehler:",
            entry
        );
        this.writeToLog(entry);
        return entry;
    },
    writeToLog(entry) {
        const line =
            `[${entry.timestamp}] ` +
            `${entry.level} ` +
            `${entry.source}: ` +
            `${entry.message}` +
            (entry.stack
                ? `\n${entry.stack}`
                : "") +
            "\n";
        /*
         * Die Runtime-Logdatei wird später über die zentrale
         * Runtime-/Storage-Infrastruktur persistent geschrieben.
         *
         * Bis diese Infrastruktur implementiert ist, bleibt
         * der Fehler zusätzlich im lokalen Speicher erhalten.
         */
        if (
            typeof window !== "undefined" &&
            window.CatchTrackRuntimeLogger &&
            typeof window.CatchTrackRuntimeLogger.write === "function"
        ) {
            window.CatchTrackRuntimeLogger.write(line);
        }
    },
    getErrors() {
        return [...this.errors];
    },
    getLastError() {
        if (this.errors.length === 0) {
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