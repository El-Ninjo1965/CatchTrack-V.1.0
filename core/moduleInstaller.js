"use strict";


const CatchTrackModuleInstaller = {


    version: "1.0",


    installedModules: [],



    init() {


        console.log(

            "CatchTrack Module Installer bereit."

        );


    },



    scanModule(module) {


        if (!module) {


            return false;


        }



        const required = [


            "name",

            "path",

            "files",

            "initializer"


        ];



        return required.every(

            item =>

            module[item]

        );


    },



    installModule(module) {


        if (!this.scanModule(module)) {


            console.warn(

                "Ungültiges Modul:",

                module

            );


            return false;


        }



        const exists =

        this.installedModules.some(

            item =>

            item.name === module.name

        );



        if (exists) {


            return false;


        }



        this.installedModules.push(

            {

                name: module.name,

                version: module.version || "1.0",

                installed: true,

                installedAt:

                new Date().toISOString()

            }

        );



        console.log(

            "Modul installiert:",

            module.name

        );



        return true;


    },



    uninstallModule(name) {


        this.installedModules =

        this.installedModules.filter(

            module =>

            module.name !== name

        );



        return true;


    },



    isInstalled(name) {


        return this.installedModules.some(

            module =>

            module.name === name

        );


    },



    getInstalledModules() {


        return this.installedModules;


    },



    prepareDatabase(module) {


        if (!module.database) {


            return false;


        }



        console.log(

            "Datenbank Vorbereitung:",

            module.name

        );



        return true;


    }


};



document.addEventListener(

    "DOMContentLoaded",

    () => {


        CatchTrackModuleInstaller.init();


    }

);


/*
==================================================
ENDE DATEI

CatchTrack Master Edition V1.0
core/moduleInstaller.js

Version 1.0
==================================================
*/