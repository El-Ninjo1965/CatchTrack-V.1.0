"use strict";

window.CatchTrackRuntimeStatus = {

    version: "1.0.0",

    statusFile: "runtime/runtime_status.json",

    application: {
        name: "CatchTrack",
        version: null,
        environment: null
    },

    system: {
        lastStartup: null,
        lastStatusScan: null,
        lastSuccessfulStatusScan: null
    },

    modules: {},

    errors: {
        total: 0,
        lastErrorAt: null,
        lastError: null
    },


    init() {

        const now =
            new Date().toISOString();

        this.system.lastStartup = now;

        this.updateStatus();

        console.log(
            "CatchTrack Runtime Status V1.0.0 bereit."
        );

    },


    updateStatus() {

        const now =
            new Date().toISOString();

        this.system.lastStatusScan = now;

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

        }

        else if (
            typeof manager.getModules ===
            "function"
        ) {

            const modules =
                manager.getModules();

            if (
                Array.isArray(modules)
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

                                loaded: false,

                                initialized: false,

                                error: null

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

        const errors =
            typeof
                window.CatchTrackErrorHandler.getErrors ===
                "function"

                ? window.CatchTrackErrorHandler.getErrors()

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


    updateModules(moduleStatus) {

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


    registerError(error) {

        const timestamp =
            new Date().toISOString();

        this.errors.total += 1;

        this.errors.lastErrorAt =
            timestamp;

        this.errors.lastError =
            {
                ...error,
                timestamp
            };

        this.save();

    },


    buildData() {

        return {

            schemaVersion: "1.0",

            status: "RUNTIME",

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

        /*
         * Persistenz wird über die zentrale
         * Runtime-/Storage-Infrastruktur
         * angebunden.
         */

        if (
            window.CatchTrackRuntimeStorage &&
            typeof
                window.CatchTrackRuntimeStorage.saveStatus ===
                "function"
        ) {

            window.CatchTrackRuntimeStorage.saveStatus(
                data
            );

            return;

        }

        /*
         * Fallback:
         * Der aktuelle Status bleibt verfügbar,
         * solange die persistente Runtime-
         * Infrastruktur noch nicht eingebunden ist.
         */

        this.lastStatus =
            data;

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