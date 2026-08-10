"use strict";

window.CatchTrackWatersModule = {

version: "3.1.1",
storageKeys: {
    legacyWaters: "waters:entries",
    legacyMigrated: "waters:entries:migrated"
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
        /*
         * The database and Identity Core are initialized before
         * modules by the application bootstrap. Legacy migration
         * therefore runs here against the current authenticated user.
         */
        this.migrateLegacyWaters();
        this.loadWaters();
        this.applyLanguage();
        this.state.initialized = true;
        return true;
    }
    catch (error) {
        this.state.lastError = error;
        this.handleError(error, "waters:init");
        this.showListMessage(
            this.t("waters.messages.genericError"),
            "error"
        );
        return false;
    }
},
registerTranslations() {
    const manager = window.CatchTrackLanguageManager;
    if (
        !manager ||
        typeof manager.register !== "function"
    ) {
        return;
    }
    Object.entries(this.translations).forEach(
        ([language, dictionary]) => {
            manager.register(
                language,
                dictionary
            );
        }
    );
},
bindEvents() {
    const form = document.getElementById("waters-form");
    if (
        form &&
        !form.dataset.bound
    ) {
        form.addEventListener(
            "submit",
            event => {
                event.preventDefault();
                this.saveFromForm();
            }
        );
        form.dataset.bound = "true";
    }
    const gpsButton =
        document.getElementById("waters-use-gps");
    if (
        gpsButton &&
        !gpsButton.dataset.bound
    ) {
        gpsButton.addEventListener(
            "click",
            () => this.applyCurrentGpsPosition()
        );
        gpsButton.dataset.bound = "true";
    }
    const cancelButton =
        document.getElementById("cancel-water-edit");
    if (
        cancelButton &&
        !cancelButton.dataset.bound
    ) {
        cancelButton.addEventListener(
            "click",
            () => this.resetForm()
        );
        cancelButton.dataset.bound = "true";
    }
    const refreshButton =
        document.getElementById("waters-refresh");
    if (
        refreshButton &&
        !refreshButton.dataset.bound
    ) {
        refreshButton.addEventListener(
            "click",
            () => this.loadWaters()
        );
        refreshButton.dataset.bound = "true";
    }
    const list =
        document.getElementById("waters-list");
    if (
        list &&
        !list.dataset.bound
    ) {
        list.addEventListener(
            "click",
            event => {
                const button =
                    event.target.closest(
                        "[data-water-action]"
                    );
                if (!button) {
                    return;
                }
                const id =
                    Number(button.dataset.waterId);
                if (
                    !Number.isInteger(id) ||
                    id <= 0
                ) {
                    return;
                }
                switch (button.dataset.waterAction) {
                    case "navigate":
                        this.navigateToWater(id);
                        break;
                    case "edit":
                        this.startEdit(id);
                        break;
                    case "delete":
                        this.deleteWater(id);
                        break;
                    default:
                        break;
                }
            }
        );
        list.dataset.bound = "true";
    }
    if (
        !document.documentElement.dataset
            .watersLanguageBound
    ) {
        document.addEventListener(
            "catchtrack:language-changed",
            () => {
                this.applyLanguage();
                this.renderList();
                this.updateCount();
            }
        );
        document.documentElement.dataset
            .watersLanguageBound = "true";
    }
},
applyLanguage() {
    const manager =
        window.CatchTrackLanguageManager;
    if (
        manager &&
        typeof manager.apply === "function"
    ) {
        manager.apply(document);
    }
    this.updateFormMode();
},
t(key, fallback = key, variables = {}) {
    const manager =
        window.CatchTrackLanguageManager;
    if (
        manager &&
        typeof manager.t === "function"
    ) {
        return manager.t(
            key,
            fallback,
            variables
        );
    }
    const language =
        manager?.getLanguage?.() || "de";
    const dictionary =
        this.translations[language] ||
        this.translations.de;
    return String(
        dictionary[key] || fallback
    ).replace(
        /\{([^}]+)\}/g,
        (match, variable) =>
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
    const id =
        Number(identity.getCurrentUserId());
    return (
        Number.isInteger(id) &&
        id > 0
    )
        ? id
        : null;
},
isDatabaseReady() {
    return !!(
        window.CatchTrackDatabase &&
        typeof CatchTrackDatabase.isReady === "function" &&
        CatchTrackDatabase.isReady() &&
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
normalizeCoordinate(value, minimum, maximum) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }
    const number = Number(value);
    return (
        Number.isFinite(number) &&
        number >= minimum &&
        number <= maximum
    )
        ? number
        : null;
},
normalizeWater(row) {
    if (!row) {
        return null;
    }
    const id = Number(row.id);
    const userId = Number(row.user_id);
    if (
        !Number.isInteger(id) ||
        id <= 0 ||
        !Number.isInteger(userId) ||
        userId <= 0
    ) {
        return null;
    }
    return {
        id,
        user_id: userId,
        name: this.normalizeText(
            row.name,
            200
        ),
        type: this.normalizeText(
            row.type,
            50
        ),
        country: this.normalizeText(
            row.country,
            120
        ),
        region: this.normalizeText(
            row.region,
            160
        ),
        description: this.normalizeText(
            row.description,
            2000
        ),
        gps_lat: this.normalizeCoordinate(
            row.gps_lat,
            -90,
            90
        ),
        gps_lon: this.normalizeCoordinate(
            row.gps_lon,
            -180,
            180
        ),
        created_at: row.created_at || null,
        updated_at: row.updated_at || null
    };
},
getWaterSelect() {
    return `
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
    `;
},
loadWaters() {
    if (!this.isDatabaseReady()) {
        this.state.waters = [];
        this.renderList();
        this.updateCount();
        this.showListMessage(
            this.t(
                "waters.messages.databaseUnavailable"
            ),
            "error"
        );
        return [];
    }
    const userId = this.getCurrentUserId();
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
                ${this.getWaterSelect()}
                WHERE user_id = ?
                ORDER BY
                    LOWER(name),
                    id
                `,
                [userId]
            );
        this.state.waters =
            rows
                .map(row => this.normalizeWater(row))
                .filter(Boolean);
        this.renderList();
        this.updateCount();
        return [...this.state.waters];
    }
    catch (error) {
        this.state.lastError = error;
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
        document.getElementById("waters-list");
    if (!list) {
        return;
    }
    if (!this.state.waters.length) {
        list.innerHTML =
            `<p class="waters-empty">${
                this.escapeHtml(
                    this.t("waters.list.empty")
                )
            }</p>`;
        return;
    }
    list.innerHTML =
        this.state.waters
            .map(water => this.renderWater(water))
            .join("");
},
renderWater(water) {
    const type =
        water.type
            ? this.t(
                `waters.types.${water.type}`,
                water.type
            )
            : this.t("waters.types.unknown");
    const coordinates =
        water.gps_lat !== null &&
        water.gps_lon !== null
            ? `${water.gps_lat.toFixed(6)}, ${water.gps_lon.toFixed(6)}`
            : this.t("waters.labels.unknown");
    const country =
        water.country ||
        this.t("waters.labels.unknown");
    const region =
        water.region ||
        this.t("waters.labels.unknown");
    const description =
        water.description ||
        this.t("waters.labels.unknown");
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
        document.getElementById("waters-count");
    if (element) {
        element.textContent =
            String(this.state.waters.length);
    }
},
getFormValue(id, maxLength) {
    return this.normalizeText(
        document.getElementById(id)?.value,
        maxLength
    );
},
saveFromForm() {
    const name =
        this.getFormValue(
            "water-name",
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
    const rawLatitude =
        document.getElementById("water-lat")?.value ?? "";
    const rawLongitude =
        document.getElementById("water-lon")?.value ?? "";
    const latitude =
        this.normalizeCoordinate(
            rawLatitude,
            -90,
            90
        );
    const longitude =
        this.normalizeCoordinate(
            rawLongitude,
            -180,
            180
        );
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
        type: this.getFormValue(
            "water-type",
            50
        ),
        country: this.getFormValue(
            "water-country",
            120
        ),
        region: this.getFormValue(
            "water-region",
            160
        ),
        description: this.getFormValue(
            "water-description",
            2000
        ),
        gps_lat: latitude,
        gps_lon: longitude
    };
    const id =
        Number(
            document.getElementById("water-id")?.value
        );
    return (
        Number.isInteger(id) &&
        id > 0
    )
        ? this.update(id, payload)
        : this.create(payload);
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
    const userId = this.getCurrentUserId();
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                userId,
                data.name,
                data.type || null,
                data.country || null,
                data.region || null,
                data.description || null,
                data.gps_lat,
                data.gps_lon
            ]
        );
        const row =
            CatchTrackDatabase.query(
                `
                ${this.getWaterSelect()}
                WHERE user_id = ?
                  AND name = ?
                ORDER BY id DESC
                LIMIT 1
                `,
                [
                    userId,
                    data.name
                ]
            )[0];
        const water =
            this.normalizeWater(row);
        if (!water) {
            throw new Error(
                "Gewässer konnte nach dem Speichern nicht gelesen werden."
            );
        }
        this.resetForm();
        this.loadWaters();
        this.showFormMessage(
            this.t("waters.messages.saved"),
            "success"
        );
        return water;
    }
    catch (error) {
        this.state.lastError = error;
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
update(id, data) {
    if (!this.isDatabaseReady()) {
        this.showFormMessage(
            this.t(
                "waters.messages.databaseUnavailable"
            ),
            "error"
        );
        return null;
    }
    const userId = this.getCurrentUserId();
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
        const existing =
            CatchTrackDatabase.query(
                `
                SELECT id
                FROM waters
                WHERE id = ?
                  AND user_id = ?
                LIMIT 1
                `,
                [id, userId]
            );
        if (!existing.length) {
            throw new Error(
                "Gewässer nicht gefunden."
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
              AND user_id = ?
            `,
            [
                data.name,
                data.type || null,
                data.country || null,
                data.region || null,
                data.description || null,
                data.gps_lat,
                data.gps_lon,
                id,
                userId
            ]
        );
        const row =
            CatchTrackDatabase.query(
                `
                ${this.getWaterSelect()}
                WHERE id = ?
                  AND user_id = ?
                LIMIT 1
                `,
                [id, userId]
            )[0];
        const water =
            this.normalizeWater(row);
        if (!water) {
            throw new Error(
                "Gewässer konnte nach der Aktualisierung nicht gelesen werden."
            );
        }
        this.resetForm();
        this.loadWaters();
        this.showFormMessage(
            this.t("waters.messages.updated"),
            "success"
        );
        return water;
    }
    catch (error) {
        this.state.lastError = error;
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
    const userId = this.getCurrentUserId();
    if (userId === null) {
        return false;
    }
    try {
        const existing =
            CatchTrackDatabase.query(
                `
                SELECT id
                FROM waters
                WHERE id = ?
                  AND user_id = ?
                LIMIT 1
                `,
                [id, userId]
            );
        if (!existing.length) {
            return false;
        }
        CatchTrackDatabase.execute(
            `
            DELETE FROM waters
            WHERE id = ?
              AND user_id = ?
            `,
            [id, userId]
        );
        this.loadWaters();
        return true;
    }
    catch (error) {
        this.state.lastError = error;
        this.handleError(
            error,
            "waters:remove"
        );
        return false;
    }
},
deleteWater(id) {
    if (
        !window.confirm(
            this.t(
                "waters.messages.confirmDelete"
            )
        )
    ) {
        return false;
    }
    const deleted = this.remove(id);
    if (deleted) {
        this.showListMessage(
            this.t(
                "waters.messages.deleted"
            ),
            "success"
        );
    }
    return deleted;
},
getById(id) {
    const userId = this.getCurrentUserId();
    if (
        !this.isDatabaseReady() ||
        userId === null
    ) {
        return null;
    }
    const normalizedId = Number(id);
    if (
        !Number.isInteger(normalizedId) ||
        normalizedId <= 0
    ) {
        return null;
    }
    const row =
        CatchTrackDatabase.query(
            `
            ${this.getWaterSelect()}
            WHERE id = ?
              AND user_id = ?
            LIMIT 1
            `,
            [
                normalizedId,
                userId
            ]
        )[0];
    return this.normalizeWater(row);
},
getAll() {
    return this.loadWaters();
},
getCount() {
    const userId = this.getCurrentUserId();
    if (
        !this.isDatabaseReady() ||
        userId === null
    ) {
        return 0;
    }
    const row =
        CatchTrackDatabase.query(
            `
            SELECT COUNT(*) AS count
            FROM waters
            WHERE user_id = ?
            `,
            [userId]
        )[0];
    return Number(row?.count) || 0;
},
getNearby(latitude, longitude, radiusKm = 10) {
    const userId = this.getCurrentUserId();
    if (
        !this.isDatabaseReady() ||
        userId === null
    ) {
        return [];
    }
    const lat = Number(latitude);
    const lon = Number(longitude);
    const radius = Number(radiusKm);
    if (
        !Number.isFinite(lat) ||
        lat < -90 ||
        lat > 90 ||
        !Number.isFinite(lon) ||
        lon < -180 ||
        lon > 180 ||
        !Number.isFinite(radius) ||
        radius < 0
    ) {
        return [];
    }
    const latitudeDelta =
        radius / 111.32;
    const longitudeDelta =
        radius /
        (
            111.32 *
            Math.max(
                Math.cos(
                    lat * Math.PI / 180
                ),
                0.01
            )
        );
    const rows =
        CatchTrackDatabase.query(
            `
            ${this.getWaterSelect()}
            WHERE user_id = ?
              AND gps_lat IS NOT NULL
              AND gps_lon IS NOT NULL
              AND gps_lat BETWEEN ? AND ?
              AND gps_lon BETWEEN ? AND ?
            ORDER BY
                gps_lat,
                gps_lon,
                id
            `,
            [
                userId,
                lat - latitudeDelta,
                lat + latitudeDelta,
                lon - longitudeDelta,
                lon + longitudeDelta
            ]
        );
    return rows
        .map(row => this.normalizeWater(row))
        .filter(Boolean);
},
getCurrentSuggestion() {
    return this.state.currentSuggestion
        ? {
            ...this.state.currentSuggestion
        }
        : null;
},
async applyCurrentGpsPosition() {
    const gps =
        window.CatchTrackGPSModule;
    if (
        !gps ||
        typeof gps.getCurrentPosition !== "function"
    ) {
        this.showFormMessage(
            this.t(
                "waters.messages.gpsUnavailable"
            ),
            "error"
        );
        return null;
    }
    try {
        let position =
            gps.getCurrentPosition();
        if (
            position &&
            typeof position.then === "function"
        ) {
            position = await position;
        }
        if (
            !position &&
            typeof gps.requestPosition === "function"
        ) {
            position =
                await gps.requestPosition();
        }
        if (!position) {
            throw new Error(
                "No GPS position available."
            );
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
            throw new Error(
                "Invalid GPS position."
            );
        }
        const latInput =
            document.getElementById("water-lat");
        const lonInput =
            document.getElementById("water-lon");
        if (latInput) {
            latInput.value =
                latitude.toFixed(6);
        }
        if (lonInput) {
            lonInput.value =
                longitude.toFixed(6);
        }
        this.state.currentSuggestion = {
            latitude,
            longitude,
            accuracy:
                position.accuracy ?? null,
            altitude:
                position.altitude ?? null,
            timestamp:
                position.timestamp ??
                new Date().toISOString(),
            source:
                position.source || "gps"
        };
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
        this.showFormMessage(
            this.t(
                "waters.messages.gpsApplied"
            ),
            "success"
        );
        return {
            ...this.state.currentSuggestion
        };
    }
    catch (error) {
        this.state.lastError = error;
        this.handleError(
            error,
            "waters:gps"
        );
        this.showFormMessage(
            this.t(
                "waters.messages.gpsUnavailable"
            ),
            "error"
        );
        return null;
    }
},
navigateToWater(id) {
    const water = this.getById(id);
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
        return false;
    }
    const gps =
        window.CatchTrackGPSModule;
    if (
        gps &&
        typeof gps.navigateTo === "function"
    ) {
        try {
            const result =
                gps.navigateTo(
                    water.gps_lat,
                    water.gps_lon
                );
            if (
                result &&
                typeof result.catch === "function"
            ) {
                result.catch(
                    error =>
                        this.handleError(
                            error,
                            "waters:navigation"
                        )
                );
            }
            return true;
        }
        catch (error) {
            this.handleError(
                error,
                "waters:navigation"
            );
            return false;
        }
    }
    const url =
        `https://www.google.com/maps/dir/?api=1&destination=${
            encodeURIComponent(
                `${water.gps_lat},${water.gps_lon}`
            )
        }`;
    window.location.href = url;
    return true;
},
startEdit(id) {
    const water = this.getById(id);
    if (!water) {
        return false;
    }
    this.state.editingId = water.id;
    const fields = {
        "water-id": water.id,
        "water-name": water.name,
        "water-type": water.type || "",
        "water-country": water.country || "",
        "water-region": water.region || "",
        "water-lat": water.gps_lat ?? "",
        "water-lon": water.gps_lon ?? "",
        "water-description": water.description || ""
    };
    Object.entries(fields).forEach(
        ([fieldId, value]) => {
            const element =
                document.getElementById(fieldId);
            if (element) {
                element.value = value;
            }
        }
    );
    this.clearMessage(
        "waters-form-message"
    );
    this.updateFormMode();
    return true;
},
resetForm() {
    const form =
        document.getElementById("waters-form");
    if (form) {
        form.reset();
    }
    const id =
        document.getElementById("water-id");
    if (id) {
        id.value = "";
    }
    this.state.editingId = null;
    this.state.currentSuggestion = null;
    const gpsStatus =
        document.getElementById(
            "waters-gps-status"
        );
    if (gpsStatus) {
        gpsStatus.textContent = "";
    }
    this.clearMessage(
        "waters-form-message"
    );
    this.updateFormMode();
},
updateFormMode() {
    const editing =
        Number.isInteger(this.state.editingId) &&
        this.state.editingId > 0;
    const title =
        document.getElementById(
            "waters-form-title"
        );
    const mode =
        document.getElementById(
            "waters-form-mode"
        );
    const save =
        document.getElementById("save-water");
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
        cancel.hidden = !editing;
    }
},
migrateLegacyWaters() {
    if (!this.isDatabaseReady()) {
        return false;
    }
    const storage =
        window.CatchTrackStorageManager;
    if (
        !storage ||
        typeof storage.load !== "function" ||
        typeof storage.remove !== "function"
    ) {
        return false;
    }
    if (
        storage.load(
            this.storageKeys.legacyMigrated,
            false
        ) === true
    ) {
        return true;
    }
    const userId = this.getCurrentUserId();
    if (userId === null) {
        return false;
    }
    const legacy =
        storage.load(
            this.storageKeys.legacyWaters,
            null
        );
    if (
        !Array.isArray(legacy) ||
        !legacy.length
    ) {
        storage.save?.(
            this.storageKeys.legacyMigrated,
            true
        );
        return true;
    }
    try {
        for (const item of legacy) {
            const name =
                this.normalizeText(
                    item?.name,
                    200
                );
            if (!name) {
                continue;
            }
            const lat =
                this.normalizeCoordinate(
                    item?.latitude ??
                    item?.gps_lat,
                    -90,
                    90
                );
            const lon =
                this.normalizeCoordinate(
                    item?.longitude ??
                    item?.gps_lon,
                    -180,
                    180
                );
            const exists =
                CatchTrackDatabase.query(
                    `
                    SELECT id
                    FROM waters
                    WHERE user_id = ?
                      AND name = ?
                      AND (
                          (
                              gps_lat = ?
                              AND gps_lon = ?
                          )
                          OR
                          (
                              gps_lat IS NULL
                              AND gps_lon IS NULL
                          )
                      )
                    LIMIT 1
                    `,
                    [
                        userId,
                        name,
                        lat,
                        lon
                    ]
                );
            if (exists.length) {
                continue;
            }
            const timestamp =
                item?.createdAt ||
                item?.timestamp ||
                new Date().toISOString();
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
                    gps_lon,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    userId,
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
                    lat,
                    lon,
                    timestamp,
                    timestamp
                ]
            );
        }
        storage.remove(
            this.storageKeys.legacyWaters
        );
        storage.save?.(
            this.storageKeys.legacyMigrated,
            true
        );
        return true;
    }
    catch (error) {
        this.state.lastError = error;
        this.handleError(
            error,
            "waters:legacy-migration"
        );
        return false;
    }
},
showFormMessage(message, type = "info") {
    this.showMessage(
        "waters-form-message",
        message,
        type
    );
},
showListMessage(message, type = "info") {
    this.showMessage(
        "waters-list-message",
        message,
        type
    );
},
showMessage(id, message, type = "info") {
    const element =
        document.getElementById(id);
    if (!element) {
        return;
    }
    element.textContent =
        message || "";
    element.dataset.type = type;
    element.hidden = !message;
},
clearMessage(id) {
    const element =
        document.getElementById(id);
    if (!element) {
        return;
    }
    element.textContent = "";
    element.hidden = true;
    delete element.dataset.type;
},
escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
},
handleError(error, source) {
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
            `CatchTrack Waters ${source}:`,
            error
        );
    }
}

};