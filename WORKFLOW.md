# Workflow

## Dokumentenrollen und verbindliche Quellen

- `WORKFLOW.md` ist die verbindliche technische Quelle für Architektur, Anforderungen, Entwicklungsregeln und den aktuellen technischen Status.
- `VISION.md` beschreibt die strategische Projektvision und das langfristige Zielbild des neutralen Frameworks.
- `AGENTTODO.md` ist ein operativer Arbeits- und Prüfprotokoll; es dokumentiert erledigte Schritte, Tests und den konkreten Arbeitsstand, aber keine Architekturentscheidung als Primärquelle.
- `VERSION.md` dokumentiert Versionsstand, Meilensteine und aktuelle Freigabe-/Fokuspunkte; hier werden keine fachlichen Architekturregeln neu definiert.
- Doppelte oder widersprüchliche Festlegungen werden vermieden. Bei inhaltlichen Abweichungen gilt immer `WORKFLOW.md` als die verbindliche technische Grundlage.

## Verbindliche Korrekturen

### HISTORISCH / REFERENZ / VALIDIERUNG

- GPS, Store, Retail, Catch Log, Fishing Spots und ähnliche konkrete Fachmodule sind historische Referenz-, Test- und Validierungsbeispiele.
- Sie dürfen in der Dokumentation erwähnt werden, sofern klar erkennbar ist, dass sie nur als vergangene Architekturvalidierung dienen.
- Sie gehören nicht zum Neutral-Core, sie sind keine laufende Produktfunktion von Neutral, keine aktuelle Priorität und keine zwingende Voraussetzung für die zukünftige Framework-Architektur.
- Keine weitere fachliche Entwicklung dieser Module im neutralen Core.
- Keine Festverdrahtung in der Framework-Architektur.
- Keine Abhängigkeit des Core von diesen Modulen.

Beispiel-Formulierung:

- Das GPS-Modul wurde während der Framework-Entwicklung verwendet, um die Modulregistrierung und Geolocation-Integration zu validieren. Es gehört nicht zum Neutral-Core und ist kein Bestandteil des produktiven Frameworkumfangs.

### AKTUELL / VERBINDLICH

- Neutral bleibt ein neutrales Master-/Entwicklungsframework.
- Das Framework darf keine einzelne Fach-Anwendung, kein fertiges Produkt und keine konkrete Modul-Implementierung als Standardhardcodierung festschreiben.
- Der verbindliche Frameworkumfang besteht aus Core, App-/Runtime-Isolation, Module-System, Admin-/CMS-System, Auth, Rollen und Berechtigungen, Storage-Abstraktion, MySQL als produktive DB, Update-System, Backup/Restore, Entitlements, Provider-/Infrastruktur-Abstraktion, API, Logging/Monitoring und Sicherheitsarchitektur.

1. Neutral bleibt ein neutrales Master-/Entwicklungsframework.
   - Das Framework darf keine einzelne Fach-Anwendung, kein fertiges Produkt und keine konkrete Modul-Implementierung als Standardhardcodierung festschreiben.
   - Die eigentliche Kernfunktion ist die modulare Grund- und Entwicklungsplattform, nicht eine einzelne Produktanwendung.

2. GPS, Store, Retail, Catch Log, Fishing Spots und andere konkrete Fachmodule
   - Diese Module werden nur noch als historische Validierungs- und Referenzbeispiele dokumentiert.
   - Sie sind nicht Teil des verbindlichen Frameworkumfanges und werden nicht als aktuelle Produktfunktion oder als Kernarchitektur behandelt.
   - Spätere Fachmodule sollen eigenständig auf dem Framework aufbauen und nur die notwendige Modul-Infrastruktur nutzen.

3. Datenbank
   - Für den späteren produktiven Server ist grundsätzlich MySQL vorgesehen.
   - SQLite darf ausschließlich als lokale Test-/Entwicklungsoption erwähnt werden, niemals als gleichwertige produktive Zielarchitektur.
   - Die konkrete Einrichtung erfolgt außerhalb des Repository-Standorts und wird nicht im Quellcode dokumentiert.
   - Für spätere Umsetzung müssen exakt diese Angaben dokumentiert werden: Datenbankname, Benutzername, benötigte Berechtigungen, benötigte Einstellungen, Standort der Zugangsdaten, sowie die konkrete Betriebsumgebung und Provider-/Server-Konfiguration.
   - Keine Zugangsdaten im Quellcode und keine Datenbank-Initialisierung im Repository selbst.

4. Admin-Bereich
   - Der Admin-Bereich ist ein zentraler, CMS-artiger Bestandteil des neutralen Frameworks.
   - Er umfasst moderne Dashboard-, Navigations- und Menüstruktur, inklusive hierarchischer, modularer und responsiver Verwaltung.
   - Normale Benutzer dürfen niemals Zugriff auf die eigentlichen Admin-/Systemdateien erhalten.
   - Diese Trennung muss technisch durch Authentifizierung, Rollen und Berechtigungen erzwungen werden.

5. Provider-/Infrastruktur-Architektur
   - Provider- und Infrastruktur-Details müssen als Konfigurations- und Integrationsschicht modelliert werden, nicht als harte Codierung im Core.
   - Eine feste Bindung an cPanel, FTP, einzelne Hosting-Umgebungen oder einen einzigen Provider ist nicht als Standard-Architektur vorgesehen.
   - Für spätere produktive Bereitstellungen müssen Provider, Server, Domain-, Storage- und Backup-Parameter als genaue Betriebs- und Konfigurationsaufgabe extern dokumentiert werden.

6. Produktivtrennung
   - `Neutral` bleibt die Master-/Entwicklungsbasis.
   - Produktive Server-/App-Instanzen müssen getrennt und reduziert in einer eigenen produktiven Umgebung laufen.
   - Es werden keine produktiven Serverdateien in diesem Repository angelegt und keine Dateien nach `cPanel-meinServer` übertragen.
   - Dies ist eine spätere Betriebsaufgabe und kein Teil der aktuellen Repository-Implementierung.

7. Update, Backup und Entitlements
   - Das Framework erhält eine neutrale Entitlement-Struktur für Funktionen, Module, Dienste, Speicher, Backups und Premiumfunktionen.
   - Tariflogik darf nicht direkt in einzelne Fachmodule eingebaut werden.
   - Update-Checks, Backup-/Restore-Prozesse und Entitlement-Entscheidungen sind als Framework-/Service-Schicht zu modellieren, nicht als fachliche App-Logik.

## IMPLEMENTIERUNGSPLAN FÜR DAS NEUTRALE FRAMEWORK

### 1. Zielarchitektur

Das Zielsystem ist ein neutraler, modularer Framework-Stack mit klarer Trennung zwischen Core, Runtime, Admin-CMS, API-Services und produktiver Infrastruktur. Historische Referenzmodule wie GPS, Store, Retail, Catch Log oder Fishing Spots bleiben nur als Validierungsbeispiele dokumentiert; sie sind keine aktuellen Framework-Bestandteile und keine Produktprioritäten.

#### Core

- Verantwortlich für die grundlegenden technischen Garantien:
  - App-/Runtime-Isolation
  - Module-System
  - Rollen-/Permission-Engine
  - Auth- und Sitzungsschicht
  - Konfigurations- und Settings-Management
  - Storage-Abstraktion
  - Provider-/Infrastructure-Abstraktion
  - Update-/Release-Management
  - Backup-/Restore-Management
  - Log-/Audit-/Monitoring-Schicht
  - API-Routing und Security-Hardening
- Der Core darf keine fachliche App-Logik enthalten.
- Alle fachlichen Funktionen werden als eigenständige Module oder Service-Schichten ergänzt.

#### Framework Services

- `core/runtime` – App-Initialisierung, Context, Lifecycle, Runtime-Registry
- `core/auth` – Login, Session-Validation, Rolle-Resolver, Access Control
- `core/permissions` – central policy engine, scopes, resource checks
- `core/modules` – registry, install, enable, disable, version checks
- `core/config` – system settings, app configuration, env mapping
- `core/entitlements` – feature gating, premium rules, tier checks
- `core/updater` – version check, compatibility, update orchestration
- `core/backup` – user and system backup orchestration
- `core/storage` – adapter layer for file, database and future cloud storage
- `core/providers` – infrastructure adapters for cPanel, own server, cloud, DNS/hoster
- `core/logging` – audit logs, system logs, activity streams
- `core/monitoring` – health checks, metrics, alerts

#### Admin-/CMS-System

Der Admin-Bereich bleibt zentraler, CMS-artiger Bereich des Frameworks und kein separater fachlicher Product-Code.

Zielstruktur:
- Dashboard
  - Systemstatus
  - Health status
  - active app and runtime summary
  - audit signal overview
- Navigation
  - hierarchy: System > Users > Roles > Modules > Entitlements > Storage > Backup > Updates > Provider > Monitoring > Settings
- Seiten-/Menüstruktur
  - Dashboard
  - Benutzer
  - Rollen/Rechte
  - Sicherheit
  - Module
  - Entitlements/Tarife
  - Updates
  - Backup/Restore
  - Storage
  - Logs
  - Monitoring
  - Provider/Server
  - Wartung
  - Einstellungen
- Trennung:
  - Admin Views und Admin Services bleiben im Framework, nicht in Fachmodulen.
  - Fachmodule liefern nur ihre eigenen Views und Services, aber nicht die zentrale Admin-Logik.

#### Benutzerverwaltung

- User-Model mit ID, username, display name, email, status, role, app scopes
- Profile, session link, last seen, created/updated timestamps
- Self-service profile settings separated from system admin actions
- Admin actions: create, edit, disable, enable, delete, reset password, assign roles and permissions
- User-level access must be enforced server-side, not only in UI

#### Rollen/Rechte

- Central role catalog with base roles such as admin, developer, manager, member, user
- Permission policy with resource scopes, not only UI flags
- Example permission layers:
  - `system:view`, `system:write`
  - `user:read`, `user:write`
  - `module:read`, `module:write`
  - `config:read`, `config:write`
  - `backup:read`, `backup:write`
  - `updates:read`, `updates:write`
  - `provider:read`, `provider:write`
  - `entitlement:read`, `entitlement:write`
- Permissions are checked in the API layer and by service layer; UI checks remain helper-only

#### Authentifizierung

- Password hashing with bcrypt or Argon2
- Secure admin and user login flows with server-side validation
- Authentication separated from app logic
- Additional API authentication model allowed later via token-based adapter, but not as the default for the core implementation
- Authentication references must not be hardcoded into concrete modules

#### Sessions

- Server-side session store
- HttpOnly, Secure, SameSite cookies
- TTL and absolute timeout configuration
- Session invalidation on logout, password change, role changes, admin disable
- Session storage in DB-backed session layer; browser-only storage remains only a local preview convenience, not a productive authority

#### API

- HTTP API as neutral product layer for admin, user and runtime operations
- Route groups:
  - `/api/health`
  - `/api/auth/*`
  - `/api/users/*`
  - `/api/roles/*`
  - `/api/modules/*`
  - `/api/config/*`
  - `/api/logs/*`
  - `/api/system/*`
  - `/api/backup/*`
  - `/api/updates/*`
  - `/api/providers/*`
  - `/api/entitlements/*`
- Standard response envelope:
  - ok
  - data
  - meta
  - error
- Standard error codes: AUTH_REQUIRED, AUTH_INVALID, FORBIDDEN, VALIDATION_ERROR, NOT_FOUND, CONFLICT, INTERNAL_ERROR, PROVIDER_ERROR, UPDATE_CHECK_FAILED
- API versioning required from first production design phase

#### Module-System

- Module registry with app-scoped metadata and version metadata
- Module lifecycle: install, enable, disable, uninstall, update
- Each module owns:
  - metadata
  - routes or UI surface
  - config
  - permissions
  - entitlement requirements
  - storage namespace
  - optional migration scripts
- Module boundaries are enforced by namespace, access control and runtime contracts
- Historical examples like GPS, Store or Retail remain examples only; they do not define the live module inventory

#### Entitlements

- Central entitlement manager
- Free / Paid / Premium model as policy layer
- Capability-based decisions for feature gate, storage cap, backup availability, premium modules and update channels
- Entitlements must be checked centrally and not hardcoded into modules

#### Update-System

- At startup: check installed framework version, app version, installed module versions, available versions and compatibility
- Validate compatibility, security status and dependency constraints before applying update
- Show update notices in admin and user context where appropriate
- Update source abstraction: own server, provider-managed store, other future sources
- Rollback strategy defined for critical system updates or failed installs

#### Backup/Restore

- Split between system backup and user backup
- System backup: server config, DB structure, admin data, logs, runtime config
- User backup: personal data, settings, metadata, optional media according to entitlement
- User backup never exposed to other users; strict ownership and isolation required
- Backup provider abstraction for local, provider, cloud or archive storage

#### Storage

- Productive storage model is MySQL for system data and app data
- File storage remains for uploads, temporary files and export artifacts
- Storage abstraction must define a consistent interface for DB, file, session and future adapter layers
- Each app keeps its own namespaces and isolation boundaries

#### Provider/Infrastructure

- Setup and runtime infrastructure are abstracted behind provider adapters
- First concrete provider: cPanel + FTPS for deployment only
- Future providers must be interchangeable without core changes
- Secrets and connection details remain outside repository and must be loaded by environment or provider config

#### Logging/Audit

- Central system log for access, auth, admin actions, configuration changes, backups, updates and security incidents
- Audit trail for who did what, when, and against which resource
- No passwords, tokens or secrets stored in logs

#### Monitoring

- Health endpoints, runtime status, storage status, DB connectivity, session status, module status
- Alerts for failed auth, elevated error rate, storage or provider issues
- Monitoring integrates with admin dashboard and system operations

#### Security

- Central security layer across auth, API, admin controllers, storage and update endpoints
- CSRF, input validation, output encoding, rate limiting, privilege checks, secret handling
- Security defaults must be enforced before exposing any admin or app functionality

### 2. Admin-CMS-Konzept

Der Admin-Bereich ist ein CMS-artiges System mit klaren, abrechenbaren Bereichen.

#### Menüstruktur

- Dashboard
- Benutzer
  - Liste
  - Profil
  - Rollen
  - Status
  - Aktivitätslog
- Rollen/Rechte
  - Rollen definieren
  - Berechtigungen verbinden
  - Scope-Modelle verwalten
- Sicherheit
  - Session-Status
  - Login-Events
  - Fehlversuche
  - Password reset flows
- System
  - Runtime status
  - App status
  - Env overview
  - health summary
- Module
  - install
  - enable/disable
  - update
  - metadata edit
  - permission mapping
- Entitlements
  - tariffs
  - feature bundles
  - user assignment
  - upgrade workflow
- Updates
  - version check
  - pending release queue
  - deployment log
  - rollback status
- Backup/Restore
  - system backup
  - user backup
  - restore log
- Storage
  - DB overview
  - file overview
  - upload storage
  - quota information
- Server/Provider
  - provider config
  - connection status
  - environment values
  - deployment config
- Logs
  - app log
  - admin log
  - audit log
- Monitoring
  - health summary
  - uptime
  - resource summary
  - issue list
- Wartung
  - maintenance mode
  - cleanup jobs
  - queue tasks
- Einstellungen
  - general app settings
  - default modes
  - default themes
  - feature defaults

#### Bereiche mit eigenen Services/Modulen

Die zentralen Admin-Services sollten separat von fachlichen Modulen existieren. Empfehlung:
- `admin/dashboard-service`
- `admin/user-service`
- `admin/role-service`
- `admin/security-service`
- `admin/module-service`
- `admin/entitlement-service`
- `admin/update-service`
- `admin/backup-service`
- `admin/storage-service`
- `admin/provider-service`
- `admin/log-service`
- `admin/monitoring-service`
- `admin/settings-service`

Fachliche Module wie Store, GPS oder andere Produkte liefern ihre eigene Oberfläche und eigene Datenmodelle, aber sie dürfen nicht die zentrale Admin-Struktur des Frameworks ersetzen.

### 3. Serverarchitektur

#### Produktiver Server

- Node.js runtime with LTS
- API layer for auth, users, roles, modules, config, updates and storage
- Admin UI served from the framework’s templated frontend layer
- MySQL as default production database
- File system as storage layer for logs, uploads, backups and cache artifacts
- No direct FTP/FTPS inside runtime logic

#### Provider-Abstraktion

- `provider-manager` and `provider-adapter` layer
- default provider interfaces:
  - cPanel deployment adapter
  - own-server adapter
  - cloud provider adapter
  - local provider adapter
- provider config is handled by admin and env config, not by direct source-code assumptions

#### cPanel/FTPS-Umgebung

- cPanel + FTPS is the first concrete infrastructure used for deployment
- FTPS is a deployment transport, not part of the runtime architecture
- Runtime code must not depend on cPanel-specific implementation details
- Deployment must remain separable from the framework core

#### Sichere API-Kommunikation

- server-side session validation
- secure cookies and API route protection
- route-based permission enforcement
- no client-side-only authorization checks
- protected admin and system routes by role and scope

#### Serverkonfiguration über Admin-Bereich

- active app ID
- default storage mode
- app name and display config
- provider connection settings
- update source settings
- backup configuration
- notification and logging defaults
- security defaults
- maintenance settings

### 4. App- und Update-System

#### Laufzeitablauf beim Start

1. App startet
2. Framework initialisiert Runtime-Context und App-Isolation
3. Konfiguration wird geladen
4. aktive App und aktive Module werden bestimmt
5. Versionen werden geprüft
6. Module- und Dependency-Checks werden ausgeführt
7. Update-Quelle wird aufgelöst
8. verfügbare Updates werden geprüft
9. Kompatibilitätsregeln werden validiert
10. Nutzer/Admin erhalten Hinweis bei Aktualisierungen
11. Update wird nur nach freigegebenem Richtlinien- und Sicherheitscheck durchgeführt

#### Update-Provider-Architektur

- Provider interface for source selection
- current provider can be same server or managed provider
- later provider sources may include store or external marketplace
- update plan must tolerate provider changes without code rewrites

#### Update-Policy

- stable / beta channels configurable
- critical update checks before normal updates
- compatibility check for module dependencies
- signed package or hash validation where applicable
- rollback path for failed updates

### 5. Benutzer-Backup-Design

Das Backup-System bleibt schlank und klar getrennt.

#### Persönliche Daten

- user profile settings
- personal configuration
- app states relevant to the user
- required metadata for recovery
- user-scoped exports

#### Fotos/Medien

- included only when entitlement allows it
- optional upload and restore quota per plan
- no media exposure beyond the user scope

#### Wiederherstellung

- restore selected backup set
- device change support
- restore step-by-step with validation
- no system-wide override without admin approval

#### Freie / Bezahlte Funktionen

- Free: minimal or no personal backup
- Paid: personal backups enabled according to entitlement policy
- system backup and user backup remain separate domains

### 6. Modularität und spätere Fachmodule

Neue Fachmodule werden später unabhängig hinzugefügt, ohne den Core umzubauen.

Jedes Fachmodul muss sein:
- eigene Oberfläche
- eigene Konfiguration
- eigene Datenstrukturen oder Daten-Namespaces
- eigene Berechtigungen
- eigene Entitlement-Anforderungen
- eigene Update-/Version-Policy

Technische Regeln:
- keine harte Core-Abhängigkeit
- modulare Discovery-API
- registriertes Modul mit metadata and lifecycle
- restricted cross-module communication via contracts
- no direct rewrite of core components

### 7. Reihenfolge der Umsetzung

Die technische Reihenfolge sollte nicht nach Produktfunktion, sondern nach Abhängigkeiten gebaut werden.

#### Phase 1 – Fundament

- stable runtime bootstrap
- environment and configuration
- health endpoints and logger
- application and runtime isolation
- admin shell skeleton

#### Phase 2 – Security/Auth

- password hashing
- login flow
- role resolution
- server-side session handling
- admin access enforcement
- secure API route protection

#### Phase 3 – Daten/API

- MySQL and DB adapter layer
- users, roles, config storage
- API routes and response format
- audit event model

#### Phase 4 – Module-System

- registry
- metadata schema
- enable/disable lifecycle
- version checks
- permission mapping

#### Phase 5 – Admin-CMS

- dashboard
- user management
- roles and permissions
- logs and security views
- module governance
- configuration pages

#### Phase 6 – Storage/Provider

- storage interfaces
- backup storage adapter
- provider abstraction
- cPanel deployment adapter
- cloud/local provider adapters

#### Phase 7 – Updates

- version checks
- compatibility validation
- update notifications
- rollback logic

#### Phase 8 – Backup

- system backup and user backup flows
- restore logic
- entitlement checks

#### Phase 9 – Monitoring/Hardening

- health checks
- alerts
- audit review
- rate limiting
- security hardening
- production validation

### 8. Externe Aufgaben, die später außerhalb des Repositories eingerichtet werden müssen

Jede spätere externe Aufgabe muss mit genauer Definition dokumentiert werden und darf nicht im Quellcode verankert sein.

#### 1. MySQL-Datenbank
- Zweck: produktive Datenhaltung für users, roles, sessions, config, modules, logs, audit and app data
- benötigte Werte: DB host, port, database name, username, password, charset, timezone
- Berechtigungen: CREATE, ALTER, INSERT, UPDATE, DELETE, SELECT, INDEX, REFERENCES
- Eintragungsort: .env, provider config, external deployment environment

#### 2. MySQL-Benutzer / Datenbankbenutzer
- Zweck: getrennte Produktiv- und Admin-Zugriffskontrolle
- benötigte Werte: username, password, privileges, host restrictions
- Berechtigungen: application-only permissions, no root rights
- Eintragungsort: deployment secret store or provider config

#### 3. cPanel-Umgebung
- Zweck: deployment and hosting environment for first live provider
- benötigte Werte: domain, root path, Node runtime, app directory, deployment user, FTP/FTPS access details
- Berechtigungen: web file write permissions, environment configuration access, restart permission if applicable
- Eintragungsort: provider admin panel and environment variables

#### 4. Secrets / Zugangsdaten
- Zweck: DB passwords, provider credentials, API keys, signing keys
- benötigte Werte: names, scopes, expiration, owner, rotation plan
- Berechtigungen: minimal secret scope per service/user
- Eintragungsort: environment variables, secret manager, deployment config backend

#### 5. API-Keys / Provider-Keys
- Zweck: external updater, backup provider, monitoring, storage provider
- benötigte Werte: key id, secret, scopes, regions, endpoint URLs
- Berechtigungen: minimal required scopes only
- Eintragungsort: provider secret store or environment variables

#### 6. DNS / Domain / SSL
- Zweck: public routing and secure HTTPS access
- benötigte Werte: domain name, DNS records, SSL certificate target, wildcard status
- Berechtigungen: domain control and DNS management rights
- Eintragungsort: domain registrar and provider admin panel

#### 7. Storage- und Backup-Provider
- Zweck: file objects, snapshots, user backups and provider-managed storage
- benötigte Werte: provider name, endpoint, bucket or path, access key, secret, region
- Berechtigungen: read/write for backup target only, not root-level host access
- Eintragungsort: provider config and env variables

#### 8. Monitoring / Alertsystem
- Zweck: uptime and issue detection
- benötigte Werte: endpoint, alert channels, thresholds, notification addresses
- Berechtigungen: read access to runtime status, alert configuration access
- Eintragungsort: monitoring provider configuration and admin system

### 9. EMPFOHLEN

- Provider-Abstraktion früh einführen, damit cPanel nicht zur hardcoded Core-Dependency wird.
- MySQL als Default-Produktivdatenbank reservieren; SQLite nur als lokale Entwicklungsoption.
- Cookie-basierte Session-Validierung als Standard, erweitert durch Token-Adapter nur als Option.
- Separate backend- and admin-service layer from app and module layers.
- Strict separation of user backup and system backup.
- Version check and compatibility gates before any update or module install.

### 10. ZUKUNFT

- SSO/OAuth integrations
- two-factor login and security policies
- advanced monitoring and alert routing
- modular plugin marketplace with signed packages
- more advanced entitlement policy automation
- provider marketplace with multiple deployment targets

### 11. OFFENE ENTSCHEIDUNG

- Welche konkrete MySQL-Instanz und welche Berechtigungsstruktur wird in der späteren externen Produktivumgebung verwendet?
- Welche Admin-UI-Aufteilung wird im ersten produktiven Release gewählt?
- Welche Store-/Provider-Integration wird als erste externe Update- oder Backup-Quelle genutzt?
- Welche Module gehören zum ersten produktiven Release und welche bleiben als spätere Erweiterung offen?

### 12. Abschluss

Dieser Implementierungsplan dokumentiert den Übergang von der aktuellen neutralen Framework-Basis zu einer stabilen produktiven Server-/Admin-Architektur. Er bleibt konsistent mit der Vision und mit den grundlegenden Dokumentationsregeln: Neutral bleibt das neutrale Master-/Entwicklungsframework; historische Module bleiben Validierungsbeispiele; der produktive Umfang ist Core, Admin-CMS, Auth, Rollen, API, Storage, Updates, Backups, Provider- und Sicherheitsarchitektur sowie modulare Erweiterungen ohne harte Core-Abhängigkeit.

## EMPFOHLEN / ZUKUNFT / OFFENE ENTSCHEIDUNG

- EMPFOHLEN: Eine saubere Provider-Abstraktion mit einem klaren Interface für Server-Config, Storage, Backup und Auth-Adapter wird als beste langfristige Lösung empfohlen. Damit bleibt das Framework neutral, ohne Hardcodierungen auf cPanel, FTP oder ein einzelnes Hosting-Umfeld.
- ZUKUNFT: Für die produktive API-Authentifizierung sollte eine eigene tokenbasierte Auth-Schicht als separates Adapterkonzept ergänzt werden, parallel und sauber getrennt von serverseitigen Cookie-Sessions.
- OFFENE ENTSCHEIDUNG: Die genaue produktive Datenbank-Instanz, das Berechtigungsmodell, der Provider-Setup und die konkret zu verwendenden Betriebs- und Zugangsdaten müssen erst im späteren Deployment-Kontext abgeschlossen werden; sie gehören nicht in das Repository als Quellcode oder Secret-Logik.

- Ergebnis: Die bestehende Offline-First-Architektur wurde weiter stabilisiert, die sichtbare User-UI gemäß der neutralen Plattformanforderung korrigiert und die Admin-/GPS-Verwaltung realisiert.
- Entscheidungslog: `VISION.md` bleibt unverändert. Es wurden keine grundlegenden Neuarchitekturen eingeführt; die vorhandene Offline-First-Struktur wurde konsolidiert, die Auth-/Session-Abläufe, die app-übergreifende App-Identifikation und die Module-Management-UI in den bestehenden Rahmen integriert und dokumentiert.
- Architekturstatus:
  - Neutraler Core: stabilisiert.
  - Final Framework / App-UI / Admin-UI: stabilisiert und als neutraler Framework-Standard definiert.
  - Module-Registry und Module-Manager: aktiv und nutzbar, aber nicht mit festen Fachmodulen aus der historischen Validierung verbunden.
  - Auth, Rollen, Berechtigungen und Developer-Bootstrap: stabilisiert.
  - Layout-/Theme-Management: stabil.
  - Medien-/Upload-Optimierung: validiert.
  - Offline/Online-Handling: lokal stabilisiert und für den internen Preview-Workflow nutzbar.
  - Marketplace/Advertising: bewusst offen gelassen; keine separate Produktfunktion.
  - Fachlich konkrete App-Logik: bewusst nicht im Core hardcodiert; sie bleibt neutral im Framework und in Modulen.
  - Historische Validierungsbeispiele wie GPS, Store, Retail, Catch Log und Fishing Spots werden nicht als aktueller Frameworkumfang interpretiert.
- Geregelte Anforderungen und Korrekturen:
  - App-Name zentralisiert: Der sichtbare Name wird aus der zentralen Konfiguration gelesen und nicht mehr lokal hart codiert.
  - Startseite neutral: Beim Aufruf von `webroot/index.html` erscheint keine „Modules“-Seite als Hauptinhalt; stattdessen eine neutrale Startseite mit öffnbaren Modulen.
  - Login-Button erhalten: Der normale Login-Einstieg bleibt in der Top-Right-Navigation erhalten.
  - Module als Navigation: Aktivierte Module werden als direkte Buttons dargestellt; technische Namen und sichtbare Namen sind getrennt.
  - Offline-Login: Der lokale Developer-Setup und der Login-Flow verwenden denselben Hash-basierten persistenten Zustand.
  - Keine Klartext-Passwörter: Legacy-Keys mit Klartext-Werten werden beim Setup/Migration nicht weiter verwendet.
  - Session-Schutz: Persistierte Sitzungen werden nur noch im vorhandenen Browser-Storage als gültig anerkannt und nicht in Nicht-Browser-Umgebungen missbraucht.
  - App-Isolation: Jede App besitzt jetzt einen eigenen Runtime-/Admin-Context, eigene Storage-Namespace und eigene aktive App-Auswahl, damit keine App über einen globalen Shared-State mit anderen Apps kollidiert.
  - App-Konfiguration im Admin: Der Admin kann jetzt aktive App, App-Name, Modus und Standard-Speicherstrategie direkt über ein CMS-artiges Konfigurationspanel setzen, statt das Framework per hardcoded Code zu ergänzen.
  - App-Name-Resolution: Die User-UI liest den sichtbaren App-Namen jetzt aus dem runtime-aktiven App-Kontext, sodass nach einem App-Wechsel im Admin die sichtbare Oberfläche konsistent zur gewählten App bleibt und nicht an einer veralteten Default-Konfiguration hängen bleibt.
  - Neutraler Default-Context: Die Laufzeit startet jetzt mit einem generischen `neutral-app`-Kontext statt einer festverdrahteten Retail- oder Produkt-ID. `Retail Demo` bleibt als Referenz-/Test-Template erhalten, ist aber keine Standard-App und keine zweite dauerhafte Parallel-Architektur.
  - Server-Bootstrap: Die Initialisierung verwendet jetzt einen pro-App-Setup-Flow statt hart codierter Global-Registrierungen; die aktive App wird nach Priorität des App-IDs-Setups initialisiert.
  - Generische Data-/Schema-Engine: Das Framework kann jetzt app-spezifische Entity-Schemata registrieren, Datensätze mit Validierung und Default-Werten erstellen, aktualisieren und löschen und diese Einträge über den vorhandenen Storage-Adapter persistent halten, damit spätere Module und App-/Template-Patterns ohne Core-Rework entstehen können.
  - Admin-Data-UI: Im CMS-artigen Admin-Bereich existiert jetzt eine eigene "Data"-Ansicht, in der Schemata erstellt, Felder definiert, aktualisiert und Datensätze direkt im Rahmen der aktiven App verwaltet werden können.
  - Historische Validierung: Referenzmodule wie GPS, Store, Retail, Catch Log und Fishing Spots wurden im Entwicklungsprozess genutzt, um Modulregistrierung, Datenmodelle, Geolocation- und UI-Integration zu validieren. Sie sind keine aktiven Bestandteile des Neutral-Core und keine Produktfunktion des Frameworks.
  - Prüfungen:
  - `npm test` wurde erfolgreich ausgeführt.
  - HISTORISCHE VALIDIERUNG: Auth-Reload, lokale Hash-Speicherung, zentrale App-Name-Konfiguration, GPS-Modul-Lebenszyklus, Admin-Module-Verwaltung, GPS-Admin-Aktionen und UI-Seitendarstellung. Diese Punkte dokumentieren vergangene Architektur- und Modulvalidierung, nicht den aktuellen Frameworkumfang.
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
   - MySQL als produktive Standard-DB für Serverbetrieb und Multi-User-Umgebungen
   - SQLite nur als lokale Test-/Entwicklungsoption und nicht als gleichwertige produktive Zielarchitektur
   - Dateien für Konfigurations- und Log-Ausgaben
   - optional Session-Store im DB-Backend statt reinem Browser-Storage

Empfohlene grundlegende Technologie:

- Node.js LTS
- CommonJS (mit dem bestehenden Projekt kompatibel)
- Express oder ein minimalistischer eigener HTTP-Router je nach vorhandener Codebasis
- MySQL als primäre produktive Datenbankarchitektur; SQLite nur für lokale Test-/Entwicklungs-Setups
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
- DB-/File-Adapter statt rein lokalem Runtime-State, mit klarer produktiver MySQL-Standardstrategie
- standardsichere Passwort-Hashing-Strategie (`bcrypt`/`argon2`)
- sauber geschichtete API- und Service-Layer
- separate Produktiv-Deployment-Struktur für `cPanel-meinServer`
- klarer Trennung zwischen Entwicklungs-/Master-Repo und deploybarem Server-Repo

Wo noch Entscheidungen von mir notwendig sind:

- Welche konkrete MySQL-Instanz, Provider-Umgebung und Berechtigungsstruktur wird in der späteren externen Produktivumgebung ausgewählt?
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

- Welche konkrete MySQL-Instanz, welche Berechtigungen und welcher Provider-/Server-Kontext werden in der späteren externen Produktivumgebung verwendet?
- Produktspezifischer App-/Admin-Mix: gemeinsame UI oder getrennte Admin-Anwendung?
- Session-Mechanik: Cookie-Session oder JWT?
- Deployment-Modell: einzelner Node-Startpoint oder mehrere Worker-/Services?
- Übergang vom lokalem Preview-Modus zu sicherem Produktiv-Auth-Modell muss klar dokumentiert werden.
- Welche Module gelten als produktiver Minimal-Set für den ersten produktiven Deploy?

Fazit:

Die aktuelle Umsetzung in `Neutral` ist technisch machbar und inhaltlich passend als Master-/Entwicklungsbasis. Die Architektur ist bereits modular und neutral genug, um sie später in eine produktive Server-/Admin-Anwendung umzubauen. Der eigentliche produktive Übergang nach `cPanel-meinServer` ist deshalb nicht technisch fraglich, sondern vor allem eine Frage der Finalisierung der Sicherheits-, Datenbank- und Betriebsentscheidungen. Die Umsetzung ist grundsätzlich realisierbar, sofern die Produktiv-Entscheidungen vor dem Transfer konkret getroffen werden.

# Machbarkeits- und Architekturprüfung für die spätere Serverversion

## 1. Ziel und Ausgangspunkt

Das Repository `Neutral` zeigt bereits einen sehr soliden Entwicklungs- und Master-Basis-Stand. Die vorhandene Architektur in `platform/`, `server/`, `apps/`, `webroot/` und `config/` ist nicht nur ein Prototyp, sondern ein echtes Framework-Gerüst mit:

- App-/Runtime-Registrierung
- Modul-Registry und Manager
- Admin-/User-UI
- Rollen- und Berechtigungs-Struktur
- Offline-First-Ansatz
- App-Isolation und Storage-Namespaces
- Generischer Daten-/Schema-Engine
- CMS-artigem Admin-/Config-Workflow

Die zentrale Vision aus `VISION.md` ist eindeutig: `Neutral` bleibt die Master-/Entwicklungsbasis, während `cPanel-meinServer` später die produktive Server-Instanz ist. Daraus folgt: Die Architektur für den produktiven Server darf nicht aus einem reinen Frontend- oder Demo-Setup bestehen, sondern muss als produktive Betriebstauglichkeit mit Sicherheit, Audit, Sessions, Persistence und cPanel-Deployment geplant werden.

### 1.1 Abgleich mit vorhandener Dokumentation

Es gibt im aktuellen Repository keine eigene `README.md`; die operative Grundlage ist deshalb `VISION.md`, `WORKFLOW.md`, `AGENTTODO.md` und `VERSION.md`. Die wichtigsten Aussagen sind:

- `Neutral` ist Master-/Entwicklungsumgebung.
- Die fertigen produktiven Serverdateien werden in ein separates Repo ausgelagert.
- Neutral soll neutral, modular und wiederverwendbar sein.
- Offline-First ist ausdrücklich gewünscht.
- Admin-/User-Bereiche können gemeinsam in einer App verwendet werden.
- Core, Framework, App, Module und Serverbereich müssen sauber getrennt bleiben.

## 2. Bereichsprüfung nach der gewünschten 4-Felder-Struktur

### 2.1 Offline-First

1. Bereits vorhanden
   - Offline-First ist in der Vision ausdrücklich verankert.
   - Laufzeit-, App- und Storage-Kontexts existieren bereits.
   - Der aktuelle Code arbeitet mit lokaler Persistenz und Browser-Storage-Mechaniken.

2. Von uns ausdrücklich gewünscht
   - Offline-Support als Grundprinzip.
   - Funktionalität auch ohne permanente Serververbindung.
   - Später gezielte Synchronisation bei Online-Verbindung.

3. Sinnvolle technische Ergänzungen
   - lokale Queue für Operationen, die später synchronisiert werden
   - Sync-Engine mit Konfliktstrategie
   - Differenzierung zwischen lokalem Cache und serverseitig autoritativem Datensatz
   - Offline-Status, Last-Sync-Zeit, Retry-Mechanik

4. Für später architektonisch vorzusehende Funktionen
   - Synchronisations-API
   - Versionierung von Modellen und Datensätzen
   - Konfliktlöser und Audit-Trail für Datenänderungen
   - Queued Writes mit Konsistenz- und Recovery-Mechanik

Nutzen: hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.2 Admin-Bereich

1. Bereits vorhanden
   - Admin-UI und App-UI sind im Rahmen derselben generischen Architektur bereits angelegt.
   - App-Management, Module-Management, Rollen-/Permission-Ansichten und Konfigurationsbereiche existieren teilweise in der Laufzeit.
   - System-/Audit-/Monitoring-Ansätze sind bereits in den Framework-Konzepten sichtbar.

2. Von uns ausdrücklich gewünscht
   - Login, Authentifizierung, Session-Handling
   - Benutzerverwaltung
   - Rollen und Berechtigungen
   - Dashboard
   - Module-/Feature-Governance
   - Systemstatus, Logs, Health Checks
   - Konfigurationen verwalten

3. Sinnvolle technische Ergänzungen
   - serverseitige Rollenprüfung auf jeder Anfrage
   - zentrale Audit-Logs mit Benutzer, Zeitstempel und Ressource
   - Admin-Subbereiche: users, roles, modules, config, logs, health, backups
   - separate Security-Policies pro App und per Rolle

4. Für später architektonisch vorzusehende Funktionen
   - Einrichtungs- und Setup-Wizard
   - Aktivitäts- und Zugriff-Reports
   - Auto-Logout, Idle-Timeout, Login-History
   - zwei-Faktor-Authentifizierung als Option

Nutzen: sehr hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.3 Login, Authentifizierung und Sessions

1. Bereits vorhanden
   - Auth- und Session-Modelle sind teilweise in der Runtime sichtbar.
   - Browser-Storage-Session-Mechanik wird bereits berücksichtigt.

2. Von uns ausdrücklich gewünscht
   - sichere Login-Mechanik
   - sichere Session-Mechanik
   - Server-Authentifizierung statt reinem Browser-Status
   - Zugriffsschutz je Rolle und Berechtigung

3. Sinnvolle technische Ergänzungen
   - HttpOnly-, Secure- und SameSite-Cookies
   - Session-Store auf Serverseite oder DB
   - Login-Rate-Limitierung
   - Passwort-Hashing mit bcrypt/argon2
   - Rollen- und Berechtigungsprüfung auf Backend-Ebene

4. Für später architektonisch vorzusehende Funktionen
   - TTL-/Idle-Timeout-Policies
   - Device-Tracking und Session-List
   - Token-Refresh-Flow
   - MFA und Device-Trust

Nutzen: extrem hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.4 Benutzer, Rollen und Berechtigungen

1. Bereits vorhanden
   - Rollen- und Permissions-Modelle sind bereits im Framework sichtbar.
   - App-spezifische Rechte-Matrix und Modul-Zugriffskontrolle existieren.

2. Von uns ausdrücklich gewünscht
   - Rollen mit klaren Zugriffsbeschränkungen
   - systemweite und app-spezifische Rechte
   - unterschiedliche Berechtigungsdefinitionen für Admin, Developer, Manager, User, Member

3. Sinnvolle technische Ergänzungen
   - zentrale Policy-Engine
   - Ressource-basierte Rechte statt nur Rollenname
   - Rechtekaskaden und Audit für Rollenänderungen
   - Berechtigungsprüfung nicht im Frontend, sondern im API-Layer

4. Für später architektonisch vorzusehende Funktionen
   - RBAC- und ABAC-Mix
   - Teams-/Gruppenrechte
   - API-Key-Berechtigungen
   - geänderte Rechte mit Aktivitätslog sichtbar machen

Nutzen: sehr hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.5 Sicherheit

1. Bereits vorhanden
   - Sicherheits- und Permission-Konzepte existieren im Framework.
   - App-Isolation und Storage-Namespace-Schutz sind bereits vorgesehen.

2. Von uns ausdrücklich gewünscht
   - Keine Klartext-Passwörter
   - Schutz vor CSRF/XSS/Injection
   - geschützte Administratorzugriffe
   - sichere Geheimnisse
   - Audit- und Fehlerlogs

3. Sinnvolle technische Ergänzungen
   - Helmet-ähnliche Header-Sicherheit
   - CSP, HSTS, X-Frame-Options, Referrer-Policy
   - Input-Validierung und Output-Filtering
   - Rate-Limits auf Login, API, Admin-Endpoints
   - Geheimnisspeicherung in Umgebungsvariablen oder cPanel-Umgebungssektion

4. Für später architektonisch vorzusehende Funktionen
   - WAF-ähnliche Sicherheitsfilter
   - Security-Healthchecks
   - Malware-/Upload-Sicherheitsprüfung
   - regelmäßige Security-Scan- und Audit-Checks

Nutzen: extrem hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.6 API und API-Keys

1. Bereits vorhanden
   - Server-Client-Architektur und API-Orientierung sind im System bereits angelegt.
   - Framework-Struktur deutet bereits auf API-basierte Kommunikation hin.

2. Von uns ausdrücklich gewünscht
   - API für Auth, Users, Roles, Config, Modules, Logs, Health
   - API-Schlüssel für externe Integrationen bzw. Systemzugriffe
   - klare Request/Response-Struktur

3. Sinnvolle technische Ergänzungen
   - REST-API mit definiertem Fehlercode-System
   - API-Key-Management mit Rotation, Roll- und Scope-Check
   - definierte Rate-Limits und perfekte Trennung zwischen Admin-/App-/Public-Endpunkten
   - Health-/Status-Endpunkte, auch für cPanel-Checks

4. Für später architektonisch vorzusehende Funktionen
   - Webhook-/Event-Mechanik
   - API-Versionierung
   - OAuth- oder SSO-Optionen für spätere Integrationen

Nutzen: hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.7 Datenbank und Storage

1. Bereits vorhanden
   - Framework hat generische Data-/Schema-Engine, Storage-Adapter und lokale Persistenzkonzepte.
   - File-Storage, lokale Test-/Entwicklungs-Varianten und allgemeine Storage-Abstraktion sind in der aktuellen Umsetzung sichtbar.

2. Von uns ausdrücklich gewünscht
   - persistente Datenspeicherung für Users, Sessions, Logs, Roles, Modules, Config
   - Storage-Strategie für Module und App-Funktionen
   - Trennung von Laufzeit-/Konfigurationsdaten und produktiven Businessdaten

3. Sinnvolle technische Ergänzungen
   - MySQL als primäre produktive Standard-DB für den Serverbetrieb
   - SQLite nur als lokale Test-/Entwicklungsoption, nicht als produktive Zielarchitektur
   - klare Storage-Adapter-Definition: file, mysql, future redis; SQLite nur für lokale Entwicklungs- und Test-Setups
   - Monetarisierung/Backup-Strategien für DBs und Dateien

4. Für später architektonisch vorzusehende Funktionen
   - Archiv-/Backup-Strategien
   - Datenverschlüsselung bei sensiblen Feldern
   - Read-Replica-/Failover-Modelle
   - automatische Datenmigrations-Mechanik

Nutzen: extrem hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.8 Backup/Restore

1. Bereits vorhanden
   - Keine echte produktive Backup-/Restore-Strategie im aktuellen Repo sichtbar.

2. Von uns ausdrücklich gewünscht
   - sichere tägliche Backups
   - Wiederherstellung von Konfigurationen, Daten und Logs

3. Sinnvolle technische Ergänzungen
   - DB-Dumps und Datei-Backups automatisiert
   - Backup-Ordner mit Zeitstempel
   - Restore-Skript zur Wiederherstellung auf neustem Server
   - Restore-Prozedur mit Validierung

4. Für später architektonisch vorzusehende Funktionen
   - Versionierte Backups
   - Gezielte Wiederherstellung einzelner Module oder App-Daten
   - Backup-Audits und Restore-Tests

Nutzen: hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.9 Module Registry / Module Manager

1. Bereits vorhanden
   - Module-Registry, Module-Manager und App-Metadaten existieren bereits.
   - Module können aktiv/deaktiviert, verwaltet und auf generische Weise registriert werden.

2. Von uns ausdrücklich gewünscht
   - modulare Produktentwicklung ohne Core-Change
   - getrennte Module für Logik, UI, Rechte und Datenmodelle

3. Sinnvolle technische Ergänzungen
   - Module-lokale Manifestdefinitionen
   - Versionskontrolle und Abhängigkeits-Check zwischen Modulen
   - eingeschränkte Module-Installationen auf Server-Instanz
   - API-Readiness-Checks für Module

4. Für später architektonisch vorzusehende Funktionen
   - Plugin-Verwaltung mit Install/Update/Remove
   - Modul-Compatibility-Checks
   - Modullokalisierung und Theme-Definitionen

Nutzen: sehr hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.10 App-Isolation und Storage-Namespaces

1. Bereits vorhanden
   - App-Isolation und namespacespezifischer State sind bereits in der bestehenden Architektur sichtbar.

2. Von uns ausdrücklich gewünscht
   - Jede App darf nicht mit einer anderen App kollidieren.
   - getrennter Storage- und Runtime-Kontext pro App

3. Sinnvolle technische Ergänzungen
   - App-ID-basierte Daten- und Session-Namespaces
   - separate Konfigurations- und Logs-Ordner pro App
   - genaue Freigabe- und Zugriffspolitik zwischen App-Instanzen

4. Für später architektonisch vorzusehende Funktionen
   - Multi-App-Management im Admin
   - Tenant-/Mandant-Workspace-Modelle

Nutzen: hoch. Aufwand: mittel. Jetzt berücksichtigen: ja.

### 2.11 CMS/Content

1. Bereits vorhanden
   - rote Ansätze zu Data-Schemas, App-Konfiguration, Content-Engines und adminisierten Datenansichten sind bereits im Framework sichtbar.

2. Von uns ausdrücklich gewünscht
   - CMS-ähnliche Verwaltung von Konfigurationen, Daten, Modulen und Features

3. Sinnvolle technische Ergänzungen
   - Content-Models mit Feldern, Typen und Validierung
   - Content-Versionierung und Publish/Unpublish
   - Content- und Struktur-Templates je App

4. Für später architektonisch vorzusehende Funktionen
   - Media-Management
   - Rich-Content-Editor
   - Content-Workflow mit Rollen und Freigaben

Nutzen: mittel bis hoch. Aufwand: mittel. Jetzt berücksichtigen: ja, als Erweiterungsebene.

### 2.12 GPS, Store, Systemadministration, Logs, Monitoring, Health Checks

1. Bereits vorhanden
   - GPS-Integration, Store-/Business-Template und Admin-Logik sind bereits als Teil des Frameworks sichtbar.

2. Von uns ausdrücklich gewünscht
   - GPS als echtes App-/Modul-Funktionalität
   - Store-Modelle mit Produkten, Kategorien, Kunden und Bestellungen
   - Systemadministration, Logs, Health-Checks, Monitoring

3. Sinnvolle technische Ergänzungen
   - georeferenzierte Datenmodelle mit Geo-JSON- oder lat/lon-Fields
   - Store-Orders mit Status-Workflows
   - Monitoring-Endpunkte für CPU, Speicher, DB, Disk, API-Fehler
   - Log-Level-Handling und Aggregation

4. Für später architektonisch vorzusehende Funktionen
   - Cronjobs
   - Queues für asynchrone Tasks
   - Alerting-Systeme
   - System-Metrics-Dashboard

Nutzen: hoch. Aufwand: mittel bis hoch. Jetzt berücksichtigen: ja.

## 3. Empfohlene Serverarchitektur

Die produktive Serverarchitektur sollte im Kontext von `cPanel-meinServer` wie folgt aufgebaut werden:

- Schicht 1: Reverse-Proxy / Web-Entry / cPanel-Front-End
- Schicht 2: Node.js HTTP-Server
- Schicht 3: API-Layer
- Schicht 4: Service-Layer
- Schicht 5: Framework-/Runtime-Layer
- Schicht 6: Storage-/DB-Layer
- Schicht 7: Logging, Monitoring, Audit-Layer

Empfohlene technische Basis:

- Node.js LTS
- Express oder eigener HTTP-Router
- SQLite für kleine bis mittlere Produktivumgebungen
- MySQL als robustere Produktiv-Option für größere Mehrbenutzer-Umgebungen
- `bcrypt` oder `argon2` für Passwörter
- `helmet`/ähnliche Security-Header
- `dotenv` für Umgebungsparameter
- `winston` oder eigener Logger
- `node-cron` nur, falls Jobs/Cron benötigt werden

## 4. Vollständige geplante Verzeichnisstruktur

```text
cPanel-meinServer/
├── package.json
├── .env.example
├── .gitignore
├── server/
│   ├── server.js
│   ├── bootstrap/
│   │   └── server.js
│   ├── api/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── roles.js
│   │   ├── modules.js
│   │   ├── config.js
│   │   ├── logs.js
│   │   ├── health.js
│   │   └── sync.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── csrf.js
│   │   ├── rate-limit.js
│   │   ├── errors.js
│   │   └── notFound.js
│   ├── services/
│   │   ├── auth-service.js
│   │   ├── user-service.js
│   │   ├── role-service.js
│   │   ├── module-service.js
│   │   ├── config-service.js
│   │   ├── log-service.js
│   │   ├── health-service.js
│   │   └── sync-service.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validator.js
│   │   ├── errors.js
│   │   └── crypto.js
│   └── jobs/
│       ├── sync.js
│       └── cleanup.js
├── config/
│   ├── index.js
│   ├── app-config.js
│   └── env.js
├── public/
│   ├── index.html
│   ├── admin.html
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   └── app.js
├── storage/
│   ├── data/
│   │   ├── sqlite/
│   │   └── json/
│   ├── logs/
│   │   ├── app/
│   │   ├── error/
│   │   └── access/
│   ├── uploads/
│   ├── backups/
│   └── sessions/
├── scripts/
│   ├── start.sh
│   ├── backup.sh
│   └── restore.sh
├── tests/
│   ├── api/
│   └── security/
└── docs/
    ├── deploy.md
    └── security.md
```

## 5. Liste der später benötigten Serverdateien mit Zweck und Funktion

- `server/server.js` – Einstiegspunkt des produktiven Node-Servers.
- `server/bootstrap/server.js` – Initialisierung der App-Umgebung und Runtime-Registrierung.
- `server/api/auth.js` – Login, Logout, Session-Status, Refresh.
- `server/api/users.js` – Nutzerverwaltung und Profilmanagement.
- `server/api/roles.js` – Rollenliste und Rechteverwaltung.
- `server/api/modules.js` – Module aktivieren/deaktivieren und deren Status verwalten.
- `server/api/config.js` – App-/System-Konfiguration verwalten.
- `server/api/logs.js` – Logs lesen und filtern.
- `server/api/health.js` – Server- und Systemstatus für Monitoring.
- `server/middleware/auth.js` – Login-/Session-Authentifizierung prüfen.
- `server/middleware/csrf.js` – CSRF-Schutz für Form-/API-Requests.
- `server/middleware/rate-limit.js` – Login-/API-Request-Limits.
- `server/middleware/errors.js` – zentrale Fehlerbehandlung.
- `server/services/auth-service.js` – Passwort-/Session-/Login-Logik.
- `server/services/user-service.js` – User-CRUD und Profile.
- `server/services/role-service.js` – Rollen-/Permission-Policies.
- `server/services/module-service.js` – Module Governance.
- `server/services/config-service.js` – Konfigurationsmanagement.
- `server/services/log-service.js` – Logaggregation und Audit.
- `server/services/health-service.js` – System- und Serverstatus.
- `server/utils/logger.js` – zentrale Log-Schicht.
- `server/utils/validator.js` – Input- und Schema-Validierung.
- `config/index.js` – grundlegende Konfiguration.
- `public/index.html` – Produktiv-Frontend-Startseite.
- `public/admin.html` – Admin-Bereich.
- `public/app.js` – Frontend-Initialisierung.
- `storage/data/sqlite/*` – DB-Dateien oder Storage-Backends.
- `storage/logs/*` – Fehler-, Login-, Admin- und Access-Logs.
- `storage/backups/*` – Backup-Dateien und Recovery-Archive.

## 6. Sicherheitskonzept

- Passwörter immer nur als Hash; nie Klartext.
- Session-IDs und API-Keys mit hoher Entropie.
- HttpOnly-, Secure- und SameSite-Cookies.
- Admin-Endpunkte nur mit Auth + Rollenprüfung.
- API-Keys mit Scope, Rotation und Revocation.
- CSRF-Protection für Webformular- und Cookie-basierte Interaktionen.
- XSS-Schutz durch sichere Rendering-Strategien und Sanitizing.
- strict Input Validation auf allen API-Endpunkten.
- Rate-Limits für Login, API-Keys und Admin-Aktionen.
- Log-Sanitization um Passwörter, Tokens und Secrets niemals zu speichern.
- Secret-Handling über Umgebungsvariablen / cPanel-Environment, nicht im Git.

## 7. Daten-/Storage-Konzept

Empfehlung:

- App-Konfiguration und Systemeinstellungen in DB oder JSON-Konfigurationsdateien, je nach Deployment-Umfeld.
- User, Sessions, Roles, Permissions, Logs und Audit-Events in der produktiven Datenbank.
- Uploads und Medien in `storage/uploads`.
- Backups in `storage/backups`.
- Datei- bzw. JSON-Formate nur dort einsetzen, wo cPanel-Umgebung oder Umfang eine einfache Lösung erfordert.

Produktive Standardstrategie:

- MySQL ist die primäre produktive Zielarchitektur für den Serverbetrieb.
- SQLite bleibt nur als lokale Test-/Entwicklungsoption zulässig und darf nicht als gleichwertige produktive Zielarchitektur gelten.
- Ein späteres Upgrade auf MySQL ist keine neue Architekturentscheidung, sondern die konsistente produktive Standardumgebung des Frameworks.

## 8. API-Konzept

- `GET /api/health` – Systemstatus
- `POST /api/auth/login` – Login
- `POST /api/auth/logout` – Logout
- `GET /api/auth/session` – Session-/Userstatus
- `GET /api/users` / `POST /api/users` / `GET /api/users/:id` / `PUT /api/users/:id`
- `GET /api/roles` / `POST /api/roles`
- `GET /api/modules` / `POST /api/modules/:id/enable` / `disable`
- `GET /api/config` / `PUT /api/config`
- `GET /api/logs` / `GET /api/system/info`
- `POST /api/sync` – falls Offline-Sync aktiviert werden soll

Response-Struktur:

```json
{
  "ok": true,
  "data": { "...": "..." },
  "meta": { "timestamp": "..." },
  "error": null
}
```

Fehlercodes:

- `AUTH_REQUIRED`
- `AUTH_INVALID`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`

## 9. Deployment-Konzept

`Neutral` bleibt die Master-/Entwicklungsbasis. `cPanel-meinServer` ist das produktive Server-Repository.

Wichtig für den Transfer:

- nur produktive Dateien aus `Neutral` in `cPanel-meinServer`
- keine Test- und Entwicklungsdateien
- keine Dokumentations- oder Vision-Dateien, sofern sie dort nicht als Betriebsdokumente nötig sind
- keine lokalen Secrets und keine echten `.env`-Werte
- nur die tatsächliche Server- und UI-Logik, die am produktiven Server laufen muss

Empfohlener Ablauf:

1. produktive Serverarchitektur in `Neutral` als Referenz definieren
2. korrektes Deployment-Subset in `cPanel-meinServer` erzeugen
3. GitHub-Actions/FTPS-Sync auf cPanel-FTP-Root planen
4. produktive Start- und Health-Checks konfigurieren
5. Server mit `.env` aus cPanel-Umgebung betreiben

## 10. cPanel-Kompatibilität

Die Struktur ist grundsätzlich cPanel-kompatibel, sofern Node.js im Hosting aktiviert ist. cPanel + FTPS ist die erste konkrete Provider-Umgebung, aber keine feste Architekturbindung. Für den produktiven Betrieb ist entscheidend:

- Node-LTS verfügbar
- Schreibrechte auf den Serverordner
- Umgebungsvariablen oder `.env` nutzbar
- keine rein lokalen Browser-Session-Mechaniken als einzige Autorität
- stabile App-Shell, API-Endpunkte und DB-Persistence
- Provider-/Infrastruktur-Schicht abstrahiert genug, damit spätere Server, Hosting-Umgebungen oder Cloud-Systeme einfach eingebunden werden können

Damit ist der Architekturplan für cPanel als realistisch und umsetzbar einzuordnen, ohne dass cPanel zur dauerhaften Standardarchitektur wird.

## 11. Funktional-Ergänzungen, die sinnvoll sind, aber bisher nicht im Fokus lagen

- API-Key-Management
- Backup- und Restore-Skripte
- Sync-Queue und Offline-Handler
- Session-Management mit TTL + Device-Tracking
- Log-Aggregation und Health-Metrics
- adminseitige Audit-/Activity-Feed
- Cronjobs für Cleanup, Sync, Reporting
- Queue-System für asynchrone Aufgaben
- optionaler Media- und Upload-Manager
- optionales SSO/OAuth, falls spätere Integrationen erforderlich werden

Bewertung:

- Nutzen: meist hoch
- Aufwand: mittel
- Jetzt berücksichtigen: ja, aber sauber in Phasen aufteilen

## 12. Gesamtbeurteilung

Die bestehende Architektur in `Neutral` ist nicht nur grundsätzlich geeignet, sondern bereits inhaltlich sehr nah an einer produktiven serverseitigen Basis. Die wichtigsten Lücken betreffen nicht den Grundgedanken, sondern die Produktiv-Qualität: echte serverseitige Auth, robuste Sessions, robuste Datenspeicherung, Backups, Audit-Logs, Monitoring, Security-Policies und cleanes Deployment-Subset für `cPanel-meinServer`.

Die technische Machbarkeit ist gegeben. Die richtige Architektur ist klar definiert. Die wichtigste Entscheidung, die noch von uns getroffen werden muss, ist die konkrete extern zu betreibende Produktiv-Umgebung: die genaue MySQL-Instanz, die Provider-/Server-Konfiguration, das Session-Design, die Admin-/UI-Aufteilung und der Umfang des ersten produktiven Release-Setups.

Fazit:

`Neutral` erfüllt bereits die Grundlage für die spätere Server-/Admin-Anwendung. Die produktive Serverversion kann sauber, modular und cPanel-kompatibel geplant werden. Die eigentliche Transfer-Architektur nach `cPanel-meinServer` ist damit technisch machbar und organisatorisch sauber zu trennen.

# Konsolidierte Server- und Infrastrukturplanung (Aktualisiert)

## IST-ZUSTAND

- `Neutral` ist die Master-/Entwicklungsumgebung.
- `cPanel-meinServer` ist die spätere produktive Server-/Deployment-Quelle.
- Die aktuelle cPanel-/FTPS-Infrastruktur funktioniert bereits.
- Die vorhandene Architektur enthält bereits Framework-Kerne, App-/Module-Registry, Admin-/User-UI, App-Isolation, Runtime-Kontext, Rollen-/Permission-Logik und Offline-First-Konzepte.
- Die produktive Server-Architektur wurde bisher als Planungsbasis definiert, aber noch nicht als finales, deploybares Server-Repository implementiert.
- Die Anwendung selbst ist nicht als FTP-Client für ihre eigenen Serverdateien gedacht; der FTP-/FTPS-Transfer ist ausschließlich ein Deploymentweg.

## GEWÜNSCHT

- Späterer Ablauf: `Neutral` -> fertige Serverdateien -> `cPanel-meinServer` -> GitHub Actions -> FTPS -> cPanel.
- Die Anwendung darf zur Laufzeit nicht auf ihren eigenen Dateien per FTP oder FTPS zugreifen.
- FTPS ist ausschließlich für Deployment und nicht für Laufzeit- oder Betriebskommunikation.
- Die cPanel-Infrastruktur ist heute die erste konkrete Hosting-Umgebung, aber die Anwendung muss später nicht an diese Infrastruktur gebunden sein.
- Die Infrastruktur-/Provider-Schicht muss abstrahiert werden, damit später andere Server, Verzeichnisse, APIs, Protokolle, Cloud-Umgebungen oder lokale Betriebsumgebungen verbunden werden können.
- Der Admin-Bereich soll die Infrastruktur-Konfiguration verwalten können.
- Sensitive Zugangsdaten müssen niemals im Quellcode liegen.

## EMPFOHLEN

### 1. Projektarchitektur

Empfohlener übergeordneter Stil:

- `Neutral` = Master-/Entwicklungsbasis und Architektur-Referenz
- `cPanel-meinServer` = produktive Delivery-Quelle
- `server/` = produktiver Servercode
- `public/` oder `webroot/` = produktive Auslieferungsoberfläche
- `config/` = Laufzeit- und Provider-Konfigurationen
- `storage/` = Daten, Logs, Backups, Uploads, Sessions
- `scripts/` = Deploy- und Restore-Skripte

### 2. Infrastruktur-/Provider-Abstraktion

Empfohlene Struktur:

- `infrastructure/provider-manager`
- `infrastructure/adapter/interface`
- `infrastructure/adapter/cpanel`
- `infrastructure/adapter/custom-server`
- `infrastructure/adapter/cloud-provider`
- `infrastructure/adapter/local`

Ziel:

- Deployment- und Anbieter-Konfiguration müssen als Konfiguration verwaltbar sein.
- Der Admin-Bereich kann später zwischen Provider-Konfigurationen wechseln, ohne feste Hardcoded-Referenzen im Code zu benötigen.
- Der Anwendungsbetrieb bleibt provider-agnostisch, auch wenn der erste reale Provider cPanel ist.

### 3. Admin-Bereich (verbindlich zu berücksichtigen)

Der Admin-Bereich soll umfassen:

- Dashboard
- Benutzerverwaltung
- Rollen
- Berechtigungen
- Login/Logout
- Sessions
- Passwortverwaltung
- Sicherheitsverwaltung
- Systemstatus
- Konfiguration
- Logs
- Audit-Log
- Wartung
- Diagnose
- Modulverwaltung
- Backup/Restore
- Tarif-/Funktionsberechtigungen
- Infrastruktur-/Provider-Konfiguration

### 4. Authentifizierung und Sicherheit

Empfohlene Basissicherheitslage:

- sichere Passwortspeicherung mit `bcrypt` oder `argon2`
- serverseitige Session-Validierung
- HttpOnly-, Secure- und SameSite-Cookies
- Rollen-/Rechteprüfung auf jeder geschützten Anfrage
- CSRF-Schutz für Form- und Cookie-basierte Interaktionen
- XSS-Schutz über sichere Rendering- und Sanitizing-Strategien
- Injection-Schutz durch validierte Eingaben und parametrisierte Datenbankzugriffe
- Rate Limiting für Login, API-Calls und Admin-Aktionen
- Login-Überwachung, Auditierung, fehlgeschlagene Versuche und Anomalie-Erkennung
- Secrets nur in Umgebungsvariablen oder Provider-Umgebung, niemals im Source-Code
- API-Authentifizierung durch Session-, Token- oder API-Key-Systeme mit Scope- und Rollprüfung
- Updateprüfung mit Signatur-/Integritätsprüfung und sichere Installationslogik

### 5. API-Konzept

Empfohlene Grundstruktur:

- `/api/health`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/session`
- `/api/users`
- `/api/roles`
- `/api/modules`
- `/api/config`
- `/api/logs`
- `/api/system/info`
- `/api/backups`
- `/api/updates`
- `/api/providers`
- `/api/webhooks`
- `/api/sync`

Empfohlene Response-Form:

```json
{
  "ok": true,
  "data": { "items": [] },
  "meta": { "timestamp": "2026-08-21T00:00:00Z" },
  "error": null
}
```

Empfohlene Fehlercodes:

- `AUTH_REQUIRED`
- `AUTH_INVALID`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`
- `PROVIDER_ERROR`
- `UPDATE_CHECK_FAILED`

Zusätzlich wichtig:

- API-Versionierung
- API-Key-/Token-Scopes
- Webhook-Mechanik als spätere Erweiterung
- externe API-Anbindungen über abstrakte Provider-Adapter

### 6. Daten und Storage

Empfohlene Grundidee:

- Nutzer, Rollen, Rechte, Sessions, Logs, Config und App-Status in einer Datenbank
- App-/Module-Daten über definierte Storage-Adapter verwalten
- App-Isolation und Storage-Namespaces beibehalten
- Export/Import für Konfiguration und Daten
- Migrationen als erste Produktiv-Notwendigkeit
- Backup/Restore als verbindlicher Server-Bestandteil
- spätere Skalierung durch Storage-Adapter oder DB-Backend-Austausch

Empfohlener Real-Stack:

- MySQL als primäre produktive Standardarchitektur für Serverbetrieb, Mehrbenutzer- und Verwaltungsszenarien
- SQLite nur als lokale Test-/Entwicklungsoption, nicht als produktive Zielarchitektur

Wichtige Storage-Bereiche:

- `storage/data` – systemische und appbezogene Daten
- `storage/logs` – Error-, Access-, Admin-, Login-Logs
- `storage/uploads` – Medien und Uploads
- `storage/backups` – System- und Benutzer-Backups
- `storage/sessions` – falls sessionbasierte Dateispeicherung gewählt wird

### 7. Modulsystem

Das bestehende Modulkonzept muss als produktive Serverfunktion weiterentwickelt werden:

- Module Registry
- Module Manager
- Aktivierung/Deaktivierung
- Konfigurations- und Meta-Management
- Versionen und Update-Checks
- Abhängigkeiten
- Rechte-/Entitlement-Checks
- Plugin-/Extension-Mechanik als spätere Erweiterung

Empfohlene Regeln:

- Module bekommen ihren eigenen Namespace und Verwaltungskontext.
- Module dürfen nicht direkt eine zentrale App- oder Server-Komponente überschreiben.
- Module sollten nur über definierte Schnittstellen mit Core und Server interagieren.

### 8. Offline-First und Synchronisation

Die Offline-First-Architektur bleibt zentral.

Empfohlene Funktionen:

- lokale Datenhaltung und Arbeits-Queue
- Online-/Offline-Status-Erkennung
- Wiederaufnahme unterbrochener Synchronisation
- Konfliktbehandlung mit priorisierten Regeln
- Serverabgleich mit deterministischer Sequenzierung
- lokale Einträge, die nur nach erfolgreichem Sync als serverseitig autoritativ gelten

### 9. App-Isolation und Multi-App/Multi-Tenant

- Jede App bleibt eigenständig.
- Jede App verwendet eigene Daten-/Namespace-/Config-Bereiche.
- Berechtigungen und Modulrechte sind app-spezifisch.
- Eine spätere Multi-App-/Multi-Tenant-Erweiterung soll architektonisch offen bleiben.

Empfohlene Implementierung:

- `appId` als primärer Runtime- und Namespace-Key
- separate Daten-/Konfigurationsräume pro App
- appbezogene Rollen-/Permission-Policy
- klar definierte tenant- oder app-übergreifende Grenzen

### 10. CMS / Content / Seiten / Medien

Empfohlene Inhalte:

- Seiten
- Inhalte
- Medien
- Navigation
- Templates
- Content-Verwaltung
- Konfigurationen

Diese Bereiche sollen als separate Content- oder CMS-Module organisiert werden, damit sie nicht hart in den Server-Core eingebaut sind.

### 11. GPS / Location / Store

Die vorhandenen GPS- und Store-Modelle bleiben Teil der Architektur.

Empfohlene Produktiv-Anforderungen:

- GPS-Daten als eigene Datenmodelle mit Berechtigungs- und Speicherlogik
- Standortverwaltung mit Abfragen, Berechtigungen und Datenschutz-Schutz
- Store-Modelle mit Produkten, Kategorien, Kunden, Bestellungen, Preisen, Lagerbestand, Rechnungen und Versandstatus
- künftige Integration von Zahlungen, Versand und Reporting über definierte Provider-Adapter

### 12. Update- und Versionierungssystem

Das Update-System muss von Anfang an zentral und abstrahiert konzipiert werden.

IST-ZUSTAND:

- Die App verfügt derzeit noch nicht über einen systematischen Update-Manager.

GEWÜNSCHT:

- Beim Start prüft die App ihre installierte Version gegen die verfügbare Version.
- Auch installierte Module werden beim Start auf neue Versionen geprüft.
- Wenn ein Update verfügbar ist, erscheint ein Hinweis im Benutzer- oder Admin-Bereich: „Neue Version verfügbar – jetzt aktualisieren.“
- Aktuelle Updatequelle: eigener Server.
- Spätere Updatequelle: App-/Software-Store.

EMPFOHLEN:

- Abstrakter `Update Provider` als zentrale Schicht zwischen App und Update-Quelle.
- Der konkrete Provider darf nicht fest in die App eingebaut werden.
- Provider-Implementierungen für: eigener Server, Store-Provider, Cloud-/Provider-Adapter, späterer lokaler/anderer Host.
- Eine Versions-/Abhängigkeits-Engine prüft: installierte App-Version, verfügbare Version, installierte Module, verfügbare Modulversionen, Mindestversionen, Kompatibilitätsregeln, Sicherheitsupdates.
- Der Update-Prozess prüft zusätzlich Integrität, Signatur, fachliche Abhängigkeiten und führt ggf. ein Rollback durch, sofern sinnvoll.
- Der Installationsvorgang soll sicher, nachvollziehbar und reversibel erfolgen; Update-Kanäle (Stable/Beta) müssen konfigurierbar bleiben.

Wichtig:

- Die konkrete Updatequelle darf nicht fest in die Anwendung eingebaut werden.
- Die Update-Logik muss über eine Provider- und Adapter-Schicht konfigurierbar sein.

### 13. Benutzer-Backup

Das Benutzer-Backup ist technisch sinnvoll und muss strikt getrennt vom System-/Admin-Backup geplant werden.

GEWÜNSCHT:

FREE:

- kein Benutzer-Backup.

PAID:

- persönliches Backup möglich.
- Backup dient insbesondere Gerätewechsel, Neuinstallation und Datenwiederherstellung.
- gesichert werden: persönliche Daten, Einstellungen, Konfigurationen und notwendige Metadaten.
- Fotos und größere Medien nur entsprechend dem bezahlten Tarif.

Der Benutzer soll später über die Einstellungen folgendes tun können:

- Backup erstellen
- Backup-Status prüfen
- letztes Backup einsehen
- Backup wiederherstellen
- Backup löschen

Wichtige Trennung:

- Benutzer-Backup und System-/Admin-Backup müssen strikt getrennt sein.
- Backups müssen geschützt sein und dürfen ausschließlich dem jeweiligen Benutzer zugänglich sein.
- Das Backup-System soll speicheranbieterunabhängig über eine Backup-Provider-Interface-Schicht aufgebaut werden.

### 14. Tarif- und Entitlement-System

GEWÜNSCHT:

- Eine zentrale Entitlement-/Berechtigungsstruktur muss vorliegen.
- Free/Paid/Premium-Funktionen dürfen nicht fest in einzelne Module verdrahtet werden.
- Die Struktur muss spätere Tarifstufen und neue Premium-Funktionen ermöglichen.

EMPFOHLEN:

- zentraler Entitlement-/Berechtigungs-Manager
- Entitlements als Policy statt als harte Modul-IFs
- freie Tarifstufen (Free, Paid, Premium und spätere Varianten)
- modulare Feature-Freigaben über zentrale Berechtigungsdefinitionen
- spätere Tariflogik ohne Core-Umstellung

Ziel:

- die Modul- und App-Funktionen bleiben unabhängig von einer festen Tariflogik
- Upgrade- und Downgrade-Transitions können später sauber verwaltet werden

### 15. Infrastruktur-/Provider-Architektur

GEWÜNSCHT:

- Die aktuelle Infrastruktur:

  cPanel
  → FTPS
  → FTP-Root `/`

  ist nur die erste konkrete Umgebung.

- Die Anwendung muss später auch andere Server, Hostinganbieter, Cloud-Speicher oder andere Infrastruktur verwenden können.
- Dafür ist eine abstrahierte Provider-/Adapter-Struktur vorgesehen.
- Der Admin-Bereich soll später die entsprechende Infrastruktur-Konfiguration verwalten können.
- Keine Zugangsdaten im Quellcode.

EMPFOHLEN:

- `Infrastructure Provider Manager` mit Adapter-Interface
- erste Adapter: cPanel, eigener Server, Cloud-/Provider-Adapter, lokaler Provider
- Provider-Konfigurationen als verwaltbare Admin-Settings statt hart codierter Werte
- Secrets und Zugangsdaten nur als Umgebungsvariablen oder verschlüsselte Provider-Config

### 16. Master-/Produktiv-Trennung

GEWÜNSCHT:

`Neutral`
= Master-/Entwicklungsrepository.

`cPanel-meinServer`
= reduzierte produktive Serverinstanz bzw. Archiv-/Transferrepository.

Später werden nur die dafür vorgesehenen produktiven Serverdateien aus `Neutral` nach `cPanel-meinServer` übertragen und von dort per FTPS auf cPanel deployt.

Nicht jede Entwicklungsdatei aus `Neutral` gehört auf den Server.

Die spätere Serverdateistruktur muss deshalb eindeutig dokumentiert werden.

EMPFOHLEN:

- Entwicklung: `Neutral`
- Produktiv-Source: `cPanel-meinServer`
- Deployment: GitHub Actions + FTPS + cPanel
- Laufzeit: produktive Serverinstanz ohne FTP-Zugriff

### 17. Systemadministration

Der Server muss ein echtes Admin-/Systemmanagement enthalten:

- Systeminformationen
- Speicherplatz
- Prozesse
- Logs
- Health Checks
- Wartungsmodus
- Diagnose
- Cronjobs
- Scheduled Tasks
- Jobs/Queues
- Monitoring
- Fehlerüberwachung

### 18. cPanel- und Deployment-Umgebung

GEWÜNSCHT:

- FTP-/FTPS wird nur als Deployment-Mechanismus genutzt.
- Die Anwendung selbst darf zur Laufzeit keine FTP/FTPS-Verbindungen initiieren.
- Der FTP-Benutzer soll direkt im gewünschten Neutral-Verzeichnis landen und damit `/` als FTP-Root nutzen.
- Die Serverdateien müssen sauber aus `Neutral` nach `cPanel-meinServer` ausgelagert werden.
- `cPanel-meinServer` ist die Produktiv-Quelle, nicht die Entwicklungsbasis.

EMPFOHLEN:

- Produktive Serverdateien in einem separaten minimalen Delivery-Bestand halten
- nur notwendige Server-/UI-/Config-Dateien in `cPanel-meinServer`
- keine Tests, keine Dev-Tools, keine Secrets, keine lokalen Preview-Dateien im produktiven Transfer
- GitHub Actions zur FTPS-Auslieferung mit cPanel-Root-Pfad `/`

## ZUKUNFT

- 2FA/MFA als optionale Sicherheitsstufe
- Benutzergruppen mit robustem Rechte- und Teammodell
- feinere Rechte und Ressourcen-Scopes
- API-Key-Verwaltung mit Rotation, Scope und Revocation
- Webhooks und Event-Systeme
- Benachrichtigungen und E-Mail-Systeme
- Monitoring und Alerting
- automatische Backups
- Plugin-System mit Versions-/Abhängigkeitskontrolle
- Job-/Queue-System
- Reporting und Statistiken
- Multi-App-/Multi-Tenant-Modelle
- externe API-Integrationen und Cloud-Speicher
- Zahlungsanbieter und Store-Updates
- Cloud-/Provider- und Infrastruktur-Abstraktion als Standard

## OFFENE ENTSCHEIDUNG

- Welche konkrete MySQL-Instanz, Berechtigungsstruktur und Provider-/Server-Konfiguration werden in der späteren externen Produktivumgebung genutzt?
- Cookie-Session oder tokenbasierte Session-Mechanik?
- gemeinsame Admin-UI oder getrennte Admin-Anwendung?
- welche Module müssen im ersten produktiven Release zwingend enthalten sein?
- welche Features sind Free, welche Paid?
- wie streng sollen Start-/Setup-/Migration-Checks und Sicherheitsupdates im ersten Release sein?
- welche Provider-/Infrastruktur-Adapter werden als erste produktive Implementierung umgesetzt?
- wie wird der erste echte Backup-/Restore-Prozess für Benutzer und System konzeptionell geregelt?

## Schlussfolgerung

Die vorhandene Architektur in `Neutral` bildet bereits eine solide technische Grundlage für eine spätere produktive Server-/Admin-Anwendung. Die wichtigsten Lücken sind nicht in der Gesamtidee, sondern in der Produktivreife: serverseitige Authentifizierung, Session-Sicherheit, Datenbank-/Storage-Qualität, Audit-Logs, Auslieferung für cPanel, Backup/Restore, API-Sicherheit, Update-Strategie und Provider-Abstraktion.

Die Dokumentation in `WORKFLOW.md` sollte deshalb nicht als reine Prototyp-Notiz verstanden werden, sondern als dauerhafte technische Grundlage für alle späteren Implementierungsschritte. Aus ihr muss ein Agent bei jedem zukünftigen Arbeitsschritt eindeutig erkennen können:

- was das Projekt ist
- welche Architektur vorgesehen ist
- was bereits existiert
- was umgesetzt werden soll
- wie der Server funktioniert
- wie Updates funktionieren
- wie Backups funktionieren
- welche Funktionen tarifabhängig sind
- wie die aktuelle cPanel-Infrastruktur funktioniert
- wie spätere andere Infrastruktur angebunden werden kann
- welche Punkte noch offen sind

Diese Dokumentation bildet damit die Grundlage für die spätere produktive Serverarchitektur und die saubere Auslagerung in `cPanel-meinServer`.

# Prioritäten- und Umsetzungsplanung für die spätere produktive Server-/Admin-Architektur

## Grundsatz

Die bisherige Architektur ist bereits ein sinnvoller Ausgangspunkt, aber die produktive Serverplattform muss in klarer Reihenfolge gebaut werden, damit spätere Funktionen die Grundlage nicht zerstören oder unnötig umbauen. Die zentrale Reihenfolge lautet:

1. stabile Kern-Grundlagen
2. Persistenz und Authentifizierung
3. API und Admin-Services
4. Module- und App-Management
5. Sicherheit, Backups, Updates und Monitoring
6. Deployment und cPanel-Transfer
7. spätere Erweiterungen und Stores/Provider-Integration

Diese Reihenfolge wird bewusst nicht von Produktfunktionen, sondern von technischen Abhängigkeiten bestimmt.

## PHASE 0 – Architektur- und Projekt-Guardrails

IST:

- `Neutral` ist die Master-/Entwicklungsbasis.
- Die Architektur enthält bereits Core-, App-, Module-, Runtime- und Admin-Konzepte.
- Das Deployment mit cPanel/FTPS ist grundsätzlich bekannt.

ERSTE PRODUKTIVE PHASE:

- klare Trennung zwischen Entwicklungsbasis und produktiver Serverbasis
- `Neutral` bleibt Master-Repo; `cPanel-meinServer` wird die reduzierte produktive Serverquelle
- Deployment-Pfad: `Neutral` -> `cPanel-meinServer` -> GitHub Actions -> FTPS -> cPanel
- keine produktive Laufzeitlogik als FTP-Client

EMPFOHLEN:

- Provider-/Adapter-Schicht früh einführen, auch wenn nur der erste Provider `cPanel` aktiv ist
- `infrastructure/provider-manager` und `infrastructure/adapter/*` als frühe Abstraktion, nicht als spätere Korrektur

Benötigte Komponenten:

- Provider-Interface
- Provider-Konfigurationsmodul
- Env-/Config-Loader
- Deployment-Definitionen

Abhängigkeiten:

- erfordert keine Module, aber die spätere Produktivplattform hängt davon ab

Sicherheitsaspekte:

- Keine Secrets im Code
- Zugangsdaten nur in Umgebungsvariablen oder verschlüsselten Provider-Configs

Risiken:

- harte Bindung an cPanel oder FTP wird später kostspielig

Abnahmekriterien:

- Produktive Serverstruktur ist dokumentiert
- Provider-Abstraktion ist konzeptionell vorhanden
- cPanel-Deployment ist klar abgegrenzt

Warum an dieser Stelle:

- spätere Schichten werden sonst an cPanel- und Deployment-Annahmen hängen bleiben

## PHASE 1 – Server-Basis und Runtime-Grundlagen

PRIORITÄT:

- sehr hoch

Ziel:

- die Server-Umgebung muss stabil, testbar und produktiv nutzbar sein

IST:

- Node.js-Server und Framework-Kern existieren bereits in Grundzügen
- Server-Bootstrap und Runtime-Kontext sind vorhanden

ERSTE PRODUKTIVE PHASE:

- produktiver HTTP-Server mit sauberem Bootstrap
- zentrale Konfigurationsschicht
- Logger, Error-Handler, Health-Check-Endpunkte
- Status- und Diagnostik-Endpoint
- sauber abgegrenzte Server-/App-/Runtime-Initialisierung

Benötigte Komponenten:

- `server/server.js`
- `server/bootstrap/server.js`
- `config/index.js`
- `server/utils/logger.js`
- `server/utils/errors.js`
- `server/utils/validator.js`
- `server/middleware/errors.js`
- `server/api/health.js`

Abhängigkeiten:

- benötigt die allgemeine Runtime- und App-Registrierung, aber noch keine Module- oder User-Logik im Detail

Sicherheitsaspekte:

- zentrale Fehlerbehandlung ohne Stack-Trace-Leckage
- keine vertraulichen Details in Laufzeit- oder Health-Responses

Risiken:

- schlechte grundlegende Serverstruktur führt zu spätem Rework bei Auth, API und Monitoring

Abnahmekriterien:

- Server startet sauber
- Health endpoint meldet Status
- Fehler werden zentral behandelt
- Konfiguration und Env-Variablen funktionieren

Warum an dieser Stelle:

- Auth, API, Module und Admin werden auf dieser Grundlage aufbauen

## PHASE 2 – Persistenz und Datenmodell

PRIORITÄT:

- sehr hoch

Ziel:

- der Server bekommt eine verlässliche, sichere Datenbasis

IST:

- generische Data-/Schema-Engine und Storage-Adapter sind bereits teilweise vorhanden

ERSTE PRODUKTIVE PHASE:

- Datenbank-Abstraktion einführen
- Standard-DB-Provider festlegen oder abstrahieren
- Tabellen-/Schema-Entwurf für Users, Sessions, Roles, Permissions, Config, Logs, Module, App-Daten
- Migrationslogik und Validierung
- separate Datenräume pro App und pro Namespace

Benötigte Komponenten:

- `storage/data/*`
- `platform/core-storage.js`
- `platform/storage-manager.js`
- `server/services/*` für Data-Layer
- DB-Adapter: sqlite/mysql abstraction

Abhängigkeiten:

- benötigt Phase 1 als Serverbasis
- Voraussetzung für Auth, Sessions und Admin-Logik

Sicherheitsaspekte:

- keine Plaintext-Passwörter
- keine unvalidierten Daten in DB
- Datenzugriff nur über Adapter/Services

Risiken:

- falsche DB-Auswahl bei frühen Designentscheidungen verschiebt spätere Skalierung

OFFENE ENTSCHEIDUNG:

- Welche konkrete MySQL-Instanz, Berechtigungsstruktur und Provider-/Server-Konfiguration werden in der späteren externen Produktivumgebung genutzt?

Abnahmekriterien:

- Datenmodelle definiert
- Migrations- und Validierungslogik existiert
- App-Isolation und Namespace-Abgrenzung sind dokumentiert

Warum an dieser Stelle:

- Auth, Sessions, App-Konfiguration und Module benötigen belastbare Persistenz als Grundlage

## PHASE 3 – Authentifizierung, Sessions, Rollen und Rechte

PRIORITÄT:

- sehr hoch

Ziel:

- ein sicherer und nachvollziehbarer Auth- und Berechtigungs-Layer

IST:

- Rollen-/Permission-Konzept und Login-Logik existieren bereits in Ansätzen
- Browser-Storage-Session-Modelle existieren lokal

ERSTE PRODUKTIVE PHASE:

- serverseitige Session-/Auth-Kernlogik
- Passwort-Hashing mit `bcrypt`/`argon2`
- Login-/Logout-/Refresh-Flow
- Rollen- und Berechtigungsprüfung auf Backend-Ebene
- Session-Timeout und Server-Validierung
- Audit-Events bei login/logout/rollenwechseln

Benötigte Komponenten:

- `platform/core-auth.js`
- `server/api/auth.js`
- `server/services/auth-service.js`
- `server/middleware/auth.js`
- `platform/security.js`
- `server/api/users.js`
- `server/api/roles.js`

Abhängigkeiten:

- Phase 1 + Phase 2 erforderlich

Sicherheitsaspekte:

- HttpOnly/Secure/SameSite Cookies
- kein Client-only Auth-Trust
- Rate Limiting auf Login und Admin-Aktionen
- Rollen- und Rechteprüfung serverseitig, nie nur im Frontend

OFFENE ENTSCHEIDUNG:

- Cookie-Session oder tokenbasierte Sessions

EMPFOHLEN:

- für cPanel- und Standard-Web-Deploys zuerst Cookie-Session mit serverseitigem Store bevorzugen, da es im Shared-/cPanel-Umfeld meist sicherer und einfacher ist
- Token-Ansatz trotzdem als Abstraktion/Provider-Option offen lassen

Risiken:

- Browser-Storage-only Sessions sind für produktiven Betrieb unverlässlich und unsicher

Abnahmekriterien:

- Login/-Logout-/Refresh-Flow funktioniert
- Rollen-/Permission-Checks werden serverseitig durchgesetzt
- Auth-Augenschein aus Sicht API und Admin-Bereich stabil

Warum an dieser Stelle:

- alle späteren Admin-, Module-, Update- und Backup-Funktionen brauchen verlässliche Identität und Rechte

## PHASE 4 – API, Admin-Funktionen und Systemservices

PRIORITÄT:

- sehr hoch

Ziel:

- das Produktiv-Backend muss admin- und systemfähig sein

IST:

- API- und Admin-Konzepte sind bereits in der Architektur vorhanden

ERSTE PRODUKTIVE PHASE:

- API für Auth, Users, Roles, Config, Modules, Logs, Health
- Admin UI / API Integration
- Systemstatus, Logs, Userverwaltung, Modulverwaltung, Konfiguration
- Audit-Logs und Sicherheitsansichten

Benötigte Komponenten:

- `server/api/*`
- `server/services/*`
- `webroot/admin.html` + admin-Scripts
- `server/middleware/rate-limit.js`
- `server/middleware/csrf.js`

Abhängigkeiten:

- Phase 1, 2 und 3 erforderlich

Sicherheitsaspekte:

- Admin-Endpunkte grundsätzlich mit Auth + Rollenprüfung
- CSRF für cookiebasierte interaktive Formulare
- Log-Sanitization

Risiken:

- Admin-API ohne harte Rechte-Checks ist ein kritischer Sicherheitsfehler

Abnahmekriterien:

- Admin-Bereich kann Nutzer, Rollen und Module verwalten
- Logs und Health-Endpunkte funktionieren
- Systemstatus und Config-Ansichten sind erreichbar

Warum an dieser Stelle:

- das Admin-Bereich-Management ist eine zentrale Betriebsfunktion und später nicht ohne auth-safe API nutzbar

## PHASE 5 – Module Registry, App-Isolation und Modul-Management

PRIORITÄT:

- hoch

Ziel:

- die Architektur bleibt modular und produktiv erweiterbar

IST:

- Module-Registry, Module-Manager und App-Isolation sind bereits vorhanden

ERSTE PRODUKTIVE PHASE:

- zentrale Modul-Definitionen mit Manifesten und Status
- Aktivieren/Deaktivieren, Rechteprüfung, Versionsstatus, Abhängigkeiten
- App-Isolation und Storage-Namespaces verankern
- Module-API und Admin-UI für Modulseite

Benötigte Komponenten:

- `platform/module-registry.js`
- `platform/module-manager.js`
- `platform/core-runtime.js`
- `app/modules/index.json`
- `server/api/modules.js`
- `server/services/module-service.js`

Abhängigkeiten:

- benötigt Phase 2 (Persistenz) und Phase 4 (Admin-API)

Sicherheitsaspekte:

- Modul-Rechte müssen nicht nur UI-seitig, sondern serverseitig geprüft werden
- Module dürfen keine Sicherheits- oder Data-Namespaces überschreiben

Risiken:

- Module werden zu früh anhardt und spätere Rechte- oder App-Logik wird schwer

Abnahmekriterien:

- Module können aktiviert/deaktiviert und konfiguriert werden
- App-Isolation funktioniert für Datensätze und Konfigurationen
- Modul-Abhängigkeiten sind definiert

Warum an dieser Stelle:

- spätere App- und CMS-/GPS-/Store-Module hängen an dieser Stabilität

## PHASE 6 – Security Hardening, Audit und operational readiness

PRIORITÄT:

- hoch

Ziel:

- produktiver Betrieb muss sicher und überwacht werden

IST:

- Grundideen zu Sicherheit und Audit existieren

ERSTE PRODUKTIVE PHASE:

- Rate Limiting
- Audit-Logs für Login, Rollenänderung, Module, Admin-Aktionen
- Login-Überwachung und Security-Events
- XSS-/CSRF-/Injection-Policies
- zentrale Security-Header
- Log-Level und Fehler-Diagnostik

Benötigte Komponenten:

- `platform/security.js`
- `server/middleware/csrf.js`
- `server/middleware/rate-limit.js`
- `server/services/log-service.js`
- `storage/logs/*`
- `server/api/logs.js`

Abhängigkeiten:

- Phase 2–5

Sicherheitsaspekte:

- kritisch für Produktivbetrieb
- alle Sicherheitsfunktionen müssen serverseitig durchgesetzt werden

Risiken:

- Sicherheitslücken lassen sich schwer nachträglich sauber einbauen, ohne viel Rework

Abnahmekriterien:

- Audit-/Security-Logs vorhanden
- Rate-Limits und CSRF aktiv
- keine sensiblen Daten in Logs

Warum an dieser Stelle:

- Sicherheit ist nicht ein separater Spiegel, sondern notwendige Grundlage für alle produktiven Funktionen

## PHASE 7 – Update-System und Entitlements

PRIORITÄT:

- hoch

Ziel:

- App-, Module- und Feature-Updates sollen kontrolliert und sicher erfolgen

IST:

- generische Update- und Entitlement-Idee ist vorhanden, aber keine feste produktive Implementierung

ERSTE PRODUKTIVE PHASE:

- `Update Manager` + `Update Provider`-Architektur
- App-/Module-Check bei Start
- Update-Hinweis: „Neue Version verfügbar – jetzt aktualisieren.“
- Abhängigkeits- und Kompatibilitätsprüfung
- Integritäts-/Signaturprüfung
- Rollback-Mechanik, soweit sinnvoll

Benötigte Komponenten:

- `server/api/updates.js`
- `server/services/update-service.js`
- Provider-Adapter-Schicht
- Version- und Manifest-Checks
- Entitlement-Manager

Abhängigkeiten:

- Phase 2, 3, 4, 5, 6

Sicherheitsaspekte:

- Update-Provider darf nicht hart eingebaut sein
- Kryptografische Signatur und Integritätsprüfung erforderlich
- keine aus dem Internet ohne Prüfung installierten Packages

OFFENE ENTSCHEIDUNG:

- späterer Store oder eigener Server als Standardprovider

Abnahmekriterien:

- Update-Prüfung beim Start funktioniert
- Module-Updates werden erkannt
- Sicherheits- und Kompatibilitätsprüfung läuft korrekt

Warum an dieser Stelle:

- Updates und Entitlements hängen an der Produktivbasis, aber sie dürfen die Kernarchitektur nicht überladen

## PHASE 8 – Backup/Restore, Benutzer-Backup und Storage-Policies

PRIORITÄT:

- hoch

Ziel:

- Produktiver Betrieb braucht Wiederherstellbarkeit und Datensicherung

IST:

- allgemeine Backup-/Restore-Strategie ist geplant, aber noch nicht produktiv definiert

ERSTE PRODUKTIVE PHASE:

- System-/Admin-Backups
- DB- und Datei-Backups
- Restore-Skripte und Wiederherstellungsprozedur
- Benutzer-Backups nur für Paid-/Premium-Tarife
- getrennte Sicherung von System- und Nutzerdaten

Benötigte Komponenten:

- `storage/backups/*`
- `scripts/backup.sh`
- `scripts/restore.sh`
- `server/api/backups.js`
- `server/services/backup-service.js`

Abhängigkeiten:

- Phase 2, 5, 6, 7

Sicherheitsaspekte:

- Benutzer-Backups müssen schlüsselgebunden und nicht global zugänglich sein
- Backups müssen mit Rechte- und Provider-Policies geschützt werden

GEWÜNSCHT:

FREE:

- kein Benutzer-Backup

PAID:

- persönliches Backup mit gezielter Wiederherstellung

Risiken:

- Backups ohne klare Rechte- und Provider-Abstraktion werden in der Praxis problematisch

Abnahmekriterien:

- Backup-/Restore-Prozess ist dokumentiert und testbar
- Benutzer-Backups sind getrennt von Admin-/System-Backups

Warum an dieser Stelle:

- Backups sind ein Betriebs- und Notfall-Feature, nicht die erste technische Grundlage

## PHASE 9 – CMS/Content, GPS und Store-Funktionen

PRIORITÄT:

- mittel bis hoch

Ziel:

- Anwendungen und fachliche Module dürfen auf die stabile Basis aufsetzen

IST:

- GPS-, Store- und CMS-/Data-Ansätze sind bereits sichtbar

ERSTE PRODUKTIVE PHASE:

- produktive Grundmodelle für Inhalte, GPS-Daten, Produkte, Kunden, Bestellungen
- Rechte und Storage-Namespaces sauber verankert
- App-/Module-Logik nicht im Core, sondern im Modul-/App-Layer

Benötigte Komponenten:

- Content-Modelle
- GPS-Datenmodelle
- Store-Schemas und Positionen
- App-/Data-Engines
- Modul-Definitionen

Abhängigkeiten:

- Phase 2, 3, 5, 7 erforderlich

Sicherheitsaspekte:

- Zugriff auf GPS- und Store-Daten muss app-/rollenbasiert gesteuert werden
- sensible Daten wie Standort und Bestell-Daten müssen sauber abgesichert werden

Risiken:

- fachliche Module werden zu früh gebaut und binden sich an generische Strukturen

Abnahmekriterien:

- content, gps und store laufen als App-Module und nicht als Core-Features

Warum an dieser Stelle:

- fachliche Funktionen erst dann sinnvoll, wenn Auth, Rechte, Module und Storage stabil sind

## PHASE 10 – Monitoring, Health, Jobs, Cron und Wartung

PRIORITÄT:

- mittel

Ziel:

- Betriebssicherheit und langfristige Wartbarkeit

IST:

- Health und Monitoring sind grundsätzlich eingeordnet

ERSTE PRODUKTIVE PHASE:

- Health-Checks
- Server-/DB-/Disk-/Memory-Monitoring
- Job-/Queue-/Cron-Systeme
- Wartungsmodus
- Diagnose- und Fehler-Alerts

Benötigte Komponenten:

- `server/api/health.js`
- `server/services/health-service.js`
- `server/jobs/*`
- monitoring endpoints
- scheduled tasks

Abhängigkeiten:

- Phase 1–9

Sicherheitsaspekte:

- keine sensitive Systeminformation ungeschützt ausgeben
- Monitoring darf keine Security-Details exponieren

Risiken:

- fehlendes Monitoring erzeugt sehr hohe Wartungs- und Ausfallkosten

Abnahmekriterien:

- Health-Checks laufen
- Systemstatus und Fehlerüberwachung sind sichtbar
- Cron-/Job-Systeme sind dokumentiert

Warum an dieser Stelle:

- Monitoring ist wichtig, aber erst nach stabiler Produktivbasis sinnvoll

## PHASE 11 – Deployment, cPanel-Transfer und externe Provider

PRIORITÄT:

- hoch, aber nach technischer Basis

Ziel:

- produktive Auslieferung soll stabil, reproduzierbar und provider-agnostisch sein

IST:

- cPanel-/FTPS-Pfad ist vorhanden
- Transfer- und Deployment-Konzepte sind dokumentiert

ERSTE PRODUKTIVE PHASE:

- `cPanel-meinServer` als reduzierte Laufzeit-/Product-Source
- GitHub Actions/FTPS-Flow
- cPanel-Root `/` als FTP-Root
- produktive Datei- und Ordnerstruktur sauber trennt

Benötigte Komponenten:

- `scripts/*`
- `config/*`
- produktive `server/`, `public/`, `storage/`, `config/`-Struktur

Abhängigkeiten:

- Phase 1–10 erforderlich

Sicherheitsaspekte:

- keine Secrets in Git
- keine produktive Datei in Dev-Repo automatisch nicht exportiert

Risiken:

- falsche Auslieferung führt zu Sicherheits- und Integritätsproblemen

Abnahmekriterien:

- nur produktive Dateien im Delivery-Repo
- Deployment ist reproduzierbar und sicher

Warum an dieser Stelle:

- Deploy ist der letzte technische Haken, nicht der erste

## PHASE 12 – Zukünftige Erweiterungen

PRIORITÄT:

- später

Ziel:

- Erweiterbarkeit ohne Architektur-Rework

SPÄTER:

- 2FA/MFA
- Webhooks
- Notifications
- E-Mail-System
- Multi-App/Multi-Tenant
- externe API und Payment-Provider
- Store- und App-Update-Provider
- erweitertete Reporting-/Statistik-Module

ZUKUNFT:

- Cloud-Speicher-Provider
- externe Worker-/Queue-Cluster
- Auto-Scaling-Ansätze
- Tenant- und Mandanten-Umgebungen

Risiken:

- zu frühe Einführung komplexer Features verschiebt kritische Grundlagen

Abnahmekriterien:

- Erweiterungen laufen über definierte Interfaces
- keine hardcodierten Funktionen im Core

## OFFENE ENTSCHEIDUNGEN

Diese Entscheidungen müssen vor der Implementierung bewusst getroffen werden, obwohl sie technisch durch Abstraktionen offen gehalten werden können:

- Welche konkrete MySQL-Instanz, Berechtigungsstruktur und Provider-/Server-Konfiguration werden in der späteren externen Produktivumgebung genutzt?
- Cookie-Session oder tokenbasierte Sessions
- gemeinsame Admin-UI oder separate Admin-Anwendung
- genaue Free-/Paid-Funktionsaufteilung
- Module des ersten produktiven Releases
- erste Infrastruktur-/Provider-Adapter

EMPFOHLEN:

- MySQL als primäre produktive Lösung für die erste stabile Server-/Admin-Umgebung
- Cookie-Session mit serverseitigem Store als erste produktive Standard-Variante, solange nicht ein echtes Token-API-Design erforderlich ist
- Provider-Abstraktion und Adapter-Interface früh absichern, damit die erste Infrastruktur nicht hart kodiert bleibt
- gemeinsame Admin-UI im ersten Release, wenn nicht ein klarer technischer Grund für separate Admin-Anwendung vorliegt

## EMPFEHLUNGEN DES AGENTS

### 1. Provider-Abstraktion nicht später, sondern früh

Problem:

- Die aktuelle cPanel-Umgebung ist nur die erste konkrete Infrastruktur. Wenn der Provider-Code später hart eingebaut wird, kann die Anwendung nicht elegant zwischen Hosting-Umgebungen wechseln.

Lösung:

- `infrastructure/provider-manager` und `adapter`-Schicht schon beim ersten Produktiv-Build einführen.

Nutzen:

- späterer Wechsel zwischen Hosting, Clouds, lokalen Instanzen und Servern ohne Rework des App-Cores.

Aufwand:

- mittel

Zeitpunkt:

- PHASE 0 oder PHASE 1

Begründung:

- cPanel ist nur der erste echte Provider, keine langfristige technische Bindung.

### 2. Authentifizierung als erste echte Produktivschicht behandeln

Problem:

- Browser-Storage-Auth in Entwicklung ist leicht zu missverstehen; in Produktion ist sie ein Sicherheitsfehler, wenn sie allein als Auth-Mechanismus dient.

Lösung:

- serverseitige Session-Logik, Passwort-Hashing und Rollen-/Permission-Checks früh und strikt einführen.

Nutzen:

- schützt Admin-, User- und API-Bereiche schon in der frühen Betriebssicherheit.

Aufwand:

- mittel

Zeitpunkt:

- PHASE 3

Begründung:

- Auth ist die zentrale Grundlage aller späteren Systemfunktionen.

### 3. Sicherheits-Hardening nicht am Ende nachholen

Problem:

- spätere Security-Anforderungen führen häufig zu Rework und Produktivblockern.

Lösung:

- zentrale Security-Basis in Phase 6 mitgehen lassen, nicht als separates „nice-to-have“ am Ende.

Nutzen:

- reduziert Risiken und verhindert kritische spätere Repositories-Änderungen.

Aufwand:

- mittel

Zeitpunkt:

- PHASE 6

Begründung:

- Admin-, Session- und API-Funktionen sind ohne strenge Security nicht produktiv nutzbar.

### 4. Update-/Entitlement-Logik nicht in Module verdrahten

Problem:

- Tarife und Updates werden sonst in Modul- oder Feature-Code fest verdrahtet und später kaum austauschbar.

Lösung:

- zentrale Entitlement- und Update-Manager-Schicht mit Provider-Adapter.

Nutzen:

- spätere Store-/App-Updates und Tarifstufen sind ohne Core-Umstellung möglich.

Aufwand:

- mittel

Zeitpunkt:

- PHASE 7

Begründung:

- Entitlements und Updates sind systemweite Funktionen und sollten im Framework nicht app- oder modulspezifisch verschwinden.

### 5. Backups als Betriebsfeature, nicht als Nebensache behandeln

Problem:

- nach einem Datenverlust ist die Wiederherstellung oft aufwendiger als die ursprüngliche Implementierung.

Lösung:

- System- und Benutzer-Backups in der Produktivarchitektur als eigene Service-Schicht definieren.

Nutzen:

- Wiederherstellbarkeit, Benutzer- und System-Sicherheit, Reduktion von Ausfallzeiten.

Aufwand:

- mittel

Zeitpunkt:

- PHASE 8

Begründung:

- Produktiver Betrieb ohne Recovery-Konzept ist unvollständig.

## Zusammenfassung der Phasenfolge

PHASE 0 – Architektur- und Projekt-Guardrails
PHASE 1 – Server-Basis und Runtime-Grundlagen
PHASE 2 – Persistenz und Datenmodell
PHASE 3 – Authentifizierung, Sessions, Rollen und Rechte
PHASE 4 – API, Admin-Funktionen und Systemservices
PHASE 5 – Module Registry, App-Isolation und Modul-Management
PHASE 6 – Security Hardening, Audit und operational readiness
PHASE 7 – Update-System und Entitlements
PHASE 8 – Backup/Restore, Benutzer-Backup und Storage-Policies
PHASE 9 – CMS/Content, GPS und Store-Funktionen
PHASE 10 – Monitoring, Health, Jobs, Cron und Wartung
PHASE 11 – Deployment, cPanel-Transfer und externe Provider
PHASE 12 – Zukünftige Erweiterungen

Diese Reihenfolge ist bewusst so gewählt, dass spätere Funktionalitäten auf stabilen technischen Grundlagen aufbauen und das Framework nicht durch produktive Zusatzfunktionen an grundlegenden Designentscheidungen blockiert wird.

Die Gesamtarchitektur bleibt damit kompatibel mit der vorhandenen Vision, aber technisch realistischer für einen stabilen produktiven Betrieb als ein einfacher Frontend-/Admin-Mix ohne serveurits abgesicherte Grundlage.

## Zusätzliche konkrete Implementierungs-Phasenfolge

Die nachstehende Reihenfolge ist die operative, ausführbare Version der technischen Phasenplanung und dient als konkrete Projekt-Checkliste für die spätere Realisierung von `Neutral` als produktives Framework.

### Phase 0 – Projekt-Guardrails und Architektur-Schutz

Ziel:
- Master-/Entwicklungsbasis klar definieren
- Produktiv-Transfer in `cPanel-meinServer` sauber trennen
- cPanel-/FTPS-Umgebung als Deployment-Kontext, nicht als Core-Abhängigkeit festlegen

Ergebnisse:
- Architekturregeln festgehalten
- Provider-Abstraktion definiert
- kein Produktivcode im Master-Repo ohne klare Trennung
- keine Secrets, keine echten Zugangsdaten im Repository

### Phase 1 – Server-Foundation

Ziel:
- stabilen Serverstart, Laufzeitkontext und Health-Endpunkte bauen

Ergebnisse:
- `server/bootstrap` und `server/runtime`
- zentrale Konfiguration
- Logger, Error-Handler, Health-Checks
- admin shell und shell routing

### Phase 2 – Persistenz und Datenmodell

Ziel:
- produktive Persistenz als technische Grundlage sichern

Ergebnisse:
- MySQL-Adapter und DB-Migrationskonzept
- User-, Role-, Settings-, Session- und Log-Modelle
- Storage-Namespaces
- Produktiv- und Lokal-Umgebung sauber trennen

### Phase 3 – Authentifizierung, Sessions und Rechte

Ziel:
- echte Server-Authentifizierung und Rechteprüfung ohne UI-Only-Checks

Ergebnisse:
- Password-Hashing
- Login-/Logout-Flows
- Session-Store
- Role-/Permission-Engine
- Zugriffskontrolle auf API- und Admin-Endpunkte

### Phase 4 – API und Admin-Services

Ziel:
- zentrale Verwaltungs- und Betriebs-API aufbauen

Ergebnisse:
- `api/auth`, `api/users`, `api/roles`, `api/config`, `api/logs`, `api/system`
- Admin-Übersicht
- Dashboard, Rollenverwaltung, Nutzerverwaltung, Logs, Systemstatus
- einheitliche Antwortformate und Fehlercodes

### Phase 5 – Module und App-Isolation

Ziel:
- modularen und isolierten Runtime-Betrieb ohne Core-Kopplung

Ergebnisse:
- Module Registry
- install/enable/disable lifecycle
- Namespace-Isolation
- App- und Tenant-/Modul-Kontext sauber trennen
- Permissions und Entitlements pro Module verknüpfen

### Phase 6 – Security Hardening und Audit

Ziel:
- Produktivreife durch echte Sicherheits- und Audit-Funktionen

Ergebnisse:
- CSRF-, Rate-Limit-, Input-Validation-, Secret-Handling
- Audit-Logs und Admin-Aktivitäten
- sicherer Secret-Management-Mechanismus
- keine vertraulichen Daten in Logs oder Responses

### Phase 7 – Updates und Entitlements

Ziel:
- Framework-Upgrade und Tariflogik zentral verwalten

Ergebnisse:
- Version-Check
- Update-Provider-Interface
- compatibility checks
- Entitlement-Manager
- Tarif- und Premium-Policy als zentrale Logik statt Module-Hardcode

### Phase 8 – Backup/Restore und Storage-Policies

Ziel:
- Wiederherstellung und Betriebsfähigkeit sicherstellen

Ergebnisse:
- System-Backup und Benutzer-Backup getrennt
- Restore-Flows und Restore-Validierung
- Storage-Adapter für DB, Logs, Uploads und Backups
- Berechtigungsgrenzen für private Backup-Volumes

### Phase 9 – CMS-, GPS-, Store- und Fachmodule

Ziel:
- fachliche Erweiterungen nur als modulare Erweiterungen einbauen

Ergebnisse:
- klar definierte Fachmodule außerhalb des Core
- historische Referenzmodule bleiben nur Referenz/Validierung
- neue fachliche Module über Module-Interface, Permissions und Entitlements eingebunden

### Phase 10 – Monitoring, Jobs, Cron und Wartung

Ziel:
- Betriebsstabilität und operatives Monitoring sicherstellen

Ergebnisse:
- Health-Metrics
- Jobs und Queues
- Cronjobs
- Wartungsmodus
- Alerts und Diagnose-Funktionen

### Phase 11 – Deployment, Provider und externe Infrastruktur

Ziel:
- produktive Auslieferung sauber in cPanel-/Cloud-Umgebung überführen

Ergebnisse:
- Deployment-Subset in `cPanel-meinServer`
- GitHub Actions + FTPS-Workflow
- Provider-Adapter für cPanel, eigener Server, später Cloud-/Hoster-Provider
- keine Laufzeit-FTP-Abhängigkeit

### Phase 12 – Release-Reife und Abschluss

Ziel:
- stabile Produktivversion mit klar definierter Betriebsbasis

Ergebnisse:
- finale Release-Checks
- Versionierung und Changelog
- Sicherheits-Review
- Backup-/Restore-Review
- erste produktive Betriebskonfiguration mit externer DB und externer Secret-Config

### Entscheidungslogik der Reihenfolge

Die Reihenfolge ist bewusst von technischen Abhängigkeiten bestimmt:

1. Server und Runtime vor Auth
2. Persistenz vor API und Admin
3. Auth und Rechte vor Zugriffsfunktionen
4. Module vor fachlichen Erweiterungen
5. Updates, Backup und Monitoring vor Release- und Betriebsreife
6. Provider/Deployment erst nachdem Core und Betriebsarchitektur stabil sind

Damit bleiben die Architektur und der spätere produktive Betrieb konsistent und vermeiden spätere Umbauten auf Basis unklarer technischer Annahmen.

Diese konkrete Phasenfolge ergänzt die bereits bestehende Architekturplanung und bildet die praktische Lauf- und Umsetzungsordnung für die spätere Umsetzung von `Neutral` als produktiv nutzbare Framework-Architektur.

