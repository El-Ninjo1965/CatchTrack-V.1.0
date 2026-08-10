"use strict";


window.CatchTrackUserModule = {

    version: "1.0.0",

    initialized: false,


    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.bindEvents();

        this.refresh();

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

        const identity =
            this.getIdentity();

        return identity.getCurrentUserId();

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


    hasActiveUser() {

        const identity =
            this.getIdentity();

        if (
            typeof identity.hasActiveUser ===
                "function"
        ) {

            return identity.hasActiveUser();

        }

        const userId =
            identity.getCurrentUserId();

        return (
            userId !== null &&
            userId !== undefined &&
            userId !== ""
        );

    },


    refresh() {

        try {

            const identity =
                this.getIdentity();

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


    renderError(error) {

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
                await identity.createUser(
                    {
                        username,
                        displayName:
                            displayName ||
                            username,
                        setCurrent: true
                    }
                );


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