"use strict";
window.CatchTrack = {
    version: "3.1.0",
    database: null,
    config: null,
    modules: [],
    initialized: false,
    async fetchText(path) {
        const response =
            await fetch(path);
        if (!response.ok) {
            throw new Error(
                `Datei konnte nicht geladen werden: ${path}`
            );
        }
        return response.text();
    },
    async loadConfiguration() {
        const response =
            await fetch(
                "config/app.json"
            );
        if (!response.ok) {
            throw new Error(
                "config/app.json konnte nicht geladen werden."
            );
        }
        this.config =
            await response.json();
        window.CatchTrackConfig =
            this.config;
    },
    async loadModuleConfiguration() {
        const response =
            await fetch(
                "config/modules.json"
            );
        if (!response.ok) {
            throw new Error(
                "config/modules.json konnte nicht geladen werden."
            );
        }
        const data =
            await response.json();
        this.modules =
            Array.isArray(data.modules)
                ? data.modules
                : [];
    },
    async loadMigration(
        version,
        description,
        path
    ) {
        const sql =
            await this.fetchText(
                path
            );
        if (!sql.trim()) {
            throw new Error(
                `Migration ${version} ist leer: ${path}`
            );
        }
        CatchTrackDatabase.registerMigration(
            version,
            description,
            database => {
                database.exec(sql);
            }
        );
    },
    async registerMigrations() {
        await this.loadMigration(
            "1",
            "Initial database structure",
            "database/migrations/001_initial.sql"
        );
        await this.loadMigration(
            "2",
            "User and privacy foundation",
            "database/migrations/002_users.sql"
        );
        await this.loadMigration(
            "3",
            "Core master foundation",
            "database/migrations/003_core_master.sql"
        );
        await this.loadMigration(
            "4",
            "Waters user ownership",
            "database/migrations/004_waters_user_id.sql"
        );
        await this.loadMigration(
            "5",
            "Core and GPS foundation",
            "database/migrations/005_core_gps.sql"
        );
        await this.loadMigration(
            "6",
            "Waters location and fangplatz photo support",
            "database/migrations/006_waters_location_photo.sql"
        );
    },
    async initializeDatabase() {
        const SQL =
            await initSqlJs({
                locateFile:
                    file =>
                        `libraries/${file}`
            });
        const savedDatabase =
            CatchTrackDatabase.hasStoredDatabase();
        this.database =
            CatchTrackDatabase.loadDatabase(
                SQL
            );
        await this.registerMigrations();
        const connected =
            CatchTrackDatabase.connect(
                this.database,
                {
                    freshDatabase:
                        !savedDatabase,
                    schemaPath:
                        "database/schema.sql"
                }
            );
        if (!connected) {
            throw new Error(
                "Datenbank konnte nicht initialisiert werden."
            );
        }
        return true;
    },
    async loadSeeds() {
        const seedFiles = [
            "database/fish_seed.sql"
        ];
        for (
            const path
            of seedFiles
        ) {
            try {
                const response =
                    await fetch(path);
                if (!response.ok) {
                    continue;
                }
                const sql =
                    await response.text();
                if (!sql.trim()) {
                    continue;
                }
                CatchTrackDatabase.executeScript(
                    sql
                );
            }
            catch (error) {
                if (
                    window.CatchTrackErrorHandler
                ) {
                    CatchTrackErrorHandler.handle(
                        error,
                        `seed:${path}`
                    );
                }
            }
        }
        CatchTrackDatabase.saveDatabase();
    },
    initializeCoreServices() {
        if (
            window.CatchTrackStorageManager
        ) {
            CatchTrackStorageManager.init();
        }
        if (
            window.CatchTrackLanguageManager
        ) {
            CatchTrackLanguageManager.init();
        }
        if (
            window.CatchTrackPermissionManager
        ) {
            CatchTrackPermissionManager.init();
        }
        if (
            window.CatchTrackAPI
        ) {
            CatchTrackAPI.init();
        }
        if (
            window.CatchTrackRouter
        ) {
            CatchTrackRouter.init();
        }
        if (
            window.CatchTrackModuleInstaller
        ) {
            CatchTrackModuleInstaller.init();
        }
        if (
            window.CatchTrackModuleManager
        ) {
            CatchTrackModuleManager.init();
        }
    },
    initializeIdentity() {
        if (
            !window.CatchTrackIdentity
        ) {
            throw new Error(
                "CatchTrack Identity Core nicht verfügbar."
            );
        }
        CatchTrackIdentity.init();
    },
    updateRuntimeStatus() {
        if (
            !window.CatchTrackRuntimeStatus
        ) {
            return;
        }
        CatchTrackRuntimeStatus.application.version =
            this.version;
        CatchTrackRuntimeStatus.application.environment =
            this.config?.environment ||
            this.config?.env ||
            "production";
        CatchTrackRuntimeStatus.updateStatus();
    },
    async startModules() {
        if (
            !window.CatchTrackModuleManager
        ) {
            throw new Error(
                "CatchTrack ModuleManager nicht verfügbar."
            );
        }
        await CatchTrackModuleManager.loadModules(
            this.modules
        );
    },
    renderFatalError(error) {
        const app =
            document.getElementById(
                "app"
            );
        if (!app) {
            return;
        }
        const message =
            error?.message ||
            String(error);
        app.innerHTML = `
            <section
                class="catchtrack-fatal-error"
            >
                <h2>CatchTrack</h2>
                <p>
                    ${this.escapeHtml(message)}
                </p>
            </section>
        `;
    },
    escapeHtml(value) {
        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    },
    async init() {
        if (this.initialized) {
            return;
        }
        try {
            console.log(
                `CatchTrack ${this.version} Start`
            );
            this.initializeCoreServices();
            await this.loadConfiguration();
            await this.initializeDatabase();
            this.initializeIdentity();
            await this.loadSeeds();
            await this.loadModuleConfiguration();
            this.updateRuntimeStatus();
            await this.startModules();
            this.initialized =
                true;
            this.updateRuntimeStatus();
            console.log(
                "CatchTrack erfolgreich gestartet."
            );
            console.log(
                "Datenbank-Version:",
                CatchTrackDatabase.getSchemaVersion()
            );
            console.log(
                "Migrationen:",
                CatchTrackDatabase.getAppliedMigrations()
            );
        }
        catch (error) {
            console.error(
                "CatchTrack Startfehler:",
                error
            );
            if (
                window.CatchTrackErrorHandler
            ) {
                CatchTrackErrorHandler.handle(
                    error,
                    "app:init"
                );
            }
            if (
                window.CatchTrackRuntimeStatus
            ) {
                CatchTrackRuntimeStatus.registerError({
                    level: "ERROR",
                    source: "app:init",
                    message:
                        error?.message ||
                        String(error),
                    stack:
                        error?.stack ||
                        null
                });
            }
            this.renderFatalError(
                error
            );
        }
    }
};
document.addEventListener(
    "DOMContentLoaded",
    () => {
        CatchTrack.init();
    }
);