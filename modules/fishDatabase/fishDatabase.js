"use strict";


const CatchTrackFishDatabaseModule = {


    version: "1.0",



    init() {


        console.log(

            "CatchTrack Fischdatenbank aktiv."

        );


        this.bindEvents();

        this.loadFish();


    },



    getLanguage() {


        return (

            window.CatchTrackSettings?.language

            ||

            "de"

        );


    },



    bindEvents() {


        const button =

        document.getElementById(

            "save-fish"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.saveFish();


        };


    },



    saveFish() {


        const name =

        document.getElementById(

            "fish-name"

        )?.value.trim();



        const scientificName =

        document.getElementById(

            "fish-scientific-name"

        )?.value.trim();



        const family =

        document.getElementById(

            "fish-family"

        )?.value.trim();



        const description =

        document.getElementById(

            "fish-description"

        )?.value.trim();



        if (

            !name

            ||

            !scientificName

        ) {


            alert(

                "Name und wissenschaftlicher Name erforderlich."

            );


            return;


        }



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



        const fish =

        CatchTrackDatabase.query(

            `

            SELECT id

            FROM fish

            WHERE scientific_name = ?

            `,

            [

                scientificName

            ]

        );



        if (fish.length) {


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

                    fish[0].id,

                    this.getLanguage(),

                    name

                ]

            );


        }



        this.clearForm();


        this.loadFish();


    },



    loadFish() {


        const list =

        document.getElementById(

            "fish-list"

        );



        if (!list) {


            return;


        }



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

            [

                this.getLanguage()

            ]

        );



        if (!fishes.length) {


            list.innerHTML = `

                <p>

                    Keine Fische vorhanden.

                </p>

            `;


            return;


        }



        let html = "";



        fishes.forEach(

            fish => {


                html += `

                <div class="fish-database-item">


                    <h3>

                        ${fish.name}

                    </h3>


                    <p>

                        Wissenschaftlich:

                        ${fish.scientific_name}

                    </p>


                    <p>

                        Familie:

                        ${fish.family || ""}

                    </p>


                    <p>

                        ${fish.description || ""}

                    </p>


                </div>

                `;


            }

        );



        list.innerHTML = html;


    },



    clearForm() {


        [

            "fish-name",

            "fish-scientific-name",

            "fish-family",

            "fish-description"

        ]

        .forEach(

            id => {


                const field =

                document.getElementById(id);



                if (field) {


                    field.value = "";


                }


            }

        );


    }


};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/fishDatabase/fishDatabase.js

Version 1.0 Final Master
==================================================
*/