# SERVER-APPLICATION-GUIDE

## 1. Zweck dieses Guides

Dieser Guide erklaert auf Basis des aktuellen Codezustands, wie eine fertige Anwendung auf dem neutralen Framework bereitgestellt, gestartet, aufgerufen und mit Modulen betrieben wird.

Er beschreibt nur die tatsaechlich vorhandenen Bestandteile in:

- [app/](/workspaces/CatchTrack-V.1.0/app)
- [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- [platform/](/workspaces/CatchTrack-V.1.0/platform)
- [server/](/workspaces/CatchTrack-V.1.0/server)
- [config/](/workspaces/CatchTrack-V.1.0/config)
- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [package.json](/workspaces/CatchTrack-V.1.0/package.json)

Es werden keine nicht vorhandenen APIs, Mount-Systeme oder Multi-App-Funktionen vorausgesetzt.

---

## 2. Voraussetzungen

### 2.1 Laufzeit

Erforderlich sind:

- Node.js
- npm

### 2.2 Projektdateien

Fuer den aktuellen Stand werden mindestens benoetigt:

- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)
- [server/](/workspaces/CatchTrack-V.1.0/server)
- [platform/](/workspaces/CatchTrack-V.1.0/platform)
- [app/](/workspaces/CatchTrack-V.1.0/app)
- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)

### 2.3 Konfiguration

Der aktuelle Code nutzt Defaults aus:

- [config/index.js](/workspaces/CatchTrack-V.1.0/config/index.js)
- [server/config/index.js](/workspaces/CatchTrack-V.1.0/server/config/index.js)
- [.env.example](/workspaces/CatchTrack-V.1.0/.env.example)

Relevante Umgebungsvariablen:

- `PORT`
- `HOST`
- `NODE_ENV`
- `DEFAULT_APP_ID`
- `ADMIN_ACCESS_TOKEN` fuer direkten Zugriff auf [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html) und [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- `CORE_BOOTSTRAP_PASSWORD` als moegliche Quelle fuer das Developer-Login in [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js)
- `FEATURE_FLAG_NEW_SYNC_ENGINE`, `FEATURE_FLAG_BETA_ADMIN`

### 2.4 Neutrales Master-Framework
Das Framework stellt ebenfalls grundsaetzliche, app-neutrale Strukturen bereit:
- `MasterFramework` registriert Apps, Connections, Feature Flags und Migrations.
- `AppRegistry` und `ConnectionManager` werden durch den Server als diagnostische Endpunkte bereitgestellt.
- `GET /api/framework` und `GET /api/diagnostics` liefern die laufenden Framework-Statuswerte.
- `GET /api/connections` listet alle definierbaren Verbindungen nach `appId` und `connectionId`.

---

## 3. Projektstruktur

### 3.1 [platform/](/workspaces/CatchTrack-V.1.0/platform)

Enthaelt den neutralen technischen Core:

- Runtime
- Lifecycle
- Loader
- Registry
- Module Manager
- Storage
- Database
- Auth
- Access
- Audit
- Event-System
- Services
- Security

### 3.2 [server/](/workspaces/CatchTrack-V.1.0/server)

Enthaelt den Node.js-Webserver:

- [server/server.js](/workspaces/CatchTrack-V.1.0/server/server.js)
- [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- [server/config/index.js](/workspaces/CatchTrack-V.1.0/server/config/index.js)
- [server/api/](/workspaces/CatchTrack-V.1.0/server/api)
- [server/services/](/workspaces/CatchTrack-V.1.0/server/services)

### 3.3 [app/](/workspaces/CatchTrack-V.1.0/app)

Enthaelt die anwendungsnahe Schicht:

- [app/index.js](/workspaces/CatchTrack-V.1.0/app/index.js) als kleines `appShell`
- [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules) fuer zusaetzliche Module

### 3.4 [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)

Enthaelt modulare Erweiterungen. Aktuell vorhanden:

- [app/modules/gps/](/workspaces/CatchTrack-V.1.0/app/modules/gps)

### 3.5 [webroot/](/workspaces/CatchTrack-V.1.0/webroot)

Enthaelt die statischen Frontend-Dateien:

- [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html)
- [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html)
- [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
- [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
- [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css)

### 3.6 [config/](/workspaces/CatchTrack-V.1.0/config)

Enthaelt allgemeine Projekt-Defaults wie:

- `environment`
- `port`
- `host`
- Standardpfade

---

## 4. Installation

### 4.1 Projekt bereitstellen

Das Repository muss lokal vorhanden sein.

### 4.2 Dependencies installieren

Der aktuelle Projektstand deklariert keine externen npm-Abhaengigkeiten. Der Standardbefehl ist trotzdem:

```bash
npm install
```

Im aktuellen Zustand fuehrt das im Wesentlichen nur die Lockfile-basierte Grundinstallation ohne Zusatzpakete aus.

### 4.3 Konfiguration pruefen

Defaults:

- `PORT`: `3000`
- `HOST`: `127.0.0.1`
- `NODE_ENV`: `development`
- `apiBase`: `/api`

Diese Defaults sind in [server/config/index.js](/workspaces/CatchTrack-V.1.0/server/config/index.js) definiert.

### 4.4 Module pruefen

Pruefen, dass jedes Modul unter [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules):

- ein Unterordner ist
- `module.json` oder `manifest.json` besitzt
- ein passendes Entry-Skript besitzt

---

## 5. Server-Konfiguration

### 5.1 Aktuelle Server-Defaults

Aus [server/config/index.js](/workspaces/CatchTrack-V.1.0/server/config/index.js):

- Port: `3000`
- Host: `127.0.0.1`
- Root-Verzeichnis: Repository-Root
- Webroot: [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- API-Basis: `/api`

### 5.2 Weitere Projekt-Defaults

Aus [config/index.js](/workspaces/CatchTrack-V.1.0/config/index.js):

- `environment`
- `port`
- `host`
- `platformPath`
- `appPath`
- `webrootPath`
- `testsPath`

Diese Datei wird vom aktuellen Startpfad nicht direkt fuer das HTTP-Binding verwendet; die operative Server-Konfiguration stammt aus [server/config/index.js](/workspaces/CatchTrack-V.1.0/server/config/index.js).

### 5.3 Administrative Zusatzabsicherung

Direkte Requests an:

- `/admin.html`
- `/dev.html`

werden im Server nur ausgeliefert, wenn:

- `ADMIN_ACCESS_TOKEN` gesetzt ist
- der Request-Header `x-admin-access-token` denselben Wert traegt

Ohne diese Kombination liefert der Server `403 FORBIDDEN` als JSON.

---

## 6. Serverstart

### 6.1 Exakter Startbefehl

Der vorhandene Startbefehl aus [package.json](/workspaces/CatchTrack-V.1.0/package.json) ist:

```bash
npm start
```

Dieser ruft auf:

```bash
node server/server.js
```

### 6.2 Erwartetes Verhalten

Beim direkten Start gibt [server/server.js](/workspaces/CatchTrack-V.1.0/server/server.js) eine Meldung der Form aus:

```text
Neutral platform server listening on http://127.0.0.1:3000
```

### 6.3 Health-Endpunkte

Vorhanden sind:

- `GET /health`
- `GET /api/health`
- `GET /api/status`

Implementierung:

- [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- [server/services/health-service.js](/workspaces/CatchTrack-V.1.0/server/services/health-service.js)

---

## 7. Webzugriff

### 7.1 Root

`/` wird auf [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html) aufgeloest.

### 7.2 API

Vorhandene API-Pfade:

- `/health`
- `/api/health`
- `/api/status`
- `/api/modules`
- `/api/setup/status`
- `/api/server/test`
- `/api/database/status`
- `/api/database/test`
- `/api/setup/activate`

### 7.3 Module-Dateien

Statisch auslieferbar unter:

- `/app/modules/<ordner>/...`

### 7.4 Platform-Dateien

Statisch auslieferbar unter:

- `/platform/...`

### 7.5 Admin- und Developer-Bereich

Dateien:

- [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html)
- [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)

Wichtige Realitaet:

- die Dateien existieren
- sie werden serverseitig durch `ADMIN_ACCESS_TOKEN` + `x-admin-access-token` geschuetzt
- ohne diesen Header sind sie ueber den Browser nicht normal oeffnbar

### 7.6 Unbekannte Routen

Aktuelles Verhalten:

- unbekannte statische Datei -> JSON `404`
- Directory-Traversal-Versuch -> JSON `403`

Es gibt keinen HTML-Frontend-Router mit eigener Fallback-Seite.

### 7.7 Erststart und Setup-Erkennung

Wenn der Framework-Setup-Status noch nicht auf `ACTIVE` steht, dient die Root-Route `/` automatisch der Erstinstallationsseite `setup.html` statt der normalen Benutzeroberfläche. Das ist eine technische Erststart-Erkennung auf Basis des vorhandenen Framework-Setup-State,

- `NOT_CONFIGURED`
- `CONFIGURATION_REQUIRED`
- `READY_TO_TEST`
- `TESTING`
- `READY`
- `ACTIVE`
- `ERROR`

Die zentrale Statuslogik bleibt im neutralen Framework; die Server-Route nutzt sie nur als Entscheidungsgrund.
Der Aktivierungsweg laeuft ueber `/api/setup/activate`, nachdem Server- und Datenbanktest sowie Framework-Initialisierung abgeschlossen sind.

### 7.8 Upload- und Laufzeitstruktur

Für einen typischen Webserver werden im Grundsatz nur die Projektdateien im Webroot-/Runtime-Bereich des Node-Projekts hochgeladen. Die Startdatei ist:

```bash
node server/server.js
```

Es dürfen keine Secrets, `.env`-Dateien, Logs, temporären Dateien oder Backups im öffentlichen Webbereich liegen. Der Browser darf nur das öffentliche Frontend, die API-Endpunkte und die statischen Ressourcen sehen, die im aktuellen Server-Setup zulässig sind.

---

## 8. Modulinstallation

### 8.1 Modul ablegen

Ein Modul wird als Unterordner in [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules) abgelegt:

```text
app/modules/<module-id>/
├── module.json
└── index.js
```

### 8.2 Manifest

Das Modul benoetigt:

- `module.json` oder `manifest.json`

Das aktuelle Referenzbeispiel ist:

- [app/modules/gps/module.json](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)

### 8.3 Registry und Discovery

Die Modul-Erkennung passiert in zwei Schritten:

1. der Server listet Manifeste ueber `/api/modules`
2. der Browser-Core laedt sie ueber [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js) und [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)

### 8.4 Validierung

Tatsaechlich geprueft werden:

- gueltiges JSON
- nicht-leere `id`
- lesbare Entry-Datei
- global auffindbares Modulobjekt auf `window`
- keine doppelte Modul-ID

Nicht vorhanden:

- kein `appId`
- kein `mountPath`
- keine Modul-API-Registrierung

### 8.5 Lifecycle beim Start

Bei erfolgreicher Discovery laeuft:

1. `register`
2. `install`
3. `initialize`
4. `enable`

### 8.6 Dependencies

Manifest-`dependencies` werden gegen registrierte Modul-IDs geprueft. Fehlende Dependencies fuehren im `ModuleManager` zu einem Fehler.

---

## 9. Neue Anwendung auf dem Framework

### 9.1 Aktuelle Architekturgrenze

Der aktuelle Codezustand ist technisch eine einzelne Anwendungsshell mit neutralem Core.

Nicht vorhanden sind:

- kein Multi-App-System
- kein `appId`
- kein App-Mount-Path-System
- keine App-Registry

### 9.2 Was fuer eine neue Anwendung typischerweise angepasst wird

Wenn eine neue Anwendung auf diesem Framework aufgebaut wird, betrifft das im aktuellen Stand typischerweise:

- [app/](/workspaces/CatchTrack-V.1.0/app)
- [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)

Der neutrale Core in [platform/](/workspaces/CatchTrack-V.1.0/platform) sollte dabei unveraendert bleiben, solange keine echte Framework-Erweiterung benoetigt wird.

### 9.3 Welche Angaben dafuer benoetigt werden

Mindestens:

- Anwendungszweck
- benoetigte Module/Funktionen
- UI-Bedarf
- Storage-/Database-Bedarf
- Permission-/Security-Bedarf

### 9.4 Mount Paths

Im aktuellen Code gibt es keinen App- oder Modul-`mountPath`.

Aktuelle Pfade sind fest:

- Root-UI unter `/`
- API unter `/api/...`
- Modul-Dateien unter `/app/modules/...`

---

## 10. Nutzung der Core-Funktionen

### 10.1 Storage

[platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js):

- `set`
- `get`
- `remove`
- `has`

### 10.2 Database

[platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js):

- IndexedDB-basiert
- Shared Stores
- keine modul-eigenen Stores

### 10.3 Events

[platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js):

- `subscribe`
- `unsubscribe`
- `publish`

[platform/core-event-ring.js](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js):

- diagnostischer Ring-Buffer

### 10.4 Services

[platform/service-manager.js](/workspaces/CatchTrack-V.1.0/platform/service-manager.js):

- `user`
- `auth`
- `module`
- `logging`
- `cache`

### 10.5 Security

- [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js)
- [platform/core-access.js](/workspaces/CatchTrack-V.1.0/platform/core-access.js)
- [platform/core-audit.js](/workspaces/CatchTrack-V.1.0/platform/core-audit.js)
- [platform/security.js](/workspaces/CatchTrack-V.1.0/platform/security.js)

### 10.6 Context

[platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js) ist der vorhandene gemeinsame Runtime-Kontext.

### 10.7 Connections

Ein separates Connection-System ist im aktuellen Code **nicht vorhanden**.

---

## 11. App-Isolation

Die aktuelle Isolation ist begrenzt:

- alle Module laufen im selben Browser-Kontext
- Storage und Database sind geteilt
- der Event-Bus ist geteilt
- `window` ist geteilt

Es gibt keine harte Sandbox pro Modul oder pro App.

Deshalb muss App-/Modul-Isolation durch saubere Benennung und Disziplin eingehalten werden:

- praefixte Keys
- praefixte Events
- keine globalen Clears
- keine verdeckten Cross-Modul-Zugriffe

---

## 12. Routing und Webserver-Anbindung

### 12.1 Server-Einstieg

- [server/server.js](/workspaces/CatchTrack-V.1.0/server/server.js)
- [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)

### 12.2 Statisches Serving

Der Server liefert aus:

- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [platform/](/workspaces/CatchTrack-V.1.0/platform)
- [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)

### 12.3 Modul-Routing

Nicht vorhanden:

- kein Modul-HTTP-Router
- kein Manifest-`mountPath`
- keine Modul-Backend-Route-Registrierung

---

## 13. Frontend- und Styling-Anbindung

### 13.1 Frontend-Einbindung

Die Root-Seiten laden Core-Skripte direkt per `<script>`:

- [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html)
- [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html)
- [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)

### 13.2 Modul-UI

Die User-Shell nutzt [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js), um fuer aktive Module `renderUserInterface(container)` aufzurufen.

### 13.3 Styling

Zentrale Styles liegen in [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css).

Nicht vorhanden:

- keine modul-lokale CSS-Registrierung
- kein automatischer Theme-Mount pro Modul

### 13.4 Branding und Neutralitaet

Der neutrale Core darf nicht mit Fachlogik oder app-spezifischem Branding vermischt werden.

---

## 14. Fehlerbehebung

### 14.1 Server startet nicht

Pruefen:

- Node.js vorhanden
- `npm start` im Repository-Root ausgefuehrt
- `PORT`/`HOST` gueltig

### 14.2 Modul wird nicht erkannt

Pruefen:

- Unterordner unter [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules) vorhanden
- `module.json` oder `manifest.json` vorhanden
- `id` gesetzt
- Entry-Datei vorhanden
- globales Modulobjekt wird auf `window` erzeugt

### 14.3 `module.json` ungueltig

Folge im aktuellen Code:

- Modul wird still uebersprungen
- `/api/modules` listet es nicht

### 14.4 Falscher Mount Path

Es gibt im aktuellen Code keinen unterstuetzten Modul-`mountPath`.

Wenn ein Modul darauf basiert, ist die Annahme falsch.

### 14.5 Dependency fehlt

Folge:

- `ModuleManager.validateDependencies` wirft Fehler

### 14.6 API nicht erreichbar

Pruefen:

- Server laeuft
- richtige Route genutzt
- fuer Modul-spezifische Backend-API gilt: sie existiert im aktuellen Framework standardmaessig nicht

### 14.7 Permission-/Security-Fehler

Pruefen:

- aktueller Benutzer in `CoreAuth`
- Rollen/Permissions in `CoreAccess`
- bei `/admin.html` und `/dev.html` den Server-Header-Schutz

### 14.8 Unbekannte Route

Aktuelles Verhalten:

- JSON `404` `NOT_FOUND`

---

## 15. Minimaler Betriebsablauf

1. Repository bereitstellen
2. optional `npm install` ausfuehren
3. Konfiguration pruefen
4. `npm start` ausfuehren
5. `GET /health` oder `GET /api/health` pruefen
6. `GET /api/modules` pruefen
7. Anwendung unter `/` oeffnen
8. Modulverhalten im Browser pruefen

---

## 16. Uebergabe an einen Entwickler

Fuer die Uebergabe werden mindestens benoetigt:

- das vollstaendige Repository
- Node.js- und npm-Hinweis
- Startbefehl `npm start`
- relevante Umgebungsvariablen:
  - `PORT`
  - `HOST`
  - `NODE_ENV`
  - `ADMIN_ACCESS_TOKEN`
  - optional `CORE_BOOTSTRAP_PASSWORD`
- Beschreibung vorhandener Module unter [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- Hinweis, dass Admin-/Developer-Seiten serverseitig zusaetzlich abgesichert sind
- Hinweis, dass es kein `appId`-, `mountPath`- oder Connection-System gibt

---

## 17. Backup-Hinweis

Backups gehoeren nicht zum Runtime-Projekt.

Backup-Dateien, ZIP-Dateien und sonstige Archiv-Artefakte:

- werden nicht vom Server verwendet
- gehoeren nicht zur Modul-Discovery
- gehoeren nicht zum neutralen Framework
- sollen nur ausserhalb des Git-Repositories erstellt und verwaltet werden
