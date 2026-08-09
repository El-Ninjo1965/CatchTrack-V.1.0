"use strict";
window.CatchTrackGPSModule = {
    version: "2.5.0",
    storageKeys: {
        lastPosition: "gps:lastPosition",
        homePosition: "gps:homePosition",
        stayState: "gps:stayState",
        waters: "waters:entries"
    },
    stayToleranceMeters: 50,
    state: {
        initialized: false,
        busy: false,
        currentPosition: null,
        homePosition: null,
        stayState: null,
        lastError: null
    },
    init() {
        this.loadStoredState();
        this.bindEvents();
        this.render();
        this.state.initialized = true;
        this.requestPosition().catch(() => {});
    },
    loadStoredState() {
        const storage = window.CatchTrackStorageManager;
        if (!storage || typeof storage.load !== "function") return;
        this.state.currentPosition = this.normalizePosition(
            storage.load(this.storageKeys.lastPosition, null)
        );
        this.state.homePosition = this.normalizePosition(
            storage.load(this.storageKeys.homePosition, null)
        );
        this.state.stayState = this.normalizeStayState(
            storage.load(this.storageKeys.stayState, null)
        );
    },
    saveData(key, value) {
        const storage = window.CatchTrackStorageManager;
        if (!storage || typeof storage.save !== "function") return false;
        return storage.save(key, value);
    },
    loadData(key, fallback = null) {
        const storage = window.CatchTrackStorageManager;
        if (!storage || typeof storage.load !== "function") return fallback;
        return storage.load(key, fallback);
    },
    removeData(key) {
        const storage = window.CatchTrackStorageManager;
        if (!storage || typeof storage.remove !== "function") return false;
        return storage.remove(key);
    },
    normalizePosition(position) {
        if (!position || typeof position !== "object") return null;
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
        const altitudeAccuracy = Number(position.altitudeAccuracy);
        let timestamp = new Date().toISOString();
        if (position.timestamp) {
            const date = new Date(position.timestamp);
            if (!Number.isNaN(date.getTime())) {
                timestamp = date.toISOString();
            }
        }
        return {
            latitude,
            longitude,
            accuracy: Number.isFinite(accuracy) ? accuracy : null,
            altitude: Number.isFinite(altitude) ? altitude : null,
            altitudeAccuracy: Number.isFinite(altitudeAccuracy)
                ? altitudeAccuracy
                : null,
            timestamp,
            source: position.source || "gps"
        };
    },
    normalizeStayState(stayState) {
        if (!stayState || typeof stayState !== "object") return null;
        const latitude = Number(stayState.latitude);
        const longitude = Number(stayState.longitude);
        const startedAt = new Date(stayState.startedAt);
        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            Number.isNaN(startedAt.getTime())
        ) {
            return null;
        }
        return {
            latitude,
            longitude,
            startedAt: startedAt.toISOString()
        };
    },
    requestPosition() {
        if (this.state.busy) {
            return Promise.resolve(this.state.currentPosition);
        }
        if (!navigator.geolocation) {
            const error = new Error(
                "Geolocation is not supported."
            );
            this.state.lastError = error;
            this.setStatus("error");
            this.setMessage(
                "Dieser Browser unterstützt keine Standortbestimmung.",
                "error"
            );
            this.render();
            this.handleError(error, "gps:unsupported");
            return Promise.reject(error);
        }
        this.state.busy = true;
        this.state.lastError = null;
        this.setStatus("loading");
        this.setMessage(
            "Standort wird ermittelt …",
            "info"
        );
        this.render();
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const normalized = this.normalizePosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy:
                            position.coords.altitudeAccuracy,
                        timestamp: position.timestamp,
                        source: "gps"
                    });
                    this.state.busy = false;
                    this.state.lastError = null;
                    this.updateStayState(normalized);
                    this.state.currentPosition = normalized;
                    this.saveData(
                        this.storageKeys.lastPosition,
                        normalized
                    );
                    this.saveData(
                        this.storageKeys.stayState,
                        this.state.stayState
                    );
                    this.setStatus("success");
                    this.setMessage(
                        "Standort wurde aktualisiert.",
                        "success"
                    );
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
    updateStayState(position) {
        if (!position) return;
        const now = new Date().toISOString();
        if (!this.state.stayState) {
            this.state.stayState = {
                latitude: position.latitude,
                longitude: position.longitude,
                startedAt: now
            };
            return;
        }
        const distance = this.calculateDistance(
            position,
            this.state.stayState
        );
        if (
            Number.isFinite(distance) &&
            distance > this.stayToleranceMeters
        ) {
            this.state.stayState = {
                latitude: position.latitude,
                longitude: position.longitude,
                startedAt: now
            };
        }
    },
    getStayDurationSeconds() {
        if (!this.state.stayState?.startedAt) {
            return null;
        }
        const startedAt = new Date(
            this.state.stayState.startedAt
        );
        if (Number.isNaN(startedAt.getTime())) {
            return null;
        }
        return Math.max(
            0,
            Math.floor(
                (Date.now() - startedAt.getTime()) / 1000
            )
        );
    },
    formatDuration(seconds) {
        if (!Number.isFinite(seconds)) return "--";
        const totalMinutes = Math.floor(seconds / 60);
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor(
            (totalMinutes % 1440) / 60
        );
        const minutes = totalMinutes % 60;
        if (days > 0) {
            return `${days} T ${hours} h ${minutes} min`;
        }
        if (hours > 0) {
            return `${hours} h ${minutes} min`;
        }
        return `${minutes} min`;
    },
    getGeolocationErrorMessage(error) {
        if (!error) {
            return "Der Standort konnte nicht ermittelt werden.";
        }
        switch (error.code) {
            case 1:
                return "Der Zugriff auf den Standort wurde verweigert.";
            case 2:
                return "Der Standort ist derzeit nicht verfügbar.";
            case 3:
                return "Die Standortbestimmung hat zu lange gedauert.";
            default:
                return "Der Standort konnte nicht ermittelt werden.";
        }
    },
    saveHomePosition() {
        if (!this.state.currentPosition) {
            this.setStatus("error");
            this.setMessage(
                "Es ist kein aktueller Standort vorhanden.",
                "error"
            );
            this.render();
            return false;
        }
        const home = {
            ...this.state.currentPosition,
            source: "home"
        };
        if (
            !this.saveData(
                this.storageKeys.homePosition,
                home
            )
        ) {
            this.setStatus("error");
            this.setMessage(
                "Der Standort konnte nicht gespeichert werden.",
                "error"
            );
            this.render();
            return false;
        }
        this.state.homePosition = home;
        this.setStatus("success");
        this.setMessage(
            "Home-Standort wurde gespeichert.",
            "success"
        );
        this.render();
        return true;
    },
    deleteHomePosition() {
        this.removeData(
            this.storageKeys.homePosition
        );
        this.state.homePosition = null;
        this.setMessage(
            "Home-Standort wurde gelöscht.",
            "success"
        );
        this.render();
        return true;
    },
    clearCurrentPosition() {
        this.state.currentPosition = null;
        this.state.lastError = null;
        this.removeData(
            this.storageKeys.lastPosition
        );
        this.setStatus("idle");
        this.setMessage(
            "Anzeige wurde zurückgesetzt.",
            "info"
        );
        this.render();
    },
    calculateDistance(first, second) {
        const a = this.normalizePosition(first);
        const b = this.normalizePosition(second);
        if (!a || !b) return null;
        const earthRadius = 6371000;
        const latitude1 =
            a.latitude * Math.PI / 180;
        const latitude2 =
            b.latitude * Math.PI / 180;
        const deltaLatitude =
            (b.latitude - a.latitude) *
            Math.PI / 180;
        const deltaLongitude =
            (b.longitude - a.longitude) *
            Math.PI / 180;
        const sinLatitude =
            Math.sin(deltaLatitude / 2);
        const sinLongitude =
            Math.sin(deltaLongitude / 2);
        const value =
            sinLatitude * sinLatitude +
            Math.cos(latitude1) *
            Math.cos(latitude2) *
            sinLongitude * sinLongitude;
        return (
            earthRadius *
            2 *
            Math.atan2(
                Math.sqrt(value),
                Math.sqrt(1 - value)
            )
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
            ? { ...this.state.currentPosition }
            : null;
    },
    getCoordinates() {
        const position = this.getPosition();
        return position
            ? {
                latitude: position.latitude,
                longitude: position.longitude
            }
            : null;
    },
    getHomePosition() {
        return this.state.homePosition
            ? { ...this.state.homePosition }
            : null;
    },
    formatDistance(meters) {
        if (!Number.isFinite(meters)) return "--";
        return meters < 1000
            ? `${Math.round(meters)} m`
            : `${(meters / 1000).toFixed(2)} km`;
    },
    shareCurrentPosition() {
        const position = this.getPosition();
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
                title: "CatchTrack Position",
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
    openCurrentLocation() {
        const position = this.getPosition();
        if (!position) {
            this.setMessage(
                "Es ist kein aktueller Standort vorhanden.",
                "error"
            );
            return Promise.reject(
                new Error(
                    "No current position available."
                )
            );
        }
        const url =
            `https://www.google.com/maps/search/?api=1&query=` +
            encodeURIComponent(
                `${position.latitude.toFixed(6)},${position.longitude.toFixed(6)}`
            );
        window.location.href = url;
        return Promise.resolve(url);
    },
    navigateTo(latitude, longitude) {
        const lat = Number(latitude);
        const lon = Number(longitude);
        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            lat < -90 ||
            lat > 90 ||
            lon < -180 ||
            lon > 180
        ) {
            return Promise.reject(
                new Error(
                    "Invalid navigation coordinates."
                )
            );
        }
        const destination =
            `${lat.toFixed(6)},${lon.toFixed(6)}`;
        const url =
            `https://www.google.com/maps/dir/?api=1&destination=` +
            encodeURIComponent(destination);
        window.location.href = url;
        return Promise.resolve(url);
    },
    navigateToCurrentPosition() {
        return this.openCurrentLocation();
    },
    navigateToHome() {
        const home = this.getHomePosition();
        if (!home) {
            this.setMessage(
                "Es ist kein Home-Standort gespeichert.",
                "error"
            );
            return Promise.reject(
                new Error(
                    "No home position available."
                )
            );
        }
        return this.navigateTo(
            home.latitude,
            home.longitude
        );
    },
    getWaters() {
        const value = this.loadData(
            this.storageKeys.waters,
            []
        );
        return Array.isArray(value)
            ? value
            : [];
    },
    createWaterId() {
        return (
            `water-${Date.now()}-` +
            Math.random()
                .toString(36)
                .slice(2, 8)
        );
    },
    saveCurrentPositionAsWater() {
        const position = this.getPosition();
        const input =
            document.getElementById(
                "gps-water-name"
            );
        const name =
            input
                ? input.value.trim()
                : "";
        if (!position) {
            this.setStatus("error");
            this.setMessage(
                "Zuerst muss ein aktueller GPS-Standort vorhanden sein.",
                "error"
            );
            this.render();
            return false;
        }
        if (!name) {
            this.setStatus("error");
            this.setMessage(
                "Bitte einen Namen für das Gewässer eingeben.",
                "error"
            );
            input?.focus();
            this.render();
            return false;
        }
        const waters =
            this.getWaters();
        const record = {
            id: this.createWaterId(),
            name,
            latitude: position.latitude,
            longitude: position.longitude,
            altitude: position.altitude,
            accuracy: position.accuracy,
            timestamp: position.timestamp,
            createdAt: new Date().toISOString(),
            source: "gps"
        };
        waters.push(record);
        if (
            !this.saveData(
                this.storageKeys.waters,
                waters
            )
        ) {
            this.setStatus("error");
            this.setMessage(
                "Das Gewässer konnte nicht gespeichert werden.",
                "error"
            );
            this.render();
            return false;
        }
        if (input) {
            input.value = "";
        }
        this.setStatus("success");
        this.setMessage(
            `Gewässer „${name}" wurde gespeichert.`,
            "success"
        );
        this.render();
        return record;
    },
    bindEvents() {
        const bind = (
            id,
            handler
        ) => {
            const element =
                document.getElementById(id);
            if (
                !element ||
                element.dataset.bound
            ) {
                return;
            }
            element.addEventListener(
                "click",
                handler
            );
            element.dataset.bound =
                "true";
        };
        bind(
            "gps-update-button",
            () =>
                this.requestPosition()
                    .catch(() => {})
        );
        bind(
            "gps-clear-button",
            () =>
                this.clearCurrentPosition()
        );
        bind(
            "gps-save-home-button",
            () =>
                this.saveHomePosition()
        );
        bind(
            "gps-delete-home-button",
            () =>
                this.deleteHomePosition()
        );
        bind(
            "gps-share-button",
            () =>
                this.shareCurrentPosition()
                    .catch(error =>
                        this.handleError(
                            error,
                            "gps:share"
                        )
                    )
        );
        bind(
            "gps-route-button",
            () =>
                this.navigateToCurrentPosition()
                    .catch(error =>
                        this.handleError(
                            error,
                            "gps:navigate-current"
                        )
                    )
        );
        bind(
            "gps-home-route-button",
            () =>
                this.navigateToHome()
                    .catch(error =>
                        this.handleError(
                            error,
                            "gps:navigate-home"
                        )
                    )
        );
        bind(
            "gps-save-water-button",
            () =>
                this.saveCurrentPositionAsWater()
        );
    },
    setStatus(state) {
        const badge =
            document.getElementById(
                "gps-status-badge"
            );
        if (!badge) return;
        badge.dataset.state =
            state;
        const labels = {
            idle: "Bereit",
            loading: "Ermittle Standort …",
            success: "Aktuell",
            error: "Fehler"
        };
        badge.textContent =
            labels[state] || state;
    },
    setMessage(
        message,
        type = "info"
    ) {
        const element =
            document.getElementById(
                "gps-message"
            );
        if (!element) return;
        element.textContent =
            message || "";
        element.dataset.type =
            type;
    },
    render() {
        this.renderPosition();
        this.renderHome();
        this.renderDistance();
        this.renderStayDuration();
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
                    ? "GPS"
                    : "Keine Position";
        }
        const homeStatus =
            document.getElementById(
                "gps-home-status"
            );
        if (homeStatus) {
            homeStatus.textContent =
                this.state.homePosition
                    ? "Gespeichert"
                    : "Nicht gespeichert";
        }
    },
    renderPosition() {
        const position =
            this.state.currentPosition;
        const set = (
            id,
            value
        ) => {
            const element =
                document.getElementById(id);
            if (element) {
                element.textContent =
                    value;
            }
        };
        set(
            "gps-latitude",
            position
                ? position.latitude.toFixed(6)
                : "--"
        );
        set(
            "gps-longitude",
            position
                ? position.longitude.toFixed(6)
                : "--"
        );
        set(
            "gps-accuracy",
            position &&
            Number.isFinite(position.accuracy)
                ? `±${Math.round(position.accuracy)} m`
                : "--"
        );
        set(
            "gps-altitude",
            position &&
            Number.isFinite(position.altitude)
                ? `${position.altitude.toFixed(1)} m`
                : "--"
        );
        set(
            "gps-altitude-accuracy",
            position &&
            Number.isFinite(
                position.altitudeAccuracy
            )
                ? `±${Math.round(
                    position.altitudeAccuracy
                )} m`
                : "--"
        );
        set(
            "gps-timestamp",
            position
                ? this.formatTimestamp(
                    position.timestamp
                )
                : "--"
        );
    },
    renderStayDuration() {
        const element =
            document.getElementById(
                "gps-stay-duration"
            );
        if (element) {
            element.textContent =
                this.formatDuration(
                    this.getStayDurationSeconds()
                );
        }
    },
    renderHome() {
        const container =
            document.getElementById(
                "gps-home-position"
            );
        if (!container) return;
        const position =
            this.state.homePosition;
        if (!position) {
            container.innerHTML =
                "<span>Kein Home-Standort vorhanden.</span>";
            return;
        }
        container.innerHTML =
            `<div class="gps-home-coordinate">
                <div>
                    <span>Breitengrad</span>
                    <strong>${position.latitude.toFixed(6)}</strong>
                </div>
                <div>
                    <span>Längengrad</span>
                    <strong>${position.longitude.toFixed(6)}</strong>
                </div>
                <div>
                    <span>Höhe über Meeresspiegel</span>
                    <strong>${
                        Number.isFinite(position.altitude)
                            ? `${position.altitude.toFixed(1)} m`
                            : "--"
                    }</strong>
                </div>
            </div>`;
    },
    renderDistance() {
        const element =
            document.getElementById(
                "gps-distance-value"
            );
        if (element) {
            element.textContent =
                this.formatDistance(
                    this.getDistanceFromHome()
                );
        }
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
        } catch (_) {
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
            typeof handler.handle ===
                "function"
        ) {
            handler.handle(
                error,
                source
            );
        }
    }
};