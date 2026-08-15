# Neutral Framework Workflow

## Final Status

STATUS: MASTER FROZEN

Der tatsächliche Repository-Stand ist verifiziert und der Core ist final als Master Freeze dokumentiert. Keine neuen Architektur- oder Core-Änderungen werden nach diesem Stand mehr eingebaut; spätere Vorschläge werden separat als Backlog dokumentiert.

The repository is reduced to a neutral, reusable framework foundation. The Core initializes correctly, the module lifecycle remains stable, and the Modules directory remains empty and intentionally reserved for future external modules only.

## Final Core Structure

- Core/
  - bootstrap and runtime entry points
  - lifecycle management
  - config and storage layers
  - database and service coordination
  - event bus and error handling
  - user, admin, and i18n framework modules
  - module interface, registry, and manager
  - security and generic state management
- Modules/
  - empty by design
  - no framework code embedded inside
  - no test modules retained
  - no application-specific dependencies

## Module Architecture

The framework uses a neutral discovery and registration model based on:

- module manifests
- manifest validation through a generic interface
- external module discovery from the Modules directory
- registry-based tracking of loaded modules
- manager-based install, initialize, enable, disable, and unregister operations
- lifecycle boundaries that isolate failures without taking the framework down

The final design is intentionally generic and does not assume any domain-specific feature set.

## Discovery and Loader Principle

- Framework components are loaded from the Core folder.
- External modules are discovered only through a generic manifest-oriented process.
- Modules are validated before registration.
- Unknown or invalid modules are not hardcoded into the framework.
- Missing manifests and failed initialization are handled without destroying the runtime.

## Tests Performed

The following checks were executed with actual runtime validation in a Node-based browser-like environment:

- Core bootstrap checks
- Core runtime startup checks
- lifecycle phase transitions
- config and storage initialization
- database manager bootstrap
- service manager bootstrap
- security and state checks
- event bus and error handling checks
- user, admin, and i18n module checks
- module interface validation
- registry and manager validation
- discovery of a temporary external module outside the final framework
- negative tests for missing/invalid module data
- startup without modules
- empty Modules directory behavior
- failed module initialization isolation
- verification that no stale domain references remain in the repository

## Results

All checks executed for the neutral framework passed within the final runtime validation set.

Confirmed:

- framework starts without module content
- empty Modules directory does not produce a framework failure
- unknown modules are not expected or hardcoded
- faulty module initialization is isolated from the core runtime
- missing manifests are safely rejected
- no remaining functional GPS, Weather, Fishing, Catchbook, or CatchTrack references exist in the framework codebase
- no temporary test module files remain in the repository
- no test references remain in the final framework

## Known Limitations

- The project intentionally remains a neutral framework foundation only.
- No application logic or business module set is included in the final Core.
- External modules are supported by the generic discovery model but are not part of this freeze commit.

## Final Repository State

- Core is neutral and reusable.
- Modules remains intentionally empty.
- No stale domain-specific artifacts remain.
- The repository is in a verified, frozen framework state.
- This document reflects the actual final status and no unverified claims are included.

---

## Architecture Review – User & Admin Master Core

Datum: 2026-08-15
Umfang: reiner Architektur-Review. Keine Implementierung, kein Core-Umbau.
Geänderte Dateien in diesem Arbeitsschritt: ausschließlich WORKFLOW.md.

Legende der Markierungen:

- **BESTÄTIGT** – Entscheidung ist tragfähig und sollte so übernommen werden.
- **EMPFOHLENE ÄNDERUNG** – Abweichung von der bisherigen Planung wird empfohlen.
- **ALTERNATIVE** – gleichwertige oder abhängig vom Kontext bessere Option.
- **OFFENE ENTSCHEIDUNG** – muss vor dem Einfrieren der Master-Dateien geklärt werden.

## 1. Aktueller Zustand

Das Repository besteht ausschließlich aus `Core/` (24 Dateien) und `WORKFLOW.md`.
Es existiert kein `Modules/`-Verzeichnis mit Inhalt, keine `index.html`, keine UI,
keine Tests im Repository, kein Build-System, kein Paketmanifest.

Alle Core-Komponenten sind browserorientierte IIFEs, die genau ein globales
Objekt auf `window` setzen. Es gibt keine ES-Module, kein Import/Export,
keine Dependency Injection. Die Kopplung erfolgt durchgängig über `window.*`
und über den Event-Bus.

`Core/core-user.js` und `Core/core-admin.js` sind auf diesem Stand deutlich
weniger ausgereift als der übrige Core. Sie sind faktisch Prototypen:
`core-user.js` ist eine RAM-basierte Demo-Benutzerliste ohne Authentifizierung,
`core-admin.js` ist im Wesentlichen ein Fehlerpuffer plus Health-Check.
Beide erfüllen die im Auftrag beschriebene Zielrolle als Master-Komponenten
derzeit nicht.

### 1.1 Geprüfte Dateien und Verzeichnisse

Vollständig geprüft:

- `Core/core-user.js` (Hauptgegenstand)
- `Core/core-admin.js` (Hauptgegenstand)

Als Kontext geprüft (unverändert, nur gelesen):

- `Core/core.js`, `Core/app.js`, `Core/core-entry.js`, `Core/core-runtime.js`
- `Core/core-startup.js`, `Core/core-shutdown.js`, `Core/core-loader.js`
- `Core/core-lifecycle.js`, `Core/core-context.js`, `Core/core-config.js`
- `Core/core-state.js`, `Core/core-storage.js`, `Core/core-event-bus.js`
- `Core/core-error-handler.js`, `Core/error-log.js`, `Core/core-i18n.js`
- `Core/module-interface.js`, `Core/module-registry.js`, `Core/module-manager.js`
- `Core/config-manager.js`, `Core/database-manager.js`, `Core/service-manager.js`
- `Core/security.js`
- `WORKFLOW.md`
- Repository-Wurzel (keine weiteren relevanten Dateien vorhanden)

### 1.2 Berücksichtigte bestehende Core-Komponenten und ihre relevanten Fähigkeiten

| Komponente | Global | Für User/Admin relevante Fähigkeit |
|---|---|---|
| Core | `window.Core` | `on/off/once/emit`, Zugriff auf Registry und Manager |
| CoreEventBus | `window.CoreEventBus` | `subscribe/unsubscribe/publish/clear` |
| CoreStartup | `window.CoreStartup` | ruft `UserModule.init()` und `AdminModule.init()` konditional auf |
| CoreLoader | `window.CoreLoader` | enthält `defaultFrameworkCatalog` mit `core-user`, `core-admin`, `core-i18n` |
| CoreLifecycle | `window.CoreLifecycle` | Phasen `created → initializing → ready → running → stopped` |
| CoreContext | `window.CoreContext` | Runtime-Werte, Umgebungsinfos, Online-Status |
| CoreConfig | `window.CoreConfig` | eingefrorene App-/Core-Version |
| CoreState | `window.CoreState` | flüchtiger Laufzeitzustand |
| CoreStorage | `window.CoreStorage` | localStorage mit `core:`-Präfix |
| ConfigManager | `window.ConfigManager` | 8 Default-Configs inkl. `security` und Feature-Flags `userModule`, `adminModule` |
| DatabaseManager | `window.DatabaseManager` | IndexedDB mit Stores `users`, `modules`, `logs`, `sessions`, `settings`, `cache`, `sync` |
| ServiceManager | `window.ServiceManager` | `UserService`, `AuthService`, `ModuleService`, `LoggingService`, `CacheService` |
| ModuleRegistry | `window.ModuleRegistry` | `register/unregister/get/getAll/has/clear/discover` |
| ModuleManager | `window.ModuleManager` | `install/initialize/enable/disable/unregister/getStatus/validateDependencies` |
| ModuleInterface | `window.ModuleInterface` | Manifest-Validierung, Status-Konstanten |
| CoreErrorHandler / ErrorLog | `window.CoreErrorHandler`, `window.ErrorLog` | zentrale Fehlererfassung, Event `error:handled` |
| CoreSecurity | `window.CoreSecurity` | `sanitizeText`, `validateInput`, `generateToken`, `hash` (SHA-256), Origin-Allowlist |
| I18nModule | `window.I18nModule` | Locale-Verwaltung, `t(key, params)` |

### 1.3 Geprüfte Funktionen von `Core/core-user.js`

Globale: `window.UserModule`, Manifest-ID `core-user`, interner Name `user-module`.

Interner Helfer:

- `normalizePermissions(user)` – hart codierte Rollen-Permission-Tabelle für
  `admin`, `manager`, `member`; vereinigt Rollenrechte mit individuellen Rechten.

Öffentliche API:

- `init()`
- `createDefaultUsers()` – legt `demo-user-001` (member) und `demo-admin-001` (admin) an
- `authenticate(userId)`
- `getCurrentUser()`
- `logout()`
- `getAllUsers()`
- `getUserById(userId)`
- `getUserByUsername(username)`
- `isUsernameAvailable(username, excludeId)`
- `createUser(userData)`
- `updateUser(userId, updates)`
- `deleteUser(userId)`
- `hasRole(role)`
- `hasPermission(permission)`
- `isAdmin()`

Emittierte Events: `user-module:initialized`, `user-module:authenticated`,
`user-module:auth-failed`, `user-module:logout`, `user-module:user-created`,
`user-module:user-updated`, `user-module:user-deleted`.

Nicht vorhanden: Persistenz, Passwörter, Sessions, Sperrung, Aktivierung/
Deaktivierung, Suche, Audit, Rechteprüfung für schreibende Operationen,
`locale`, `timezone`, `preferences`, `lastModifiedAt/By`, `failedLoginAttempts`,
`lockedUntil`.

### 1.4 Geprüfte Funktionen von `Core/core-admin.js`

Globale: `window.AdminModule`, Manifest-ID `core-admin`, interner Name `admin-module`.

Öffentliche API:

- `init()` – abonniert `error:handled` und `module:registered`
- `logError(error)` – Ringpuffer mit 100 Einträgen
- `addModuleStats(data)`
- `getSystemStats()`
- `getUptime()`
- `getLoadedModules()`
- `getErrorLog()`
- `clearErrorLog()`
- `performHealthCheck()`
- `testEventEmission()`
- `testStorageAccess()`
- `getDebugInfo()`

Emittierte Events: `admin-module:initialized`, `admin-module:error-logged`,
`admin-module:error-log-cleared`, `admin-test:event`.

Nicht vorhanden: jede Form von Benutzerverwaltung, Rollen-/Rechtevergabe,
Modulverwaltung, Konfigurationszugriff, Datenbankstatus, Servicestatus,
Audit-Log, Rechteprüfung, Lifecycle-/Startup-Auskunft.

### 1.5 Festgestellte Abhängigkeiten

`core-user.js` hängt ab von:

- `window.Core` (optional, nur für `emit`)

`core-admin.js` hängt ab von:

- `window.Core` (optional, für `on`/`emit`)
- `window.ModuleManager`, `window.UserModule`, `window.localStorage`,
  `window.DatabaseManager`, `navigator` – jeweils nur als Existenzprüfung im Health-Check

Andere Komponenten hängen ab von User/Admin:

- `Core/core-loader.js`: `defaultFrameworkCatalog` beschreibt `core-user` und `core-admin`
  inkl. `globalName` und `source`
- `Core/core-startup.js`: ruft `UserModule.init()` und `AdminModule.init()` konditional auf
- `Core/service-manager.js`: `AuthService.authenticate()` nutzt `window.UserModule.getUserById()`
  als Fallback
- `Core/config-manager.js`: Feature-Flags `features.userModule`, `features.adminModule`
- `Core/database-manager.js`: Store `users` mit Indizes `email`, `role`, `active`
- `Core/core-i18n.js`: Übersetzungsschlüssel `user.role`

Bewertung: Die Abhängigkeitsrichtung ist grundsätzlich sauber (Core kennt
User/Admin nur konditional). Problematisch ist der Rückwärtsbezug von
`ServiceManager.AuthService` auf `window.UserModule` – dort entsteht ein Zyklus
auf Konzeptebene und eine doppelte Wahrheit über „wer ist eingeloggt".

## 2. Geplante Architektur (Zusammenfassung des Auftrags)

- CatchTrack baut auf einem neutralen, wiederverwendbaren Framework auf.
- Der bestehende Core bleibt unangetastet.
- `core-user.js` und `core-admin.js` werden als Master-Komponenten definiert und
  später eingefroren.
- User und Admin bleiben Core-Bestandteil, keine optionalen Fachmodule.
- Fachmodule (Catchbook, Waters, Maps, Equipment, Statistics, AI, Photos, Tides)
  sind optional und untereinander unabhängig.
- User-ID im Format `USR-000001`, unveränderlich, nicht wiederverwendbar.
- Rollen `member`, `manager`, `admin`, `developer` plus Berechtigungen.
- Admin-Core übernimmt Benutzer-, System- und Modulverwaltung.
- Developer-Bereich für Diagnose.
- Zentrale Oberfläche mit den Bereichen USER, ADMIN, DEVELOPER.
- Erster Testbenutzer `USR-000001`, Rolle `developer`, Status `active`.

## 3. Technische Bewertung

### 3.1 Was gut ist – BESTÄTIGT

- **User und Admin als Core-Bestandteil.** Identität und Zugriffskontrolle sind
  Querschnittsbelange. Sie als optionale Module zu führen, würde jedes Fachmodul
  zwingen, defensiv gegen ihr Fehlen zu programmieren. **BESTÄTIGT**
- **Trennung von unveränderlicher ID und änderbarem Benutzernamen.** Fachlich und
  technisch korrekt und heute schon der häufigste Fehler in vergleichbaren Systemen.
  **BESTÄTIGT**
- **Trennung von Rolle und Berechtigung.** Richtig. Rollen sind Bündel, die
  effektive Berechtigung ist die entscheidende Prüfgröße. **BESTÄTIGT**
- **Permission-Namensschema `objekt:aktion`.** Bereits im Code vorhanden
  (`user:read`, `module:install`) und zukunftssicher. **BESTÄTIGT**
- **Admin soll orchestrieren, nicht duplizieren.** Genau richtig und aktuell der
  wichtigste Hebel gegen technische Schulden. **BESTÄTIGT**
- **Modulverwaltung über ModuleManager/ModuleRegistry statt eigener Logik im Admin.**
  **BESTÄTIGT**
- **Audit-Log als Anforderung.** Notwendig, sobald Rollen und Rechte administrierbar sind.
  **BESTÄTIGT**
- **Aussage „UI darf niemals die einzige Zugriffskontrolle sein".** **BESTÄTIGT**
- **Der Vorsatz, jetzt Schnittstellen zu definieren statt zu implementieren.**
  **BESTÄTIGT**

### 3.2 Was problematisch ist

**P1 – `core-user.js` vermischt vier Verantwortlichkeiten.**
Identitätsspeicher (`users` Map), Benutzerverwaltung (CRUD), Authentifizierung
(`authenticate`, `logout`) und Autorisierung (`hasPermission`, `hasRole`, `isAdmin`)
liegen in einem Objekt. Das ist der Hauptgrund, warum die Datei so noch nicht
einfrierbar ist.

**P2 – `authenticate(userId)` ist keine Authentifizierung.**
Die Methode nimmt eine User-ID entgegen und gibt bei Status `active` den
vollständigen Benutzer inklusive aller Berechtigungen zurück. Es gibt kein
Geheimnis, keinen Faktor, keine Prüfung. Wer die ID kennt, ist der Benutzer.
Dieselbe Schwäche existiert unabhängig in `ServiceManager.AuthService.authenticate(userId)`.
Das ist im aktuellen Zustand kein Framework-Fehler mit Sicherheitsfolge
(reine lokale Demo ohne Server), es ist aber ein API-Design, das genau diese
Sicherheitslücke zementiert, sobald es eingefroren wird.

**P3 – `hasPermission()` enthält einen bedingungslosen Admin-Bypass.**
`return this.currentUser.permissions.includes(permission) || this.currentUser.role === 'admin';`
Damit gilt jede beliebige zukünftige Berechtigung automatisch für `admin`. Ein
Deny kann per Definition nie greifen. Das macht ein späteres Allow/Deny-Modell
unmöglich, ohne die eingefrorene Semantik zu brechen.

**P4 – Autorisierung prüft immer nur `currentUser`.**
`hasPermission(permission)` hat kein Subjekt. Serverseitige Prüfungen,
Hintergrundjobs, Impersonation, Tests und Audit-Auswertungen brauchen
`can(subject, permission, resource)`. Eine an `currentUser` gebundene Signatur ist
für eine Master-Datei zu eng.

**P5 – Keine einzige schreibende Operation ist rechtlich geschützt.**
`createUser`, `updateUser`, `deleteUser` prüfen keine Berechtigung. `updateUser`
schützt zwar `id` und `createdAt`, erlaubt aber ausdrücklich `role` und
`permissions` in `safeUpdates`. Jeder Aufrufer kann sich selbst zum Admin machen.
Für eine Master-Komponente ist das eine konzeptionelle Schwäche, kein Detail.

**P6 – ID-Erzeugung ist unsicher und kollisionsanfällig.**
`const userId = \`usr-${Date.now()}\`` kollidiert bei zwei Anlagen in derselben
Millisekunde und widerspricht dem geplanten Format `USR-000001`.

**P7 – Keine Persistenz.**
Benutzer leben in einer `Map` und sind nach Reload verloren, obwohl
`DatabaseManager` bereits einen `users`-Store mit passenden Indizes bereitstellt.
Gleichzeitig schreibt `ServiceManager.UserService` in genau diesen Store. Es gibt
damit zwei konkurrierende Benutzerquellen.

**P8 – Doppelte Wahrheit über die aktive Sitzung.**
`UserModule.currentUser` und `ServiceManager.AuthService.currentUser` existieren
nebeneinander und werden nicht synchronisiert. Auch die Events sind doppelt:
`user-module:authenticated` und `auth:authenticated`.

**P9 – `core-admin.js` dupliziert bereits vorhandene Core-Funktionalität.**
`logError` und `getErrorLog` bilden `ErrorLog` nach. `addModuleStats` bildet einen
Teil von `ModuleRegistry` nach, allerdings mit eigenem, driftendem Datenmodell
(`status: 'registered'` wird nie aktualisiert, deaktivierte Module bleiben
„registered"). `getLoadedModules()` liefert deshalb systematisch falsche Zustände.

**P10 – `addModuleStats` ist ein unbegrenzt wachsendes Array.**
Anders als `errors` gibt es keine Obergrenze und keine Deduplizierung. Bei
wiederholter Registrierung wächst das Array monoton.

**P11 – `testEventEmission()` emittiert Events im Produktivbus.**
Ein Health-Check, der `admin-test:event` in den globalen Bus schreibt, ist ein
Seiteneffekt in einer als Read-only erwarteten Diagnosefunktion.

**P12 – `performHealthCheck()` leitet `healthy` aus allen booleschen Feldern ab.**
Jedes zukünftig hinzugefügte boolesche Feld verändert automatisch die Bedeutung
von `healthy`. Das ist eine versteckte Kopplung und in einer einzufrierenden Datei
gefährlich.

**P13 – `getDebugInfo()` gibt `navigator.userAgent` ungeprüft heraus.**
Für eine Diagnose-API akzeptabel, aber es fehlt jede Kennzeichnung, dass die
Ausgabe rechtepflichtig ist.

**P14 – Namensinkonsistenz.**
Manifest-ID `core-user` / interner `name: 'user-module'` / Global `UserModule` /
Event-Präfix `user-module:`. Drei Namen für dieselbe Sache. Nach dem Einfrieren
ist das nicht mehr korrigierbar.

**P15 – Doppelter Registrierungspfad.**
`core-user.js` und `core-admin.js` pushen ihr Manifest direkt in
`window.FrameworkModuleCatalog`, obwohl `CoreLoader` denselben Katalog aus
`defaultFrameworkCatalog` aufbaut. Zwei Quellen, potenzielle Reihenfolgeabhängigkeit.

**P16 – User/Admin werden in `core-startup.js` konditional initialisiert.**
`if (window.UserModule && ...)`. Wenn User und Admin echte Core-Pflichtkomponenten
sind, widerspricht das dem Grundprinzip: ihr Fehlen bleibt unbemerkt.
Gleichzeitig existieren Feature-Flags `features.userModule` und `features.adminModule`,
die suggerieren, sie seien abschaltbar.

**P17 – Keine Fehlerbehandlung um `init()`-Aufrufe.**
Ein Fehler in `UserModule.init()` bricht den gesamten Core-Start ab, während
Fehler externer Module laut WORKFLOW.md isoliert werden.

### 3.3 Was fehlt

- Sitzungsverwaltung (der Store `sessions` existiert, wird aber nirgends genutzt)
- Audit-Trail
- Persistenz der Benutzer
- Passwort-/Credential-Abstraktion
- Rechteprüfung auf schreibenden Operationen
- Definition der Rolle `developer` (im Auftrag vorgesehen, im Code nicht vorhanden)
- Definiertes Fehlerverhalten (Exception vs. `null` vs. `false` ist inkonsistent:
  `createUser` wirft, `updateUser` gibt `null`, `deleteUser` gibt `false`)
- Ein Ergebnisobjekt für fehlgeschlagene Autorisierung (nur `true/false`, kein Grund)
- Paginierung/Suche für Benutzerlisten
- Versionierung des Benutzerdatensatzes (`schemaVersion`) für spätere Migrationen
- Jede Form von UI oder Einstiegspunkt

### 3.4 Was überdimensioniert ist

- **Der geplante Funktionsumfang von `core-admin.js`.** Benutzerverwaltung,
  Systemverwaltung, Modulverwaltung, Konfiguration, Logs, Health, Diagnose und
  Developer-Ansicht in einer einzufrierenden Datei ist ein God-Object. Genau das
  macht das Einfrieren später unmöglich.
- **Rollen `owner`, `moderator`, `operator`.** Ohne konkreten Anwendungsfall nicht
  aufnehmen. `guest` dagegen ist sinnvoll, weil „nicht angemeldet" sonst als
  Sonderfall überall auftaucht.
- **Performance-Daten im Developer-Bereich.** Ohne Messpunkte im Core wäre das
  Schätzung statt Diagnose. Später nachrüsten.
- **Eine vollständige Berechtigungsvererbungshierarchie.** Flache Rollen mit
  expliziten Permission-Sets sind für den absehbaren Bedarf ausreichend und
  erheblich einfacher zu prüfen.

### 3.5 Was zu stark gekoppelt ist

- `core-admin.js` → `window.UserModule` im Health-Check (Existenzprüfung einer
  konkreten Schwestermodul-Variablen)
- `ServiceManager.AuthService` → `window.UserModule` (Rückwärtsabhängigkeit)
- Alles → `window.*` (kein Injektionspunkt, nicht isoliert testbar)
- Rollen-Permission-Tabelle hart in `core-user.js` (jede neue Rolle erzwingt eine
  Änderung an einer eingefrorenen Datei)
- Der geplante Admin-Core an praktisch jede andere Core-Komponente

### 3.6 Wo technischer Schuldenaufbau droht

1. Einfrieren von `hasPermission()` mit Admin-Bypass → Allow/Deny nie nachrüstbar.
2. Einfrieren von `authenticate(userId)` → jede spätere echte Authentifizierung
   ist ein Breaking Change.
3. Hart codierte Rollentabelle in einer eingefrorenen Datei.
4. Zwei Benutzerquellen (Map vs. IndexedDB) → Divergenz garantiert.
5. Zwei Session-Wahrheiten → Autorisierungslücken.
6. Admin als God-Object → jede neue Admin-Funktion bricht das Freeze.
7. Fehlendes `schemaVersion` im Benutzerdatensatz → Migrationen ohne Anker.
8. Synchrone API-Signaturen (`getUserById` gibt direkt ein Objekt) → der Wechsel
   auf Persistenz erzwingt später `async` und damit einen Bruch.

Punkt 8 ist die am meisten unterschätzte Schuld: **Persistenz ist asynchron.
Wer heute synchrone Signaturen einfriert, friert „keine Persistenz" mit ein.**

## 4. Empfohlene Architektur

### 4.1 Kernempfehlung – EMPFOHLENE ÄNDERUNG

Die beiden Dateien sollen nicht alles enthalten, sondern zu schmalen, stabilen
Fassaden über klar getrennten Core-Komponenten werden.

Empfohlene Aufteilung:

| Datei | Verantwortung | Status |
|---|---|---|
| `Core/core-identity.js` | Benutzerdatensatz, ID-Vergabe, Persistenz, CRUD | NEU (später) |
| `Core/core-auth.js` | Credentials, Login/Logout, Sessions, Sperrung | NEU (später) |
| `Core/core-access.js` | Rollen, Permissions, `can()`-Auswertung | NEU (später) |
| `Core/core-audit.js` | unveränderlicher Audit-Trail | NEU (später) |
| `Core/core-user.js` | **Master-Fassade** für Identität, Session, Rechteprüfung | Master |
| `Core/core-admin.js` | **Master-Fassade** für Administration und Diagnose | Master |

`core-user.js` und `core-admin.js` definieren dann nur noch:

- die öffentliche, stabile API
- die Datenmodelle
- die Ereignisnamen
- die Berechtigungskonstanten
- die Delegation an die jeweilige Fachkomponente

Damit ist das Ziel „Master-Datei einfrieren" tatsächlich erreichbar, weil
Verhalten in den nicht eingefrorenen Komponenten weiterentwickelt werden kann,
ohne die Fassade zu brechen.

**ALTERNATIVE (verworfen):** Alles in `core-user.js` und `core-admin.js` belassen
und diese Dateien groß werden lassen. Bewertung: kurzfristig schneller, führt aber
garantiert dazu, dass das Freeze innerhalb weniger Iterationen wieder gebrochen wird.
Nicht empfohlen.

**ALTERNATIVE (teilweise empfohlen):** Nur `core-auth.js` und `core-audit.js`
auslagern, Identität und Access in `core-user.js` belassen. Bewertung: akzeptabler
Kompromiss, wenn die Anzahl der Core-Dateien begrenzt bleiben soll. Auth und Audit
sind die beiden Bereiche, deren Auslagerung den größten Nutzen bringt.
**OFFENE ENTSCHEIDUNG:** volle Aufteilung (4 neue Dateien) oder Minimalvariante (2 neue Dateien).

### 4.2 Vorgeschlagene API-Struktur `core-user.js`

Alle datenberührenden Methoden sind bewusst `async`, damit spätere Persistenz
kein Breaking Change ist. **EMPFOHLENE ÄNDERUNG** gegenüber dem heutigen
synchronen Code.

```
UserModule (window.UserModule, Manifest-ID core-user)

  // Lebenszyklus
  async init(context)
  async shutdown()

  // Identität (Delegation an core-identity)
  async createUser(draft, actor)          -> User
  async getUserById(userId)               -> User | null
  async getUserByUsername(username)       -> User | null
  async listUsers(query)                  -> { items, total, cursor }
  async updateUser(userId, patch, actor)  -> User
  async deleteUser(userId, actor)         -> boolean      // Soft-Delete
  async setStatus(userId, status, actor)  -> User         // active|inactive|locked|deleted

  // Session (Delegation an core-auth)
  async login(credentials)                -> Session | AuthError
  async logout(sessionId)
  getSession()                            -> Session | null
  getCurrentUser()                        -> User | null   // Snapshot, read-only
  isAuthenticated()                       -> boolean

  // Autorisierung (Delegation an core-access)
  can(permission, options)                -> boolean            // aktueller Kontext
  canSubject(subject, permission, options)-> boolean            // beliebiges Subjekt
  explain(subject, permission)            -> { allowed, reason, source }
  getEffectivePermissions(subject)        -> string[]

  // Konstanten (eingefroren)
  ROLES, STATUS, PERMISSIONS, EVENTS, ID_PATTERN, SCHEMA_VERSION
```

Bewusst **nicht** in `core-user.js`:

- Passwort-Hashing (gehört in `core-auth.js`, Primitive in `CoreSecurity`)
- Session-Speicherung (gehört in `core-auth.js` + `DatabaseManager`)
- Datenbankzugriff (gehört in `core-identity.js` + `DatabaseManager`)
- E-Mail-Versand, Passwort-Reset-Transport
- OAuth/OIDC/SSO-Implementierungen
- UI, Rendering, DOM
- CatchTrack-Fachlogik (Catches, Waters, Statistiken)
- Rollen, die nur eine Anwendung braucht

### 4.3 Vorgeschlagene API-Struktur `core-admin.js`

```
AdminModule (window.AdminModule, Manifest-ID core-admin)

  async init(context)
  async shutdown()

  // Benutzerverwaltung – reine Delegation an UserModule, mit Rechteprüfung
  users: {
    async list(query, actor)
    async get(userId, actor)
    async create(draft, actor)
    async update(userId, patch, actor)
    async setStatus(userId, status, actor)
    async assignRole(userId, role, actor)
    async grantPermission(userId, permission, actor)
    async revokePermission(userId, permission, actor)
  }

  // Modulverwaltung – reine Delegation an ModuleManager / ModuleRegistry
  modules: {
    async list(actor)                 // aus ModuleRegistry.getAll()
    async status(moduleId, actor)     // aus ModuleManager.getStatus()
    async install(moduleId, actor)
    async enable(moduleId, actor)
    async disable(moduleId, actor)
    async uninstall(moduleId, actor)
    async dependencies(moduleId, actor)
    async diagnose(moduleId, actor)
  }

  // Systemverwaltung – reine Delegation
  system: {
    async status(actor)      // CoreLifecycle + CoreContext + CoreConfig
    async services(actor)    // ServiceManager
    async databases(actor)   // DatabaseManager
    async config(actor)      // ConfigManager (ohne Secrets)
    async health(actor)      // aggregierter, seiteneffektfreier Health-Check
  }

  // Diagnose / Developer
  diagnostics: {
    async core(actor)
    async modules(actor)
    async database(actor)
    async services(actor)
    async errors(query, actor)   // aus ErrorLog
    async events(query, actor)
    async audit(query, actor)    // aus core-audit
    async snapshot(actor)        // alles zusammen, ein Aufruf
  }

  PERMISSIONS, EVENTS
```

Kernregel: **Jede Admin-Methode nimmt einen `actor` entgegen, prüft die
Berechtigung über `UserModule.canSubject(...)`, delegiert an die zuständige
Core-Komponente und schreibt einen Audit-Eintrag.** Eigener Zustand: keiner.

Bewusst **nicht** in `core-admin.js`:

- ein eigener Fehlerpuffer (→ `ErrorLog`)
- ein eigenes Modulverzeichnis (→ `ModuleRegistry`)
- eigene Modul-Installationslogik (→ `ModuleManager`)
- eigene Konfigurationsspeicherung (→ `ConfigManager`)
- eigener Datenbankzugriff (→ `DatabaseManager`)
- Audit-Speicherung (→ `core-audit.js`)
- UI, HTML, Rendering
- Benutzer-CRUD-Implementierung (→ `core-user.js` / `core-identity.js`)

### 4.4 Vorgeschlagene Datenmodell-Struktur

Core-Pflichtfelder (eingefroren):

```
User {
  schemaVersion: 1
  userId:      'USR-000001'    // unveränderlich, systemvergeben
  username:    string          // eindeutig, änderbar
  displayName: string
  status:      'active' | 'inactive' | 'locked' | 'deleted'
  role:        string          // primäre Rolle
  roles:       string[]        // optional Mehrfachrollen, Default [role]
  permissions: { allow: string[], deny: string[] }
  createdAt:   ISO-8601
  updatedAt:   ISO-8601
}
```

Optionale Kernerweiterung (definiert, aber nicht zwingend belegt):

```
  email, emailVerified, avatar, locale, timezone,
  lastLoginAt, lastModifiedBy, accountCreatedBy,
  preferences: {},            // generischer Namensraum je Modul
  metadata: {}                // freier Namensraum, nie vom Core interpretiert
```

Ausdrücklich **nicht** im User-Datensatz:

```
  passwordHash, salt, tokens, mfaSecrets       -> core-auth (getrennter Store)
  failedLoginAttempts, lockedUntil             -> core-auth (Auth-State)
  Fachdaten jeglicher Art                      -> Fachmodule, referenziert per userId
```

**EMPFOHLENE ÄNDERUNG:** Credentials und Login-Zähler gehören nicht in das
Benutzerprofil. Sie werden regelmäßig gelesen, geschrieben und angezeigt –
im Profil führen sie zwangsläufig irgendwann zum Leak über eine `getUser()`-Antwort.

Weitere Modelle:

```
Session { sessionId, userId, createdAt, expiresAt, lastSeenAt, client, revokedAt }
AuditEntry { id, timestamp, actorId, action, targetType, targetId, before, after, result, correlationId }
Role { id, name, description, permissions[], builtIn: boolean }
```

### 4.5 Rollenmodell

**EMPFOHLENE ÄNDERUNG:** Rollen nicht als hart codiertes Objekt in `core-user.js`,
sondern als Datensätze mit einem eingefrorenen Satz eingebauter Rollen.

Eingebaute Rollen (`builtIn: true`, nicht löschbar):

| Rolle | Zweck |
|---|---|
| `guest` | nicht angemeldet / eingeschränkter Lesezugriff |
| `member` | Standardbenutzer |
| `manager` | eingeschränkte Benutzerverwaltung |
| `admin` | volle Administration |
| `developer` | Diagnose und Systemeinblick |

Bewertung der vorgeschlagenen Zusatzrollen:

- `guest` – **EMPFOHLENE ÄNDERUNG**, aufnehmen. Sonst wird „nicht angemeldet"
  überall zum Sonderfall.
- `owner` – **OFFENE ENTSCHEIDUNG**. Nur sinnvoll, wenn es mandantenfähig wird
  oder ein nicht entziehbarer Letztverantwortlicher gebraucht wird. Ein Ersatz
  ist das Flag `protected: true` auf einem Benutzer.
- `moderator`, `operator` – nicht aufnehmen. Kein belegter Anwendungsfall.

Wichtige Festlegungen:

- `developer` ist **nicht** ranghöher als `admin`, sondern orthogonal:
  Diagnose ja, Benutzerdaten ändern nein. **EMPFOHLENE ÄNDERUNG** gegenüber der
  impliziten Annahme im Auftrag, `developer` bekomme auch `user:write`.
- Anwendungen dürfen eigene Rollen ergänzen, aber keine eingebaute Rolle entfernen.
- Der letzte aktive `admin` darf nicht herabgestuft oder deaktiviert werden.

### 4.6 Berechtigungsmodell

Schema: `domain:action` bzw. `domain:subdomain:action`, ausschließlich Kleinschreibung.

Eingefrorener Core-Satz:

```
user:read      user:write     user:create   user:delete   user:status
role:read      role:assign
permission:read permission:grant permission:revoke
module:read    module:install  module:enable module:disable module:uninstall
system:view    system:config   system:health
audit:read
diagnostics:read
session:read   session:revoke
```

Auswertungsregeln (eingefrorene Semantik):

1. Effektive Menge = Vereinigung aller Rollen-Permissions + `permissions.allow`
2. `permissions.deny` schlägt jedes Allow, ohne Ausnahme
3. **Kein Rollen-Bypass.** `admin` erhält seine Rechte ausschließlich über sein
   Permission-Set, nicht über einen Sonderzweig im Code. **EMPFOHLENE ÄNDERUNG**
   gegenüber dem heutigen `|| role === 'admin'`.
4. Wildcards nur auf Domänenebene erlaubt: `user:*`. Kein globales `*`.
5. Unbekannte Permission → verweigert (Fail Closed)
6. Kein Subjekt / nicht angemeldet → Rechte der Rolle `guest`
7. `explain()` liefert immer den Grund der Entscheidung (für Audit und Support)

**ALTERNATIVE geprüft:** ABAC / richtlinienbasiert (Bedingungen auf Attribute wie
„nur eigene Daten"). Bewertung: mächtiger, aber deutlich komplexer und schwer
einzufrieren. Empfehlung: RBAC mit Allow/Deny jetzt, und eine optionale
`options.resource` in der Signatur `can(permission, options)` vorsehen, damit
ressourcenbezogene Prüfungen später ohne Signaturbruch ergänzt werden können.
Das ist die wichtigste Vorkehrung im gesamten Review.

### 4.7 User-ID-Konzept

Vorschlag im Auftrag: fortlaufend `USR-000001`.

Bewertung: Das Konzept funktioniert, hat aber drei belegbare Schwächen:

1. Ein laufender Zähler erfordert eine zentrale, transaktionale Vergabestelle.
   Im Browser mit IndexedDB und mehreren Tabs ist das nicht garantiert konfliktfrei.
2. Bei späterer Synchronisierung zwischen Geräten oder Offline-Anlage kollidieren
   Zähler zwangsläufig.
3. Fortlaufende IDs sind aufzählbar und geben die Benutzerzahl preis.

Feste sechsstellige Breite bricht zudem bei mehr als 999.999 Benutzern das Format.

**EMPFOHLENE ÄNDERUNG – Hybridmodell:**

```
userId       : 'usr_<UUIDv4>'   // technische, global eindeutige Primärreferenz
userNumber   : 1                 // fortlaufende Ordnungszahl, systemvergeben
userRef      : 'USR-000001'      // abgeleitete Anzeigeform, nie Fremdschlüssel
```

- Alle Verweise (Catches, Einstellungen, Audit, Logs, Statistiken) nutzen `userId`.
- `USR-000001` bleibt als sprechende Anzeige erhalten – genau wie gewünscht.
- Die Anzeigeform darf nie in Fremdschlüsseln gespeichert werden.

**ALTERNATIVE:** ausschließlich `USR-000001` als Primärschlüssel. Bewertung:
zulässig, solange das System einen einzigen, lokalen Datenbestand hat und niemals
synchronisiert. Sobald Mehrgerätebetrieb oder ein Server hinzukommt, ist eine
Migration aller Fremdschlüssel nötig. **OFFENE ENTSCHEIDUNG:** Hybrid oder rein
sequenziell – muss vor dem Freeze fallen, weil sie das Datenmodell festlegt.

Unstrittig und **BESTÄTIGT**:

- ID wird ausschließlich vom System vergeben
- ID ist nach der Anlage unveränderlich, auch für Admins
- IDs werden nach Löschung nie wiederverwendet
- Löschen erfolgt als Soft-Delete (`status: 'deleted'`), damit Verweise gültig bleiben

### 4.8 Benutzername

**BESTÄTIGT:** Benutzername vollständig getrennt von der ID, änderbar.

Empfohlene Regeln:

- Länge 3–32 Zeichen
- erlaubte Zeichen `a-z 0-9 _ - .`, muss mit Buchstabe oder Ziffer beginnen
- Eindeutigkeit über eine normalisierte Form (Kleinschreibung, Unicode NFKC)
- Anzeige in Originalschreibung, Vergleich immer normalisiert
- Homoglyphen-/Confusable-Prüfung empfohlen, mindestens NFKC
- Reservierte Namen: `admin`, `root`, `system`, `core`, `guest`, `null`, `undefined`
- Umbenennung erlaubt, mit Historie (`usernameHistory`) und Karenzzeit,
  bevor ein freigegebener Name neu vergeben werden darf
- Der Benutzername darf nie als Fremdschlüssel dienen

**Hinweis:** Der Beispielname `L` (1 Zeichen) verletzt die empfohlene Mindestlänge.
**OFFENE ENTSCHEIDUNG:** Mindestlänge 3 oder 1.

### 4.9 Authentifizierung

**EMPFOHLENE ÄNDERUNG:** Authentifizierung von Identität trennen. `core-user.js`
definiert nur die Schnittstelle, `core-auth.js` implementiert sie.

Neutrale Provider-Schnittstelle:

```
AuthProvider {
  id, type
  async authenticate(credentials) -> { ok, userId, reason }
  async supports(method)          -> boolean
}
```

Damit sind lokales Passwort, Token, OIDC und Geräte-Pin später ohne API-Bruch
ergänzbar. Genau das ist die geforderte „neutrale Framework-Schnittstelle".

Zwingend in `core-auth.js`, nicht in `core-user.js`:

- Passwortprüfung und -änderung
- Reset-Token-Erzeugung (`CoreSecurity.generateToken`)
- fehlgeschlagene Versuche, Sperre nach n Versuchen, `lockedUntil`
- Session-Erzeugung, Ablauf, Verlängerung, Widerruf
- Persistenz im vorhandenen `sessions`-Store

**Klare Benennung eines Problems:** `authenticate(userId)` in `core-user.js` und
`AuthService.authenticate(userId)` in `service-manager.js` sind namentlich
Authentifizierung, tatsächlich aber reines Impersonieren ohne Nachweis. Diese
Signatur darf **nicht** eingefroren werden. Empfehlung: `login(credentials)` als
neue Master-API; falls Kompatibilität nötig ist, die alte Methode als
`impersonate(userId, actor)` mit Rechteprüfung kennzeichnen.

### 4.10 Sicherheitskonzept

- **Zentrale Prüfstelle.** Genau eine Funktion entscheidet über Zugriff:
  `core-access.can()`. Kein zweiter Prüfpfad, kein Rollenvergleich verstreut im Code.
- **Fail Closed.** Fehlendes Subjekt, unbekannte Permission oder Fehler → Verweigerung.
- **UI ist nur Darstellung.** Jede Admin- und Developer-Funktion prüft im Core,
  unabhängig davon, was die Oberfläche anzeigt. **BESTÄTIGT**
- **`userId` ist unveränderlich.** Erzwungen im Datenmodell, nicht in der UI.
- **Rollen- und Rechteänderungen** erfordern `role:assign` bzw. `permission:grant`
  und sind immer auditpflichtig.
- **Keine Rechteerhöhung auf sich selbst.** Ein Benutzer darf seine eigene Rolle
  oder seine eigenen Rechte nicht erweitern.
- **Letzter Admin geschützt.** Herabstufung oder Deaktivierung wird abgelehnt.
- **Credentials getrennt gespeichert** und nie in einer Benutzerantwort enthalten.
- **Eingaben validieren** über das vorhandene `CoreSecurity.validateInput` /
  `sanitizeText` bei `username`, `displayName`, `email`.
- **Diagnose ist rechtepflichtig.** `getDebugInfo()` darf ohne `diagnostics:read`
  keine Umgebungsdaten liefern.

Konkret im aktuellen Code erkannte Sicherheits- bzw. Konzeptschwächen:

| ID | Fundstelle | Problem | Schwere im aktuellen Zustand |
|---|---|---|---|
| S1 | `core-user.js` `authenticate()` | Anmeldung allein durch Kenntnis der User-ID | hoch bei Netzbetrieb, gering im lokalen Demo |
| S2 | `core-user.js` `hasPermission()` | bedingungsloser Admin-Bypass | hoch (verhindert Deny dauerhaft) |
| S3 | `core-user.js` `updateUser()` | `role` und `permissions` frei änderbar, keine Rechteprüfung | hoch (Privilegieneskalation) |
| S4 | `core-user.js` `createUser()` | keine Rechteprüfung, freie Rollenwahl | hoch |
| S5 | `core-user.js` `deleteUser()` | Hard Delete, keine Rechteprüfung, keine Referenzprüfung | mittel |
| S6 | `core-user.js` `createUser()` | ID aus `Date.now()`, kollisionsfähig, nicht dem Zielformat entsprechend | mittel |
| S7 | `service-manager.js` `AuthService.authenticate()` | zweiter, ebenfalls ungeschützter Anmeldepfad | hoch |
| S8 | `core-admin.js` `getDebugInfo()` | Umgebungs- und Fehlerdaten ohne Rechteprüfung | mittel |
| S9 | `core-admin.js` `clearErrorLog()` | Löschen von Diagnosedaten ohne Recht und ohne Audit | mittel |
| S10 | `core-user.js` `createDefaultUsers()` | automatisch angelegtes Admin-Konto ohne Geheimnis | hoch, sobald nicht mehr rein lokal |
| S11 | gesamter Core | keinerlei Audit-Trail für sicherheitsrelevante Aktionen | mittel |
| S12 | `core-admin.js` `testEventEmission()` | Health-Check mit Seiteneffekt im Produktivbus | gering |

Einordnung: Solange das System ausschließlich lokal im Browser ohne Server läuft,
ist das Bedrohungsmodell begrenzt – der Benutzer kontrolliert ohnehin seine
eigene Umgebung. Die Punkte sind hier deshalb primär **Architekturfehler**, die
zu echten Sicherheitslücken werden, sobald ein Server, Synchronisation oder
mehrere Benutzer pro Gerät hinzukommen. Genau deshalb dürfen sie nicht
eingefroren werden.

### 4.11 Modulverwaltung im Admin-Core

Bewertung der im Auftrag genannten Funktionen:

| Funktion | Gehört in `core-admin.js`? | Zuständige Komponente |
|---|---|---|
| installierte Module anzeigen | nur als Delegation | `ModuleRegistry.getAll()` |
| Modulstatus anzeigen | nur als Delegation | `ModuleManager.getStatus()` |
| Module installieren | nur als Delegation | `ModuleManager.install()` |
| Module aktivieren | nur als Delegation | `ModuleManager.enable()` |
| Module deaktivieren | nur als Delegation | `ModuleManager.disable()` |
| Module entfernen | nur als Delegation | `ModuleManager.unregister()` |
| Module aktualisieren | **nein** | fehlt heute; `ModuleManager` erweitern |
| Version anzeigen | nur als Delegation | Manifest über Registry |
| Abhängigkeiten anzeigen | nur als Delegation | `ModuleManager.validateDependencies()` |
| fehlende Abhängigkeiten erkennen | nur als Delegation | `ModuleManager` |
| Modulfehler erkennen | nur als Aggregation | `ErrorLog` + Modulstatus |
| Moduldiagnose | ja, als Aggregation | mehrere Quellen |

Klare Regel: **Admin führt nichts selbst aus.** Er prüft Rechte, ruft auf,
protokolliert und formt das Ergebnis für die Oberfläche. `addModuleStats` und
das eigene `systemStats.modules`-Array sind ersatzlos zu streichen.
**EMPFOHLENE ÄNDERUNG.**

Lücke: `ModuleManager` kennt heute kein `update()`. Falls Modul-Updates gefordert
sind, muss das dort ergänzt werden, nicht im Admin. **OFFENE ENTSCHEIDUNG.**

### 4.12 Admin-Funktionen – Bewertung

**Gehören hinein (als Fassade):** Benutzerverwaltung, Rollenvergabe,
Rechtevergabe, Modulverwaltung, Systemstatus, Health, Konfigurationsansicht,
Audit-Ansicht.

**Gehören nicht hinein:** eigener Fehlerpuffer, eigene Modulliste, eigene
Konfigurationsspeicherung, eigene Datenbankzugriffe, eigene Benutzerlogik,
UI-Code, Fachlogik.

### 4.13 Developer-Funktionen – Bewertung

Die geforderten Informationen sind bereits fast vollständig im Core verfügbar
und müssen nur zusammengeführt werden:

| Information | Quelle | Vorhanden? |
|---|---|---|
| Core-Version | `CoreConfig.core.version` | ja |
| Startup-Status | `CoreStartup` / `CoreContext.runtime` | ja |
| Lifecycle-Phase | `CoreLifecycle.getPhase()` | ja |
| geladene Core-Komponenten | `window`-Prüfung gegen `requiredComponents` | teilweise |
| fehlende Komponenten | Ableitung aus derselben Liste | teilweise |
| registrierte Module | `ModuleRegistry.getAll()` | ja |
| Modulstatus / Versionen | `ModuleManager.getStatus()`, Manifest | ja |
| Abhängigkeiten | `ModuleManager.validateDependencies()` | ja |
| Datenbankstatus / Verbindung | `DatabaseManager.initialized`, `db` | ja |
| verfügbare Stores | `DatabaseManager.stores` | ja |
| Migrationen | – | **fehlt** |
| registrierte Services | `ServiceManager.getAll()` | ja |
| Servicestatus | – | **fehlt** (nur Namensliste) |
| Health Check | Admin, seiteneffektfrei neu | teilweise |
| Fehler | `ErrorLog.getAll()` | ja |
| Logs | `ServiceManager.LoggingService` | ja |
| Events | – | **fehlt** (Bus hat keine Historie) |
| Debug-Informationen | `AdminModule.getDebugInfo()` | ja |
| Performance-Daten | – | **fehlt** |

**EMPFOHLENE ÄNDERUNG:** Statt drei fehlende Bereiche jetzt zu erfinden, sollte
`core-admin.js` eine einzige Methode `diagnostics.snapshot()` mit einem stabilen,
erweiterbaren Ergebnisobjekt definieren. Neue Datenquellen ergänzen dann nur
Felder, ohne die API zu ändern.

**EMPFOHLENE ÄNDERUNG:** Ein optionaler Ringpuffer für Events gehört in den
`CoreEventBus`, nicht in den Admin. **OFFENE ENTSCHEIDUNG**, ob überhaupt gewünscht
(Speicher- und Datenschutzfolgen).

### 4.14 Audit-Konzept

**EMPFOHLENE ÄNDERUNG:** Audit gehört **nicht** in `core-admin.js`, sondern in
eine eigene Komponente `Core/core-audit.js`. Begründung:

- Auditpflichtige Aktionen entstehen auch außerhalb des Admin-Bereichs
  (Selbstregistrierung, Login, Passwortänderung, Fachmodule).
- Ein Audit-Log, das im Admin liegt, ist von dem Subsystem abhängig, das es
  eigentlich überwachen soll.
- `ErrorLog` ist für Fehler zuständig, nicht für Absicht. Beides zu vermischen
  macht beides unbrauchbar.

Eintragsstruktur:

```
AuditEntry {
  id, timestamp, actorId, actorRole,
  action,                       // 'user.create', 'role.assign', 'module.enable'
  targetType, targetId,
  before, after,                // nur geänderte Felder, Secrets maskiert
  result,                       // 'success' | 'denied' | 'error'
  reason, correlationId, source
}
```

Auditpflichtig (alle im Auftrag genannten Punkte **BESTÄTIGT**, ergänzt):

- Benutzer erstellt, geändert, gelöscht, aktiviert, deaktiviert, gesperrt, entsperrt
- Rolle geändert, Berechtigung erteilt oder entzogen
- Modul installiert, aktiviert, deaktiviert, entfernt, aktualisiert
- Systemeinstellung geändert
- ergänzt: Login-Erfolg, Login-Fehlschlag, Logout, Session-Widerruf,
  Passwortänderung, Passwort-Reset, **verweigerte Zugriffsversuche**,
  Audit-Log-Export

Eigenschaften: nur anhängen, keine Änderung, keine Löschung über die normale API;
Aufbewahrungsfrist konfigurierbar; Secrets maskiert; eigener Store im
`DatabaseManager` (`audit`), nicht der bestehende `logs`-Store.

## 5. Framework-Oberfläche

Die Dreiteilung USER / ADMIN / DEVELOPER ist verständlich, aber sie mischt zwei
verschiedene Achsen: „meine Daten vs. fremde Daten" und „fachlich vs. technisch".

**EMPFOHLENE ÄNDERUNG – vier Bereiche:**

| Bereich | Inhalt | Erforderliches Recht |
|---|---|---|
| ACCOUNT | eigenes Profil, Anzeigename, Sprache, Einstellungen, eigene Sessions | angemeldet |
| WORKSPACE | Fachmodule, Startseite der Anwendung | modulabhängig |
| ADMIN | Benutzer, Rollen, Rechte, Module, Konfiguration, Audit | `user:read` u. a. |
| DEVELOPER | Core, Lifecycle, Datenbank, Services, Logs, Events, Health, Debug | `diagnostics:read` |

Begründung: Ohne WORKSPACE landet die eigentliche Anwendung unvermeidlich im
USER-Bereich und vermischt Profileinstellungen mit Fachfunktionen.

Architekturempfehlung für die Oberfläche:

- Die UI liegt **außerhalb** von `Core/`, zum Beispiel unter `Shell/`.
  `core-user.js` und `core-admin.js` dürfen kein DOM kennen. **EMPFOHLENE ÄNDERUNG**
- `index.html` lädt den Core, wartet auf `core:started`, ermittelt die Session und
  rendert erst dann die Navigation.
- Die Navigation wird **aus Berechtigungen abgeleitet**, nicht aus Rollen.
  Ein Menüpunkt erklärt sich über die benötigte Permission.
- Jeder Bereich ist ein eigenständiger Ansichtsanbieter, der sich registriert –
  so kann ein Fachmodul später eigene Ansichten beisteuern, ohne dass die Shell
  die Module kennt.
- Sichtbarkeit ist **nur Komfort**. Der Core lehnt einen direkten Aufruf ohne
  Recht unabhängig davon ab. **BESTÄTIGT**
- Ohne gültige Session wird ausschließlich der Anmeldebereich gerendert.

Zum ersten Testbenutzer `USR-000001` / `developer` / `active`:
Sinnvoll für die Testumgebung. Empfehlung: Anlage nur, wenn kein Benutzer
existiert, Kennzeichnung als `seed: true`, deutliche Warnung im Developer-Bereich,
und die Seed-Anlage muss über ein Konfigurationsflag abschaltbar sein.
Ein `developer`-Konto darf ohne Nachweis nicht in einer produktiven Auslieferung
entstehen. **EMPFOHLENE ÄNDERUNG** gegenüber dem heutigen bedingungslosen
`createDefaultUsers()`.

## 6. Antworten auf die kritischen Architekturfragen

**1. Was ist gut?** Neutrales Framework als Grundlage; User/Admin im Core;
Trennung ID/Username; Trennung Rolle/Permission; Delegationsprinzip für den Admin;
der bewusste Verzicht auf Implementierung vor der Architektur; die vorhandene
Lifecycle-, Registry- und Manager-Schicht ist für ein Framework dieser Größe
überdurchschnittlich sauber.

**2. Was ist problematisch?** Die beiden Master-Dateien sollen gleichzeitig
Implementierung und eingefrorene Schnittstelle sein. Das ist ein Widerspruch.
Dazu: fehlende echte Authentifizierung, Admin-Bypass in der Rechteprüfung,
ungeschützte Schreiboperationen, zwei Benutzerquellen, zwei Session-Wahrheiten,
synchrone Signaturen ohne Persistenz.

**3. Was fehlt?** Sessions, Audit, Persistenz, Credential-Abstraktion, definiertes
Fehlerverhalten, `schemaVersion`, Schutz der Schreiboperationen, UI-Schicht,
Teststrategie.

**4. Was ist überdimensioniert?** Der Funktionsumfang des Admin-Cores;
zusätzliche Rollen ohne Anwendungsfall; Performance-Diagnose ohne Messpunkte;
eine vollständige Vererbungshierarchie für Rollen.

**5. Was ist zu stark gekoppelt?** `window.*` als einziger Verdrahtungsmechanismus;
`AuthService` → `UserModule`; Admin-Health-Check → konkrete Modulnamen;
Rollentabelle fest in der einzufrierenden Datei.

**6. Wo drohen Schulden?** Vor allem beim Einfrieren synchroner Signaturen und
der heutigen Auth-/Permission-Semantik. Das sind die drei Entscheidungen, die
später am teuersten zu korrigieren sind.

**7. Welche Schnittstellen jetzt festlegen?**
`can()` / `canSubject()` inklusive Allow/Deny-Semantik und `options.resource`;
`login()` / `logout()` / `getSession()`; das User-Datenmodell mit `schemaVersion`;
das Permission-Namensschema; die Event-Namen; das Audit-Eintragsformat;
das Fehlerverhalten (Ergebnisobjekt statt Exception für erwartbare Fälle);
Signaturform `async` für alles Datenberührende.

**8. Was auslagern?** Authentifizierung, Sessions, Audit, Persistenz,
Rollendefinitionen und die gesamte Oberfläche.

**9. Gibt es einen besseren Ansatz?** Ja: Master-Dateien als schmale, stabile
Fassaden mit austauschbaren Providern dahinter, statt als vollständige
Implementierungen. Gegenüberstellung:

| Kriterium | Geplant (alles in 2 Dateien) | Empfohlen (Fassade + Komponenten) |
|---|---|---|
| Einfrierbarkeit | gering, jede Erweiterung bricht das Freeze | hoch, Verhalten wächst hinter der Fassade |
| Testbarkeit | gering, globaler Zustand | hoch, Komponenten austauschbar |
| Größe der Master-Dateien | wächst unbegrenzt | bleibt klein und lesbar |
| Anzahl Core-Dateien | unverändert | +2 bis +4 |
| Aufwand jetzt | geringer | höher |
| Kosten späterer Änderungen | hoch | gering |

**10. Was jetzt entscheiden?** ID-Strategie; `async` als Signaturform;
Allow/Deny ohne Rollen-Bypass; Aufteilung Fassade/Komponenten; Audit als eigene
Komponente; Credentials getrennt vom Profil; Permission-Namensschema;
Soft-Delete; Fehlerverhalten.

**11. Was bewusst noch nicht entscheiden?** Konkretes Passwortverfahren;
externe Identitätsanbieter; Mehrmandantenfähigkeit; ressourcenbezogene
Regelsprache; Synchronisationsprotokoll; UI-Technologie; Modul-Update-Mechanismus;
Aufbewahrungsfristen des Audit-Logs.

**12. Was würde ich anders machen?** Erstens: die Master-Dateien als
Schnittstellendefinition begreifen, nicht als Implementierung. Zweitens: vor dem
Freeze einen Kompatibilitätstest schreiben, der die eingefrorene API prüft – ein
Freeze ohne solchen Test ist eine Absichtserklärung, keine Garantie. Drittens:
den Begriff „Freeze" auf die öffentliche API und die Datenmodelle beschränken,
nicht auf die Dateien.

## 7. Zusammenfassung: was vor dem Freeze geklärt sein muss

1. **OFFENE ENTSCHEIDUNG** – ID-Strategie: Hybrid (`uuid` + `USR-000001`) oder rein sequenziell
2. **OFFENE ENTSCHEIDUNG** – Aufteilung: volle Komponententrennung oder Minimalvariante
3. **OFFENE ENTSCHEIDUNG** – Rolle `owner` aufnehmen oder `protected`-Flag verwenden
4. **OFFENE ENTSCHEIDUNG** – Mindestlänge Benutzername (1 oder 3)
5. **OFFENE ENTSCHEIDUNG** – Mehrfachrollen (`roles[]`) jetzt oder später
6. **OFFENE ENTSCHEIDUNG** – Event-Namensschema: `user:*` oder `user-module:*`
   (beide existieren heute parallel)
7. **OFFENE ENTSCHEIDUNG** – Feature-Flags `userModule`/`adminModule`: entfernen
   (Pflichtkomponenten) oder beibehalten
8. **OFFENE ENTSCHEIDUNG** – Event-Historie im EventBus gewünscht?
9. **OFFENE ENTSCHEIDUNG** – `ModuleManager.update()` erforderlich?
10. **OFFENE ENTSCHEIDUNG** – Fehlerverhalten: Exceptions oder Ergebnisobjekte
11. **OFFENE ENTSCHEIDUNG** – Umgang mit dem zweiten Auth-Pfad in `service-manager.js`
    (dieser liegt in einer bereits als stabil geltenden Datei)

## 11 OFFENE ENTSCHEIDUNGEN – USER & ADMIN MASTER CORE

Die folgenden 11 Punkte sind die dokumentierten offenen Architekturentscheidungen
für die Master-Komponenten `core-user.js` und `core-admin.js`. Keine dieser
Entscheidungen ist als beschlossen markiert, solange sie nicht ausdrücklich
verabschiedet wurde.

### 1. User-ID-Konzept: Hybridmodell vs. rein sequenziell
- Thema: Technische Identität und sichtbare Referenz des Benutzers
- bisherige Ausgangsannahme: Die User-ID soll im Format `USR-000001` dauerhaft und
  eindeutig sein, ohne separate technische Primär-ID.
- technischer Befund: Fortlaufende, aufzählbare IDs sind für Browser- und später
  Server-/Sync-Szenarien technisch fragil. Die ID ist nicht dauerhaft unabhängig
  von der Gesamtzahl der Benutzer, und `Date.now()`-basierte IDs sind kollisionsfähig.
- Empfehlung: Für die Master-API eine technische Primär-ID wie `usr_<UUIDv4>`
  verwenden, zusätzlich eine abgeleitete, lesbare Anzeige-ID `USR-000001` bereitstellen,
  aber Fremdschlüssel niemals auf der Anzeige-ID basieren lassen.
- mögliche Alternative: Reines sequenzielles Format `USR-000001` als einzige ID.
- Konsequenz für die spätere Master-Implementierung: Das Datenmodell und alle
  Referenzfelder müssen klar zwischen `userId` und `userRef` trennen.
- Status: OFFEN

### 2. Aufteilung der Verantwortung: volle Trennung vs. minimale Trennung
- Thema: Architektur der Master-Komponenten und der dahinterliegenden Core-Komponenten
- bisherige Ausgangsannahme: `core-user.js` und `core-admin.js` sollen als Master-Fassaden
  stabil bleiben, während fachliche Logik in zusätzliche Core-Komponenten ausgelagert wird.
- technischer Befund: Die aktuelle Implementierung vermischt Identität, Auth,
  Rechteprüfung und Admin-Funktionen in denselben Objekten. Dieses Design ist für
  ein späteres Freeze zu breit und nicht langfristig stabil.
- Empfehlung: Die Master-Komponenten auf API- und Modellvertrag begrenzen und
  konkrete Verantwortung in separate Komponenten auslagern, etwa `core-identity`,
  `core-auth`, `core-access`, `core-audit`.
- mögliche Alternative: Minimalvariante mit nur zwei Auslagerungen (`core-auth` und
  `core-audit`) und die restliche Verantwortung in den Master-Dateien belassen.
- Konsequenz für die spätere Master-Implementierung: Die öffentliche API bleibt klein,
  aber die technischen Abläufe werden hinter der Fassade austauschbar und erweiterbar.
- Status: OFFEN

### 3. Rolle `owner`: eigene Rolle vs. `protected`-Flag
- Thema: Sonderrolle für Letztverantwortung und Schutz kritischer Accounts
- bisherige Ausgangsannahme: Eine Rolle `owner` könnte als zusätzliches Verwaltungskonstrukt
  eingeführt werden.
- technischer Befund: Ein `owner` ist nur dann sinnvoll, wenn ein Mandantenmodell,
  ein System-Admin-Reservat oder vererbbare Superrechte wirklich benötigt werden.
  Für eine allgemeine Framework-Schicht ist das oft unnötig und schwer zu begrenzen.
- Empfehlung: Eine generische Schutzlogik mit `protected: true` oder einer
  vergleichbaren Metadatenregel bevorzugen und nur dann eine separate Rolle `owner`
  einführen, wenn ein klarer fachlicher Bedarf entsteht.
- mögliche Alternative: Zusätzliche Rolle `owner` mit separat definierten Rechten.
- Konsequenz für die spätere Master-Implementierung: Die Core-Rollenliste bleibt schlank,
  und kritische Benutzer können geschützt werden, ohne die Rollenhierarchie unnötig zu verzerren.
- Status: OFFEN

### 4. Mindestlänge des Benutzernamens: 1 vs. 3 Zeichen
- Thema: Eindeutigkeit und Nutzbarkeit des verwendbaren Namensraums
- bisherige Ausgangsannahme: Der Benutzername kann kurz sein, und ein Beispiel wie `L`
  ist technisch ausreichend.
- technischer Befund: Eine sehr kurze Mindestlänge erschwert Zustände wie Mehrdeutigkeit,
  UI-Styling, historische Referenzen und menschlich lesbare Benennungen. Gleichzeitig
  ist die Prämisse „ein Zeichen ist genug" heute nicht als robust genug anzusehen.
- Empfehlung: Eine Mindestlänge von 3 Zeichen festlegen, sofern nicht ein sehr enger,
  explizit definierter Anwendungsfall etwas anderes erfordert.
- mögliche Alternative: Mindestlänge 1, damit der Benutzername extrem kurz sein kann.
- Konsequenz für die spätere Master-Implementierung: Validierungslogik und Datenmodell
  müssen die zulässige Länge vor dem Einfrieren festlegen.
- Status: OFFEN

### 5. Mehrfachrollen: `roles[]` jetzt vs. später
- Thema: Modell von Rollen und berechneter effektiver Berechtigung
- bisherige Ausgangsannahme: Eine primäre Rolle reicht für den ersten Stand;
  Mehrfachrollen können später ergänzt werden.
- technischer Befund: Wenn Benutzer mit mehreren Rollen gleichzeitig umgehen müssen,
  ist `role` als einzelne String-Variable unzureichend. Das wirkt sich auf Rechte
  und Audit aus, sobald komplexere Arbeitsabläufe entstehen.
- Empfehlung: `role` als primäre Rolle beibehalten, aber `roles[]` als normalisierte,
  erweiterbare Liste mit definieren, damit die effektive Berechtigung nicht auf einen
  einzelnen String festgelegt wird.
- mögliche Alternative: Nur eine Rolle, keine `roles[]`-Liste, dafür mit einem
  eigenen Permission-Set pro Benutzer.
- Konsequenz für die spätere Master-Implementierung: Das Datenmodell, die Rechtesemantik
  und die Audit-Events müssen bereits eine Mehrfachrollen-Strategie berücksichtigen.
- Status: OFFEN

### 6. Event-Namensschema: `user:*` vs. `user-module:*`
- Thema: Einfache, konsistente Event-Namespace-Strategie im frameworkweiten Bus
- bisherige Ausgangsannahme: Ein einzelnes Namensschema für User- und Admin-Events
  ist ausreichend, und das System kann seine Namenskonventionen selbst wählen.
- technischer Befund: Heute existieren parallel `user:*` und `user-module:*` sowie
  `auth:*` und `admin-module:*`. Diese scheinbar redundanten Namespaces erzeugen
  doppelte Signalquellen und machen spätere Beobachtbarkeit schwieriger.
- Empfehlung: Eindeutiges Event-Schema definieren, bevorzugt auf fachliche Kernbereiche
  wie `user:*`, `auth:*`, `admin:*`, `module:*`, statt auf Implementierungsnamen der
  Datei oder des Moduls.
- mögliche Alternative: Modul-/Dateiname als Präfix beibehalten (`user-module:*`),
  um den Kontext an der Entstehungsstelle zu verankern.
- Konsequenz für die spätere Master-Implementierung: Event-Listener und Audit-Korrelation
  müssen von vornherein auf einen konsistenten Namespace festgelegt werden.
- Status: OFFEN

### 7. Feature-Flags für User/Admin: Pflichtkomponenten vs. optionale Komponenten
- Thema: `userModule` und `adminModule` als Core-Features
- bisherige Ausgangsannahme: User und Admin könnten als optionale Features aktiviert
  oder deaktiviert werden.
- technischer Befund: Der Auftrag fordert User und Admin als Core-Bestandteile und als
  Kernanforderung jeder Anwendung. Wenn sie mit Feature-Flags deaktivierbar sind,
  widerspricht das den angestrebten Sicherheits- und Architekturprinzipien.
- Empfehlung: User und Admin als Pflichtbestandteile des Frameworks behandeln und die
  Feature-Flags entfernen oder auf reine Komfortfunktionen reduzieren, die keine
  Zugriffskontrolle beeinflussen.
- mögliche Alternative: Feature-Flags beibehalten, aber nur als Entwicklungsumgebungs-Flag,
  nicht als Sicherheits- oder Laufzeitentscheidungen.
- Konsequenz für die spätere Master-Implementierung: Die Initialisierung darf den Core
  nicht mit optionalen, aber erforderlichen Komponenten auflösen; sie muss die gesetzten
  Framework-Pflichtbestandteile verifizieren.
- Status: OFFEN

### 8. Event-Historie im EventBus: gewünscht vs. nicht gewünscht
- Thema: Persistierte Event-Chronik als Diagnose- und Audit-Hilfsmittel
- bisherige Ausgangsannahme: Der Event-Bus kann ohne Historie auskommen, da Logs und
  Fehlerpuffer bereits existieren.
- technischer Befund: Für Diagnose, Reproduktion und Sicherheitsüberprüfung ist eine
  Event-Historie wertvoll. Ohne sie fehlen spätere Entwickler und Support-Teams an
  wichtigem Kontext.
- Empfehlung: Eine optionale, begrenzte Event-Historie im EventBus als Ringpuffer
  einführen, aber nur mit klar definierten Speichergrenzen und Datenschutzregeln.
- mögliche Alternative: Keine Event-Historie; Diagnose nur über `ErrorLog`,
  `Audit` und `ServiceManager.LoggingService`.
- Konsequenz für die spätere Master-Implementierung: Der EventBus muss als beobachtbar
  und dokumentierbar spezifiziert sein, nicht nur als synchroner Broadcast-Mechanismus.
- Status: OFFEN

### 9. Modul-Update-Mechanismus: `ModuleManager.update()` erforderlich?
- Thema: Aktualisierung von Modulen im Framework
- bisherige Ausgangsannahme: Modulverwaltung umfasst Installation, Aktivierung,
  Deaktivierung und Entfernung; Aktualisierung kann später dazukommen.
- technischer Befund: Ein Admin-Bereich, der Module verwaltet, aber kein Update-Konzept
  hat, ist in der Praxis unvollständig. Besonders bei Versionskontrolle und Abhängigkeiten
  entsteht schnell technische Schuldenbildung.
- Empfehlung: `ModuleManager.update()` als feste, aber separate Kernfunktion definieren,
  statt sie im Admin zu implementieren. Der Admin ruft nur die Methode auf.
- mögliche Alternative: Updates explizit nicht unterstützen und nur Installation plus
  Deaktivierung/Entfernung zulassen.
- Konsequenz für die spätere Master-Implementierung: Das Modullifecycle-Modell muss eine
  Versionierung und Aktualisierungskette definieren, auch wenn sie zunächst nur als Stub
  oder Schnittstelle existiert.
- Status: OFFEN

### 10. Fehlerverhalten: Exceptions vs. Ergebnisobjekte
- Thema: Einheitliches Verhalten für erwartbare Fehlerzustände in User/Admin-API
- bisherige Ausgangsannahme: Die API kann je nach Methode Ausnahme, `null`, `false`
  oder ein gemischtes Verhalten verwenden.
- technischer Befund: Das ist für ein später einzufrierendes Framework zu undefiniert.
  Es verhindert verlässliche Rechteprüfung, Diagnose und Fehlerbehandlung.
- Empfehlung: Ein konsistentes Fehler- und Ergebnismodell für erwartete Zustände definieren,
  etwa `Result`-Objekte oder eindeutig dokumentierte Exceptions für kritische Fälle.
- mögliche Alternative: Die API wirft nur Exceptions und verwendet für „nicht gefunden"
  oder „nicht erlaubt" speziell definierte Fehlerklassen.
- Konsequenz für die spätere Master-Implementierung: Die öffentliche API wird verlässlich,
  testbar und für spätere UI-Schichten brauchbar, ohne implizite Semantik zu erfinden.
- Status: OFFEN

### 11. Zweiter Auth-Pfad in `service-manager.js`: behalten, bereinigen oder deprecate
- Thema: Dualität zwischen `UserModule.authenticate()` und `ServiceManager.AuthService.authenticate()`
- bisherige Ausgangsannahme: Beide Pfade können nebenher existieren, solange sie in der
  Praxis dieselbe Logik übernehmen.
- technischer Befund: Das ist eine doppelte, konkurrierende Wahrheit über den aktuellen
  Benutzer. Das ist bei der späteren Einfrierung des Master-Cores eine unmittelbare
  Sicherheits- und Wartungsrisikoquelle.
- Empfehlung: Den zweiten Auth-Pfad als veraltet kennzeichnen und bis zum Freeze auf eine
  einheitliche Signatur und einen einheitlichen Zugriffspunkt reduzieren; die eigentliche
  Authentifizierung gehört in `core-auth`.
- mögliche Alternative: Beide Pfade ausdrücklich parallel unterstützen, aber mit einer
  klaren Priorität und einem `impersonate()`-Begleitpfad für administrative Fälle.
- Konsequenz für die spätere Master-Implementierung: Der Framework-Start, die Session,
  die Rechteprüfung und der Audit-Stream müssen auf eine einzige Quelle für die
  Identität ausgerichtet sein.
- Status: OFFEN

Diese 11 Punkte bilden den verbindlichen Entscheidungskatalog für den nächsten
Architektur-Schritt. Sie sind als offene Entscheidungen dokumentiert und noch nicht
mit einem Beschluss abgeschlossen.

## 8. Abschließende technische Empfehlung

Die Grundidee ist tragfähig. User und Admin gehören in den Core, und die
Trennung von Identität, Rolle und Berechtigung ist richtig gedacht.

Die entscheidende Korrektur betrifft den Umfang: `core-user.js` und
`core-admin.js` sollten **Schnittstellen und Datenmodelle** einfrieren, nicht
Implementierungen. Verhalten gehört in `core-auth.js`, `core-identity.js`,
`core-access.js` und `core-audit.js`, die bewusst nicht eingefroren werden.

Der aktuelle Code beider Dateien ist als Prototyp brauchbar, als Master-Stand
jedoch nicht. Insbesondere `authenticate(userId)`, der Admin-Bypass in
`hasPermission()` und die ungeschützten Schreiboperationen dürfen in dieser Form
nicht eingefroren werden.

Wichtigste Einzelentscheidung: **alle datenberührenden Methoden asynchron
definieren.** Diese eine Festlegung verhindert den teuersten absehbaren Bruch.

## 9. Empfohlene nächste Schritte

1. Offene Entscheidungen aus Abschnitt 7 klären und hier dokumentieren.
2. API-Vertrag für `core-user.js` und `core-admin.js` schriftlich fixieren
   (Signaturen, Datenmodelle, Events, Permissions, Fehlerverhalten).
3. Zielaufteilung der Core-Komponenten festlegen.
4. Erst danach implementieren, in dieser Reihenfolge:
   Identität und Persistenz → Access → Auth und Sessions → Audit →
   Admin-Fassade → Shell und `index.html`.
5. Konformitätstest gegen den eingefrorenen API-Vertrag schreiben.
6. Den doppelten Auth-Pfad in `service-manager.js` bereinigen oder ausdrücklich
   als veraltet kennzeichnen.
7. Erst dann `core-user.js` und `core-admin.js` einfrieren.

## 10. Ergebnis dieses Arbeitsschritts

- Es wurde ausschließlich analysiert und dokumentiert.
- Es wurde kein Code verändert, keine Datei erstellt, kein Core umgebaut.
- Einzige geänderte Datei: `WORKFLOW.md`.
- Die oben genannten Empfehlungen sind Vorschläge und noch nicht umgesetzt.
