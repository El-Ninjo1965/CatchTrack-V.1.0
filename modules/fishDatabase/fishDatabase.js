"use strict";

/*
==================================================
CatchTrack Fish Data Module
Version 1.0.0

Zweck:
- Eigenständiger Fish-Data-Kern
- Lesen der vorhandenen SQLite-Fischdaten
- Einmalige Initialisierung
- Kein mehrfaches Anhängen von HTML
- Kein mehrfaches Registrieren von Events
- Vorbereitung für spätere Fischkarten- und
  Admin-Funktionen

Datei:
modules/fishDatabase/fishData.js
==================================================
*/

window.CatchTrackFishDataModule = {

    version: "1.0.0",

    initialized: false,

    eventsBound: false,

    currentLanguage: "de",

    init() {

        if (this.initialized) {
            return true;
        }

        this.initialized = true;

        this.currentLanguage = this.getLanguage();

        this.bindEvents();

        this.render();

        return true;
    },


    getLanguage() {

        try {

            if (
                window.CatchTrackLanguageManager &&
                typeof window.CatchTrackLanguageManager.getLanguage === "function"
            ) {

                return String(
                    window.CatchTrackLanguageManager.getLanguage()
                );

            }

        } catch (error) {

            console.warn(
                "Fish Data: Sprache konnte nicht ermittelt werden.",
                error
            );

        }

        return "de";
    },


    getDatabase() {

        if (!window.CatchTrackDatabase) {
            return null;
        }

        if (
            typeof window.CatchTrackDatabase.isReady === "function"
        ) {

            if (!window.CatchTrackDatabase.isReady()) {
                return null;
            }

        }

        return window.CatchTrackDatabase;
    },


    bindEvents() {

        if (this.eventsBound) {
            return;
        }

        const saveButton =
            document.getElementById("save-fish");

        if (saveButton) {

            saveButton.onclick = () => {
                this.saveFish();
            };

        }

        this.eventsBound = true;
    },


    render() {

        const list =
            document.getElementById("fish-list");

        if (!list) {
            return false;
        }

        const database =
            this.getDatabase();

        if (!database) {

            list.innerHTML = `
                <p>
                    Fischdatenbank wird geladen...
                </p>
            `;

            return false;
        }

        const fishes =
            this.getFishes();

        this.renderFishList(
            list,
            fishes
        );

        return true;
    },


    getFishes() {

        const database =
            this.getDatabase();

        if (!database) {
            return [];
        }

        try {

            return database.query(
                `
                SELECT
                    fish.id,
                    fish.scientific_name,
                    fish.family,
                    fish.minimum_size,
                    fish.record_weight,
                    fish.description,
                    fish.image,
                    fish.verified,

                    COALESCE(
                        fish_names.name,
                        fish.scientific_name
                    ) AS name

                FROM fish

                LEFT JOIN fish_names

                    ON fish_names.fish_id = fish.id

                    AND fish_names.language = ?

                ORDER BY
                    name COLLATE NOCASE ASC,
                    fish.id ASC
                `,
                [
                    this.currentLanguage
                ]
            );

        } catch (error) {

            console.error(
                "Fish Data: Fehler beim Lesen der Fischdaten.",
                error
            );

            return [];
        }
    },


    renderFishList(
        container,
        fishes
    ) {

        /*
         * Der Container wird vollständig ersetzt.
         *
         * Dadurch werden niemals alte
         * Render-Ergebnisse angehängt.
         */

        if (!Array.isArray(fishes)) {
            fishes = [];
        }

        if (fishes.length === 0) {

            container.innerHTML = `
                <p>
                    Keine Fischdaten vorhanden.
                </p>
            `;

            return;
        }

        const html =
            fishes
                .map(
                    fish =>
                        this.createFishCard(fish)
                )
                .join("");

        container.innerHTML = html;
    },


    createFishCard(fish) {

        const id =
            this.escapeHtml(fish.id);

        const name =
            this.escapeHtml(fish.name);

        const scientificName =
            this.escapeHtml(fish.scientific_name);

        const family =
            this.escapeHtml(fish.family || "");

        const description =
            this.escapeHtml(fish.description || "");

        const minimumSize =
            fish.minimum_size !== null &&
            fish.minimum_size !== undefined
                ? this.escapeHtml(fish.minimum_size)
                : "";

        const recordWeight =
            fish.record_weight !== null &&
            fish.record_weight !== undefined
                ? this.escapeHtml(fish.record_weight)
                : "";

        return `
            <article
                class="fish-database-item"
                data-fish-id="${id}"
            >

                <h3>
                    ${name}
                </h3>

                <p>
                    <strong>
                        Wissenschaftlich:
                    </strong>
                    ${scientificName}
                </p>

                ${
                    family
                        ? `
                            <p>
                                <strong>
                                    Familie:
                                </strong>
                                ${family}
                            </p>
                        `
                        : ""
                }

                ${
                    minimumSize
                        ? `
                            <p>
                                <strong>
                                    Mindestgröße:
                                </strong>
                                ${minimumSize}
                            </p>
                        `
                        : ""
                }

                ${
                    recordWeight
                        ? `
                            <p>
                                <strong>
                                    Rekordgewicht:
                                </strong>
                                ${recordWeight}
                            </p>
                        `
                        : ""
                }

                ${
                    description
                        ? `
                            <p>
                                ${description}
                            </p>
                        `
                        : ""
                }

            </article>
        `;
    },


    saveFish() {

        const database =
            this.getDatabase();

        if (!database) {

            console.error(
                "Fish Data: Datenbank ist nicht bereit."
            );

            return false;
        }

        const name =
            this.getInputValue("fish-name");

        const scientificName =
            this.getInputValue(
                "fish-scientific-name"
            );

        const family =
            this.getInputValue("fish-family");

        const description =
            this.getInputValue(
                "fish-description"
            );

        if (!name || !scientificName) {

            alert(
                "Name und wissenschaftlicher Name sind erforderlich."
            );

            return false;
        }

        try {

            const connection =
                database.getConnection();

            if (!connection) {

                throw new Error(
                    "Keine SQLite-Verbindung verfügbar."
                );

            }

            connection.run(
                `
                INSERT OR IGNORE INTO fish
                (
                    scientific_name,
                    family,
                    description,
                    verified
                )

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    1
                );
                `,
                [
                    scientificName,
                    family,
                    description
                ]
            );

            const fishRows =
                database.query(
                    `
                    SELECT
                        id

                    FROM fish

                    WHERE scientific_name = ?

                    LIMIT 1;
                    `,
                    [
                        scientificName
                    ]
                );

            if (!fishRows.length) {

                throw new Error(
                    "Fisch konnte nach dem Speichern nicht gefunden werden."
                );

            }

            const fishId =
                fishRows[0].id;

            const existingName =
                database.query(
                    `
                    SELECT
                        id

                    FROM fish_names

                    WHERE
                        fish_id = ?

                        AND language = ?

                    LIMIT 1;
                    `,
                    [
                        fishId,
                        this.currentLanguage
                    ]
                );

            if (existingName.length) {

                connection.run(
                    `
                    UPDATE fish_names

                    SET name = ?

                    WHERE id = ?;
                    `,
                    [
                        name,
                        existingName[0].id
                    ]
                );

            } else {

                connection.run(
                    `
                    INSERT INTO fish_names
                    (
                        fish_id,
                        language,
                        name
                    )

                    VALUES
                    (
                        ?,
                        ?,
                        ?
                    );
                    `,
                    [
                        fishId,
                        this.currentLanguage,
                        name
                    ]
                );

            }

            database.saveDatabase();

            this.clearForm();

            this.render();

            return true;

        } catch (error) {

            console.error(
                "Fish Data: Fehler beim Speichern.",
                error
            );

            return false;
        }
    },


    getInputValue(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return "";
        }

        return String(
            element.value || ""
        ).trim();
    },


    clearForm() {

        const ids = [
            "fish-name",
            "fish-scientific-name",
            "fish-family",
            "fish-description"
        ];

        ids.forEach(
            id => {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.value = "";
                }

            }
        );
    },


    escapeHtml(value) {

        return String(
            value ?? ""
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },


    refresh() {

        this.currentLanguage =
            this.getLanguage();

        return this.render();
    }

};


/*
==================================================
Kein automatischer Dauer-Loop.

Das Modul wird vom CatchTrack Module Manager
initialisiert.

Manuelles Aktualisieren:

CatchTrackFishDataModule.refresh()
==================================================
*/

console.log(
    "CatchTrack Fish Data Module V1.0.0 geladen."
);