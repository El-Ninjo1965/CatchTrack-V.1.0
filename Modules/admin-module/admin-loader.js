/*
 * CatchTrack Admin Module Loader
 * Version: 1.0
 *
 * Registriert und aktiviert das Admin-Modul im CatchTrack-Core.
 */

(() => {
    'use strict';

    if (!window.CatchTrackCore || !window.CatchTrackModuleInterface || !window.CatchTrackModuleManager) {
        return;
    }

    if (!window.CatchTrackAdminModuleInterface) {
        console.error('[CatchTrack] AdminModuleInterface nicht verfügbar');
        return;
    }

    const AdminModuleDefinition = window.CatchTrackAdminModuleInterface.definition;

    const AdminModule = window.CatchTrackModuleInterface.create({
        id: 'admin-module',
        name: 'CatchTrack Admin Module',
        version: AdminModuleDefinition.version || '1.0.0',
        description: 'Verwaltungs- und Steuerwerkzeug für die Anwendung',
        onActivate: AdminModuleDefinition.onActivate,
        onDeactivate: AdminModuleDefinition.onDeactivate
    });

    try {
        window.CatchTrackModuleManager.register(AdminModule);
        window.CatchTrackModuleManager.activate(AdminModule.id);

        window.CatchTrackCore.emit('admin-module:registered-and-loaded', {
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        window.CatchTrackCoreErrorHandler?.handle(error, {
            type: 'admin-module-loader'
        });
    }
})();
