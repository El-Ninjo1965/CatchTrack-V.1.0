"use strict";


window.CatchTrackCatchbookModule = {


    version: "1.4",


    currentSort: "newest",


    currentFilter: "",



    init() {


        console.log(

            "Fangbuch Modul V1.4 aktiv."

        );


        this.loadFilters();


        this.bindEvents();


        this.loadCatches();


    },



    bindEvents() {


        const sort =

        document.getElementById(

            "catch-sort"

        );



        const filter =

        document.getElementById(

            "catch-filter"

        );



        if (sort) {


            sort.onchange = () => {


                this.currentSort =

                sort.value;


                this.loadCatches();


            };


        }



        if (filter) {


            filter.onchange = () => {


                this.currentFilter =

                filter.value;


                this.loadCatches();


            };


        }


    },



    loadFilters() {


        const filter =

        document.getElementById(

            "catch-filter"

        );



        if (!filter) {


            return;


        }



        filter.innerHTML =

        `

        <option value="">

        Alle Fische

        </option>

        `;



        try {


            const result =

            CatchTrack.database.exec(

                `

                SELECT DISTINCT

                COALESCE(

                    catches.fish_name,

                    fish_names.name

                )

                FROM catches

                LEFT JOIN (

                    SELECT DISTINCT

                    fish_id,

                    name

                    FROM fish_names

                    WHERE language = 'de'

                )

                AS fish_names

                ON catches.fish_id = fish_names.fish_id

                ORDER BY 1

                `

            );



            if (

                result.length

                &&

                result[0].values.length

            ) {


                result[0].values.forEach(

                    row => {


                        const option =

                        document.createElement(

                            "option"

                        );



                        option.value =

                        row[0];



                        option.textContent =

                        row[0];



                        filter.appendChild(

                            option

                        );


                    }

                );


            }


        }

        catch(error) {


            console.error(

                "Filter Fehler:",

                error

            );


        }


    },



    loadCatches() {


        const container =

        document.getElementById(

            "catchbook-list"

        );



        if (!container) {


            return;


        }



        let order =

        "catches.id DESC";



        switch(

            this.currentSort

        ) {


            case "oldest":

                order =

                "catches.id ASC";

                break;


            case "fish":

                order =

                "fish_name ASC";

                break;


            case "weight":

                order =

                "catches.weight DESC";

                break;


            case "length":

                order =

                "catches.length DESC";

                break;


        }

        let filterSQL = "";


        if (this.currentFilter) {


            filterSQL =

            `

            AND

            COALESCE(

                catches.fish_name,

                fish_names.name

            ) = ?

            `;


        }



        const sql =

        `

        SELECT

        catches.id,

        catches.fish_name,

        fish_names.name,

        catches.date,

        catches.time,

        catches.weight,

        catches.length,

        catches.bait,

        catches.method,

        catches.notes

        FROM catches

        LEFT JOIN (

            SELECT DISTINCT

            fish_id,

            name

            FROM fish_names

            WHERE language = 'de'

        )

        AS fish_names

        ON catches.fish_id = fish_names.fish_id

        WHERE 1=1

        ${filterSQL}

        ORDER BY ${order}

        `;



        try {


            let result;



            if (this.currentFilter) {


                result =

                CatchTrack.database.exec(

                    sql,

                    [

                        this.currentFilter

                    ]

                );


            }

            else {


                result =

                CatchTrack.database.exec(

                    sql

                );


            }



            container.innerHTML = "";



            if (

                !result.length

                ||

                !result[0].values.length

            ) {


                container.innerHTML =

                `

                <div class="catch-empty">

                Noch keine Fänge gespeichert.

                </div>

                `;


                return;


            }



            result[0].values.forEach(

                row => {


                    const item =

                    document.createElement(

                        "div"

                    );



                    item.className =

                    "catch-item";



                    const fish =

                    row[1]

                    ||

                    row[2]

                    ||

                    "Unbekannter Fisch";



                    item.innerHTML =

                    `

                    <h3>

                    ${fish}

                    </h3>


                    <p>

                    Datum:

                    ${row[3] || "-"}

                    </p>


                    <p>

                    Zeit:

                    ${row[4] || "-"}

                    </p>


                    <p>

                    Gewicht:

                    ${row[5] || "-"} kg

                    </p>


                    <p>

                    Länge:

                    ${row[6] || "-"} cm

                    </p>


                    <p>

                    Köder:

                    ${row[7] || "-"}

                    </p>


                    <p>

                    Methode:

                    ${row[8] || "-"}

                    </p>


                    <p>

                    Notizen:

                    ${row[9] || "-"}

                    </p>


                    <button

                    onclick="CatchTrackCatchbookModule.editCatch(${row[0]})">

                    Bearbeiten

                    </button>


                    <button

                    onclick="CatchTrackCatchbookModule.deleteCatch(${row[0]})">

                    Löschen

                    </button>

                    `;



                    container.appendChild(

                        item

                    );


                }

            );


        }


        catch(error) {


            console.error(

                "Fangbuch Fehler:",

                error

            );


        }


    },



    editCatch(id) {


        localStorage.setItem(

            "catchEditId",

            id

        );



        const module =

        CatchTrackModuleManager

        .getModules()

        .find(

            item =>

            item.name === "catches"

        );



        if (module) {


            CatchTrackModuleManager

            .loadModule(

                module

            );


        }


    },



    deleteCatch(id) {


        if (

            !confirm(

                "Diesen Fang wirklich löschen?"

            )

        ) {


            return;


        }



        try {


            CatchTrackDatabase.execute(

                `

                DELETE FROM catches

                WHERE id = ?

                `,

                [

                    id

                ]

            );



            this.loadCatches();


        }


        catch(error) {


            console.error(

                "Löschen Fehler:",

                error

            );


        }


    }


};