"use strict";


const CatchTrackPhotosModule = {


    version: "1.0",


    photos: [],



    init() {


        console.log(

            "CatchTrack Foto Modul aktiv."

        );


        this.bindEvents();


        this.loadPhotos();


    },



    bindEvents() {


        const input =

        document.getElementById(

            "photo-upload"

        );



        if (!input) {


            return;


        }



        input.onchange = event => {


            this.handleUpload(

                event.target.files

            );


        };


    },



    handleUpload(files) {


        if (!files || !files.length) {


            return;


        }



        Array.from(files)

        .forEach(

            file => {


                this.savePhoto(

                    file

                );


            }

        );


    },



    savePhoto(file) {


        const reader =

        new FileReader();



        reader.onload = event => {


            const photo = {


                id:

                Date.now(),


                name:

                file.name,


                data:

                event.target.result,


                created:

                new Date()

            };



            this.photos.push(

                photo

            );



            this.displayPhotos();


        };



        reader.readAsDataURL(

            file

        );


    },



    loadPhotos() {


        const saved =

        localStorage.getItem(

            "catchtrack_photos"

        );



        if (saved) {


            this.photos =

            JSON.parse(

                saved

            );


        }



        this.displayPhotos();


    },



    saveStorage() {


        localStorage.setItem(

            "catchtrack_photos",

            JSON.stringify(

                this.photos

            )

        );


    },



    displayPhotos() {


        const album =

        document.getElementById(

            "photo-gallery"

        );



        if (!album) {


            return;


        }



        album.innerHTML = "";



        this.photos.forEach(

            photo => {


                album.innerHTML += `

                    <div class="photo-item">


                        <img

                            src="${photo.data}"

                            alt="${photo.name}"

                        >


                        <p>

                            ${photo.name}

                        </p>


                    </div>

                `;


            }

        );



        this.saveStorage();


    }



};



/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
modules/photos/photos.js

Version 1.0 Final Master
==================================================
*/