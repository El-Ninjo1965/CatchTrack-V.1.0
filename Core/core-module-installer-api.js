/*
 * CatchTrack Core Module Installer API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Installation und Deinstallation von Modulen.
 */

(() => {
    'use strict';

    const InstallerAPI = {
        async install(moduleDefinition) {
            if (!window.CatchTrackCoreModuleInstaller) {
                throw new Error(
                    'Core Module Installer is not available.'
                );
            }

            return window.CatchTrackCoreModuleInstaller.install(
                moduleDefinition
            );
        },

        uninstall(moduleId) {
            if (!window.CatchTrackCoreModuleInstaller) {
                throw new Error(
                    'Core Module Installer is not available.'
                );
            }

            return window.CatchTrackCoreModuleInstaller.uninstall(
                moduleId
            );
        }
    };

    window.CatchTrackCoreModuleInstallerAPI =
        Object.freeze(InstallerAPI);
})();