CatchTrack V1.0 – PROJECT MODULE PLAN

Dateiname: PROJECT_MODULE_PLAN.md
Projekt: CatchTrack V1.0
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main
Planstatus: Initialfassung
Plan erstellt: 09.08.2026

⸻

1. Zweck dieser Datei

Diese Datei ist der verbindliche chronologische Entwicklungs-, Integrations- und Bereinigungsplan für die Module von CatchTrack V1.0.

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

Der tatsächliche Zustand des Projekts wird immer mit dem aktuellen Stand des GitHub-Repositories abgeglichen.

⸻

2. Verbindliche Projektquellen

Für Entscheidungen gilt folgende Priorität:

1. PROJECT_RULES.md
2. aktueller GitHub-Dateistand
3. PROJECT_MODULE_PLAN.md
4. PROJECT_KNOWLEDGE.md
5. Git-Commit-Historie
6. frühere Chat-Verläufe

GitHub ist die technische Referenz für den tatsächlich vorhandenen Code.

Die Git-Historie wird zur zeitlichen Einordnung verwendet.

Ein vorhandener Commit bedeutet nicht automatisch, dass eine Datei zu diesem Zeitpunkt funktional fertiggestellt wurde.

⸻

3. Arbeitsweise

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

Working Copy

Die tatsächlichen Änderungen am Projekt werden durch den Benutzer über Working Copy vorgenommen.

Working Copy ist der operative Schreibweg zum GitHub-Repository.

Der GitHub-Zugriff von ChatGPT wird für die Projektarbeit als Referenz- und Prüfzugriff verwendet.

Es ist nicht notwendig, in späteren Antworten darauf hinzuweisen, dass ChatGPT keine Schreibänderungen vorgenommen hat.

⸻

4. Grundregel für bestehende Dateien

Eine vorhandene Datei wird niemals allein aufgrund ihres Dateinamens als fertig betrachtet.

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

5. Statussystem

Folgende Statuswerte werden verbindlich verwendet:

Status	Bedeutung
TODO	noch nicht begonnen
ANALYSE	Bestand wird untersucht
SKELETT	Grundstruktur vorhanden
IN ARBEIT	funktionale Entwicklung läuft
ABHÄNGIG	wartet auf anderes Modul / Funktion
TEST	Entwicklung abgeschlossen, Tests laufen
MASTER	vollständig fertig und freigegeben
ALT	alte Version / nicht mehr Bestandteil der neuen Architektur
LÖSCHKANDIDAT	als unbenutzt identifiziert, Löschung noch nicht freigegeben
ZUR LÖSCHUNG FREIGEGEBEN	Löschung nach erfolgreicher Prüfung erlaubt
GELÖSCHT	aus dem Projekt entfernt

⸻

6. Datei-Status

Für jede Datei wird zusätzlich unterschieden:

MASTER

Die Datei gehört zur aktuellen Architektur und ist funktional abgeschlossen.

ACTIVE

Die Datei wird weiterhin benötigt, ist aber noch nicht vollständig fertig.

LEGACY

Die Datei stammt aus einer älteren Projektversion oder Architektur.

UNUSED

Die Datei ist vorhanden, wird aber nachweislich nicht verwendet.

DELETE CANDIDATE

Die Datei kann nach erfolgreicher Abhängigkeitsprüfung entfernt werden.

⸻

7. STEP 1

Abgeschlossen

Der definierte Abschluss von STEP 1 ist das Weather-Modul.

Gemäß PROJECT_RULES.md beginnt STEP 2 nach dem Weather-Meilenstein.

Weather wird deshalb nicht automatisch erneut entwickelt.

Eine spätere Änderung an Weather erfolgt nur bei:

* ausdrücklich angeforderter Änderung
* notwendiger Fehlerkorrektur
* nachgewiesener Integrationsnotwendigkeit

⸻

8. STEP 2 – Modulrealisierung

STEP 2 dient dem vollständigen Aufbau der noch nicht fertiggestellten Module.

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

⸻

9. Geplante Modulgruppen

GRUPPE A – Grunddaten

Diese Module bilden die Datenbasis für viele andere Module.

A1 – Fish Database

Pfad:

modules/fish/

Aufgaben:

* Fischartenverwaltung
* Datenbankanbindung
* Seed-Daten verwenden
* Suche
* Auswahl
* Bearbeitung
* Anzeige
* Übergabe an Catches

Abhängigkeiten:

* Database
* Storage
* Language Manager

Status:

SKELETT

⸻

A2 – Equipment

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

A3 – Waters

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

10. GRUPPE B – Erfassung

B1 – Catches

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

B2 – Catchbook

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

11. GRUPPE C – Standort und Umwelt

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

C2 – Maps

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

C3 – Conditions

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

C4 – Tides

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

C5 – Moon

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

C6 – Weather

Pfad:

modules/weather/

STEP-1-Meilenstein.

Status:

MASTER / STEP-1-REFERENZ

Nicht erneut aufbauen.

⸻

12. GRUPPE D – Medien und Zusatzdaten

D1 – Photos

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

D2 – Safety

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

13. GRUPPE E – Auswertung

E1 – Statistics

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

E2 – Records

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

E3 – Leaderboard

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

14. GRUPPE F – Systemfunktionen

F1 – Settings

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

F2 – Export

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

F3 – Backup

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

F4 – Bluetooth

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

AI wird erst nach ausreichender Datenbasis sinnvoll vollständig implementiert.

⸻

15. GRUPPE G – Administration

G1 – Start

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

G2 – Admin

Pfad:

modules/admin/

Aufgaben:

* Systemverwaltung
* Diagnose
* Modulstatus
* Datenbankstatus
* Wartungsfunktionen

Status:

SKELETT / ACTIVE

⸻

16. MODULABHÄNGIGKEITEN

Vereinfachte Hauptabhängigkeiten:

CORE
 │
 ├── Database
 ├── Storage
 ├── Language
 ├── Router
 └── Module Manager
        │
        └── Module
              │
              ├── Fish Database
              ├── Equipment
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

Diese Darstellung ist eine Arbeitsabhängigkeit und wird beim tatsächlichen Implementieren anhand des Codes überprüft und gegebenenfalls angepasst.

⸻

17. DATEIEN JE MODUL

Für jedes Modul werden grundsätzlich folgende Bestandteile geprüft:

modules/<module>/
├── module.json
├── <module>.html
├── <module>.js
└── <module>.css

Dies ist KEINE automatische Aussage, dass jede dieser Dateien benötigt wird.

Jede Datei wird einzeln geprüft.

Insbesondere module.json wird auf tatsächliche Verwendung geprüft.

Wenn eine Datei:

* nicht importiert wird,
* nicht geladen wird,
* nicht vom Module Manager verwendet wird,
* keine Runtime-Funktion bereitstellt,
* nicht von einem anderen Modul benötigt wird,

wird sie als mögliche Altlast markiert.

⸻

18. ALTlastenprüfung

Vor jeder Löschung müssen folgende Punkte geprüft werden:

* globale Suche nach Dateiname
* globale Suche nach Funktionen
* HTML-Referenzen
* JavaScript-Imports
* dynamische Imports
* Module Manager
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

19. GEPLANTE LÖSCHLISTE

Diese Liste wird zunächst bewusst leer bzw. vorläufig geführt.

Noch nicht freigegebene Kandidaten

Datei/Ordner	Grund	Status
alte module.json-Dateien	mögliche Altarchitektur	PRÜFEN
alte HTML-Dateien	mögliche Vorgängerversion	PRÜFEN
alte JS-Dateien	mögliche Vorgängerversion	PRÜFEN
nicht referenzierte CSS-Dateien	mögliche Altlast	PRÜFEN

Keine Datei darf allein aufgrund dieses Plans gelöscht werden.

⸻

20. MODUL-ABNAHME

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

⸻

21. DATEI-ABNAHME

Eine Datei gilt als fertig, wenn:

* sie Bestandteil der aktuellen Architektur ist
* sie vollständig implementiert ist
* sie keine Platzhalterfunktion mehr enthält
* sie keine unnötigen alten Strukturen enthält
* ihre Abhängigkeiten korrekt sind
* sie mit dem aktuellen Datenmodell funktioniert
* sie mit dem Modul Manager kompatibel ist
* sie keine bekannten offenen Fehler enthält

⸻

22. ÄNDERUNGSPROTOKOLL

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

23. FORTSCHRITTSREGEL

Nach jeder abgeschlossenen Entwicklungsstufe:

1. Benutzer übernimmt die Dateien über Working Copy.
2. Benutzer commitet/pusht nach GitHub.
3. GitHub wird erneut eingelesen.
4. tatsächlicher Dateistand wird geprüft.
5. Commit-Datum wird ermittelt.
6. Änderungen werden mit diesem Plan abgeglichen.
7. erledigte Punkte werden auf MASTER gesetzt.
8. nicht mehr benötigte Dateien werden als Löschkandidaten dokumentiert.
9. erst danach beginnt die nächste Entwicklungsstufe.

⸻

24. WICHTIGE REGEL ZUR HISTORIE

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

Erst die Kombination dieser Informationen bestimmt den tatsächlichen Status.

⸻

25. AKTUELLER PLANSTATUS

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

Diese Liste beschreibt den Entwicklungsbereich und bedeutet nicht, dass sämtliche vorhandenen Dateien dieser Module neu erstellt werden müssen.

⸻

26. NÄCHSTER ENTWICKLUNGSSCHRITT

Vor Beginn der eigentlichen Programmierung wird für das erste Modul eine vollständige Datei-/Abhängigkeitsprüfung durchgeführt.

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

27. ARBEITSPRINZIP

Keine unnötige Neuentwicklung.

Keine parallele Altarchitektur.

Keine halbfertigen Ersatzdateien.

Keine Löschung ohne Abhängigkeitsprüfung.

Keine Änderung eines abgeschlossenen Masters ohne ausdrücklichen Grund.

Jede fertige Entwicklungsstufe muss anhand des GitHub-Stands später eindeutig nachvollziehbar sein.

⸻

28. ZIEL

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

Damit muss ein späteres erneutes Einlesen dieses Dokuments zusammen mit dem aktuellen GitHub-Repository ausreichen, um den Projektfortschritt eindeutig zu rekonstruieren.

⸻

29. STATUS

Initialer Plan erstellt am 09.08.2026.

STEP 2 – Modulrealisierung: BEREIT

Nächster Schritt: Modulreihenfolge anhand der tatsächlichen Abhängigkeiten und des aktuellen GitHub-Codes final bestätigen und anschließend das erste Modul vollständig bearbeiten.