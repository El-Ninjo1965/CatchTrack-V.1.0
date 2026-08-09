CatchTrack V1.0 – PROJECT MODULE PLAN

Dateiname: PROJECT_MODULE_PLAN.md
Projekt: CatchTrack V1.0
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main
Planstatus: AKTUALISIERTE MASTERFASSUNG
Plan erstellt: 09.08.2026
Letzte Prüfung: 09.08.2026

⸻

1. ZWECK DIESER DATEI

Diese Datei ist der verbindliche chronologische Entwicklungs-,
Integrations- und Bereinigungsplan für die Module von CatchTrack V1.0.

Sie dient gleichzeitig als:

* To-do-Liste
* Modulreihenfolge
* Abhängigkeitsübersicht
* Datei-Inventar
* Entwicklungsfortschrittskontrolle
* Altlasten-/Löschliste
* Abnahmeprotokoll
* historische Referenz für den Entwicklungsstand

Der Plan wird während der Entwicklung fortlaufend aktualisiert.

Der tatsächliche Zustand des Projekts wird immer mit dem aktuellen
Stand des GitHub-Repositories abgeglichen.

⸻

2. VERBINDLICHE PROJEKTQUELLEN

Für Entscheidungen gilt folgende Priorität:

1. PROJECT_RULES.md
2. aktueller GitHub-Dateistand
3. PROJECT_MODULE_PLAN.md
4. PROJECT_KNOWLEDGE.md
5. PROJECT_ARCHITECTURE.md
6. PROJECT_TEST_PLAN.md
7. AI_CONTEXT.md
8. Git-Commit-Historie
9. frühere Chat-Verläufe

GitHub ist die technische Referenz für den tatsächlich vorhandenen Code.

Die Git-Historie wird zur zeitlichen Einordnung verwendet.

Ein vorhandener Commit bedeutet nicht automatisch, dass eine Datei
zu diesem Zeitpunkt funktional fertiggestellt wurde.

⸻

3. ARBEITSWEISE

3.1 Rollenverteilung

ChatGPT / GitHub-Connector

ChatGPT übernimmt:

* Lesen des GitHub-Repositories
* Analyse vorhandener Dateien
* Analyse von Abhängigkeiten
* Ermittlung des Entwicklungsstands
* Erstellung vollständiger Dateien
* Erstellung von Ersatzdateien
* technische Planung
* Prüfung nach erfolgten Änderungen
* Aktualisierung des Arbeitsplans auf Basis des GitHub-Stands
* Prüfung der Commit-Historie
* Abgleich von Projektstatus und tatsächlichem Repository-Zustand

Working Copy

Die tatsächlichen Änderungen am Projekt werden durch den Benutzer
über Working Copy vorgenommen.

Working Copy ist der operative Schreibweg zum GitHub-Repository.

Der GitHub-Zugriff von ChatGPT wird für die Projektarbeit als
Referenz- und Prüfzugriff verwendet.

Es ist nicht notwendig, in späteren Antworten darauf hinzuweisen,
dass ChatGPT keine Schreibänderungen vorgenommen hat.

⸻

4. GRUNDREGEL FÜR BESTEHENDE DATEIEN

Eine vorhandene Datei wird niemals allein aufgrund ihres Dateinamens
als fertig betrachtet.

Für jede vorhandene Datei ist zu prüfen:

* tatsächlicher Inhalt
* tatsächliche Verwendung
* Imports
* Exports
* Referenzen
* Einbindung in HTML
* Einbindung über Module/Loader
* Verwendung durch Core
* Verwendung durch Services
* Verwendung durch andere Module
* Datenbankabhängigkeiten
* Git-Historie
* tatsächlicher Funktionsumfang

Eine alte Datei kann daher sein:

* MASTER / fertig
* funktional und weiter auszubauen
* Grundgerüst
* Platzhalter
* Altversion
* unbenutzt
* Altlast
* Löschkandidat

⸻

5. STATUSSYSTEM

Folgende Statuswerte werden verbindlich verwendet:

Status
Bedeutung

TODO
noch nicht begonnen

ANALYSE
Bestand wird untersucht

SKELETT
Grundstruktur vorhanden

IN ARBEIT
funktionale Entwicklung läuft

ABHÄNGIG
wartet auf anderes Modul / Funktion

TEST
Entwicklung abgeschlossen, Tests laufen

MASTER
vollständig fertig und freigegeben

ALT
alte Version / nicht mehr Bestandteil der neuen Architektur

LÖSCHKANDIDAT
als unbenutzt identifiziert, Löschung noch nicht freigegeben

ZUR LÖSCHUNG FREIGEGEBEN
Löschung nach erfolgreicher Prüfung erlaubt

GELÖSCHT
aus dem Projekt entfernt

⸻

6. DATEI-STATUS

Für jede Datei wird zusätzlich unterschieden:

MASTER

Die Datei gehört zur aktuellen Architektur und ist funktional
abgeschlossen.

ACTIVE

Die Datei wird weiterhin benötigt, ist aber noch nicht vollständig
fertig.

LEGACY

Die Datei stammt aus einer älteren Projektversion oder Architektur.

UNUSED

Die Datei ist vorhanden, wird aber nachweislich nicht verwendet.

DELETE CANDIDATE

Die Datei kann nach erfolgreicher Abhängigkeitsprüfung entfernt werden.

⸻

7. STEP 1

ABGESCHLOSSEN

Der definierte Abschluss von STEP 1 ist das Weather-Modul.

Gemäß PROJECT_RULES.md beginnt STEP 2 nach dem Weather-Meilenstein.

Weather wird deshalb nicht automatisch erneut entwickelt.

Eine spätere Änderung an Weather erfolgt nur bei:

* ausdrücklich angeforderter Änderung
* notwendiger Fehlerkorrektur
* nachgewiesener Integrationsnotwendigkeit

⸻

8. STEP 2 – MODULREALISIERUNG

STEP 2 dient dem vollständigen Aufbau der noch nicht fertiggestellten
Module.

Die Reihenfolge richtet sich NICHT ausschließlich nach Alphabet.

Entscheidend sind:

1. Datenbankabhängigkeiten
2. Core-Abhängigkeiten
3. gemeinsame Services
4. Modulabhängigkeiten
5. Datenfluss
6. Benutzerworkflow
7. Integrationsaufwand
8. Testbarkeit

Vor jedem Modul erfolgt eine konkrete Datei- und
Abhängigkeitsprüfung.

Erst danach beginnt die eigentliche Implementierung.

⸻

9. TATSÄCHLICHER MODULBESTAND AUF GITHUB

Am 09.08.2026 wurden im Verzeichnis:

modules/

folgende 21 Modulordner festgestellt:

1. admin
2. ai
3. backup
4. bluetooth
5. catchbook
6. catches
7. conditions
8. equipment
9. export
10. fishDatabase
11. gps
12. leaderboard
13. maps
14. moon
15. photos
16. records
17. safety
18. settings
19. start
20. statistics
21. tides
22. waters
23. weather

Korrektur zum bisherigen Plan:

Das tatsächliche Verzeichnis für die Fischdatenbank lautet:

modules/fishDatabase/

Nicht:

modules/fish/

Die Schreibweise fishDatabase ist Bestandteil der aktuellen
Repository-Struktur und muss beibehalten werden.

⸻

10. GRUPPE A – GRUNDDATEN

Diese Module bilden die Datenbasis für viele andere Module.

A1 – FISH DATABASE

Pfad:

modules/fishDatabase/

Aufgaben:

* Fischartenverwaltung
* Datenbankanbindung
* Seed-Daten verwenden
* Suche
* Auswahl
* Bearbeitung
* Anzeige
* Übergabe an Catches
* Sprachabhängige Namen
* Pflege von Fisch-Stammdaten

Abhängigkeiten:

* Database
* Storage
* Language Manager

Aktuell vorhandene Dateien:

* fishDatabase.html
* fishDatabase.css
* fishDatabase.js
* module.json

Aktueller Status:

SKELETT / BESTAND PRÜFEN

Besonderer Befund:

fishDatabase.js enthält bereits funktionale Datenbankzugriffe
auf die Tabellen:

* fish
* fish_names

und verwendet:

* CatchTrackDatabase
* CatchTrackSettings.language

Die Datei ist daher nicht als leere Platzhalterdatei zu behandeln.

Vor der Implementierung müssen alle vier vorhandenen Dateien
vollständig analysiert und gegen Core, Database, Language Manager,
Module Manager und tatsächliche Datenbankstruktur geprüft werden.

Das Modul ist der vorgesehene erste Kandidat für STEP 2.

⸻

A2 – EQUIPMENT

Pfad:

modules/equipment/

Aufgaben:

* Angelgerät
* Ruten
* Rollen
* Schnüre
* Haken
* Köder
* sonstiges Equipment
* Zuordnung zu Fängen

Abhängigkeiten:

* Database
* Storage
* Catches

Status:

SKELETT

⸻

A3 – WATERS

Pfad:

modules/waters/

Aufgaben:

* Gewässerverwaltung
* Gewässerdetails
* GPS-Koordinaten
* Gewässertyp
* Zuordnung von Fängen
* spätere Verbindung mit Karten/GPS

Abhängigkeiten:

* Database
* GPS
* Maps
* Catches

Status:

SKELETT

⸻

11. GRUPPE B – ERFASSUNG

B1 – CATCHES

Pfad:

modules/catches/

Bestehende Funktionalität ist vorhanden.

Ziel:

* vollständige Fangerfassung
* Fischart
* Gewicht
* Länge
* Datum/Zeit
* Gewässer
* Position
* Wetter
* Gezeiten
* Mond
* Köder
* Equipment
* Fotos
* Notizen
* Bedingungen

Abhängigkeiten:

* Fish Database
* Waters
* Equipment
* GPS
* Weather
* Tides
* Moon
* Photos
* Conditions
* Database

Status:

ACTIVE

Bestehende funktionierende Bestandteile erhalten.

⸻

B2 – CATCHBOOK

Pfad:

modules/catchbook/

Aufgaben:

* Fänge anzeigen
* suchen
* filtern
* sortieren
* Detailansicht
* Fang bearbeiten
* Fang löschen
* Übergang zu Statistiken

Abhängigkeiten:

* Catches
* Database
* Statistics

Status:

ACTIVE

⸻

12. GRUPPE C – STANDORT UND UMWELT

C1 – GPS

Pfad:

modules/gps/

Aufgaben:

* Standortermittlung
* Koordinaten
* Genauigkeit
* Standort speichern
* Übergabe an Catch
* Übergabe an Waters
* Übergabe an Maps

Abhängigkeiten:

* Browser Geolocation API
* Catches
* Waters
* Maps

Status:

ACTIVE

⸻

C2 – MAPS

Pfad:

modules/maps/

Aufgaben:

* Kartenanzeige
* Fangpositionen
* Gewässerpositionen
* aktuelle Position
* Navigation/Positionsdarstellung

Abhängigkeiten:

* GPS
* Waters
* Catches

Status:

SKELETT

⸻

C3 – CONDITIONS

Pfad:

modules/conditions/

Aufgaben:

* Angelbedingungen
* Wasserbedingungen
* Wind
* Strömung
* Sicht
* Temperatur
* manuelle Bedingungen
* Zuordnung zum Fang

Abhängigkeiten:

* Catches
* Weather
* Waters

Status:

SKELETT

⸻

C4 – TIDES

Pfad:

modules/tides/

Aufgaben:

* Gezeiten
* Hochwasser
* Niedrigwasser
* Zeitpunkte
* Höhe
* Zuordnung zum Fang

Abhängigkeiten:

* GPS / Waters
* externe Gezeitenquelle
* Catches

Status:

SKELETT / ALTBESTAND PRÜFEN

⸻

C5 – MOON

Pfad:

modules/moon/

Aufgaben:

* Mondphase
* Mondalter
* Beleuchtung
* relevante Fangzeitdaten
* Zuordnung zum Fang

Abhängigkeiten:

* Datum/Zeit
* Catches

Status:

ACTIVE

⸻

C6 – WEATHER

Pfad:

modules/weather/

STEP-1-Meilenstein.

Status:

MASTER / STEP-1-REFERENZ

Nicht erneut aufbauen.

⸻

13. GRUPPE D – MEDIEN UND ZUSATZDATEN

D1 – PHOTOS

Pfad:

modules/photos/

Aufgaben:

* Fotoaufnahme
* Dateiverwaltung
* Fangzuordnung
* mehrere Fotos pro Fang
* Anzeige
* Löschen
* Speicherung

Abhängigkeiten:

* Catches
* Storage
* Browser/File APIs

Status:

ACTIVE

⸻

D2 – SAFETY

Pfad:

modules/safety/

Aufgaben:

* Sicherheitsinformationen
* Notfallinformationen
* Standortinformationen
* relevante Warnungen

Abhängigkeiten:

* GPS
* Settings

Status:

SKELETT

⸻

14. GRUPPE E – AUSWERTUNG

E1 – STATISTICS

Pfad:

modules/statistics/

Aufgaben:

* Fangstatistik
* Fangzahlen
* Gewicht
* Durchschnitt
* Arten
* Gewässer
* Zeiträume
* Köder
* Equipment
* Wetter
* weitere Auswertungen

Abhängigkeiten:

* Catches
* Fish Database
* Waters
* Equipment
* Weather
* Tides
* Moon
* Conditions

Status:

ACTIVE

⸻

E2 – RECORDS

Pfad:

modules/records/

Aufgaben:

* persönliche Rekorde
* größte Fische
* schwerste Fänge
* längste Fänge
* Artenrekorde
* Gewässerrekorde

Abhängigkeiten:

* Catches
* Fish Database
* Statistics

Status:

SKELETT

⸻

E3 – LEADERBOARD

Pfad:

modules/leaderboard/

Aufgaben:

* Ranglisten
* Rekordvergleich
* Zeitraumfilter
* Artenvergleich
* Gewässervergleich

Abhängigkeiten:

* Records
* Statistics
* Catches

Status:

SKELETT

⸻

15. GRUPPE F – SYSTEMFUNKTIONEN

F1 – SETTINGS

Pfad:

modules/settings/

Aufgaben:

* Benutzereinstellungen
* Sprache
* Theme
* Einheiten
* Standortoptionen
* Datenoptionen
* Moduloptionen

Abhängigkeiten:

* Core
* Language Manager
* Storage

Status:

ACTIVE

⸻

F2 – EXPORT

Pfad:

modules/export/

Aufgaben:

* JSON Export
* CSV Export
* vollständiger Datenexport
* optional selektiver Export

Abhängigkeiten:

* Database
* Storage

Status:

SKELETT

⸻

F3 – BACKUP

Pfad:

modules/backup/

Aufgaben:

* vollständiges Backup
* Wiederherstellung
* Validierung
* Backup-Dateien
* Importkontrolle

Abhängigkeiten:

* Database
* Storage
* Export

Status:

ACTIVE / AUSBAU

⸻

F4 – BLUETOOTH

Pfad:

modules/bluetooth/

Aufgaben:

* Bluetooth-Geräte
* Verbindung
* Geräteverwaltung
* Sensordaten
* spätere Erweiterbarkeit

Abhängigkeiten:

* Browser Bluetooth API
* Settings
* ggf. externe Geräte

Status:

SKELETT

⸻

F5 – AI

Pfad:

modules/ai/

Aufgaben:

* spätere KI-Funktionen
* Fangdatenanalyse
* Empfehlungen
* Mustererkennung
* Auswertung

Abhängigkeiten:

* Catches
* Statistics
* Weather
* Conditions
* Fish Database

Status:

SKELETT

AI wird erst nach ausreichender Datenbasis sinnvoll vollständig
implementiert.

⸻

16. GRUPPE G – ADMINISTRATION

G1 – START

Pfad:

modules/start/

Aufgaben:

* Startoberfläche
* Modulübersicht
* Status
* Navigation

Status:

ACTIVE

⸻

G2 – ADMIN

Pfad:

modules/admin/

Aufgaben:

* Systemverwaltung
* Diagnose
* Modulstatus
* Datenbankstatus
* Wartungsfunktionen
* Runtime-Status
* Fehlerdiagnose

Status:

SKELETT / ACTIVE

⸻

17. MODULABHÄNGIGKEITEN

Vereinfachte Hauptabhängigkeiten:

CORE
 │
 ├── Database
 ├── Storage
 ├── Language
 ├── Router
 ├── Runtime Status
 └── Module Manager
        │
        └── Module
              │
              ├── Fish Database
              │
              ├── Equipment
              │
              ├── Waters
              │     ├── GPS
              │     └── Maps
              │
              ├── Catches
              │     ├── Fish Database
              │     ├── Equipment
              │     ├── Waters
              │     ├── GPS
              │     ├── Weather
              │     ├── Tides
              │     ├── Moon
              │     ├── Conditions
              │     └── Photos
              │
              ├── Catchbook
              │
              ├── Statistics
              │     └── Records
              │           └── Leaderboard
              │
              ├── Export
              │     └── Backup
              │
              ├── Settings
              │
              ├── Safety
              │
              ├── Bluetooth
              │
              └── AI

Diese Darstellung ist eine Arbeitsabhängigkeit und wird beim
tatsächlichen Implementieren anhand des Codes überprüft und
gegebenenfalls angepasst.

⸻

18. DATEIEN JE MODUL

Als erwartete Standardstruktur wird zunächst geprüft:

modules/<module>/
├── module.json
├── <module>.html
├── <module>.js
└── <module>.css

Dies ist KEINE automatische Aussage, dass jede dieser Dateien
benötigt wird.

Jede Datei wird einzeln geprüft.

Insbesondere module.json wird auf tatsächliche Verwendung geprüft.

Wenn eine Datei:

* nicht importiert wird
* nicht geladen wird
* nicht vom Module Manager verwendet wird
* keine Runtime-Funktion bereitstellt
* nicht von einem anderen Modul benötigt wird

wird sie als mögliche Altlast markiert.

Die tatsächliche Dateistruktur auf GitHub hat Vorrang vor diesem
Standardschema.

⸻

19. AKTUELLE MODULE.JSON-INTEGRATION

Die aktuelle:

config/modules.json

enthält eine zentrale Moduldefinition.

Dort werden unter anderem:

* Modulname
* Anzeigename
* Pfad
* HTML-Datei
* CSS-Datei
* JS-Datei
* Initializer
* enabled-Status

definiert.

Daraus folgt:

Eine module.json darf NICHT allein deshalb als Altlast betrachtet
werden, weil sie nicht in config/modules.json aufgeführt ist.

Die tatsächliche Verwendung muss über:

* Module Manager
* Module Installer
* dynamische Loader
* direkte Imports
* sonstige Referenzen

geprüft werden.

⸻

20. ALTlastenprüfung

Vor jeder Löschung müssen folgende Punkte geprüft werden:

* globale Suche nach Dateiname
* globale Suche nach Funktionen
* HTML-Referenzen
* JavaScript-Imports
* dynamische Imports
* Module Manager
* Module Installer
* Router
* Config
* modules.json
* Service-Abhängigkeiten
* Core-Abhängigkeiten
* Datenbankreferenzen
* Dokumentation
* Tests
* Git-Historie

Erst danach darf der Status auf:

ZUR LÖSCHUNG FREIGEGEBEN

gesetzt werden.

⸻

21. GEPLANTE LÖSCHLISTE

Diese Liste wird zunächst bewusst vorläufig geführt.

Noch nicht freigegebene Kandidaten:

Datei/Ordner
Grund
Status

alte module.json-Dateien
mögliche Altarchitektur
PRÜFEN

alte HTML-Dateien
mögliche Vorgängerversion
PRÜFEN

alte JS-Dateien
mögliche Vorgängerversion
PRÜFEN

nicht referenzierte CSS-Dateien
mögliche Altlast
PRÜFEN

Keine Datei darf allein aufgrund dieses Plans gelöscht werden.

⸻

22. MODUL-ABNAHME

Ein Modul gilt erst als MASTER, wenn:

* alle vorgesehenen Funktionen implementiert sind
* Datenbankzugriff funktioniert
* Speichermechanismus funktioniert
* Sprache berücksichtigt wird
* Modul korrekt geladen wird
* Navigation funktioniert
* vorhandene Core-Schnittstellen verwendet werden
* keine unnötige Parallelarchitektur eingeführt wurde
* Abhängigkeiten funktionieren
* Fehlerfälle behandelt werden
* mobile Darstellung funktioniert
* vorhandene Altdateien geprüft wurden
* Löschkandidaten dokumentiert wurden
* Modul erfolgreich getestet wurde
* Runtime-Status geprüft wurde
* Error-Log geprüft wurde

⸻

23. DATEI-ABNAHME

Eine Datei gilt als fertig, wenn:

* sie Bestandteil der aktuellen Architektur ist
* sie vollständig implementiert ist
* sie keine Platzhalterfunktion mehr enthält
* sie keine unnötigen alten Strukturen enthält
* ihre Abhängigkeiten korrekt sind
* sie mit dem aktuellen Datenmodell funktioniert
* sie mit dem Module Manager kompatibel ist
* sie keine bekannten offenen Fehler enthält

⸻

24. ÄNDERUNGSPROTOKOLL

Jede abgeschlossene Entwicklungsstufe wird hier dokumentiert.

Format:

Datum:
Modul:
Dateien:
Status vorher:
Status nachher:
Abhängigkeiten:
Altlasten geprüft:
Löschkandidaten:
Git-Commit:
Bemerkungen:

Beispiel:

Datum: DD.MM.YYYY
Modul: Fish Database
Dateien: ...
Status vorher: SKELETT
Status nachher: MASTER
Abhängigkeiten: Database, Storage, Language
Altlasten geprüft: JA
Löschkandidaten: ...
Git-Commit: ...
Bemerkungen: ...

⸻

25. FORTSCHRITTSREGEL

Nach jeder abgeschlossenen Entwicklungsstufe:

1. Benutzer übernimmt die Dateien über Working Copy.
2. Benutzer commitet/pusht nach GitHub.
3. GitHub wird erneut eingelesen.
4. tatsächlicher Dateistand wird geprüft.
5. Commit-Datum wird ermittelt.
6. Änderungen werden mit diesem Plan abgeglichen.
7. erledigte Punkte werden auf MASTER gesetzt.
8. nicht mehr benötigte Dateien werden als Löschkandidaten dokumentiert.
9. AI_CONTEXT.md wird auf den neuen Übergabepunkt aktualisiert.
10. erst danach beginnt die nächste Entwicklungsstufe.

⸻

26. WICHTIGE REGEL ZUR HISTORIE

Das Änderungsdatum einer Datei dient als Kontrollinformation.

Es entscheidet jedoch nicht allein über den Fertigstellungsstatus.

Maßgeblich ist:

GitHub-Dateistand
+
Dateiinhalt
+
Referenzen
+
Abhängigkeiten
+
Git-Historie
+
Projektregeln
+
Runtime-/Teststatus

Erst die Kombination dieser Informationen bestimmt den tatsächlichen
Status.

⸻

27. AKTUELLER PLANSTATUS

STEP 1:

ABGESCHLOSSEN

Weather:

MASTER / STEP-1-MEILENSTEIN

STEP 2:

BEREIT FÜR MODULENTWICKLUNG

Aktuell noch nicht vollständig fertiggestellte Module:

* Fish Database
* Equipment
* Waters
* Catches
* Catchbook
* GPS
* Maps
* Conditions
* Tides
* Moon
* Photos
* Safety
* Statistics
* Records
* Leaderboard
* Settings
* Export
* Backup
* Bluetooth
* AI
* Start
* Admin

Diese Liste beschreibt den Entwicklungsbereich und bedeutet nicht,
dass sämtliche vorhandenen Dateien dieser Module neu erstellt werden
müssen.

⸻

28. AKTUELLER ERSTER ENTWICKLUNGSKANDIDAT

Modul:

FISH DATABASE

Pfad:

modules/fishDatabase/

Begründung:

* grundlegende Stammdatenbasis
* geringe direkte Modulabhängigkeiten
* Datenbanktabellen bereits vorhanden
* Seed-Daten vorhanden
* aktueller Code bereits vorhanden
* Catches benötigt die Fischdaten
* spätere Module können darauf aufbauen

Vor Beginn der Implementierung sind vollständig zu prüfen:

* fishDatabase.html
* fishDatabase.css
* fishDatabase.js
* module.json
* config/modules.json
* core/moduleManager.js
* core/moduleInstaller.js
* core/database.js
* core/storageManager.js
* core/languageManager.js
* database/schema.sql
* database/fish_seed.sql
* database/fish_names_seed.sql
* relevante Git-Commits

Erst nach dieser Prüfung wird entschieden, welche Dateien:

* MASTER übernommen werden können
* vollständig ersetzt werden müssen
* neu erstellt werden müssen
* als Altlast markiert werden
* später gelöscht werden können

⸻

29. NÄCHSTER ENTWICKLUNGSSCHRITT

Vor Beginn der eigentlichen Programmierung des ersten Moduls wird
eine vollständige Datei-/Abhängigkeitsprüfung durchgeführt.

Dabei wird festgestellt:

* welche Dateien bereits vorhanden sind
* welche davon verwendbar sind
* welche ersetzt werden müssen
* welche neu erstellt werden müssen
* welche Funktionen fehlen
* welche Datenbanktabellen benötigt werden
* welche Core-/Service-Funktionen benötigt werden
* welche anderen Module benötigt werden
* welche alten Dateien später gelöscht werden können

Erst danach wird das Modul vollständig implementiert.

⸻

30. ARBEITSPRINZIP

Keine unnötige Neuentwicklung.

Keine parallele Altarchitektur.

Keine halbfertigen Ersatzdateien.

Keine Löschung ohne Abhängigkeitsprüfung.

Keine Änderung eines abgeschlossenen Masters ohne ausdrücklichen
Grund.

Jede fertige Entwicklungsstufe muss anhand des GitHub-Stands später
eindeutig nachvollziehbar sein.

Nach Möglichkeit werden bei Änderungen vollständige Ersatzdateien
bereitgestellt.

⸻

31. ZIEL

Am Ende von STEP 2 muss eindeutig nachvollziehbar sein:

Welche Module existieren?

Welche Module sind MASTER?

Welche Dateien gehören tatsächlich zur aktuellen Architektur?

Welche Dateien sind Altlasten?

Welche Dateien wurden gelöscht?

Welche Abhängigkeiten bestehen?

Welche Datenbankfunktionen werden verwendet?

Wann wurde jedes Modul fertiggestellt?

Welcher Git-Commit enthält die Fertigstellung?

Damit muss ein späteres erneutes Einlesen dieses Dokuments zusammen
mit dem aktuellen GitHub-Repository ausreichen, um den
Projektfortschritt eindeutig zu rekonstruieren.

⸻

32. STATUS

Plan aktualisiert am:

09.08.2026

STEP 1 – Weather:

ABGESCHLOSSEN

STEP 2 – Modulrealisierung:

BEREIT

Aktueller Fokus:

FISH DATABASE

Aktueller Arbeitsschritt:

Vollständige Bestands-, Datei- und Abhängigkeitsprüfung des
Fish-Database-Moduls.

Noch keine neue Moduldatei wird erstellt, bevor diese Prüfung
abgeschlossen ist.

Nächster Schritt nach der Prüfung:

Festlegung der vollständigen Masterdateien für Fish Database.

Danach:

Implementierung
→ Working Copy
→ GitHub Commit
→ GitHub-Prüfung
→ Statusaktualisierung
→ AI_CONTEXT-Aktualisierung
→ nächstes Modul.