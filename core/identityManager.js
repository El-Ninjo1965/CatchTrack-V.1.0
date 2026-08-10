"use strict";


window.CatchTrackIdentity = {

    version: "1.0.0",

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


    isReady() {

        return (
            this.initialized &&
            !!window.CatchTrackDatabase &&
            CatchTrackDatabase.isReady()
        );

    }

};