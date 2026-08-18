# Developer-Referenz — Neutral Framework

Dieses Dokument ist die implementierungsbasierte Referenz für Entwickler und AI-Agenten in diesem Repository.  
Es beschreibt das **Neutral Framework** so, wie es aktuell im Code umgesetzt ist.

---

## A) Was dieses Framework ist

### Zweck
- Bereitstellung eines wiederverwendbaren **Core Frameworks** für browserbasierte Host-Anwendungen.
- Trennung technischer Runtime-Aufgaben (Startup, Lifecycle, Modul-Laden, Auth/Access/Audit, Storage, Diagnostik) vom Fachcode.
- Fach-/Domänenlogik bleibt in **Application Modules**, die vom Core geladen werden.

### Architekturgrenzen
- **Core Framework** (`platform/` + Runtime-Verdrahtung in `webroot/` + Server-Bausteine in `server/`):
  - Runtime, Lifecycle, Modulsystem, Event-Bus, Security-Helfer, Persistenzabstraktion, Auth/Access/Audit/User/Admin-Dienste.
- **Host-Application-Ebene** (`webroot/`, `app/`):
  - UI-Shells und Feature-Module.
- **Feature Modules** (`app/modules/*`):
  - Unabhängige Funktionsmodule mit eigenem Manifest und Entry-Implementierung.

### Grundprinzipien
- Modulorientierte Architektur.
- Ereignisgetriebene Koordination.
- Zentrale Runtime-Wahrheit für Auth/Session/Access.
- Begrenzte In-Memory-Diagnostik plus lokale Persistenz.
- Neutraler Core ohne Domänenkopplung.

---

## B) Wie der Core funktioniert

### Core Runtime / Context / Startup / Loader
- `CoreEntry.start()` ruft `CoreRuntime.start()` auf.
- `CoreRuntime.start()` delegiert den Start an `CoreStartup.start()` und setzt danach den Lifecycle auf `READY` und `RUNNING`.
- `CoreStartup.start()` prüft Pflichtkomponenten, initialisiert Manager/Services und startet Modul-Discovery/Aktivierung.
- `CoreLoader` validiert die Core-Komponenten und bietet Discovery/Laden externer Module aus Manifesten/Skripten.
- `CoreContext` hält gemeinsamen Laufzeitkontext (`application`, `runtime`, `environment`) inkl. Online/Offline-Updates.

### Lifecycle
- `CoreLifecycle`-Phasen: `created -> initializing -> ready -> running -> stopped`.
- Ungültige Transitionen werfen explizite Fehler.

### Module Registry / Module Manager
- `ModuleRegistry` verwaltet Module (`register/get/getAll/unregister/has/clear`), führt Discovery aus und normalisiert Manifest-Metadaten.
- `ModuleManager` steuert den Modul-Lifecycle:
  - `register`, `install`, `initialize`, `enable`, `disable`, `update`, `uninstall`
  - Abhängigkeitsprüfung vor Lifecycle-Schritten
  - Core-Events (`module:registered`, `module:activated` usw.)

### Konfiguration
- Statische Core-Konfiguration in `core-config.js` (`application` + `core` Versionsangaben).
- Dynamische Runtime-Konfiguration über `ConfigManager`:
  - Konfigurationsbereiche (`app`, `bootstrap`, `database`, `api`, `modules`, `security`, `performance`, `ui`, `features`)
  - Watch/Notify, Merge, lokale Persistenz-Hooks.

### Server und API
- Node-HTTP-Server in `server/bootstrap/server.js`.
- API-Endpunkte:
  - `/health`, `/api/health`
  - `/api/status`
  - `/api/modules` (manifestbasierte Modulauflistung aus `app/modules/*`)
- Statische Auslieferung:
  - `webroot/` Assets
  - `platform/` Dateien
  - `app/modules/` Dateien
- Schutz für Admin/Dev-Seiten über `ADMIN_ACCESS_TOKEN` und Header `x-admin-access-token` vor Auslieferung von `admin.html` und `dev.html`.

### Webroot und Admin-/Developer-Schnittstellen
- `index.html`: Host-Shell für den User-App-Kontext.
- `admin.html`: Administrations-Shell.
- `dev.html`: Developer-/Diagnostik-Shell.
- `master-ui.js` + `user-app.js` rendern kontextabhängig und binden Runtime/Module/Auth-Services an.

---

## C) App-/Modul-Architektur

### Erforderliche Modulstruktur
Jedes **Application Module** sollte enthalten:
1. Modulordner unter `app/modules/<module-id>/`
2. Manifestdatei (`module.json` oder `manifest.json`)
3. Entry-Skript (Standard `index.js`, oder `entry`/`main` aus Manifest)
4. Globales Modulobjekt (über Manifest/Globalname auflösbar)

### Manifest-Anforderungen
- Pflicht: `id`
- Typische Felder:
  - `name`, `version`, `type`, `description`
  - `entry` oder `main`
  - `dependencies`, `permissions`, `capabilities`
  - optional `globalName`, `autoload`, `lifecycle`

### Registrierung und Laden
- Module können entdeckt werden über:
  - `window.FrameworkModuleCatalog`
  - Server/Katalogquellen (`/api/modules`, optionale Manifest-Indexdateien)
  - Dateisystem-Scan (`app/modules/*`) in Node-fähiger Runtime.
- `ModuleInterface.validateManifest()` normalisiert Metadaten.
- `ModuleManager.discoverModules()` registriert Module und versucht `install/initialize/enable`.

### Modul-Lifecycle
- Available -> Installed -> Enabled -> Disabled (bei Uninstall zurück auf Available).
- Unterstützte Schritte:
  - Installation
  - Initialisierung
  - Aktivierung/Enable
  - Deaktivierung/Disable
  - Update
  - Entfernung/Uninstall

### Erlaubte Core-Services für Module
Module dürfen stabile Core-Interfaces verwenden, z. B.:
- `CoreEventBus` / `Core.emit`
- `CoreStorage`
- `DatabaseManager`
- `CoreAuth`, `CoreAccess`, `CoreAudit`
- `ConfigManager`
- `ModuleManager`, `ModuleRegistry` (falls erforderlich)

### Abhängigkeitsregeln
Erlaubt:
- explizite Manifest-Abhängigkeiten zwischen Modulen
- technische Abhängigkeiten auf stabile Core-Interfaces

Zu vermeiden:
- implizite Cross-Module-Kopplung
- versteckte globale Annahmen ohne Manifestdeklaration
- Verschiebung von Host-/Fachlogik in den neutralen Core
- direkte Mutation fremder Core-Interna

---

## D) Isolation

### App-Kontext
- User-App (`index.html` + `user-app.js`) ist von Admin-/Developer-Flächen getrennt.
- Admin-/Developer-Seiten haben eigene Einstiegskontexte und Access-Checks.

### Connection-/Service-Scope
- Runtime-Services sind zentral, aber nur über definierte APIs nutzbar.
- Auth/Access/Audit sind Single Source of Truth statt paralleler Schattenzustände.

### Daten-/Storage-Trennung
- Persistente technische Daten:
  - IndexedDB via `DatabaseManager` Stores (`users`, `modules`, `logs`, `sessions`, `settings`, `cache`, `sync`)
  - `CoreStorage` für namespacete localStorage-Werte (`core:*`)
- Moduldaten sollen modulspezifisch und nicht-invasiv bleiben.

### API- und Sicherheitsgrenzen
- Server blockiert Directory Traversal über sichere Pfadauflösung.
- Admin-/Dev-Seiten erfordern serverseitigen Token-Check vor Auslieferung.
- `CoreSecurity` übernimmt Sanitizing, Origin-Checks sowie Token-/Hash-Helfer.

### Cross-App-Abhängigkeiten
- Keine unkontrollierten Cross-App-Abhängigkeiten.
- Intermodulabhängigkeiten müssen explizit deklariert und geprüft werden.

---

## E) GPS-Modul im Framework

### Rolle
- `app/modules/gps` ist ein eigenständiges **Feature Module** als neutrales Funktionsmodul.

### Schnittstelle und Funktionsweise
- Manifestbasiertes Modul (`module.json`) mit `id: gps`, Capabilities und Entry.
- Exponiert Lifecycle-Methoden (`install`, `initialize`, `enable`, `disable`, `uninstall`).
- Implementiert:
  - einmalige Geolokalisierung
  - watch-basiertes Start/Stop-Tracking
  - Statusabfragen
  - User-UI-Rendering (`renderUserInterface`)

### Verwendete Core-Dienste
- `CoreStorage` für letzte Position
- `DatabaseManager` (`sync`-Store) für persistente Positionsdaten
- `CoreAudit` für Audit-Einträge
- `CoreEventBus` für GPS-Events

### Bewusste Unabhängigkeit
- Das GPS-Modul bleibt neutral und wiederverwendbar.
- Keine feste Kopplung an einen konkreten Fachworkflow.

---

## F) Design / Theme-System

### Neutrales Standard-Theme
- Das Basistheme liegt in `webroot/style.css`.
- Enthält generische Styling-/Layout-Bausteine für Admin, Developer und User.

### Trennung Core vs App-Design
- Core-Runtime-Logik liegt in `platform/`.
- App-Präsentation liegt in `webroot/` Skripten/Styles.
- Modul-UI (z. B. GPS) rendert in definierte User-App-Container.

### Integration späterer App-Designs
- Neutrale Framework-Defaults beibehalten.
- App-spezifische Themes additiv integrieren (eigene CSS-Layer/Scoped Overrides).
- Für reine Designänderungen keine Core-Runtime- oder Modulinfrastruktur ersetzen.

---

## G) Verbindlicher Ablauf für neue Module

Vor Integration in eine fachliche Host-Anwendung:

1. Anforderungen definieren.
2. Modulgrenzen festlegen (Technik-, Daten-, UI-Scope).
3. Wiederverwendbare Core-Schnittstellen zuerst prüfen.
4. Modulordner, Manifest und Entry-Implementierung erstellen.
5. In Registry/Discovery integrieren.
6. Abhängigkeiten deklarieren und auf versteckte Kopplung prüfen.
7. Isolation prüfen (Storage, API-Nutzung, Cross-Module-Verhalten).
8. Runtime-Lifecycle Ende-zu-Ende validieren.
9. Host-Integration validieren (User/Admin/Dev bei Bedarf).
10. Erst danach an konkrete Fachlogik der Host-Anwendung anbinden.

---

## H) AI-/Agenten-Regeln

Jeder AI-Agent in diesem Repository soll folgende Regeln einhalten:

- Erst bestehende Architektur lesen, dann ändern.
- Aktuelle Implementierung vor alten Dokumenten priorisieren.
- Vorhandene Core-Strukturen nicht ohne zwingenden Grund ersetzen.
- Keine Fach-/Domänenlogik in den neutralen Core verschieben.
- Keine neuen globalen Abhängigkeiten ohne klare technische Begründung.
- Bestehende Isolation respektieren (Kontext, Storage, Module, API, Security).
- Module eigenständig und klar abgegrenzt implementieren.
- Bestehende Schnittstellen vor Neuerfindung wiederverwenden.
- Änderungen klein, nachvollziehbar und reviewbar halten.
- Runtime-Lifecycle und Modul-Ladeverhalten erhalten.

---

## I) Übergabe an externe Entwickler

Für sichere Weiterentwicklung:

1. Mit dieser Referenz starten und Details direkt im Code verifizieren.
2. `platform/` als technischen Core behandeln; Fachlogik außerhalb halten.
3. Features als modulare Application Modules mit expliziten Manifesten umsetzen.
4. Modul-Lifecycle und Core-Services nutzen statt diese zu umgehen.
5. Sicherheits- und Isolationsgarantien bei Erweiterungen konsequent erhalten.

Diese Referenz ist absichtlich neutral, damit sie von mehreren Host-Anwendungen ohne architektonische Umbenennung oder Umstrukturierung genutzt werden kann.

