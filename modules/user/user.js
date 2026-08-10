"use strict";


window.CatchTrackUserModule = {

    version: "1.1.0",

    initialized: false,

    schemaRepairVersion: "5",


    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        try {

            this.ensureUserSchema();

        }
        catch (error) {

            this.handleError(
                error,
                "user:schema"
            );

        }

        this.bindEvents();

        this.refresh();

    },


    ensureUserSchema() {

        const database =
            window.CatchTrackDatabase;

        if (
            !database ||
            !database.isReady()
        ) {

            throw new Error(
                "Datenbank ist für die User-Schema-Prüfung nicht verfügbar."
            );

        }


        const columns =
            database.getTableColumns(
                "users"
            );


        if (!columns.length) {

            throw new Error(
                "Die Tabelle users ist nicht vorhanden."
            );

        }


        const missingColumns = [];


        if (
            !columns.includes(
                "display_name"
            )
        ) {

            database.database.exec(`
                ALTER TABLE users
                ADD COLUMN display_name TEXT;
            `);

            missingColumns.push(
                "display_name"
            );

        }


        const refreshedColumns =
            database.getTableColumns(
                "users"
            );


        if (
            !refreshedColumns.includes(
                "email"
            )
        ) {

            database.database.exec(`
                ALTER TABLE users
                ADD COLUMN email TEXT;
            `);

            missingColumns.push(
                "email"
            );

        }


        const finalColumns =
            database.getTableColumns(
                "users"
            );


        if (
            !finalColumns.includes(
                "created_at"
            )
        ) {

            database.database.exec(`
                ALTER TABLE users
                ADD COLUMN created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP;
            `);

            missingColumns.push(
                "created_at"
            );

        }


        const afterCreatedAt =
            database.getTableColumns(
                "users"
            );


        if (
            !afterCreatedAt.includes(
                "updated_at"
            )
        ) {

            database.database.exec(`
                ALTER TABLE users
                ADD COLUMN updated_at DATETIME
                DEFAULT CURRENT_TIMESTAMP;
            `);

            missingColumns.push(
                "updated_at"
            );

        }


        const settingsTable =
            database.getTableColumns(
                "user_settings"
            );


        if (
            !settingsTable.length
        ) {

            database.database.exec(`

                CREATE TABLE IF NOT EXISTS user_settings (

                    user_id INTEGER PRIMARY KEY,

                    language TEXT
                        NOT NULL
                        DEFAULT 'de',

                    timezone TEXT,

                    created_at DATETIME
                        NOT NULL
                        DEFAULT CURRENT_TIMESTAMP,

                    updated_at DATETIME
                        NOT NULL
                        DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (user_id)
                        REFERENCES users(id)
                        ON DELETE CASCADE

                );

            `);

            missingColumns.push(
                "user_settings"
            );

        }


        const privacyTable =
            database.getTableColumns(
                "privacy_settings"
            );


        if (
            !privacyTable.length
        ) {

            database.database.exec(`

                CREATE TABLE IF NOT EXISTS privacy_settings (

                    user_id INTEGER PRIMARY KEY,

                    location_sharing INTEGER
                        NOT NULL
                        DEFAULT 0,

                    home_location_sharing INTEGER
                        NOT NULL
                        DEFAULT 0,

                    social_sharing INTEGER
                        NOT NULL
                        DEFAULT 0,

                    created_at DATETIME
                        NOT NULL
                        DEFAULT CURRENT_TIMESTAMP,

                    updated_at DATETIME
                        NOT NULL
                        DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (user_id)
                        REFERENCES users(id)
                        ON DELETE CASCADE

                );

            `);

            missingColumns.push(
                "privacy_settings"
            );

        }


        database.database.exec(`

            CREATE INDEX IF NOT EXISTS idx_users_username
                ON users(username);

            CREATE INDEX IF NOT EXISTS idx_users_email
                ON users(email);

        `);


        this.ensureMigrationRecord();


        database.saveDatabase();


        return {
            repaired:
                missingColumns.length > 0,

            changes:
                missingColumns

        };

    },


    ensureMigrationRecord() {

        const database =
            window.CatchTrackDatabase;

        if (
            !database ||
            !database.database
        ) {

            return false;

        }


        database.database.exec(`

            CREATE TABLE IF NOT EXISTS migrations (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                version TEXT NOT NULL UNIQUE,

                description TEXT,

                applied_at DATETIME
                    NOT NULL
                    DEFAULT CURRENT_TIMESTAMP

            );

        `);


        database.markMigrationApplied(
            this.schemaRepairVersion,
            "User schema compatibility repair"
        );


        database.updateSchemaVersion();


        return true;

    },


    bindEvents() {

        const form =
            document.getElementById(
                "user-create-form"
            );

        if (form) {

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.createUser();

                }
            );

        }


        const refreshButton =
            document.getElementById(
                "user-refresh-button"
            );

        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                () => {

                    this.refresh();

                }
            );

        }

    },


    getIdentity() {

        const identity =
            window.CatchTrackIdentity;

        if (
            !identity ||
            typeof identity.getCurrentUserId !==
                "function"
        ) {

            throw new Error(
                "Identity Core ist nicht verfügbar."
            );

        }

        return identity;

    },


    getCurrentUserId() {

        return this.getIdentity()
            .getCurrentUserId();

    },


    getCurrentUser() {

        const identity =
            this.getIdentity();

        if (
            typeof identity.getCurrentUser !==
                "function"
        ) {

            return null;

        }

        return identity.getCurrentUser();

    },


    refresh() {

        try {

            const userId =
                this.getCurrentUserId();

            const user =
                this.getCurrentUser();


            if (
                userId === null ||
                userId === undefined ||
                userId === ""
            ) {

                this.renderNoUser();

                return;

            }


            this.renderUser(
                userId,
                user
            );

        }
        catch (error) {

            this.renderError(
                error
            );

            this.handleError(
                error,
                "user:refresh"
            );

        }

    },


    renderUser(
        userId,
        user
    ) {

        this.setText(
            "user-id",
            userId
        );

        this.setText(
            "user-username",
            user?.username ||
            "–"
        );

        this.setText(
            "user-display-name",
            user?.display_name ||
            user?.displayName ||
            user?.username ||
            "–"
        );

        this.setText(
            "user-active-status",
            "Aktiv"
        );

        this.setStatus(
            "Aktiver Benutzer vorhanden.",
            "success"
        );

        this.setCreateFormVisible(
            false
        );

    },


    renderNoUser() {

        this.setText(
            "user-id",
            "–"
        );

        this.setText(
            "user-username",
            "–"
        );

        this.setText(
            "user-display-name",
            "–"
        );

        this.setText(
            "user-active-status",
            "Kein Benutzer"
        );

        this.setStatus(
            "Noch kein aktiver Benutzer vorhanden.",
            "info"
        );

        this.setCreateFormVisible(
            true
        );

    },


    renderError(
        error
    ) {

        this.setText(
            "user-id",
            "–"
        );

        this.setText(
            "user-username",
            "–"
        );

        this.setText(
            "user-display-name",
            "–"
        );

        this.setText(
            "user-active-status",
            "Fehler"
        );

        this.setStatus(
            error?.message ||
            "Benutzerstatus konnte nicht geladen werden.",
            "error"
        );

        this.setCreateFormVisible(
            true
        );

    },


    async createUser() {

        const button =
            document.getElementById(
                "user-create-button"
            );

        const usernameInput =
            document.getElementById(
                "user-username-input"
            );

        const displayNameInput =
            document.getElementById(
                "user-display-name-input"
            );


        if (!usernameInput) {
            return;
        }


        const username =
            usernameInput.value.trim();

        const displayName =
            displayNameInput
                ? displayNameInput.value.trim()
                : "";


        if (!username) {

            this.setFormMessage(
                "Bitte einen Benutzernamen eingeben.",
                "error"
            );

            return;

        }


        try {

            if (button) {
                button.disabled = true;
            }


            this.setFormMessage(
                "Benutzer wird angelegt …",
                "info"
            );


            this.ensureUserSchema();


            const identity =
                this.getIdentity();


            if (
                typeof identity.createUser !==
                    "function"
            ) {

                throw new Error(
                    "Der Identity Core unterstützt das Anlegen von Benutzern nicht."
                );

            }


            const user =
                await identity.createUser({

                    username,

                    displayName:
                        displayName ||
                        username,

                    setCurrent:
                        true

                });


            if (!user) {

                throw new Error(
                    "Benutzer konnte nicht angelegt werden."
                );

            }


            this.setFormMessage(
                "Benutzer wurde erfolgreich angelegt.",
                "success"
            );


            this.refresh();


            const form =
                document.getElementById(
                    "user-create-form"
                );

            if (form) {
                form.reset();
            }

        }
        catch (error) {

            this.setFormMessage(
                error?.message ||
                "Benutzer konnte nicht angelegt werden.",
                "error"
            );

            this.handleError(
                error,
                "user:create"
            );

        }
        finally {

            if (button) {
                button.disabled = false;
            }

        }

    },


    setCreateFormVisible(
        visible
    ) {

        const form =
            document.getElementById(
                "user-create-form"
            );

        if (!form) {
            return;
        }


        const section =
            form.closest(
                ".user-card"
            );


        if (section) {

            section.hidden =
                !visible;

        }

    },


    setStatus(
        message,
        type = "info"
    ) {

        const element =
            document.getElementById(
                "user-status"
            );

        if (!element) {
            return;
        }


        element.textContent =
            message || "";

        element.className =
            "user-status";

        element.classList.add(
            `user-status-${type}`
        );

    },


    setFormMessage(
        message,
        type = "info"
    ) {

        const element =
            document.getElementById(
                "user-form-message"
            );

        if (!element) {
            return;
        }


        element.textContent =
            message || "";

        element.className =
            "user-message";

        element.classList.add(
            `user-message-${type}`
        );

    },


    setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );

        if (element) {

            element.textContent =
                value === null ||
                value === undefined ||
                value === ""
                    ? "–"
                    : String(value);

        }

    },


    handleError(
        error,
        source
    ) {

        if (
            window.CatchTrackErrorHandler &&
            typeof CatchTrackErrorHandler.handle ===
                "function"
        ) {

            CatchTrackErrorHandler.handle(
                error,
                source
            );

            return;

        }


        console.error(
            source,
            error
        );

    }

};