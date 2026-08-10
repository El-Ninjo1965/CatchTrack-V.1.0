"use strict";

window.CatchTrackModuleManager = {

version: "3.0.0",
modules: [],
activeModules: [],
currentModule: null,
loadedScripts: {},
loadedStyles: {},
loadedMetadata: {},
registeredMigrations: {},
moduleStatus: {},
initialized: false,
init() {
    if (
        this.initialized
    ) {
        return;
    }
    this.initialized =
        true;
},
async loadModules(
    modules
) {
    this.modules =
        Array.isArray(modules)
            ? modules
            : [];
    this.activeModules =
        this.modules.filter(
            module =>
                module.enabled === true
        );
    this.moduleStatus =
        {};
    this.modules.forEach(
        module => {
            this.moduleStatus[
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
    );
    this.createMenu();
    if (
        this.activeModules.length
    ) {
        await this.loadModule(
            this.activeModules[0]
        );
    }
    this.publishRuntimeStatus();
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
            button.addEventListener(
                "click",
                () => {
                    this.loadModule(
                        module
                    );
                }
            );
            menu.appendChild(
                button
            );
        }
    );
    const app =
        document.getElementById(
            "app"
        );
    if (
        app &&
        app.parentNode
    ) {
        app.parentNode.insertBefore(
            menu,
            app
        );
    }
},
async loadModule(
    module
) {
    const name =
        module?.name ||
        "unknown";
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
                "App-Container nicht gefunden."
            );
        }
        const validation =
            window.CatchTrackModuleInstaller
                ?.validate(
                    module
                );
        if (
            validation &&
            !validation.valid
        ) {
            throw new Error(
                validation.errors.join(
                    " "
                )
            );
        }
        await this.loadModuleMetadata(
            module
        );
        await this.registerModuleMigrations(
            module
        );
        const htmlResponse =
            await fetch(
                module.path +
                module.files.html
            );
        if (
            !htmlResponse.ok
        ) {
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
        if (
            window.CatchTrackModuleInstaller
        ) {
            CatchTrackModuleInstaller.install(
                module
            );
        }
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
    catch (error) {
        this.updateModuleStatus(
            name,
            {
                loaded: false,
                initialized: false,
                error:
                    error?.message ||
                    String(error)
            }
        );
        if (
            window.CatchTrackErrorHandler
        ) {
            CatchTrackErrorHandler.handle(
                error,
                `module:${name}`
            );
        }
    }
},
async loadModuleMetadata(
    module
) {
    const name =
        module?.name;
    if (
        !name
    ) {
        throw new Error(
            "Modulname fehlt."
        );
    }
    if (
        this.loadedMetadata[
            name
        ]
    ) {
        return this.loadedMetadata[
            name
        ];
    }
    const path =
        module.path +
        "module.json";
    const response =
        await fetch(
            path
        );
    if (
        !response.ok
    ) {
        throw new Error(
            `Moduldefinition konnte nicht geladen werden: ${path}`
        );
    }
    const metadata =
        await response.json();
    if (
        !metadata ||
        typeof metadata !==
            "object"
    ) {
        throw new Error(
            `Ungültige Moduldefinition: ${path}`
        );
    }
    if (
        metadata.name &&
        metadata.name !==
            module.name
    ) {
        throw new Error(
            `Modulname stimmt nicht überein: ${module.name} / ${metadata.name}`
        );
    }
    this.loadedMetadata[
        name
    ] =
        metadata;
    return metadata;
},
async registerModuleMigrations(
    module
) {
    const metadata =
        await this.loadModuleMetadata(
            module
        );
    const migrations =
        Array.isArray(
            metadata?.database?.migrations
        )
            ? metadata.database.migrations
            : [];
    if (
        !migrations.length
    ) {
        return false;
    }
    if (
        !window.CatchTrackDatabase ||
        typeof
            CatchTrackDatabase.registerMigration !==
            "function"
    ) {
        throw new Error(
            "CatchTrackDatabase unterstützt keine Migrationen."
        );
    }
    for (
        const migration
        of migrations
    ) {
        const version =
            String(
                migration?.version ??
                ""
            ).trim();
        const description =
            String(
                migration?.description ??
                ""
            );
        const path =
            String(
                migration?.path ??
                ""
            ).trim();
        if (
            !version ||
            !path
        ) {
            throw new Error(
                `Ungültige Migration im Modul ${module.name}.`
            );
        }
        const migrationKey =
            `${module.name}:${version}`;
        if (
            this.registeredMigrations[
                migrationKey
            ]
        ) {
            continue;
        }
        const response =
            await fetch(
                path
            );
        if (
            !response.ok
        ) {
            throw new Error(
                `Migration konnte nicht geladen werden: ${path}`
            );
        }
        const sql =
            await response.text();
        if (
            !sql.trim()
        ) {
            throw new Error(
                `Migration ist leer: ${path}`
            );
        }
        CatchTrackDatabase.registerMigration(
            version,
            description,
            database => {
                database.exec(
                    sql
                );
            }
        );
        this.registeredMigrations[
            migrationKey
        ] = true;
    }
    CatchTrackDatabase.runMigrations();
    CatchTrackDatabase.saveDatabase();
    return true;
},
loadStyle(
    module
) {
    return new Promise(
        (
            resolve,
            reject
        ) => {
            const path =
                module.path +
                module.files.css;
            if (
                this.loadedStyles[
                    path
                ]
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
                this.loadedStyles[
                    path
                ] = true;
                resolve();
            };
            link.onerror = () => {
                const error =
                    new Error(
                        `CSS konnte nicht geladen werden: ${path}`
                    );
                reject(
                    error
                );
            };
            document.head.appendChild(
                link
            );
        }
    );
},
loadScript(
    module
) {
    return new Promise(
        (
            resolve,
            reject
        ) => {
            const path =
                module.path +
                module.files.js;
            if (
                this.loadedScripts[
                    path
                ]
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
                this.loadedScripts[
                    path
                ] = true;
                resolve();
            };
            script.onerror = () => {
                reject(
                    new Error(
                        `JavaScript konnte nicht geladen werden: ${path}`
                    )
                );
            };
            document.body.appendChild(
                script
            );
        }
    );
},
initializeModule(
    module
) {
    const name =
        module.initializer;
    const instance =
        window[name];
    if (
        !instance ||
        typeof instance.init !==
        "function"
    ) {
        const error =
            new Error(
                `Initializer nicht gefunden: ${name}`
            );
        this.updateModuleStatus(
            module.name,
            {
                initialized: false,
                error:
                    error.message
            }
        );
        if (
            window.CatchTrackErrorHandler
        ) {
            CatchTrackErrorHandler.handle(
                error,
                `module:${module.name}:initializer`
            );
        }
        return false;
    }
    try {
        instance.init();
        this.updateModuleStatus(
            module.name,
            {
                initialized: true,
                error: null
            }
        );
        return true;
    }
    catch (error) {
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
            window.CatchTrackErrorHandler
        ) {
            CatchTrackErrorHandler.handle(
                error,
                `module:${module.name}:initializer`
            );
        }
        return false;
    }
},
updateModuleStatus(
    name,
    changes = {}
) {
    if (
        !this.moduleStatus[
            name
        ]
    ) {
        this.moduleStatus[
            name
        ] = {
            name,
            loaded: false,
            initialized: false,
            error: null
        };
    }
    Object.assign(
        this.moduleStatus[
            name
        ],
        changes
    );
    this.publishRuntimeStatus();
},
publishRuntimeStatus() {
    if (
        window.CatchTrackRuntimeStatus &&
        typeof
            CatchTrackRuntimeStatus
                .updateModules ===
            "function"
    ) {
        CatchTrackRuntimeStatus.updateModules(
            this.moduleStatus
        );
    }
},
getModules() {
    return [
        ...this.modules
    ];
},
getActiveModules() {
    return [
        ...this.activeModules
    ];
},
getModuleStatus() {
    return {
        ...this.moduleStatus
    };
}

};