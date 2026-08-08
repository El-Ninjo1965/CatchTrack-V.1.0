"use strict";


const CatchTrackLeaderboardModule = {


    version: "1.0",



    init() {


        console.log(

            "CatchTrack Ranglisten Modul aktiv."

        );


        this.loadLeaderboard();


    },



    loadLeaderboard() {


        const list =

        document.getElementById(

            "leaderboard-list"

        );



        if (!list) {


            return;


        }



        const records =

        CatchTrackDatabase.query(

            `

            SELECT

                fish_name,

                weight,

                length,

                date


            FROM catches


            ORDER BY weight DESC


            LIMIT 50

            `

        );



        if (!records.length) {


            list.innerHTML = `

                <p>

                    Noch keine Ranglisten-Daten vorhanden.

                </p>

            `;


            return;


        }



        let html = "";



        records.forEach(

            (item, index) => {


                html += `

                <div class="leaderboard-item">


                    <h3>

                        Rang ${index + 1}

                    </h3>


                    <p>

                        Fisch:

                        ${item.fish_name || ""}

                    </p>


                    <p>

                        Gewicht:

                        ${item.weight || 0}

                        kg

                    </p>


                    <p>

                        Länge:

                        ${item.length || 0}

                        cm

                    </p>


                    <p>

                        Datum:

                        ${item.date || ""}

                    </p>


                </div>

                `;


            }

        );



        list.innerHTML = html;


    }


};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/leaderboard/leaderboard.js

Version 1.0 Final Master
==================================================
*/