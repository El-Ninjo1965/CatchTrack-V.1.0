/*
 * CatchTrack Test Module
 * Version: 1.0
 *
 * Das minimale Modul dient zur Überprüfung der Core-Integration.
 */

(() => {
    'use strict';

    if (!window.CatchTrackCore || !window.CatchTrackModuleInterface || !window.CatchTrackModuleManager) {
        return;
    }

    const TestModule = window.CatchTrackModuleInterface.create({
        id: 'test-module',
        name: 'CatchTrack Test Module',
        version: '1.0.0',
        description: 'Minimalmodul zur Prüfung der Core-Integration.',

        onActivate(module) {
            window.CatchTrackCore.emit('test-module:activated', {
                id: module.id,
                timestamp: new Date().toISOString()
            });

            window.CatchTrackCore.on('test-module:ping', (payload) => {
                console.info('[CatchTrack] test-module:ping empfangen', payload);
            });

            window.CatchTrackCore.emit('test-module:ping', {
                source: module.id,
                time: new Date().toISOString()
            });
        },

        onDeactivate(module) {
            window.CatchTrackCore.emit('test-module:deactivated', {
                id: module.id,
                timestamp: new Date().toISOString()
            });
        }
    });

    try {
        window.CatchTrackModuleManager.register(TestModule);
        window.CatchTrackModuleManager.activate(TestModule.id);
    } catch (error) {
        if (window.CatchTrackCoreErrorHandler) {
            window.CatchTrackCoreErrorHandler.handle(error, {
                type: 'test-module'
            });
        }
    }
})();
