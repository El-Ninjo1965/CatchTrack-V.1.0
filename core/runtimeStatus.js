"use strict";
window.CatchTrackRuntimeStatus = {
    version: "1.1.0",
    statusFile:
        "runtime/runtime_status.json",
    application: {
        name:
            "CatchTrack",
        version:
            null,
        environment:
            null
    },
    system: {
        lastStartup:
            null,
        lastStatusScan:
            null,
        lastSuccessfulStatusScan:
            null
    },
    modules: {},
    errors: {
        total:
            0,
        lastErrorAt:
            null,
        lastError:
            null
    },
    initialized:
        false,
    init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        const now =
            new Date().toISOString();
        this.system.lastStartup =
            now;
        this.updateStatus();
        console.log(
            "CatchTrack Runtime Status V1.1.0 bereit."
        );
    },
    updateStatus() {
        const now =
            new Date().toISOString();
        this.system.lastStatusScan =
            now;
        this.collectApplicationInfo();
        this.collectModuleInfo();
        this.collectErrorInfo();
        this.system.lastSuccessfulStatusScan =
            now;
        this.save();
    },
    collectApplicationInfo() {
        if (
            window.CatchTrackConfig
        ) {
            this.application.version =
                window.CatchTrackConfig.version ||
                null;
            this.application.environment =
                window.CatchTrackConfig.environment ||
                null;
        }
        if (
            document.documentElement &&
            document.documentElement.dataset
        ) {
            this.application.version =
                this.application.version ||
                document.documentElement.dataset.version ||
                null;
        }
    },
    collectModuleInfo() {
        if (
            !window.CatchTrackModuleManager
        ) {
            return;
        }
        const manager =
            window.CatchTrackModuleManager;
        if (
            manager.moduleStatus
        ) {
            this.modules = {
                ...manager.moduleStatus
            };
            return;
        }
        if (
            typeof manager.getModules ===
            "function"
        ) {
            const modules =
                manager.getModules();
            if (
                Array.isArray(
                    modules
                )
            ) {
                this.modules = {};
                modules.forEach(
                    module => {
                        if (
                            module &&
                            module.name
                        ) {
                            this.modules[
                                module.name
                            ] = {
                                name:
                                    module.name,
                                displayName:
                                    module.displayName ||
                                    module.name,
                                enabled:
                                    module.enabled === true,
                                loaded:
                                    module.loaded === true,
                                initialized:
                                    module.initialized === true,
                                error:
                                    module.error ||
                                    null
                            };
                        }
                    }
                );
            }
        }
    },
    collectErrorInfo() {
        if (
            !window.CatchTrackErrorHandler
        ) {
            return;
        }
        const handler =
            window.CatchTrackErrorHandler;
        const errors =
            typeof handler.getErrors ===
            "function"
                ? handler.getErrors()
                : [];
        this.errors.total =
            errors.length;
        if (
            errors.length
        ) {
            const last =
                errors[
                    errors.length - 1
                ];
            this.errors.lastErrorAt =
                last.timestamp ||
                null;
            this.errors.lastError =
                {
                    ...last
                };
        }
        else {
            this.errors.lastErrorAt =
                null;
            this.errors.lastError =
                null;
        }
    },
    updateModules(
        moduleStatus
    ) {
        if (
            !moduleStatus ||
            typeof moduleStatus !==
            "object"
        ) {
            return;
        }
        this.modules = {
            ...moduleStatus
        };
        this.system.lastStatusScan =
            new Date().toISOString();
        this.save();
    },
    registerError(
        error
    ) {
        const timestamp =
            new Date().toISOString();
        this.errors.total +=
            1;
        this.errors.lastErrorAt =
            timestamp;
        this.errors.lastError =
            {
                ...(error || {}),
                timestamp
            };
        this.save();
    },
    buildData() {
        return {
            schemaVersion:
                "1.1",
            status:
                "RUNTIME",
            generatedAt:
                new Date().toISOString(),
            application:
                {
                    ...this.application
                },
            system:
                {
                    ...this.system
                },
            modules:
                Object.values(
                    this.modules
                ),
            errors:
                {
                    ...this.errors
                }
        };
    },
    save() {
        const data =
            this.buildData();
        const storage =
            window.CatchTrackRuntimeStorage;
        if (
            storage &&
            typeof storage.saveStatus ===
            "function"
        ) {
            try {
                storage.saveStatus(
                    data
                );
                return true;
            }
            catch (error) {
                console.warn(
                    "CatchTrack Runtime Status konnte nicht gespeichert werden.",
                    error
                );
            }
        }
        /*
         * Fallback:
         * Der Status bleibt im Speicher des
         * RuntimeStatus-Moduls verfügbar.
         */
        this.lastStatus =
            data;
        return false;
    },
    getStatus() {
        return this.buildData();
    }
};
document.addEventListener(
    "DOMContentLoaded",
    () => {
        CatchTrackRuntimeStatus.init();
    }
);