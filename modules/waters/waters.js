"use strict";


window.CatchTrackWatersModule = {

    version: "4.2.0",

    initialized: false,

    schemaReady: false,

    state: {
        waters: [],
        nearby: [],
        editingId: null,
        busy: false,
        gpsBusy: false,
        currentPosition: null,
        locationResolved: false
    },


    init() {

        if (this.initialized) {
            return;
        }

        try {

            this.ensureSchema();

            this.bindEvents();

            this.initialized = true;

            this.refresh();

            this.autoFillLocation();

        }
        catch (error) {

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

        if (
            window.CatchTrackDatabase &&
            CatchTrackDatabase.isReady()
        ) {

            return CatchTrackDatabase;

        }

        throw new Error(
            "CatchTrack-Datenbank ist nicht verfügbar."
        );

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
            identity.getCurrentUserId();

        if (
            userId === null ||
            userId === undefined ||
            userId === ""
        ) {

            throw new Error(
                "Kein aktiver Benutzer vorhanden."
            );

        }

        const numericUserId =
            Number(userId);

        if (
            !Number.isInteger(
                numericUserId
            ) ||
            numericUserId <= 0
        ) {

            throw new Error(
                "Ungültige Benutzer-ID."
            );

        }

        return numericUserId;

    },


    ensureSchema() {

        if (this.schemaReady) {
            return true;
        }

        const database =
            this.getDatabase();

        const columns =
            database.getTableColumns(
                "waters"
            );

        if (!columns.length) {

            throw new Error(
                "Die Tabelle waters ist im Basisschema nicht vorhanden."
            );

        }

        if (
            !columns.includes(
                "user_id"
            )
        ) {

            database.executeScript(
                `
                    ALTER TABLE waters
                    ADD COLUMN user_id INTEGER
                    REFERENCES users(id);

                    CREATE INDEX IF NOT EXISTS
                    idx_waters_user_id
                    ON waters(user_id);
                `
            );

        }

        this.schemaReady = true;

        return true;

    },


    query(
        sql,
        params = []
    ) {

        return this.getDatabase()
            .query(
                sql,
                params
            );

    },


    execute(
        sql,
        params = []
    ) {

        return this.getDatabase()
            .execute(
                sql,
                params
            );

    },


    saveDatabase() {

        return this.getDatabase()
            .saveDatabase();

    },


    normalizeWater(
        row
    ) {

        if (
            !row ||
            typeof row !== "object"
        ) {

            return null;

        }

        const id =
            Number(row.id);

        const userId =
            row.user_id === null ||
            row.user_id === undefined
                ? null
                : Number(row.user_id);

        const latitude =
            row.gps_lat === null ||
            row.gps_lat === undefined
                ? null
                : Number(row.gps_lat);

        const longitude =
            row.gps_lon === null ||
            row.gps_lon === undefined
                ? null
                : Number(row.gps_lon);

        return {

            id:
                Number.isFinite(id)
                    ? id
                    : null,

            user_id:
                Number.isFinite(userId)
                    ? userId
                    : null,

            name:
                String(
                    row.name ?? ""
                ),

            type:
                String(
                    row.type ?? ""
                ),

            country:
                String(
                    row.country ?? ""
                ),

            region:
                String(
                    row.region ?? ""
                ),

            description:
                String(
                    row.description ?? ""
                ),

            gps_lat:
                Number.isFinite(latitude)
                    ? latitude
                    : null,

            gps_lon:
                Number.isFinite(longitude)
                    ? longitude
                    : null,

            created_at:
                row.created_at ?? null,

            updated_at:
                row.updated_at ?? null

        };

    },


    getAll() {

        const userId =
            this.getCurrentUserId();

        return this.query(
            `
                SELECT
                    id,
                    user_id,
                    name,
                    type,
                    country,
                    region,
                    description,
                    gps_lat,
                    gps_lon,
                    created_at,
                    updated_at
                FROM waters
                WHERE user_id = ?
                ORDER BY name COLLATE NOCASE ASC
            `,
            [
                userId
            ]
        )
        .map(
            row =>
                this.normalizeWater(
                    row
                )
        )
        .filter(
            Boolean
        );

    },


    getById(
        id
    ) {

        const userId =
            this.getCurrentUserId();

        const waterId =
            Number(id);

        if (
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {

            return null;

        }

        const rows =
            this.query(
                `
                    SELECT
                        id,
                        user_id,
                        name,
                        type,
                        country,
                        region,
                        description,
                        gps_lat,
                        gps_lon,
                        created_at,
                        updated_at
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
            ? this.normalizeWater(
                rows[0]
            )
            : null;

    },


    getCount() {

        return this.getAll()
            .length;

    },


    create(
        data
    ) {

        const userId =
            this.getCurrentUserId();

        const water =
            this.validateData(
                data
            );

        const timestamp =
            new Date()
                .toISOString();

        this.execute(
            `
                INSERT INTO waters
                (
                    user_id,
                    name,
                    type,
                    country,
                    region,
                    description,
                    gps_lat,
                    gps_lon,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
            `,
            [
                userId,
                water.name,
                water.type,
                water.country,
                water.region,
                water.description,
                water.gps_lat,
                water.gps_lon,
                timestamp,
                timestamp
            ]
        );

        this.saveDatabase();

        const rows =
            this.query(
                `
                    SELECT
                        id,
                        user_id,
                        name,
                        type,
                        country,
                        region,
                        description,
                        gps_lat,
                        gps_lon,
                        created_at,
                        updated_at
                    FROM waters
                    WHERE user_id = ?
                    ORDER BY id DESC
                    LIMIT 1
                `,
                [
                    userId
                ]
            );

        return rows.length
            ? this.normalizeWater(
                rows[0]
            )
            : null;

    },


    update(
        id,
        data
    ) {

        const userId =
            this.getCurrentUserId();

        const waterId =
            Number(id);

        if (
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {

            throw new Error(
                "Ungültige Gewässer-ID."
            );

        }

        const water =
            this.validateData(
                data
            );

        this.execute(
            `
                UPDATE waters
                SET
                    name = ?,
                    type = ?,
                    country = ?,
                    region = ?,
                    description = ?,
                    gps_lat = ?,
                    gps_lon = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                  AND user_id = ?
            `,
            [
                water.name,
                water.type,
                water.country,
                water.region,
                water.description,
                water.gps_lat,
                water.gps_lon,
                waterId,
                userId
            ]
        );

        this.saveDatabase();

        return this.getById(
            waterId
        );

    },


    remove(
        id
    ) {

        const userId =
            this.getCurrentUserId();

        const waterId =
            Number(id);

        if (
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {

            return false;

        }

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


    validateData(
        data
    ) {

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

        if (
            name.length > 150
        ) {

            throw new Error(
                "Der Gewässername darf maximal 150 Zeichen enthalten."
            );

        }

        return {

            name,

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
            ? text.slice(
                0,
                maxLength
            )
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


    getGPSModule() {

        return window.CatchTrackGPSModule ||
            null;

    },


    getCurrentPosition() {

        const gps =
            this.getGPSModule();

        if (
            gps &&
            typeof gps.getCurrentPosition ===
                "function"
        ) {

            const position =
                gps.getCurrentPosition();

            if (position) {
                return position;
            }

        }

        return this.state.currentPosition;

    },


    requestGPSPosition() {

        const gps =
            this.getGPSModule();

        if (
            gps &&
            typeof gps.requestPosition ===
                "function"
        ) {

            return gps.requestPosition()
                .then(
                    position => {

                        this.state.currentPosition =
                            position;

                        return position;

                    }
                );

        }

        if (
            !navigator.geolocation
        ) {

            return Promise.reject(
                new Error(
                    "Dieser Browser unterstützt keine Standortbestimmung."
                )
            );

        }

        this.state.gpsBusy =
            true;

        return new Promise(
            (
                resolve,
                reject
            ) => {

                navigator.geolocation.getCurrentPosition(

                    position => {

                        const normalized = {

                            latitude:
                                Number(
                                    position.coords.latitude
                                ),

                            longitude:
                                Number(
                                    position.coords.longitude
                                ),

                            accuracy:
                                Number.isFinite(
                                    position.coords.accuracy
                                )
                                    ? position.coords.accuracy
                                    : null,

                            altitude:
                                Number.isFinite(
                                    position.coords.altitude
                                )
                                    ? position.coords.altitude
                                    : null,

                            timestamp:
                                new Date(
                                    position.timestamp
                                ).toISOString(),

                            source:
                                "geolocation"

                        };

                        this.state.currentPosition =
                            normalized;

                        this.state.gpsBusy =
                            false;

                        resolve(
                            normalized
                        );

                    },

                    error => {

                        this.state.gpsBusy =
                            false;

                        reject(
                            new Error(
                                this.getGPSErrorMessage(
                                    error
                                )
                            )
                        );

                    },

                    {

                        enableHighAccuracy:
                            true,

                        timeout:
                            15000,

                        maximumAge:
                            0

                    }

                );

            }
        );

    },


    getGPSErrorMessage(
        error
    ) {

        switch (
            error?.code
        ) {

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


    async reverseGeocode(
        latitude,
        longitude
    ) {

        const lat =
            Number(latitude);

        const lon =
            Number(longitude);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon)
        ) {

            return null;

        }

        try {

            const url =
                "https://nominatim.openstreetmap.org/reverse" +
                `?format=jsonv2&lat=${encodeURIComponent(lat)}` +
                `&lon=${encodeURIComponent(lon)}` +
                "&zoom=10" +
                "&addressdetails=1" +
                "&accept-language=de";

            const response =
                await fetch(
                    url,
                    {
                        method: "GET",
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );

            if (
                !response.ok
            ) {

                throw new Error(
                    `Reverse-Geocoding fehlgeschlagen (${response.status}).`
                );

            }

            const result =
                await response.json();

            const address =
                result?.address || {};

            const country =
                address.country ||
                "";

            const region =
                address.state ||
                address.region ||
                address.province ||
                address.state_district ||
                "";

            return {

                country:
                    String(
                        country
                    ).trim(),

                region:
                    String(
                        region
                    ).trim(),

                displayName:
                    String(
                        result.display_name ||
                        ""
                    ).trim()

            };

        }
        catch (error) {

            this.handleError(
                error,
                "waters:reverse-geocode"
            );

            return null;

        }

    },


    async resolveCurrentLocation(
        overwrite = false
    ) {

        try {

            const position =
                await this.requestGPSPosition();

            if (
                !position
            ) {

                return null;

            }

            this.setGPSFields(
                position
            );

            const geocoded =
                await this.reverseGeocode(
                    position.latitude,
                    position.longitude
                );

            if (
                geocoded
            ) {

                this.setLocationFields(
                    geocoded,
                    overwrite
                );

            }

            this.state.locationResolved =
                true;

            return {

                position,

                geocoded

            };

        }
        catch (error) {

            this.handleError(
                error,
                "waters:location"
            );

            return null;

        }

    },


    async autoFillLocation() {

        if (
            this.state.editingId
        ) {

            return;

        }

        const latitude =
            document.getElementById(
                "waters-latitude"
            );

        const longitude =
            document.getElementById(
                "waters-longitude"
            );

        const country =
            document.getElementById(
                "waters-country"
            );

        const region =
            document.getElementById(
                "waters-region"
            );

        if (
            !latitude ||
            !longitude
        ) {

            return;

        }

        if (
            latitude.value ||
            longitude.value ||
            country?.value ||
            region?.value
        ) {

            return;

        }

        this.setGPSMessage(
            "Standort wird automatisch ermittelt …",
            "info"
        );

        const result =
            await this.resolveCurrentLocation(
                false
            );

        if (
            result
        ) {

            this.setGPSMessage(
                "GPS, Land und Region wurden automatisch übernommen.",
                "success"
            );

        }
        else {

            this.setGPSMessage(
                "",
                "info"
            );

        }

    },


    setGPSFields(
        position
    ) {

        const latitude =
            document.getElementById(
                "waters-latitude"
            );

        const longitude =
            document.getElementById(
                "waters-longitude"
            );

        if (
            latitude &&
            Number.isFinite(
                Number(
                    position.latitude
                )
            )
        ) {

            latitude.value =
                Number(
                    position.latitude
                ).toFixed(6);

        }

        if (
            longitude &&
            Number.isFinite(
                Number(
                    position.longitude
                )
            )
        ) {

            longitude.value =
                Number(
                    position.longitude
                ).toFixed(6);

        }

    },


    setLocationFields(
        geocoded,
        overwrite = false
    ) {

        const country =
            document.getElementById(
                "waters-country"
            );

        const region =
            document.getElementById(
                "waters-region"
            );

        if (
            country &&
            geocoded.country &&
            (
                overwrite ||
                !country.value.trim()
            )
        ) {

            country.value =
                geocoded.country;

        }

        if (
            region &&
            geocoded.region &&
            (
                overwrite ||
                !region.value.trim()
            )
        ) {

            region.value =
                geocoded.region;

        }

    },


    async updateGPS() {

        if (
            this.state.gpsBusy
        ) {

            return;

        }

        const button =
            document.getElementById(
                "waters-gps-button"
            );

        try {

            if (button) {
                button.disabled = true;
            }

            this.setGPSMessage(
                "Standort wird ermittelt …",
                "info"
            );

            const result =
                await this.resolveCurrentLocation(
                    true
                );

            if (
                !result
            ) {

                throw new Error(
                    "Standort konnte nicht ermittelt werden."
                );

            }

            const position =
                result.position;

            this.state.nearby =
                this.getNearby(
                    position.latitude,
                    position.longitude,
                    25
                );

            this.renderNearby();

            this.setGPSMessage(
                `${this.state.nearby.length} Gewässer im Umkreis von 25 km gefunden.`,
                "success"
            );

        }
        catch (error) {

            this.setGPSMessage(
                error?.message ||
                "Standort konnte nicht ermittelt werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:gps"
            );

        }
        finally {

            this.state.gpsBusy =
                false;

            if (button) {
                button.disabled = false;
            }

        }

    },


    async useGPSForForm() {

        try {

            this.setFormMessage(
                "GPS-Standort wird ermittelt …",
                "info"
            );

            const result =
                await this.resolveCurrentLocation(
                    true
                );

            if (
                !result
            ) {

                throw new Error(
                    "GPS-Standort konnte nicht ermittelt werden."
                );

            }

            this.setFormMessage(
                "GPS, Land und Region wurden übernommen.",
                "success"
            );

        }
        catch (error) {

            this.setFormMessage(
                error?.message ||
                "GPS konnte nicht übernommen werden.",
                "error"
            );

        }

    },


    getNearby(
        latitude,
        longitude,
        radiusKm = 25
    ) {

        const userId =
            this.getCurrentUserId();

        const lat =
            Number(latitude);

        const lon =
            Number(longitude);

        const radius =
            Math.min(
                Math.max(
                    Number(radiusKm) || 25,
                    0.1
                ),
                500
            );

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            lat < -90 ||
            lat > 90 ||
            lon < -180 ||
            lon > 180
        ) {

            throw new Error(
                "Ungültige GPS-Koordinaten."
            );

        }

        const rows =
            this.query(
                `
                    SELECT
                        id,
                        user_id,
                        name,
                        type,
                        country,
                        region,
                        description,
                        gps_lat,
                        gps_lon,
                        created_at,
                        updated_at
                    FROM waters
                    WHERE user_id = ?
                      AND gps_lat IS NOT NULL
                      AND gps_lon IS NOT NULL
                `,
                [
                    userId
                ]
            );

        return rows
            .map(
                row =>
                    this.normalizeWater(
                        row
                    )
            )
            .filter(
                water =>
                    water &&
                    water.gps_lat !== null &&
                    water.gps_lon !== null
            )
            .map(
                water => ({

                    ...water,

                    distance_km:
                        this.calculateDistanceKm(
                            lat,
                            lon,
                            water.gps_lat,
                            water.gps_lon
                        )

                })
            )
            .filter(
                water =>
                    water.distance_km <=
                    radius
            )
            .sort(
                (
                    first,
                    second
                ) =>
                    first.distance_km -
                    second.distance_km
            );

    },


    getCurrentSuggestion(
        radiusKm = 25
    ) {

        const position =
            this.getCurrentPosition();

        if (!position) {
            return null;
        }

        const nearby =
            this.getNearby(
                position.latitude,
                position.longitude,
                radiusKm
            );

        return nearby.length
            ? nearby[0]
            : null;

    },


    calculateDistanceKm(
        latitude1,
        longitude1,
        latitude2,
        longitude2
    ) {

        const earthRadius =
            6371;

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
            Math.sin(
                deltaLat / 2
            ) ** 2 +
            Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(
                deltaLon / 2
            ) ** 2;

        return (
            earthRadius *
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            )
        );

    },


    async refresh() {

        try {

            this.ensureSchema();

            this.state.waters =
                this.getAll();

            this.renderList();

            this.renderCount();

            const position =
                this.getCurrentPosition();

            if (position) {

                this.state.nearby =
                    this.getNearby(
                        position.latitude,
                        position.longitude,
                        25
                    );

            }
            else {

                this.state.nearby =
                    [];

            }

            this.renderNearby();

            this.setStatus(
                `${this.state.waters.length} eigene Gewässer geladen.`,
                "success"
            );

        }
        catch (error) {

            this.state.waters = [];

            this.state.nearby = [];

            this.renderList();

            this.renderCount();

            this.renderNearby();

            this.setStatus(
                error?.message ||
                "Gewässer konnten nicht geladen werden.",
                "error"
            );

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
                )?.value

        };

    },


    async submitForm() {

        if (this.state.busy) {
            return;
        }

        this.state.busy =
            true;

        this.setFormDisabled(
            true
        );

        try {

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
                    : this.create(
                        data
                    );

            if (!water) {

                throw new Error(
                    "Gewässer konnte nicht gespeichert werden."
                );

            }

            const wasNew =
                !editingId;

            this.resetForm();

            await this.refresh();

            this.setFormMessage(
                editingId
                    ? "Gewässer wurde aktualisiert."
                    : "Gewässer wurde gespeichert.",
                "success"
            );

            if (wasNew) {

                this.showMyWaters();

            }

        }
        catch (error) {

            this.setFormMessage(
                error?.message ||
                "Gewässer konnte nicht gespeichert werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:save"
            );

        }
        finally {

            this.state.busy =
                false;

            this.setFormDisabled(
                false
            );

        }

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

        if (panel) {

            panel.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );

        }

    },


    editWater(
        id
    ) {

        try {

            const water =
                this.getById(
                    id
                );

            if (!water) {

                throw new Error(
                    "Gewässer wurde nicht gefunden."
                );

            }

            this.fillForm(
                water
            );

        }
        catch (error) {

            this.setFormMessage(
                error.message,
                "error"
            );

        }

    },


    async deleteWater(
        id
    ) {

        const water =
            this.getById(
                id
            );

        if (!water) {
            return;
        }

        if (
            !window.confirm(
                `Gewässer „${water.name}" wirklich löschen?`
            )
        ) {

            return;

        }

        try {

            if (
                !this.remove(
                    id
                )
            ) {

                throw new Error(
                    "Gewässer konnte nicht gelöscht werden."
                );

            }

            this.resetForm();

            await this.refresh();

        }
        catch (error) {

            this.setStatus(
                error.message,
                "error"
            );

        }

    },


    fillForm(
        water
    ) {

        const values = {

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

            "waters-description":
                water.description ?? "",

            "waters-latitude":
                water.gps_lat ?? "",

            "waters-longitude":
                water.gps_lon ?? ""

        };

        Object.entries(
            values
        ).forEach(
            (
                [
                    id,
                    value
                ]
            ) => {

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

        const cancel =
            document.getElementById(
                "waters-cancel-button"
            );

        if (cancel) {
            cancel.hidden = false;
        }

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

        this.state.editingId =
            null;

        this.state.locationResolved =
            false;

        const cancel =
            document.getElementById(
                "waters-cancel-button"
            );

        if (cancel) {
            cancel.hidden = true;
        }

        this.setFormMessage(
            "",
            ""
        );

        this.autoFillLocation();

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


    renderList() {

        const container =
            document.getElementById(
                "waters-list"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!this.state.waters.length) {

            container.textContent =
                "Noch keine eigenen Gewässer vorhanden.";

            return;

        }

        this.state.waters.forEach(
            water => {

                container.appendChild(
                    this.createWaterCard(
                        water
                    )
                );

            }
        );

    },


    renderNearby() {

        const container =
            document.getElementById(
                "waters-nearby-list"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!this.state.nearby.length) {

            container.textContent =
                "Keine Gewässer in der Nähe gefunden.";

            return;

        }

        this.state.nearby.forEach(
            water => {

                const item =
                    document.createElement(
                        "article"
                    );

                item.className =
                    "waters-nearby-item";

                const title =
                    document.createElement(
                        "p"
                    );

                title.className =
                    "waters-nearby-title";

                title.textContent =
                    water.name;

                const meta =
                    document.createElement(
                        "p"
                    );

                meta.className =
                    "waters-nearby-meta";

                meta.textContent =
                    `${this.formatDistance(
                        water.distance_km
                    )} · ${this.getLocationText(
                        water
                    )}`;

                const button =
                    this.createButton(
                        "Übernehmen"
                    );

                button.addEventListener(
                    "click",
                    () =>
                        this.fillForm(
                            water
                        )
                );

                item.append(
                    title,
                    meta,
                    button
                );

                container.appendChild(
                    item
                );

            }
        );

    },


    createWaterCard(
        water
    ) {

        const article =
            document.createElement(
                "article"
            );

        article.className =
            "waters-card";

        const title =
            document.createElement(
                "h3"
            );

        title.textContent =
            water.name;

        article.appendChild(
            title
        );

        const meta =
            document.createElement(
                "p"
            );

        meta.textContent =
            [
                water.type,
                water.country,
                water.region
            ]
            .filter(
                Boolean
            )
            .join(
                " · "
            );

        article.appendChild(
            meta
        );

        if (water.description) {

            const description =
                document.createElement(
                    "p"
                );

            description.textContent =
                water.description;

            article.appendChild(
                description
            );

        }

        if (
            water.gps_lat !== null &&
            water.gps_lon !== null
        ) {

            const coordinates =
                document.createElement(
                    "p"
                );

            coordinates.textContent =
                `${water.gps_lat.toFixed(6)}, ${water.gps_lon.toFixed(6)}`;

            article.appendChild(
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

        article.appendChild(
            actions
        );

        return article;

    },


    createButton(
        text
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "waters-button waters-button-secondary";

        button.textContent =
            text;

        return button;

    },


    navigateTo(
        water
    ) {

        if (
            !water ||
            water.gps_lat === null ||
            water.gps_lon === null
        ) {

            return;

        }

        const gps =
            this.getGPSModule();

        if (
            gps &&
            typeof gps.navigateTo ===
                "function"
        ) {

            return gps.navigateTo(
                water.gps_lat,
                water.gps_lon
            );

        }

        const url =
            `https://www.google.com/maps/dir/?api=1&destination=` +
            encodeURIComponent(
                `${water.gps_lat},${water.gps_lon}`
            );

        window.location.href =
            url;

    },


    getLocationText(
        water
    ) {

        return [

            water.region,

            water.country

        ]
        .filter(
            Boolean
        )
        .join(
            ", "
        ) ||
        "Standort unbekannt";

    },


    formatDistance(
        kilometers
    ) {

        if (
            !Number.isFinite(
                kilometers
            )
        ) {

            return "--";

        }

        if (
            kilometers < 1
        ) {

            return `${Math.round(
                kilometers * 1000
            )} m`;

        }

        return `${kilometers.toFixed(
            1
        )} km`;

    },


    setFormDisabled(
        disabled
    ) {

        const form =
            document.getElementById(
                "waters-form"
            );

        if (!form) {
            return;
        }

        form.querySelectorAll(
            "input, textarea, button"
        )
        .forEach(
            element =>
                element.disabled =
                    disabled
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

        if (
            type === "error"
        ) {

            element.classList.add(
                "waters-message-error"
            );

        }

        if (
            type === "success"
        ) {

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

        if (
            type === "error"
        ) {

            element.classList.add(
                "waters-message-error"
            );

        }

        if (
            type === "success"
        ) {

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

        if (
            type === "error"
        ) {

            element.classList.add(
                "waters-message-error"
            );

        }

        if (
            type === "success"
        ) {

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
                "waters-cancel-button"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.resetForm()
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

    },


    handleError(
        error,
        source
    ) {

        if (
            window.CatchTrackErrorHandler &&
            typeof
                CatchTrackErrorHandler.handle ===
                "function"
        ) {

            CatchTrackErrorHandler.handle(
                error,
                source
            );

        }
        else {

            console.error(
                source,
                error
            );

        }

    }

};