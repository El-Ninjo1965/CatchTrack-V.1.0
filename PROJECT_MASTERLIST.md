CatchTrack V1.0 – Project Masterlist

1. Zweck

Diese Masterliste definiert die verbindliche Reihenfolge der Entwicklung.

Sie verhindert, dass einzelne Module entwickelt werden, bevor die dafür erforderliche Plattform stabil ist.

Diese Datei ist Frozen.

Sie wird nicht von AI-Agenten eigenständig verändert.

⸻

PHASE 1 – ARCHITEKTUR

1.1 Projektdokumentation

* VISION.md
* RULES.md
* WORKFLOW.md
* PROJECT_MASTERLIST.md
* PROJECT_STATUS.md

Status:

ARCHITECTURE DEFINED

⸻

PHASE 2 – CORE-INVENTUR

2.1 Vollständige Bestandsaufnahme

Alle bestehenden Core- und unterstützenden Dateien prüfen.

Jede Datei erhält genau eine Klassifizierung:

A – NEU
B – LÖSCHEN
C – VOLLSTÄNDIG ERSETZEN
D – UNVERÄNDERT ÜBERNEHMEN

Ziel:

* keine doppelten Funktionen
* keine unnötigen Dateien
* keine parallelen Implementierungen
* keine versteckten Core-Abhängigkeiten
* klare Core-Grenze

⸻

PHASE 3 – CORE-BEREINIGUNG

Der Core wird auf generische Infrastruktur reduziert.

Aus dem Core werden fachliche Funktionen entfernt, die als Module umgesetzt werden müssen.

Beispiele:

GPS → Modul
Weather → Modul
Catchbook → Modul
Fish Database → Modul
Tides → Modul
Statistics → Modul
Maps → Modul

⸻

PHASE 4 – CORE

Der Core wird vollständig und stabil aufgebaut.

Erforderliche Bereiche

* Application Startup
* Runtime
* Lifecycle
* Event System
* State
* Storage
* Database
* Error Handling
* Logging
* Module Interface
* Module Registry
* Module Manager
* Permissions
* Package/Entitlements
* System Configuration

⸻

PHASE 5 – MODULE SYSTEM

Module Interface

Ein einheitliches Interface für installierbare Module definieren.

Module Manifest

Einheitliches Manifest für:

* ID
* Name
* Version
* Beschreibung
* Entry Point
* Dependencies
* Permissions
* Package Requirements
* Database Information

Module Registry

Installierte Module eindeutig registrieren.

Module Manager

Unterstützen:

* install
* uninstall
* enable
* disable
* update
* status
* dependencies

⸻

PHASE 6 – DATABASE LIFECYCLE

Module erhalten einen definierten Datenbank-Lifecycle.

Installation

install module
→ install database
→ register module

Update

update module
→ execute migration

Deinstallation

disable module
→ handle data
→ uninstall database
→ unregister module
→ remove module

⸻

PHASE 7 – PERMISSIONS

Zentrales Berechtigungssystem implementieren.

Grundmodell:

User
 ├── Role
 ├── Package
 └── Permissions

Berechtigungen müssen unabhängig von einzelnen Fachmodulen definiert werden können.

⸻

PHASE 8 – USER MODULE

User als eigenständiges Modul implementieren.

Zielbereiche:

* User Account
* Login
* Logout
* Session
* Profile
* User Status
* Roles
* Permissions
* Package Assignment

⸻

PHASE 9 – ADMIN MODULE

Admin als eigenständiges Modul implementieren.

Zielbereiche:

* Dashboard
* Users
* Roles
* Packages
* Modules
* System

Module Management

Das Admin-Modul muss perspektivisch ermöglichen:

Available
Installed
Install
Enable
Disable
Update
Uninstall

⸻

PHASE 10 – PACKAGE SYSTEM

Generische Package-/Entitlement-Infrastruktur vorbereiten.

Beispiel:

FREE
BASIC
PRO
DEVELOPER

Keine endgültige Produktdefinition.

Ziel:

Package
 ↓
Entitlements
 ↓
Modules / Features

⸻

PHASE 11 – DYNAMIC UI

Navigation darf nicht fachlich fest verdrahtet werden.

Ziel:

User
 ↓
Role
 ↓
Package
 ↓
Permissions
 ↓
Installed Modules
 ↓
Module Navigation
 ↓
Visible UI

Nicht verfügbare Funktionen werden nicht angezeigt.

⸻

PHASE 12 – CORE VALIDATION

Der vollständige Core wird getestet.

Prüfen:

* Startup
* Runtime
* Lifecycle
* Event System
* Storage
* Database
* Error Handling
* Module Loading
* Module Registry
* Module Manager
* Permissions
* Security
* Dependencies
* Offline-Verhalten

⸻

PHASE 13 – CORE ACCEPTANCE

Der Core wird technisch abgenommen.

Erst danach darf der Core als stabil betrachtet werden.

⸻

PHASE 14 – CORE FREEZE

Nach erfolgreicher Abnahme:

CORE V1.0
FROZEN
READ ONLY FOR AI AGENTS

Danach gilt:

Neue Fachfunktion = neues Modul.

⸻

PHASE 15 – FACHMODULE

Erst nach Core-Freeze werden Fachmodule endgültig umgesetzt.

Geplante Module:

GPS
Weather
Catchbook
Fish Database
Tides
Maps
Statistics
Reverse Geocoding

Weitere Module können später ergänzt werden.

⸻

PHASE 16 – MODULTESTS

Jedes Modul wird separat getestet.

Prüfen:

* Installation
* Aktivierung
* Deaktivierung
* Nutzung
* Datenbank
* Update
* Deinstallation
* Berechtigungen
* Package Requirements
* Fehlerbehandlung

⸻

PHASE 17 – GESAMTSYSTEM

Nach Fertigstellung der Module:

* Integration testen
* Offline-Verhalten testen
* Datenintegrität testen
* Berechtigungen testen
* Paketlogik testen
* Modul-Lifecycle testen
* UI testen

⸻

ENDZUSTAND

CatchTrack V1.0 ist fertig, wenn:

Core
→ stabil
→ getestet
→ eingefroren
Module System
→ installierbar
→ deinstallierbar
→ aktualisierbar
→ aktivierbar/deaktivierbar
User
→ eigenes Modul
Admin
→ eigenes Modul
Permissions
→ aktiv
Packages
→ vorbereitet/aktiv
Navigation
→ dynamisch
Fachmodule
→ unabhängig vom Core

Der wichtigste Architekturtest lautet:

Kann ein neues Fachmodul installiert werden, ohne eine bestehende Core-Datei zu verändern?

Wenn nein, ist die Architektur noch nicht fertig.