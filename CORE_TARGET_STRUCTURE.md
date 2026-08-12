# CatchTrack V1.0 – Core Target Structure

## Zweck

Diese Datei definiert die verbindliche Zielstruktur des CatchTrack Core.

Sie basiert auf:

- CORE_FUNCTIONAL_ANALYSIS.md
- INFRASTRUCTURE_ANALYSIS.md
- den verbindlichen Projektregeln
- der aktuellen Projekt- und Dokumentationsstruktur

Diese Datei beschreibt die Zielarchitektur.

Sie enthält noch keine Implementierung.

## Status

CORE-TARGET-STRUCTURE:
COMPLETED

CORE-CLEANUP:
COMPLETED

CORE-IMPLEMENTATION:
COMPLETED

CORE-VALIDATION:
COMPLETED

CORE-FREEZE:
NOT YET DECLARED

CORE-INDEX:
REMOVED

MODULE-REGISTRY:
PRESENT

MODULE-MANAGER:
PRESENT

MODULE-INTERFACE:
PRESENT

LIFECYCLE:
IMPLEMENTED

SHUTDOWN:
IMPLEMENTED

—

# 1. Architekturprinzip

Der CatchTrack Core ist eine technische Infrastruktur.

Er darf keine fachliche Logik konkreter CatchTrack-Module enthalten.

Grundprinzip:

Application
    ↓
Core
    ↓
Module System
    ↓
Fachmodule

Der Core stellt technische Dienste und definierte Schnittstellen bereit.

Module implementieren die fachliche Funktionalität.

—

# 2. Verantwortungsgrenze

## 2.1 Core

Der Core ist verantwortlich für:

- Application Context
- Core State
- Event-Kommunikation
- Storage
- Database-Infrastruktur
- Configuration-Infrastruktur
- Error Handling
- Logging-Infrastruktur
- Lifecycle
- Module Registry
- Module Manager
- Module Loading
- technische Initialisierung
- technische Beendigung
- zentrale Core-API

## 2.2 Core ist nicht verantwortlich für

Der Core enthält keine konkrete Fachlogik für:

- User
- Admin
- GPS
- Weather
- i18n
- Catchbook
- Catches
- Fishing
- Synchronisation fachlicher Daten
- UI-Fachlogik
- konkrete Geschäftsprozesse

Konkrete Fachfunktionen gehören in Module.

—

# 3. Zielstruktur

Die endgültige logische Struktur lautet:

Application
│
├── Application Entry
│
└── Core
    │
    ├── Core API
    ├── Context
    ├── State
    ├── Event Bus
    ├── Configuration
    ├── Storage
    ├── Database
    ├── Error Handling
    ├── Logging
    ├── Lifecycle
    │
    └── Module System
        │
        ├── Module Interface
        ├── Module Registry
        ├── Module Loader
        └── Module Manager
                │
                └── Modules

—

# 4. Core API

## Verantwortung

Die Core API ist die zentrale öffentliche Schnittstelle des Core.

Sie stellt keine eigene Fachlogik bereit.

Sie verbindet die technischen Core-Komponenten.

## Aufgaben

- Core initialisieren
- Core-Status bereitstellen
- Zugriff auf Core-Dienste ermöglichen
- Lifecycle steuern
- Module-System bereitstellen
- zentrale technische APIs bündeln

## Architekturregel

Spezialisierte Komponenten werden nicht vollständig in der Core-Fassade implementiert.

Die Core API delegiert an die zuständigen Komponenten.

—

# 5. Context

## Ziel

Der Context stellt allgemeine Laufzeitinformationen bereit.

## Verantwortlich für

- Application
- Runtime
- Environment
- Online-/Offline-Status
- technische Laufzeitinformationen

## Nicht verantwortlich für

- fachliche Modulzustände
- Userdaten
- Catchdaten
- GPS-Fachdaten
- Wetterdaten

—

# 6. State

## Ziel

Der Core State verwaltet generischen technischen Laufzeitzustand.

## Funktionen

- set
- get
- has
- remove
- getAll
- clear

## Regel

Der Core State darf keine festen fachlichen Datenmodelle enthalten.

Fachlicher Modulzustand gehört in das jeweilige Modul.

—

# 7. Event Bus

## Ziel

Der Event Bus stellt die zentrale technische Ereigniskommunikation bereit.

## Funktionen

- subscribe
- unsubscribe
- publish
- clear

## Zweck

Module und Core-Komponenten können über definierte Events kommunizieren.

## Architekturregel

Direkte Abhängigkeiten zwischen unabhängigen Fachmodulen sollen vermieden werden.

Bevorzugt:

Module A
    ↓
Event Bus
    ↓
Module B

anstatt:

Module A
    ↓
direkter Zugriff
    ↓
Module B

## Fehler

Fehler innerhalb von Event-Handlern werden an das zentrale Error Handling weitergegeben.

—

# 8. Configuration

## Ziel

Die Konfiguration wird in klar getrennte Ebenen aufgeteilt.

## Core Configuration

Enthält ausschließlich generische Core-Einstellungen.

Beispiele:

- Core Version
- technische Defaults
- technische Laufzeitoptionen

## Application Configuration

Enthält anwendungsweite Einstellungen.

## Module Configuration

Enthält ausschließlich Einstellungen eines jeweiligen Moduls.

## Verbot

Der Core darf keine feste Liste konkreter Fachmodule in seiner Konfiguration voraussetzen.

Insbesondere keine fest eingebauten Einträge für:

- User
- Admin
- GPS
- Weather
- i18n

—

# 9. Storage

## Ziel

Storage stellt einen einfachen technischen Key/Value-Speicher bereit.

## Verantwortlich für

- einfache persistente technische Werte
- technische Einstellungen
- kleine technische Zustände

## Nicht verantwortlich für

- komplexe fachliche Datenmodelle
- relationale beziehungsweise strukturierte Fachdaten
- Modul-Datenmodelle

## Abgrenzung

Storage
→ einfacher Key/Value-Speicher

Database
→ strukturierte persistente Daten

Module
→ fachliche Datenmodelle

—

# 10. Database

## Ziel

Die Database-Komponente stellt die technische Datenbankinfrastruktur bereit.

## Verantwortlich für

- Datenbank öffnen
- Datenbankversion
- Migrationen
- Stores
- Transaktionen
- CRUD
- Indexzugriffe
- Datenbankfehler

## Nicht verantwortlich für

Die Database-Komponente definiert nicht die fachliche Datenstruktur aller Module.

Beispielsweise dürfen nicht automatisch folgende fachlichen Bereiche als Core-Datenmodell vorausgesetzt werden:

- users
- modules
- sessions
- catches
- weather
- gps

## Grundprinzip

Die technische Datenbankinfrastruktur gehört zum Core.

Das fachliche Datenmodell gehört zum jeweiligen Modul beziehungsweise zur Application-Ebene, soweit es nicht eindeutig Core-Infrastruktur ist.

—

# 11. Error Handling

## Ziel

Alle technischen Fehler werden zentral verarbeitet.

## Komponenten

- Error Handler
- Error Log
- persistente Fehlerablage

## Error Handler

Verantwortlich für:

- Fehler normalisieren
- Fehler klassifizieren
- Kontext hinzufügen
- Fehler an Logging weitergeben

## Error Log

Erfasst mindestens:

- Timestamp
- Message
- Stack
- Context
- Fehlerquelle
- Schweregrad, soweit definiert

## Fehlerquellen

Mindestens:

- JavaScript Errors
- unhandled Promise Rejections
- Core-Fehler
- Modulfehler, soweit sie über die Core-Schnittstelle gemeldet werden

## Ziel

Fehler dürfen nicht nur temporär im Arbeitsspeicher existieren.

Eine definierte Persistenzstrategie wird Bestandteil der Implementierung.

—

# 12. Logging

Logging wird von Error Handling logisch getrennt.

## Error Logging

Technische Fehler.

## Application Logging

Allgemeine Laufzeitereignisse.

## Persistent Log Storage

Speicherung von Logs über die dafür definierte Infrastruktur.

## Architekturregel

Logging darf nicht als fachlicher Service eines konkreten Moduls implementiert werden.

—

# 13. Lifecycle

## Ziel

Der Core besitzt einen eindeutigen technischen Lifecycle.

Grundzustände:

created
    ↓
initializing
    ↓
ready
    ↓
running
    ↓
stopped

## Regel

Nur definierte Zustandsübergänge sind zulässig.

Die tatsächlichen Übergänge werden während der Implementierung technisch validiert.

## Verantwortlichkeit

Die Core Runtime besitzt die zentrale Runtime-Lifecycle-Verantwortung.

Es darf nicht mehrere konkurrierende Lifecycle-Steuerungen geben.

—

# 14. Core Startup

Der Startup-Prozess wird auf einen eindeutigen Ablauf reduziert.

Ziel:

Application Entry
    ↓
Core Startup
    ↓
Core Initialization
    ↓
Core Runtime
    ↓
Core Ready
    ↓
Module System

## Verbot

Keine parallelen beziehungsweise konkurrierenden Startketten über:

- app.js
- core-entry.js
- core-startup.js
- core-runtime.js
- core-loader.js
- index.js

Jede Komponente erhält eine klar definierte Verantwortung.

—

# 15. Application Entry

## Ziel

Es gibt einen eindeutigen Application-Einstiegspunkt.

Die Application Entry startet den Core.

Sie enthält keine fest verdrahtete Liste konkreter Fachmodule.

## Verbot

Application Entry darf nicht direkt:

- User
- Admin
- GPS
- Weather
- i18n

als feste Startabhängigkeiten laden.

Das Module System übernimmt die Modulverwaltung.

—

# 16. Module System

Das Module System ist Bestandteil des Core.

Es besteht logisch aus:

- Module Interface
- Module Registry
- Module Loader
- Module Manager

—

# 17. Module Interface

Das Module Interface definiert den verbindlichen Modulvertrag.

## Grundinformationen

Ein Modul besitzt mindestens:

- id
- name
- version
- description

## Lifecycle

Ein Modul muss einen definierten Lifecycle unterstützen.

Konzeptionell:

- install
- initialize
- enable
- disable
- update
- uninstall

## Status

Ein Modul muss seinen aktuellen Status eindeutig darstellen können.

## Erweiterbare Eigenschaften

Der Modulvertrag muss die Möglichkeit für folgende Informationen vorsehen:

- dependencies
- permissions
- capabilities

## Regel

Ein Modul darf nur über die definierte Schnittstelle mit dem Core kommunizieren.

—

# 18. Module Registry

## Ziel

Die Registry verwaltet die technische Bekanntheit installierter Module.

## Aufgaben

- Module registrieren
- Module identifizieren
- Module abrufen
- Modulmetadaten bereitstellen
- Registrierung entfernen

## Regel

Die Registry enthält keine Fachlogik.

—

# 19. Module Loader

## Ziel

Der Loader lädt technische Modulressourcen.

## Aufgaben

- Modulressourcen laden
- technische Voraussetzungen prüfen
- Modulregistrierung vorbereiten
- Ladefehler melden

## Verbot

Der Loader darf keine feste Liste konkreter Fachmodule enthalten.

—

# 20. Module Manager

## Ziel

Der Module Manager ist die zentrale Verwaltung der Module.

## Verantwortlich für

- install
- uninstall
- enable
- disable
- update
- status
- dependencies
- permissions
- capabilities
- Lifecycle-Steuerung
- Modulregistrierung

## Zielzustände

available
    ↓
installed
    ↓
enabled
    ↓
disabled

Zusätzliche Übergänge:

installed
    ↓
updated

installed
    ↓
uninstalled

## Architekturregel

Die eigentliche Modulverwaltung liegt ausschließlich im Module Manager.

Sie darf nicht parallel in core.js und Module Manager implementiert werden.

—

# 21. Modulabhängigkeiten

Module können Abhängigkeiten deklarieren.

Beispiel:

Module A
    ↓
benötigt
    ↓
Core Capability B

oder:

Module A
    ↓
benötigt
    ↓
Module B

Abhängigkeiten müssen explizit definiert werden.

Der Core darf keine impliziten Abhängigkeiten auf konkrete Fachmodule besitzen.

—

# 22. Permissions und Capabilities

Das Module System muss konzeptionell Permissions und Capabilities unterstützen.

## Permissions

Definieren, welche technischen oder geschützten Ressourcen ein Modul verwenden darf.

## Capabilities

Beschreiben, welche Funktionen ein Modul bereitstellt.

## Ziel

Dadurch können Module technisch integriert werden, ohne dass der Core ihre Fachlogik kennen muss.

—

# 23. Konkrete Module

Folgende Module sind Beispiele für Fachmodule:

- User
- Admin
- GPS
- Weather
- i18n

Diese gehören nicht als feste Fachlogik in den Core.

Der Core stellt lediglich die technische Plattform bereit.

—

# 24. Services

Es gibt keinen generischen Core Service Manager mit fest eingebauten Fachservices.

Insbesondere folgende Services gehören nicht fest in den Core:

- UserService
- AuthService
- ModuleService
- fachliche Weather Services
- fachliche GPS Services

## Technische Services

Technische Services können über definierte Core-Infrastruktur registriert werden.

## Fachservices

Fachservices gehören zum jeweiligen Modul.

Beispiel:

UserModule
    ↓
UserService

nicht:

Core
    ↓
UserService

—

# 25. Cache

Cache ist von Storage und Database abzugrenzen.

## Storage

Persistente einfache technische Werte.

## Database

Strukturierte persistente Daten.

## Cache

Temporäre beziehungsweise optimierte Datenhaltung.

Eine konkrete Cache-Implementierung wird erst im Rahmen der Core-Implementierung endgültig festgelegt.

—

# 26. Verbotene Architekturabhängigkeiten

Der Core darf nicht direkt von folgenden Fachmodulen abhängig sein:

- User
- Admin
- GPS
- Weather
- i18n
- Catchbook
- Catches

Der Core darf keine konkreten Modulpfade als feste Architekturvoraussetzung enthalten.

Der Core darf keine Fachlogik dieser Module enthalten.

—

# 27. Bestehende Dateien – Zielentscheidung

| Bestehende Komponente | Ziel |
|—|—|
| core.js | ersetzen / Core-Fassade |
| core-context.js | übernehmen |
| core-state.js | übernehmen |
| core-event-bus.js | übernehmen |
| core-storage.js | neu strukturieren |
| error-log.js | neu strukturieren |
| core-error-handler.js | übernehmen |
| core-config.js | übernehmen |
| module-interface.js | neu strukturieren |
| module-manager.js | neu strukturieren |
| core-lifecycle.js | übernehmen / validieren |
| core-loader.js | neu strukturieren |
| core-startup.js | neu strukturieren |
| core-runtime.js | neu strukturieren |
| core-shutdown.js | neu strukturieren |
| core-entry.js | neu strukturieren |
| Core/index.js | entfernen |
| Core/app.js | neu strukturieren |

—

# 28. Infrastruktur – Zielentscheidung

| Bereich | Ziel |
|—|—|
| Config Manager | neu strukturieren |
| Database Manager | neu strukturieren |
| Service Manager | nicht als fachlicher Core-Service-Manager fortführen |
| Storage | klar von Database trennen |
| Logging | klar von Error Handling trennen |
| Cache | klar von Storage und Database trennen |

—

# 29. Ziel der Core-Bereinigung

Die Core-Bereinigung hat folgende Ziele:

1. doppelte Verantwortlichkeiten entfernen
2. konkurrierende Startpfade entfernen
3. Core und Module eindeutig trennen
4. fachliche Abhängigkeiten aus dem Core entfernen
5. technische Schnittstellen definieren
6. Lifecycle zentralisieren
7. Module Lifecycle zentralisieren
8. Storage und Database trennen
9. Error Handling und Logging sauber strukturieren
10. eine eindeutige Application-/Core-Startstruktur herstellen

—

# 30. Implementierungsreihenfolge

Die spätere Implementierung erfolgt in dieser Reihenfolge:

1. Core-Verzeichnis bereinigen
2. Ziel-Dateistruktur anlegen
3. Core Configuration
4. Context
5. State
6. Event Bus
7. Storage
8. Database-Infrastruktur
9. Error Handling
10. Logging
11. Lifecycle
12. Module Interface
13. Module Registry
14. Module Loader
15. Module Manager
16. Core Runtime
17. Core Startup
18. Application Entry
19. Integration
20. Tests
21. Validierung
22. Core Freeze

—

# 31. Validierung vor Core Freeze

Vor einem Core Freeze müssen mindestens geprüft werden:

- Syntax aller Core-Dateien
- Lade-/Import-Reihenfolge
- Abhängigkeiten
- Initialisierung
- Lifecycle
- Shutdown
- Event Bus
- State
- Storage
- Database
- Error Handling
- Logging
- Module Interface
- Module Registry
- Module Loader
- Module Manager
- Application Entry
- Offline-Verhalten
- Fehlerbehandlung
- fehlende beziehungsweise doppelte Dateien
- unerlaubte Abhängigkeiten zu Fachmodulen

Erst wenn diese Prüfungen erfolgreich abgeschlossen sind, darf ein Core Freeze erfolgen.

—

# 32. Dokumentationsregel

Diese Datei beschreibt die Zielarchitektur.

Sie enthält keinen Arbeitscursor.

Sie enthält keinen Fortsetzungsschlüssel.

Sie bestimmt nicht den nächsten konkreten Arbeitsschritt.

Der aktuelle und nächste Arbeitsstand wird ausschließlich in `STATE.md` geführt.

—

# 33. Abgrenzung

Diese Datei ersetzt nicht:

- RULES.md
- WORKFLOW.md
- PROJECT.md
- STATE.md

Sie konkretisiert ausschließlich die technische Zielarchitektur des Core.

—

# 34. Abschluss

Die Core-Zielstruktur ist mit den Ergebnissen aus:

- CORE_FUNCTIONAL_ANALYSIS.md
- INFRASTRUCTURE_ANALYSIS.md

abzugleichen.

Erst nach erfolgreicher Prüfung dieser Zielstruktur beginnt die eigentliche Core-Bereinigung.

CORE-TARGET-STRUCTURE:
COMPLETED

CORE-IMPLEMENTATION:
NOT STARTED

CORE-FREEZE:
NOT ALLOWED