"use strict";


window.CatchTrackWatersModule = {

    version: "2.0.0",

    storageKeys: {
        legacyWaters: "waters:entries"
    },

    state: {
        initialized: false,
        editingId: null,
        waters: [],
        currentSuggestion: null,
        lastError: null
    },


    translations: {

        de: {
            "waters.eyebrow": "Gewässerverwaltung",
            "waters.title": "Gewässer",
            "waters.intro": "Verwalte deine Angelgewässer und ihre Positionen.",
            "waters.form.label": "Gewässerdaten",
            "waters.form.newTitle": "Neues Gewässer",
            "waters.form.editTitle": "Gewässer bearbeiten",
            "waters.form.modeNew": "Neu",
            "waters.form.modeEdit": "Bearbeiten",
            "waters.fields.name": "Name",
            "waters.fields.type": "Gewässertyp",
            "waters.fields.country": "Land",
            "waters.fields.region": "Region",
            "waters.fields.latitude": "Breitengrad",
            "waters.fields.longitude": "Längengrad",
            "waters.fields.description": "Beschreibung",
            "waters.placeholders.name": "z. B. Pranburi River",
            "waters.placeholders.country": "Land",
            "waters.placeholders.region": "Region",
            "waters.placeholders.latitude": "z. B. 12.345678",
            "waters.placeholders.longitude": "z. B. 98.765432",
            "waters.placeholders.description": "Optionale Beschreibung",
            "waters.types.unknown": "Nicht angegeben",
            "waters.types.sea": "Meer",
            "waters.types.river": "Fluss",
            "waters.types.lake": "See",
            "waters.types.canal": "Kanal",
            "waters.types.reservoir": "Stausee",
            "waters.types.pond": "Teich",
            "waters.types.other": "Sonstiges",
            "waters.actions.useGps": "Aktuellen GPS-Standort übernehmen",
            "waters.actions.save": "Gewässer speichern",
            "waters.actions.update": "Änderungen speichern",
            "waters.actions.cancel": "Abbrechen",
            "waters.actions.refresh": "Aktualisieren",
            "waters.actions.edit": "Bearbeiten",
            "waters.actions.delete": "Löschen",
            "waters.actions.navigate": "Navigation",
            "waters.list.label": "Datenbank",
            "waters.list.title": "Gespeicherte Gewässer",
            "waters.list.loading": "Gewässer werden geladen …",
            "waters.list.empty": "Keine Gewässer gespeichert.",
            "waters.messages.saved": "Gewässer wurde gespeichert.",
            "waters.messages.updated": "Gewässer wurde aktualisiert.",
            "waters.messages.deleted": "Gewässer wurde gelöscht.",
            "waters.messages.nameRequired": "Bitte einen Gewässernamen eingeben.",
            "waters.messages.coordinatesInvalid": "Die GPS-Koordinaten sind ungültig.",
            "waters.messages.gpsApplied": "Aktueller GPS-Standort wurde übernommen.",
            "waters.messages.gpsUnavailable": "Kein aktueller GPS-Standort verfügbar.",
            "waters.messages.navigationUnavailable": "Navigation ist nicht verfügbar.",
            "waters.messages.confirmDelete": "Soll dieses Gewässer wirklich gelöscht werden?",
            "waters.messages.databaseUnavailable": "Die Datenbank ist nicht verfügbar.",
            "waters.messages.genericError": "Die Aktion konnte nicht ausgeführt werden.",
            "waters.labels.country": "Land",
            "waters.labels.region": "Region",
            "waters.labels.coordinates": "Position",
            "waters.labels.description": "Beschreibung",
            "waters.labels.unknown": "--",
            "waters.labels.count": "{count}"
        },

        en: {
            "waters.eyebrow": "Water management",
            "waters.title": "Waters",
            "waters.intro": "Manage your fishing waters and their positions.",
            "waters.form.label": "Water data",
            "waters.form.newTitle": "New water",
            "waters.form.editTitle": "Edit water",
            "waters.form.modeNew": "New",
            "waters.form.modeEdit": "Edit",
            "waters.fields.name": "Name",
            "waters.fields.type": "Water type",
            "waters.fields.country": "Country",
            "waters.fields.region": "Region",
            "waters.fields.latitude": "Latitude",
            "waters.fields.longitude": "Longitude",
            "waters.fields.description": "Description",
            "waters.placeholders.name": "e.g. Pranburi River",
            "waters.placeholders.country": "Country",
            "waters.placeholders.region": "Region",
            "waters.placeholders.latitude": "e.g. 12.345678",
            "waters.placeholders.longitude": "e.g. 98.765432",
            "waters.placeholders.description": "Optional description",
            "waters.types.unknown": "Not specified",
            "waters.types.sea": "Sea",
            "waters.types.river": "River",
            "waters.types.lake": "Lake",
            "waters.types.canal": "Canal",
            "waters.types.reservoir": "Reservoir",
            "waters.types.pond": "Pond",
            "waters.types.other": "Other",
            "waters.actions.useGps": "Use current GPS position",
            "waters.actions.save": "Save water",
            "waters.actions.update": "Save changes",
            "waters.actions.cancel": "Cancel",
            "waters.actions.refresh": "Refresh",
            "waters.actions.edit": "Edit",
            "waters.actions.delete": "Delete",
            "waters.actions.navigate": "Navigate",
            "waters.list.label": "Database",
            "waters.list.title": "Saved waters",
            "waters.list.loading": "Loading waters …",
            "waters.list.empty": "No waters saved.",
            "waters.messages.saved": "Water saved.",
            "waters.messages.updated": "Water updated.",
            "waters.messages.deleted": "Water deleted.",
            "waters.messages.nameRequired": "Please enter a water name.",
            "waters.messages.coordinatesInvalid": "The GPS coordinates are invalid.",
            "waters.messages.gpsApplied": "Current GPS position applied.",
            "waters.messages.gpsUnavailable": "No current GPS position is available.",
            "waters.messages.navigationUnavailable": "Navigation is unavailable.",
            "waters.messages.confirmDelete": "Delete this water?",
            "waters.messages.databaseUnavailable": "The database is unavailable.",
            "waters.messages.genericError": "The action could not be completed.",
            "waters.labels.country": "Country",
            "waters.labels.region": "Region",
            "waters.labels.coordinates": "Position",
            "waters.labels.description": "Description",
            "waters.labels.unknown": "--",
            "waters.labels.count": "{count}"
        }

    },


    init() {

        if (this.state.initialized) {
            return;
        }

        try {

            this.registerTranslations();

            this.migrateLegacyWaters();

            this.bindEvents();

            this.loadWaters();

            this.applyLanguage();

            this.state.initialized = true;

            this.publishStatus();

        }

        catch (error) {

            this.state.lastError = error;

            this.handleError(
                error,
                "waters:init"
            );

            this.showListMessage(
                this.t(
                    "waters.messages.genericError"
                ),
                "error"
            );

        }

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

        Object.entries(this.translations)
            .forEach(
                ([language, dictionary]) => {

                    languageManager.register(
                        language,
                        dictionary
                    );

                }
            );

    },


    applyLanguage() {

        const languageManager =
            window.CatchTrackLanguageManager;

        if (
            languageManager &&
            typeof languageManager.apply === "function"
        ) {

            languageManager.apply(
                document
            );

        }

        this.updateFormMode();

    },


    t(
        key,
        fallback = key,
        variables = {}
    ) {

        const languageManager =
            window.CatchTrackLanguageManager;

        if (
            languageManager &&
            typeof languageManager.t === "function"
        ) {

            return languageManager.t(
                key,
                fallback,
                variables
            );

        }

        const language =
            languageManager?.getLanguage?.() || "de";

        const dictionary =
            this.translations[language] ||
            this.translations.de;

        let value =
            dictionary[key] ||
            fallback;

        return String(value)
            .replace(
                /\{([^}]+)\}/g,
                (
                    match,
                    variable
                ) =>
                    variables[variable] !== undefined
                        ? variables[variable]
                        : match
            );

    },


    bindEvents() {

        const form =
            document.getElementById(
                "waters-form"
            );

        form?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.saveFromForm();

            }
        );


        document
            .getElementById(
                "cancel-water-edit"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.resetForm();

                }
            );


        document
            .getElementById(
                "waters-use-gps"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.applyCurrentGpsPosition();

                }
            );


        document
            .getElementById(
                "waters-refresh"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.loadWaters();

                }
            );


        document
            .getElementById(
                "waters-list"
            )
            ?.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-water-action]"
                        );

                    if (!button) {
                        return;
                    }

                    const action =
                        button.dataset.waterAction;

                    const id =
                        Number(
                            button.dataset.waterId
                        );

                    if (!Number.isInteger(id)) {
                        return;
                    }

                    if (action === "edit") {
                        this.startEdit(id);
                    }

                    if (action === "delete") {
                        this.deleteWater(id);
                    }

                    if (action === "navigate") {
                        this.navigateToWater(id);
                    }

                }
            );

    },


    isDatabaseReady() {

        return !!(
            window.CatchTrackDatabase &&
            typeof CatchTrackDatabase.query === "function" &&
            typeof CatchTrackDatabase.execute === "function"
        );

    },


    normalizeText(value, maxLength = 2000) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .trim()
            .slice(0, maxLength);

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
            return null;
        }

        return number;

    },


    normalizeWater(row) {

        if (!row) {
            return null;
        }

        const id =
            Number(row.id);

        if (!Number.isInteger(id)) {
            return null;
        }

        return {
            id,
            name:
                this.normalizeText(
                    row.name,
                    200
                ),
            type:
                this.normalizeText(
                    row.type,
                    50
                ),
            country:
                this.normalizeText(
                    row.country,
                    120
                ),
            region:
                this.normalizeText(
                    row.region,
                    160
                ),
            description:
                this.normalizeText(
                    row.description,
                    2000
                ),
            gps_lat:
                this.normalizeCoordinate(
                    row.gps_lat,
                    -90,
                    90
                ),
            gps_lon:
                this.normalizeCoordinate(
                    row.gps_lon,
                    -180,
                    180
                ),
            created_at:
                row.created_at || null,
            updated_at:
                row.updated_at || null
        };

    },


    loadWaters() {

        const list =
            document.getElementById(
                "waters-list"
            );

        if (!list) {
            return [];
        }

        if (!this.isDatabaseReady()) {

            this.state.waters = [];

            list.innerHTML =
                `<p class="waters-empty">${
                    this.escapeHtml(
                        this.t(
                            "waters.messages.databaseUnavailable"
                        )
                    )
                }</p>`;

            return [];

        }

        try {

            const rows =
                CatchTrackDatabase.query(
                    `
                    SELECT
                        id,
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
                    ORDER BY
                        LOWER(name),
                        id
                    `
                );

            this.state.waters =
                rows
                    .map(
                        row =>
                            this.normalizeWater(row)
                    )
                    .filter(Boolean);

            this.renderList();

            this.updateCount();

            this.syncLegacyWaters();

            this.publishStatus();

            return [
                ...this.state.waters
            ];

        }

        catch (error) {

            this.state.lastError =
                error;

            this.handleError(
                error,
                "waters:load"
            );

            this.showListMessage(
                this.t(
                    "waters.messages.genericError"
                ),
                "error"
            );

            return [];

        }

    },


    renderList() {

        const list =
            document.getElementById(
                "waters-list"
            );

        if (!list) {
            return;
        }

        if (!this.state.waters.length) {

            list.innerHTML =
                `<p class="waters-empty">${
                    this.escapeHtml(
                        this.t(
                            "waters.list.empty"
                        )
                    )
                }</p>`;

            return;

        }

        list.innerHTML =
            this.state.waters
                .map(
                    water =>
                        this.renderWater(
                            water
                        )
                )
                .join("");

    },


    renderWater(water) {

        const type =
            water.type
                ? this.t(
                    `waters.types.${water.type}`,
                    water.type
                )
                : this.t(
                    "waters.types.unknown"
                );

        const coordinates =
            water.gps_lat !== null &&
            water.gps_lon !== null
                ? `${water.gps_lat.toFixed(6)}, ${water.gps_lon.toFixed(6)}`
                : this.t(
                    "waters.labels.unknown"
                );

        return `
            <article
                class="water-item"
                data-water-id="${water.id}"
            >

                <div class="water-item-header">

                    <div>

                        <h3>
                            ${this.escapeHtml(water.name)}
                        </h3>

                        <div class="water-item-type">
                            ${this.escapeHtml(type)}
                        </div>

                    </div>

                </div>


                <div class="water-item-details">

                    <p class="water-item-detail">

                        <strong>
                            ${this.escapeHtml(
                                this.t(
                                    "waters.labels.country"
                                )
                            )}
                        </strong>

                        ${this.escapeHtml(
                            water.country ||
                            this.t(
                                "waters.labels.unknown"
                            )
                        )}

                    </p>


                    <p class="water-item-detail">

                        <strong>
                            ${this.escapeHtml(
                                this.t(
                                    "waters.labels.region"
                                )
                            )}
                        </strong>

                        ${this.escapeHtml(
                            water.region ||
                            this.t(
                                "waters.labels.unknown"
                            )
                        )}

                    </p>


                    <p class="water-item-detail">

                        <strong>
                            ${this.escapeHtml(
                                this.t(
                                    "waters.labels.coordinates"
                                )
                            )}
                        </strong>

                        ${this.escapeHtml(
                            coordinates
                        )}

                    </p>

                </div>


                ${
                    water.description
                        ? `
                            <p class="water-item-description">
                                ${this.escapeHtml(
                                    water.description
                                )}
                            </p>
                        `
                        : ""
                }


                <div class="water-item-actions">

                    ${
                        water.gps_lat !== null &&
                        water.gps_lon !== null
                            ? `
                                <button
                                    type="button"
                                    class="waters-button waters-button-small waters-button-secondary"
                                    data-water-action="navigate"
                                    data-water-id="${water.id}"
                                >
                                    ${this.escapeHtml(
                                        this.t(
                                            "waters.actions.navigate"
                                        )
                                    )}
                                </button>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="waters-button waters-button-small waters-button-secondary"
                        data-water-action="edit"
                        data-water-id="${water.id}"
                    >
                        ${this.escapeHtml(
                            this.t(
                                "waters.actions.edit"
                            )
                        )}
                    </button>

                    <button
                        type="button"
                        class="waters-button waters-button-small waters-button-danger"
                        data-water-action="delete"
                        data-water-id="${water.id}"
                    >
                        ${this.escapeHtml(
                            this.t(
                                "waters.actions.delete"
                            )
                        )}
                    </button>

                </div>

            </article>
        `;

    },


    updateCount() {

        const element =
            document.getElementById(
                "waters-count"
            );

        if (!element) {
            return;
        }

        element.textContent =
            this.t(
                "waters.labels.count",
                String(
                    this.state.waters.length
                ),
                {
                    count:
                        this.state.waters.length
                }
            );

    },


    saveFromForm() {

        const id =
            document.getElementById(
                "water-id"
            )?.value;

        const data =
            this.readForm();

        const validation =
            this.validateWater(
                data
            );

        if (!validation.valid) {

            this.showFormMessage(
                validation.message,
                "error"
            );

            return false;

        }

        try {

            if (id) {

                const updated =
                    this.update(
                        Number(id),
                        data
                    );

                if (!updated) {
                    return false;
                }

                this.showFormMessage(
                    this.t(
                        "waters.messages.updated"
                    ),
                    "success"
                );

            }

            else {

                const created =
                    this.create(
                        data
                    );

                if (!created) {
                    return false;
                }

                this.showFormMessage(
                    this.t(
                        "waters.messages.saved"
                    ),
                    "success"
                );

            }

            this.resetForm(
                true
            );

            this.loadWaters();

            return true;

        }

        catch (error) {

            this.handleError(
                error,
                "waters:save"
            );

            this.showFormMessage(
                this.t(
                    "waters.messages.genericError"
                ),
                "error"
            );

            return false;

        }

    },


    readForm() {

        return {
            name:
                this.normalizeText(
                    document.getElementById(
                        "water-name"
                    )?.value,
                    200
                ),

            type:
                this.normalizeText(
                    document.getElementById(
                        "water-type"
                    )?.value,
                    50
                ),

            country:
                this.normalizeText(
                    document.getElementById(
                        "water-country"
                    )?.value,
                    120
                ),

            region:
                this.normalizeText(
                    document.getElementById(
                        "water-region"
                    )?.value,
                    160
                ),

            gps_lat:
                this.normalizeCoordinate(
                    document.getElementById(
                        "water-lat"
                    )?.value,
                    -90,
                    90
                ),

            gps_lon:
                this.normalizeCoordinate(
                    document.getElementById(
                        "water-lon"
                    )?.value,
                    -180,
                    180
                ),

            description:
                this.normalizeText(
                    document.getElementById(
                        "water-description"
                    )?.value,
                    2000
                )
        };

    },


    validateWater(data) {

        if (!data.name) {

            return {
                valid: false,
                message:
                    this.t(
                        "waters.messages.nameRequired"
                    )
            };

        }

        const hasLatitude =
            data.gps_lat !== null;

        const hasLongitude =
            data.gps_lon !== null;

        if (
            hasLatitude !==
            hasLongitude
        ) {

            return {
                valid: false,
                message:
                    this.t(
                        "waters.messages.coordinatesInvalid"
                    )
            };

        }

        return {
            valid: true
        };

    },


    create(data) {

        if (!this.isDatabaseReady()) {
            throw new Error(
                this.t(
                    "waters.messages.databaseUnavailable"
                )
            );
        }

        const validation =
            this.validateWater(
                data
            );

        if (!validation.valid) {
            throw new Error(
                validation.message
            );
        }

        CatchTrackDatabase.execute(
            `
            INSERT INTO waters
            (
                name,
                type,
                country,
                region,
                description,
                gps_lat,
                gps_lon
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                data.name,
                data.type || null,
                data.country || null,
                data.region || null,
                data.description || null,
                data.gps_lat,
                data.gps_lon
            ]
        );

        this.loadWaters();

        return this.getByNameAndCoordinates(
            data.name,
            data.gps_lat,
            data.gps_lon
        );

    },


    update(id, data) {

        if (!this.isDatabaseReady()) {
            throw new Error(
                this.t(
                    "waters.messages.databaseUnavailable"
                )
            );
        }

        const numericId =
            Number(id);

        if (!Number.isInteger(numericId)) {
            throw new Error(
                "Invalid water id."
            );
        }

        const validation =
            this.validateWater(
                data
            );

        if (!validation.valid) {
            throw new Error(
                validation.message
            );
        }

        CatchTrackDatabase.execute(
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
            `,
            [
                data.name,
                data.type || null,
                data.country || null,
                data.region || null,
                data.description || null,
                data.gps_lat,
                data.gps_lon,
                numericId
            ]
        );

        this.loadWaters();

        return this.getById(
            numericId
        );

    },


    remove(id) {

        if (!this.isDatabaseReady()) {
            throw new Error(
                this.t(
                    "waters.messages.databaseUnavailable"
                )
            );
        }

        const numericId =
            Number(id);

        if (!Number.isInteger(numericId)) {
            return false;
        }

        CatchTrackDatabase.execute(
            `
            DELETE FROM waters
            WHERE id = ?
            `,
            [
                numericId
            ]
        );

        this.loadWaters();

        return true;

    },


    getAll() {

        if (!this.isDatabaseReady()) {
            return [];
        }

        return CatchTrackDatabase
            .query(
                `
                SELECT
                    id,
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
                ORDER BY
                    LOWER(name),
                    id
                `
            )
            .map(
                row =>
                    this.normalizeWater(row)
            )
            .filter(Boolean);

    },


    getById(id) {

        if (!this.isDatabaseReady()) {
            return null;
        }

        const numericId =
            Number(id);

        if (!Number.isInteger(numericId)) {
            return null;
        }

        const rows =
            CatchTrackDatabase.query(
                `
                SELECT
                    id,
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
                LIMIT 1
                `,
                [
                    numericId
                ]
            );

        return rows.length
            ? this.normalizeWater(
                rows[0]
            )
            : null;

    },


    getByNameAndCoordinates(
        name,
        latitude,
        longitude
    ) {

        const waters =
            this.getAll();

        return (
            waters.find(
                water =>
                    water.name === name &&
                    water.gps_lat === latitude &&
                    water.gps_lon === longitude
            ) ||
            waters.find(
                water =>
                    water.name === name
            ) ||
            null
        );

    },


    getNearby(
        latitude,
        longitude,
        radiusMeters = 5000
    ) {

        const lat =
            this.normalizeCoordinate(
                latitude,
                -90,
                90
            );

        const lon =
            this.normalizeCoordinate(
                longitude,
                -180,
                180
            );

        const radius =
            Number(radiusMeters);

        if (
            lat === null ||
            lon === null ||
            !Number.isFinite(radius) ||
            radius < 0
        ) {
            return [];
        }

        const waters =
            this.getAll();

        return waters
            .filter(
                water =>
                    water.gps_lat !== null &&
                    water.gps_lon !== null
            )
            .map(
                water => ({
                    ...water,
                    distance:
                        this.calculateDistance(
                            lat,
                            lon,
                            water.gps_lat,
                            water.gps_lon
                        )
                })
            )
            .filter(
                water =>
                    Number.isFinite(
                        water.distance
                    ) &&
                    water.distance <= radius
            )
            .sort(
                (a, b) =>
                    a.distance -
                    b.distance
            );

    },


    getCurrentSuggestion(
        latitude = null,
        longitude = null,
        radiusMeters = 5000
    ) {

        let lat =
            this.normalizeCoordinate(
                latitude,
                -90,
                90
            );

        let lon =
            this.normalizeCoordinate(
                longitude,
                -180,
                180
            );

        if (
            lat === null ||
            lon === null
        ) {

            const position =
                window.CatchTrackGPSModule
                    ?.getPosition?.();

            if (position) {

                lat =
                    this.normalizeCoordinate(
                        position.latitude,
                        -90,
                        90
                    );

                lon =
                    this.normalizeCoordinate(
                        position.longitude,
                        -180,
                        180
                    );

            }

        }

        if (
            lat === null ||
            lon === null
        ) {

            return null;

        }

        const nearby =
            this.getNearby(
                lat,
                lon,
                radiusMeters
            );

        this.state.currentSuggestion =
            nearby.length
                ? nearby[0]
                : null;

        return this.state.currentSuggestion
            ? {
                ...this.state.currentSuggestion
            }
            : null;

    },


    getCount() {

        if (!this.isDatabaseReady()) {
            return 0;
        }

        const rows =
            CatchTrackDatabase.query(
                `
                SELECT COUNT(*) AS count
                FROM waters
                `
            );

        return rows.length
            ? Number(
                rows[0].count
            ) || 0
            : 0;

    },


    calculateDistance(
        latitude1,
        longitude1,
        latitude2,
        longitude2
    ) {

        const earthRadius =
            6371000;

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

        const sinLat =
            Math.sin(
                deltaLat / 2
            );

        const sinLon =
            Math.sin(
                deltaLon / 2
            );

        const value =
            sinLat * sinLat +
            Math.cos(lat1) *
            Math.cos(lat2) *
            sinLon * sinLon;

        const normalized =
            Math.min(
                1,
                Math.max(
                    0,
                    value
                )
            );

        return (
            earthRadius *
            2 *
            Math.atan2(
                Math.sqrt(
                    normalized
                ),
                Math.sqrt(
                    1 - normalized
                )
            )
        );

    },


    applyCurrentGpsPosition() {

        const gps =
            window.CatchTrackGPSModule;

        if (
            !gps ||
            typeof gps.getPosition !== "function"
        ) {

            this.showFormMessage(
                this.t(
                    "waters.messages.gpsUnavailable"
                ),
                "error"
            );

            return false;

        }

        const position =
            gps.getPosition();

        if (!position) {

            this.showFormMessage(
                this.t(
                    "waters.messages.gpsUnavailable"
                ),
                "error"
            );

            return false;

        }

        const latitude =
            this.normalizeCoordinate(
                position.latitude,
                -90,
                90
            );

        const longitude =
            this.normalizeCoordinate(
                position.longitude,
                -180,
                180
            );

        if (
            latitude === null ||
            longitude === null
        ) {

            this.showFormMessage(
                this.t(
                    "waters.messages.coordinatesInvalid"
                ),
                "error"
            );

            return false;

        }

        const latitudeField =
            document.getElementById(
                "water-lat"
            );

        const longitudeField =
            document.getElementById(
                "water-lon"
            );

        if (latitudeField) {
            latitudeField.value =
                latitude.toFixed(6);
        }

        if (longitudeField) {
            longitudeField.value =
                longitude.toFixed(6);
        }

        const status =
            document.getElementById(
                "waters-gps-status"
            );

        if (status) {

            status.textContent =
                `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        }

        this.showFormMessage(
            this.t(
                "waters.messages.gpsApplied"
            ),
            "success"
        );

        return true;

    },


    startEdit(id) {

        const water =
            this.getById(id);

        if (!water) {
            return false;
        }

        this.state.editingId =
            water.id;

        this.setField(
            "water-id",
            water.id
        );

        this.setField(
            "water-name",
            water.name
        );

        this.setField(
            "water-type",
            water.type
        );

        this.setField(
            "water-country",
            water.country
        );

        this.setField(
            "water-region",
            water.region
        );

        this.setField(
            "water-lat",
            water.gps_lat ?? ""
        );

        this.setField(
            "water-lon",
            water.gps_lon ?? ""
        );

        this.setField(
            "water-description",
            water.description
        );

        this.updateFormMode();

        this.showFormMessage(
            "",
            ""
        );

        document
            .getElementById(
                "water-name"
            )
            ?.focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return true;

    },


    resetForm(
        silent = false
    ) {

        const form =
            document.getElementById(
                "waters-form"
            );

        form?.reset();

        this.state.editingId =
            null;

        this.setField(
            "water-id",
            ""
        );

        const cancel =
            document.getElementById(
                "cancel-water-edit"
            );

        if (cancel) {
            cancel.hidden = true;
        }

        const gpsStatus =
            document.getElementById(
                "waters-gps-status"
            );

        if (gpsStatus) {
            gpsStatus.textContent = "";
        }

        this.updateFormMode();

        if (!silent) {
            this.showFormMessage(
                "",
                ""
            );
        }

    },


    updateFormMode() {

        const editing =
            this.state.editingId !== null;

        const title =
            document.getElementById(
                "waters-form-title"
            );

        const mode =
            document.getElementById(
                "waters-form-mode"
            );

        const saveButton =
            document.getElementById(
                "save-water"
            );

        const cancelButton =
            document.getElementById(
                "cancel-water-edit"
            );

        if (title) {

            title.textContent =
                this.t(
                    editing
                        ? "waters.form.editTitle"
                        : "waters.form.newTitle"
                );

        }

        if (mode) {

            mode.textContent =
                this.t(
                    editing
                        ? "waters.form.modeEdit"
                        : "waters.form.modeNew"
                );

        }

        if (saveButton) {

            saveButton.textContent =
                this.t(
                    editing
                        ? "waters.actions.update"
                        : "waters.actions.save"
                );

        }

        if (cancelButton) {
            cancelButton.hidden =
                !editing;
        }

    },


    deleteWater(id) {

        const water =
            this.getById(id);

        if (!water) {
            return false;
        }

        if (
            !window.confirm(
                this.t(
                    "waters.messages.confirmDelete"
                )
            )
        ) {
            return false;
        }

        try {

            this.remove(
                id
            );

            this.showListMessage(
                this.t(
                    "waters.messages.deleted"
                ),
                "success"
            );

            this.resetForm(
                true
            );

            this.loadWaters();

            return true;

        }

        catch (error) {

            this.handleError(
                error,
                "waters:delete"
            );

            this.showListMessage(
                this.t(
                    "waters.messages.genericError"
                ),
                "error"
            );

            return false;

        }

    },


    navigateToWater(id) {

        const water =
            this.getById(id);

        if (
            !water ||
            water.gps_lat === null ||
            water.gps_lon === null
        ) {
            return false;
        }

        const gps =
            window.CatchTrackGPSModule;

        if (
            gps &&
            typeof gps.navigateTo === "function"
        ) {

            try {

                gps.navigateTo(
                    water.gps_lat,
                    water.gps_lon
                );

                return true;

            }

            catch (error) {

                this.handleError(
                    error,
                    "waters:navigation"
                );

            }

        }

        const url =
            "https://www.google.com/maps/dir/?api=1&destination=" +
            encodeURIComponent(
                `${water.gps_lat},${water.gps_lon}`
            );

        window.location.href =
            url;

        return true;

    },


    migrateLegacyWaters() {

        if (!this.isDatabaseReady()) {
            return 0;
        }

        const storage =
            window.CatchTrackStorageManager;

        if (
            !storage ||
            typeof storage.load !== "function"
        ) {
            return 0;
        }

        const legacy =
            storage.load(
                this.storageKeys.legacyWaters,
                []
            );

        if (
            !Array.isArray(legacy) ||
            !legacy.length
        ) {
            return 0;
        }

        let imported = 0;

        legacy.forEach(
            item => {

                const name =
                    this.normalizeText(
                        item?.name,
                        200
                    );

                if (!name) {
                    return;
                }

                const latitude =
                    this.normalizeCoordinate(
                        item?.latitude ??
                        item?.gps_lat,
                        -90,
                        90
                    );

                const longitude =
                    this.normalizeCoordinate(
                        item?.longitude ??
                        item?.gps_lon,
                        -180,
                        180
                    );

                const existing =
                    this.getExistingForLegacy(
                        name,
                        latitude,
                        longitude
                    );

                if (existing) {
                    return;
                }

                CatchTrackDatabase.execute(
                    `
                    INSERT INTO waters
                    (
                        name,
                        type,
                        country,
                        region,
                        description,
                        gps_lat,
                        gps_lon
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        name,
                        this.normalizeText(
                            item?.type,
                            50
                        ) || null,
                        this.normalizeText(
                            item?.country,
                            120
                        ) || null,
                        this.normalizeText(
                            item?.region,
                            160
                        ) || null,
                        this.normalizeText(
                            item?.description,
                            2000
                        ) || null,
                        latitude,
                        longitude
                    ]
                );

                imported += 1;

            }
        );

        return imported;

    },


    getExistingForLegacy(
        name,
        latitude,
        longitude
    ) {

        const waters =
            this.getAll();

        return waters.find(
            water => {

                if (
                    water.name !== name
                ) {
                    return false;
                }

                if (
                    latitude === null ||
                    longitude === null
                ) {
                    return (
                        water.gps_lat === null &&
                        water.gps_lon === null
                    );
                }

                return (
                    water.gps_lat !== null &&
                    water.gps_lon !== null &&
                    Math.abs(
                        water.gps_lat -
                        latitude
                    ) < 0.000001 &&
                    Math.abs(
                        water.gps_lon -
                        longitude
                    ) < 0.000001
                );

            }
        );

    },


    syncLegacyWaters() {

        const storage =
            window.CatchTrackStorageManager;

        if (
            !storage ||
            typeof storage.save !== "function"
        ) {
            return false;
        }

        const legacy =
            this.state.waters.map(
                water => ({
                    id:
                        `water-db-${water.id}`,
                    name:
                        water.name,
                    type:
                        water.type || "",
                    country:
                        water.country || "",
                    region:
                        water.region || "",
                    description:
                        water.description || "",
                    latitude:
                        water.gps_lat,
                    longitude:
                        water.gps_lon,
                    source:
                        "database",
                    databaseId:
                        water.id
                })
            );

        return storage.save(
            this.storageKeys.legacyWaters,
            legacy
        );

    },


    setField(
        id,
        value
    ) {

        const field =
            document.getElementById(
                id
            );

        if (field) {
            field.value =
                value ?? "";
        }

    },


    showFormMessage(
        message,
        type = ""
    ) {

        const element =
            document.getElementById(
                "waters-form-message"
            );

        if (!element) {
            return;
        }

        if (!message) {

            element.hidden = true;
            element.textContent = "";
            element.className =
                "waters-message";

            return;

        }

        element.hidden = false;
        element.textContent =
            String(message);

        element.className =
            `waters-message ${
                type === "error"
                    ? "is-error"
                    : "is-success"
            }`;

    },


    showListMessage(
        message,
        type = ""
    ) {

        const element =
            document.getElementById(
                "waters-list-message"
            );

        if (!element) {
            return;
        }

        if (!message) {

            element.hidden = true;
            element.textContent = "";
            element.className =
                "waters-message";

            return;

        }

        element.hidden = false;
        element.textContent =
            String(message);

        element.className =
            `waters-message ${
                type === "error"
                    ? "is-error"
                    : "is-success"
            }`;

    },


    escapeHtml(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    },


    handleError(
        error,
        source
    ) {

        if (
            window.CatchTrackErrorHandler &&
            typeof CatchTrackErrorHandler.handle === "function"
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

    },


    publishStatus() {

        if (
            !window.CatchTrackRuntimeStatus
        ) {
            return;
        }

        if (
            typeof CatchTrackRuntimeStatus.updateModules ===
            "function" &&
            window.CatchTrackModuleManager
        ) {

            const status =
                CatchTrackModuleManager
                    .getModuleStatus?.();

            if (status) {

                CatchTrackRuntimeStatus.updateModules(
                    status
                );

            }

        }

    }

};