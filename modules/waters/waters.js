"use strict";

window.CatchTrackWatersModule = {
    version: "8.0.0",

    initialized: false,

    constants: {
        MAX_PHOTO_EDGE: 720,
        PHOTO_QUALITY: 0.70,
        PHOTO_MIME: "image/webp",
        PHOTO_EXTENSION: "webp",
        GEO_URL:
            "https://api.bigdatacloud.net/data/reverse-geocode-client",
        GEO_LANGUAGE: "de",
        PHOTO_DB_NAME: "CatchTrackWatersPhotos",
        PHOTO_DB_VERSION: 1,
        PHOTO_STORE: "photos",
        WEBP_MODULE:
            "https://esm.sh/@jsquash/webp@1.5.0"
    },

    state: {
        waters: [],
        editingId: null,
        busy: false,
        gpsBusy: false,
        currentPosition: null,
        currentLocation: null,
        pendingPhoto: null,
        existingPhoto: null,
        photoProcessing: false,
        photoObjectUrl: null,
        webpEncoder: null
    },

    async init() {
        if (this.initialized) {
            return;
        }

        try {
            this.bindEvents();
            await this.openPhotoDatabase();

            this.initialized = true;

            this.setStatus(
                "Gewässer werden geladen …",
                "info"
            );

            await this.refresh();

            window.setTimeout(() => {
                this.autoGetGPS();
            }, 100);
        } catch (error) {
            this.handleError(
                error,
                "waters:init"
            );

            this.setStatus(
                error?.message ||
                    "Waters konnte nicht initialisiert werden.",
                "error"
            );
        }
    },

    getDatabase() {
        const database =
            window.CatchTrackDatabase;

        if (
            !database ||
            typeof database.isReady !==
                "function" ||
            !database.isReady()
        ) {
            throw new Error(
                "CatchTrack-Datenbank ist nicht verfügbar."
            );
        }

        return database;
    },

    getCurrentUserId() {
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

        const userId = Number(
            identity.getCurrentUserId()
        );

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            throw new Error(
                "Kein gültiger aktiver Benutzer vorhanden."
            );
        }

        return userId;
    },

    query(sql, params = []) {
        return this.getDatabase().query(
            sql,
            params
        );
    },

    execute(sql, params = []) {
        return this.getDatabase().execute(
            sql,
            params
        );
    },

    saveDatabase() {
        return this.getDatabase().saveDatabase();
    },

    ensureSchema() {
        const columns =
            this.getDatabase().getTableColumns(
                "waters"
            );

        const required = [
            "id",
            "user_id",
            "name",
            "type",
            "country",
            "region",
            "city",
            "description",
            "gps_lat",
            "gps_lon",
            "gps_accuracy_m",
            "gps_timestamp",
            "created_at",
            "updated_at"
        ];

        const missing =
            required.filter(
                column =>
                    !columns.includes(column)
            );

        if (missing.length) {
            throw new Error(
                "Waters-Datenbankschema unvollständig: " +
                    missing.join(", ") +
                    ". Bitte Migration 006 ausführen."
            );
        }

        return true;
    },

    normalizeWater(row) {
        if (
            !row ||
            typeof row !== "object"
        ) {
            return null;
        }

        const numberOrNull = value => {
            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                return null;
            }

            const number = Number(value);

            return Number.isFinite(number)
                ? number
                : null;
        };

        return {
            id: numberOrNull(row.id),
            user_id: numberOrNull(row.user_id),

            name: String(
                row.name ?? ""
            ),

            type: String(
                row.type ?? ""
            ),

            country: String(
                row.country ?? ""
            ),

            region: String(
                row.region ?? ""
            ),

            city: String(
                row.city ?? ""
            ),

            description: String(
                row.description ?? ""
            ),

            gps_lat:
                numberOrNull(
                    row.gps_lat
                ),

            gps_lon:
                numberOrNull(
                    row.gps_lon
                ),

            gps_accuracy_m:
                numberOrNull(
                    row.gps_accuracy_m
                ),

            gps_timestamp:
                row.gps_timestamp ??
                null,

            created_at:
                row.created_at ??
                null,

            updated_at:
                row.updated_at ??
                null
        };
    },

    getSelectColumns() {
        return `
            id,
            user_id,
            name,
            type,
            country,
            region,
            city,
            description,
            gps_lat,
            gps_lon,
            gps_accuracy_m,
            gps_timestamp,
            created_at,
            updated_at
        `;
    },

    getAll() {
        this.ensureSchema();

        const userId =
            this.getCurrentUserId();

        return this.query(
            `
                SELECT
                    ${this.getSelectColumns()}
                FROM waters
                WHERE user_id = ?
                ORDER BY name COLLATE NOCASE ASC
            `,
            [userId]
        )
            .map(row =>
                this.normalizeWater(row)
            )
            .filter(Boolean);
    },

    getById(id) {
        this.ensureSchema();

        const waterId =
            Number(id);

        if (
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {
            return null;
        }

        const userId =
            this.getCurrentUserId();

        const rows =
            this.query(
                `
                    SELECT
                        ${this.getSelectColumns()}
                    FROM waters
                    WHERE id = ?
                      AND user_id = ?
                    LIMIT 1
                `,
                [
                    waterId,
                    userId
                ]
            );

        return rows.length
            ? this.normalizeWater(rows[0])
            : null;
    },

    getCount() {
        return this.getAll().length;
    },

    calculateDistance(
        latitude1,
        longitude1,
        latitude2,
        longitude2
    ) {
        const earthRadiusKm = 6371;

        const lat1 =
            Number(latitude1) *
            Math.PI /
            180;

        const lat2 =
            Number(latitude2) *
            Math.PI /
            180;

        const deltaLat =
            (
                Number(latitude2) -
                Number(latitude1)
            ) *
            Math.PI /
            180;

        const deltaLon =
            (
                Number(longitude2) -
                Number(longitude1)
            ) *
            Math.PI /
            180;

        const a =
            Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(deltaLon / 2) ** 2;

        return (
            earthRadiusKm *
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(
                    Math.max(
                        0,
                        1 - a
                    )
                )
            )
        );
    },

    getNearby(
        latitude,
        longitude,
        radiusKm = 50
    ) {
        const lat = Number(latitude);
        const lon = Number(longitude);
        const radius = Number(radiusKm);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            !Number.isFinite(radius) ||
            radius <= 0
        ) {
            return [];
        }

        return this.getAll()
            .map(water => {
                if (
                    water.gps_lat === null ||
                    water.gps_lon === null
                ) {
                    return null;
                }

                return {
                    ...water,
                    distance_km:
                        this.calculateDistance(
                            lat,
                            lon,
                            water.gps_lat,
                            water.gps_lon
                        )
                };
            })
            .filter(Boolean)
            .filter(
                water =>
                    water.distance_km <=
                    radius
            )
            .sort(
                (a, b) =>
                    a.distance_km -
                    b.distance_km
            );
    },

    validateData(data) {
        const source = data || {};

        const name =
            String(
                source.name ?? ""
            ).trim();

        if (!name) {
            throw new Error(
                "Der Gewässername ist erforderlich."
            );
        }

        return {
            name: name.slice(0, 150),

            type:
                this.normalizeText(
                    source.type,
                    100
                ),

            country:
                this.normalizeText(
                    source.country,
                    100
                ),

            region:
                this.normalizeText(
                    source.region,
                    150
                ),

            city:
                this.normalizeText(
                    source.city,
                    150
                ),

            description:
                this.normalizeText(
                    source.description,
                    2000
                ),

            gps_lat:
                this.normalizeCoordinate(
                    source.gps_lat,
                    -90,
                    90
                ),

            gps_lon:
                this.normalizeCoordinate(
                    source.gps_lon,
                    -180,
                    180
                ),

            gps_accuracy_m:
                this.normalizePositiveNumber(
                    source.gps_accuracy_m
                )
        };
    },

    normalizeText(
        value,
        maxLength
    ) {
        const text =
            String(
                value ?? ""
            ).trim();

        return text
            ? text.slice(0, maxLength)
            : null;
    },

    normalizeCoordinate(
        value,
        minimum,
        maximum
    ) {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }

        const number = Number(value);

        if (
            !Number.isFinite(number) ||
            number < minimum ||
            number > maximum
        ) {
            throw new Error(
                "Ungültige GPS-Koordinaten."
            );
        }

        return number;
    },

    normalizePositiveNumber(value) {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }

        const number = Number(value);

        if (
            !Number.isFinite(number) ||
            number < 0
        ) {
            return null;
        }

        return number;
    },

    create(data) {
        this.ensureSchema();

        const userId =
            this.getCurrentUserId();

        const water =
            this.validateData(data);

        const timestamp =
            new Date().toISOString();

        this.execute(
            `
                INSERT INTO waters
                (
                    user_id,
                    name,
                    type,
                    country,
                    region,
                    city,
                    description,
                    gps_lat,
                    gps_lon,
                    gps_accuracy_m,
                    gps_timestamp,
                    created_at,
                    updated_at
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                userId,
                water.name,
                water.type,
                water.country,
                water.region,
                water.city,
                water.description,
                water.gps_lat,
                water.gps_lon,
                water.gps_accuracy_m,
                this.state.currentPosition
                    ?.timestamp ??
                    timestamp,
                timestamp,
                timestamp
            ]
        );

        this.saveDatabase();

        const rows =
            this.query(
                `
                    SELECT
                        ${this.getSelectColumns()}
                    FROM waters
                    WHERE user_id = ?
                    ORDER BY id DESC
                    LIMIT 1
                `,
                [userId]
            );

        return rows.length
            ? this.normalizeWater(rows[0])
            : null;
    },

    update(id, data) {
        this.ensureSchema();

        const waterId = Number(id);

        if (
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {
            throw new Error(
                "Ungültige Gewässer-ID."
            );
        }

        const userId =
            this.getCurrentUserId();

        const water =
            this.validateData(data);

        this.execute(
            `
                UPDATE waters
                SET
                    name = ?,
                    type = ?,
                    country = ?,
                    region = ?,
                    city = ?,
                    description = ?,
                    gps_lat = ?,
                    gps_lon = ?,
                    gps_accuracy_m = ?,
                    gps_timestamp = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                  AND user_id = ?
            `,
            [
                water.name,
                water.type,
                water.country,
                water.region,
                water.city,
                water.description,
                water.gps_lat,
                water.gps_lon,
                water.gps_accuracy_m,
                this.state.currentPosition
                    ?.timestamp ??
                    null,
                waterId,
                userId
            ]
        );

        this.saveDatabase();

        return this.getById(waterId);
    },

    remove(id) {
        this.ensureSchema();

        const waterId = Number(id);

        if (
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {
            return false;
        }

        const userId =
            this.getCurrentUserId();

        this.execute(
            `
                DELETE FROM waters
                WHERE id = ?
                  AND user_id = ?
            `,
            [
                waterId,
                userId
            ]
        );

        this.saveDatabase();

        return true;
    },

    async requestGPSPosition() {
        if (
            !window.navigator ||
            !window.navigator.geolocation
        ) {
            throw new Error(
                "Dieser Browser unterstützt keine Standortbestimmung."
            );
        }

        if (this.state.gpsBusy) {
            return this.state.currentPosition;
        }

        this.state.gpsBusy = true;

        try {
            const position =
                await new Promise(
                    (
                        resolve,
                        reject
                    ) => {
                        window.navigator.geolocation.getCurrentPosition(
                            resolve,
                            reject,
                            {
                                enableHighAccuracy: true,
                                timeout: 20000,
                                maximumAge: 0
                            }
                        );
                    }
                );

            const latitude =
                Number(
                    position?.coords?.latitude
                );

            const longitude =
                Number(
                    position?.coords?.longitude
                );

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                throw new Error(
                    "GPS lieferte ungültige Koordinaten."
                );
            }

            const accuracy =
                Number(
                    position?.coords?.accuracy
                );

            const altitude =
                Number(
                    position?.coords?.altitude
                );

            const normalized = {
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

                timestamp:
                    position.timestamp
                        ? new Date(
                            position.timestamp
                        ).toISOString()
                        : new Date().toISOString(),

                source:
                    "browser-geolocation"
            };

            this.state.currentPosition =
                normalized;

            return normalized;
        } finally {
            this.state.gpsBusy = false;
        }
    },

    async reverseGeocode(position) {
        if (!position) {
            throw new Error(
                "Kein aktueller GPS-Standort vorhanden."
            );
        }

        const latitude =
            Number(position.latitude);

        const longitude =
            Number(position.longitude);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            throw new Error(
                "Ungültige GPS-Koordinaten für die Standortauflösung."
            );
        }

        const url =
            new URL(
                this.constants.GEO_URL
            );

        url.searchParams.set(
            "latitude",
            String(latitude)
        );

        url.searchParams.set(
            "longitude",
            String(longitude)
        );

        url.searchParams.set(
            "localityLanguage",
            this.constants.GEO_LANGUAGE
        );

        const response =
            await fetch(
                url.toString(),
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                `Standortauflösung fehlgeschlagen (${response.status}).`
            );
        }

        const data =
            await response.json();

        if (
            !data ||
            typeof data !== "object"
        ) {
            throw new Error(
                "Ungültige Antwort der Standortauflösung."
            );
        }

        const location = {
            country:
                String(
                    data.countryName ??
                    ""
                ).trim(),

            region:
                String(
                    data.principalSubdivision ??
                    ""
                ).trim(),

            city:
                String(
                    data.city ??
                    data.locality ??
                    ""
                ).trim(),

            locality:
                String(
                    data.locality ??
                    ""
                ).trim(),

            postcode:
                String(
                    data.postcode ??
                    ""
                ).trim(),

            countryCode:
                String(
                    data.countryCode ??
                    ""
                ).trim(),

            source:
                "bigdatacloud",

            timestamp:
                new Date().toISOString()
        };

        if (
            !location.country &&
            !location.region &&
            !location.city
        ) {
            throw new Error(
                "Die Standortauflösung lieferte keine Ortsdaten."
            );
        }

        return location;
    },

    async updateLocationFromGPS() {
        const position =
            await this.requestGPSPosition();

        this.setGPSFields(position);

        try {
            this.setGPSMessage(
                "Standort wird aufgelöst …",
                "info"
            );

            const location =
                await this.reverseGeocode(
                    position
                );

            this.state.currentLocation =
                location;

            this.setLocationFields(
                location
            );

            this.setGPSMessage(
                this.locationSummary(location),
                "success"
            );

            this.renderCurrentPosition();

            return {
                position,
                location
            };
        } catch (error) {
            this.state.currentLocation =
                null;

            this.setGPSMessage(
                "GPS wurde ermittelt, aber Land / Provinz / Ort konnten nicht automatisch bestimmt werden.",
                "error"
            );

            throw error;
        }
    },

    locationSummary(location) {
        return this.uniqueParts([
            location?.city,
            location?.region,
            location?.country
        ]).join(" · ");
    },

    setGPSFields(position) {
        const latitude =
            document.getElementById(
                "waters-latitude"
            );

        const longitude =
            document.getElementById(
                "waters-longitude"
            );

        const accuracy =
            document.getElementById(
                "waters-accuracy"
            );

        if (latitude) {
            latitude.value =
                Number(
                    position.latitude
                ).toFixed(6);
        }

        if (longitude) {
            longitude.value =
                Number(
                    position.longitude
                ).toFixed(6);
        }

        if (accuracy) {
            accuracy.value =
                position.accuracy !== null
                    ? `±${Math.round(
                        position.accuracy
                    )} m`
                    : "nicht verfügbar";
        }
    },

    setLocationFields(location) {
        const country =
            document.getElementById(
                "waters-country"
            );

        const region =
            document.getElementById(
                "waters-region"
            );

        const city =
            document.getElementById(
                "waters-city"
            );

        if (country) {
            country.value =
                location?.country || "";
        }

        if (region) {
            region.value =
                location?.region || "";
        }

        if (city) {
            city.value =
                location?.city ||
                location?.locality ||
                "";
        }
    },

    getFormData() {
        return {
            name:
                document.getElementById(
                    "waters-name"
                )?.value,

            type:
                document.getElementById(
                    "waters-type"
                )?.value,

            country:
                document.getElementById(
                    "waters-country"
                )?.value,

            region:
                document.getElementById(
                    "waters-region"
                )?.value,

            city:
                document.getElementById(
                    "waters-city"
                )?.value,

            description:
                document.getElementById(
                    "waters-description"
                )?.value,

            gps_lat:
                document.getElementById(
                    "waters-latitude"
                )?.value,

            gps_lon:
                document.getElementById(
                    "waters-longitude"
                )?.value,

            gps_accuracy_m:
                this.state.currentPosition
                    ?.accuracy ?? null
        };
    },

    async autoGetGPS() {
        if (
            this.state.currentPosition
        ) {
            return;
        }

        this.setGPSMessage(
            "Aktuellen GPS-Standort wird ermittelt …",
            "info"
        );

        try {
            await this.updateLocationFromGPS();

            this.renderCurrentPosition();
        } catch (error) {
            this.handleError(
                error,
                "waters:auto-gps"
            );
        }
    },

    async updateGPS() {
        const button =
            document.getElementById(
                "waters-gps-button"
            );

        if (this.state.gpsBusy) {
            return;
        }

        try {
            if (button) {
                button.disabled = true;
            }

            this.setGPSMessage(
                "GPS-Standort wird ermittelt …",
                "info"
            );

            await this.updateLocationFromGPS();

            this.renderCurrentPosition();
        } catch (error) {
            this.setGPSMessage(
                this.getGPSErrorMessage(error),
                "error"
            );

            this.handleError(
                error,
                "waters:gps"
            );
        } finally {
            if (button) {
                button.disabled = false;
            }
        }
    },

    async useGPSForForm() {
        const button =
            document.getElementById(
                "waters-location-button"
            );

        try {
            if (button) {
                button.disabled = true;
            }

            this.setFormMessage(
                "GPS-Standort und Ortsdaten werden ermittelt …",
                "info"
            );

            await this.updateLocationFromGPS();

            this.setFormMessage(
                "GPS, Land, Provinz/Bundesstaat und Ort wurden übernommen.",
                "success"
            );
        } catch (error) {
            this.setFormMessage(
                this.getGPSErrorMessage(error),
                "error"
            );

            this.handleError(
                error,
                "waters:form-gps"
            );
        } finally {
            if (button) {
                button.disabled = false;
            }
        }
    },

    getGPSErrorMessage(error) {
        switch (error?.code) {
            case 1:
                return "Der Zugriff auf den Standort wurde verweigert.";

            case 2:
                return "Der Standort ist derzeit nicht verfügbar.";

            case 3:
                return "Die Standortbestimmung hat zu lange gedauert.";

            default:
                return (
                    error?.message ||
                    "Der Standort konnte nicht ermittelt werden."
                );
        }
    },

    async submitForm() {
        if (this.state.busy) {
            return;
        }

        this.state.busy = true;

        const saveButton =
            document.getElementById(
                "waters-save-button"
            );

        try {
            if (saveButton) {
                saveButton.disabled = true;
            }

            if (
                this.state.photoProcessing
            ) {
                throw new Error(
                    "Das Foto wird noch optimiert. Bitte kurz warten."
                );
            }

            const data =
                this.getFormData();

            const editingId =
                this.state.editingId;

            const water =
                editingId
                    ? this.update(
                        editingId,
                        data
                    )
                    : this.create(data);

            if (!water) {
                throw new Error(
                    "Fangplatz konnte nicht gespeichert werden."
                );
            }

            await this.persistPhotoForWater(
                water.id
            );

            const wasNew =
                !editingId;

            this.resetForm();

            await this.refresh();

            this.setFormMessage(
                wasNew
                    ? "Fangplatz wurde gespeichert."
                    : "Fangplatz wurde aktualisiert.",
                "success"
            );

            this.showMyWaters();
        } catch (error) {
            this.setFormMessage(
                error?.message ||
                    "Fangplatz konnte nicht gespeichert werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:save"
            );
        } finally {
            this.state.busy = false;

            if (saveButton) {
                saveButton.disabled = false;
            }
        }
    },

    async refresh() {
        try {
            this.ensureSchema();

            this.state.waters =
                this.getAll();

            this.renderList();
            this.renderCount();
            this.renderCurrentPosition();

            this.setStatus(
                this.state.waters.length
                    ? `${this.state.waters.length} eigene Fangplätze geladen.`
                    : "Noch keine eigenen Fangplätze vorhanden.",
                "success"
            );
        } catch (error) {
            this.state.waters = [];

            this.renderList();
            this.renderCount();

            this.setStatus(
                error?.message ||
                    "Fangplätze konnten nicht geladen werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:refresh"
            );
        }
    },

    renderCount() {
        const element =
            document.getElementById(
                "waters-count"
            );

        if (element) {
            element.textContent =
                String(
                    this.state.waters.length
                );
        }
    },

    renderCurrentPosition() {
        const container =
            document.getElementById(
                "waters-current-position"
            );

        if (!container) {
            return;
        }

        const position =
            this.state.currentPosition;

        const location =
            this.state.currentLocation;

        if (!position) {
            container.hidden = true;
            container.innerHTML = "";
            return;
        }

        container.hidden = false;
        container.innerHTML = "";

        const values = [
            {
                label: "Breitengrad",
                value:
                    Number(
                        position.latitude
                    ).toFixed(6)
            },
            {
                label: "Längengrad",
                value:
                    Number(
                        position.longitude
                    ).toFixed(6)
            },
            {
                label: "Genauigkeit",
                value:
                    position.accuracy !== null
                        ? `±${Math.round(
                            position.accuracy
                        )} m`
                        : "nicht verfügbar"
            },
            {
                label: "Standort",
                value:
                    this.locationSummary(
                        location
                    ) ||
                    "noch nicht aufgelöst"
            }
        ];

        values.forEach(item => {
            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "waters-position-value";

            const label =
                document.createElement(
                    "span"
                );

            label.className =
                "waters-position-label";

            label.textContent =
                item.label;

            const value =
                document.createElement(
                    "span"
                );

            value.className =
                "waters-position-number";

            value.textContent =
                item.value;

            wrapper.append(
                label,
                value
            );

            container.appendChild(
                wrapper
            );
        });
    },

    async renderList() {
        const container =
            document.getElementById(
                "waters-list"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!this.state.waters.length) {
            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "waters-empty";

            empty.textContent =
                "Noch keine eigenen Fangplätze vorhanden.";

            container.appendChild(empty);

            return;
        }

        for (
            const water of this.state.waters
        ) {
            container.appendChild(
                await this.createWaterCard(
                    water
                )
            );
        }
    },

    async createWaterCard(water) {
        const article =
            document.createElement(
                "article"
            );

        article.className =
            "waters-card";

        const photoWrapper =
            document.createElement(
                "div"
            );

        photoWrapper.className =
            "waters-card-photo";

        const photo =
            await this.getStoredPhoto(
                water.id
            );

        if (photo?.blob) {
            const image =
                document.createElement(
                    "img"
                );

            const url =
                URL.createObjectURL(
                    photo.blob
                );

            image.src = url;
            image.alt =
                `Fangplatzfoto ${water.name}`;
            image.loading = "lazy";

            image.addEventListener(
                "load",
                () => {
                    URL.revokeObjectURL(
                        url
                    );
                },
                {
                    once: true
                }
            );

            photoWrapper.appendChild(
                image
            );
        }

        article.appendChild(
            photoWrapper
        );

        const content =
            document.createElement(
                "div"
            );

        content.className =
            "waters-card-content";

        const header =
            document.createElement(
                "div"
            );

        header.className =
            "waters-card-header";

        const title =
            document.createElement(
                "div"
            );

        const heading =
            document.createElement(
                "h3"
            );

        heading.className =
            "waters-card-title";

        heading.textContent =
            water.name;

        title.appendChild(
            heading
        );

        const meta =
            document.createElement(
                "div"
            );

        meta.className =
            "waters-card-meta";

        meta.textContent =
            this.uniqueParts([
                water.type,
                water.city,
                water.region,
                water.country
            ]).join(" · ");

        title.appendChild(
            meta
        );

        header.appendChild(
            title
        );

        content.appendChild(
            header
        );

        if (water.description) {
            const description =
                document.createElement(
                    "p"
                );

            description.className =
                "waters-card-description";

            description.textContent =
                water.description;

            content.appendChild(
                description
            );
        }

        if (
            water.gps_lat !== null &&
            water.gps_lon !== null
        ) {
            const coordinates =
                document.createElement(
                    "div"
                );

            coordinates.className =
                "waters-card-coordinates";

            coordinates.textContent =
                `${water.gps_lat.toFixed(6)}, ${water.gps_lon.toFixed(6)}`;

            if (
                water.gps_accuracy_m !== null
            ) {
                coordinates.textContent +=
                    ` · ±${Math.round(
                        water.gps_accuracy_m
                    )} m`;
            }

            content.appendChild(
                coordinates
            );
        }

        const actions =
            document.createElement(
                "div"
            );

        actions.className =
            "waters-card-actions";

        const edit =
            this.createButton(
                "Bearbeiten"
            );

        edit.addEventListener(
            "click",
            () =>
                this.editWater(
                    water.id
                )
        );

        const navigation =
            this.createButton(
                "Navigation"
            );

        navigation.disabled =
            water.gps_lat === null ||
            water.gps_lon === null;

        navigation.addEventListener(
            "click",
            () =>
                this.navigateTo(
                    water
                )
        );

        const remove =
            this.createButton(
                "Löschen"
            );

        remove.addEventListener(
            "click",
            () =>
                this.deleteWater(
                    water.id
                )
        );

        actions.append(
            edit,
            navigation,
            remove
        );

        content.appendChild(
            actions
        );

        article.appendChild(
            content
        );

        return article;
    },

    uniqueParts(parts) {
        const result = [];

        parts.forEach(value => {
            const text =
                String(
                    value ?? ""
                ).trim();

            if (
                !text ||
                result.some(
                    existing =>
                        existing.toLowerCase() ===
                        text.toLowerCase()
                )
            ) {
                return;
            }

            result.push(text);
        });

        return result;
    },

    createButton(text) {
        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "waters-button waters-button-secondary";

        button.textContent = text;

        return button;
    },

    editWater(id) {
        try {
            const water =
                this.getById(id);

            if (!water) {
                throw new Error(
                    "Fangplatz wurde nicht gefunden."
                );
            }

            this.fillForm(water);

            this.showForm();

            this.loadExistingPhoto(
                water.id
            );

            this.setFormMessage(
                `Fangplatz „${water.name}" wird bearbeitet.`,
                "info"
            );
        } catch (error) {
            this.setFormMessage(
                error?.message ||
                    "Fangplatz konnte nicht geladen werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:edit"
            );
        }
    },

    fillForm(water) {
        const fields = {
            "waters-id":
                water.id ?? "",

            "waters-name":
                water.name ?? "",

            "waters-type":
                water.type ?? "",

            "waters-country":
                water.country ?? "",

            "waters-region":
                water.region ?? "",

            "waters-city":
                water.city ?? "",

            "waters-description":
                water.description ?? "",

            "waters-latitude":
                water.gps_lat ?? "",

            "waters-longitude":
                water.gps_lon ?? "",

            "waters-accuracy":
                water.gps_accuracy_m !== null
                    ? `±${Math.round(
                        water.gps_accuracy_m
                    )} m`
                    : ""
        };

        Object.entries(fields).forEach(
            ([id, value]) => {
                const element =
                    document.getElementById(
                        id
                    );

                if (element) {
                    element.value =
                        value;
                }
            }
        );

        this.state.editingId =
            water.id;

        this.state.currentPosition =
            water.gps_lat !== null &&
            water.gps_lon !== null
                ? {
                    latitude:
                        water.gps_lat,
                    longitude:
                        water.gps_lon,
                    accuracy:
                        water.gps_accuracy_m,
                    altitude:
                        null,
                    timestamp:
                        water.gps_timestamp ??
                        null,
                    source:
                        "stored-water"
                }
                : null;

        this.state.currentLocation =
            water.country ||
            water.region ||
            water.city
                ? {
                    country:
                        water.country,
                    region:
                        water.region,
                    city:
                        water.city,
                    source:
                        "stored-water"
                }
                : null;

        const cancel =
            document.getElementById(
                "waters-cancel-button"
            );

        if (cancel) {
            cancel.hidden = false;
        }

        this.renderCurrentPosition();
    },

    resetForm() {
        const form =
            document.getElementById(
                "waters-form"
            );

        if (form) {
            form.reset();
        }

        const id =
            document.getElementById(
                "waters-id"
            );

        if (id) {
            id.value = "";
        }

        this.state.editingId = null;
        this.state.pendingPhoto = null;
        this.state.existingPhoto = null;
        this.clearPhotoPreview();

        const cancel =
            document.getElementById(
                "waters-cancel-button"
            );

        if (cancel) {
            cancel.hidden = true;
        }
    },

    async deleteWater(id) {
        const water =
            this.getById(id);

        if (!water) {
            return;
        }

        if (
            !window.confirm(
                `Fangplatz „${water.name}" wirklich löschen?`
            )
        ) {
            return;
        }

        try {
            this.remove(id);

            await this.deleteStoredPhoto(
                id
            );

            await this.refresh();
        } catch (error) {
            this.setStatus(
                error?.message ||
                    "Fangplatz konnte nicht gelöscht werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:delete"
            );
        }
    },

    navigateTo(water) {
        if (
            !water ||
            water.gps_lat === null ||
            water.gps_lon === null
        ) {
            return;
        }

        const destination =
            `${water.gps_lat},${water.gps_lon}`;

        window.location.href =
            "https://www.google.com/maps/dir/?api=1&destination=" +
            encodeURIComponent(
                destination
            );
    },

    showMyWaters() {
        const list =
            document.getElementById(
                "waters-list"
            );

        if (!list) {
            return;
        }

        const panel =
            list.closest(
                ".waters-panel"
            );

        (
            panel || list
        ).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    },

    showForm() {
        const form =
            document.getElementById(
                "waters-form"
            );

        if (!form) {
            return;
        }

        const panel =
            form.closest(
                ".waters-panel"
            );

        (
            panel || form
        ).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    },

    async handlePhotoSelection(event) {
        const input =
            event.target;

        const file =
            input?.files?.[0];

        if (!file) {
            return;
        }

        try {
            this.state.photoProcessing =
                true;

            this.setPhotoStatus(
                "Foto wird auf 720 px / WebP 70 % optimiert …",
                "info"
            );

            const optimized =
                await this.optimizePhoto(
                    file
                );

            this.state.pendingPhoto =
                optimized;

            this.renderPendingPhoto(
                optimized.blob
            );

            this.setPhotoStatus(
                `Optimiert: ${this.formatBytes(
                    optimized.size
                )} · ${optimized.width} × ${optimized.height} px`,
                "success"
            );
        } catch (error) {
            this.state.pendingPhoto =
                null;

            input.value = "";

            this.setPhotoStatus(
                error?.message ||
                    "Foto konnte nicht optimiert werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:photo"
            );
        } finally {
            this.state.photoProcessing =
                false;
        }
    },

    async optimizePhoto(file) {
        if (
            !file.type.startsWith("image/")
        ) {
            throw new Error(
                "Die ausgewählte Datei ist kein Bild."
            );
        }

        const image =
            await this.loadImage(file);

        const sourceWidth =
            image.naturalWidth ||
            image.width;

        const sourceHeight =
            image.naturalHeight ||
            image.height;

        if (
            !sourceWidth ||
            !sourceHeight
        ) {
            throw new Error(
                "Die Bildgröße konnte nicht ermittelt werden."
            );
        }

        const scale =
            Math.min(
                1,
                this.constants.MAX_PHOTO_EDGE /
                    Math.max(
                        sourceWidth,
                        sourceHeight
                    )
            );

        const width =
            Math.max(
                1,
                Math.round(
                    sourceWidth * scale
                )
            );

        const height =
            Math.max(
                1,
                Math.round(
                    sourceHeight * scale
                )
            );

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width = width;
        canvas.height = height;

        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );

        if (!context) {
            throw new Error(
                "Bildverarbeitung wird von diesem Gerät nicht unterstützt."
            );
        }

        context.imageSmoothingEnabled =
            true;

        context.imageSmoothingQuality =
            "high";

        context.drawImage(
            image,
            0,
            0,
            width,
            height
        );

        const nativeWebp =
            await this.canvasToWebP(
                canvas,
                this.constants.PHOTO_QUALITY
            );

        if (nativeWebp) {
            return {
                blob: nativeWebp,
                size: nativeWebp.size,
                width,
                height,
                mimeType:
                    this.constants.PHOTO_MIME,
                fileName:
                    this.createPhotoFileName()
            };
        }

        const imageData =
            context.getImageData(
                0,
                0,
                width,
                height
            );

        const webpBuffer =
            await this.encodeWebPWithWasm(
                imageData
            );

        const blob =
            new Blob(
                [webpBuffer],
                {
                    type:
                        this.constants.PHOTO_MIME
                }
            );

        if (
            !blob.size ||
            blob.type !==
                this.constants.PHOTO_MIME
        ) {
            throw new Error(
                "WebP konnte auf diesem Gerät nicht erzeugt werden."
            );
        }

        return {
            blob,
            size: blob.size,
            width,
            height,
            mimeType:
                this.constants.PHOTO_MIME,
            fileName:
                this.createPhotoFileName()
        };
    },

    loadImage(file) {
        return new Promise(
            (resolve, reject) => {
                const image =
                    new Image();

                const url =
                    URL.createObjectURL(
                        file
                    );

                image.onload = () => {
                    URL.revokeObjectURL(
                        url
                    );

                    resolve(image);
                };

                image.onerror = () => {
                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Das Foto konnte nicht gelesen werden."
                        )
                    );
                };

                image.src = url;
            }
        );
    },

    canvasToWebP(
        canvas,
        quality
    ) {
        return new Promise(resolve => {
            if (
                typeof canvas.toBlob !==
                "function"
            ) {
                resolve(null);
                return;
            }

            canvas.toBlob(
                blob => {
                    if (
                        blob &&
                        blob.type ===
                            this.constants.PHOTO_MIME
                    ) {
                        resolve(blob);
                    } else {
                        resolve(null);
                    }
                },
                this.constants.PHOTO_MIME,
                quality
            );
        });
    },

    async encodeWebPWithWasm(
        imageData
    ) {
        if (
            !this.state.webpEncoder
        ) {
            const module =
                await import(
                    this.constants.WEBP_MODULE
                );

            if (
                !module ||
                typeof module.encode !==
                    "function"
            ) {
                throw new Error(
                    "Der WebP-Encoder konnte nicht geladen werden."
                );
            }

            this.state.webpEncoder =
                module.encode;
        }

        return this.state.webpEncoder(
            imageData,
            {
                quality:
                    70,
                method:
                    4
            }
        );
    },

    createPhotoFileName() {
        const timestamp =
            new Date()
                .toISOString()
                .replace(
                    /[:.]/g,
                    "-"
                );

        return `catchtrack-fangplatz-${timestamp}.webp`;
    },

    formatBytes(bytes) {
        const value =
            Number(bytes);

        if (
            !Number.isFinite(value) ||
            value < 0
        ) {
            return "0 KB";
        }

        if (value < 1024) {
            return `${value} B`;
        }

        if (value < 1024 * 1024) {
            return `${(
                value / 1024
            ).toFixed(0)} KB`;
        }

        return `${(
            value /
            1024 /
            1024
        ).toFixed(1)} MB`;
    },

    async openPhotoDatabase() {
        if (
            !window.indexedDB
        ) {
            throw new Error(
                "Lokaler Bildspeicher wird von diesem Browser nicht unterstützt."
            );
        }

        return new Promise(
            (resolve, reject) => {
                const request =
                    window.indexedDB.open(
                        this.constants.PHOTO_DB_NAME,
                        this.constants.PHOTO_DB_VERSION
                    );

                request.onupgradeneeded =
                    event => {
                        const database =
                            event.target.result;

                        if (
                            !database.objectStoreNames.contains(
                                this.constants.PHOTO_STORE
                            )
                        ) {
                            database.createObjectStore(
                                this.constants.PHOTO_STORE,
                                {
                                    keyPath:
                                        "key"
                                }
                            );
                        }
                    };

                request.onsuccess = () =>
                    resolve(
                        request.result
                    );

                request.onerror = () =>
                    reject(
                        request.error ||
                            new Error(
                                "Lokaler Bildspeicher konnte nicht geöffnet werden."
                            )
                    );
            }
        );
    },

    getPhotoDatabase() {
        return new Promise(
            (resolve, reject) => {
                const request =
                    window.indexedDB.open(
                        this.constants.PHOTO_DB_NAME,
                        this.constants.PHOTO_DB_VERSION
                    );

                request.onsuccess = () =>
                    resolve(
                        request.result
                    );

                request.onerror = () =>
                    reject(
                        request.error
                    );
            }
        );
    },

    async putStoredPhoto(
        waterId,
        photo
    ) {
        const userId =
            this.getCurrentUserId();

        const database =
            await this.getPhotoDatabase();

        const key =
            `${userId}:${Number(waterId)}`;

        await new Promise(
            (resolve, reject) => {
                const transaction =
                    database.transaction(
                        [
                            this.constants.PHOTO_STORE
                        ],
                        "readwrite"
                    );

                const store =
                    transaction.objectStore(
                        this.constants.PHOTO_STORE
                    );

                store.put({
                    key,
                    user_id: userId,
                    water_id:
                        Number(waterId),
                    file_name:
                        photo.fileName,
                    mime_type:
                        photo.mimeType,
                    size_bytes:
                        photo.size,
                    width:
                        photo.width,
                    height:
                        photo.height,
                    blob:
                        photo.blob,
                    updated_at:
                        new Date().toISOString()
                });

                transaction.oncomplete =
                    () => resolve();

                transaction.onerror =
                    () =>
                        reject(
                            transaction.error
                        );

                transaction.onabort =
                    () =>
                        reject(
                            transaction.error ||
                                new Error(
                                    "Foto konnte nicht gespeichert werden."
                                )
                        );
            }
        );

        database.close();

        this.execute(
            `
                INSERT INTO water_photos
                (
                    user_id,
                    water_id,
                    file_name,
                    mime_type,
                    size_bytes,
                    width,
                    height,
                    cloud_status,
                    updated_at
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(water_id)
                DO UPDATE SET
                    file_name = excluded.file_name,
                    mime_type = excluded.mime_type,
                    size_bytes = excluded.size_bytes,
                    width = excluded.width,
                    height = excluded.height,
                    cloud_status = 'pending',
                    updated_at = CURRENT_TIMESTAMP
            `,
            [
                userId,
                Number(waterId),
                photo.fileName,
                photo.mimeType,
                photo.size,
                photo.width,
                photo.height,
                "pending"
            ]
        );

        this.saveDatabase();
    },

    async getStoredPhoto(waterId) {
        const userId =
            this.getCurrentUserId();

        const database =
            await this.getPhotoDatabase();

        const key =
            `${userId}:${Number(waterId)}`;

        const result =
            await new Promise(
                (resolve, reject) => {
                    const transaction =
                        database.transaction(
                            [
                                this.constants.PHOTO_STORE
                            ],
                            "readonly"
                        );

                    const store =
                        transaction.objectStore(
                            this.constants.PHOTO_STORE
                        );

                    const request =
                        store.get(key);

                    request.onsuccess =
                        () =>
                            resolve(
                                request.result ||
                                    null
                            );

                    request.onerror =
                        () =>
                            reject(
                                request.error
                            );
                }
            );

        database.close();

        return result;
    },

    async deleteStoredPhoto(
        waterId
    ) {
        const userId =
            this.getCurrentUserId();

        const database =
            await this.getPhotoDatabase();

        const key =
            `${userId}:${Number(waterId)}`;

        await new Promise(
            (resolve, reject) => {
                const transaction =
                    database.transaction(
                        [
                            this.constants.PHOTO_STORE
                        ],
                        "readwrite"
                    );

                transaction.objectStore(
                    this.constants.PHOTO_STORE
                ).delete(key);

                transaction.oncomplete =
                    () => resolve();

                transaction.onerror =
                    () =>
                        reject(
                            transaction.error
                        );

                transaction.onabort =
                    () =>
                        reject(
                            transaction.error ||
                                new Error(
                                    "Lokales Foto konnte nicht gelöscht werden."
                                )
                        );
            }
        );

        database.close();

        this.execute(
            `
                DELETE FROM water_photos
                WHERE water_id = ?
                  AND user_id = ?
            `,
            [
                Number(waterId),
                userId
            ]
        );

        this.saveDatabase();
    },

    async persistPhotoForWater(
        waterId
    ) {
        if (
            !this.state.pendingPhoto
        ) {
            return;
        }

        await this.putStoredPhoto(
            waterId,
            this.state.pendingPhoto
        );

        this.state.pendingPhoto = null;
    },

    async loadExistingPhoto(
        waterId
    ) {
        try {
            const photo =
                await this.getStoredPhoto(
                    waterId
                );

            this.state.existingPhoto =
                photo;

            if (photo?.blob) {
                this.renderPendingPhoto(
                    photo.blob
                );

                this.setPhotoStatus(
                    `${this.formatBytes(
                        photo.size_bytes
                    )} · WebP · ${photo.width} × ${photo.height} px`,
                    "success"
                );
            } else {
                this.clearPhotoPreview();
            }
        } catch (error) {
            this.state.existingPhoto =
                null;

            this.handleError(
                error,
                "waters:photo-load"
            );
        }
    },

    renderPendingPhoto(blob) {
        const container =
            document.getElementById(
                "waters-photo-preview"
            );

        if (!container) {
            return;
        }

        this.clearPhotoPreview();

        const image =
            document.createElement(
                "img"
            );

        const url =
            URL.createObjectURL(
                blob
            );

        image.src = url;
        image.alt =
            "Fangplatzfoto";

        image.addEventListener(
            "load",
            () => {
                if (
                    this.state.photoObjectUrl ===
                    url
                ) {
                    this.state.photoObjectUrl =
                        null;
                }

                URL.revokeObjectURL(
                    url
                );
            },
            {
                once: true
            }
        );

        container.appendChild(
            image
        );

        container.hidden = false;
    },

    clearPhotoPreview() {
        const container =
            document.getElementById(
                "waters-photo-preview"
            );

        if (container) {
            container.innerHTML = "";
            container.hidden = true;
        }

        if (
            this.state.photoObjectUrl
        ) {
            URL.revokeObjectURL(
                this.state.photoObjectUrl
            );

            this.state.photoObjectUrl =
                null;
        }

        const input =
            document.getElementById(
                "waters-photo"
            );

        if (input) {
            input.value = "";
        }

        this.setPhotoStatus(
            "",
            "info"
        );
    },

    setPhotoStatus(
        message,
        type = "info"
    ) {
        const element =
            document.getElementById(
                "waters-photo-status"
            );

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.className =
            "waters-message";

        if (type === "error") {
            element.classList.add(
                "waters-message-error"
            );
        }

        if (type === "success") {
            element.classList.add(
                "waters-message-success"
            );
        }
    },

    bindEvents() {
        document
            .getElementById(
                "waters-form"
            )
            ?.addEventListener(
                "submit",
                event => {
                    event.preventDefault();
                    this.submitForm();
                }
            );

        document
            .getElementById(
                "waters-location-button"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.useGPSForForm()
            );

        document
            .getElementById(
                "waters-gps-button"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.updateGPS()
            );

        document
            .getElementById(
                "waters-refresh-button"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.refresh()
            );

        document
            .getElementById(
                "waters-cancel-button"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.resetForm()
            );

        document
            .getElementById(
                "waters-photo"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.handlePhotoSelection(
                        event
                    )
            );
    },

    setStatus(
        message,
        type = "info"
    ) {
        const element =
            document.getElementById(
                "waters-status"
            );

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.className =
            "waters-status";

        if (type === "error") {
            element.classList.add(
                "waters-message-error"
            );
        }

        if (type === "success") {
            element.classList.add(
                "waters-message-success"
            );
        }
    },

    setGPSMessage(
        message,
        type = "info"
    ) {
        const element =
            document.getElementById(
                "waters-gps-status"
            );

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.className =
            "waters-message";

        if (type === "error") {
            element.classList.add(
                "waters-message-error"
            );
        }

        if (type === "success") {
            element.classList.add(
                "waters-message-success"
            );
        }
    },

    setFormMessage(
        message,
        type = "info"
    ) {
        const element =
            document.getElementById(
                "waters-form-message"
            );

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.className =
            "waters-message";

        if (type === "error") {
            element.classList.add(
                "waters-message-error"
            );
        }

        if (type === "success") {
            element.classList.add(
                "waters-message-success"
            );
        }
    },

    handleError(
        error,
        source
    ) {
        if (
            window.CatchTrackErrorHandler &&
            typeof
                window.CatchTrackErrorHandler.handle ===
                "function"
        ) {
            window.CatchTrackErrorHandler.handle(
                error,
                source
            );
        } else {
            console.error(
                source,
                error
            );
        }
    }
};