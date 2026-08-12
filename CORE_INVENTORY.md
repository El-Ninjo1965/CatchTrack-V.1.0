# CatchTrack V1.0 – Core Inventory

## Zweck

Diese Datei dokumentiert die vertiefte funktionale Inventur des aktuellen Core-Stands.

Sie dient als verbindliche Arbeitsgrundlage für die Core-Bereinigung.

## Prüfgrundlage

Quelle:
GitHub main

Prüfstatus:
IN ARBEIT

## Ziel

Der Core V1.0 soll ausschließlich generische technische Infrastruktur bereitstellen.

Er darf keine konkrete Fachlogik und keine direkte Abhängigkeit zu einzelnen Fachmodulen enthalten.

## Zu prüfende Core-Bereiche

- Startup
- Runtime
- Lifecycle
- Event System
- State
- Storage
- Database
- Error Handling
- Module Interface
- Module Registry
- Module Manager
- Permissions
- Package / Entitlements
- Configuration
- technische Services

## Aktuelle Core-Dateien

### Core-Einstieg und Start

| Datei | Aufgabe | Vorläufige Bewertung |
|—|—|—|
| Core/index.js | zusätzlicher Core-Einstieg | Prüfung erforderlich |
| Core/core-entry.js | Einstieg in die Runtime | Prüfung erforderlich |
| Core/core-loader.js | Initialisierungsprüfung | Prüfung erforderlich |
| Core/core-startup.js | Startup-Steuerung | Prüfung erforderlich |
| Core/app.js | Application Bootstrap und Modulladen | problematisch |

### Core-Laufzeit

| Datei | Aufgabe | Vorläufige Bewertung |
|—|—|—|
| Core/core-runtime.js | Runtime | erforderlich |
| Core/core-lifecycle.js | Lifecycle | erforderlich |
| Core/core-shutdown.js | Shutdown | erforderlich |

### Core-Zustand und Kontext

| Datei | Aufgabe | Vorläufige Bewertung |
|—|—|—|
| Core/core.js | zentrale Core-API, State, Module, Events | erforderlich |
| Core/core-context.js | Core-Kontext | Prüfung erforderlich |
| Core/core-state.js | State-Verwaltung | erforderlich |

### Events

| Datei | Aufgabe | Vorläufige Bewertung |
|—|—|—|
| Core/core-event-bus.js | Event-System | erforderlich |

### Storage und Fehler

| Datei | Aufgabe | Vorläufige Bewertung |
|—|—|—|
| Core/core-storage.js | Storage | erforderlich |
| Core/error-log.js | Fehler-/Logverwaltung | Prüfung erforderlich |
| Core/core-error-handler.js | Fehlerbehandlung | erforderlich |

### Module

| Datei | Aufgabe | Vorläufige Bewertung |
|—|—|—|
| Core/module-interface.js | Modul-Schnittstelle | erforderlich |
| Core/module-manager.js | Modulverwaltung | erforderlich |

### Konfiguration

| Datei | Aufgabe | Vorläufige Bewertung |
|—|—|—|
| Core/core-config.js | Core-Konfiguration | Prüfung erforderlich |

## Kritischer Befund: Core/app.js

Die aktuelle `Core/app.js` lädt direkt konkrete Module:

- i18n
- Weather
- GPS
- User
- Admin

Damit kennt der Core konkrete Fachmodule.

Das widerspricht der Zielarchitektur.

Zielstruktur:

Core
→ Module Interface
→ Module Registry
→ Module Manager
→ beliebige Module

Nicht:

Core
→ feste Liste konkreter Module

## Kritischer Befund: mehrere Einstiegsebenen

Aktuell existieren mehrere Komponenten mit Startup-/Entry-Verantwortung:

- Core/index.js
- Core/core-entry.js
- Core/core-loader.js
- Core/core-startup.js
- Core/core-runtime.js
- Core/app.js

Diese müssen funktional gegeneinander abgegrenzt werden.

Ziel:

Ein eindeutig definierter Application-/Core-Startpfad.

## Kritischer Befund: Modulverwaltung

`Core/core.js` enthält bereits:

- registerModule()
- unregisterModule()
- getModule()
- getModules()
- activateModule()
- deactivateModule()

`Core/module-manager.js` stellt dafür eine zusätzliche öffentliche Verwaltungsschicht bereit.

Die endgültige Verantwortung muss eindeutig definiert werden.

## Kritischer Befund: Infrastruktur außerhalb von Core

Aktuell existieren zusätzlich:

- Config/config-manager.js
- Database/database-manager.js
- Services/service-manager.js

Diese Komponenten sind technisch relevant, liegen aber außerhalb von `/Core`.

Vor der Bereinigung muss entschieden werden, welche Verantwortung tatsächlich zum generischen Core gehört und welche als eigenständige Infrastruktur bestehen bleibt.

## Vorläufige Zielarchitektur

```text
Application
    ↓
Core Entry
    ↓
Core Startup
    ↓
Core Runtime
    ↓
Core Lifecycle
    ↓
Core Infrastructure
    ├── Event System
    ├── State
    ├── Storage
    ├── Database
    ├── Error Handling
    ├── Configuration
    ├── Permissions
    └── Entitlements
    ↓
Module System
    ├── Module Interface
    ├── Module Registry
    └── Module Manager
    ↓
Modules