CatchTrack V1.0 – PROJECT ARCHITECTURE

Dateiname: PROJECT_ARCHITECTURE.md
Projekt: CatchTrack V1.0
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main
Stand: 09.08.2026
Status: Initiale Architekturdokumentation

⸻

1. Zweck

Diese Datei beschreibt die technische Architektur von CatchTrack V1.0.

Sie dient dazu, bei jeder Weiterentwicklung eindeutig festzustellen:

* welche Komponenten existieren
* welche Komponente welche Aufgabe besitzt
* welche Schnittstellen verwendet werden
* wo Daten gespeichert werden
* welche Module voneinander abhängig sind
* welche Dateien zentrale Bestandteile der Architektur sind
* welche Strukturen nicht ohne Prüfung verändert werden dürfen
* welche alten Strukturen nicht mehr verwendet werden sollen

Diese Datei ist kein Arbeitsplan.

Der Arbeitsplan befindet sich in:

PROJECT_MODULE_PLAN.md

Der aktuelle Wissensstand befindet sich in:

PROJECT_KNOWLEDGE.md

Die verbindlichen Projektregeln befinden sich in:

PROJECT_RULES.md

⸻

2. Architekturprinzip

CatchTrack V1.0 besteht aus einer zentralen Anwendung mit modularer Erweiterungsstruktur.

Grundprinzip:

Application
│
├── Core
│   ├── API
│   ├── Database
│   ├── Error Handler
│   ├── Language Manager
│   ├── Module Installer
│   ├── Module Manager
│   ├── Permission Manager
│   ├── Router
│   └── Storage Manager
│
├── Database
│
├── Services
│
├── Config
│
├── Modules
│
├── Assets
│
└── Libraries

Module sollen möglichst eigenständig arbeiten, aber die vorhandenen Core- und Service-Schnittstellen verwenden.

Eine neue Parallelarchitektur darf nicht eingeführt werden, wenn bereits eine passende zentrale Funktion existiert.

⸻

3. Zentrale Einstiegspunkte

Aktuell relevante zentrale Dateien:

index.html
app.js

Diese Dateien bilden den Einstieg der Anwendung.

Sie dürfen bei Modulentwicklung nicht unnötig umgebaut werden.

Vor Änderungen muss geprüft werden:

* Modulinitialisierung
* Router
* Module Manager
* Language Manager
* Storage
* Datenbank
* globale UI-Struktur

⸻

4. Core

Aktueller Core:

core/
├── api.js
├── database.js
├── errorHandler.js
├── languageManager.js
├── moduleInstaller.js
├── moduleManager.js
├── permissionManager.js
├── router.js
└── storageManager.js

⸻

5. Core-Komponenten

5.1 api.js

Aufgabe:

* zentrale API-/Kommunikationsfunktionen
* gemeinsame Schnittstelle für externe Datenquellen

Vor Verwendung in einem Modul:

* vorhandene Funktionen prüfen
* keine parallele API-Schicht erzeugen

⸻

5.2 database.js

Aufgabe:

* zentrale Datenbankkommunikation
* Datenbankzugriff kapseln

Module sollen nicht unnötig eigene Datenbankzugriffe außerhalb der vorgesehenen Architektur implementieren.

⸻

5.3 errorHandler.js

Aufgabe:

* zentrale Fehlerbehandlung

Neue Module sollen Fehler nicht ausschließlich lokal verschlucken.

⸻

5.4 languageManager.js

Aufgabe:

* Sprachverwaltung
* Übersetzungen
* zentrale Sprachlogik

Neue sichtbare Texte müssen mit dem vorhandenen Sprachsystem kompatibel sein.

⸻

5.5 moduleInstaller.js

Aufgabe:

* Installation bzw. Verwaltung von Modulen

Vor Änderungen an Moduldefinitionen muss geprüft werden, wie diese Datei die Modulstruktur tatsächlich verarbeitet.

⸻

5.6 moduleManager.js

Aufgabe:

* Laden
* Aktivieren
* Verwalten
* Initialisieren von Modulen

Dies ist eine zentrale Architekturkomponente.

Module dürfen nicht unabhängig davon eine zweite Modulverwaltung implementieren.

⸻

5.7 permissionManager.js

Aufgabe:

* Berechtigungen
* Zugriffskontrolle

Falls ein Modul besondere Rechte benötigt, muss diese zentrale Funktion geprüft werden.

⸻

5.8 router.js

Aufgabe:

* Navigation
* Routing
* Modulwechsel

Neue Module müssen mit dem vorhandenen Routing-Konzept kompatibel sein.

⸻

5.9 storageManager.js

Aufgabe:

* zentrale lokale Speicherung
* Zugriff auf persistente Daten

Module sollen nicht ohne Grund eigene parallele Storage-Systeme verwenden.

⸻

6. Config

Aktuell:

config/
├── app.json
├── languages.json
└── modules.json

⸻

7. modules.json

config/modules.json beschreibt die konfigurierte Modulstruktur.

Es enthält unter anderem:

* Modul-ID
* Name
* Pfad
* Aktivierungsstatus
* Abhängigkeiten
* weitere Modulmetadaten

Wichtig:

Das Vorhandensein einer module.json innerhalb eines Modulordners bedeutet nicht automatisch, dass diese Datei von der aktuellen Architektur verwendet wird.

Die tatsächliche Verwendung muss über:

* Module Manager
* Module Installer
* Imports
* dynamische Imports
* Referenzen
* Konfiguration

geprüft werden.

⸻

8. Datenbank

Aktuelle Datenbankstruktur:

database/
├── database.js
├── database.sql
├── fish_names_seed.sql
├── fish_seed.sql
├── migrations/
├── schema.sql

Zusätzlich existieren Datenbankmigrationen.

Die Datenbank ist zentrale Grundlage für die Module.

Vor einer Änderung am Datenmodell muss geprüft werden:

1. bestehende Tabellen
2. bestehende Felder
3. bestehende Beziehungen
4. bestehende Seed-Daten
5. Migrationen
6. bereits verwendete Datenbankfunktionen
7. Abhängigkeiten bestehender Module

Keine Tabelle darf nur für ein einzelnes Modul doppelt angelegt werden, wenn bereits eine passende zentrale Struktur existiert.

⸻

9. Datenfluss

Grundprinzip:

UI
 ↓
Module
 ↓
Core / Services
 ↓
Database / Storage / API
 ↓
Daten

Bei komplexeren Vorgängen:

Module A
   ↓
Core / Service
   ↓
Database
   ↓
Module B

Direkte Abhängigkeiten zwischen Modulen sollen möglichst gering gehalten werden.

Wenn gemeinsame Daten benötigt werden, ist eine zentrale Schnittstelle zu bevorzugen.

⸻

10. Modularchitektur

Ein Modul kann grundsätzlich aus folgenden Dateien bestehen:

modules/<module>/
├── module.json
├── <module>.html
├── <module>.js
└── <module>.css

Dies ist lediglich ein mögliches Schema.

Nicht jede Datei muss zwingend vorhanden sein.

Entscheidend ist die tatsächliche Verwendung.

⸻

11. module.json

module.json ist besonders kritisch.

Für jede vorhandene module.json muss geprüft werden:

* wird sie geladen?
* wer lädt sie?
* wird sie vom Module Manager verarbeitet?
* wird sie vom Module Installer verarbeitet?
* enthält sie Informationen, die an anderer Stelle benötigt werden?
* ist sie Relikt einer früheren Architektur?

Ergebnis kann sein:

ACTIVE
MASTER
LEGACY
UNUSED
DELETE CANDIDATE

Keine module.json darf allein aufgrund ihres Namens gelöscht werden.

⸻

12. Services

Vor Entwicklung eines Moduls muss geprüft werden, welche vorhandenen Services verwendet werden können.

Regel:

Vorhandene zentrale Funktion verwenden
        ↓
statt
        ↓
neue parallele Funktion entwickeln

Dadurch werden:

* doppelte Logik
* widersprüchliche Daten
* unnötige Dateien
* Wartungsprobleme

vermieden.

⸻

13. Speicherarchitektur

Es existieren mehrere Speicherkomponenten.

Daher muss bei jeder neuen Speicherfunktion geprüft werden:

* Datenbank?
* Storage Manager?
* lokale Datei?
* Browser Storage?
* temporärer Zustand?

Keine neue Speicherlösung einführen, bevor die vorhandenen Möglichkeiten geprüft wurden.

⸻

14. Module und Datenabhängigkeiten

Grundstruktur:

Fish Database
      │
      └──────────────┐
                     ↓
Equipment ────────→ Catches ←────── Waters
                     ↑                 ↑
                     │                 │
GPS ─────────────────┘                 │
                                       │
Maps ←─────────────────────────────────┘
Weather ──────────────┐
Tides ────────────────┤
Moon ─────────────────┤
Conditions ───────────┤
Photos ───────────────┤
                      ↓
                    Catches
                      │
                      ↓
                 Catchbook
                      │
                      ↓
                 Statistics
                      │
                      ↓
                   Records
                      │
                      ↓
                 Leaderboard

Diese Struktur ist eine Arbeitsarchitektur und muss bei der Implementierung anhand des tatsächlichen Codes bestätigt werden.

⸻

15. Datenbesitzer

Grundregel:

Ein Datenobjekt soll einen eindeutigen fachlichen Besitzer haben.

Beispiele:

Fish
→ Fish Database
Equipment
→ Equipment
Water
→ Waters
Catch
→ Catches
Photo
→ Photos

Andere Module greifen auf diese Daten zu, sollen aber nicht unnötig eigene Kopien derselben Stammdaten führen.

⸻

16. Catches als zentrales Datenobjekt

Der Fang (Catch) verbindet viele Module.

Ein Catch kann grundsätzlich enthalten:

* Fischart
* Datum
* Uhrzeit
* Gewicht
* Länge
* Gewässer
* Position
* Wetter
* Gezeiten
* Mond
* Bedingungen
* Equipment
* Köder
* Fotos
* Notizen

Daher ist Catches ein zentrales Integrationsmodul.

Änderungen am Catch-Datenmodell müssen besonders sorgfältig geprüft werden.

⸻

17. Entwicklungsreihenfolge

Die genaue Reihenfolge wird in:

PROJECT_MODULE_PLAN.md

geführt.

Die Architektur gibt jedoch folgende Abhängigkeitslogik vor:

Core
 ↓
Database / Storage
 ↓
Fish Database
Equipment
Waters
 ↓
GPS / Maps
 ↓
Catches
 ↓
Catchbook
 ↓
Statistics
 ↓
Records
 ↓
Leaderboard

Parallel bzw. ergänzend:

Weather
Tides
Moon
Conditions
Photos

Systemfunktionen:

Settings
Export
Backup
Safety
Bluetooth
AI
Admin

Die tatsächliche Reihenfolge darf aufgrund des aktuellen GitHub-Stands angepasst werden.

⸻

18. Altarchitektur

Das Repository enthält Dateien und Strukturen aus unterschiedlichen Entwicklungsständen.

Deshalb gilt:

Vorhanden ≠ aktuell
Vorhanden ≠ verwendet
Vorhanden ≠ fertig

Eine Datei kann aus einer älteren Version stammen und trotzdem noch im Repository liegen.

Solche Dateien werden zunächst dokumentiert.

Erst nach vollständiger Referenzprüfung werden sie als Löschkandidaten markiert.

⸻

19. Löschregeln

Eine Datei darf erst gelöscht werden, wenn geprüft wurde:

Datei
 ↓
globale Referenzsuche
 ↓
Importprüfung
 ↓
HTML-Prüfung
 ↓
dynamische Ladeprüfung
 ↓
Module Manager
 ↓
Config
 ↓
Services
 ↓
Core
 ↓
Dokumentation
 ↓
Git-Historie
 ↓
Abhängigkeiten

Erst danach:

DELETE CANDIDATE
        ↓
ZUR LÖSCHUNG FREIGEGEBEN
        ↓
LÖSCHEN
        ↓
GitHub prüfen

⸻

20. Keine Parallelarchitektur

Folgende Vorgehensweise ist zu vermeiden:

Bestehende Funktion vorhanden
        ↓
neue alternative Funktion bauen
        ↓
beide existieren
        ↓
unklar, welche verwendet wird

Stattdessen:

Bestehende Funktion prüfen
        ↓
verwenden / erweitern
        ↓
nur wenn ungeeignet:
neue Funktion definieren
        ↓
alte Funktion ggf. später entfernen

⸻

21. Dateiänderungen

Bei Entwicklungsarbeiten sollen vollständige Dateien geliefert werden.

Keine unklaren Teiländerungen wie:

* „ändere Zeile X“
* „suche diesen Abschnitt“
* „füge ungefähr dort Code ein“

wenn eine vollständige Ersatzdatei möglich ist.

Ziel:

alte Datei
     ↓
vollständige geprüfte Ersatzdatei
     ↓
Working Copy
     ↓
Commit
     ↓
GitHub

⸻

22. Integrationsprüfung

Nach Fertigstellung eines Moduls müssen mindestens geprüft werden:

* Modul wird geladen
* Navigation funktioniert
* UI funktioniert
* Daten werden korrekt gelesen
* Daten werden korrekt gespeichert
* Fehler werden behandelt
* Abhängigkeiten funktionieren
* Sprache funktioniert
* mobile Darstellung funktioniert
* keine alte Parallelfunktion wird versehentlich verwendet
* keine benötigte Datei wurde als Altlast behandelt

⸻

23. Git als technische Historie

Git liefert:

* Commit-Datum
* Änderungszeitpunkt
* Commit-Inhalt
* Dateiversion
* Entwicklungsschritte

Bei späteren Prüfungen wird der aktuelle GitHub-Stand mit der Historie verglichen.

Wichtig:

Ein Commit-Datum ist ein Indikator, aber kein alleiniger Beweis für den funktionalen Status.

⸻

24. Architekturänderungen

Eine Änderung an folgenden Komponenten gilt als besonders kritisch:

* app.js
* index.html
* core/*
* database/*
* config/modules.json
* config/app.json
* config/languages.json
* Module Manager
* Router
* Storage Manager
* Database

Vor solchen Änderungen müssen die Auswirkungen auf alle abhängigen Module geprüft werden.

⸻

25. Architekturentscheidungen

Neue Architekturentscheidungen werden hier dokumentiert.

Format:

Datum:
Entscheidung:
Grund:
Betroffene Dateien:
Betroffene Module:
Alternative:
Folgen:

Aktuell:

09.08.2026
Entscheidung:
GitHub ist technische Referenz.
Working Copy ist operativer Schreibweg.
ChatGPT übernimmt Analyse, Planung und Dateierstellung.

⸻

26. Offene Architekturfragen

Folgende Punkte müssen beim tatsächlichen Ausbau anhand des Codes geklärt werden:

* tatsächliche Verarbeitung von module.json
* tatsächliche Rolle von config/modules.json
* endgültige Modul-Ladearchitektur
* genaue Service-Struktur
* tatsächliche Storage-Aufteilung
* endgültige Datenbankzugriffsschicht
* tatsächliche Beziehungen zwischen Catches und Zusatzdaten
* Verwendung vorhandener Legacy-Dateien
* tatsächliche externe API-Struktur
* endgültige Integrationspunkte für AI
* endgültige Bluetooth-Schnittstelle

Diese Punkte werden nicht spekulativ festgelegt.

Sie werden anhand des aktuellen Codes geprüft.

⸻

27. Architektur-Abnahme

Die Architektur gilt als dokumentiert, wenn für jede zentrale Komponente bekannt ist:

* Zweck
* Dateipfad
* Eingänge
* Ausgänge
* Abhängigkeiten
* verwendete Daten
* abhängige Module
* Status
* aktuelle oder alte Architektur

⸻

28. Ziel

Die Architektur muss so dokumentiert sein, dass ein späteres erneutes Einlesen von:

PROJECT_RULES.md
PROJECT_KNOWLEDGE.md
PROJECT_MODULE_PLAN.md
PROJECT_ARCHITECTURE.md
+
aktueller GitHub-Stand
+
Git-Historie

ausreicht, um die technische Struktur von CatchTrack V1.0 zuverlässig zu rekonstruieren.

Damit soll verhindert werden, dass bei längeren Entwicklungsunterbrechungen:

* bereits vorhandene Funktionen neu entwickelt werden
* falsche Abhängigkeiten angenommen werden
* Legacy-Code weitergeführt wird
* fertige Module versehentlich verändert werden
* Dateien unnötig dupliziert werden
* Altlasten mit neuer Architektur vermischt werden

⸻

29. Dokumentstatus

Erstellt: 09.08.2026

Status: INITIAL

Nächste Aktualisierung: nach der ersten detaillierten Modul-/Abhängigkeitsprüfung.

Verwandte Dokumente:

PROJECT_RULES.md
PROJECT_KNOWLEDGE.md
PROJECT_MODULE_PLAN.md