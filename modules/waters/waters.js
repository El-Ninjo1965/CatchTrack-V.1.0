"use strict";

window.CatchTrackWatersModule = {
    version: "7.0.0",

    initialized: false,

    state: {
        waters: [],
        nearby: [],
        editingId: null,
        busy: false,
        gpsBusy: false,
        currentPosition: null
    },

    init() {
        if (this.initialized) {
            return;
        }

        try {
            this.bindEvents();
            this.initialized = true;

            this.setStatus(
                "Gewässer werden geladen …",
                "info"
            );

            this.refresh();

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

    query(
        sql,
        params = []
    ) {
        return this.getDatabase().query(
            sql,
            params
        );
    },

    execute(
        sql,
        params = []
    ) {
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
            "description",
            "gps_lat",
            "gps_lon",
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
                    missing.join(", ")
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

                return Number.isFinite(
                    number
                )
                    ? number
                    : null;
            };

        return {
            id: numberOrNull(
                row.id
            ),

            user_id: numberOrNull(
                row.user_id
            ),

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
            description,
            gps_lat,
            gps_lon,
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
            ? this.normalizeWater(
                rows[0]
            )
            : null;
    },

    getCount() {
        return this.getAll().length;
    },

    getNearby(
        latitude,
        longitude,
        radiusKm = 50
    ) {
        const lat =
            Number(latitude);

        const lon =
            Number(longitude);

        const radius =
            Number(radiusKm);

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

    calculateDistance(
        latitude1,
        longitude1,
        latitude2,
        longitude2
    ) {
        const earthRadiusKm =
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

    getCurrentSuggestion() {
        const position =
            this.state.currentPosition;

        if (!position) {
            return null;
        }

        const nearby =
            this.getNearby(
                position.latitude,
                position.longitude
            );

        return nearby.length
            ? nearby[0]
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
                name.slice(
                    0,
                    150
                ),

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

    create(data) {
        this.ensureSchema();

        const userId =
            this.getCurrentUserId();

        const water =
            this.validateData(
                data
            );

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
                    description,
                    gps_lat,
                    gps_lon,
                    created_at,
                    updated_at
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                        ${this.getSelectColumns()}
                    FROM waters
                    WHERE user_id = ?
                    ORDER BY id DESC
                    LIMIT 1
                `,
                [userId]
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
        this.ensureSchema();

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

        const userId =
            this.getCurrentUserId();

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

    remove(id) {
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
                !Number.isFinite(
                    latitude
                ) ||
                !Number.isFinite(
                    longitude
                )
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
                    Number.isFinite(
                        accuracy
                    )
                        ? accuracy
                        : null,

                altitude:
                    Number.isFinite(
                        altitude
                    )
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
            this.state.gpsBusy =
                false;
        }
    },

    getGPSErrorMessage(error) {
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
                return (
                    error?.message ||
                    "Der Standort konnte nicht ermittelt werden."
                );
        }
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
            const position =
                await this.requestGPSPosition();

            this.setGPSFields(
                position
            );

            this.renderCurrentPosition();
            this.renderNearby();

            this.setGPSMessage(
                "GPS-Standort wurde automatisch übernommen.",
                "success"
            );
        } catch (error) {
            this.setGPSMessage(
                this.getGPSErrorMessage(
                    error
                ),
                "error"
            );

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

        if (
            this.state.gpsBusy
        ) {
            return;
        }

        try {
            if (button) {
                button.disabled =
                    true;
            }

            this.setGPSMessage(
                "GPS-Standort wird ermittelt …",
                "info"
            );

            const position =
                await this.requestGPSPosition();

            this.setGPSFields(
                position
            );

            this.renderCurrentPosition();
            this.renderNearby();

            this.setGPSMessage(
                "GPS-Standort wurde aktualisiert.",
                "success"
            );
        } catch (error) {
            this.setGPSMessage(
                this.getGPSErrorMessage(
                    error
                ),
                "error"
            );

            this.handleError(
                error,
                "waters:gps"
            );
        } finally {
            if (button) {
                button.disabled =
                    false;
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
                button.disabled =
                    true;
            }

            this.setFormMessage(
                "GPS-Standort wird ermittelt …",
                "info"
            );

            const position =
                await this.requestGPSPosition();

            this.setGPSFields(
                position
            );

            this.renderCurrentPosition();
            this.renderNearby();

            this.setFormMessage(
                "Aktueller GPS-Standort wurde übernommen.",
                "success"
            );
        } catch (error) {
            this.setFormMessage(
                this.getGPSErrorMessage(
                    error
                ),
                "error"
            );

            this.handleError(
                error,
                "waters:form-gps"
            );
        } finally {
            if (button) {
                button.disabled =
                    false;
            }
        }
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

        if (
            latitude &&
            Number.isFinite(
                Number(
                    position?.latitude
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
                    position?.longitude
                )
            )
        ) {
            longitude.value =
                Number(
                    position.longitude
                ).toFixed(6);
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
        if (
            this.state.busy
        ) {
            return;
        }

        this.state.busy =
            true;

        const saveButton =
            document.getElementById(
                "waters-save-button"
            );

        try {
            if (saveButton) {
                saveButton.disabled =
                    true;
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
                wasNew
                    ? "Gewässer wurde gespeichert."
                    : "Gewässer wurde aktualisiert.",
                "success"
            );

            this.showMyWaters();
        } catch (error) {
            this.setFormMessage(
                error?.message ||
                    "Gewässer konnte nicht gespeichert werden.",
                "error"
            );

            this.handleError(
                error,
                "waters:save"
            );
        } finally {
            this.state.busy =
                false;

            if (saveButton) {
                saveButton.disabled =
                    false;
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
            this.renderNearby();

            this.setStatus(
                this.state.waters.length
                    ? `${this.state.waters.length} eigene Gewässer geladen.`
                    : "Noch keine eigenen Gewässer vorhanden.",
                "success"
            );
        } catch (error) {
            this.state.waters =
                [];

            this.renderList();
            this.renderCount();
            this.renderNearby();

            this.setStatus(
                error?.message ||
                    "Gewässer konnten nicht geladen werden.",
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

        if (!position) {
            container.hidden =
                true;

            container.innerHTML =
                "";

            return;
        }

        container.hidden =
            false;

        container.innerHTML =
            "";

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
            }
        ];

        values.forEach(
            item => {
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
            }
        );
    },

    renderList() {
        const container =
            document.getElementById(
                "waters-list"
            );

        if (!container) {
            return;
        }

        container.innerHTML =
            "";

        if (
            !this.state.waters.length
        ) {
            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "waters-empty";

            empty.textContent =
                "Noch keine eigenen Gewässer vorhanden.";

            container.appendChild(
                empty
            );

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

    createWaterCard(water) {
        const article =
            document.createElement(
                "article"
            );

        article.className =
            "waters-card";

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
                water.region,
                water.country
            ]).join(" · ");

        title.appendChild(
            meta
        );

        header.appendChild(
            title
        );

        article.appendChild(
            header
        );

        if (
            water.description
        ) {
            const description =
                document.createElement(
                    "p"
                );

            description.className =
                "waters-card-description";

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
                    "div"
                );

            coordinates.className =
                "waters-card-coordinates";

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

    renderNearby() {
        const container =
            document.getElementById(
                "waters-nearby-list"
            );

        if (!container) {
            return;
        }

        container.innerHTML =
            "";

        const position =
            this.state.currentPosition;

        if (!position) {
            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "waters-empty";

            empty.textContent =
                "Noch kein aktueller GPS-Standort vorhanden.";

            container.appendChild(
                empty
            );

            return;
        }

        let nearby = [];

        try {
            nearby =
                this.getNearby(
                    position.latitude,
                    position.longitude,
                    50
                );
        } catch (error) {
            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "waters-empty";

            empty.textContent =
                "Die Suche nach nahegelegenen Gewässern ist derzeit nicht verfügbar.";

            container.appendChild(
                empty
            );

            return;
        }

        if (!nearby.length) {
            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "waters-empty";

            empty.textContent =
                "Keine eigenen Gewässer innerhalb von 50 km gefunden.";

            container.appendChild(
                empty
            );

            return;
        }

        nearby.forEach(
            water => {
                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "waters-nearby-item";

                const info =
                    document.createElement(
                        "div"
                    );

                info.className =
                    "waters-nearby-info";

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
                    this.uniqueParts([
                        water.type,
                        water.region,
                        water.country
                    ]).join(" · ");

                info.append(
                    title,
                    meta
                );

                const distance =
                    document.createElement(
                        "span"
                    );

                distance.className =
                    "waters-nearby-distance";

                distance.textContent =
                    `${water.distance_km.toFixed(1)} km`;

                const navigation =
                    this.createButton(
                        "Navigation"
                    );

                navigation.classList.add(
                    "waters-nearby-navigation"
                );

                navigation.addEventListener(
                    "click",
                    () =>
                        this.navigateTo(
                            water
                        )
                );

                item.append(
                    info,
                    distance,
                    navigation
                );

                container.appendChild(
                    item
                );
            }
        );
    },

    uniqueParts(parts) {
        const result = [];

        parts.forEach(
            value => {
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

                result.push(
                    text
                );
            }
        );

        return result;
    },

    createButton(text) {
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

    editWater(id) {
        try {
            const water =
                this.getById(id);

            if (!water) {
                throw new Error(
                    "Gewässer wurde nicht gefunden."
                );
            }

            this.fillForm(
                water
            );

            this.showForm();

            this.setFormMessage(
                `Gewässer „${water.name}" wird bearbeitet.`,
                "info"
            );
        } catch (error) {
            this.setFormMessage(
                error?.message ||
                    "Gewässer konnte nicht geladen werden.",
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

            "waters-description":
                water.description ?? "",

            "waters-latitude":
                water.gps_lat ?? "",

            "waters-longitude":
                water.gps_lon ?? ""
        };

        Object.entries(
            fields
        ).forEach(
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

        const cancel =
            document.getElementById(
                "waters-cancel-button"
            );

        if (cancel) {
            cancel.hidden =
                false;
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
            id.value =
                "";
        }

        this.state.editingId =
            null;

        const cancel =
            document.getElementById(
                "waters-cancel-button"
            );

        if (cancel) {
            cancel.hidden =
                true;
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
                `Gewässer „${water.name}" wirklich löschen?`
            )
        ) {
            return;
        }

        try {
            this.remove(id);

            await this.refresh();
        } catch (error) {
            this.setStatus(
                error?.message ||
                    "Gewässer konnte nicht gelöscht werden.",
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