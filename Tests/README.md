# CatchTrack Test Suite

**Version:** 1.0  
**Status:** Aktiv  
**Rolle:** Unit- und Integrationstests

## Zweck

Der Test Runner bietet ein einfaches Test-Framework zur Validierung aller CatchTrack-Komponenten. Tests werden automatisch organisiert und können interaktiv ausgeführt werden.

## Test-Kategorien

### Core Module Tests
Validiert:
- Core-Komponente geladen
- Module Manager funktioniert
- Module Interface verfügbar

### User Module Tests
Validiert:
- User Module geladen
- Test-Benutzer existieren
- Authentifizierung funktioniert
- Benutzer-CRUD funktioniert

### Admin Module Tests
Validiert:
- Admin Module geladen
- System-Statistiken verfügbar
- Health Check funktioniert
- ErrorLog funktioniert

### Config Manager Tests
Validiert:
- Config Manager geladen
- Konfigurationen abrufbar
- Konfigurationen setzbar
- Pfad-basierter Zugriff funktioniert

### Service Manager Tests
Validiert:
- Service Manager geladen
- Services registriert
- User Service verfügbar
- Auth Service verfügbar

### Database Manager Tests
Validiert:
- Database Manager geladen
- IndexedDB funktioniert

## API

### `test(name, testFn)`
Registriert einen Test.

```javascript
TestRunner.test('Example test', function() {
    this.assertEqual(1, 1, 'Numbers should match');
});
```

### `describe(suiteName, suiteFn)`
Registriert einen Test-Satz.

```javascript
TestRunner.describe('Core Tests', function() {
    TestRunner.test('First test', function() { ... });
    TestRunner.test('Second test', function() { ... });
});
```

### Assertions

- `assertEqual(actual, expected, message)` - Gleichheit prüfen
- `assertTrue(value, message)` - Wahr prüfen
- `assertFalse(value, message)` - Falsch prüfen
- `assertDefined(value, message)` - Definiert prüfen
- `assertExists(value, message)` - Existenzen prüfen

### `run()`
Führt alle Tests aus.

```javascript
const results = await TestRunner.run();
```

**Rückgabe:**
```javascript
{
    total: number,      // Gesamtanzahl Tests
    passed: number,     // Bestandene Tests
    failed: number,     // Fehlgeschlagene Tests
    errors: array       // Fehlerdetails
}
```

### `getResults()`
Gibt die letzten Test-Ergebnisse zurück.

## Siehe auch

Siehe `Tests/test-runner.js` für vollständige Dokumentation.
