"use strict";

const CatchTrackFishDatabaseModule = {

    version: "1.1.1",
    initialized: false,

    init() {
        if (this.initialized) {
            console.warn(
                "Fish Database: Initialisierung bereits erfolgt."
            );
            return;
        }

        this.initialized = true;

        console.log(
            "CatchTrack Fischdatenbank aktiv."
        );

        this.bindEvents();
        this.loadFish();
    },

    getLanguage() {
        if (
            window.CatchTrackLanguageManager &&
            typeof window.CatchTrackLanguageManager.getLanguage === "function"
        ) {
            return window.CatchTrackLanguageManager.getLanguage();
        }

        return (
            window.CatchTrackSettings?.language ||
            "de"
        );
    },

    escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    bindEvents() {
        const button = document.getElementById("save-fish");

        if (!button) {
            return;
        }

        button.onclick = () => {
            this.saveFish();
        };
    },

    saveFish() {
        const name = document
            .getElementById("fish-name")
            ?.value
            .trim();

        const scientificName = document
            .getElementById("fish-scientific-name")
            ?.value
            .trim();

        const family = document
            .getElementById("fish-family")
            ?.value
            .trim();

        const description = document
            .getElementById("fish-description")
            ?.value
            .trim();

        if (!name || !scientificName) {
            alert(
                "Name und wissenschaftlicher Name erforderlich."
            );
            return;
        }

        try {
            CatchTrackDatabase.execute(
                `
                INSERT OR IGNORE INTO fish
                (
                    scientific_name,
                    family,
                    description,
                    verified
                )
                VALUES
                (?,?,?,1)
                `,
                [
                    scientificName,
                    family,
                    description
                ]
            );

            const fish = CatchTrackDatabase.query(
                `
                SELECT id
                FROM fish
                WHERE scientific_name = ?
                `,
                [scientificName]
            );

            if (!fish.length) {
                console.error(
                    "Fish Database: Fisch konnte nicht angelegt werden.",
                    scientificName
                );
                return;
            }

            const fishId = fish[0].id;
            const language = this.getLanguage();

            const existingName =
                CatchTrackDatabase.query(
                    `
                    SELECT id
                    FROM fish_names
                    WHERE fish_id = ?
                    AND language = ?
                    `,
                    [
                        fishId,
                        language
                    ]
                );

            if (existingName.length) {
                CatchTrackDatabase.execute(
                    `
                    UPDATE fish_names
                    SET name = ?
                    WHERE id = ?
                    `,
                    [
                        name,
                        existingName[0].id
                    ]
                );
            } else {
                CatchTrackDatabase.execute(
                    `
                    INSERT INTO fish_names
                    (
                        fish_id,
                        language,
                        name
                    )
                    VALUES
                    (?,?,?)
                    `,
                    [
                        fishId,
                        language,
                        name
                    ]
                );
            }

            this.clearForm();
            this.loadFish();

        } catch (error) {
            console.error(
                "Fish Database: Fehler beim Speichern.",
                error
            );
        }
    },

    loadFish() {
        const list =
            document.getElementById("fish-list");

        if (!list) {
            return;
        }

        try {
            const fishes =
                CatchTrackDatabase.query(
                    `
                    SELECT
                        fish.id,
                        fish.scientific_name,
                        fish.family,
                        fish.description,
                        COALESCE(
                            names.name,
                            fish.scientific_name
                        ) AS name
                    FROM fish
                    LEFT JOIN fish_names AS names
                        ON fish.id = names.fish_id
                        AND names.language = ?
                    ORDER BY name
                    `,
                    [this.getLanguage()]
                );

            if (!fishes.length) {
                list.innerHTML = `
                    <p>Keine Fische vorhanden.</p>
                `;
                return;
            }

            const html = fishes
                .map(fish => `
                    <div
                        class="fish-database-item"
                        data-fish-id="${this.escapeHtml(fish.id)}"
                    >
                        <h3>
                            ${this.escapeHtml(fish.name)}
                        </h3>

                        <p>
                            Wissenschaftlich:
                            ${this.escapeHtml(
                                fish.scientific_name
                            )}
                        </p>

                        <p>
                            Familie:
                            ${this.escapeHtml(
                                fish.family || ""
                            )}
                        </p>

                        <p>
                            ${this.escapeHtml(
                                fish.description || ""
                            )}
                        </p>
                    </div>
                `)
                .join("");

            /*
             * Immer den vorhandenen Listeninhalt vollständig
             * ersetzen. Dadurch können alte Renderungen nicht
             * angehängt oder vervielfacht werden.
             */
            if (list.innerHTML !== html) {
                list.innerHTML = html;
            }

        } catch (error) {
            console.error(
                "Fish Database: Fehler beim Laden.",
                error
            );

            list.innerHTML = `
                <p>
                    Fehler beim Laden der Fischdaten.
                </p>
            `;
        }
    },

    clearForm() {
        [
            "fish-name",
            "fish-scientific-name",
            "fish-family",
            "fish-description"
        ].forEach(id => {
            const field =
                document.getElementById(id);

            if (field) {
                field.value = "";
            }
        });
    }
};

window.CatchTrackFishDatabaseModule =
    CatchTrackFishDatabaseModule;

/*
==================================================
ENDE DATEI

CatchTrack V1.0
modules/fishDatabase/fishDatabase.js

Version 1.1.1
Vollständige Ersatzdatei
Schutz gegen Mehrfachinitialisierung
==================================================
*/