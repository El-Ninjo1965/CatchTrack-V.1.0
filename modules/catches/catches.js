"use strict";


window.CatchTrackCatchesModule = {


    version: "1.8",

    saving: false,



    init() {


        console.log(

            "Neuer Fang Modul V1.8 aktiv."

        );


        this.loadFish();


        const editId =

        localStorage.getItem(

            "catchEditId"

        );



        if (editId) {


            this.loadEditCatch();


        }

        else {


            this.resetForm();


        }



        this.bindEvents();


    },



    loadFish() {


        const select =

        document.getElementById(

            "catch-fish"

        );



        if (!select) {


            return;


        }



        select.innerHTML = "";



        const firstOptions = [


            {

                value: "",

                text: "Auswahl"

            },


            {

                value: "manual",

                text: "Manuell eintragen"

            }


        ];



        firstOptions.forEach(

            item => {


                const option =

                document.createElement(

                    "option"

                );



                option.value =

                item.value;



                option.textContent =

                item.text;



                select.appendChild(

                    option

                );


            }

        );



        try {


            const result =

            CatchTrack.database.exec(

                `

                SELECT DISTINCT

                fish.id,

                fish_names.name

                FROM fish

                JOIN fish_names

                ON fish.id = fish_names.fish_id

                WHERE fish_names.language = 'de'

                ORDER BY fish_names.name

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

                        row[1];



                        select.appendChild(

                            option

                        );


                    }

                );


            }


        }

        catch(error) {


            console.error(

                "Fisch laden Fehler:",

                error

            );


        }


    },



    bindEvents() {


        const select =

        document.getElementById(

            "catch-fish"

        );



        if (select) {


            select.onchange = () => {


                this.toggleManualInput();


            };


        }



        const button =

        document.getElementById(

            "save-catch"

        );



        if (button) {


            button.onclick = () => {


                this.saveCatch();


            };


        }


    },



    toggleManualInput() {


        const select =

        document.getElementById(

            "catch-fish"

        );



        const container =

        document.getElementById(

            "manual-fish-container"

        );



        const input =

        document.getElementById(

            "catch-fish-name"

        );



        if (!select || !container) {


            return;


        }



        if (

            select.value === "manual"

        ) {


            container.classList.remove(

                "hidden"

            );


        }

        else {


            container.classList.add(

                "hidden"

            );



            if (input) {


                input.value = "";


            }


        }


    },



    resetForm() {


        const ids = [


            "catch-fish-name",

            "catch-weight",

            "catch-length",

            "catch-bait",

            "catch-method",

            "catch-notes"


        ];



        ids.forEach(

            id => {


                const element =

                document.getElementById(

                    id

                );



                if (element) {


                    element.value = "";


                }


            }

        );



        const select =

        document.getElementById(

            "catch-fish"

        );



        if (select) {


            select.value = "";


        }



        this.toggleManualInput();


    },

    loadEditCatch() {


        const editId =

        localStorage.getItem(

            "catchEditId"

        );



        if (!editId) {


            return;


        }



        try {


            const result =

            CatchTrack.database.exec(

                `

                SELECT

                fish_id,

                fish_name,

                weight,

                length,

                bait,

                method,

                notes

                FROM catches

                WHERE id = ?

                `,

                [

                    editId

                ]

            );



            if (

                !result.length

                ||

                !result[0].values.length

            ) {


                return;


            }



            const row =

            result[0].values[0];



            const select =

            document.getElementById(

                "catch-fish"

            );



            if (row[0]) {


                select.value =

                row[0];


            }

            else {


                select.value =

                "manual";


            }



            document.getElementById(

                "catch-fish-name"

            ).value =

            row[1] || "";



            document.getElementById(

                "catch-weight"

            ).value =

            row[2] || "";



            document.getElementById(

                "catch-length"

            ).value =

            row[3] || "";



            document.getElementById(

                "catch-bait"

            ).value =

            row[4] || "";



            document.getElementById(

                "catch-method"

            ).value =

            row[5] || "";



            document.getElementById(

                "catch-notes"

            ).value =

            row[6] || "";



            this.toggleManualInput();


        }

        catch(error) {


            console.error(

                "Bearbeiten laden Fehler:",

                error

            );


        }


    },



    saveCatch() {


        if (this.saving) {


            return;


        }



        this.saving = true;



        try {


            const editId =

            localStorage.getItem(

                "catchEditId"

            );



            const select =

            document.getElementById(

                "catch-fish"

            );



            let fishId = null;

            let fishName = null;



            if (

                select.value === "manual"

            ) {


                fishName =

                document.getElementById(

                    "catch-fish-name"

                ).value.trim();


            }

            else {


                fishId =

                select.value || null;



                if (fishId) {


                    const result =

                    CatchTrack.database.exec(

                        `

                        SELECT name

                        FROM fish_names

                        WHERE fish_id = ?

                        AND language = 'de'

                        LIMIT 1

                        `,

                        [

                            fishId

                        ]

                    );



                    if (

                        result.length

                        &&

                        result[0].values.length

                    ) {


                        fishName =

                        result[0].values[0][0];


                    }


                }


            }



            if (

                !fishId

                &&

                !fishName

            ) {


                alert(

                    "Bitte Fisch auswählen."

                );


                this.saving = false;


                return;


            }



            const values = [


                fishId,

                fishName,

                document.getElementById("catch-weight").value || null,

                document.getElementById("catch-length").value || null,

                document.getElementById("catch-bait").value || null,

                document.getElementById("catch-method").value || null,

                document.getElementById("catch-notes").value || null


            ];



            if (editId) {


                values.push(editId);



                CatchTrackDatabase.execute(

                    `

                    UPDATE catches SET

                    fish_id=?,

                    fish_name=?,

                    weight=?,

                    length=?,

                    bait=?,

                    method=?,

                    notes=?

                    WHERE id=?

                    `,

                    values

                );


            }

            else {


                CatchTrackDatabase.execute(

                    `

                    INSERT INTO catches

                    (

                    fish_id,

                    fish_name,

                    date,

                    time,

                    weight,

                    length,

                    bait,

                    method,

                    notes

                    )

                    VALUES

                    (

                    ?,

                    ?,

                    date('now'),

                    time('now'),

                    ?,

                    ?,

                    ?,

                    ?,

                    ?

                    )

                    `,

                    values

                );


            }



            localStorage.removeItem(

                "catchEditId"

            );



            alert(

                "Fang gespeichert."

            );



            this.resetForm();



            this.openCatchbook();


        }

        catch(error) {


            console.error(

                "Speichern Fehler:",

                error

            );


            alert(

                "Fehler beim Speichern."

            );


        }



        this.saving = false;


    },



    openCatchbook() {


        const module =

        CatchTrackModuleManager

        .getModules()

        .find(

            item =>

            item.name === "catchbook"

        );



        if (module) {


            CatchTrackModuleManager.loadModule(

                module

            );


        }


    }


};