# DEVELOPER-GUIDE

## English

### 1) Purpose
This guide is the practical workflow for developers and AI agents extending this neutral framework with new modules, without changing core architecture semantics.

### 2) Plan a new module
1. Define functional scope and boundaries.
2. Define required permissions/capabilities/dependencies.
3. Identify existing core interfaces to reuse.
4. Decide UI needs (user/admin/developer or no UI).
5. Decide storage/database needs and lifecycle behavior.

### 3) Required module files
Create under [`app/modules/<module-id>/`](/workspaces/CatchTrack-V.1.0/app/modules):
- `module.json` (or `manifest.json`)
- `index.js` (or manifest `entry`/`main` file)

### 4) `module.json` structure
Use fields already supported by [`module-interface.js`](/workspaces/CatchTrack-V.1.0/platform/module-interface.js):
- required: `id`
- recommended:
  - `name`
  - `version`
  - `type`
  - `description`
  - `entry` (or `main`)
  - `globalName`
  - `dependencies` (array)
  - `permissions` (array)
  - `capabilities` (array)
  - `autoload` (optional)

### 5) `index.js` module structure
Implement a global module object with lifecycle methods used by [`module-manager.js`](/workspaces/CatchTrack-V.1.0/platform/module-manager.js):
- `install()`
- `initialize()`
- `enable()` / `activate()`
- `disable()` / `deactivate()`
- `update()` (optional)
- `uninstall()`

Include core metadata (`id`, `name`, `version`, `description`, `permissions`, `capabilities`, `status`, `active`).

### 6) Install, initialize, activate, deactivate, uninstall
Lifecycle is controlled by [`ModuleManager`](/workspaces/CatchTrack-V.1.0/platform/module-manager.js):
- install: `ModuleManager.install(moduleId)`
- initialize: `ModuleManager.initialize(moduleId)`
- activate: `ModuleManager.enable(moduleId)` (or `activate`)
- deactivate: `ModuleManager.disable(moduleId)` (or `deactivate`)
- uninstall: `ModuleManager.uninstall(moduleId)`

Do not bypass manager orchestration for regular lifecycle operations.

### 7) Core communication patterns
- Emit framework events through core/event bus APIs.
- Use module manager + registry for module operations.
- Use config, storage, auth/access, and audit services via existing global interfaces.

### 8) Storage usage
- For simple/local values, use [`CoreStorage`](/workspaces/CatchTrack-V.1.0/platform/core-storage.js) (`core:*` namespace behavior).
- For structured persistence, use [`DatabaseManager`](/workspaces/CatchTrack-V.1.0/platform/database-manager.js) stores/transactions.
- Keep module data scoped and avoid overwriting unrelated core data keys.

### 9) Event usage
- Use [`core-event-bus.js`](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js) through existing framework entry points.
- Keep event names explicit and module-prefixed when possible.
- Handle listener errors through existing error handling paths.

### 10) Database usage
- Use supported operations from [`DatabaseManager`](/workspaces/CatchTrack-V.1.0/platform/database-manager.js):
  - `save`, `get`, `insert`, `update`, `delete`, `clear`, `getAll`, `findByIndex`
- Handle promise failures explicitly.

### 11) Auth / access / security usage
- Use [`CoreAuth`](/workspaces/CatchTrack-V.1.0/platform/core-auth.js) for session/user-auth state.
- Use [`CoreAccess`](/workspaces/CatchTrack-V.1.0/platform/core-access.js) for permission checks.
- Use [`CoreSecurity`](/workspaces/CatchTrack-V.1.0/platform/security.js) helpers for sanitization/tokens/hash/origin checks.
- Do not create a parallel auth truth inside modules.

### 12) Error handling, logging, and audit
- Route runtime errors to [`CoreErrorHandler`](/workspaces/CatchTrack-V.1.0/platform/core-error-handler.js).
- Use [`ErrorLog`](/workspaces/CatchTrack-V.1.0/platform/error-log.js) for captured error history.
- Use [`CoreAudit`](/workspaces/CatchTrack-V.1.0/platform/core-audit.js) for auditable actions.
- Optional technical logging paths exist in [`service-manager.js`](/workspaces/CatchTrack-V.1.0/platform/service-manager.js) logging service.

### 13) Provide module APIs and UI
- Module API: expose methods on the module global object.
- Module UI:
  - for user context, follow patterns in [`webroot/user-app.js`](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
  - shared shell behavior in [`webroot/master-ui.js`](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
  - a module may provide a renderer like `renderUserInterface(container)` (as used by GPS).

### 14) Design/theme integration
- Reuse neutral base styling from [`webroot/style.css`](/workspaces/CatchTrack-V.1.0/webroot/style.css).
- Add module-specific classes without breaking shared shell styles.
- Do not move visual concerns into core runtime files.

### 15) Isolation and dependencies
- Declare dependencies explicitly in manifest.
- Keep cross-module coupling explicit and minimal.
- Keep data ownership clear per module.
- Avoid hidden global side effects.

Dependencies to avoid:
- direct reliance on undocumented globals
- direct mutation of unrelated core internals
- bypassing centralized access/auth checks
- hard-coded domain logic in core files

### 16) Files/structures that must not be changed casually
- Core runtime contracts in [`platform/`](/workspaces/CatchTrack-V.1.0/platform)
- Server routing/security behavior in [`server/bootstrap/server.js`](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- Shared UI shell contracts in [`webroot/master-ui.js`](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js) and [`webroot/user-app.js`](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)

Change these only when explicitly required and after compatibility checks.

### 17) Integrating a new module into existing framework
1. Add module folder and files.
2. Validate manifest fields and lifecycle methods.
3. Ensure module is discoverable from `app/modules`.
4. Start runtime and trigger module discovery.
5. Confirm register/install/initialize/enable path.
6. Verify permissions/access behavior.
7. Verify storage/database behavior.
8. Verify UI behavior (if applicable).

### 18) Fully removing a module
1. Deactivate (`disable`).
2. Uninstall via module manager.
3. Remove module directory under `app/modules`.
4. Remove references from any external catalogs/integration points.
5. Verify no remaining dependency references.

### 19) Required checks before integration/merge
- manifest valid and complete
- lifecycle methods implemented
- dependency graph valid
- no core bypasses
- auth/access/security usage aligned with core services
- error/audit handling present where needed
- no unintended changes outside module scope

---

## Deutsch

### 1) Zweck
Diese Anleitung ist der praktische Arbeitsablauf für Entwickler und AI-Agenten, um das neutrale Framework um neue Module zu erweitern, ohne die Core-Architektursemantik zu verändern.

### 2) Neues Modul planen
1. Funktionsumfang und Grenzen definieren.
2. Benötigte Rechte/Capabilities/Abhängigkeiten festlegen.
3. Vorhandene Core-Schnittstellen zur Wiederverwendung identifizieren.
4. UI-Bedarf festlegen (User/Admin/Developer oder keine UI).
5. Storage-/Datenbankbedarf und Lifecycle-Verhalten festlegen.

### 3) Benötigte Moduldateien
Unter [`app/modules/<module-id>/`](/workspaces/CatchTrack-V.1.0/app/modules) anlegen:
- `module.json` (oder `manifest.json`)
- `index.js` (oder per Manifest definiertes `entry`/`main`)

### 4) Aufbau von `module.json`
Nutze Felder, die bereits von [`module-interface.js`](/workspaces/CatchTrack-V.1.0/platform/module-interface.js) unterstützt werden:
- Pflicht: `id`
- empfohlen:
  - `name`
  - `version`
  - `type`
  - `description`
  - `entry` (oder `main`)
  - `globalName`
  - `dependencies` (Array)
  - `permissions` (Array)
  - `capabilities` (Array)
  - `autoload` (optional)

### 5) Aufbau von `index.js`
Implementiere ein globales Modulobjekt mit Lifecycle-Methoden aus [`module-manager.js`](/workspaces/CatchTrack-V.1.0/platform/module-manager.js):
- `install()`
- `initialize()`
- `enable()` / `activate()`
- `disable()` / `deactivate()`
- `update()` (optional)
- `uninstall()`

Enthalten sein sollten Core-Metadaten (`id`, `name`, `version`, `description`, `permissions`, `capabilities`, `status`, `active`).

### 6) Installieren, initialisieren, aktivieren, deaktivieren, deinstallieren
Der Lifecycle wird durch [`ModuleManager`](/workspaces/CatchTrack-V.1.0/platform/module-manager.js) gesteuert:
- installieren: `ModuleManager.install(moduleId)`
- initialisieren: `ModuleManager.initialize(moduleId)`
- aktivieren: `ModuleManager.enable(moduleId)` (oder `activate`)
- deaktivieren: `ModuleManager.disable(moduleId)` (oder `deactivate`)
- deinstallieren: `ModuleManager.uninstall(moduleId)`

Reguläre Lifecycle-Schritte nicht am Manager vorbei ausführen.

### 7) Core-Kommunikationsmuster
- Framework-Events über Core-/Event-Bus-APIs emittieren.
- Moduloperationen über Manager + Registry ausführen.
- Config, Storage, Auth/Access und Audit über bestehende globale Schnittstellen nutzen.

### 8) Storage-Nutzung
- Für einfache/lokale Werte [`CoreStorage`](/workspaces/CatchTrack-V.1.0/platform/core-storage.js) verwenden (`core:*`-Namespace).
- Für strukturierte Persistenz [`DatabaseManager`](/workspaces/CatchTrack-V.1.0/platform/database-manager.js) und Stores/Transaktionen nutzen.
- Moduldaten scoped halten und keine fremden Core-Keys überschreiben.

### 9) Event-Nutzung
- [`core-event-bus.js`](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js) über vorhandene Framework-Zugänge verwenden.
- Event-Namen klar und möglichst modulprefixt halten.
- Listener-Fehler über bestehende Error-Handling-Pfade behandeln.

### 10) Datenbank-Nutzung
- Unterstützte Operationen aus [`DatabaseManager`](/workspaces/CatchTrack-V.1.0/platform/database-manager.js) verwenden:
  - `save`, `get`, `insert`, `update`, `delete`, `clear`, `getAll`, `findByIndex`
- Promise-Fehler explizit behandeln.

### 11) Auth / Access / Security
- [`CoreAuth`](/workspaces/CatchTrack-V.1.0/platform/core-auth.js) für Session-/Auth-Status verwenden.
- [`CoreAccess`](/workspaces/CatchTrack-V.1.0/platform/core-access.js) für Rechteprüfung verwenden.
- [`CoreSecurity`](/workspaces/CatchTrack-V.1.0/platform/security.js) für Sanitizing/Token/Hash/Origin-Checks nutzen.
- Keine parallele Auth-Wahrheit im Modul aufbauen.

### 12) Fehlerbehandlung, Logging und Audit
- Laufzeitfehler an [`CoreErrorHandler`](/workspaces/CatchTrack-V.1.0/platform/core-error-handler.js) weitergeben.
- [`ErrorLog`](/workspaces/CatchTrack-V.1.0/platform/error-log.js) für Fehlerhistorie nutzen.
- [`CoreAudit`](/workspaces/CatchTrack-V.1.0/platform/core-audit.js) für auditierbare Aktionen nutzen.
- Optionaler technischer Logging-Pfad über Logging-Service in [`service-manager.js`](/workspaces/CatchTrack-V.1.0/platform/service-manager.js).

### 13) Eigene Modul-APIs und UI bereitstellen
- Modul-API: Methoden am globalen Modulobjekt bereitstellen.
- Modul-UI:
  - User-Kontext nach Muster in [`webroot/user-app.js`](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
  - Shared-Shell-Verhalten in [`webroot/master-ui.js`](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
  - Renderer wie `renderUserInterface(container)` sind möglich (GPS-Beispiel).

### 14) Design-/Theme-Anbindung
- Neutrale Basisstyles aus [`webroot/style.css`](/workspaces/CatchTrack-V.1.0/webroot/style.css) wiederverwenden.
- Modulspezifische Klassen ergänzen, ohne Shared-Shell-Styles zu brechen.
- Keine visuellen Belange in Core-Runtime-Dateien verschieben.

### 15) Isolation und Abhängigkeiten
- Abhängigkeiten explizit im Manifest deklarieren.
- Cross-Module-Kopplung explizit und minimal halten.
- Datenhoheit pro Modul klar halten.
- Versteckte globale Side Effects vermeiden.

Ausdrücklich zu vermeidende Abhängigkeiten:
- direkte Abhängigkeit von nicht dokumentierten Globals
- direkte Mutation fremder Core-Interna
- Umgehung zentraler Access-/Auth-Prüfungen
- hart codierte Fachlogik in Core-Dateien

### 16) Dateien/Strukturen, die nicht leichtfertig geändert werden dürfen
- Core-Runtime-Verträge in [`platform/`](/workspaces/CatchTrack-V.1.0/platform)
- Server-Routing/Security-Verhalten in [`server/bootstrap/server.js`](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- Shared-UI-Shell-Verträge in [`webroot/master-ui.js`](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js) und [`webroot/user-app.js`](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)

Nur bei explizitem Bedarf und nach Kompatibilitätsprüfung anpassen.

### 17) Neues Modul in das bestehende Framework integrieren
1. Modulordner und Dateien anlegen.
2. Manifestfelder und Lifecycle-Methoden validieren.
3. Sicherstellen, dass Discovery über `app/modules` funktioniert.
4. Runtime starten und Modul-Discovery auslösen.
5. Register/Install/Initialize/Enable-Pfad prüfen.
6. Rechte-/Access-Verhalten prüfen.
7. Storage-/Datenbankverhalten prüfen.
8. UI-Verhalten prüfen (falls vorhanden).

### 18) Modul vollständig entfernen
1. Deaktivieren (`disable`).
2. Über ModuleManager deinstallieren.
3. Modulordner unter `app/modules` entfernen.
4. Referenzen aus Katalogen/Integrationspunkten entfernen.
5. Prüfen, dass keine Abhängigkeitsreferenzen übrig bleiben.

### 19) Pflichtprüfungen vor Integration/Merge
- Manifest valide und vollständig
- Lifecycle-Methoden implementiert
- Abhängigkeitsgraph valide
- keine Core-Umgehungen
- Auth/Access/Security-Nutzung im Einklang mit Core-Services
- Error-/Audit-Handling an relevanten Stellen vorhanden
- keine unbeabsichtigten Änderungen außerhalb des Modul-Scope

