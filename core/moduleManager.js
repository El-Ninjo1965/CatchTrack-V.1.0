"use strict";


window.CatchTrackModuleManager = {


    version: "1.2.2",


    modules: [],


    activeModules: [],


    currentModule: null,


    loadedScripts: {},


    loadedStyles: {},



    init() {


        console.log(

            "CatchTrack ModuleManager V1.2.2 bereit."

        );


    },



    loadModules(modules) {


        this.modules =

        Array.isArray(modules)

        ? modules

        : [];



        this.activeModules =

        this.modules.filter(

            module =>

            module.enabled === true

        );



        this.createMenu();



        if (

            this.activeModules.length

        ) {


            this.loadModule(

                this.activeModules[0]

            );


        }


    },



    createMenu() {


        let menu =

        document.getElementById(

            "catchtrack-menu"

        );



        if (menu) {


            menu.remove();


        }



        menu =

        document.createElement(

            "nav"

        );


        menu.id =

        "catchtrack-menu";



        this.activeModules.forEach(

            module => {


                const button =

                document.createElement(

                    "button"

                );



                button.type =

                "button";



                button.textContent =

                module.displayName

                ||

                module.name;



                button.onclick = () => {


    if (

        module.name === "catches"

    ) {


        localStorage.removeItem(

            "catchEditId"

        );


        if (

            window.CatchTrackCatchesModule

        ) {


            CatchTrackCatchesModule.initialized = false;


        }


    }



    this.loadModule(

        module

    );


                };



                menu.appendChild(

                    button

                );


            }

        );



        const app =

        document.getElementById(

            "app"

        );



        if (app) {


            app.parentNode.insertBefore(

                menu,

                app

            );


        }


    },



    async loadModule(module) {


        try {


            this.currentModule = module;



            const app =

            document.getElementById(

                "app"

            );



            const htmlResponse =

            await fetch(

                module.path +

                module.files.html

            );



            app.innerHTML =

            await htmlResponse.text();



            await this.loadStyle(

                module

            );



            await this.loadScript(

                module

            );



            this.initializeModule(

                module

            );


        }

        catch(error) {


            console.error(

                "Modul laden Fehler:",

                error

            );


        }


    },



    loadStyle(module) {


        return new Promise(

            resolve => {


                const path =

                module.path +

                module.files.css;



                if (

                    this.loadedStyles[path]

                ) {


                    resolve();

                    return;


                }



                const link =

                document.createElement(

                    "link"

                );



                link.rel =

                "stylesheet";



                link.href =

                path;



                link.onload = () => {


                    this.loadedStyles[path] = true;


                    resolve();


                };



                link.onerror = () => {


                    console.warn(

                        "CSS Fehler:",

                        path

                    );


                    resolve();


                };



                document.head.appendChild(

                    link

                );


            }

        );


    },



    loadScript(module) {


        return new Promise(

            resolve => {


                const path =

                module.path +

                module.files.js;



                if (

                    this.loadedScripts[path]

                ) {


                    resolve();


                    return;


                }



                const script =

                document.createElement(

                    "script"

                );



                script.src =

                path;



                script.onload = () => {


                    this.loadedScripts[path] = true;


                    resolve();


                };



                script.onerror = () => {


                    console.error(

                        "JS Fehler:",

                        path

                    );


                    resolve();


                };



                document.body.appendChild(

                    script

                );


            }

        );


    },



    initializeModule(module) {


        const name =

        module.initializer;



        if (

            name &&

            window[name] &&

            typeof window[name].init ===

            "function"

        ) {


            window[name].init();



            console.log(

                "Modul gestartet:",

                module.name

            );


        }

        else {


            console.warn(

                "Initializer nicht gefunden:",

                name

            );


        }


    },



    getModules() {


        return this.modules;


    },



    getActiveModules() {


        return this.activeModules;


    }


};



document.addEventListener(

    "DOMContentLoaded",

    () => {


        CatchTrackModuleManager.init();


    }

);