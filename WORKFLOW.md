# Workflow

- Ergebnis: Die bestehende Offline-First-Architektur wurde weiter stabilisiert, die sichtbare User-UI gemäß der neutralen Plattformanforderung korrigiert und die Admin-/GPS-Verwaltung realisiert.
- Entscheidungslog: `VISION.md` bleibt unverändert. Es wurden keine grundlegenden Neuarchitekturen eingeführt; die vorhandene Offline-First-Struktur wurde konsolidiert, die Auth-/Session-Abläufe, die app-übergreifende App-Identifikation und die Module-Management-UI in den bestehenden Rahmen integriert und dokumentiert.
- Architekturstatus:
  - Neutraler Core: stabilisiert.
  - Final Framework / App-UI / Admin-UI: stabilisiert und um echte Module-Verwaltungen erweitert.
  - Module-Registry und Module-Manager: aktiv und nutzbar.
  - Auth, Rollen, Berechtigungen und Developer-Bootstrap: stabilisiert.
  - Layout-/Theme-Management: stabil.
  - Medien-/Upload-Optimierung: validiert.
  - Offline/Online-Handling: lokal stabilisiert und für den internen Preview-Workflow nutzbar.
  - Marketplace/Advertising: bewusst offen gelassen; keine separate Produktfunktion.
  - Fachlich konkrete App-Logik: bewusst nicht im Core hardcodiert; sie bleibt neutral im Framework und in Modulen.
- Geregelte Anforderungen und Korrekturen:
  - App-Name zentralisiert: Der sichtbare Name wird aus der zentralen Konfiguration gelesen und nicht mehr lokal hart codiert.
  - Startseite neutral: Beim Aufruf von `webroot/index.html` erscheint keine „Modules“-Seite als Hauptinhalt; stattdessen eine neutrale Startseite mit öffnbaren Modulen.
  - Login-Button erhalten: Der normale Login-Einstieg bleibt in der Top-Right-Navigation erhalten.
  - Module als Navigation: Aktivierte Module werden als direkte Buttons dargestellt; technische Namen und sichtbare Namen sind getrennt.
  - GPS als sichtbarer Name: Das Modul wird als `GPS` dargestellt; die relevanten Buttons verwenden die konkreten Aktionen `Get Current Position`, `Start Tracking` und `Stop Tracking`.
  - GPS-Modul-Lebenszyklus: Das Modul bleibt ein echtes registriertes Modul und startet keine Geolocation-Trackings ohne expliziten Benutzerstart.
  - Offline-Login: Der lokale Developer-Setup und der Login-Flow verwenden denselben Hash-basierten persistenten Zustand unter `catchtrack.local.auth.v1`.
  - Keine Klartext-Passwörter: Legacy-Keys mit Klartext-Werten werden beim Setup/Migration nicht weiter verwendet.
  - Admin-Modul-Verwaltung: Module lassen sich über die Admin-Oberfläche aktivieren/deaktivieren; die GPS-Verwaltung nutzt die reale Geolocation-API.
  - Session-Schutz: Persistierte Sitzungen werden nur noch im vorhandenen Browser-Storage als gültig anerkannt und nicht in Nicht-Browser-Umgebungen missbraucht.
  - App-Isolation: Jede App besitzt jetzt einen eigenen Runtime-/Admin-Context, eigene Storage-Namespace und eigene aktive App-Auswahl, damit keine App über einen globalen Shared-State mit anderen Apps kollidiert.
  - App-Konfiguration im Admin: Der Admin kann jetzt aktive App, App-Name, Modus und Standard-Speicherstrategie direkt über ein CMS-artiges Konfigurationspanel setzen, statt das Framework per hardcoded Code zu ergänzen.
  - App-Name-Resolution: Die User-UI liest den sichtbaren App-Namen jetzt aus dem runtime-aktiven App-Kontext, sodass nach einem App-Wechsel im Admin die sichtbare Oberfläche konsistent zur gewählten App bleibt und nicht an einer veralteten Default-Konfiguration hängen bleibt.
  - Neutraler Default-Context: Die Laufzeit startet jetzt mit einem generischen `neutral-app`-Kontext statt einer festverdrahteten Retail- oder Produkt-ID. `Retail Demo` bleibt als Referenz-/Test-Template erhalten, ist aber keine Standard-App und keine zweite dauerhafte Parallel-Architektur.
  - Server-Bootstrap: Die Initialisierung verwendet jetzt einen pro-App-Setup-Flow statt hart codierter Global-Registrierungen; die aktive App wird nach Priorität des App-IDs-Setups initialisiert.
  - Generische Data-/Schema-Engine: Das Framework kann jetzt app-spezifische Entity-Schemata registrieren, Datensätze mit Validierung und Default-Werten erstellen, aktualisieren und löschen und diese Einträge über den vorhandenen Storage-Adapter persistent halten, damit spätere Module und Store-/App-Templates ohne Core-Rework entstehen können.
  - Admin-Data-UI: Im CMS-artigen Admin-Bereich existiert jetzt eine eigene "Data"-Ansicht, in der Schemata erstellt, Felder definiert, aktualisiert und Datensätze direkt im Rahmen der aktiven App verwaltet werden können.
  - Retail-Store-Template: Die Architektur wurde mit einem echten Store-Referenzmodell validiert. Das Template enthält Produkt-, Kategorie-, Kunden- und Bestell-Schemata, damit bewiesen wird, dass das neutrale Framework nicht nur für CatchTrack, sondern auch für ein echtes E-Commerce-Szenario geeignet ist.
  - Store-UI-Module: Die Store-Referenz ist jetzt nicht nur als Schema-Blueprint, sondern auch als echte Laufzeit-UI mit Modulen für Katalog, Bestellungen und Kunden validiert, damit die generische Daten-Engine im sichtbaren App-Workflow abgesichert ist.
  - Prüfungen:
  - `npm test` wurde erfolgreich ausgeführt.
  - Validiert wurden: Auth-Reload, lokale Hash-Speicherung, zentrale App-Name-Konfiguration, GPS-Modul-Lebenszyklus, Admin-Module-Verwaltung, GPS-Admin-Aktionen und UI-Seitendarstellung.
- Abschluss:
  - Der Repository-Stand ist für den aktuellen Vision-Zwischenstand konsistent und stabil.
  - Es liegen keine kritischen offenen Implementierungsblocker für den aktuellen Stand vor.
  - Die Worktree-Änderungen wurden dokumentiert und im aktuellen Arbeitsstand mit dem Git-Repository verbunden.
- Automatischer Commit-/Push- und Sync-Workflow:
  - Änderungen werden nach Validierung in den lokalen Git-Stand eingepflegt.
  - Die Workflow-Dokumentation wird mit den aktuellen Ergebnissen mitcommittet.
  - Danach wird der Branch an den GitHub-Remote synchronisiert.
  - Abschließend wird der lokale HEAD mit dem GitHub-Remote verglichen, damit die Synchronität verifiziert ist.

# Machbarkeitsprüfung: Server-/Admin-Anwendung für Neutral -> cPanel-meinServer

## IST-ZUSTAND

Der aktuelle Stand in `Neutral` zeigt bereits eine klare, technisch machbare Grundlage:

- Das Repository ist ein Node.js-Projekt mit CommonJS-Setup (`package.json`), ohne deploy-spezifische Produktiv-Umgebung.
- Es existiert ein Server-Startpunkt in `server/server.js`, der über `server/bootstrap/server.js` läuft.
- Eine Framework-Kernschicht liegt in `platform/` und kümmert sich um App-Registrierung, Module, Rollen, Permissions, Storage, Admin-Context und Laufzeitstatus.
- Das Frontend ist als statische Weboberfläche in `webroot/` organisiert.
- Das Admin-/User-Umfeld wird als gemeinsame App-Struktur modelliert; die GUI ist nicht zwingend als komplett getrennte zweite Anwendung aufgebaut.
- Die bestehende Dokumentation (`VISION.md`, `WORKFLOW.md`, `AGENTTODO.md`, `VERSION.md`) bestätigt die Grundvision: Neutral als generische Master-/Entwicklungsbasis, mit späterem Transfer in ein separates Produktiv-Repository `cPanel-meinServer`.
- Es gibt kein `README.md` im Repository; die vorhandene Dokumentation ist die verbindliche Ausgangsbasis.

Die wichtigsten Erkenntnisse aus dem Ist-Zustand:

- Architektur: modularer Core + App-Registrierung + Module + Admin-UI + lokale Runtime-Konfiguration.
- Server: Node-HTTP-Server mit eigener Bootstrap-Logik, nicht nur ein reines Frontend-Hosting.
- Auth: derzeit lokal/Browser-basierte Session-Modelle für Preview/Entwicklung; produktiv muss dies auf sichere serverseitige Sessions umgestellt werden.
- Daten: derzeit überwiegend Framework-/Runtime-State, Config und lokale Datenstrukturen; das ist geeignet für Prototyping, aber für Produktivbetrieb mit Multi-User-Sicherheit und Persistenz muss eine echte Datenbank ergänzt werden.

## GEPLANT

Ziel ist ein klar getrenntes Modell:

1. `Neutral` bleibt die Master- und Entwicklungsbasis.
2. `cPanel-meinServer` wird die produktive, reduzierte Server-Instanz, die nur die tatsächlich produktiven Dateien enthält.
3. Der produktive Server soll als serverseitige Anwendung mit eigener API, Auth, Session-Management, Datenbank-Anbindung und Admin-UI laufen, ohne die komplette Entwicklungs- und Test-Infrastruktur mit zu transportieren.
4. Der Code in `Neutral` bleibt deshalb als Entwicklungs- und Test-Umgebung nutzbar, während `cPanel-meinServer` die deploybare Betriebsversion repräsentiert.

## VORSCHLAG: Technische Gesamtarchitektur

Ich würde die Architektur in vier Schichten aufbauen:

1. Präsentationsschicht (Frontend)
   - Admin-UI
   - Benutzer-UI
   - App-Shell und Template-Rendering
   - statische Assets im Webroot

2. API-/Serviceschicht (Backend)
   - REST-/JSON-API
   - Auth-Endpoints
   - User- und Rollen-Endpoints
   - Konfigurations- und Log-Endpoints
   - App-/Module-Management

3. Runtime-/Frameworkschicht
   - zentrale App-Registrierung
   - Module-Registry
   - Permission-/Role-Engine
   - Storage-Abstraktion
   - Event- und Lifecycle-Handling

4. Persistenzschicht
   - SQLite für lokale/kleine produktive Deployments oder MySQL für cPanel-Umgebung
   - Dateien für Konfigurations- und Log-Ausgaben
   - optional Session-Store im DB-Backend statt reinem Browser-Storage

Empfohlene grundlegende Technologie:

- Node.js LTS
- CommonJS (mit dem bestehenden Projekt kompatibel)
- Express oder ein minimalistischer eigener HTTP-Router je nach vorhandener Codebasis
- SQLite für Einfachheit und cPanel-Kompatibilität, alternativ MySQL falls cPanel-MySQL bereits bereitsteht
- Serverseitige Session-Cookies mit HttpOnly, Secure, SameSite
- Password-Hashing mit bcrypt oder Argon2 (nicht SHA-256 allein für Produktivpasswörter)
- Konfigurationsdateien über `.env` + sichere Umgebungsvariablen

Serverseitig benötigte Komponenten:

- HTTP-Server / Router
- API-Dispatcher
- Auth- und Session-Manager
- User-/Role-/Permission-Engine
- Database access layer
- Storage / File abstraction
- Logger + Error handling
- Admin dashboard service
- Health/status endpoint
- Config loader

Front-end und Backend-Aufteilung:

- Frontend: `webroot/`-Assets, UI-Layer, Admin-Views, Benutzeransicht, clientseitige Formular- und State-Verarbeitung
- Backend: `server/`, `platform/`, Datenbank- und Auth-Services, API- und Security-Logik

## VORSCHLAG: Verzeichnisstruktur

Vorgeschlagene Struktur für das Entwicklungsrepo `Neutral`:

```text
Neutral/
├── .env.example
├── .gitignore
├── package.json
├── VERSION.md
├── VISION.md
├── WORKFLOW.md
├── AGENTTODO.md
├── app/
│   ├── index.js
│   ├── apps/
│   │   └── catchtrack-app.json
│   └── modules/
│       └── index.json
├── apps/
│   └── neutral-app/
│       ├── app-info.json
│       ├── index.html
│       └── ...
├── config/
│   └── index.js
├── platform/
│   ├── master-framework.js
│   ├── core.js
│   ├── core-auth.js
│   ├── core-admin.js
│   ├── core-config.js
│   ├── core-context.js
│   ├── core-runtime.js
│   ├── core-storage.js
│   ├── module-manager.js
│   ├── module-registry.js
│   ├── security.js
│   ├── service-manager.js
│   ├── storage-manager.js
│   ├── theme-engine.js
│   └── ...
├── server/
│   ├── server.js
│   ├── bootstrap/
│   │   └── server.js
│   ├── api/
│   │   ├── health.js
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── roles.js
│   │   ├── config.js
│   │   └── admin.js
│   ├── config/
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── csrf.js
│   │   ├── rate-limit.js
│   │   └── notFound.js
│   ├── services/
│   │   ├── auth-service.js
│   │   ├── user-service.js
│   │   ├── config-service.js
│   │   ├── log-service.js
│   │   └── health-service.js
│   └── utils/
│       ├── logger.js
│       ├── errors.js
│       └── validation.js
├── tests/
│   ├── master-framework.test.js
│   └── vision-framework.test.js
├── webroot/
│   ├── index.html
│   ├── admin.html
│   ├── dev.html
│   ├── setup.html
│   ├── master-ui.js
│   ├── user-app.js
│   ├── style.css
│   └── ...
└── storage/
    ├── data/
    ├── logs/
    ├── sessions/
    └── uploads/
```

Für den späteren Produktiv-Transfer nach `cPanel-meinServer` müsste die Struktur weiter reduziert werden:

```text
cPanel-meinServer/
├── package.json
├── .env.example
├── server/
│   ├── server.js
│   ├── api/
│   ├── middleware/
│   ├── services/
│   └── config/
├── public/
│   ├── index.html
│   ├── admin.html
│   ├── assets/
│   └── app.js
├── storage/
│   ├── data/
│   ├── logs/
│   └── uploads/
├── config/
│   └── app-config.json
├── scripts/
│   └── start.sh
└── .gitignore
```

## VORSCHLAG: Dateibeschreibungen (wichtige Dateien)

1. `package.json`
   - Zweck: Metadaten, Startskripte, Abhängigkeiten, Projekt-Definition.
   - Funktionen: `npm start`, `npm test`, Engine-Definition, Dependency-Management.
   - Abhängigkeiten: `bcrypt`/`argon2`, optional `express`, `sqlite3`/`mysql2`, `dotenv`, `helmet`, `csurf`.
   - Kommunikation: Startet `server/server.js` und nutzt `.env`/`config`.

2. `config/index.js`
   - Zweck: zentrale Konfiguration von Host, Port, DB-Parameter, Session-Timeout und Feature-Flags.
   - Funktionen: liest Umgebungsvariablen, stellt Standardwerte bereit, validiert kritische Werte.
   - Abhängigkeiten: Node-Umgebung, `dotenv`.
   - Kommunikation: wird von Server- und API-Modulen verwendet.

3. `server/server.js`
   - Zweck: Einstiegspunkt für den produktiven HTTP-Server.
   - Funktionen: Initialisierung, Routing, Static-File-Serving, Error-Handling, Health-Checks.
   - Abhängigkeiten: `http`, Router, `config`, `platform/master-framework`.
   - Kommunikation: startet API- und UI-Services.

4. `server/bootstrap/server.js`
   - Zweck: Initialer Server-Bootstrap und App-Registrierung.
   - Funktionen: Default-App-Setup, aktiviert Standardmodule, setzt aktive App.
   - Abhängigkeiten: `platform/master-framework`, filesystem, JSON-Manifeste.
   - Kommunikation: liefert den Runtime-Kontext für App-UI und API.

5. `platform/master-framework.js`
   - Zweck: zentrales Framework-Management.
   - Funktionen: App-Registrierung, Rollen, Permissions, Module, Schemas, Feature-Flags, Setup-Status.
   - Abhängigkeiten: Core-Module, Storage-Services.
   - Kommunikation: wird von Server, Admin-UI und App-Logik genutzt.

6. `platform/core-auth.js`
   - Zweck: Auth-State und Session-Logik.
   - Funktionen: erstelle Session, validiere Token/Cookie, prüfe Rollen, verwalte Login-Status.
   - Abhängigkeiten: `platform/security.js`, Storage-Adapter.
   - Kommunikation: arbeitet eng mit API-Auth-Endpoints und Session-Transport zusammen.

7. `platform/security.js`
   - Zweck: Sicherheits- und Validierungslogik.
   - Funktionen: Password-Hashing, CSRF-Prüfung, Header-Validierung, Input-Sanierung, Rate-Limit-Integration.
   - Abhängigkeiten: `bcrypt`, `crypto`, Request-Validierung.
   - Kommunikation: wird in Auth, API-Middleware und Admin-Endpoints aufgerufen.

8. `platform/module-registry.js`
   - Zweck: Modul-Lebenszyklus und registrierte Funktionen.
   - Funktionen: aktivieren/deaktivieren, Modul-Status, Rechteprüfung, UI-Discovery.
   - Abhängigkeiten: Core, Config, Permission-Engine.
   - Kommunikation: mit Admin-UI, App-Config und Runtime-Laden.

9. `platform/core-storage.js`
   - Zweck: persistenter Storage-Adapter.
   - Funktionen: Insert/Update/Delete/Read für Datenmodelle, File- oder SQL-Backend, Schema-Validierung.
   - Abhängigkeiten: SQLite/MySQL-Filesystem, Schema-Definitionen.
   - Kommunikation: mit Server-Services und Module-Datenmodellen.

10. `server/api/auth.js`
    - Zweck: Login-/Logout-/Refresh-Endpunkte.
    - Funktionen: Benutzerlogin, Token-/Session-Erzeugung, Passwortprüfung, Logout, Session-Invalidate.
    - Abhängigkeiten: `auth-service`, `user-service`, `security`.
    - Kommunikation: mit Session-Manager, User-Persistence und Frontend-Login.

11. `server/api/users.js`
    - Zweck: User-Verwaltung.
    - Funktionen: Liste, Daten anzeigen, speichern, deaktivieren, Status ändern, Rollen zuordnen.
    - Abhängigkeiten: `user-service`, `permission-engine`.
    - Kommunikation: mit Admin-UI und Auth-/Role-System.

12. `server/api/roles.js`
    - Zweck: Rollen-/Rechte-Management.
    - Funktionen: Rollen erzeugen, Berechtigungen prüfen, Rollen auf Benutzer anwenden.
    - Abhängigkeiten: `master-framework`, `permission-engine`.
    - Kommunikation: dient Admin- und Sicherheits-Checks im API-Layer.

13. `server/api/config.js`
    - Zweck: Konfiguration und App-Setup.
    - Funktionen: Read/Write von Konfigurationswerten, App-Umstellung, Feature-Flags, Standard-Settings.
    - Abhängigkeiten: `config-service`, `app registry`.
    - Kommunikation: mit Admin-UI und Runtime-Initialisierung.

14. `server/services/auth-service.js`
    - Zweck: zentrale Auth-Logik.
    - Funktionen: Passwortprüfung, Session-Erzeugung, Zugriffsprüfung, refresh/expiry.
    - Abhängigkeiten: Database, `bcrypt`/`argon2`, Session store.
    - Kommunikation: wird von API-Endpoints aufgerufen.

15. `server/services/log-service.js`
    - Zweck: System-, Admin-, Login- und Fehlersprotokollierung.
    - Funktionen: Log-Writer, Log-Rotation, Fehler- und Audit-Event-Verarbeitung.
    - Abhängigkeiten: filesystem, `winston` oder eigene simple logger.
    - Kommunikation: mit Admin-UI, Fehlerbehandlung und Sicherheitsmonitoring.

16. `webroot/admin.html` und `webroot/master-ui.js`
    - Zweck: Admin- und allgemeine UI-Shell.
    - Funktionen: Navigation, Menüs, Formular-, Dashboard-, User-Admin-, Log-, Config- und Role-Anzeigen.
    - Abhängigkeiten: JS-Module, API-Calls, Theme-Engine.
    - Kommunikation: API-Endpunkte und Runtime-State.

17. `webroot/user-app.js`
    - Zweck: normale Anwendung der App.
    - Funktionen: App-Login, Module-Discovery, Dashboard, Feature-Auswahl, App-Navigation.
    - Abhängigkeiten: API-Token/Session und Module-Registry.
    - Kommunikation: mit `server/api/*` und `platform`-Runtime-Context.

## VORSCHLAG: Admin-Bereich

Login:

- Admin-Login über eigene Route oder gemeinsame Login-Seite mit Rollen-Erkennung.
- Keine getrennte, vollständig eigene Admin-App nötig; sinnvoll ist eine gemeinsame App mit Expand/Context-Wechsel.
- Login-Formular validiert Benutzername/E-Mail und Passwort.
- Nach erfolgreichem Login wird ein HttpOnly-Cookie gesetzt; der Browser erhält keine sensiblen Token im JavaScript-Storage.

Authentifizierung:

- Serverseitige Session-Validierung auf jedem geschützten Request.
- Rolle und User-ID aus dem Session-Token oder Cookie.
- Optional zusätzlich JWT als stateless-Option, aber für cPanel-Umgebungen ist eine Cookie-Session oft einfacher und sicherer im Shared-Hosting-Umfeld.

Sessions:

- Session-TTL: 15–60 Minuten idle, mit absolutem Timeout konfigurierbar.
- Secure, HttpOnly, SameSite=Lax/Strict.
- Serverseitiger Store (DB oder Datei) statt reinem Browser-Storage.
- Session-Invalidierung beim Logout, Passwortwechsel und Rollenänderung.

Benutzerverwaltung:

- Erstellen, deaktivieren, aktivieren, löschen, Suchen und Bearbeiten.
- Profil-Attribute: Benutzername, Anzeigename, E-Mail, Status, Rolle, zuletzt aktiv.
- Export/Import optional, aber nicht zwingend im ersten Iterationsschritt.

Rollen:

- `admin`, `developer`, `manager`, `member`, `user` als erste gemeinsame Basis.
- Rollen aus zentralem Framework-Registry-Objekt, nicht aus UI-Status ableiten.

Berechtigungen:

- Permissions als eigene Layer (`system:view`, `user:read`, `user:write`, `module:read`, `module:update`, `app:read`, `connection:read`, `connection:write`).
- Rechte-Prüfung muss serverseitig erfolgen, also nicht nur im Frontend.

Dashboard:

- Gesamtstatus: Server, Datenbank, Moduldynamik, aktive User, Fehler, Setup-Status.
- Module-Übersicht, health/status, letzte Fehler und Systemaktivitäten.
- UI ist als Kernel-Dashboard mit optionalem App-/Feature-Filter konzipiert.

Konfiguration:

- App-Name, App-ID, Modus, default view, feature flags, permitted modules.
- Konfigurationen werden in Konfigurationsdateien oder DB gespeichert und per API angepasst.

Logs:

- Admin-Log, System-Log, Login-Log, Error-Log, Security-Log.
- Log-Level konfigurierbar (`debug`, `info`, `warn`, `error`).
- Rückblick auf letzte Aktivitäten und Fehler.

Systeminformationen:

- Node-Version, Betriebssystem, Root-Pfad, Server-Status, laufende Zeit, Speicher, DB-Status.
- App-Info, Module-Status, Running-Environment-Info.

Fehlerbehandlung:

- Zentraler Error-Handler mit einheitlichen Fehlercodes.
- Keine internen Stack-Traces im Frontend anzeigen, nur kontrollierte Fehlerantworten.
- Audit-Log für Fehler, Sicherheits- und Auth-Anomalien.

Sicherheitsfunktionen:

- CSRF-Tokens für Form-Aktionen.
- Rate-Limit für Login und API.
- Access-Control-Kontrolle auf Endpoint-Ebene.
- Audit-Log von sensitiven Aktionen.
- minimale Privilegien für Admin-Accounts.

## VORSCHLAG: API

Benötigte Endpunkte:

- `GET /api/health` – Server-Status
- `POST /api/auth/login` – Login
- `POST /api/auth/logout` – Logout
- `POST /api/auth/refresh` – Session-Refresh
- `GET /api/auth/session` – aktuelle Session / User-Status
- `GET /api/users` – User-Liste
- `POST /api/users` – User anlegen
- `GET /api/users/:id` – User anzeigen
- `PUT /api/users/:id` – User aktualisieren
- `GET /api/roles` – Rollen-Liste
- `GET /api/modules` – Module-Status und UI-Discovery
- `POST /api/modules/:id/enable` / `disable` – Module verwalten
- `GET /api/config` – Konfiguration lesen
- `PUT /api/config` – Konfiguration speichern
- `GET /api/system/info` – Server-Infos
- `GET /api/logs` – Logs anzeigen
- `GET /api/error-log` – Fehlerliste / Audit

Authentifizierung:

- Geschützte API-Endpunkte prüfen Cookie-Session oder Authorization-Header.
- Admin-Endpunkte zusätzlich per Rollen-/Permission-Check.
- JWT ist optional, aber Cookie-Session ist für cPanel einfacher, wenn Browser-Sessionen im Server-Store verwaltet werden.

Request/Response-Struktur:

- Request: JSON-Body, Content-Type `application/json`.
- Response: `{ ok: true|false, data: {...}, error: { code, message }, meta: {...} }`
- Erfolgsstatus mit `200`/`201`, Fehler mit `400`, `401`, `403`, `404`, `409`, `500`.

Fehlercodes:

- `AUTH_REQUIRED` – keine gültige Session
- `AUTH_INVALID` – ungültige Login-/Session-Daten
- `FORBIDDEN` – Rolle oder Berechtigung fehlt
- `VALIDATION_ERROR` – fehlerhafte Eingabe
- `NOT_FOUND` – Ressource nicht gefunden
- `CONFLICT` – doppelte/nicht eindeutige Ressource
- `INTERNAL_ERROR` – unerwarteter Serverfehler

Interne Kommunikation:

- API-Layer ruft Service-Layer auf
- Service-Layer nutzt Persistenz-Adapter
- Persistenz-Adapter kapselt DB-/File-Details
- Framework-Core stellt App- und Module-Details bereit
- UI ruft nur API-Endpunkte statt interner Backend-Objekte auf

## VORSCHLAG: Datenhaltung

Erforderliche Daten:

- Benutzerstammdaten
- Rollen-/Berechtigungszuordnungen
- Sessions / Login-State
- App-Konfiguration
- Module-Status und Modul-Metadaten
- Feature-Flags
- Logdaten
- Fehler-/Audit-Events
- optional business data (z. B. Produkt-/Kunden-/Bestell-Schemas, falls App-Funktionalität benötigt)

Datenbank-/Dateistruktur:

- Für cPanel-Deployment ist SQLite die beste erste Produktiv-Option, weil sie keine separate DB-Instanz voraussetzt und nahtlos in Node läuft.
- Für echte Multi-User-Laufzeit mit höherer Last ist MySQL die robustere produktive Wahl.
- Für kleine einfache Deployments reicht ein SQLite-Dateibackend inkl. Session- und User-Tables vollständig aus.

Empfohlene Tabellen:

- `users`
- `sessions`
- `roles`
- `permissions`
- `user_roles`
- `app_config`
- `modules`
- `features`
- `logs`
- `audit_events`
- `system_status`

Dateistruktur:

- `/storage/data/*.db` für SQLite bzw. JSON-Export-Dateien
- `/storage/logs/*.log` für Logs
- `/storage/uploads/` für Medien-/Uploads
- `/storage/sessions/` nur, falls dateibasierte Session-Speicherung gewählt wird

## VORSCHLAG: Sicherheit

Passwort-Handling:

- Produktiv: `bcrypt` oder `argon2` mit Salt.
- Keine Klartext- oder einfache Hash-Werte im Produktivpfad.
- Passwort-Policies: Mindestlänge, Komplexität optional, kein speichernder Plain-Text-Log.

Session-Sicherheit:

- HttpOnly-Cookie
- Secure in HTTPS
- SameSite=Lax/Strict
- Session-ID zufällig, nicht aus Benutzername oder ID ableitbar
- Timeout und Logout beim Reset oder Rollenwechsel

Zugriffsschutz:

- Serverseitige Rollen-/Permission-Prüfung auf jedem geschützten Request
- Keine Berechtigungen nur im UI, sondern überall im API-Layer
- Login- und Admin-Endpoints nur für autorisierte Rollen freigeben

CSRF/XSS/Injection-Schutz:

- CSRF-Tokens für State-changende Formular- und API-Calls
- Input-Validierung und sanfte Normalisierung
- Output-Encoding bei renderbaren Frontend-Strings
- Parameterized queries oder ORM-gebundene SQL für DB-Zugriffe
- Keine rohe String-Konkatenation für SQL- oder Template-Ausgaben

Secrets:

- Secrets und Tokens in `.env` oder cPanel-Umgebungsvariablen
- niemals fest im Code oder im Git-Repository
- Trennung von Entwicklungs-, Test- und Produktiv-Umgebung

Logging:

- Login-Events, Fehler, Roll- und Admin-Aktionen in Audit-Log
- keine Passwörter oder Tokens in Logs
- Fehler nur mit kontrollierten Meldungen an Client und Admin

Rechte:

- Admins nur für systemische Bereiche
- Entwickler nur für Framework-/Module-Bereiche
- Member/User nur falls relevant freigeben
- Jede Erweiterung muss serverseitig geprüft werden, nicht nur im Frontend

## VORSCHLAG: cPanel-Kompatibilität

Die vorgeschlagene Struktur ist grundsätzlich auf einem cPanel-Server betreibbar, sofern dort Node.js unterstützt wird. Die Machbarkeit hängt von den cPanel-Einstellungen ab, aber die Architektur selbst ist kompatibel.

Voraussetzungen:

- cPanel mit Node- oder Application-Manager-Unterstützung
- Node-LTS-Version
- Zugelassene Schreibrechte im Webroot oder einem Sub-Ordner
- Zugriff auf Umgebungsvariablen oder `.env`
- keine Docker- oder systemweiten Daemon-Abhängigkeiten

Was in cPanel sinnvoll ist:

- Node-App in einem eigenen Anwendungsordner (z. B. `public_html/` oder `subdomain-root`)
- Start-Command via cPanel Application Manager oder `npm start`
- statische Assets aus `public/` oder `webroot/` bereitstellen
- `server/` und `config/` bleiben serverseitig, nicht im öffentlichen Frontend-Pfad

Was kritisch ist:

- keine rein browserbasierten Auth-Mechanismen als einzige Sicherheitsbasis
- keine Abhängigkeit von lokalerBrowser-Storage-Session als alleinige Autorität
- keine hardcodierten Admin-Zugangsdaten im Repository
- keine vertraulichen Secrets im Git

Kurz gesagt: Ja, die Struktur ist auf cPanel deploybar, aber nur mit einer produktiven Auth- und DB-Umsetzung, nicht mit dem aktuellen lokalen Preview-Modell.

## VORSCHLAG: Deployment nach cPanel-meinServer

Folgende Dateien sollen später in `cPanel-meinServer` übertragen werden:

- `package.json`
- `.env.example`
- `server/`-Ordner inkl. API, Services, Middleware, Bootstrap
- `config/` inkl. Environment- und Runtime-Konfiguration
- `public/` oder `webroot/`-Ausgabe für Frontend-Assets
- `storage/`-Ordner mit `data`, `logs`, `uploads`
- Start-/Deploy-Skript

Folgende Dateien oder Bereiche dürfen nicht auf den produktiven cPanel-Server übertragen werden:

- `tests/`-Ordner
- `VISION.md`, `WORKFLOW.md`, `AGENTTODO.md`, `VERSION.md` (es sei denn, sie sollen dort als dokumentarische Begleitdateien installiert werden)
- Entwicklungs-Only-Konfigs
- lokale App-/Module-Templates, die nur für Entwicklung gedacht sind
- Debug-Setups, UI-Preview oder Developer-Tools
- keine geschützten Secrets oder `.env`-Dateien mit echten Werten
- keine langfristigen Build-Artefakte, die nur im Entwicklungsrepo nötig sind

Praktisch bedeutet das: `Neutral` bleibt das Entwicklungs-/Master-Repository; `cPanel-meinServer` wird der productiv nutzbare, minimalisierte Delivery-Bestand.

## VORSCHLAG: Abgleich mit bisheriger Vision

Was direkt aus vorhandener Dokumentation hervorgeht:

- `Neutral` ist als Master-/Entwicklungsgrundlage gedacht.
- Der Core soll neutral und modular bleiben.
- Module/Funktionen sollen nicht hart im Core verankert sein.
- Offline-First ist ein Leitprinzip.
- App- und Admin-Bereiche sollen gemeinsam in einer neutralen Anwendung sein können.
- Gewinnung von Framework-/Module-/App-Scaffolding ist bereits im Repository angelegt.

Was eine technische Schlussfolgerung ist:

- Die bestehende Strukturen in `platform/`, `apps/`, `webroot/`, `server/` sind geeignet als Basis für eine produktive Server-Anwendung.
- Das aktuelle Setup ist für UI-Prototyping und Framework-Validerung bereits reif.
- Für echte Multi-User-Produktivumgebung müssen Auth, Session, Datenmodelle und Logs serverseitig abgesichert werden.
- cPanel-Deploy ist machbar, aber nur mit sauberem Produktiv-Pfad und getrennter Administrator-/Session-Struktur.

Was zusätzlich vorgeschlagen wird:

- echte serverseitige Session- und Permission-Schicht
- SQLite/MySQL-Adapter statt rein lokalem Runtime-State
- standardsichere Passwort-Hashing-Strategie (`bcrypt`/`argon2`)
- sauber geschichtete API- und Service-Layer
- separate Produktiv-Deployment-Struktur für `cPanel-meinServer`
- klarer Trennung zwischen Entwicklungs-/Master-Repo und deploybarem Server-Repo

Wo noch Entscheidungen von mir notwendig sind:

- Ist die produktive Laufzeit auf cPanel mit SQLite oder mit MySQL geplant?
- Sollen die App- und Admin-Bereiche in einer und derselben UI bleiben oder getrennt bereitgestellt werden?
- Ist ein Cookie-basiertes Session-Model oder ein Token-Model bevorzugt?
- Soll `Neutral` nur als Basis dienen oder direkt auch Teil des produktiven Server-Deploys werden?
- Wie streng sollen die Admin-/User-Rollen im ersten produktiven Release sein?
- Gibt es bereits konkrete Business-Module oder App-Templates, die später in `cPanel-meinServer` dauerhaft mitlaufen sollen?

## VORSCHLAG: Sinnvolle Umsetzungsreihenfolge

1. Sicherheitsbasis festlegen
   - Auth-Strategie, Session-Model, Passwort-Hashing, Zugriffsschutz, Secret-Handling.

2. Produktiv-Server-Grundgerüst aufsetzen
   - HTTP-Server, Routing, Config, Static-Serving, Health-Endpoint.

3. Persistenzschicht implementieren
   - DB-Setup, User- und Session-Tabellen, Migrationen, Storage-Adapter.

4. User-/Admin-API bauen
   - Login, Logout, User-Management, Rollen, Permissions, System-Status.

5. Admin-UI auf die API verbinden
   - Dashboard, Log-Views, User-Verwaltung, Config-Screen, Module-Status.

6. App-/Module-Lebenszyklus einbauen
   - aktivieren/deaktivieren, Konfiguration, Feature-Flags, Module-Rechte.

7. Fehler-, Log- und Audit-Schicht ergänzen
   - zentralisierter Error-Handler, Log-Rotation, Sicherheits-Auditing.

8. cPanel-Deploy vorbereiten
   - start scripts, `npm start`, env handling, performance checks, minimal Deployment-Subset.

9. Test- und Betriebssicherheitsprüfung
   - Auth-Tests, Rollen-Tests, Fehlerfälle, cPanel-Setup, 401/403/CSRF-Checks.

10. Transfer in `cPanel-meinServer`
    - nur produktive Dateien, keine Entwicklungs-Artefakte, Dokumentation und Tests separat halten.

## OFFENE ENTSCHEIDUNGEN

- Produktive Datenbank: SQLite oder MySQL?
- Produktspezifischer App-/Admin-Mix: gemeinsame UI oder getrennte Admin-Anwendung?
- Session-Mechanik: Cookie-Session oder JWT?
- Deployment-Modell: einzelner Node-Startpoint oder mehrere Worker-/Services?
- Übergang vom lokalem Preview-Modus zu sicherem Produktiv-Auth-Modell muss klar dokumentiert werden.
- Welche Module gelten als produktiver Minimal-Set für den ersten cPanel-Deploy?

Fazit:

Die aktuelle Umsetzung in `Neutral` ist technisch machbar und inhaltlich passend als Master-/Entwicklungsbasis. Die Architektur ist bereits modular und neutral genug, um sie später in eine produktive Server-/Admin-Anwendung umzubauen. Der eigentliche produktive Übergang nach `cPanel-meinServer` ist deshalb nicht technisch fraglich, sondern vor allem eine Frage der Finalisierung der Sicherheits-, Datenbank- und Betriebsentscheidungen. Die Umsetzung ist grundsätzlich realisierbar, sofern die Produktiv-Entscheidungen vor dem Transfer konkret getroffen werden.

