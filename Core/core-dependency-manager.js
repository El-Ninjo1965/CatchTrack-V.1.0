/*
 * CatchTrack Core Dependency Manager
 * Version: 1.0
 *
 * Verwaltung technischer Abhängigkeiten zwischen Modulen.
 * Fachliche Logik bleibt vollständig innerhalb der Module.
 */

(() => {
    'use strict';

    const dependencies = new Map();

    const DependencyManager = {
        register(moduleId, requiredModules = []) {
            this.validateModuleId(moduleId);

            if (!Array.isArray(requiredModules)) {
                throw new TypeError(
                    'Required modules must be an array.'
                );
            }

            requiredModules.forEach((dependencyId) => {
                this.validateModuleId(dependencyId);
            });

            dependencies.set(moduleId, [...requiredModules]);

            window.CatchTrackCoreEvents?.emit(
                'dependency:registered',
                {
                    moduleId,
                    dependencies: [...requiredModules]
                }
            );
        },

        unregister(moduleId) {
            this.validateModuleId(moduleId);

            return dependencies.delete(moduleId);
        },

        get(moduleId) {
            this.validateModuleId(moduleId);

            return dependencies.has(moduleId)
                ? [...dependencies.get(moduleId)]
                : [];
        },

        has(moduleId) {
            this.validateModuleId(moduleId);

            return dependencies.has(moduleId);
        },

        getAll() {
            return Object.fromEntries(
                Array.from(dependencies.entries()).map(
                    ([moduleId, requiredModules]) => [
                        moduleId,
                        [...requiredModules]
                    ]
                )
            );
        },

        validate(moduleId) {
            this.validateModuleId(moduleId);

            const requiredModules = this.get(moduleId);

            return requiredModules.every((dependencyId) => {
                return window.CatchTrackCore?.getModule(
                    dependencyId
                ) !== null;
            });
        },

        validateModuleId(moduleId) {
            if (
                typeof moduleId !== 'string' ||
                !moduleId.trim()
            ) {
                throw new Error('Module ID is required.');
            }
        }
    };

    window.CatchTrackCoreDependencyManager =
        Object.freeze(DependencyManager);
})();