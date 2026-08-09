"use strict";

window.CatchTrackGPSModule = {

    version: "2.1.0",

    storageKeys: {
        lastPosition: "gps:lastPosition",
        homePosition: "gps:homePosition"
    },

    state: {
        initialized: false,
        busy: false,
        currentPosition: null,
        homePosition: null,
        lastError: null
    },

    init() {
        this.loadStoredState();
        this.bindEvents();
        this.render();

        if (!this.state.initialized) {
            this.state.initialized = true;
            this.requestPosition().catch(() => {});
        }
    },

    loadStoredState() {
        const storage =
            window.CatchTrackStorageManager;

        if (
            !storage ||
            typeof storage.load !== "function"
        ) {
            return;
        }

        this.state.currentPosition =
            this.normalizePosition(
                storage.load(
                    this.storageKeys.lastPosition,
                    null
                )
            );

        this.state.homePosition =
            this.normalizePosition(
                storage.load(
                    this.storageKeys.homePosition,
                    null
                )
            );
    },

    savePosition(position, key) {
        const storage =
            window.CatchTrackStorageManager;

        if (
            !storage ||
            typeof storage.save !== "function"
        ) {
            return false;
        }

        return storage.save(
            key,
            position
        );
    },

    removeStoredPosition(key) {
        const storage =
            window.CatchTrackStorageManager;

        if (
            !storage ||
            typeof storage.remove !== "function"
        ) {
            return false;
        }

        return storage.remove(key);
    },

    normalizePosition(position) {
        if (
            !position ||
            typeof position !== "object"
        ) {
            return null;
        }

        const latitude =
            Number(position.latitude);

        const longitude =
            Number(position.longitude);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return null;
        }

        const accuracy =
            Number(position.accuracy);

        const altitude =
            Number(position.altitude);

        let timestamp =
            new Date().toISOString();

        if (position.timestamp) {
            const date =
                new Date(position.timestamp);

            if (!Number.isNaN(date.getTime())) {
                timestamp =
                    date.toISOString();
            }
        }

        return {
            latitude,
            longitude,
            accuracy:
                Number.isFinite(accuracy)
                    ? accuracy
                    : null,
            altitude:
                Number.isFinite(altitude)
                    ? altitude
                    : null,
            timestamp,
            source:
                position.source || "gps"
        };
    },

    requestPosition() {
        if (this.state.busy) {
            return Promise.resolve(
                this.state.currentPosition
            );
        }

        if (!navigator.geolocation) {
            const error =
                new Error(
                    "Geolocation is not supported."
                );

            this.handleError(
                error,
                "gps:unsupported"
            );

            this.setStatus("error");
            this.setMessage(
                this.translate(
                    "gps.error.unsupported",
                    "Dieser Browser unterstützt keine Standortbestimmung."
                ),
                "error"
            );
            this.render();

            return Promise.reject(error);
        }

        this.state.busy = true;
        this.state.lastError = null;

        this.setStatus("loading");
        this.setMessage(
            this.translate(
                "gps.message.requesting",
                "Standort wird ermittelt …"
            ),
            "info"
        );
        this.render();

        return new Promise(
            (resolve, reject) => {

                navigator.geolocation.getCurrentPosition(

                    position => {

                        const normalized =
                            this.normalizePosition({
                                latitude:
                                    position.coords.latitude,
                                longitude:
                                    position.coords.longitude,
                                accuracy:
                                    position.coords.accuracy,
                                altitude:
                                    position.coords.altitude,
                                timestamp:
                                    position.timestamp,
                                source:
                                    "gps"
                            });

                        this.state.busy =
                            false;

                        this.state.currentPosition =
                            normalized;

                        this.state.lastError =
                            null;

                        this.savePosition(
                            normalized,
                            this.storageKeys.lastPosition
                        );

                        this.setStatus(
                            "success"
                        );

                        this.setMessage(
                            this.translate(
                                "gps.message.success",
                                "Standort wurde ermittelt."
                            ),
                            "success"
                        );

                        this.render();

                        resolve(
                            normalized
                        );
                    },

                    error => {

                        this.state.busy =
                            false;

                        this.state.lastError =
                            error;

                        this.setStatus(
                            "error"
                        );

                        this.setMessage(
                            this.getGeolocationErrorMessage(
                                error
                            ),
                            "error"
                        );

                        this.render();

                        this.handleError(
                            error,
                            "gps:geolocation"
                        );

                        reject(error);
                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    }
                );
            }
        );
    },

    getGeolocationErrorMessage(error) {
        if (!error) {
            return this.translate(
                "gps.error.unknown",
                "Der Standort konnte nicht ermittelt werden."
            );
        }

        switch (error.code) {

            case 1:
                return this.translate(
                    "gps.error.permission",
                    "Der Zugriff auf den Standort wurde verweigert."
                );

            case 2:
                return this.translate(
                    "gps.error.unavailable",
                    "Der Standort ist derzeit nicht verfügbar."
                );

            case 3:
                return this.translate(
                    "gps.error.timeout",
                    "Die Standortbestimmung hat zu lange gedauert."
                );

            default:
                return this.translate(
                    "gps.error.unknown",
                    "Der Standort konnte nicht ermittelt werden."
                );
        }
    },

    saveHomePosition() {
        if (!this.state.currentPosition) {

            this.setStatus("error");

            this.setMessage(
                this.translate(
                    "gps.message.noPosition",
                    "Es ist kein aktueller Standort vorhanden."
                ),
                "error"
            );

            this.render();

            return false;
        }

        const home = {
            ...this.state.currentPosition,
            source: "saved"
        };

        const saved =
            this.savePosition(
                home,
                this.storageKeys.homePosition
            );

        if (!saved) {

            this.setStatus("error");

            this.setMessage(
                this.translate(
                    "gps.error.storage",
                    "Der Standort konnte nicht gespeichert werden."
                ),
                "error"
            );

            this.render();

            return false;
        }

        this.state.homePosition =
            home;

        this.setStatus("success");

        this.setMessage(
            this.translate(
                "gps.message.saved",
                "Home-Standort wurde gespeichert."
            ),
            "success"
        );

        this.render();

        return true;
    },

    deleteHomePosition() {
        this.removeStoredPosition(
            this.storageKeys.homePosition
        );

        this.state.homePosition =
            null;

        this.setMessage(
            this.translate(
                "gps.message.deleted",
                "Home-Standort wurde gelöscht."
            ),
            "success"
        );

        this.render();

        return true;
    },

    clearCurrentPosition() {
        this.state.currentPosition =
            null;

        this.state.lastError =
            null;

        this.removeStoredPosition(
            this.storageKeys.lastPosition
        );

        this.setStatus("idle");

        this.setMessage(
            this.translate(
                "gps.message.cleared",
                "Anzeige wurde zurückgesetzt."
            ),
            "info"
        );

        this.render();
    },

    calculateDistance(first, second) {
        const a =
            this.normalizePosition(first);

        const b =
            this.normalizePosition(second);

        if (!a || !b) {
            return null;
        }

        const earthRadius =
            6371000;

        const latitude1 =
            a.latitude *
            Math.PI /
            180;

        const latitude2 =
            b.latitude *
            Math.PI /
            180;

        const deltaLatitude =
            (b.latitude - a.latitude) *
            Math.PI /
            180;

        const deltaLongitude =
            (b.longitude - a.longitude) *
            Math.PI /
            180;

        const sinLatitude =
            Math.sin(
                deltaLatitude / 2
            );

        const sinLongitude =
            Math.sin(
                deltaLongitude / 2
            );

        const value =
            sinLatitude * sinLatitude +
            Math.cos(latitude1) *
            Math.cos(latitude2) *
            sinLongitude * sinLongitude;

        const angularDistance =
            2 *
            Math.atan2(
                Math.sqrt(value),
                Math.sqrt(1 - value)
            );

        return (
            earthRadius *
            angularDistance
        );
    },

    getDistanceFromHome() {
        return this.calculateDistance(
            this.state.currentPosition,
            this.state.homePosition
        );
    },

    getPosition() {
        return this.state.currentPosition
            ? {
                ...this.state.currentPosition
            }
            : null;
    },

    getCoordinates() {
        const position =
            this.getPosition();

        if (!position) {
            return null;
        }

        return {
            latitude:
                position.latitude,
            longitude:
                position.longitude
        };
    },

    getHomePosition() {
        return this.state.homePosition
            ? {
                ...this.state.homePosition
            }
            : null;
    },

    getDistanceFromHomeMeters() {
        return this.getDistanceFromHome();
    },

    formatDistance(meters) {
        if (!Number.isFinite(meters)) {
            return "--";
        }

        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        }

        return `${(
            meters / 1000
        ).toFixed(2)} km`;
    },

    shareCurrentPosition() {
        const position =
            this.getPosition();

        if (!position) {
            return Promise.reject(
                new Error(
                    "No current position available."
                )
            );
        }

        const latitude =
            position.latitude.toFixed(6);

        const longitude =
            position.longitude.toFixed(6);

        const url =
            `https://www.google.com/maps?q=${latitude},${longitude}`;

        const text =
            `${latitude}, ${longitude}`;

        if (
            navigator.share &&
            typeof navigator.share === "function"
        ) {
            return navigator.share({
                title:
                    this.translate(
                        "gps.share.title",
                        "CatchTrack Position"
                    ),
                text,
                url
            });
        }

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
            "function"
        ) {
            return navigator.clipboard.writeText(
                `${text}\n${url}`
            );
        }

        return Promise.reject(
            new Error(
                "Web Share and Clipboard are unavailable."
            )
        );
    },

    bindEvents() {
        document
            .getElementById(
                "gps-update-button"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.requestPosition()
                        .catch(() => {});
                }
            );

        document
            .getElementById(
                "gps-clear-button"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.clearCurrentPosition();
                }
            );

        document
            .getElementById(
                "gps-save-home-button"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.saveHomePosition();
                }
            );

        document
            .getElementById(
                "gps-delete-home-button"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.deleteHomePosition();
                }
            );

        document
            .getElementById(
                "gps-share-button"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.shareCurrentPosition()
                        .catch(
                            error => {
                                this.handleError(
                                    error,
                                    "gps:share"
                                );
                            }
                        );
                }
            );
    },

    translate(
        key,
        fallback = key
    ) {
        const manager =
            window.CatchTrackLanguageManager;

        if (
            manager &&
            typeof manager.t === "function"
        ) {
            return manager.t(
                key,
                fallback
            );
        }

        return fallback;
    },

    setStatus(state) {
        const badge =
            document.getElementById(
                "gps-status-badge"
            );

        if (!badge) {
            return;
        }

        badge.dataset.state =
            state;

        badge.textContent =
            this.translate(
                `gps.status.${state}`,
                state
            );
    },

    setMessage(
        message,
        type = "info"
    ) {
        const element =
            document.getElementById(
                "gps-message"
            );

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.dataset.type =
            type;
    },

    render() {
        this.renderPosition();
        this.renderHome();
        this.renderDistance();
        this.renderDynamicText();

        if (!this.state.busy) {
            this.setStatus(
                this.state.lastError
                    ? "error"
                    : this.state.currentPosition
                        ? "success"
                        : "idle"
            );
        }
    },

    renderDynamicText() {
        const source =
            document.getElementById(
                "gps-source"
            );

        if (source) {
            source.textContent =
                this.state.currentPosition
                    ? this.translate(
                        this.state.currentPosition.source === "saved"
                            ? "gps.source.saved"
                            : "gps.source.gps"
                    )
                    : this.translate(
                        "gps.source.none"
                    );
        }

        const homeStatus =
            document.getElementById(
                "gps-home-status"
            );

        if (homeStatus) {
            homeStatus.textContent =
                this.state.homePosition
                    ? this.translate(
                        "gps.home.saved"
                    )
                    : this.translate(
                        "gps.home.none"
                    );
        }
    },

    renderPosition() {
        const position =
            this.state.currentPosition;

        const latitude =
            document.getElementById(
                "gps-latitude"
            );

        const longitude =
            document.getElementById(
                "gps-longitude"
            );

        const accuracy =
            document.getElementById(
                "gps-accuracy"
            );

        const altitude =
            document.getElementById(
                "gps-altitude"
            );

        const timestamp =
            document.getElementById(
                "gps-timestamp"
            );

        if (latitude) {
            latitude.textContent =
                position
                    ? position.latitude.toFixed(6)
                    : "--";
        }

        if (longitude) {
            longitude.textContent =
                position
                    ? position.longitude.toFixed(6)
                    : "--";
        }

        if (accuracy) {
            accuracy.textContent =
                position &&
                Number.isFinite(
                    position.accuracy
                )
                    ? `±${Math.round(
                        position.accuracy
                    )} m`
                    : "--";
        }

        if (altitude) {
            altitude.textContent =
                position &&
                Number.isFinite(
                    position.altitude
                )
                    ? `${position.altitude.toFixed(
                        1
                    )} m`
                    : "--";
        }

        if (timestamp) {
            timestamp.textContent =
                position
                    ? this.formatTimestamp(
                        position.timestamp
                    )
                    : "--";
        }
    },

    renderHome() {
        const container =
            document.getElementById(
                "gps-home-position"
            );

        if (!container) {
            return;
        }

        const position =
            this.state.homePosition;

        if (!position) {
            container.innerHTML =
                `<span>${this.translate(
                    "gps.home.empty",
                    "Kein Home-Standort vorhanden."
                )}</span>`;

            return;
        }

        container.innerHTML =
            `<div class="gps-home-coordinate">
                <div>
                    <span>${this.translate(
                        "gps.latitude",
                        "Breitengrad"
                    )}</span>
                    <strong>${position.latitude.toFixed(
                        6
                    )}</strong>
                </div>

                <div>
                    <span>${this.translate(
                        "gps.longitude",
                        "Längengrad"
                    )}</span>
                    <strong>${position.longitude.toFixed(
                        6
                    )}</strong>
                </div>
            </div>`;
    },

    renderDistance() {
        const element =
            document.getElementById(
                "gps-distance-value"
            );

        if (!element) {
            return;
        }

        element.textContent =
            this.formatDistance(
                this.getDistanceFromHome()
            );
    },

    formatTimestamp(timestamp) {
        const date =
            new Date(timestamp);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "--";
        }

        try {
            return new Intl.DateTimeFormat(
                undefined,
                {
                    dateStyle: "short",
                    timeStyle: "medium"
                }
            ).format(date);
        }

        catch (_) {
            return date.toLocaleString();
        }
    },

    handleError(
        error,
        source
    ) {
        const handler =
            window.CatchTrackErrorHandler;

        if (
            handler &&
            typeof handler.handle === "function"
        ) {
            handler.handle(
                error,
                source
            );
        }
    }
};