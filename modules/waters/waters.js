"use strict";

window.CatchTrackWatersModule = {

version: "4.0.0",
initialized: false,
state: {
    waters: [],
    nearby: [],
    editingId: null,
    busy: false,
    gpsBusy: false
},
init() {
    if (
        this.initialized
    ) {
        return;
    }
    this.bindEvents();
    this.initialized = true;
    this.refresh()
        .catch(
            error =>
                this.handleError(
                    error,
                    "waters:init"
                )
        );
},
getDatabase() {
    if (
        window.CatchTrackDatabase &&
        CatchTrackDatabase.database
    ) {
        return CatchTrackDatabase.database;
    }
    if (
        window.CatchTrack &&
        CatchTrack.database
    ) {
        return CatchTrack.database;
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
        typeof identity.getCurrentUser !==
            "function"
    ) {
        throw new Error(
            "Identity Core ist nicht verfügbar."
        );
    }
    const user =
        identity.getCurrentUser();
    const userId =
        user?.id ??
        user?.user_id ??
        null;
    if (
        userId === null ||
        userId === undefined ||
        userId === ""
    ) {
        throw new Error(
            "Kein aktiver Benutzer vorhanden."
        );
    }
    return userId;
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
                row.name ??
                ""
            ),
        type:
            String(
                row.type ??
                ""
            ),
        country:
            String(
                row.country ??
                ""
            ),
        region:
            String(
                row.region ??
                ""
            ),
        description:
            String(
                row.description ??
                ""
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
            row.created_at ??
            null,
        updated_at:
            row.updated_at ??
            null
    };
},
query(
    sql,
    params = []
) {
    const database =
        this.getDatabase();
    const statement =
        database.prepare(
            sql
        );
    try {
        statement.bind(
            params
        );
        const rows = [];
        while (
            statement.step()
        ) {
            rows.push(
                statement.getAsObject()
            );
        }
        return rows;
    }
    finally {
        statement.free();
    }
},
execute(
    sql,
    params = []
) {
    const database =
        this.getDatabase();
    const statement =
        database.prepare(
            sql
        );
    try {
        statement.bind(
            params
        );
        statement.step();
    }
    finally {
        statement.free();
    }
},
saveDatabase() {
    if (
        window.CatchTrackDatabase &&
        typeof
            CatchTrackDatabase.saveDatabase ===
            "function"
    ) {
        CatchTrackDatabase.saveDatabase();
        return true;
    }
    return false;
},
getAll() {
    const userId =
        this.getCurrentUserId();
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
                ORDER BY name COLLATE NOCASE ASC
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
    const userId =
        this.getCurrentUserId();
    const rows =
        this.query(
            `
                SELECT COUNT(*) AS count
                FROM waters
                WHERE user_id = ?
            `,
            [
                userId
            ]
        );
    return Number(
        rows[0]?.count ??
        0
    );
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
        Number(radiusKm);
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
    const safeRadius =
        Number.isFinite(radius) &&
        radius > 0
            ? Math.min(
                radius,
                500
            )
            : 25;
    const latDelta =
        safeRadius /
        111.32;
    const cosLat =
        Math.cos(
            lat *
            Math.PI /
            180
        );
    const lonDelta =
        Math.abs(cosLat) < 0.000001
            ? 180
            : safeRadius /
                (
                    111.32 *
                    Math.abs(cosLat)
                );
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
                  AND gps_lat BETWEEN ? AND ?
                  AND gps_lon BETWEEN ? AND ?
            `,
            [
                userId,
                lat - latDelta,
                lat + latDelta,
                lon - lonDelta,
                lon + lonDelta
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
                safeRadius
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
        this.getGPSPosition();
    if (
        !position
    ) {
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
        sinLon *
        sinLon;
    return (
        earthRadius *
        2 *
        Math.atan2(
            Math.sqrt(value),
            Math.sqrt(
                1 - value
            )
        )
    );
},
getGPSPosition() {
    const gps =
        window.CatchTrackGPSModule;
    if (
        !gps
    ) {
        return null;
    }
    if (
        typeof gps.getCurrentPosition ===
        "function"
    ) {
        return gps.getCurrentPosition();
    }
    if (
        typeof gps.getCoordinates ===
        "function"
    ) {
        return gps.getCoordinates();
    }
    return null;
},
async requestGPSPosition() {
    const gps =
        window.CatchTrackGPSModule;
    if (
        !gps ||
        typeof gps.requestPosition !==
            "function"
    ) {
        throw new Error(
            "GPS-Modul ist nicht verfügbar."
        );
    }
    return gps.requestPosition();
},
validateData(
    data
) {
    const source =
        data ||
        {};
    const name =
        String(
            source.name ??
            ""
        ).trim();
    if (
        !name
    ) {
        throw new Error(
            "Der Gewässername ist erforderlich."
        );
    }
    if (
        name.length >
        150
    ) {
        throw new Error(
            "Der Gewässername darf maximal 150 Zeichen enthalten."
        );
    }
    const latitude =
        this.normalizeCoordinate(
            source.gps_lat,
            -90,
            90
        );
    const longitude =
        this.normalizeCoordinate(
            source.gps_lon,
            -180,
            180
        );
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
            latitude,
        gps_lon:
            longitude
    };
},
normalizeText(
    value,
    maxLength
) {
    const text =
        String(
            value ??
            ""
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
        new Date().toISOString();
    this.execute(
        `
            INSERT INTO waters (
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
    const timestamp =
        new Date().toISOString();
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
                updated_at = ?
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
            timestamp,
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
    const existing =
        this.getById(
            waterId
        );
    if (
        !existing
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
resetForm() {
    const form =
        document.getElementById(
            "waters-form"
        );
    if (
        !form
    ) {
        return;
    }
    form.reset();
    const id =
        document.getElementById(
            "waters-id"
        );
    if (
        id
    ) {
        id.value = "";
    }
    this.state.editingId =
        null;
    const cancel =
        document.getElementById(
            "waters-cancel-button"
        );
    if (
        cancel
    ) {
        cancel.hidden = true;
    }
    this.setFormMessage(
        "",
        ""
    );
},
fillForm(
    water
) {
    if (
        !water
    ) {
        return;
    }
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
            if (
                element
            ) {
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
    if (
        cancel
    ) {
        cancel.hidden = false;
    }
    this.setFormMessage(
        "Gewässer wird bearbeitet.",
        "success"
    );
    const form =
        document.getElementById(
            "waters-form"
        );
    form?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
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
    this.setFormDisabled(
        true
    );
    try {
        const data =
            this.getFormData();
        const water =
            this.state.editingId
                ? this.update(
                    this.state.editingId,
                    data
                )
                : this.create(
                    data
                );
        if (
            !water
        ) {
            throw new Error(
                "Gewässer konnte nicht gespeichert werden."
            );
        }
        this.setFormMessage(
            this.state.editingId
                ? "Gewässer wurde aktualisiert."
                : "Gewässer wurde gespeichert.",
            "success"
        );
        this.resetForm();
        await this.refresh();
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
async editWater(
    id
) {
    try {
        const water =
            this.getById(
                id
            );
        if (
            !water
        ) {
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
        this.getById(
            id
        );
    if (
        !water
    ) {
        return;
    }
    const confirmed =
        window.confirm(
            `Gewässer „${water.name}" wirklich löschen?`
        );
    if (
        !confirmed
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
        if (
            this.state.editingId ===
            Number(id)
        ) {
            this.resetForm();
        }
        await this.refresh();
        this.setStatus(
            "Gewässer wurde gelöscht.",
            "success"
        );
    }
    catch (error) {
        this.setStatus(
            error.message,
            "error"
        );
        this.handleError(
            error,
            "waters:delete"
        );
    }
},
useGPSForForm() {
    const position =
        this.getGPSPosition();
    if (
        !position
    ) {
        this.setFormMessage(
            "Es ist noch kein GPS-Standort verfügbar.",
            "error"
        );
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
    if (
        latitude
    ) {
        latitude.value =
            position.latitude;
    }
    if (
        longitude
    ) {
        longitude.value =
            position.longitude;
    }
    this.setFormMessage(
        "Aktueller GPS-Standort wurde übernommen.",
        "success"
    );
},
async updateGPS() {
    if (
        this.state.gpsBusy
    ) {
        return;
    }
    this.state.gpsBusy =
        true;
    const button =
        document.getElementById(
            "waters-gps-button"
        );
    if (
        button
    ) {
        button.disabled = true;
    }
    this.setGPSMessage(
        "Standort wird ermittelt.",
        "info"
    );
    try {
        await this.requestGPSPosition();
        const position =
            this.getGPSPosition();
        if (
            !position
        ) {
            throw new Error(
                "GPS lieferte keinen gültigen Standort."
            );
        }
        const nearby =
            this.getNearby(
                position.latitude,
                position.longitude,
                25
            );
        this.state.nearby =
            nearby;
        this.renderNearby();
        this.setGPSMessage(
            `${nearby.length} Gewässer im Umkreis von 25 km gefunden.`,
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
        if (
            button
        ) {
            button.disabled = false;
        }
    }
},
async refresh() {
    try {
        this.setStatus(
            "Gewässer werden geladen.",
            "info"
        );
        this.state.waters =
            this.getAll();
        this.renderList();
        this.renderCount();
        const position =
            this.getGPSPosition();
        if (
            position
        ) {
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
        this.state.waters =
            [];
        this.state.nearby =
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
    if (
        element
    ) {
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
    if (
        !container
    ) {
        return;
    }
    container.innerHTML = "";
    if (
        !this.state.waters.length
    ) {
        container.appendChild(
            this.createEmptyElement(
                "Noch keine eigenen Gewässer vorhanden."
            )
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
renderNearby() {
    const container =
        document.getElementById(
            "waters-nearby-list"
        );
    if (
        !container
    ) {
        return;
    }
    container.innerHTML = "";
    if (
        !this.state.nearby.length
    ) {
        container.appendChild(
            this.createEmptyElement(
                "Keine Gewässer in der Nähe gefunden."
            )
        );
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
                `${this.formatDistance(
                    water.distance_km
                )} · ${this.getLocationText(
                    water
                )}`;
            info.append(
                title,
                meta
            );
            const actions =
                document.createElement(
                    "div"
                );
            actions.className =
                "waters-card-actions";
            const edit =
                this.createButton(
                    "Übernehmen",
                    "waters-button waters-button-secondary"
                );
            edit.addEventListener(
                "click",
                () =>
                    this.fillForm(
                        water
                    )
            );
            actions.appendChild(
                edit
            );
            item.append(
                info,
                actions
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
    const header =
        document.createElement(
            "div"
        );
    header.className =
        "waters-card-header";
    const titleBlock =
        document.createElement(
            "div"
        );
    const title =
        document.createElement(
            "h3"
        );
    title.className =
        "waters-card-title";
    title.textContent =
        water.name;
    const meta =
        document.createElement(
            "div"
        );
    meta.className =
        "waters-card-meta";
    const metadata = [
        water.type,
        water.country,
        water.region
    ].filter(
        Boolean
    );
    metadata.forEach(
        value => {
            const span =
                document.createElement(
                    "span"
                );
            span.textContent =
                value;
            meta.appendChild(
                span
            );
        }
    );
    titleBlock.append(
        title,
        meta
    );
    header.append(
        titleBlock
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
            "Bearbeiten",
            "waters-button waters-button-secondary"
        );
    edit.addEventListener(
        "click",
        () =>
            this.editWater(
                water.id
            )
    );
    const navigate =
        this.createButton(
            "Navigation",
            "waters-button waters-button-secondary"
        );
    navigate.disabled =
        water.gps_lat === null ||
        water.gps_lon === null;
    navigate.addEventListener(
        "click",
        () =>
            this.navigateTo(
                water
            )
    );
    const remove =
        this.createButton(
            "Löschen",
            "waters-button waters-button-secondary"
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
        navigate,
        remove
    );
    article.appendChild(
        actions
    );
    return article;
},
createButton(
    text,
    className
) {
    const button =
        document.createElement(
            "button"
        );
    button.type =
        "button";
    button.className =
        className;
    button.textContent =
        text;
    return button;
},
createEmptyElement(
    text
) {
    const element =
        document.createElement(
            "div"
        );
    element.className =
        "waters-empty";
    element.textContent =
        text;
    return element;
},
getLocationText(
    water
) {
    return [
        water.region,
        water.country
    ].filter(
        Boolean
    ).join(
        ", "
    ) || "Standort unbekannt";
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
    return `${kilometers.toFixed(1)} km`;
},
async navigateTo(
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
        window.CatchTrackGPSModule;
    try {
        if (
            gps &&
            typeof gps.navigateTo ===
                "function"
        ) {
            await gps.navigateTo(
                water.gps_lat,
                water.gps_lon
            );
            return;
        }
        const destination =
            `${water.gps_lat.toFixed(6)},${water.gps_lon.toFixed(6)}`;
        const url =
            `https://www.google.com/maps/dir/?api=1&destination=` +
            encodeURIComponent(
                destination
            );
        window.location.href =
            url;
    }
    catch (error) {
        this.handleError(
            error,
            "waters:navigation"
        );
    }
},
setFormDisabled(
    disabled
) {
    const form =
        document.getElementById(
            "waters-form"
        );
    if (
        !form
    ) {
        return;
    }
    form.querySelectorAll(
        "input, textarea, button"
    ).forEach(
        element => {
            element.disabled =
                disabled;
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
    if (
        !element
    ) {
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
    if (
        !element
    ) {
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
    type = ""
) {
    const element =
        document.getElementById(
            "waters-form-message"
        );
    if (
        !element
    ) {
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
    const form =
        document.getElementById(
            "waters-form"
        );
    form?.addEventListener(
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
}

};