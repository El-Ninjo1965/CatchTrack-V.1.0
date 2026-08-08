"use strict";


window.CatchTrackAdminModule = {


    version: "1.0",



    init() {


        console.log(

            "Admin Modul aktiv."

        );


        this.loadSystem();


        this.loadDatabase();


        this.loadCatches();


    },



    loadSystem() {


        const box =

        document.getElementById(

            "admin-system"

        );



        if (!box) {


            return;


        }



        let html =

        "";



        html +=

        `

        <div class="admin-item">

        App:

        ${CatchTrack.version || "-"}

        </div>

        `;



        html +=

        `

        <div class="admin-item">

        Module geladen:

        ${CatchTrackModuleManager.getModules().length}

        </div>

        `;



        html +=

        `

        <div class="admin-item admin-ok">

        Datenbank verbunden

        </div>

        `;



        box.innerHTML = html;


    },



    loadDatabase() {


        const box =

        document.getElementById(

            "admin-database"

        );



        if (!box) {


            return;


        }



        try {


            const tables =

            CatchTrack.database.exec(

                `

                SELECT

                name

                FROM sqlite_master

                WHERE type='table'

                ORDER BY name

                `

            );



            let html =

            "";



            if (

                tables.length

                &&

                tables[0].values.length

            ) {


                tables[0].values.forEach(

                    row => {


                        let count =

                        CatchTrack.database.exec(

                            `

                            SELECT COUNT(*)

                            FROM ${row[0]}

                            `

                        );



                        html +=

                        `

                        <div class="admin-item">

                        ${row[0]}:

                        ${count[0].values[0][0]}

                        Einträge

                        </div>

                        `;


                    }

                );


            }



            box.innerHTML = html;


        }

        catch(error) {


            box.innerHTML =

            error.message;



        }


    },



    loadCatches() {


        const box =

        document.getElementById(

            "admin-catches"

        );



        if (!box) {


            return;


        }



        try {


            const result =

            CatchTrack.database.exec(

                `

                SELECT

                id,

                COALESCE(

                    fish_name,

                    'Datenbank Fisch'

                ),

                date,

                time

                FROM catches

                ORDER BY id DESC

                `

            );



            let html =

            `

            <table class="admin-table">

            <tr>

            <th>ID</th>

            <th>Fisch</th>

            <th>Datum</th>

            <th>Zeit</th>

            </tr>

            `;



            if (

                result.length

                &&

                result[0].values.length

            ) {


                result[0].values.forEach(

                    row => {


                        html +=

                        `

                        <tr>

                        <td>${row[0]}</td>

                        <td>${row[1]}</td>

                        <td>${row[2]}</td>

                        <td>${row[3]}</td>

                        </tr>

                        `;


                    }

                );


            }



            html +=

            "</table>";



            box.innerHTML = html;


        }

        catch(error) {


            box.innerHTML =

            error.message;


        }


    }


};