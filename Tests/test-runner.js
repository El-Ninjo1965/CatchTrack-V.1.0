/*
 * CatchTrack Test Suite
 * Version: 1.0
 *
 * Vereinfachtes Test-Framework für die CatchTrack-Anwendung.
 * Führt Unit- und Integrationstests durch.
 */

(() => {
    'use strict';

    const TestRunner = {
        tests: [],
        results: {
            total: 0,
            passed: 0,
            failed: 0,
            errors: []
        },

        /**
         * Registriert einen Test
         * @param {string} name - Testname
         * @param {function} testFn - Test-Funktion
         */
        test(name, testFn) {
            this.tests.push({ name, testFn });
        },

        /**
         * Registriert einen Test-Satz
         * @param {string} suiteName - Name des Test-Satzes
         * @param {function} suiteFn - Funktion mit Tests
         */
        describe(suiteName, suiteFn) {
            const originalTests = this.tests.length;
            suiteFn();
            const newTests = this.tests.slice(originalTests);

            newTests.forEach(test => {
                test.name = `${suiteName} > ${test.name}`;
            });
        },

        /**
         * Assertion: gleich
         */
        assertEqual(actual, expected, message) {
            if (actual !== expected) {
                throw new Error(
                    `Assertion failed: ${message || ''}\n` +
                    `Expected: ${expected}, Got: ${actual}`
                );
            }
        },

        /**
         * Assertion: wahr
         */
        assertTrue(value, message) {
            if (value !== true) {
                throw new Error(`Assertion failed: ${message || 'Expected true'}`);
            }
        },

        /**
         * Assertion: falsch
         */
        assertFalse(value, message) {
            if (value !== false) {
                throw new Error(`Assertion failed: ${message || 'Expected false'}`);
            }
        },

        /**
         * Assertion: definiert
         */
        assertDefined(value, message) {
            if (value === undefined) {
                throw new Error(`Assertion failed: ${message || 'Expected defined value'}`);
            }
        },

        /**
         * Assertion: existiert
         */
        assertExists(value, message) {
            if (!value) {
                throw new Error(`Assertion failed: ${message || 'Expected value to exist'}`);
            }
        },

        /**
         * Führt alle Tests aus
         * @returns {Promise}
         */
        async run() {
            console.log('[Test Suite] Starte Tests...\n');

            this.results = { total: 0, passed: 0, failed: 0, errors: [] };

            for (const test of this.tests) {
                this.results.total++;

                try {
                    await test.testFn.call(this);
                    this.results.passed++;
                    console.log(`✓ ${test.name}`);
                } catch (error) {
                    this.results.failed++;
                    this.results.errors.push({
                        test: test.name,
                        error: error.message
                    });
                    console.error(`✗ ${test.name}\n  ${error.message}`);
                }
            }

            console.log('\n[Test Suite] Zusammenfassung:');
            console.log(`  Gesamt: ${this.results.total}`);
            console.log(`  Bestanden: ${this.results.passed}`);
            console.log(`  Fehlgeschlagen: ${this.results.failed}`);
            console.log(`  Erfolgsquote: ${Math.round((this.results.passed / this.results.total) * 100)}%\n`);

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('tests:completed', this.results);
            }

            return this.results;
        },

        /**
         * Gibt die Test-Ergebnisse zurück
         */
        getResults() {
            return this.results;
        }
    };

    // Registriere Tests
    TestRunner.describe('Core Module', function() {
        TestRunner.test('Core sollte geladen sein', function() {
            this.assertExists(window.CatchTrackCore, 'Core nicht gefunden');
        });

        TestRunner.test('Module Manager sollte geladen sein', function() {
            this.assertExists(window.CatchTrackModuleManager, 'Module Manager nicht gefunden');
        });

        TestRunner.test('Module Interface sollte geladen sein', function() {
            this.assertExists(window.CatchTrackModuleInterface, 'Module Interface nicht gefunden');
        });
    });

    TestRunner.describe('User Module', function() {
        TestRunner.test('User Module sollte geladen sein', function() {
            this.assertExists(window.CatchTrackUserModule, 'User Module nicht gefunden');
        });

        TestRunner.test('Test-Benutzer sollten existieren', function() {
            const users = window.CatchTrackUserModule.getAllUsers();
            this.assertTrue(users.length >= 2, 'Mindestens 2 Test-Benutzer erforderlich');
        });

        TestRunner.test('Authentifizierung sollte funktionieren', function() {
            const user = window.CatchTrackUserModule.authenticate('test-user-001');
            this.assertExists(user, 'Authentifizierung fehlgeschlagen');
            this.assertEqual(user.id, 'test-user-001', 'Benutzer-ID stimmt nicht überein');
        });

        TestRunner.test('getCurrentUser sollte authentifizierten Benutzer zurückgeben', function() {
            const current = window.CatchTrackUserModule.getCurrentUser();
            this.assertExists(current, 'Aktueller Benutzer nicht gefunden');
        });

        TestRunner.test('Benutzer erstellen sollte funktionieren', function() {
            const newUser = window.CatchTrackUserModule.createUser({
                name: 'Test User',
                email: 'test@catchtrack.local',
                role: 'user'
            });

            this.assertExists(newUser.id, 'Neue Benutzer-ID nicht generiert');
            this.assertEqual(newUser.name, 'Test User', 'Benutzername stimmt nicht überein');
        });
    });

    TestRunner.describe('Admin Module', function() {
        TestRunner.test('Admin Module sollte geladen sein', function() {
            this.assertExists(window.CatchTrackAdminModule, 'Admin Module nicht gefunden');
        });

        TestRunner.test('System-Statistiken sollten verfügbar sein', function() {
            const stats = window.CatchTrackAdminModule.getSystemStats();
            this.assertDefined(stats.moduleCount, 'moduleCount nicht definiert');
            this.assertDefined(stats.errorCount, 'errorCount nicht definiert');
        });

        TestRunner.test('Health Check sollte funktionieren', function() {
            const health = window.CatchTrackAdminModule.performHealthCheck();
            this.assertDefined(health.healthy, 'Health-Status nicht definiert');
            this.assertTrue(health.coreLoaded, 'Core sollte geladen sein');
        });

        TestRunner.test('ErrorLog sollte existieren', function() {
            const errors = window.CatchTrackAdminModule.getErrorLog();
            this.assertExists(errors, 'ErrorLog nicht gefunden');
        });
    });

    TestRunner.describe('Config Manager', function() {
        TestRunner.test('Config Manager sollte geladen sein', function() {
            this.assertExists(window.CatchTrackConfigManager, 'Config Manager nicht gefunden');
        });

        TestRunner.test('Konfiguration sollte abrufbar sein', function() {
            const appConfig = window.CatchTrackConfigManager.get('app');
            this.assertExists(appConfig, 'App-Konfiguration nicht gefunden');
            this.assertEqual(appConfig.name, 'CatchTrack', 'App-Name stimmt nicht überein');
        });

        TestRunner.test('Konfiguration sollte setzbar sein', function() {
            window.CatchTrackConfigManager.set('test-key', { value: 'test' });
            const config = window.CatchTrackConfigManager.get('test-key');
            this.assertExists(config, 'Konfiguration nicht gefunden');
            this.assertEqual(config.value, 'test', 'Konfigurationswert stimmt nicht überein');
        });

        TestRunner.test('Pfad-basierter Zugriff sollte funktionieren', function() {
            const dbType = window.CatchTrackConfigManager.getPath('database.type');
            this.assertEqual(dbType, 'indexeddb', 'Datenbank-Typ stimmt nicht überein');
        });
    });

    TestRunner.describe('Service Manager', function() {
        TestRunner.test('Service Manager sollte geladen sein', function() {
            this.assertExists(window.CatchTrackServiceManager, 'Service Manager nicht gefunden');
        });

        TestRunner.test('Services sollten registriert sein', function() {
            const services = window.CatchTrackServiceManager.getAll();
            this.assertTrue(services.length > 0, 'Keine Services registriert');
        });

        TestRunner.test('User Service sollte verfügbar sein', function() {
            const userService = window.CatchTrackServiceManager.get('user');
            this.assertExists(userService, 'User Service nicht gefunden');
        });

        TestRunner.test('Auth Service sollte verfügbar sein', function() {
            const authService = window.CatchTrackServiceManager.get('auth');
            this.assertExists(authService, 'Auth Service nicht gefunden');
        });
    });

    TestRunner.describe('Database Manager', function() {
        TestRunner.test('Database Manager sollte geladen sein', function() {
            this.assertExists(window.CatchTrackDatabaseManager, 'Database Manager nicht gefunden');
        });
    });

    if (!window.CatchTrackTestRunner) {
        window.CatchTrackTestRunner = Object.freeze(TestRunner);
    }
})();
