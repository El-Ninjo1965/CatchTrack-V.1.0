# CatchTrack V1.0 – Repository Inventory

## Zweck

Diese Datei dokumentiert die technische Inventur des aktuellen Repository-Stands auf GitHub main.

Die Inventur ist die Grundlage für die Core-Bereinigung und die anschließende Neuimplementierung.

Diese Datei ist derzeit **NICHT eingefroren**.

—

## Prüfgrundlage

Quelle:

GitHub main

Inventurstatus:

**ABGESCHLOSSEN – wird im Rahmen der aktuellen Dokumentations-Synchronisation überprüft**

Versionierte Dateien zum Zeitpunkt der ursprünglichen Inventur:

58

Die ursprüngliche Inventur bleibt als technische Grundlage erhalten.

—

## Entscheidungsregeln

- **A – NEU**
- **B – LÖSCHEN**
- **C – VOLLSTÄNDIG ERSETZEN**
- **D – UNVERÄNDERT ÜBERNEHMEN**

Diese Klassifizierungen sind vorläufig und können nach der vertieften Core-Inventur geändert werden.

—

## Root

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /.gitignore | Git-Ausschlussregeln | D |
| /VISION.md | Projektvision | D / Dokumentationsabgleich |
| /RULES.md | Verbindliche Projektregeln | D / Dokumentationsabgleich |
| /WORKFLOW.md | Entwicklungsworkflow | D / Dokumentationsabgleich |
| /PROJECT_MASTERLIST.md | Verbindliche Entwicklungsphasen | D / Dokumentationsabgleich |
| /PROJECT_STATUS.md | Projektstatus | D / Dokumentationsabgleich |
| /PROJECT_CHRONICLE_001.md | Projektchronik | D / fortlaufend |
| /DEV_LOG.md | Technisches Entwicklungsprotokoll | D / fortlaufend |
| /WORK_STATE.md | Aktueller Arbeitszustand | D / fortlaufend |
| /REPOSITORY_INVENTORY.md | Repository-Inventur | C / aktuell |
| /index.html | Produkt-/Anwendungsoberfläche | C / nach Core-Bereinigung erneut prüfen |
| /dev.html | Entwickler-/Testoberfläche | C / nach Core-Bereinigung erneut prüfen |
| /preview.html | Vorschau-/Testoberfläche | C / Zweck und Notwendigkeit prüfen |
| /localStorage.json | Lokale Test-/Entwicklungsdaten | C / Zweck und Versionierung prüfen |

—

## Config

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Config/config-manager.js | Zentrale Konfigurationsverwaltung | C |
| /Config/README.md | Dokumentation des Config-Managers | C |

### Beurteilung

Konfiguration gehört nach Zielarchitektur zur generischen Infrastruktur.

Die endgültige Position und API werden im neuen Core festgelegt.

—

## Database

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Database/database-manager.js | IndexedDB-/Datenbankverwaltung | C |
| /Database/README.md | Dokumentation des Database-Managers | C |

### Beurteilung

Database ist Core-Infrastruktur, muss aber auf den endgültigen generischen Datenbank-Lifecycle ausgerichtet werden.

—

## Services

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Services/service-manager.js | Service-Registry und Service-Koordination | C |
| /Services/README.md | Dokumentation | C |

### Beurteilung

Service-Infrastruktur muss auf tatsächliche Core-Verantwortung reduziert und gegen Core-Lifecycle, Module und Permissions geprüft werden.

—

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
| /Core/core-shutdown.js | Kontrolliertes Beenden | C |
| /Core/core-startup.js | Startup-Steuerung | C |
| /Core/core-state.js | Zentraler State | C |
| /Core/core-storage.js | Storage-Infrastruktur | C |
| /Core/error-log.js | Fehler-/Logverwaltung | C |
| /Core/index.js | Zusätzlicher Einstiegspunkt | C |
| /Core/module-interface.js | Modul-Schnittstelle | C |
| /Core/module-manager.js | Modulverwaltung | C |
| /Core/app.js | Application Bootstrap und Laden von Infrastruktur/Modulen | C |

### Beurteilung

Der vorhandene Core enthält grundsätzlich die benötigten Infrastrukturbereiche, weist aber mehrere überlappende Einstiegs-, Lade- und Verwaltungsstrukturen auf.

Beispiele:

```text
core.js
→ zentrale Core-API

core-entry.js
→ Runtime-Einstieg

core-loader.js
→ Initialisierungsprüfung

index.js
→ weiterer Einstieg

app.js
→ Application Bootstrap
```

Diese Strukturen müssen im Core-Neuaufbau eindeutig zusammengeführt werden.

### Kritischer Punkt

`Core/app.js` lädt derzeit konkrete Fachmodule wie:

- Weather
- GPS
- User
- Admin
- i18n

Das widerspricht der Zielarchitektur eines generischen, modulunabhängigen Core-Systems.

Der endgültige Core darf keine konkrete Fachmodulliste benötigen.

—

## Modules

### Admin

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/admin-module/admin-module.js | Admin-Fachlogik | D / später gegen Core validieren |
| /Modules/admin-module/admin-interface.js | Öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/admin-module/admin-loader.js | Modulregistrierung/-aktivierung | D / später validieren |
| /Modules/admin-module/README.md | Dokumentation | D / später validieren |

### GPS

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/gps-module/gps-module.js | GPS-Fachlogik | D / später gegen Core validieren |
| /Modules/gps-module/gps-interface.js | Öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/gps-module/gps-loader.js | Modulregistrierung/-aktivierung | D / später validieren |
| /Modules/gps-module/README.md | Dokumentation | D / später validieren |

### i18n

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/i18n-module/i18n-module.js | Internationalisierung | D / Architekturprüfung erforderlich |
| /Modules/i18n-module/i18n-interface.js | Öffentliche Schnittstelle | D / Architekturprüfung erforderlich |
| /Modules/i18n-module/i18n-loader.js | Registrierung/Aktivierung | D / Architekturprüfung erforderlich |

### User

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/user-module/user-module.js | Benutzerverwaltung | D / später validieren |
| /Modules/user-module/user-interface.js | Öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/user-module/user-loader.js | Registrierung/Aktivierung | D / später validieren |
| /Modules/user-module/README.md | Dokumentation | D / später validieren |

### Weather

| Pfad | Funktion | Klassifizierung |
|—|—|—|
| /Modules/weather-module/weather-module.js | Wetter-Fachlogik | D / später validieren |
| /Modules/weather-module/weather-interface.js | Öffentliche Modul-Schnittstelle | D / später validieren |
| /Modules/weather-module/weather-loader.js | Modulregistrierung/-aktivierung | D / später validieren |
| /Modules/weather-module/weather-provider.js | Provider-Abstraktion | D / später validieren |
| /Modules/weather-module/README.md | Dokumentation | D / später validieren |

Die vorhandenen Fachmodule werden nicht automatisch gelöscht.

Sie werden nach der Core-Bereinigung erneut gegen die endgültige Module-Schnittstelle geprüft.

—

## Vorläufige Architekturprobleme

### 1. Core lädt Fachmodule direkt

Aktuell lädt `/Core/app.js` unter anderem:

- i18n
- Weather
- GPS
- User
- Admin

Damit besitzt der Core direkte Kenntnisse über konkrete Module.

Ziel:

```text
Core
→ generische Module-Schnittstelle
→ Module Registry
→ Module Manager
→ Module
```

Der Core darf keine konkrete Fachmodulliste benötigen.

—

### 2. Mehrere Startup-/Entry-Strukturen

Vorhanden sind:

- core-entry.js
- core-loader.js
- core-startup.js
- core-runtime.js
- index.js
- app.js

Diese Dateien müssen funktional gegeneinander geprüft und anschließend auf einen eindeutigen Startup-/Runtime-Ablauf reduziert werden.

—

### 3. Modulverwaltung doppelt verteilt

`Core/core.js` enthält bereits:

- registerModule
- unregisterModule
- activateModule
- deactivateModule
- getModule
- getModules

`Core/module-manager.js` stellt dafür nochmals eine Verwaltungsschicht bereit.

Die endgültige Verantwortungsverteilung muss eindeutig definiert werden.

—

### 4. Infrastruktur außerhalb des Core

Config, Database und Services liegen derzeit außerhalb von `/Core`.

Das ist nicht automatisch falsch.

Vor der endgültigen Strukturentscheidung muss jedoch festgelegt werden, welche dieser Komponenten tatsächlich Core-Infrastruktur sind und welche als eigenständige technische Subsysteme bestehen bleiben.

—

### 5. UI ist aktuell eng mit konkreten Modulen verbunden

`index.html` enthält direkte Integrationslogik für vorhandene Module.

Diese Kopplung muss nach dem Core-/Module-Neuaufbau überprüft werden.

—

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

—

## Dokumentationsstatus

Die Dokumentationsdateien befinden sich aktuell noch in der einmaligen Synchronisationsphase.

Sie sind **NICHT eingefroren**.

Diese Datei wird nach Abschluss der Dokumentations-Synchronisation erneut auf Konsistenz geprüft.

—

## Core-Status

**NOT FROZEN**

Der Core wird erst nach vollständiger Inventur, Bereinigung, Implementierung, Validierung, Tests und Abnahme eingefroren.

—

## Modul-System

**RESTRUCTURING REQUIRED**

Das vorhandene Modul-System bleibt bis zur Core-Bereinigung bestehen, wird danach jedoch gegen die endgültige Core-/Module-Schnittstelle validiert.

—

## Nächster Arbeitsschritt

Nach Abschluss der Dokumentations-Synchronisation:

**CORE-INVENTORY-DEEP-DIVE**

Dabei werden die bestehenden Core-Dateien funktional gegeneinander abgegrenzt.

Anschließend wird die endgültige Core-Zielstruktur definiert.

Erst danach beginnt die eigentliche Core-Bereinigung.

—

## Fortsetzungsschlüssel

```text
CORE-INVENTORY-DEEP-DIVE
```