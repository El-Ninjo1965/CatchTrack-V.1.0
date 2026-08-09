"use strict";

window.CatchTrackModuleManager = {

    version: "1.3.0",

    modules: [],

    activeModules: [],

    currentModule: null,

    loadedScripts: {},

    loadedStyles: {},

    moduleStatus: {},


    init() {

        console.log(
            "CatchTrack ModuleManager V1.3.0 bereit."
        );

    },


    loadModules(modules) {

        this.modules =
            Array.isArray(modules)
                ? modules
                : [];

        this.activeModules =
            this.modules.filter(
                module =>
                    module.enabled === true
            );

        this.moduleStatus = {};

        this.modules.forEach(
            module => {

                this.moduleStatus[module.name] = {

                    name: module.name,

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
        );

        this.createMenu();

        if (
            this.activeModules.length
        ) {

            this.loadModule(
                this.activeModules[0]
            );

        }

    },


    createMenu() {

        let menu =
            document.getElementById(
                "catchtrack-menu"
            );

        if (menu) {

            menu.remove();

        }

        menu =
            document.createElement(
                "nav"
            );

        menu.id =
            "catchtrack-menu";

        this.activeModules.forEach(
            module => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.textContent =
                    module.displayName ||
                    module.name;

                button.onclick = () => {

                    if (
                        module.name === "catches"
                    ) {

                        localStorage.removeItem(
                            "catchEditId"
                        );

                        if (
                            window.CatchTrackCatchesModule
                        ) {

                            CatchTrackCatchesModule.initialized =
                                false;

                        }

                    }

                    this.loadModule(
                        module
                    );

                };

                menu.appendChild(
                    button
                );

            }
        );

        const app =
            document.getElementById(
                "app"
            );

        if (app) {

            app.parentNode.insertBefore(
                menu,
                app
            );

        }

    },


    async loadModule(module) {

        const name =
            module?.name || "unknown";

        this.currentModule =
            module;

        this.updateModuleStatus(
            name,
            {
                loaded: false,
                initialized: false,
                error: null
            }
        );

        try {

            const app =
                document.getElementById(
                    "app"
                );

            if (!app) {

                throw new Error(
                    "App container nicht gefunden."
                );

            }

            const htmlResponse =
                await fetch(
                    module.path +
                    module.files.html
                );

            if (!htmlResponse.ok) {

                throw new Error(
                    `HTML konnte nicht geladen werden: ${module.path}${module.files.html}`
                );

            }

            app.innerHTML =
                await htmlResponse.text();

            await this.loadStyle(
                module
            );

            await this.loadScript(
                module
            );

            this.updateModuleStatus(
                name,
                {
                    loaded: true
                }
            );

            this.initializeModule(
                module
            );

        }

        catch(error) {

            this.updateModuleStatus(
                name,
                {
                    error:
                        error?.message ||
                        String(error)
                }
            );

            if (
                window.CatchTrackErrorHandler &&
                typeof
                    window.CatchTrackErrorHandler.handle ===
                    "function"
            ) {

                window.CatchTrackErrorHandler.handle(
                    error,
                    `module:${name}`
                );

            }

            else {

                console.error(
                    "Modul laden Fehler:",
                    error
                );

            }

        }

    },


    loadStyle(module) {

        return new Promise(
            (resolve, reject) => {

                const path =
                    module.path +
                    module.files.css;

                if (
                    this.loadedStyles[path]
                ) {

                    resolve();

                    return;

                }

                const link =
                    document.createElement(
                        "link"
                    );

                link.rel =
                    "stylesheet";

                link.href =
                    path;

                link.onload = () => {

                    this.loadedStyles[path] =
                        true;

                    resolve();

                };

                link.onerror = () => {

                    const error =
                        new Error(
                            `CSS konnte nicht geladen werden: ${path}`
                        );

                    if (
                        window.CatchTrackErrorHandler &&
                        typeof
                            window.CatchTrackErrorHandler.handle ===
                            "function"
                    ) {

                        window.CatchTrackErrorHandler.handle(
                            error,
                            `module:${module.name}:css`
                        );

                    }

                    reject(error);

                };

                document.head.appendChild(
                    link
                );

            }
        );

    },


    loadScript(module) {

        return new Promise(
            (resolve, reject) => {

                const path =
                    module.path +
                    module.files.js;

                if (
                    this.loadedScripts[path]
                ) {

                    resolve();

                    return;

                }

                const script =
                    document.createElement(
                        "script"
                    );

                script.src =
                    path;

                script.onload = () => {

                    this.loadedScripts[path] =
                        true;

                    resolve();

                };

                script.onerror = () => {

                    const error =
                        new Error(
                            `JavaScript konnte nicht geladen werden: ${path}`
                        );

                    if (
                        window.CatchTrackErrorHandler &&
                        typeof
                            window.CatchTrackErrorHandler.handle ===
                            "function"
                    ) {

                        window.CatchTrackErrorHandler.handle(
                            error,
                            `module:${module.name}:js`
                        );

                    }

                    reject(error);

                };

                document.body.appendChild(
                    script
                );

            }
        );

    },


    initializeModule(module) {

        const name =
            module.initializer;

        if (
            name &&
            window[name] &&
            typeof window[name].init ===
                "function"
        ) {

            try {

                window[name].init();

                this.updateModuleStatus(
                    module.name,
                    {
                        initialized: true
                    }
                );

                console.log(
                    "Modul gestartet:",
                    module.name
                );

            }

            catch(error) {

                this.updateModuleStatus(
                    module.name,
                    {
                        initialized: false,
                        error:
                            error?.message ||
                            String(error)
                    }
                );

                if (
                    window.CatchTrackErrorHandler &&
                    typeof
                        window.CatchTrackErrorHandler.handle ===
                        "function"
                ) {

                    window.CatchTrackErrorHandler.handle(
                        error,
                        `module:${module.name}:initializer`
                    );

                }

            }

        }

        else {

            const error =
                new Error(
                    `Initializer nicht gefunden: ${name || "unbekannt"}`
                );

            this.updateModuleStatus(
                module.name,
                {
                    initialized: false,
                    error: error.message
                }
            );

            if (
                window.CatchTrackErrorHandler &&
                typeof
                    window.CatchTrackErrorHandler.handle ===
                    "function"
            ) {

                window.CatchTrackErrorHandler.handle(
                    error,
                    `module:${module.name}:initializer`
                );

            }

        }

    },


    updateModuleStatus(name, changes = {}) {

        if (
            !this.moduleStatus[name]
        ) {

            this.moduleStatus[name] = {

                name: name,

                loaded: false,

                initialized: false,

                error: null

            };

        }

        Object.assign(
            this.moduleStatus[name],
            changes
        );

        this.publishRuntimeStatus();

    },


    publishRuntimeStatus() {

        if (
            window.CatchTrackRuntimeStatus &&
            typeof
                window.CatchTrackRuntimeStatus.updateModules ===
                "function"
        ) {

            window.CatchTrackRuntimeStatus.updateModules(
                this.moduleStatus
            );

        }

    },


    getModules() {

        return this.modules;

    },


    getActiveModules() {

        return this.activeModules;

    },


    getModuleStatus() {

        return {
            ...this.moduleStatus
        };

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackModuleManager.init();

    }
);