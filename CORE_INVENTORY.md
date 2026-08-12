# CatchTrack V1.0 – Core Inventory

## Zweck

Diese Datei dokumentiert die funktionale und architektonische Inventur des aktuellen Core-Stands.

Sie ist die Arbeitsgrundlage für die Core-Bereinigung und den anschließenden Core-Freeze.

Diese Datei enthält keinen Arbeitscursor und keinen „Next Step“.
Der aktuelle Arbeitsstatus wird ausschließlich in `STATE.md` geführt.

—

# 1. Prüfgrundlage

Geprüft gegen:

- `RULES.md`
- `WORKFLOW.md`
- `PROJECT.md`
- `STATE.md`
- `AI_AGENT_INDEX.md`
- `CORE_TARGET_STRUCTURE.md`
- vorhandenen Repository-Code auf `main`

## 1.1 Aktueller Repository-Status

- `Core/index.js`: **REMOVED**
- `Core/module-registry.js`: **PRESENT**
- `Core/module-manager.js`: **PRESENT**
- `Core/module-interface.js`: **PRESENT**
- Lifecycle: **IMPLEMENTED**
- Shutdown: **IMPLEMENTED**
- Core Cleanup: **COMPLETED**
- Core Validation: **COMPLETED**
- Core Freeze: **NOT YET DECLARED**

—

# 2. Ziel des Core

Der Core V1.0 stellt ausschließlich generische technische Infrastruktur bereit.

Der Core darf:

- technische Infrastruktur bereitstellen
- den Application-Lifecycle steuern
- den Runtime-Kontext bereitstellen
- State verwalten
- Events bereitstellen
- Storage bereitstellen
- Fehler behandeln
- Logging bereitstellen
- Konfiguration bereitstellen
- das Modulsystem bereitstellen

Der Core darf nicht:

- konkrete Fachlogik enthalten
- konkrete Fachmodule fest einbauen
- User-Fachlogik enthalten
- GPS-Fachlogik enthalten
- Weather-Fachlogik enthalten
- Catchbook-Fachlogik enthalten
- Admin-Fachlogik enthalten
- andere konkrete Module voraussetzen

—

# 3. Grundentscheidung zur Core-Struktur

Der Core soll aus klar getrennten Verantwortlichkeiten bestehen.

Zielstruktur:

```text
Application Entry
        ↓
Core Entry
        ↓
Core Runtime
        ↓
Core Startup
        ↓
Core Lifecycle
        ↓
Core Infrastructure
        ├── Context
        ├── State
        ├── Event Bus
        ├── Storage
        ├── Database
        ├── Configuration
        ├── Error Handling
        └── Logging
                ↓
          Module System
                ├── Module Interface
                ├── Module Registry
                ├── Module Loader
                └── Module Manager
```

—

# 4. Aktuelle Core-Dateien

## 4.1 Core Entry / Startup

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/index.js` | zusätzlicher Einstiegspunkt | **REMOVED** |
| `Core/core-entry.js` | Einstieg in die Core Runtime | **BEHALTEN / VEREINFACHEN** |
| `Core/core-runtime.js` | Runtime-Steuerung | **BEHALTEN / VEREINFACHEN** |
| `Core/core-startup.js` | Startup-Steuerung | **BEHALTEN / VEREINFACHEN** |
| `Core/core-loader.js` | Initialisierungs-/Komponentenprüfung | **UMBAUEN** |
| `Core/app.js` | Application Bootstrap und direktes Laden konkreter Module | **AUS CORE HERAUSLÖSEN** |

### Begründung

Aktuell existieren mehrere Entry-/Startup-Ebenen.

Insbesondere darf `app.js` nicht gleichzeitig Application Bootstrap und konkrete Fachmodule laden.

Es muss ein eindeutig definierter Startpfad entstehen.

—

# 5. Core Runtime

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/core-runtime.js` | Runtime-Steuerung | **BEHALTEN / VEREINFACHEN** |
| `Core/core-lifecycle.js` | Lifecycle-Phasen | **BEHALTEN / HÄRTEN** |
| `Core/core-shutdown.js` | Shutdown-Steuerung | **UMBAUEN** |

## Lifecycle

Der Lifecycle muss definierte Übergänge besitzen.

Ziel:

```text
CREATED
   ↓
INITIALIZING
   ↓
READY
   ↓
RUNNING
   ↓
STOPPED
```

Beliebige Phasenwechsel dürfen nicht möglich sein.

—

# 6. Core API

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/core.js` | zentrale API, State, Modulverwaltung, Events | **MASSIV UMBAUEN** |

## Aktuelles Problem

`core.js` enthält derzeit mehrere Verantwortlichkeiten:

- Core API
- State
- Modul-Registry
- Modulaktivierung
- Moduldeaktivierung
- Event-Fassade
- eigenen Event-Mechanismus

Das widerspricht der Zielarchitektur.

## Ziel

`core.js` soll nur noch eine schlanke öffentliche Core API bereitstellen.

Spezialisierte Aufgaben werden an die zuständigen Komponenten delegiert.

—

# 7. Context und State

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/core-context.js` | Runtime-Kontext | **BEHALTEN** |
| `Core/core-state.js` | Core State | **BEHALTEN / ENTKOPPELN** |

## State

Der State ist grundsätzlich generisch.

Er darf jedoch nicht vom internen Event-Mechanismus von `core.js` abhängig sein.

Events müssen ausschließlich über den zentralen Event Bus laufen.

—

# 8. Event System

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/core-event-bus.js` | zentraler Event Bus | **BEHALTEN** |

## Kritischer Befund

Aktuell existieren zwei Event-Mechanismen:

```text
core-event-bus.js
```

und zusätzlich:

```text
core.js
└── eigener Event-Map/Fallback-Mechanismus
```

## Entscheidung

`core-event-bus.js` ist der **einzige** Event Bus.

Der Event-Mechanismus aus `core.js` wird entfernt.

Alle Core-Komponenten müssen über den zentralen Event Bus kommunizieren.

—

# 9. Storage

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/core-storage.js` | technische Storage-Abstraktion | **BEHALTEN / PRÜFEN** |

Storage bleibt generische Infrastruktur.

Fachmodule dürfen ihren eigenen fachlichen Speicherbedarf definieren, ohne dass der Core deren Fachlogik übernimmt.

—

# 10. Error Handling und Logging

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/core-error-handler.js` | zentrale Fehlerbehandlung | **BEHALTEN / ENTKOPPELN** |
| `Core/error-log.js` | Fehler-/Logverwaltung | **UMBAUEN** |

## Ziel

```text
Fehler
  ↓
Core Error Handler
  ↓
Error Log
  ↓
Persistence
```

`error-log.js` darf nicht dauerhaft ausschließlich im RAM arbeiten.

Die Persistenz muss über eine geeignete technische Infrastruktur erfolgen.

—

# 11. Configuration

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/core-config.js` | technische Core-Konfiguration | **BEHALTEN** |

`core-config.js` ist grundsätzlich sauber abgegrenzt.

Der außerhalb von Core befindliche `Config/config-manager.js` ist dagegen zu breit und muss separat bereinigt werden.

Insbesondere dürfen konkrete Fachmodule nicht als Core-Konfiguration fest verdrahtet werden.

Beispiele für zu vermeidende Abhängigkeiten:

```text
userModule
adminModule
weatherModule
gpsModule
```

—

# 12. Module System

| Datei | Ist-Funktion | Entscheidung |
|—|—|—|
| `Core/module-interface.js` | Modulvertrag | **PRESENT / ERWEITERT** |
| `Core/module-manager.js` | zentrale Modulverwaltung | **PRESENT** |
| `Core/module-registry.js` | technische Modul-Registry | **PRESENT** |
| `Core/core-loader.js` | technische Initialisierung/Prüfung | **PRESENT / UMBAUEN** |

## Zielstruktur

```text
Module Interface
       ↓
Module Registry
       ↓
Module Manager
       ↓
Module Loader
       ↓
Module Lifecycle
```

## Grundregel

Die Modulverwaltung darf nicht gleichzeitig in `core.js` und `module-manager.js` stattfinden.

`module-manager.js` wird die zentrale Verwaltungsinstanz.

`module-registry.js` verwaltet registrierte Module.

`core.js` delegiert lediglich über definierte APIs.

—

# 13. `core.js` – zu entfernende Doppelverantwortungen

Folgende Verantwortlichkeiten dürfen nicht dauerhaft in `core.js` verbleiben:

```text
registerModule()
unregisterModule()
getModule()
getModules()
activateModule()
deactivateModule()
```

Diese Funktionen gehören in das Modulsystem.

Ebenso darf `core.js` keinen zweiten Event Bus besitzen.

—

# 14. `app.js`

`Core/app.js` ist architektonisch problematisch.

Der aktuelle Code lädt konkrete Module wie:

```text
i18n
Weather
GPS
User
Admin
```

direkt.

Das widerspricht der Core-Zielarchitektur.

## Entscheidung

`app.js` darf nicht Bestandteil des generischen Core bleiben.

Die darin enthaltenen Application-Aufgaben müssen in eine geeignete Application-Ebene überführt werden.

Konkrete Module dürfen nicht vom Core fest verdrahtet werden.

—

# 15. `Core/index.js`

`Core/index.js` stellt einen zusätzlichen Einstiegspunkt dar.

Die Zielarchitektur verlangt einen eindeutigen Startpfad.

## Entscheidung

`Core/index.js` wird entfernt, sofern nach Prüfung aller Referenzen kein legitimer externer Einstieg davon abhängig ist.

Vor dem Löschen müssen alle Referenzen geprüft werden.

—

# 16. Infrastruktur außerhalb von Core

Folgende Dateien müssen bei der Core-Bereinigung berücksichtigt werden:

```text
Config/config-manager.js
Database/database-manager.js
Services/service-manager.js
```

Sie werden nicht automatisch in den Core verschoben.

Ihre Verantwortlichkeiten müssen getrennt bewertet werden.

—

# 17. Config Manager

`Config/config-manager.js` ist aktuell zu breit.

Enthalten sind unter anderem:

- Database
- API
- Module
- Security
- Performance
- UI
- Feature Flags

Außerdem bestehen direkte Bezüge auf konkrete Module.

## Ziel

Konfiguration muss getrennt werden in:

```text
Core Configuration
Application Configuration
Module Configuration
```

Fachmodul-Konfiguration gehört zum jeweiligen Modul.

—

# 18. Database Manager

`Database/database-manager.js` erzeugt derzeit unter anderem:

```text
users
modules
logs
sessions
settings
cache
sync
```

Das ist kein vollständig generischer Datenbank-Layer.

## Ziel

Der Core stellt technische Datenbankinfrastruktur bereit.

Fachliche Datenmodelle und Stores dürfen nicht pauschal im Core fest verdrahtet werden.

Insbesondere müssen folgende Bereiche separat bewertet werden:

```text
users
sessions
modules
logs
cache
sync
settings
```

—

# 19. Service Manager

`Services/service-manager.js` bündelt derzeit unterschiedliche Verantwortlichkeiten:

```text
UserService
AuthService
ModuleService
LoggingService
CacheService
```

Das ist keine saubere generische Service-Schicht.

## Ziel

Die Verantwortlichkeiten müssen getrennt werden.

Beispiele:

```text
UserService
    → User-/Fachmodul

ModuleService
    → Module Manager

LoggingService
    → Core Logging

CacheService
    → technische Cache-Infrastruktur

AuthService
    → Security/Auth-Verantwortung
```

Der bestehende `ServiceManager` darf nicht unverändert als zentraler Core-Service-Layer übernommen werden.

—

# 20. Endgültige vorläufige Core-Zielliste

## Behalten

```text
Core/core-entry.js
Core/core.js
Core/core-runtime.js
Core/core-startup.js
Core/core-shutdown.js
Core/core-lifecycle.js
Core/core-context.js
Core/core-state.js
Core/core-event-bus.js
Core/core-storage.js
Core/core-config.js
Core/core-error-handler.js
Core/error-log.js
Core/module-interface.js
Core/module-manager.js
Core/core-loader.js
```

## Neu

```text
Core/module-registry.js
```

## Entfernen

```text
Core/index.js
```

Voraussetzung:

Vor dem Löschen müssen alle Repository-Referenzen geprüft werden.

## Aus dem Core herauslösen

```text
Core/app.js
```

Die darin enthaltenen Application-Aufgaben bleiben erhalten, werden aber nicht als generische Core-Infrastruktur behandelt.

—

# 21. Nicht Bestandteil dieser Core-Bereinigung

Folgende Bereiche werden während der Core-Bereinigung nicht fachlich weiterentwickelt:

```text
GPS
Weather
i18n
User
Admin
Catchbook
Catches
weitere Fachmodule
```

Sie werden erst nach dem Core-Freeze separat geprüft.

—

# 22. UI

Die Position des User-Menüs in der Vorschau ist **kein Bestandteil der Core-Architektur**.

Der aktuelle UI-Fix:

```text
User-Menü
links
↓
oben
```

wird erst nach dem Core-Freeze separat behandelt.

—

# 23. Änderungsprinzip

Vor dem Löschen oder Ersetzen einer Datei müssen alle Repository-Referenzen geprüft werden.

Keine Datei darf allein aufgrund ihres Namens gelöscht werden.

Keine neue Datei darf ohne architektonische Begründung erstellt werden.

Keine bestehende Funktion darf ohne Prüfung ihrer Abhängigkeiten entfernt werden.

—

# 24. Validierung nach der Bereinigung

Nach der Implementierung müssen mindestens geprüft werden:

- Syntax
- Imports
- Exports
- Dateipfade
- Abhängigkeiten
- Startup
- Shutdown
- Lifecycle
- Event Bus
- State
- Storage
- Error Handling
- Module Interface
- Module Registry
- Module Manager
- Loader
- keine direkten Fachmodulabhängigkeiten im Core
- keine doppelten Verantwortlichkeiten

—

# 25. Core Freeze Kriterien

Der Core darf erst eingefroren werden, wenn:

- die Zielstruktur umgesetzt wurde
- alle Core-Dateien eindeutig zugeordnet sind
- unnötige Dateien entfernt wurden
- notwendige neue Dateien vorhanden sind
- der Startup-Pfad eindeutig ist
- der Shutdown-Pfad eindeutig ist
- der Lifecycle korrekt funktioniert
- genau ein Event Bus vorhanden ist
- Modulverwaltung eindeutig getrennt ist
- Core keine konkreten Fachmodule voraussetzt
- Config sauber abgegrenzt ist
- Database sauber abgegrenzt ist
- Error Handling konsistent ist
- Syntax und Abhängigkeiten geprüft wurden
- keine bekannten kritischen Architekturwidersprüche bestehen

—

# 26. Status

Diese Datei dokumentiert ausschließlich die Core-Inventur und Bereinigungsgrundlage.

Der aktuelle Arbeitsstatus und der nächste Arbeitsschritt werden ausschließlich in:

```text
STATE.md
```

geführt.

—

# Ende CORE_INVENTORY.md