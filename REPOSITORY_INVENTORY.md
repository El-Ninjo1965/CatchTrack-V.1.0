# CatchTrack V1.0 – Repository Inventory

## Zweck

Diese Datei dokumentiert die technische Inventur des aktuellen Repository-Stands auf GitHub main.

Die Inventur ist die Grundlage für die Core-Bereinigung und die anschließende Neuimplementierung.

## Prüfgrundlage

Quelle:
GitHub main

Inventurstatus:
ABGESCHLOSSEN

Versionierte Dateien:
58

## Entscheidungsregeln

A – NEU
B – LÖSCHEN
C – VOLLSTÄNDIG ERSETZEN
D – UNVERÄNDERT ÜBERNEHMEN

## Root

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /.gitignore | Git-Ausschlussregeln | D |
| /VISION.md | Projektvision | D / Frozen |
| /RULES.md | Verbindliche Projektregeln | D / Frozen |
| /WORKFLOW.md | Entwicklungsworkflow | D / Frozen |
| /PROJECT_MASTERLIST.md | Verbindliche Entwicklungsphasen | D / Frozen |
| /PROJECT_STATUS.md | Bestätigter Projektstatus | D / Frozen |
| /PROJECT_CHRONICLE_001.md | Projektchronik | D |
| /DEV_LOG.md | Technisches Entwicklungsprotokoll | D |
| /WORK_STATE.md | Aktueller Arbeitszustand | D |
| /REPOSITORY_INVENTORY.md | Repository-Inventur | C |
| /index.html | Produkt-/Anwendungsoberfläche | C / nach Core-Bereinigung erneut prüfen |
| /dev.html | Entwickler-/Testoberfläche | C / nach Core-Bereinigung erneut prüfen |
| /preview.html | Vorschau-/Testoberfläche | C / Zweck und Notwendigkeit prüfen |
| /localStorage.json | Lokale Test-/Entwicklungsdaten | C / Zweck und Versionierung prüfen |

## Config

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Config/config-manager.js | Zentrale Konfigurationsverwaltung | C |
| /Config/README.md | Dokumentation des Config-Managers | C |

Begründung:

Konfiguration gehört nach Zielarchitektur zur generischen Infrastruktur. Die endgültige Position und API werden im neuen Core festgelegt.

## Database

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Database/database-manager.js | IndexedDB-/Datenbankverwaltung | C |
| /Database/README.md | Dokumentation des Database-Managers | C |

Begründung:

Database ist Core-Infrastruktur, muss aber auf den endgültigen generischen Datenbank-Lifecycle ausgerichtet werden.

## Services

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Services/service-manager.js | Service-Registry und Service-Koordination | C |
| /Services/README.md | Dokumentation | C |

Begründung:

Service-Infrastruktur muss auf tatsächliche Core-Verantwortung reduziert und gegen Core-Lifecycle, Module und Permissions geprüft werden.

## Core

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Core/core.js | Zentrale Core-API, State, Modulregistrierung, Events | C |
| /Core/core-config.js | Core-Konfiguration | C |
| /Core/core-context.js | Core-Kontext | C |
| /Core/core-entry.js | Technischer Core-Einstieg | C |
| /Core/core-error-handler.js | Fehlerbehandlung | C |
| /Core/core-event-bus.js | Event-System | C |
| /Core/core-lifecycle.js | Lifecycle-Verwaltung | C |
| /Core/core-loader.js | Initialisierung/Abhängigkeitsprüfung | C |
| /Core/core-runtime.js | Runtime-Steuerung | C |
| /Core/core-shutdown.js | kontrolliertes Beenden | C |
| /Core/core-startup.js | Startup-Steuerung | C |
| /Core/core-state.js | zentraler State | C |
| /Core/core-storage.js | Storage-Infrastruktur | C |
| /Core/error-log.js | Fehler-/Logverwaltung | C |
| /Core/index.js | zusätzlicher Einstiegspunkt | C |
| /Core/module-interface.js | Modul-Schnittstelle | C |
| /Core/module-manager.js | Modulverwaltung | C |
| /Core/app.js | Application Bootstrap und Laden von Infrastruktur/Modulen | C |

Begründung:

Der vorhandene Core enthält grundsätzlich die richtigen Infrastrukturbereiche, weist aber mehrere überlappende Einstiegs-, Lade- und Verwaltungsstrukturen auf.

Beispiele:

core.js
→ zentrale Core-API

core-entry.js
→ Runtime-Einstieg

core-loader.js
→ Initialisierungsprüfung

index.js
→ weiterer Einstieg

app.js
→ Application Bootstrap und direktes Laden konkreter Module

Diese Strukturen müssen im Core-Neuaufbau eindeutig zusammengeführt werden.

Besonders kritisch:

Core/app.js lädt derzeit konkrete Fachmodule wie Weather, GPS, User, Admin und i18n direkt. Das widerspricht der Zielarchitektur eines generischen, modulunabhängigen Core-Systems.

## Modules

### Admin

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/admin-module/admin-module.js | Admin-Fachlogik | D / später neu gegen Core validieren |
| /Modules/admin-module/admin-interface.js | öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/admin-module/admin-loader.js | Modulregistrierung/-aktivierung | D / später validieren |
| /Modules/admin-module/README.md | Dokumentation | D / später validieren |

### GPS

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/gps-module/gps-module.js | GPS-Fachlogik | D / später validieren |
| /Modules/gps-module/gps-interface.js | öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/gps-module/gps-loader.js | Modulregistrierung/-aktivierung | D / später validieren |
| /Modules/gps-module/README.md | Dokumentation | D / später validieren |

### i18n

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/i18n-module/i18n-module.js | Internationalisierung | D / Architekturprüfung erforderlich |
| /Modules/i18n-module/i18n-interface.js | öffentliche Schnittstelle | D / Architekturprüfung erforderlich |
| /Modules/i18n-module/i18n-loader.js | Registrierung/Aktivierung | D / Architekturprüfung erforderlich |

### User

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/user-module/user-module.js | Benutzerverwaltung | D / später validieren |
| /Modules/user-module/user-interface.js | öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/user-module/user-loader.js | Registrierung/Aktivierung | D / später validieren |
| /Modules/user-module/README.md | Dokumentation | D / später validieren |

### Weather

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/weather-module/weather-module.js | Wetter-Fachlogik | D / später validieren |
| /Modules/weather-module/weather-interface.js | öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/weather-module/weather-loader.js | Registrierung/Aktivierung | D / später validieren |
| /Modules/weather-module/weather-provider.js | Provider-Abstraktion | D / später validieren |
| /Modules/weather-module/README.md | Dokumentation | D / später validieren |

Die vorhandenen Fachmodule werden nicht automatisch gelöscht.

Sie werden nach der Core-Bereinigung erneut gegen die endgültige Module-Schnittstelle geprüft.

## Vorläufige Architekturprobleme

### 1. Core lädt Fachmodule direkt

Aktuell lädt /Core/app.js unter anderem:

- i18n
- Weather
- GPS
- User
- Admin

Damit besitzt der Core direkte Kenntnisse über konkrete Module.

Ziel:

Core
→ generische Module-Schnittstelle
→ Module Registry
→ Module Manager
→ Module

Der Core darf keine konkrete Fachmodulliste benötigen.

### 2. Mehrere Startup-/Entry-Strukturen

Vorhanden sind:

- core-entry.js
- core-loader.js
- core-startup.js
- core-runtime.js
- index.js
- app.js

Diese Dateien müssen funktional gegeneinander geprüft und anschließend auf einen eindeutigen Startup-/Runtime-Ablauf reduziert werden.

### 3. Modulverwaltung doppelt verteilt

Core/core.js enthält bereits:

- registerModule
- unregisterModule
- activateModule
- deactivateModule
- getModule
- getModules

Core/module-manager.js stellt dafür nochmals eine Verwaltungsschicht bereit.

Die endgültige Verantwortungsverteilung muss eindeutig definiert werden.

### 4. Infrastruktur außerhalb des Core

Config, Database und Services liegen derzeit außerhalb von /Core.

Das ist nicht automatisch falsch.

Vor der endgültigen Strukturentscheidung muss jedoch festgelegt werden, welche dieser Komponenten tatsächlich Core-Infrastruktur sind und welche als eigenständige technische Subsysteme bestehen bleiben.

### 5. UI ist aktuell eng mit konkreten Modulen verbunden

index.html enthält direkte Integrationslogik für vorhandene Module.

Diese Kopplung muss nach dem Core-/Module-Neuaufbau überprüft werden.

## Inventurentscheidung

Die Inventur führt nicht zu einem sofortigen Löschen aller vorhandenen Implementierungen.

Stattdessen:

1. Core-Struktur vollständig analysieren
2. redundante Core-Komponenten identifizieren
3. generische Core-Grenze festlegen
4. Core-Bereinigung durchführen
5. Module-Schnittstelle endgültig definieren
6. vorhandene Module gegen diese Schnittstelle validieren
7. erst danach Module anpassen oder ersetzen

## Aktueller Status

REPOSITORY INVENTORY:
COMPLETED

CORE:
NOT FROZEN

MODULE SYSTEM:
RESTRUCTURING REQUIRED

## Nächster Arbeitsschritt

CORE-INVENTUR VERTIEFEN

Zuerst werden die bestehenden Core-Dateien funktional gegeneinander abgegrenzt.

Danach werden die notwendigen Core-Komponenten als Zielstruktur definiert.

Erst anschließend beginnt die Core-Bereinigung.

## Fortsetzungsschlüssel

CORE-INVENTORY-DEEP-DIVE