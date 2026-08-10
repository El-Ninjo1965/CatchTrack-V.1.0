"use strict";


window.CatchTrackWatersModule = {

    version: "3.0.0",

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
            "waters.messages.identityUnavailable": "Kein aktiver Benutzer ist ausgewählt.",
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
            "waters.messages.identityUnavailable": "No active user is selected.",
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
            return true;
        }

        try {

            this.registerTranslations();

            this.bindEvents();

            this.migrateLegacyWaters();

            this.loadWaters();

            this.applyLanguage();

            this.state.initialized = true;

            this.publishStatus();

            return true;

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

            return false;

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


    getCurrentUserId() {

        const identity =
            window.CatchTrackIdentity;

        if (
            !identity ||
            typeof identity.getCurrentUserId !== "function"
        ) {
            return null;
        }

        const userId =
            Number(
                identity.getCurrentUserId()
            );

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            return null;
        }

        return userId;

    },


    hasCurrentUser() {

        return (
            this.getCurrentUserId() !== null
        );

    },


    isDatabaseReady() {

        return !!(
            window.CatchTrackDatabase &&
            typeof CatchTrackDatabase.query === "function" &&
            typeof CatchTrackDatabase.execute === "function"
        );

    },


    normalizeText(
        value,
        maxLength = 2000
    ) {

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

        const userId =
            Number(row.user_id);

        if (
            !Number.isInteger(id) ||
            !Number.isInteger(userId)
        ) {
            return null;
        }

        return {

            id,

            user_id:
                userId,

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

            this.showListMessage(
                this.t(
                    "waters.messages.databaseUnavailable"
                ),
                "error"
            );

            return [];

        }

        const userId =
            this.getCurrentUserId();

        if (userId === null) {

            this.state.waters = [];

            this.renderList();

            this.updateCount();

            this.showListMessage(
                this.t(
                    "waters.messages.identityUnavailable"
                ),
                "error"
            );

            return [];

        }

        try {

            const rows =
                CatchTrackDatabase.query(
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

                    ORDER BY
                        LOWER(name),
                        id
                    `,
                    [
                        userId
                    ]
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

        const country =
            water.country ||
            this.t(
                "waters.labels.unknown"
            );

        const region =
            water.region ||
            this.t(
                "waters.labels.unknown"
            );

        const description =
            water.description ||
            this.t(
                "waters.labels.unknown"
            );

        return `
            <article
                class="water-item"
                data-water-id="${water.id}"
            >

                <div class="water-item-content">

                    <h3>
                        ${this.escapeHtml(water.name)}
                    </h3>

                    <p>
                        ${this.escapeHtml(type)}
                    </p>

                    <p>
                        <strong>
                            ${this.escapeHtml(
                                this.t(
                                    "waters.labels.country"
                                )
                            )}:
                        </strong>
                        ${this.escapeHtml(country)}
                    </p>

                    <p>
                        <strong>
                            ${this.escapeHtml(
                                this.t(
                                    "waters.labels.region"
                                )
                            )}:
                        </strong>
                        ${this.escapeHtml(region)}
                    </p>

                    <p>
                        <strong>
                            ${this.escapeHtml(
                                this.t(
                                    "waters.labels.coordinates"
                                )
                            )}:
                        </strong>
                        ${this.escapeHtml(coordinates)}
                    </p>

                    <p>
                        <strong>
                            ${this.escapeHtml(
                                this.t(
                                    "waters.labels.description"
                                )
                            )}:
                        </strong>
                        ${this.escapeHtml(description)}
                    </p>

                </div>

                <div class="water-item-actions">

                    <button
                        type="button"
                        class="waters-button waters-button-small"
                        data-water-action="navigate"
                        data-water-id="${water.id}"
                    >
                        ${this.escapeHtml(
                            this.t(
                                "waters.actions.navigate"
                            )
                        )}
                    </button>

                    <button
                        type="button"
                        class="waters-button waters-button-small"
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
                        class="waters-button waters-button-small"
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

        const name =
            this.normalizeText(
                document.getElementById(
                    "water-name"
                )?.value,
                200
            );

        if (!name) {

            this.showFormMessage(
                this.t(
                    "waters.messages.nameRequired"
                ),
                "error"
            );

            return null;

        }

        const latitude =
            this.normalizeCoordinate(
                document.getElementById(
                    "water-lat"
                )?.value,
                -90,
                90
            );

        const longitude =
            this.normalizeCoordinate(
                document.getElementById(
                    "water-lon"
                )?.value,
                -180,
                180
            );

        const rawLatitude =
            document.getElementById(
                "water-lat"
            )?.value;

        const rawLongitude =
            document.getElementById(
                "water-lon"
            )?.value;

        if (
            (
                rawLatitude !== "" &&
                latitude === null
            ) ||
            (
                rawLongitude !== "" &&
                longitude === null
            )
        ) {

            this.showFormMessage(
                this.t(
                    "waters.messages.coordinatesInvalid"
                ),
                "error"
            );

            return null;

        }

        const payload = {

            name,

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

            description:
                this.normalizeText(
                    document.getElementById(
                        "water-description"
                    )?.value,
                    2000
                ),

            gps_lat:
                latitude,

            gps_lon:
                longitude

        };

        const id =
            Number(
                document.getElementById(
                    "water-id"
                )?.value
            );

        if (Number.isInteger(id) && id > 0) {

            return this.update(
                id,
                payload
            );

        }

        return this.create(
            payload
        );

    },


    create(data) {

        if (!this.isDatabaseReady()) {

            this.showFormMessage(
                this.t(
                    "waters.messages.databaseUnavailable"
                ),
                "error"
            );

            return null;

        }

        const userId =
            this.getCurrentUserId();

        if (userId === null) {

            this.showFormMessage(
                this.t(
                    "waters.messages.identityUnavailable"
                ),
                "error"
            );

            return null;

        }

        try {

            const name =
                this.normalizeText(
                    data?.name,
                    200
                );

            if (!name) {

                throw new Error(
                    this.t(
                        "waters.messages.nameRequired"
                    )
                );

            }

            const result =
                CatchTrackDatabase.execute(
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
                        gps_lon
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
                        ?
                    )
                    `,
                    [
                        userId,
                        name,
                        this.normalizeText(
                            data?.type,
                            50
                        ),
                        this.normalizeText(
                            data?.country,
                            120
                        ),
                        this.normalizeText(
                            data?.region,
                            160
                        ),
                        this.normalizeText(
                            data?.description,
                            2000
                        ),
                        this.normalizeCoordinate(
                            data?.gps_lat,
                            -90,
                            90
                        ),
                        this.normalizeCoordinate(
                            data?.gps_lon,
                            -180,
                            180
                        )
                    ]
                );

            this.loadWaters();

            this.resetForm();

            this.showFormMessage(
                this.t(
                    "waters.messages.saved"
                ),
                "success"
            );

            return result;

        }

        catch (error) {

            this.state.lastError =
                error;

            this.handleError(
                error,
                "waters:create"
            );

            this.showFormMessage(
                this.t(
                    "waters.messages.genericError"
                ),
                "error"
            );

            return null;

        }

    },


    update(
        id,
        data
    ) {

        if (!this.isDatabaseReady()) {
            return null;
        }

        const userId =
            this.getCurrentUserId();

        const waterId =
            Number(id);

        if (
            userId === null ||
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {
            return null;
        }

        try {

            const result =
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

                    WHERE
                        id = ?
                        AND user_id = ?
                    `,
                    [
                        this.normalizeText(
                            data?.name,
                            200
                        ),
                        this.normalizeText(
                            data?.type,
                            50
                        ),
                        this.normalizeText(
                            data?.country,
                            120
                        ),
                        this.normalizeText(
                            data?.region,
                            160
                        ),
                        this.normalizeText(
                            data?.description,
                            2000
                        ),
                        this.normalizeCoordinate(
                            data?.gps_lat,
                            -90,
                            90
                        ),
                        this.normalizeCoordinate(
                            data?.gps_lon,
                            -180,
                            180
                        ),
                        waterId,
                        userId
                    ]
                );

            this.loadWaters();

            this.resetForm();

            this.showFormMessage(
                this.t(
                    "waters.messages.updated"
                ),
                "success"
            );

            return result;

        }

        catch (error) {

            this.state.lastError =
                error;

            this.handleError(
                error,
                "waters:update"
            );

            this.showFormMessage(
                this.t(
                    "waters.messages.genericError"
                ),
                "error"
            );

            return null;

        }

    },


    remove(id) {

        if (!this.isDatabaseReady()) {
            return false;
        }

        const userId =
            this.getCurrentUserId();

        const waterId =
            Number(id);

        if (
            userId === null ||
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {
            return false;
        }

        try {

            const result =
                CatchTrackDatabase.execute(
                    `
                    DELETE FROM waters

                    WHERE
                        id = ?
                        AND user_id = ?
                    `,
                    [
                        waterId,
                        userId
                    ]
                );

            this.loadWaters();

            return result;

        }

        catch (error) {

            this.state.lastError =
                error;

            this.handleError(
                error,
                "waters:delete"
            );

            return false;

        }

    },


    getAll() {

        return [
            ...this.state.waters
        ];

    },


    getById(id) {

        const waterId =
            Number(id);

        if (
            !Number.isInteger(waterId) ||
            waterId <= 0
        ) {
            return null;
        }

        return (
            this.state.waters.find(
                water =>
                    water.id === waterId
            ) || null
        );

    },


    getCount() {

        return this.state.waters.length;

    },


    getNearby(
        latitude,
        longitude,
        radiusKm = 10
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
            radius < 0
        ) {
            return [];
        }

        const earthRadiusKm =
            6371;

        return this.state.waters
            .filter(
                water =>
                    water.gps_lat !== null &&
                    water.gps_lon !== null
            )
            .map(
                water => {

                    const dLat =
                        (
                            water.gps_lat - lat
                        ) *
                        Math.PI /
                        180;

                    const dLon =
                        (
                            water.gps_lon - lon
                        ) *
                        Math.PI /
                        180;

                    const a =
                        Math.sin(dLat / 2) ** 2 +
                        Math.cos(
                            lat * Math.PI / 180
                        ) *
                        Math.cos(
                            water.gps_lat * Math.PI / 180
                        ) *
                        Math.sin(dLon / 2) ** 2;

                    const distance =
                        2 *
                        earthRadiusKm *
                        Math.atan2(
                            Math.sqrt(a),
                            Math.sqrt(1 - a)
                        );

                    return {
                        ...water,
                        distanceKm: distance
                    };

                }
            )
            .filter(
                water =>
                    water.distanceKm <= radius
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.distanceKm -
                    b.distanceKm
            );

    },


    getCurrentSuggestion(
        latitude = null,
        longitude = null
    ) {

        const lat =
            Number(latitude);

        const lon =
            Number(longitude);

        if (
            Number.isFinite(lat) &&
            Number.isFinite(lon)
        ) {

            const nearby =
                this.getNearby(
                    lat,
                    lon,
                    10
                );

            this.state.currentSuggestion =
                nearby.length
                    ? nearby[0]
                    : null;

            return this.state.currentSuggestion;

        }

        this.state.currentSuggestion =
            null;

        return null;

    },


    startEdit(id) {

        const water =
            this.getById(id);

        if (!water) {
            return;
        }

        this.state.editingId =
            water.id;

        document.getElementById(
            "water-id"
        ).value =
            water.id;

        document.getElementById(
            "water-name"
        ).value =
            water.name || "";

        document.getElementById(
            "water-type"
        ).value =
            water.type || "";

        document.getElementById(
            "water-country"
        ).value =
            water.country || "";

        document.getElementById(
            "water-region"
        ).value =
            water.region || "";

        document.getElementById(
            "water-lat"
        ).value =
            water.gps_lat ?? "";

        document.getElementById(
            "water-lon"
        ).value =
            water.gps_lon ?? "";

        document.getElementById(
            "water-description"
        ).value =
            water.description || "";

        this.updateFormMode();

        document.getElementById(
            "water-name"
        )?.focus();

    },


    resetForm() {

        const form =
            document.getElementById(
                "waters-form"
            );

        form?.reset();

        document.getElementById(
            "water-id"
        ).value =
            "";

        this.state.editingId =
            null;

        this.updateFormMode();

        this.clearFormMessage();

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

        const save =
            document.getElementById(
                "save-water"
            );

        const cancel =
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

        if (save) {

            save.textContent =
                this.t(
                    editing
                        ? "waters.actions.update"
                        : "waters.actions.save"
                );

        }

        if (cancel) {

            cancel.hidden =
                !editing;

        }

    },


    deleteWater(id) {

        const water =
            this.getById(id);

        if (!water) {
            return;
        }

        if (
            !window.confirm(
                this.t(
                    "waters.messages.confirmDelete"
                )
            )
        ) {
            return;
        }

        const result =
            this.remove(
                water.id
            );

        if (result !== null && result !== false) {

            this.showListMessage(
                this.t(
                    "waters.messages.deleted"
                ),
                "success"
            );

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

            this.showListMessage(
                this.t(
                    "waters.messages.navigationUnavailable"
                ),
                "error"
            );

            return;

        }

        const latitude =
            water.gps_lat;

        const longitude =
            water.gps_lon;

        const url =
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${latitude},${longitude}`
            )}`;

        try {

            window.open(
                url,
                "_blank",
                "noopener"
            );

        }

        catch (error) {

            this.handleError(
                error,
                "waters:navigate"
            );

        }

    },


    applyCurrentGpsPosition() {

        const gps =
            window.CatchTrackGPSModule;

        let position = null;

        if (
            gps &&
            typeof gps.getCurrentPosition === "function"
        ) {

            position =
                gps.getCurrentPosition();

        }

        if (
            !position &&
            gps &&
            typeof gps.getPosition === "function"
        ) {

            position =
                gps.getPosition();

        }

        if (!position) {

            this.showFormMessage(
                this.t(
                    "waters.messages.gpsUnavailable"
                ),
                "error"
            );

            return;

        }

        const latitude =
            position.latitude ??
            position.coords?.latitude;

        const longitude =
            position.longitude ??
            position.coords?.longitude;

        if (
            this.normalizeCoordinate(
                latitude,
                -90,
                90
            ) === null ||
            this.normalizeCoordinate(
                longitude,
                -180,
                180
            ) === null
        ) {

            this.showFormMessage(
                this.t(
                    "waters.messages.coordinatesInvalid"
                ),
                "error"
            );

            return;

        }

        document.getElementById(
            "water-lat"
        ).value =
            Number(latitude).toFixed(6);

        document.getElementById(
            "water-lon"
        ).value =
            Number(longitude).toFixed(6);

        const status =
            document.getElementById(
                "waters-gps-status"
            );

        if (status) {

            status.textContent =
                this.t(
                    "waters.messages.gpsApplied"
                );

        }

    },


    migrateLegacyWaters() {

        if (!this.isDatabaseReady()) {
            return 0;
        }

        const userId =
            this.getCurrentUserId();

        if (userId === null) {
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

        if (!Array.isArray(legacy) || !legacy.length) {
            return 0;
        }

        let imported =
            0;

        legacy.forEach(
            entry => {

                const name =
                    this.normalizeText(
                        entry?.name,
                        200
                    );

                if (!name) {
                    return;
                }

                try {

                    const existing =
                        CatchTrackDatabase.query(
                            `
                            SELECT
                                id

                            FROM waters

                            WHERE
                                user_id = ?
                                AND LOWER(name) = LOWER(?)

                            LIMIT 1
                            `,
                            [
                                userId,
                                name
                            ]
                        );

                    if (existing.length) {
                        return;
                    }

                    CatchTrackDatabase.execute(
                        `
                        INSERT INTO waters
                        (
                            user_id,
                            name,
                            gps_lat,
                            gps_lon
                        )

                        VALUES
                        (
                            ?,
                            ?,
                            ?,
                            ?
                        )
                        `,
                        [
                            userId,
                            name,
                            this.normalizeCoordinate(
                                entry?.latitude ??
                                entry?.gps_lat,
                                -90,
                                90
                            ),
                            this.normalizeCoordinate(
                                entry?.longitude ??
                                entry?.gps_lon,
                                -180,
                                180
                            )
                        ]
                    );

                    imported += 1;

                }

                catch (error) {

                    this.handleError(
                        error,
                        "waters:legacy-import"
                    );

                }

            }
        );

        if (imported > 0) {

            storage.remove?.(
                this.storageKeys.legacyWaters
            );

        }

        return imported;

    },


    syncLegacyWaters() {

        /*
         * Legacy storage is no longer a database source.
         * It is intentionally not written back.
         */

        return true;

    },


    showFormMessage(
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

        element.hidden =
            false;

        element.className =
            `waters-message waters-message-${type}`;

        element.textContent =
            message;

    },


    clearFormMessage() {

        const element =
            document.getElementById(
                "waters-form-message"
            );

        if (!element) {
            return;
        }

        element.hidden =
            true;

        element.textContent =
            "";

    },


    showListMessage(
        message,
        type = "info"
    ) {

        const element =
            document.getElementById(
                "waters-list-message"
            );

        if (!element) {
            return;
        }

        element.hidden =
            false;

        element.className =
            `waters-message waters-message-${type}`;

        element.textContent =
            message;

    },


    escapeHtml(value) {

        return String(
            value ?? ""
        )
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


    publishStatus() {

        const status =
            window.CatchTrackRuntimeStatus;

        if (
            !status ||
            typeof status.setModuleStatus !== "function"
        ) {
            return;
        }

        status.setModuleStatus(
            "waters",
            {
                status: "ready",
                version: this.version,
                initialized: this.state.initialized,
                count: this.state.waters.length,
                userId: this.getCurrentUserId()
            }
        );

    },


    handleError(
        error,
        context
    ) {

        this.state.lastError =
            error;

        const handler =
            window.CatchTrackErrorHandler;

        if (
            handler &&
            typeof handler.handle === "function"
        ) {

            handler.handle(
                error,
                context
            );

            return;

        }

        console.error(
            `[CatchTrack Waters] ${context}`,
            error
        );

    }

};


window.CatchTrackWatersModule.init();