"use strict";


window.CatchTrackModuleInstaller = {

    version: "2.0.0",

    installedModules: {},

    initialized: false,


    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        const stored =
            window.CatchTrackStorageManager
                ?.load(
                    "installed_modules",
                    {}
                );


        if (
            stored &&
            typeof stored ===
            "object"
        ) {

            this.installedModules =
                {
                    ...stored
                };

        }

    },


    validate(module) {

        if (
            !module ||
            typeof module !==
            "object"
        ) {

            return {

                valid: false,

                errors: [
                    "Moduldefinition fehlt."

                ]

            };

        }


        const errors = [];


        if (!module.name) {

            errors.push(
                "name fehlt."
            );

        }


        if (!module.path) {

            errors.push(
                "path fehlt."
            );

        }


        if (
            !module.files ||
            !module.files.html ||
            !module.files.css ||
            !module.files.js
        ) {

            errors.push(
                "HTML/CSS/JS-Dateidefinition fehlt."
            );

        }


        if (!module.initializer) {

            errors.push(
                "initializer fehlt."
            );

        }


        return {

            valid:
                errors.length === 0,

            errors

        };

    },


    install(
        module
    ) {

        const result =
            this.validate(
                module
            );


        if (!result.valid) {

            return false;

        }


        this.installedModules[
            module.name
        ] = {

            name:
                module.name,

            version:
                module.version ||
                "1.0.0",

            installedAt:
                new Date().toISOString()

        };


        this.persist();


        return true;

    },


    uninstall(name) {

        delete this.installedModules[
            name
        ];


        this.persist();


        return true;

    },


    isInstalled(name) {

        return !!this.installedModules[
            name
        ];

    },


    getInstalledModules() {

        return {
            ...this.installedModules
        };

    },


    persist() {

        if (
            window.CatchTrackStorageManager
        ) {

            CatchTrackStorageManager.save(
                "installed_modules",
                this.installedModules
            );

        }

    }

};