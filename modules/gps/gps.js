"use strict";

window.CatchTrackGPS = {

    version: "2.0.0",

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
        if (this.state.initialized) {
            return;
        }

        this.state.initialized = true;

        this.registerTranslations();
        this.loadStoredState();
        this.bindEvents();
        this.render();
    },

    registerTranslations() {
        const languageManager =
            window.CatchTrackLanguageManager;

        if (
            !languageManager ||
            typeof languageManager.register !== "function"
        ) {
            return;
        }

        languageManager.register("de", {
            "gps.title": "GPS",
            "gps.subtitle": "Standortverwaltung",
            "gps.status.idle": "Bereit",
            "gps.status.loading": "Standort wird ermittelt",
            "gps.status.success": "Position verfügbar",
            "gps.status.error": "Fehler",
            "gps.current.title": "Aktueller Standort",
            "gps.source.none": "Keine Position",
            "gps.source.gps": "GPS / Browser",
            "gps.source.saved": "Gespeichert",
            "gps.latitude": "Breitengrad",
            "gps.longitude": "Längengrad",
            "gps.accuracy": "Genauigkeit",
            "gps.altitude": "Höhe",
            "gps.timestamp": "Zeitpunkt",
            "gps.action.update": "Standort ermitteln",
            "gps.action.clear": "Anzeige zurücksetzen",
            "gps.home.title": "Home-Standort",
            "gps.home.description": "Ein gespeicherter Referenzstandort.",
            "gps.home.none": "Nicht gespeichert",
            "gps.home.saved": "Gespeichert",
            "gps.home.empty": "Kein Home-Standort vorhanden.",
            "gps.action.saveHome": "Aktuellen Standort als Home speichern",
            "gps.action.deleteHome": "Home löschen",
            "gps.distance.title": "Entfernung",
            "gps.distance.description":
                "Entfernung zwischen aktuellem Standort und Home.",
            "gps.message.requesting": "Standort wird ermittelt …",
            "gps.message.success": "Standort wurde ermittelt.",
            "gps.message.saved": "Home-Standort wurde gespeichert.",
            "gps.message.deleted": "Home-Standort wurde gelöscht.",
            "gps.message.cleared": "Anzeige wurde zurückgesetzt.",
            "gps.message.noPosition":
                "Es ist kein aktueller Standort vorhanden.",
            "gps.error.unsupported":
                "Dieser Browser unterstützt keine Standortbestimmung.",
            "gps.error.permission":
                "Der Zugriff auf den Standort wurde verweigert.",
            "gps.error.unavailable":
                "Der Standort ist derzeit nicht verfügbar.",
            "gps.error.timeout":
                "Die Standortbestimmung hat zu lange gedauert.",
            "gps.error.unknown":
                "Der Standort konnte nicht ermittelt werden.",
            "gps.error.storage":
                "Der Standort konnte nicht gespeichert werden."
        });

        languageManager.register("en", {
            "gps.title": "GPS",
            "gps.subtitle": "Location management",
            "gps.status.idle": "Ready",
            "gps.status.loading": "Determining location",
            "gps.status.success": "Position available",
            "gps.status.error": "Error",
            "gps.current.title": "Current location",
            "gps.source.none": "No position",
            "gps.source.gps": "GPS / Browser",
            "gps.source.saved": "Saved",
            "gps.latitude": "Latitude",
            "gps.longitude": "Longitude",
            "gps.accuracy": "Accuracy",
            "gps.altitude": "Altitude",
            "gps.timestamp": "Timestamp",
            "gps.action.update": "Get location",
            "gps.action.clear": "Clear display",
            "gps.home.title": "Home location",
            "gps.home.description": "A saved reference location.",
            "gps.home.none": "Not saved",
            "gps.home.saved": "Saved",
            "gps.home.empty": "No home location saved.",
            "gps.action.saveHome": "Save current location as home",
            "gps.action.deleteHome": "Delete home",
            "gps.distance.title": "Distance",
            "gps.distance.description":
                "Distance between current location and home.",
            "gps.message.requesting": "Determining location …",
            "gps.message.success": "Location determined.",
            "gps.message.saved": "Home location saved.",
            "gps.message.deleted": "Home location deleted.",
            "gps.message.cleared": "Display cleared.",
            "gps.message.noPosition": "No current location is available.",
            "gps.error.unsupported":
                "This browser does not support location services.",
            "gps.error.permission": "Location access was denied.",
            "gps.error.unavailable":
                "The location is currently unavailable.",
            "gps.error.timeout": "Location detection timed out.",
            "gps.error.unknown":
                "The location could not be determined.",
            "gps.error.storage":
                "The location could not be saved."
        });
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
                storage.load(this.storageKeys.lastPosition)
            );

        this.state.homePosition =
            this.normalizePosition(
                storage.load(this.storageKeys.homePosition)
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

        return storage.save(key, position);
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

        const latitude = Number(position.latitude);
        const longitude = Number(position.longitude);

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

        const accuracy = Number(position.accuracy);
        const altitude = Number(position.altitude);

        let timestamp;

        if (position.timestamp) {
            const date = new Date(position.timestamp);

            timestamp = Number.isNaN(date.getTime())
                ? new Date().toISOString()
                : date.toISOString();
        } else {
            timestamp = new Date().toISOString();
        }

        return {
            latitude,
            longitude,
            accuracy: Number.isFinite(accuracy) ? accuracy : null,
            altitude: Number.isFinite(altitude) ? altitude : null,
            timestamp,
            source: position.source || "gps"
        };
    },

    requestPosition() {
        if (this.state.busy) {
            return Promise.resolve(this.getPosition());
        }

        if (!navigator.geolocation) {
            const error = new Error(
                this.translate(
                    "gps.error.unsupported",
                    "Location services are not supported."
                )
            );

            this.handleError(error, "gps:unsupported");

            return Promise.reject(error);
        }

        this.state.busy = true;
        this.state.lastError = null;

        this.setStatus("loading");

        this.setMessage(
            this.translate(
                "gps.message.requesting",
                "Determining location …"
            ),
            "info"
        );

        this.render();

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const normalized =
                        this.normalizePosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude,
                            timestamp: position.timestamp,
                            source: "gps"
                        });

                    this.state.busy = false;
                    this.state.currentPosition = normalized;

                    const saved =
                        this.savePosition(
                            normalized,
                            this.storageKeys.lastPosition
                        );

                    if (!saved) {
                        this.setMessage(
                            this.translate(
                                "gps.error.storage",
                                "Location could not be saved."
                            ),
                            "error"
                        );
                    } else {
                        this.setMessage(
                            this.translate(
                                "gps.message.success",
                                "Location determined."
                            ),
                            "success"
                        );
                    }

                    this.setStatus("success");
                    this.render();

                    resolve(normalized);
                },

                error => {
                    this.state.busy = false;
                    this.state.lastError = error;

                    this.setStatus("error");

                    this.setMessage(
                        this.getGeolocationErrorMessage(error),
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
        });
    },

    getGeolocationErrorMessage(error) {
        if (!error) {
            return this.translate(
                "gps.error.unknown",
                "Location could not be determined."
            );
        }

        switch (error.code) {
            case 1:
                return this.translate(
                    "gps.error.permission",
                    "Location access was denied."
                );

            case 2:
                return this.translate(
                    "gps.error.unavailable",
                    "Location is currently unavailable."
                );

            case 3:
                return this.translate(
                    "gps.error.timeout",
                    "Location detection timed out."
                );

            default:
                return this.translate(
                    "gps.error.unknown",
                    "Location could not be determined."
                );
        }
    },

    saveHomePosition() {
        if (!this.state.currentPosition) {
            this.setMessage(
                this.translate(
                    "gps.message.noPosition",
                    "No current location is available."
                ),
                "error"
            );

            this.setStatus("error");
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
            this.setMessage(
                this.translate(
                    "gps.error.storage",
                    "Location could not be saved."
                ),
                "error"
            );

            this.setStatus("error");
            this.render();

            return false;
        }

        this.state.homePosition = home;

        this.setMessage(
            this.translate(
                "gps.message.saved",
                "Home location saved."
            ),
            "success"
        );

        this.setStatus("success");
        this.render();

        return true;
    },

    deleteHomePosition() {
        const removed =
            this.removeStoredPosition(
                this.storageKeys.homePosition
            );

        this.state.homePosition = null;

        this.setMessage(
            this.translate(
                "gps.message.deleted",
                "Home location deleted."
            ),
            removed ? "success" : "info"
        );

        this.render();

        return removed;
    },

    clearCurrentPosition() {
        this.state.currentPosition = null;
        this.state.lastError = null;

        this.removeStoredPosition(
            this.storageKeys.lastPosition
        );

        this.setStatus("idle");

        this.setMessage(
            this.translate(
                "gps.message.cleared",
                "Display cleared."
            ),
            "info"
        );

        this.render();
    },

    calculateDistance(first, second) {
        const a = this.normalizePosition(first);
        const b = this.normalizePosition(second);

        if (!a || !b) {
            return null;
        }

        const earthRadius = 6371000;

        const lat1 =
            a.latitude * Math.PI / 180;

        const lat2 =
            b.latitude * Math.PI / 180;

        const deltaLat =
            (b.latitude - a.latitude) *
            Math.PI / 180;

        const deltaLon =
            (b.longitude - a.longitude) *
            Math.PI / 180;

        const sinLat =
            Math.sin(deltaLat / 2);

        const sinLon =
            Math.sin(deltaLon / 2);

        const haversine =
            sinLat * sinLat +
            Math.cos(lat1) *
            Math.cos(lat2) *
            sinLon * sinLon;

        const angular =
            2 *
            Math.atan2(
                Math.sqrt(haversine),
                Math.sqrt(1 - haversine)
            );

        return earthRadius * angular;
    },

    getDistanceFromHome() {
        return this.calculateDistance(
            this.state.currentPosition,
            this.state.homePosition
        );
    },

    getPosition() {
        return this.state.currentPosition
            ? { ...this.state.currentPosition }
            : null;
    },

    getCoordinates() {
        const position = this.getPosition();

        if (!position) {
            return null;
        }

        return {
            latitude: position.latitude,
            longitude: position.longitude
        };
    },

    getHomePosition() {
        return this.state.homePosition
            ? { ...this.state.homePosition }
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

        return `${(meters / 1000).toFixed(2)} km`;
    },

    bindEvents() {
        document
            .getElementById("gps-update-button")
            ?.addEventListener("click", () => {
                this.requestPosition().catch(() => {});
            });

        document
            .getElementById("gps-clear-button")
            ?.addEventListener("click", () => {
                this.clearCurrentPosition();
            });

        document
            .getElementById("gps-save-home-button")
            ?.addEventListener("click", () => {
                this.saveHomePosition();
            });

        document
            .getElementById("gps-delete-home-button")
            ?.addEventListener("click", () => {
                this.deleteHomePosition();
            });
    },

    translate(key, fallback = key) {
        const manager =
            window.CatchTrackLanguageManager;

        if (
            manager &&
            typeof manager.t === "function"
        ) {
            return manager.t(key, fallback);
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

        badge.dataset.state = state;

        badge.textContent =
            this.translate(
                `gps.status.${state}`,
                state
            );
    },

    setMessage(message, type = "info") {
        const element =
            document.getElementById(
                "gps-message"
            );

        if (!element) {
            return;
        }

        element.textContent = message || "";
        element.dataset.type = type;
    },

    render() {
        this.renderPosition();
        this.renderHome();
        this.renderDistance();
        this.renderDynamicText();

        this.setStatus(
            this.state.busy
                ? "loading"
                : this.state.lastError
                    ? "error"
                    : this.state.currentPosition
                        ? "success"
                        : "idle"
        );
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
                Number.isFinite(position.accuracy)
                    ? `±${Math.round(position.accuracy)} m`
                    : "--";
        }

        if (altitude) {
            altitude.textContent =
                position &&
                Number.isFinite(position.altitude)
                    ? `${position.altitude.toFixed(1)} m`
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
                    "No home location saved."
                )}</span>`;

            return;
        }

        container.innerHTML =
            `<div class="gps-home-coordinate">
                <div>
                    <span>${this.translate(
                        "gps.latitude",
                        "Latitude"
                    )}</span>
                    <strong>${position.latitude.toFixed(6)}</strong>
                </div>

                <div>
                    <span>${this.translate(
                        "gps.longitude",
                        "Longitude"
                    )}</span>
                    <strong>${position.longitude.toFixed(6)}</strong>
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

        if (Number.isNaN(date.getTime())) {
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
        } catch (_) {
            return date.toLocaleString();
        }
    },

    handleError(error, source) {
        const handler =
            window.CatchTrackErrorHandler;

        if (
            handler &&
            typeof handler.handle === "function"
        ) {
            handler.handle(error, source);
        }
    }
};