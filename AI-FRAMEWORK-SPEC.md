# AI-FRAMEWORK-SPEC

## English

### 1) Scope and neutrality
- This repository provides a neutral, modular web application framework.
- The framework is not tied to a specific business domain.
- Domain applications are expected to be built as external host applications and feature modules.

### 2) Architecture overview
- **Core runtime layer**: [`platform/`](/workspaces/CatchTrack-V.1.0/platform)
- **Server/backend layer**: [`server/`](/workspaces/CatchTrack-V.1.0/server)
- **UI/webroot layer**: [`webroot/`](/workspaces/CatchTrack-V.1.0/webroot)
- **Application/module layer**: [`app/`](/workspaces/CatchTrack-V.1.0/app), modules under [`app/modules/`](/workspaces/CatchTrack-V.1.0/app/modules)

### 3) Core and platform responsibilities
- [`core.js`](/workspaces/CatchTrack-V.1.0/platform/core.js): core facade, event access, module manager/registry access.
- [`core-config.js`](/workspaces/CatchTrack-V.1.0/platform/core-config.js): immutable base config.
- [`core-context.js`](/workspaces/CatchTrack-V.1.0/platform/core-context.js): runtime/environment context.
- [`core-lifecycle.js`](/workspaces/CatchTrack-V.1.0/platform/core-lifecycle.js): strict lifecycle state machine.
- [`core-startup.js`](/workspaces/CatchTrack-V.1.0/platform/core-startup.js), [`core-runtime.js`](/workspaces/CatchTrack-V.1.0/platform/core-runtime.js), [`core-shutdown.js`](/workspaces/CatchTrack-V.1.0/platform/core-shutdown.js), [`core-entry.js`](/workspaces/CatchTrack-V.1.0/platform/core-entry.js): startup/runtime/shutdown orchestration.

### 4) Module system
- [`module-interface.js`](/workspaces/CatchTrack-V.1.0/platform/module-interface.js):
  - manifest validation
  - standard lifecycle contract (`install`, `initialize`, `enable`, `disable`, `update`, `uninstall`)
- [`module-registry.js`](/workspaces/CatchTrack-V.1.0/platform/module-registry.js):
  - central module registration and discovery index
- [`module-manager.js`](/workspaces/CatchTrack-V.1.0/platform/module-manager.js):
  - lifecycle execution and dependency validation
  - registration, activation/deactivation, uninstall orchestration

### 5) Service and config management
- [`service-manager.js`](/workspaces/CatchTrack-V.1.0/platform/service-manager.js):
  - registers default services (`user`, `auth`, `module`, `logging`, `cache`)
  - exposes service lookup and service registry
- [`config-manager.js`](/workspaces/CatchTrack-V.1.0/platform/config-manager.js):
  - runtime config domains (`app`, `bootstrap`, `database`, `api`, `modules`, `security`, `performance`, `ui`, `features`)
  - watch/notify hooks and local persistence helpers

### 6) Storage, database, state, events
- [`core-storage.js`](/workspaces/CatchTrack-V.1.0/platform/core-storage.js):
  - namespaced localStorage adapter (`core:*`)
- [`database-manager.js`](/workspaces/CatchTrack-V.1.0/platform/database-manager.js):
  - IndexedDB abstraction
  - stores: users, modules, logs, sessions, settings, cache, sync
- [`core-state.js`](/workspaces/CatchTrack-V.1.0/platform/core-state.js):
  - generic runtime key-value state
- [`core-event-bus.js`](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js):
  - publish/subscribe event communication
- [`core-event-ring.js`](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js):
  - bounded in-memory diagnostic ring buffer

### 7) Auth, access, security, audit, error handling, i18n
- [`core-auth.js`](/workspaces/CatchTrack-V.1.0/platform/core-auth.js):
  - central auth/session truth
  - bootstrap developer login support
- [`core-access.js`](/workspaces/CatchTrack-V.1.0/platform/core-access.js):
  - role/permission evaluation
- [`security.js`](/workspaces/CatchTrack-V.1.0/platform/security.js):
  - neutral sanitization/hash/token/origin helpers
- [`core-audit.js`](/workspaces/CatchTrack-V.1.0/platform/core-audit.js):
  - in-memory audit trail
- [`core-error-handler.js`](/workspaces/CatchTrack-V.1.0/platform/core-error-handler.js) + [`error-log.js`](/workspaces/CatchTrack-V.1.0/platform/error-log.js):
  - centralized error normalization and capture
- [`core-i18n.js`](/workspaces/CatchTrack-V.1.0/platform/core-i18n.js):
  - locale support with DE/EN translation set and local preference

### 8) Server/backend and API routing
- Entry: [`server/server.js`](/workspaces/CatchTrack-V.1.0/server/server.js)
- HTTP implementation: [`server/bootstrap/server.js`](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- Config: [`server/config/index.js`](/workspaces/CatchTrack-V.1.0/server/config/index.js)
- Health/status service: [`server/services/health-service.js`](/workspaces/CatchTrack-V.1.0/server/services/health-service.js)
- Exposed endpoints:
  - `/health`, `/api/health`
  - `/api/status`
  - `/api/modules` (module manifest list)
- Static routing serves:
  - [`webroot/`](/workspaces/CatchTrack-V.1.0/webroot)
  - [`platform/`](/workspaces/CatchTrack-V.1.0/platform)
  - module files under `app/modules`
- Admin/dev pages are token-guarded in server routing (`ADMIN_ACCESS_TOKEN` + `x-admin-access-token`).

### 9) Webroot/UI layer
- User shell: [`index.html`](/workspaces/CatchTrack-V.1.0/webroot/index.html) + [`user-app.js`](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
- Admin and developer shells: [`admin.html`](/workspaces/CatchTrack-V.1.0/webroot/admin.html), [`dev.html`](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- Shared UI runtime: [`master-ui.js`](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
- Theme/style base: [`style.css`](/workspaces/CatchTrack-V.1.0/webroot/style.css)

### 10) Core-module communication model
- Modules communicate through:
  - core events (`Core.emit`, Core event bus)
  - module manager lifecycle hooks
  - explicit service/core API usage
- Discovery and activation flow is orchestrated by startup + module manager.

### 11) Module lifecycle and isolation
- Operational lifecycle:
  - discover -> register -> install -> initialize -> enable
  - disable/update/uninstall supported through module manager
- Isolation expectations (as implemented):
  - module metadata/dependencies declared in manifests
  - module activation controlled by manager
  - data should be scoped through framework storage/database interfaces
  - no hidden cross-module dependency assumptions

### 12) Data/connection isolation
- Data paths are separated through:
  - localStorage namespace (`core:*`)
  - IndexedDB stores by responsibility
- Admin/dev static page access requires explicit server token authorization.

### 13) Design/theme principle
- Base design is neutral and reusable.
- Core runtime logic is separate from presentation layer files.
- Feature modules can provide own UI rendering without changing core runtime internals.

### 14) GPS module (existing standalone module)
- Module location: [`app/modules/gps/`](/workspaces/CatchTrack-V.1.0/app/modules/gps)
- Manifest: [`module.json`](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
- Implementation: [`index.js`](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js)
- Capabilities:
  - geolocation read/tracking
  - lifecycle handling
  - event emission
  - audit usage
  - storage/database persistence of position records
  - own user UI rendering function

### 15) Allowed module interfaces and non-bypass rules
- Modules may use:
  - module lifecycle contract
  - event bus/core events
  - storage/database managers
  - auth/access/audit/security/config/service managers
- Modules must not bypass:
  - manager-controlled lifecycle
  - centralized auth/access decisions
  - shared security and error handling pathways
  - declared dependency model

### 16) Rules for future extensions
- Keep core neutral and domain-free.
- Add domain logic in application/feature modules, not in core runtime primitives.
- Reuse existing core interfaces before creating new globals.
- Keep dependency declarations explicit.
- Preserve lifecycle/state/event guarantees of the current architecture.

---

## Deutsch

### 1) Geltungsbereich und Neutralität
- Dieses Repository stellt ein neutrales, modulares Web-Framework bereit.
- Das Framework ist nicht an eine konkrete Fachdomäne gebunden.
- Fachanwendungen sollen als Host-Anwendungen und Feature-Module aufgebaut werden.

### 2) Architekturüberblick
- **Core-Runtime-Schicht**: [`platform/`](/workspaces/CatchTrack-V.1.0/platform)
- **Server/Backend-Schicht**: [`server/`](/workspaces/CatchTrack-V.1.0/server)
- **UI/Webroot-Schicht**: [`webroot/`](/workspaces/CatchTrack-V.1.0/webroot)
- **App-/Modul-Schicht**: [`app/`](/workspaces/CatchTrack-V.1.0/app), Module unter [`app/modules/`](/workspaces/CatchTrack-V.1.0/app/modules)

### 3) Core- und Platform-Aufgaben
- [`core.js`](/workspaces/CatchTrack-V.1.0/platform/core.js): Core-Fassade, Event-Zugriff, Registry/Manager-Zugriff.
- [`core-config.js`](/workspaces/CatchTrack-V.1.0/platform/core-config.js): unveränderliche Basiskonfiguration.
- [`core-context.js`](/workspaces/CatchTrack-V.1.0/platform/core-context.js): Runtime-/Umgebungskontext.
- [`core-lifecycle.js`](/workspaces/CatchTrack-V.1.0/platform/core-lifecycle.js): strikte Lifecycle-Statemachine.
- [`core-startup.js`](/workspaces/CatchTrack-V.1.0/platform/core-startup.js), [`core-runtime.js`](/workspaces/CatchTrack-V.1.0/platform/core-runtime.js), [`core-shutdown.js`](/workspaces/CatchTrack-V.1.0/platform/core-shutdown.js), [`core-entry.js`](/workspaces/CatchTrack-V.1.0/platform/core-entry.js): Steuerung von Start, Laufzeit und Stopp.

### 4) Modulsystem
- [`module-interface.js`](/workspaces/CatchTrack-V.1.0/platform/module-interface.js):
  - Manifest-Validierung
  - standardisierter Lifecycle-Vertrag (`install`, `initialize`, `enable`, `disable`, `update`, `uninstall`)
- [`module-registry.js`](/workspaces/CatchTrack-V.1.0/platform/module-registry.js):
  - zentrale Modulregistrierung und Discovery-Index
- [`module-manager.js`](/workspaces/CatchTrack-V.1.0/platform/module-manager.js):
  - Lifecycle-Ausführung und Abhängigkeitsprüfung
  - Registrierung, Aktivierung/Deaktivierung, Deinstallation

### 5) Service- und Konfigurationsverwaltung
- [`service-manager.js`](/workspaces/CatchTrack-V.1.0/platform/service-manager.js):
  - registriert Standardservices (`user`, `auth`, `module`, `logging`, `cache`)
  - bietet Service-Lookup und Service-Registry
- [`config-manager.js`](/workspaces/CatchTrack-V.1.0/platform/config-manager.js):
  - Runtime-Konfigurationsbereiche (`app`, `bootstrap`, `database`, `api`, `modules`, `security`, `performance`, `ui`, `features`)
  - Watch/Notify-Hooks und lokale Persistenz-Helfer

### 6) Storage, Datenbank, State, Events
- [`core-storage.js`](/workspaces/CatchTrack-V.1.0/platform/core-storage.js):
  - namespaceter localStorage-Adapter (`core:*`)
- [`database-manager.js`](/workspaces/CatchTrack-V.1.0/platform/database-manager.js):
  - IndexedDB-Abstraktion
  - Stores: users, modules, logs, sessions, settings, cache, sync
- [`core-state.js`](/workspaces/CatchTrack-V.1.0/platform/core-state.js):
  - generischer Runtime-Key-Value-State
- [`core-event-bus.js`](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js):
  - Publish/Subscribe-Kommunikation
- [`core-event-ring.js`](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js):
  - begrenzter In-Memory-Diagnostikpuffer

### 7) Auth, Access, Security, Audit, Error Handling, i18n
- [`core-auth.js`](/workspaces/CatchTrack-V.1.0/platform/core-auth.js):
  - zentrale Auth-/Session-Wahrheit
  - Bootstrap-Developer-Login
- [`core-access.js`](/workspaces/CatchTrack-V.1.0/platform/core-access.js):
  - Rollen-/Rechteauswertung
- [`security.js`](/workspaces/CatchTrack-V.1.0/platform/security.js):
  - neutrale Sanitizing-/Hash-/Token-/Origin-Helfer
- [`core-audit.js`](/workspaces/CatchTrack-V.1.0/platform/core-audit.js):
  - In-Memory-Audit-Log
- [`core-error-handler.js`](/workspaces/CatchTrack-V.1.0/platform/core-error-handler.js) + [`error-log.js`](/workspaces/CatchTrack-V.1.0/platform/error-log.js):
  - zentrale Fehlernormalisierung und -erfassung
- [`core-i18n.js`](/workspaces/CatchTrack-V.1.0/platform/core-i18n.js):
  - Locale-Support mit DE/EN-Übersetzungen und lokaler Präferenz

### 8) Server/Backend und API-Routing
- Einstieg: [`server/server.js`](/workspaces/CatchTrack-V.1.0/server/server.js)
- HTTP-Implementierung: [`server/bootstrap/server.js`](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- Konfiguration: [`server/config/index.js`](/workspaces/CatchTrack-V.1.0/server/config/index.js)
- Health/Status-Service: [`server/services/health-service.js`](/workspaces/CatchTrack-V.1.0/server/services/health-service.js)
- Exponierte Endpunkte:
  - `/health`, `/api/health`
  - `/api/status`
  - `/api/modules` (Modul-Manifestliste)
- Statisches Routing liefert aus:
  - [`webroot/`](/workspaces/CatchTrack-V.1.0/webroot)
  - [`platform/`](/workspaces/CatchTrack-V.1.0/platform)
  - Moduldateien unter `app/modules`
- Admin-/Dev-Seiten sind im Routing token-geschützt (`ADMIN_ACCESS_TOKEN` + `x-admin-access-token`).

### 9) Webroot-/UI-Schicht
- User-Shell: [`index.html`](/workspaces/CatchTrack-V.1.0/webroot/index.html) + [`user-app.js`](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
- Admin-/Developer-Shells: [`admin.html`](/workspaces/CatchTrack-V.1.0/webroot/admin.html), [`dev.html`](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- Gemeinsame UI-Runtime: [`master-ui.js`](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
- Theme/Style-Basis: [`style.css`](/workspaces/CatchTrack-V.1.0/webroot/style.css)

### 10) Kommunikationsmodell Core <-> Module
- Module kommunizieren über:
  - Core-Events (`Core.emit`, Core Event Bus)
  - Lifecycle-Hooks über Module Manager
  - explizite Service-/Core-APIs
- Discovery- und Aktivierungsfluss wird durch Startup + Module Manager orchestriert.

### 11) Modul-Lifecycle und Isolation
- Betriebs-Lifecycle:
  - discover -> register -> install -> initialize -> enable
  - disable/update/uninstall über Module Manager
- Implementierte Isolationsanforderungen:
  - Modulmetadaten/Abhängigkeiten im Manifest
  - Aktivierung nur managergesteuert
  - Datennutzung über Framework-Storage-/DB-Schnittstellen
  - keine versteckten Cross-Module-Annahmen

### 12) Daten-/Connection-Isolation
- Datentrennung durch:
  - localStorage-Namespace (`core:*`)
  - IndexedDB-Stores nach Verantwortung
- Admin-/Dev-Zugriff auf statische Seiten nur mit expliziter Server-Token-Autorisierung.

### 13) Design-/Theme-Prinzip
- Basisdesign ist neutral und wiederverwendbar.
- Core-Runtime-Logik ist von Präsentationsdateien getrennt.
- Feature-Module können eigene UI rendern, ohne Core-Runtime-Interna zu verändern.

### 14) GPS-Modul (vorhandenes eigenständiges Modul)
- Modulpfad: [`app/modules/gps/`](/workspaces/CatchTrack-V.1.0/app/modules/gps)
- Manifest: [`module.json`](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
- Implementierung: [`index.js`](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js)
- Fähigkeiten:
  - Geolokalisierung (Abfrage/Tracking)
  - Lifecycle-Behandlung
  - Event-Emission
  - Audit-Nutzung
  - Storage/DB-Persistenz von Positionsdaten
  - eigene User-UI-Renderfunktion

### 15) Erlaubte Modul-Schnittstellen und Nicht-Umgehungsregeln
- Module dürfen nutzen:
  - Lifecycle-Vertrag
  - Event Bus/Core-Events
  - Storage-/Database-Manager
  - Auth/Access/Audit/Security/Config/Service-Manager
- Module dürfen nicht umgehen:
  - managergesteuerten Lifecycle
  - zentrale Auth-/Access-Entscheidungen
  - gemeinsame Security-/Error-Handling-Pfade
  - deklariertes Abhängigkeitsmodell

### 16) Regeln für zukünftige Erweiterungen
- Core neutral und fachfrei halten.
- Fachlogik in Application-/Feature-Module, nicht in Core-Runtime-Primitiven.
- Bestehende Core-Schnittstellen vor neuen Globals wiederverwenden.
- Abhängigkeiten immer explizit deklarieren.
- Lifecycle-/State-/Event-Garantien der aktuellen Architektur erhalten.

