"use strict";


window.CatchTrackIdentity = {

    version: "2.0.0",

    initialized: false,

    currentUserId: null,

    currentUser: null,

    storageKey:
        "identity.currentUserId",


    init() {

        if (
            this.initialized
        ) {

            return true;

        }


        if (
            !window.CatchTrackDatabase ||
            !CatchTrackDatabase.isReady()
        ) {

            throw new Error(
                "Identity Core kann nicht initialisiert werden: Datenbank nicht verfügbar."
            );

        }


        this.initialized =
            true;


        this.restoreCurrentUser();


        this.registerAPI();


        return true;

    },


    registerAPI() {

        if (
            !window.CatchTrackAPI
        ) {

            return false;

        }


        CatchTrackAPI.register(
            "identity.getCurrentUser",
            () =>
                this.getCurrentUser()
        );


        CatchTrackAPI.register(
            "identity.getCurrentUserId",
            () =>
                this.getCurrentUserId()
        );


        CatchTrackAPI.register(
            "identity.hasCurrentUser",
            () =>
                this.hasCurrentUser()
        );


        CatchTrackAPI.register(
            "identity.createUser",
            payload =>
                this.createUser(
                    payload
                )
        );


        CatchTrackAPI.register(
            "identity.setCurrentUser",
            payload =>
                this.setCurrentUser(
                    payload?.userId
                )
        );


        CatchTrackAPI.register(
            "identity.clearCurrentUser",
            () =>
                this.clearCurrentUser()
        );


        CatchTrackAPI.register(
            "identity.updateCurrentUser",
            payload =>
                this.updateCurrentUser(
                    payload
                )
        );


        return true;

    },


    restoreCurrentUser() {

        const storedUserId =
            this.loadStoredUserId();


        if (
            storedUserId === null
        ) {

            this.currentUserId =
                null;

            this.currentUser =
                null;

            return null;

        }


        const user =
            this.findUserById(
                storedUserId
            );


        if (
            !user
        ) {

            this.clearStoredUserId();

            this.currentUserId =
                null;

            this.currentUser =
                null;

            return null;

        }


        this.currentUserId =
            Number(
                user.id
            );

        this.currentUser =
            user;


        return this.currentUser;

    },


    findUserById(userId) {

        const normalizedId =
            this.normalizeUserId(
                userId
            );


        if (
            normalizedId === null
        ) {

            return null;

        }


        const rows =
            CatchTrackDatabase.query(
                `
                    SELECT
                        id,
                        username,
                        display_name,
                        email,
                        created_at,
                        updated_at

                    FROM users

                    WHERE id = ?

                    LIMIT 1;
                `,
                [
                    normalizedId
                ]
            );


        return (
            rows.length
                ? rows[0]
                : null
        );

    },


    findUserByUsername(username) {

        const normalizedUsername =
            this.normalizeUsername(
                username
            );


        if (
            normalizedUsername === null
        ) {

            return null;

        }


        const rows =
            CatchTrackDatabase.query(
                `
                    SELECT
                        id,
                        username,
                        display_name,
                        email,
                        created_at,
                        updated_at

                    FROM users

                    WHERE username = ?

                    LIMIT 1;
                `,
                [
                    normalizedUsername
                ]
            );


        return (
            rows.length
                ? rows[0]
                : null
        );

    },


    createUser(userData = {}) {

        if (
            !this.isReady()
        ) {

            throw new Error(
                "Identity Core ist nicht bereit."
            );

        }


        const username =
            this.normalizeUsername(
                userData.username
            );


        if (
            username === null
        ) {

            throw new Error(
                "Ein gültiger Benutzername ist erforderlich."
            );

        }


        if (
            this.findUserByUsername(
                username
            )
        ) {

            throw new Error(
                `Benutzername bereits vorhanden: ${username}`
            );

        }


        const displayName =
            this.normalizeOptionalText(
                userData.display_name ??
                userData.displayName
            );


        const email =
            this.normalizeOptionalEmail(
                userData.email
            );


        const existingEmail =
            email === null
                ? null
                : this.findUserByEmail(
                    email
                );


        if (
            existingEmail
        ) {

            throw new Error(
                `E-Mail-Adresse bereits vorhanden: ${email}`
            );

        }


        CatchTrackDatabase.execute(
            `
                INSERT INTO users
                (
                    username,
                    display_name,
                    email
                )

                VALUES
                (
                    ?,
                    ?,
                    ?
                );
            `,
            [
                username,
                displayName,
                email
            ]
        );


        const rows =
            CatchTrackDatabase.query(
                `
                    SELECT
                        id,
                        username,
                        display_name,
                        email,
                        created_at,
                        updated_at

                    FROM users

                    WHERE username = ?

                    LIMIT 1;
                `,
                [
                    username
                ]
            );


        if (
            !rows.length
        ) {

            throw new Error(
                "Benutzer konnte nach dem Anlegen nicht gelesen werden."
            );

        }


        const user =
            rows[0];


        this.ensureUserSettings(
            user.id
        );


        this.ensurePrivacySettings(
            user.id
        );


        if (
            userData.setCurrent === true
        ) {

            this.setCurrentUser(
                user.id
            );

            return this.getCurrentUser();

        }


        return {
            ...user
        };

    },


    findUserByEmail(email) {

        const normalizedEmail =
            this.normalizeOptionalEmail(
                email
            );


        if (
            normalizedEmail === null
        ) {

            return null;

        }


        const rows =
            CatchTrackDatabase.query(
                `
                    SELECT
                        id,
                        username,
                        display_name,
                        email,
                        created_at,
                        updated_at

                    FROM users

                    WHERE email = ?

                    LIMIT 1;
                `,
                [
                    normalizedEmail
                ]
            );


        return (
            rows.length
                ? rows[0]
                : null
        );

    },


    updateCurrentUser(userData = {}) {

        const currentUserId =
            this.getCurrentUserId();


        if (
            currentUserId === null
        ) {

            throw new Error(
                "Kein aktueller Benutzer ausgewählt."
            );

        }


        const currentUser =
            this.findUserById(
                currentUserId
            );


        if (
            !currentUser
        ) {

            this.clearCurrentUser();

            throw new Error(
                "Der aktuelle Benutzer existiert nicht mehr."
            );

        }


        const username =
            userData.username === undefined
                ? currentUser.username
                : this.normalizeUsername(
                    userData.username
                );


        if (
            username === null
        ) {

            throw new Error(
                "Ein gültiger Benutzername ist erforderlich."
            );

        }


        const existingUsername =
            this.findUserByUsername(
                username
            );


        if (
            existingUsername &&
            Number(existingUsername.id) !==
            currentUserId
        ) {

            throw new Error(
                `Benutzername bereits vorhanden: ${username}`
            );

        }


        const displayName =
            userData.display_name !== undefined ||
            userData.displayName !== undefined

                ? this.normalizeOptionalText(
                    userData.display_name ??
                    userData.displayName
                )

                : currentUser.display_name;


        const email =
            userData.email !== undefined

                ? this.normalizeOptionalEmail(
                    userData.email
                )

                : currentUser.email;


        if (
            email !== null
        ) {

            const existingEmail =
                this.findUserByEmail(
                    email
                );


            if (
                existingEmail &&
                Number(existingEmail.id) !==
                currentUserId
            ) {

                throw new Error(
                    `E-Mail-Adresse bereits vorhanden: ${email}`
                );

            }

        }


        CatchTrackDatabase.execute(
            `
                UPDATE users

                SET
                    username = ?,
                    display_name = ?,
                    email = ?,
                    updated_at = CURRENT_TIMESTAMP

                WHERE id = ?;
            `,
            [
                username,
                displayName,
                email,
                currentUserId
            ]
        );


        const updatedUser =
            this.findUserById(
                currentUserId
            );


        if (
            !updatedUser
        ) {

            throw new Error(
                "Benutzer konnte nach der Aktualisierung nicht gelesen werden."
            );

        }


        this.currentUser =
            updatedUser;


        return this.getCurrentUser();

    },


    setCurrentUser(userId) {

        const normalizedId =
            this.normalizeUserId(
                userId
            );


        if (
            normalizedId === null
        ) {

            throw new Error(
                "Ungültige user_id."
            );

        }


        const user =
            this.findUserById(
                normalizedId
            );


        if (
            !user
        ) {

            throw new Error(
                `Benutzer nicht gefunden: ${normalizedId}`
            );

        }


        this.currentUserId =
            Number(
                user.id
            );

        this.currentUser =
            user;


        this.saveStoredUserId(
            this.currentUserId
        );


        return this.getCurrentUser();

    },


    clearCurrentUser() {

        this.currentUserId =
            null;

        this.currentUser =
            null;


        this.clearStoredUserId();


        return true;

    },


    getCurrentUserId() {

        if (
            this.currentUserId === null
        ) {

            return null;

        }


        return Number(
            this.currentUserId
        );

    },


    getCurrentUser() {

        if (
            !this.currentUser
        ) {

            return null;

        }


        return {
            ...this.currentUser
        };

    },


    hasCurrentUser() {

        return (
            this.getCurrentUserId() !== null &&
            !!this.currentUser
        );

    },


    ensureUserSettings(userId) {

        const normalizedId =
            this.normalizeUserId(
                userId
            );


        if (
            normalizedId === null
        ) {

            return false;

        }


        CatchTrackDatabase.execute(
            `
                INSERT OR IGNORE INTO user_settings
                (
                    user_id
                )

                VALUES
                (
                    ?
                );
            `,
            [
                normalizedId
            ]
        );


        return true;

    },


    ensurePrivacySettings(userId) {

        const normalizedId =
            this.normalizeUserId(
                userId
            );


        if (
            normalizedId === null
        ) {

            return false;

        }


        CatchTrackDatabase.execute(
            `
                INSERT OR IGNORE INTO privacy_settings
                (
                    user_id
                )

                VALUES
                (
                    ?
                );
            `,
            [
                normalizedId
            ]
        );


        return true;

    },


    loadStoredUserId() {

        if (
            !window.CatchTrackStorageManager
        ) {

            return null;

        }


        const value =
            CatchTrackStorageManager.load(
                this.storageKey,
                null
            );


        return this.normalizeUserId(
            value
        );

    },


    saveStoredUserId(userId) {

        if (
            !window.CatchTrackStorageManager
        ) {

            return false;

        }


        return CatchTrackStorageManager.save(
            this.storageKey,
            Number(userId)
        );

    },


    clearStoredUserId() {

        if (
            !window.CatchTrackStorageManager
        ) {

            return false;

        }


        return CatchTrackStorageManager.remove(
            this.storageKey
        );

    },


    normalizeUserId(userId) {

        if (
            userId === null ||
            userId === undefined ||
            userId === ""
        ) {

            return null;

        }


        const numericId =
            Number(
                userId
            );


        if (
            !Number.isInteger(
                numericId
            ) ||
            numericId <= 0
        ) {

            return null;

        }


        return numericId;

    },


    normalizeUsername(username) {

        if (
            username === null ||
            username === undefined
        ) {

            return null;

        }


        const value =
            String(
                username
            ).trim();


        if (
            !value
        ) {

            return null;

        }


        return value;

    },


    normalizeOptionalText(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return null;

        }


        const normalized =
            String(
                value
            ).trim();


        return normalized
            ? normalized
            : null;

    },


    normalizeOptionalEmail(email) {

        if (
            email === null ||
            email === undefined ||
            email === ""
        ) {

            return null;

        }


        const normalized =
            String(
                email
            )
            .trim()
            .toLowerCase();


        if (
            !normalized
        ) {

            return null;

        }


        return normalized;

    },


    isReady() {

        return (
            this.initialized &&
            !!window.CatchTrackDatabase &&
            CatchTrackDatabase.isReady()
        );

    }

};