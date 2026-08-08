"use strict";


const CatchTrackWatersModule = {


    version: "1.0",



    init() {


        console.log(

            "CatchTrack Gewässer Modul aktiv."

        );


        this.bindEvents();

        this.loadWaters();


    },



    bindEvents() {


        const button =

        document.getElementById(

            "save-water"

        );



        if (!button) {


            return;


        }



        button.onclick = () => {


            this.saveWater();


        };


    },



    saveWater() {


        const name =

        document.getElementById(

            "water-name"

        )?.value.trim();



        const type =

        document.getElementById(

            "water-type"

        )?.value.trim();



        const country =

        document.getElementById(

            "water-country"

        )?.value.trim();



        const region =

        document.getElementById(

            "water-region"

        )?.value.trim();



        const latitude =

        document.getElementById(

            "water-lat"

        )?.value;



        const longitude =

        document.getElementById(

            "water-lon"

        )?.value;



        const description =

        document.getElementById(

            "water-description"

        )?.value.trim();





        if (!name) {


            alert(

                "Gewässername erforderlich."

            );


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

                gps_lat,

                gps_lon,

                description

            )

            VALUES

            (?,?,?,?,?,?,?)

            `,

            [

                name,

                type,

                country,

                region,

                latitude,

                longitude,

                description

            ]

        );



        this.clearForm();


        this.loadWaters();


    },



    loadWaters() {


        const list =

        document.getElementById(

            "waters-list"

        );



        if (!list) {


            return;


        }



        const waters =

        CatchTrackDatabase.query(

            `

            SELECT *

            FROM waters

            ORDER BY name

            `

        );



        if (!waters.length) {


            list.innerHTML = `

                <p>

                    Keine Gewässer gespeichert.

                </p>

            `;


            return;


        }



        let html = "";



        waters.forEach(

            water => {


                html += `

                <div class="water-item">


                    <h3>

                        ${water.name}

                    </h3>


                    <p>

                        Typ:

                        ${water.type || ""}

                    </p>


                    <p>

                        Region:

                        ${water.region || ""}

                    </p>


                    <p>

                        ${water.description || ""}

                    </p>


                </div>

                `;


            }

        );



        list.innerHTML = html;


    },



    clearForm() {


        [

            "water-name",

            "water-type",

            "water-country",

            "water-region",

            "water-lat",

            "water-lon",

            "water-description"

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
modules/waters/waters.js

Version 1.0 Final Master
==================================================
*/