"use strict";

window.CatchTrackWatersModule = {

    version: "2.0.0",

    initialized: false,

    constants: {
        MAX_PHOTO_EDGE: 720,
        PHOTO_QUALITY: 0.70,
        PHOTO_MIME: "image/webp",

        GEO_URL:
            "https://api.bigdatacloud.net/data/reverse-geocode-client",

        GEO_LANGUAGE: "de",

        PHOTO_DB_NAME:
            "CatchTrackWatersPhotos",

        PHOTO_DB_VERSION: 1,

        PHOTO_STORE:
            "photos"
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
        photoObjectUrl: null
    },

    async init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        try {

            this.bindEvents();

            await this.openPhotoDatabase();

            this.setStatus(
                "Gewässer werden geladen …",
                "info"
            );

            await this.refresh();

            window.setTimeout(
                () => this.autoGetGPS(),
                250
            );

        } catch (error) {

            this.handleError(
                error,
                "waters:init"
            );

            /*
             * Waters darf niemals den Start
             * von CatchTrack blockieren.
             */
            this.setStatus(
                "Waters ist derzeit nicht verfügbar.",
                "error"
            );
        }
    },

    getDatabase() {

        const database =
            window.CatchTrackDatabase;

        if (
            !database ||
            typeof database.isReady !== "function" ||
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

        const userId =
            Number(
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

    getTableColumns(tableName) {

        return this.getDatabase()
            .getTableColumns(tableName);
    },

    checkSchema() {

        const database =
            this.getDatabase();

        const watersColumns =
            database.getTableColumns(
                "waters"
            );

        const requiredWaters = [
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

        const missingWaters =
            requiredWaters.filter(
                column =>
                    !watersColumns.includes(column)
            );

        let photoTableAvailable = true;

        try {

            database.getTableColumns(
                "water_photos"
            );

        } catch (error) {

            photoTableAvailable = false;
        }

        return {
            valid:
                missingWaters.length === 0 &&
                photoTableAvailable,

            missingWaters,
            photoTableAvailable
        };
    },

    ensureSchema() {

        const schema =
            this.checkSchema();

        if (!schema.valid) {

            const missing =
                schema.missingWaters.length
                    ? schema.missingWaters.join(", ")
                    : "water_photos";

            throw new Error(
                "Waters-Datenbankschema unvollständig: " +
                missing +
                ". Bitte Migration 006 ausführen."
            );
        }

        return true;
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

        const number =
            Number(value);

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

        const number =
            Number(value);

        return Number.isFinite(number) &&
            number >= 0
            ? number
            : null;
    },

    normalizeWater(row) {

        if (
            !row ||
            typeof row !== "object"
        ) {
            return null;
        }

        const numberOrNull =
            value => {

                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return null;
                }

                const number =
                    Number(value);

                return Number.isFinite(number)
                    ? number
                    : null;
            };

        return {

            id:
                numberOrNull(row.id),

            user_id:
                numberOrNull(row.user_id),

            name:
                String(row.name ?? ""),

            type:
                String(row.type ?? ""),

            country:
                String(row.country ?? ""),

            region:
                String(row.region ?? ""),

            city:
                String(row.city ?? ""),

            description:
                String(row.description ?? ""),

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
                row.gps_timestamp ?? null,

            created_at:
                row.created_at ?? null,

            updated_at:
                row.updated_at ?? null
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
        .map(
            row =>
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

    validateData(data) {

        const source =
            data || {};

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

            name:
                name.slice(0, 150),

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

    async refresh() {

        try {

            const schema =
                this.checkSchema();

            if (!schema.valid) {

                this.state.waters = [];

                this.renderList();

                this.setStatus(
                    "Waters-Datenbank benötigt Migration 006.",
                    "error"
                );

                return;
            }

            this.state.waters =
                this.getAll();

            this.renderList();

            this.setStatus(
                this.state.waters.length
                    ? `${this.state.waters.length} Fangplätze geladen.`
                    : "Noch keine Fangplätze gespeichert.",
                "success"
            );

        } catch (error) {

            this.state.waters = [];

            this.renderList();

            this.handleError(
                error,
                "waters:refresh"
            );

            this.setStatus(
                "Waters konnte nicht geladen werden.",
                "error"
            );
        }
    },

    async create(data) {

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
                this.state.currentPosition?.timestamp ??
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

    async update(id, data) {

        this.ensureSchema();

        const waterId =
            Number(id);

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
                this.state.currentPosition?.timestamp ??
                    null,
                waterId,
                userId
            ]
        );

        this.saveDatabase();

        return this.getById(
            waterId
        );
    },

    async remove(id) {

        this.ensureSchema();

        const waterId =
            Number(id);

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
                DELETE FROM water_photos
                WHERE water_id = ?
                  AND user_id = ?
            `,
            [
                waterId,
                userId
            ]
        );

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

        await this.deletePhoto(
            waterId
        );

        this.saveDatabase();

        return true;
    },

    async requestGPSPosition() {

        if (
            !navigator.geolocation
        ) {
            throw new Error(
                "Die Standortbestimmung wird von diesem Gerät nicht unterstützt."
            );
        }

        if (
            this.state.gpsBusy
        ) {
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

                        navigator.geolocation.getCurrentPosition(
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
                    position.coords.latitude
                );

            const longitude =
                Number(
                    position.coords.longitude
                );

            const accuracy =
                Number(
                    position.coords.accuracy
                );

            const timestamp =
                new Date(
                    position.timestamp
                ).toISOString();

            this.state.currentPosition = {
                latitude,
                longitude,
                accuracy,
                timestamp
            };

            await this.reverseGeocode(
                latitude,
                longitude
            );

            this.updateLocationUI();

            return this.state.currentPosition;

        } catch (error) {

            const message =
                this.getGeolocationErrorMessage(
                    error
                );

            this.setGPSStatus(
                message,
                "error"
            );

            throw new Error(
                message
            );

        } finally {

            this.state.gpsBusy = false;
        }
    },

    async autoGetGPS() {

        try {

            await this.requestGPSPosition();

        } catch (error) {

            this.setGPSStatus(
                "Standort konnte nicht automatisch ermittelt werden.",
                "error"
            );
        }
    },

    getGeolocationErrorMessage(error) {

        if (
            error?.code === 1
        ) {
            return "Standortberechtigung wurde verweigert.";
        }

        if (
            error?.code === 2
        ) {
            return "Standort ist momentan nicht verfügbar.";
        }

        if (
            error?.code === 3
        ) {
            return "Zeitüberschreitung bei der Standortbestimmung.";
        }

        return (
            error?.message ||
            "Standort konnte nicht ermittelt werden."
        );
    },

    async reverseGeocode(
        latitude,
        longitude
    ) {

        const url =
            new URL(
                this.constants.GEO_URL
            );

        url.searchParams.set(
            "latitude",
            latitude
        );

        url.searchParams.set(
            "longitude",
            longitude
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
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                `Standortdienst nicht erreichbar (${response.status}).`
            );
        }

        const data =
            await response.json();

        this.state.currentLocation = {

            country:
                data.countryName ||
                data.countryNameLocal ||
                "",

            region:
                data.principalSubdivision ||
                "",

            city:
                data.city ||
                data.locality ||
                data.localityInfo?.administrative?.[2]?.name ||
                ""
        };

        this.applyLocationToForm();

        return this.state.currentLocation;
    },

    applyLocationToForm() {

        const location =
            this.state.currentLocation;

        if (!location) {
            return;
        }

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
                location.country || "";
        }

        if (region) {
            region.value =
                location.region || "";
        }

        if (city) {
            city.value =
                location.city || "";
        }
    },

    updateLocationUI() {

        const position =
            this.state.currentPosition;

        const container =
            document.getElementById(
                "waters-current-position"
            );

        if (!position || !container) {
            return;
        }

        container.hidden = false;

        container.innerHTML = `

            <div class="waters-position-value">
                <span class="waters-position-label">
                    Breitengrad
                </span>
                <span class="waters-position-number">
                    ${this.escapeHtml(
                        position.latitude.toFixed(6)
                    )}
                </span>
            </div>

            <div class="waters-position-value">
                <span class="waters-position-label">
                    Längengrad
                </span>
                <span class="waters-position-number">
                    ${this.escapeHtml(
                        position.longitude.toFixed(6)
                    )}
                </span>
            </div>

            <div class="waters-position-value">
                <span class="waters-position-label">
                    Genauigkeit
                </span>
                <span class="waters-position-number">
                    ${this.escapeHtml(
                        `${Math.round(position.accuracy)} m`
                    )}
                </span>
            </div>

            <div class="waters-position-value">
                <span class="waters-position-label">
                    Ort
                </span>
                <span class="waters-position-number">
                    ${this.escapeHtml(
                        this.state.currentLocation?.city ||
                        "--"
                    )}
                </span>
            </div>
        `;

        this.setGPSStatus(
            "Standort erfolgreich ermittelt.",
            "success"
        );
    },

    applyPositionToForm() {

        const position =
            this.state.currentPosition;

        if (!position) {
            throw new Error(
                "Es ist noch kein GPS-Standort verfügbar."
            );
        }

        document.getElementById(
            "waters-latitude"
        ).value =
            position.latitude;

        document.getElementById(
            "waters-longitude"
        ).value =
            position.longitude;

        document.getElementById(
            "waters-accuracy"
        ).value =
            `${Math.round(position.accuracy)} m`;

        this.applyLocationToForm();
    },

    async handleGPS() {

        const button =
            document.getElementById(
                "waters-gps-button"
            );

        try {

            if (button) {
                button.disabled = true;
            }

            this.setGPSStatus(
                "Standort wird ermittelt …",
                "info"
            );

            await this.requestGPSPosition();

            this.applyPositionToForm();

        } catch (error) {

            this.setGPSStatus(
                error.message,
                "error"
            );

        } finally {

            if (button) {
                button.disabled = false;
            }
        }
    },

    async openPhotoDatabase() {

        if (
            !window.indexedDB
        ) {
            throw new Error(
                "Lokaler Fotospeicher wird von diesem Gerät nicht unterstützt."
            );
        }

        if (this.photoDatabase) {
            return this.photoDatabase;
        }

        this.photoDatabase =
            await new Promise(
                (
                    resolve,
                    reject
                ) => {

                    const request =
                        indexedDB.open(
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
                                        keyPath: "waterId"
                                    }
                                );
                            }
                        };

                    request.onsuccess =
                        () =>
                            resolve(
                                request.result
                            );

                    request.onerror =
                        () =>
                            reject(
                                request.error ||
                                new Error(
                                    "Fotospeicher konnte nicht geöffnet werden."
                                )
                            );
                }
            );

        return this.photoDatabase;
    },

    async savePhoto(
        waterId,
        photo
    ) {

        if (!photo) {
            return;
        }

        const database =
            await this.openPhotoDatabase();

        await new Promise(
            (
                resolve,
                reject
            ) => {

                const transaction =
                    database.transaction(
                        this.constants.PHOTO_STORE,
                        "readwrite"
                    );

                transaction.objectStore(
                    this.constants.PHOTO_STORE
                ).put({
                    waterId:
                        Number(waterId),
                    blob:
                        photo.blob,
                    fileName:
                        photo.fileName,
                    mimeType:
                        photo.mimeType,
                    sizeBytes:
                        photo.blob.size,
                    width:
                        photo.width,
                    height:
                        photo.height,
                    createdAt:
                        new Date().toISOString()
                });

                transaction.oncomplete =
                    () => resolve();

                transaction.onerror =
                    () =>
                        reject(
                            transaction.error
                        );
            }
        );
    },

    async getPhoto(
        waterId
    ) {

        const database =
            await this.openPhotoDatabase();

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const transaction =
                    database.transaction(
                        this.constants.PHOTO_STORE,
                        "readonly"
                    );

                const request =
                    transaction.objectStore(
                        this.constants.PHOTO_STORE
                    ).get(
                        Number(waterId)
                    );

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
    },

    async deletePhoto(
        waterId
    ) {

        const database =
            await this.openPhotoDatabase();

        await new Promise(
            (
                resolve,
                reject
            ) => {

                const transaction =
                    database.transaction(
                        this.constants.PHOTO_STORE,
                        "readwrite"
                    );

                transaction.objectStore(
                    this.constants.PHOTO_STORE
                ).delete(
                    Number(waterId)
                );

                transaction.oncomplete =
                    () => resolve();

                transaction.onerror =
                    () =>
                        reject(
                            transaction.error
                        );
            }
        );
    },

    async processPhoto(
        file
    ) {

        if (!file) {
            return null;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            throw new Error(
                "Die ausgewählte Datei ist kein Bild."
            );
        }

        const image =
            await this.loadImage(
                file
            );

        const originalWidth =
            image.naturalWidth;

        const originalHeight =
            image.naturalHeight;

        const scale =
            Math.min(
                1,
                this.constants.MAX_PHOTO_EDGE /
                    Math.max(
                        originalWidth,
                        originalHeight
                    )
            );

        const width =
            Math.max(
                1,
                Math.round(
                    originalWidth * scale
                )
            );

        const height =
            Math.max(
                1,
                Math.round(
                    originalHeight * scale
                )
            );

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width =
            width;

        canvas.height =
            height;

        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );

        context.drawImage(
            image,
            0,
            0,
            width,
            height
        );

        const blob =
            await new Promise(
                (
                    resolve,
                    reject
                ) => {

                    canvas.toBlob(
                        result => {

                            if (!result) {
                                reject(
                                    new Error(
                                        "WebP-Komprimierung wird von diesem Gerät nicht unterstützt."
                                    )
                                );
                                return;
                            }

                            resolve(
                                result
                            );
                        },
                        this.constants.PHOTO_MIME,
                        this.constants.PHOTO_QUALITY
                    );
                }
            );

        return {

            blob,

            fileName:
                this.createWebPFileName(
                    file.name
                ),

            mimeType:
                this.constants.PHOTO_MIME,

            width,

            height
        };
    },

    createWebPFileName(
        originalName
    ) {

        const base =
            String(
                originalName ||
                "fangplatz"
            )
            .replace(
                /\.[^/.]+$/,
                ""
            )
            .replace(
                /[^a-zA-Z0-9_-]+/g,
                "_"
            );

        return (
            base ||
            "fangplatz"
        ) + ".webp";
    },

    loadImage(
        file
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const url =
                    URL.createObjectURL(
                        file
                    );

                const image =
                    new Image();

                image.onload =
                    () => {

                        URL.revokeObjectURL(
                            url
                        );

                        resolve(
                            image
                        );
                    };

                image.onerror =
                    () => {

                        URL.revokeObjectURL(
                            url
                        );

                        reject(
                            new Error(
                                "Bild konnte nicht gelesen werden."
                            )
                        );
                    };

                image.src =
                    url;
            }
        );
    },

    async handlePhoto(
        event
    ) {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            this.state.pendingPhoto = null;

            this.setPhotoStatus(
                "Foto wird optimiert …",
                "info"
            );

            const photo =
                await this.processPhoto(
                    file
                );

            this.state.pendingPhoto =
                photo;

            this.renderPhotoPreview(
                photo.blob,
                photo.width,
                photo.height
            );

            this.setPhotoStatus(
                `WebP erstellt: ${this.formatBytes(
                    photo.blob.size
                )}`,
                "success"
            );

        } catch (error) {

            this.state.pendingPhoto = null;

            this.setPhotoStatus(
                error.message,
                "error"
            );

            event.target.value = "";
        }
    },

    renderPhotoPreview(
        blob,
        width,
        height
    ) {

        const container =
            document.getElementById(
                "waters-photo-preview"
            );

        if (!container) {
            return;
        }

        if (this.state.photoObjectUrl) {

            URL.revokeObjectURL(
                this.state.photoObjectUrl
            );
        }

        const url =
            URL.createObjectURL(
                blob
            );

        this.state.photoObjectUrl =
            url;

        container.hidden = false;

        container.innerHTML = `

            <img
                src="${this.escapeHtml(url)}"
                alt="Fangplatz-Foto"
            >

            <div class="waters-photo-preview-meta">
                ${width} × ${height} px ·
                ${this.escapeHtml(
                    this.formatBytes(blob.size)
                )} · WebP
            </div>
        `;
    },

    formatBytes(
        bytes
    ) {

        const value =
            Number(bytes);

        if (
            !Number.isFinite(value) ||
            value <= 0
        ) {
            return "0 B";
        }

        if (value < 1024) {
            return `${Math.round(value)} B`;
        }

        if (value < 1024 * 1024) {
            return `${Math.round(value / 1024)} KB`;
        }

        return `${(
            value /
            1024 /
            1024
        ).toFixed(2)} MB`;
    },

    async saveForm() {

        if (this.state.busy) {
            return;
        }

        this.state.busy = true;

        try {

            this.ensureSchema();

            const form =
                document.getElementById(
                    "waters-form"
                );

            const formData =
                new FormData(
                    form
                );

            const data = {

                name:
                    formData.get("name"),

                type:
                    formData.get("type"),

                country:
                    formData.get("country"),

                region:
                    formData.get("region"),

                city:
                    formData.get("city"),

                description:
                    formData.get("description"),

                gps_lat:
                    formData.get("gps_lat"),

                gps_lon:
                    formData.get("gps_lon"),

                gps_accuracy_m:
                    formData.get(
                        "gps_accuracy_m"
                    )
                    .toString()
                    .replace(
                        " m",
                        ""
                    )
            };

            const id =
                Number(
                    formData.get("id")
                );

            let water;

            if (
                Number.isInteger(id) &&
                id > 0
            ) {

                water =
                    await this.update(
                        id,
                        data
                    );

            } else {

                water =
                    await this.create(
                        data
                    );
            }

            if (!water) {
                throw new Error(
                    "Fangplatz konnte nicht gespeichert werden."
                );
            }

            if (
                this.state.pendingPhoto
            ) {

                await this.savePhoto(
                    water.id,
                    this.state.pendingPhoto
                );

                this.execute(
                    `
                        UPDATE water_photos
                        SET
                            file_name = ?,
                            mime_type = ?,
                            size_bytes = ?,
                            width = ?,
                            height = ?,
                            cloud_status = 'pending',
                            updated_at = CURRENT_TIMESTAMP
                        WHERE water_id = ?
                          AND user_id = ?
                    `,
                    [
                        this.state.pendingPhoto.fileName,
                        this.state.pendingPhoto.mimeType,
                        this.state.pendingPhoto.blob.size,
                        this.state.pendingPhoto.width,
                        this.state.pendingPhoto.height,
                        water.id,
                        this.getCurrentUserId()
                    ]
                );

            }

            this.saveDatabase();

            this.resetForm();

            await this.refresh();

            this.setFormMessage(
                "Fangplatz erfolgreich gespeichert.",
                "success"
            );

        } catch (error) {

            this.handleError(
                error,
                "waters:save"
            );

            this.setFormMessage(
                error.message ||
                    "Fangplatz konnte nicht gespeichert werden.",
                "error"
            );

        } finally {

            this.state.busy = false;
        }
    },

    async savePhotoMetadata(
        waterId,
        photo
    ) {

        const userId =
            this.getCurrentUserId();

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
                    cloud_status
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, 'pending')
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
                waterId,
                photo.fileName,
                photo.mimeType,
                photo.blob.size,
                photo.width,
                photo.height
            ]
        );
    },

    async edit(
        id
    ) {

        try {

            const water =
                this.getById(id);

            if (!water) {
                throw new Error(
                    "Fangplatz wurde nicht gefunden."
                );
            }

            this.state.editingId =
                water.id;

            this.fillForm(
                water
            );

            const photo =
                await this.getPhoto(
                    water.id
                );

            if (photo?.blob) {

                this.renderPhotoPreview(
                    photo.blob,
                    photo.width,
                    photo.height
                );

                this.state.existingPhoto =
                    photo;
            }

            document.getElementById(
                "waters-cancel-button"
            ).hidden = false;

            document.getElementById(
                "waters-form-title"
            ).textContent =
                "Fangplatz bearbeiten";

            document.getElementById(
                "waters-save-button"
            ).textContent =
                "Änderungen speichern";

            window.scrollTo({
                top:
                    document.getElementById(
                        "waters-form"
                    ).offsetTop -
                    20,
                behavior: "smooth"
            });

        } catch (error) {

            this.handleError(
                error,
                "waters:edit"
            );
        }
    },

    async deleteWater(
        id
    ) {

        const water =
            this.getById(id);

        if (!water) {
            return;
        }

        if (
            !window.confirm(
                `Fangplatz "${water.name}" wirklich löschen?`
            )
        ) {
            return;
        }

        try {

            await this.remove(
                water.id
            );

            this.resetForm();

            await this.refresh();

        } catch (error) {

            this.handleError(
                error,
                "waters:delete"
            );

            this.setStatus(
                error.message,
                "error"
            );
        }
    },

    fillForm(
        water
    ) {

        document.getElementById(
            "waters-id"
        ).value =
            water.id ?? "";

        document.getElementById(
            "waters-name"
        ).value =
            water.name ?? "";

        document.getElementById(
            "waters-type"
        ).value =
            water.type ?? "";

        document.getElementById(
            "waters-country"
        ).value =
            water.country ?? "";

        document.getElementById(
            "waters-region"
        ).value =
            water.region ?? "";

        document.getElementById(
            "waters-city"
        ).value =
            water.city ?? "";

        document.getElementById(
            "waters-description"
        ).value =
            water.description ?? "";

        document.getElementById(
            "waters-latitude"
        ).value =
            water.gps_lat ?? "";

        document.getElementById(
            "waters-longitude"
        ).value =
            water.gps_lon ?? "";

        document.getElementById(
            "waters-accuracy"
        ).value =
            water.gps_accuracy_m !== null
                ? `${water.gps_accuracy_m} m`
                : "";
    },

    resetForm() {

        const form =
            document.getElementById(
                "waters-form"
            );

        if (form) {
            form.reset();
        }

        this.state.editingId = null;
        this.state.pendingPhoto = null;
        this.state.existingPhoto = null;

        if (this.state.photoObjectUrl) {

            URL.revokeObjectURL(
                this.state.photoObjectUrl
            );

            this.state.photoObjectUrl =
                null;
        }

        const preview =
            document.getElementById(
                "waters-photo-preview"
            );

        if (preview) {

            preview.hidden = true;
            preview.innerHTML = "";
        }

        const id =
            document.getElementById(
                "waters-id"
            );

        if (id) {
            id.value = "";
        }

        document.getElementById(
            "waters-form-title"
        ).textContent =
            "Fangplatz erfassen";

        document.getElementById(
            "waters-save-button"
        ).textContent =
            "Fangplatz speichern";

        document.getElementById(
            "waters-cancel-button"
        ).hidden = true;

        this.setFormMessage(
            "",
            "info"
        );

        this.setPhotoStatus(
            "",
            "info"
        );

        this.applyPositionToFormIfAvailable();
    },

    applyPositionToFormIfAvailable() {

        if (
            !this.state.currentPosition
        ) {
            return;
        }

        try {
            this.applyPositionToForm();
        } catch {
            // Keine Aktion erforderlich.
        }
    },

    renderList() {

        const container =
            document.getElementById(
                "waters-list"
            );

        const count =
            document.getElementById(
                "waters-count"
            );

        if (!container) {
            return;
        }

        const waters =
            this.state.waters;

        if (count) {
            count.textContent =
                String(
                    waters.length
                );
        }

        if (!waters.length) {

            container.innerHTML = `
                <div class="waters-empty">
                    Noch keine Fangplätze vorhanden.
                </div>
            `;

            return;
        }

        container.innerHTML =
            waters
                .map(
                    water =>
                        this.renderCard(
                            water
                        )
                )
                .join("");

        waters.forEach(
            water =>
                this.loadCardPhoto(
                    water.id
                )
        );
    },

    renderCard(
        water
    ) {

        const location =
            [
                water.city,
                water.region,
                water.country
            ]
            .filter(Boolean)
            .join(", ");

        const coordinates =
            water.gps_lat !== null &&
            water.gps_lon !== null
                ? `${water.gps_lat.toFixed(6)}, ${water.gps_lon.toFixed(6)}`
                : "Keine GPS-Daten";

        return `

            <article
                class="waters-card"
                data-water-id="${water.id}"
            >

                <div
                    class="waters-card-photo"
                    id="waters-card-photo-${water.id}"
                ></div>

                <div class="waters-card-content">

                    <div class="waters-card-header">

                        <div>

                            <h3 class="waters-card-title">
                                ${this.escapeHtml(
                                    water.name
                                )}
                            </h3>

                            <div class="waters-card-meta">

                                ${
                                    water.type
                                        ? `<span>${this.escapeHtml(
                                            water.type
                                        )}</span>`
                                        : ""
                                }

                                ${
                                    location
                                        ? `<span>${this.escapeHtml(
                                            location
                                        )}</span>`
                                        : ""
                                }

                            </div>

                        </div>

                    </div>

                    ${
                        water.description
                            ? `<p class="waters-card-description">
                                ${this.escapeHtml(
                                    water.description
                                )}
                            </p>`
                            : ""
                    }

                    <div class="waters-card-coordinates">
                        GPS: ${this.escapeHtml(
                            coordinates
                        )}
                    </div>

                    <div class="waters-card-actions">

                        <button
                            class="waters-button waters-button-secondary"
                            type="button"
                            data-action="edit"
                            data-id="${water.id}"
                        >
                            Bearbeiten
                        </button>

                        <button
                            class="waters-button waters-button-secondary"
                            type="button"
                            data-action="delete"
                            data-id="${water.id}"
                        >
                            Löschen
                        </button>

                    </div>

                </div>

            </article>
        `;
    },

    async loadCardPhoto(
        waterId
    ) {

        try {

            const photo =
                await this.getPhoto(
                    waterId
                );

            const container =
                document.getElementById(
                    `waters-card-photo-${waterId}`
                );

            if (
                !container ||
                !photo?.blob
            ) {
                return;
            }

            const url =
                URL.createObjectURL(
                    photo.blob
                );

            container.innerHTML = `
                <img
                    src="${this.escapeHtml(url)}"
                    alt="Fangplatz-Foto"
                >
            `;

            window.setTimeout(
                () =>
                    URL.revokeObjectURL(
                        url
                    ),
                60000
            );

        } catch (error) {

            this.handleError(
                error,
                "waters:photo"
            );
        }
    },

    bindEvents() {

        document.getElementById(
            "waters-refresh-button"
        )?.addEventListener(
            "click",
            () => this.refresh()
        );

        document.getElementById(
            "waters-gps-button"
        )?.addEventListener(
            "click",
            () => this.handleGPS()
        );

        document.getElementById(
            "waters-location-button"
        )?.addEventListener(
            "click",
            () => {

                try {

                    this.applyPositionToForm();

                    this.setGPSStatus(
                        "Aktueller Standort übernommen.",
                        "success"
                    );

                } catch (error) {

                    this.setGPSStatus(
                        error.message,
                        "error"
                    );
                }
            }
        );

        document.getElementById(
            "waters-cancel-button"
        )?.addEventListener(
            "click",
            () => this.resetForm()
        );

        document.getElementById(
            "waters-form"
        )?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.saveForm();
            }
        );

        document.getElementById(
            "waters-photo"
        )?.addEventListener(
            "change",
            event =>
                this.handlePhoto(event)
        );

        document.getElementById(
            "waters-list"
        )?.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {
                    return;
                }

                const id =
                    Number(
                        button.dataset.id
                    );

                if (
                    button.dataset.action ===
                    "edit"
                ) {

                    this.edit(id);

                } else if (
                    button.dataset.action ===
                    "delete"
                ) {

                    this.deleteWater(id);
                }
            }
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

        if (type) {
            element.classList.add(
                `waters-message-${type}`
            );
        }
    },

    setGPSStatus(
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

        if (type) {
            element.classList.add(
                `waters-message-${type}`
            );
        }
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

        if (type) {
            element.classList.add(
                `waters-message-${type}`
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

        if (type) {
            element.classList.add(
                `waters-message-${type}`
            );
        }
    },

    escapeHtml(
        value
    ) {

        const element =
            document.createElement(
                "div"
            );

        element.textContent =
            String(
                value ?? ""
            );

        return element.innerHTML;
    },

    handleError(
        error,
        context
    ) {

        if (
            window.CatchTrackErrorHandler &&
            typeof window.CatchTrackErrorHandler.handle ===
                "function"
        ) {

            window.CatchTrackErrorHandler.handle(
                error,
                context
            );
        } else {

            console.error(
                `[${context}]`,
                error
            );
        }
    }
};