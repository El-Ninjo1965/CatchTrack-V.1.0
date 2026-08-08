"use strict";


const CatchTrackEquipmentModule = {


    version: "1.0",



    init() {


        console.log(

            "CatchTrack Ausrüstung Modul aktiv."

        );


        this.bindEvents();

        this.loadEquipment();


    },



    bindEvents() {


        const button =

        document.getElementById(

            "save-equipment"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.saveEquipment();


        };


    },



    saveEquipment() {


        const category =

        document.getElementById(

            "equipment-category"

        )?.value.trim();



        const name =

        document.getElementById(

            "equipment-name"

        )?.value.trim();



        const brand =

        document.getElementById(

            "equipment-brand"

        )?.value.trim();



        const model =

        document.getElementById(

            "equipment-model"

        )?.value.trim();



        const description =

        document.getElementById(

            "equipment-description"

        )?.value.trim();





        if (!name) {


            alert(

                "Name erforderlich."

            );


            return;


        }




        CatchTrackDatabase.execute(

            `

            INSERT INTO equipment

            (

                category,

                name,

                brand,

                model,

                description

            )

            VALUES

            (?,?,?,?,?)

            `,

            [

                category,

                name,

                brand,

                model,

                description

            ]

        );



        this.clearForm();


        this.loadEquipment();


    },



    loadEquipment() {


        const list =

        document.getElementById(

            "equipment-list"

        );



        if (!list) {


            return;


        }



        const items =

        CatchTrackDatabase.query(

            `

            SELECT *

            FROM equipment

            ORDER BY name

            `

        );



        if (!items.length) {


            list.innerHTML = `

                <p>

                    Keine Ausrüstung gespeichert.

                </p>

            `;


            return;


        }



        let html = "";



        items.forEach(

            item => {


                html += `

                <div class="equipment-item">


                    <h3>

                        ${item.name}

                    </h3>


                    <p>

                        Kategorie:

                        ${item.category || ""}

                    </p>


                    <p>

                        Hersteller:

                        ${item.brand || ""}

                    </p>


                    <p>

                        Modell:

                        ${item.model || ""}

                    </p>


                    <p>

                        ${item.description || ""}

                    </p>


                </div>

                `;


            }

        );



        list.innerHTML = html;


    },



    clearForm() {


        [

            "equipment-category",

            "equipment-name",

            "equipment-brand",

            "equipment-model",

            "equipment-description"

        ]

        .forEach(

            id => {


                const field =

                document.getElementById(

                    id

                );



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
modules/equipment/equipment.js

Version 1.0 Final Master
==================================================
*/