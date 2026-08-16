# Web-App-Framework – WORKFLOW

## Zweck

Dieses Repository stellt ein **neutrales, wiederverwendbares technisches Web-App-Grundgerüst** bereit.
Es enthält keine anwendungsspezifische Fachlogik.
Es dient als technische Basis für beliebige Web-Applikationen.

---

## Architekturübersicht

```
/
├── Core/                  Platform-Kern (Bootstrap, Runtime, Lifecycle, State, Storage,
│                           Config, Database, Service, Event, Module, Security, Auth,
│                           Access, Audit, User, I18n, Error Handling)
├── tests/                 Automatisierte Tests (unit + e2e)
├── index.html             Einstiegspunkt Web-UI
├── admin.html             Admin-Oberfläche
├── dev.html               Developer-/Diagnose-Oberfläche
├── style.css              Gemeinsames Stylesheet
├── package.json           Node.js-Projektdatei
├── .env.example           Umgebungsvariablen-Vorlage
└── WORKFLOW.md            Diese Steuerdatei (einzige zentrale Arbeitsanweisung)
```

### Schichtenmodell

| Schicht        | Verzeichnis / Dateien        | Beschreibung                              |
|----------------|------------------------------|-------------------------------------------|
| Platform/Core  | `Core/`                      | Framework-Kern; keine Fachmodule          |
| Server         | `Core/app.js`, `core-entry.js` | HTTP-Server-Bootstrap                   |
| Webroot/App    | `index.html`, `style.css`    | Frontend-Einstiegspunkt                   |
| Administration | `admin.html`                 | Eigenständige Admin-UI                    |
| Konfiguration  | `.env.example`, `Core/core-config.js` | Umgebungs- und Laufzeitkonfiguration |
| Module         | Optionale Erweiterungen      | Untereinander unabhängige Fachmodule      |

---

## Core-Komponenten

| Datei                    | Aufgabe                                    |
|--------------------------|--------------------------------------------|
| `core-entry.js`          | Startpunkt; initialisiert den Core         |
| `core.js`                | Haupt-Core-Export                          |
| `core-startup.js`        | Start-Sequenz                              |
| `core-shutdown.js`       | Geordnetes Herunterfahren                  |
| `core-lifecycle.js`      | Lifecycle-Management (start/stop/restart)  |
| `core-runtime.js`        | Laufzeit-Kontext                           |
| `core-context.js`        | Anwendungskontext                          |
| `core-state.js`          | Globales State-Management                  |
| `core-storage.js`        | Persistenz-Abstraktion                     |
| `core-config.js`         | Konfigurationsverwaltung                   |
| `config-manager.js`      | Config-Manager                             |
| `database-manager.js`    | Datenbank-Abstraktion                      |
| `service-manager.js`     | Service-Registry                           |
| `core-event-bus.js`      | Interner Event-Bus                         |
| `core-event-ring.js`     | Zirkulärer Event-Buffer                    |
| `module-interface.js`    | Modul-Interface-Spezifikation              |
| `module-registry.js`     | Modul-Registry                             |
| `module-manager.js`      | Modul-Lifecycle-Manager                    |
| `core-loader.js`         | Dynamischer Modul-Loader                   |
| `core-auth.js`           | Authentifizierung                          |
| `core-access.js`         | Zugriffssteuerung (RBAC)                   |
| `core-admin.js`          | Admin-Funktionen                           |
| `core-user.js`           | Benutzerverwaltung                         |
| `core-audit.js`          | Audit-Log                                  |
| `security.js`            | Sicherheits-Utilities                      |
| `core-i18n.js`           | Internationalisierung                      |
| `core-error-handler.js`  | Zentrales Fehler-Handling                  |
| `error-log.js`           | Fehler-Log                                 |
| `app.js`                 | Express/HTTP-App-Konfiguration             |

---

## Arbeitsregeln

1. **WORKFLOW.md** ist die einzige zentrale Steuerdatei.
2. Keine projekttspezifische Fachlogik im Core.
3. Keine Core-Änderung ohne ausdrückliche Architekturentscheidung.
4. Fachmodule bleiben optional und voneinander unabhängig.
5. Vor jedem Commit: Syntax-Prüfung und vorhandene Tests ausführen.
6. Jeder Push wird mit `git fetch origin` und Remote-Vergleich verifiziert.

---

## Entwicklungsablauf

```bash
# Abhängigkeiten installieren
npm install

# Core starten
node Core/core-entry.js

# Tests ausführen
npm run test:core     # Unit-Tests
npm run test:ui       # Playwright-E2E-Tests
npm test              # alle Tests
```

---

## cPanel-Deployment

Für den Transfer auf einen cPanel-Server:

1. `npm install --omit=dev` ausführen.
2. Folgende Verzeichnisse/Dateien in ein ZIP packen:
   - `Core/`
   - `index.html`, `admin.html`, `dev.html`, `style.css`
   - `package.json`
   - `.env` (lokal erzeugt aus `.env.example`)
3. ZIP auf den Server übertragen und dort entpacken.
4. In der cPanel-Node.js-Konfiguration als Startdatei `Core/core-entry.js` eintragen.

Keine Abhängigkeit von GitHub, Codespace oder CI/CD für den Betrieb.

---

## Modulerweiterung

Neue Fachmodule implementieren das `module-interface.js`-Interface:

```js
module.exports = {
  name: 'mein-modul',
  version: '1.0.0',
  init(core) { /* ... */ },
  start() { /* ... */ },
  stop() { /* ... */ }
};
```

Registrierung über `ModuleRegistry.register(modul)` vor dem Core-Start.

---

## Git-Regeln

- Branch: `copilot/arbeitsauftrag-bearbeitung`
- Nach jeder Änderung: commit → push → `git fetch origin` → Remote-Stand prüfen.
- Commit-Nachrichten auf Englisch, beschreibend.
- Keine Workflow-Datei referenzieren, die nicht im Repository vorhanden ist.

---

## Status

| Punkt                         | Status   |
|-------------------------------|----------|
| Alte Auftragsdateien entfernt | ✓        |
| Framework neutral             | ✓        |
| Core vollständig               | ✓        |
| Tests vorhanden               | ✓        |
| cPanel-Deployment-Vorbereitung | ✓        |
