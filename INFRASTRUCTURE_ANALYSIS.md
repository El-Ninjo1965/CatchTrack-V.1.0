# CatchTrack V1.0 – Infrastructure Analysis

## Zweck

Diese Datei dokumentiert die funktionale Prüfung der bestehenden Infrastruktur außerhalb des direkten Core-Verzeichnisses.

Geprüft werden:

- Config
- Database
- Services

## Prüfgrundlage

Quelle:

GitHub main

Status:

ABGESCHLOSSEN

## 1. Config Manager

### Datei

Config/config-manager.js

### Aktuelle Aufgabe

Der Config Manager verwaltet mehrere Konfigurationsbereiche:

- app
- database
- api
- modules
- security
- performance
- ui
- features

Zusätzlich vorhanden:

- set()
- get()
- getPath()
- setPath()
- has()
- watch()
- getAll()
- merge()
- persist()
- load()

### Befund

Die Datei vermischt mehrere Ebenen:

- Core-/Application-Konfiguration
- Database-Konfiguration
- API-Konfiguration
- Modulkonfiguration
- Security-Konfiguration
- UI-Konfiguration
- Feature Flags

Damit ist der Manager deutlich breiter als eine reine Core-Konfiguration.

Zusätzlich enthält er konkrete Annahmen über:

- IndexedDB
- Module-Pfade
- konkrete Module
- UI
- Security
- API
- Development-Modus

### Kritischer Befund

Die aktuelle Config enthält:

    features.userModule
    features.adminModule

und:

    modules.loadPath
    modules.autoLoad
    modules.autoActivate

Damit kennt die Konfiguration konkrete Architekturentscheidungen des aktuellen Modul- und Ladeverfahrens.

Das darf nicht Bestandteil einer späteren stabilen Core-Konfiguration sein.

### Entscheidung

C – VOLLSTÄNDIG ERSETZEN

### Ziel

Der neue Config-Bereich wird klar getrennt:

    Core Configuration
        ↓
    generische Core-Einstellungen

    Application Configuration
        ↓
    anwendungsweite Einstellungen

    Module Configuration
        ↓
    ausschließlich modulspezifische Einstellungen

Keine feste Liste konkreter Module im Core.

Keine UI-Konfiguration im Core.

Keine Fachlogik im Config Manager.

—

## 2. Database Manager

### Datei

Database/database-manager.js

### Aktuelle Aufgabe

IndexedDB-Abstraktion mit:

- Datenbankinitialisierung
- Store-Erstellung
- CRUD
- Index-Suche
- Transaktionen
- Statistiken
- Löschen der Datenbank

Aktuelle Stores:

- users
- modules
- logs
- sessions
- settings
- cache
- sync

### Befund

Die technische Datenbankabstraktion ist grundsätzlich sinnvoll.

Problematisch ist jedoch die aktuelle Festlegung konkreter Fach-Stores.

Beispiele:

    users
    modules
    sessions

Diese Daten gehören nicht zwangsläufig in einen generischen Core.

Der Core sollte eine Datenbankinfrastruktur bereitstellen können, aber nicht die fachliche Datenstruktur aller späteren Module definieren.

### Kritischer Befund

Die Datenbank enthält bereits fachliche Annahmen über:

- User
- Module
- Sessions
- Logging
- Cache
- Synchronisation

Dadurch wird die Datenbank zu einer Mischung aus:

    Database Infrastructure
    +
    Application Data Model
    +
    Module Data Model

### Entscheidung

C – VOLLSTÄNDIG ERSETZEN

### Ziel

Die neue Database-Komponente soll:

- Datenbank öffnen
- Versionierung verwalten
- Migrationen unterstützen
- Stores verwalten
- Transaktionen bereitstellen
- CRUD abstrahieren
- Fehler sauber weitergeben

Die fachliche Entscheidung, welche Daten gespeichert werden, liegt außerhalb des generischen Core.

—

## 3. Service Manager

### Datei

Services/service-manager.js

### Aktuelle Aufgabe

Der Service Manager registriert fünf Standardservices:

- User
- Auth
- Module
- Logging
- Cache

### Kritischer Befund

Diese Services sind nicht wirklich generische Infrastruktur.

Insbesondere:

    UserService
    AuthService
    ModuleService

sind fachlich beziehungsweise modulbezogen.

Der Service Manager greift außerdem direkt auf:

- DatabaseManager
- UserModule
- CatchTrackCore

zu.

Damit entsteht eine zusätzliche Abhängigkeitsschicht:

    Service Manager
        ↓
    Database
        ↓
    Module

und gleichzeitig:

    Service Manager
        ↓
    Core
        ↓
    Module

Das erschwert die klare Architektur.

### Logging Service

Der Logging Service schreibt direkt in den Database Manager.

Logging sollte künftig zentral und eindeutig zwischen:

- technischem Error Logging
- allgemeinem Application Logging
- persistentem Log Storage

getrennt werden.

### Cache Service

Der Cache Service besitzt:

- RAM-Cache
- IndexedDB-Persistenz

Damit überschneidet er sich mit:

- Storage
- Database
- möglicher späterer Cache-Infrastruktur

Auch diese Verantwortung muss neu definiert werden.

### Entscheidung

C – VOLLSTÄNDIG ERSETZEN

### Ziel

Es wird kein generischer Service Manager mit fest eingebauten Fachservices mehr geben.

Stattdessen:

    Core
        ↓
    Service Infrastructure
        ↓
    registrierbare technische Services

Fachservices gehören in das jeweilige Modul.

Beispiel:

    UserModule
        ↓
    UserService

nicht:

    Core ServiceManager
        ↓
    UserService

—

# Gesamtentscheidung

| Bereich | Aktueller Zustand | Entscheidung |
|—|—|—|
| Config | zu breit, konkrete Architekturannahmen | C |
| Database | technisch brauchbar, aber fachlich vorbelastet | C |
| Services | enthält Fachservices und überschneidet Infrastruktur | C |

## Zielarchitektur

    Application
    │
    └── Core
        │
        ├── Configuration Infrastructure
        ├── Database Infrastructure
        ├── Storage
        ├── Logging / Error Handling
        ├── Event System
        ├── State
        ├── Lifecycle
        │
        └── Module System
            │
            ├── Module Interface
            ├── Module Registry
            └── Module Manager
                │
                └── Modules
                    ├── User
                    ├── Admin
                    ├── Weather
                    ├── GPS
                    └── i18n

## Verantwortungsgrenzen

### Core darf

- technische Infrastruktur bereitstellen
- Module registrieren
- Module verwalten
- Lifecycle steuern
- Events bereitstellen
- State verwalten
- Storage bereitstellen
- Datenbankzugriff bereitstellen
- Fehler erfassen
- Konfiguration bereitstellen

### Core darf nicht

- User-Fachlogik enthalten
- Authentifizierungslogik eines Fachmoduls enthalten
- Wetterlogik enthalten
- GPS-Fachlogik enthalten
- UI-Logik enthalten
- konkrete Module fest verdrahten
- konkrete Modulnamen für den Betrieb voraussetzen

### Module dürfen

- eigene Fachlogik enthalten
- eigene Services besitzen
- eigene Datenstrukturen definieren
- Core-APIs verwenden
- über definierte Events kommunizieren

### Module dürfen nicht

- Core-Dateien verändern
- Core direkt ersetzen
- Core-interne Implementierungen voraussetzen
- andere Module direkt manipulieren, wenn dafür keine definierte Schnittstelle existiert

# Infrastruktur-Entscheidung

Die drei bestehenden Bereiche werden nicht unverändert in die neue Architektur übernommen.

Alle drei werden bei der Core-Bereinigung neu strukturiert.

Keine bestehende Fachfunktion wird dabei automatisch verworfen.

Sie wird gegebenenfalls in das zuständige Modul verschoben.

## Status

INFRASTRUCTURE-ANALYSIS:
COMPLETED

CORE-FUNCTIONAL-ANALYSIS:
COMPLETED

CORE-CLEANUP:
NOT STARTED

CORE-FREEZE:
NOT ALLOWED

Die weitere Arbeitssteuerung erfolgt ausschließlich über `STATE.md`.

Die Datei enthält keine eigene Arbeitscursor- oder Fortsetzungsdefinition.