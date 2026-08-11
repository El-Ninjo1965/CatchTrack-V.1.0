/*
 * CatchTrack User Module Loader
 * Version: 1.0
 *
 * Registriert und aktiviert das User-Modul im CatchTrack-Core.
 */

(() => {
    'use strict';

    if (!window.CatchTrackCore || !window.CatchTrackModuleInterface || !window.CatchTrackModuleManager) {
        return;
    }

    if (!window.CatchTrackUserModuleInterface) {
        console.error('[CatchTrack] UserModuleInterface nicht verfügbar');
        return;
    }

    const UserModuleDefinition = window.CatchTrackUserModuleInterface.definition;

    const UserModule = window.CatchTrackModuleInterface.create({
        id: 'user-module',
        name: 'CatchTrack User Module',
        version: UserModuleDefinition.version || '1.0.0',
        description: 'Verwaltung von Benutzern und Authentifizierung',
        onActivate: UserModuleDefinition.onActivate,
        onDeactivate: UserModuleDefinition.onDeactivate
    });

    try {
        window.CatchTrackModuleManager.register(UserModule);
        window.CatchTrackModuleManager.activate(UserModule.id);

        window.CatchTrackCore.emit('user-module:registered-and-loaded', {
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        window.CatchTrackCoreErrorHandler?.handle(error, {
            type: 'user-module-loader'
        });
    }
})();
