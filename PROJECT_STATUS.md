# PROJECT_STATUS Version 1.0
# Updated: 2026-08-09
# CatchTrack – Project Status
## 1. Zweck
Diese Datei ist die zentrale Übersicht über den aktuellen
Entwicklungsstand von CatchTrack.
Sie dokumentiert:
- was bereits vorhanden ist
- was funktionsfähig ist
- was sich noch in Vorentwicklung befindet
- welche Fehler bekannt sind
- welche Arbeiten noch ausstehen
- welches Modul als Nächstes bearbeitet wird
Diese Datei ist eine Statusübersicht.
Die detaillierten Entwicklungsregeln befinden sich in:
- `AI_CONTEXT.md`
- `PROJECT_RULES.md`
- `PROJECT_KNOWLEDGE.md`
- `PROJECT_MODULE_PLAN.md`
—
# 2. Projekt
Repository:
`El-Ninjo1965/CatchTrack-V.1.0`
Branch:
`main`
Arbeitsweise:
```text
GitHub
  ↓
ChatGPT liest / analysiert
  ↓
vollständige Ersatzdateien
  ↓
Working Copy
  ↓
Commit
  ↓
GitHub-Prüfung

ChatGPT besitzt für dieses Projekt grundsätzlich keine
direkten Schreibrechte.

⸻

3. Gesamtstatus

Bereich	Status
Projektstruktur	vorhanden
Core-System	vorhanden
Runtime-System	vorhanden
Error Handler	vorhanden
Runtime Storage	vorhanden
LocalStorage-Persistenz	vorhanden
Runtime Error Log	vorhanden
Runtime Status	vorhanden
Weather-Modul	Vorentwicklung / aktueller Fokus
GPS	Vorentwicklung
Tide	Vorentwicklung
Moon	Vorentwicklung
Waters	Vorentwicklung
Equipment	Vorentwicklung
Fish Data	Vorentwicklung
Fish Database	Vorentwicklung
Catchbook	noch nicht fertig
Statistics	Vorentwicklung
Records / Hitparade	Vorentwicklung
vollständige Integration	noch offen

⸻

4. Aktuelle Entwicklungsstrategie

Die Entwicklung wird bewusst in zwei Gruppen aufgeteilt.

Gruppe A – unabhängige Module

Diese Module werden zuerst fertiggestellt:

1. Wetter
2. GPS
3. Tide
4. Moon
5. Waters
6. Equipment

Ziel:

eigenständig
↓
stabil
↓
getestet
↓
definierte Schnittstelle
↓
bereit für spätere Integration

⸻

Gruppe B – integrative Module

Diese Module werden danach bearbeitet:

1. Fish Data
2. Fish Database / Fischkarten
3. Catchbook / Fangbuch
4. Statistics
5. Records / Hitparade

Diese Module sollen die zuvor fertiggestellten Basisdaten
verwenden.

⸻

5. Warum diese Reihenfolge?

Die Datenmodule wie Wetter, GPS, Tide und Moon sind technisch
relativ unabhängig.

Das Fangbuch dagegen muss später zahlreiche Datenquellen
miteinander verbinden.

Beispiel:

Fang
 ├── Fisch
 ├── Datum
 ├── Uhrzeit
 ├── GPS
 ├── Gewässer
 ├── Wetter
 ├── Tide
 ├── Mond
 ├── Equipment
 ├── Köder
 ├── Fangmethode
 ├── Gewicht
 ├── Länge
 ├── Fotos
 └── Notizen

Deshalb werden zunächst die einzelnen Datenquellen stabil
entwickelt.

⸻

6. Runtime / Core

Vorhanden

core/
├── errorHandler.js
└── runtimeStorage.js

Zusätzlich:

runtime/
├── error.log
└── runtime_status.json

und:

localStorage.json

⸻

7. Runtime-Status

Das Runtime-System kann Fehler und Statusinformationen
persistieren.

Grundstruktur:

Fehler
 ↓
errorHandler
 ↓
runtimeStorage
 ↓
LocalStorage
 ↓
localStorage.json

Der Runtime-Bereich gilt grundsätzlich als vorhanden.

Eine vollständige technische Endabnahme erfolgt später,
wenn die einzelnen Module stabil integriert sind.

⸻

8. Bekannte Runtime-Fehler

Beim Testen wurden unter anderem Initializer-Fehler
protokolliert.

Beispiele:

Initializer nicht gefunden:
CatchTrackFishDatabaseModule
CatchTrackEquipmentModule
CatchTrackGPSModule
CatchTrackMapsModule
CatchTrackWatersModule
CatchTrackStatisticsModule
CatchTrackRecordsModule

Diese Fehler stammen überwiegend aus noch nicht fertig
entwickelten Vorentwicklungen.

Sie werden deshalb momentan nicht automatisch als
kritische Core-Fehler behandelt.

⸻

9. localStorage.json

localStorage.json ist vorhanden.

Sie dient als:

* Persistenz-Snapshot
* Runtime-Diagnose
* Fehlerreferenz
* Datenbank-/Anwendungsreferenz

Sie muss bei Änderungen am Runtime-/Storage-System
berücksichtigt werden.

Wenn der Benutzer eine aktualisierte localStorage.json
über Working Copy überträgt, ist diese Version die relevante
Diagnosegrundlage.

⸻

10. Weather-Modul

Aktueller Ordner:

modules/weather/
├── module.json
├── weather.js
├── weather.html
└── weather.css

Alle Dateinamen sind in Kleinschreibung.

Es existieren keine erforderlichen Varianten:

Weather.js
Weather.html
Weather.css
Weather.cs

Diese werden nicht als fehlende Dateien behandelt.

⸻

11. Weather – aktueller Entwicklungsstand

Das Weather-Modul ist der aktuelle Entwicklungsschwerpunkt.

Vorhanden:

* Moduldefinition
* JavaScript
* HTML
* CSS

Noch erforderlich:

* vollständige Funktionsprüfung
* Provider-Anbindung prüfen
* Standortermittlung prüfen
* Ortssuche prüfen
* Forecast prüfen
* Wetterdatenmodell prüfen
* Cache prüfen
* Fehlerbehandlung prüfen
* Schnittstelle für andere Module definieren
* Darstellung testen
* Runtime-Integration testen

⸻

12. Weather – Ziel

Das Wettermodul soll:

* aktuellen Standort automatisch verwenden
* alternative Orte suchen lassen
* mindestens 7 Tage Forecast anzeigen
* möglichst 10 Tage anzeigen
* Wetter grafisch darstellen
* Wetter-Symbole verwenden
* Temperatur anzeigen
* Luftdruck anzeigen
* Luftfeuchtigkeit anzeigen
* Niederschlag anzeigen
* Regenwahrscheinlichkeit anzeigen
* Windgeschwindigkeit anzeigen
* Windrichtung anzeigen
* weitere für das Fangbuch relevante Werte liefern

⸻

13. Weather – Standort

Standard:

GPS
 ↓
Latitude / Longitude
 ↓
Wetter für aktuellen Standort

Zusätzlich:

Ortssuche
 ↓
ausgewählter Ort
 ↓
Wetter für diesen Ort

Wetterort und tatsächlicher Fangort müssen getrennt bleiben.

⸻

14. Weather – Provider

Vorgesehener erster Provider:

Open-Meteo

Die Provider-Schicht soll austauschbar bleiben.

Langfristig soll der Admin-Bereich ermöglichen:

* Provider ändern
* API-URL ändern
* API-Key hinterlegen
* Forecast-Einstellungen ändern
* weitere Providerparameter konfigurieren

⸻

15. Weather – Cache

Vorgesehen ist ein Tagescache.

Regel:

Erster Abruf des Tages
        ↓
API
        ↓
Cache

Cache gültig bis:

00:00 Uhr Ortszeit

Zusätzlich:

* anderer Standort → eigener Cache
* manueller Refresh → Cache umgehen
* API-Ausfall → gültigen Cache verwenden
* kein Cache + API-Ausfall → Fehlerbehandlung

Der Cache ist keine Wetterhistorie.

⸻

16. Weather – Fangbuch-Integration

Das Wettermodul soll später einen strukturierten Datensatz
bereitstellen.

Beispiel:

Weather Module
      ↓
standardisierter Wetterdatensatz
      ↓
Catchbook

Beim Speichern eines Fangs werden die relevanten Wetterdaten
als Snapshot in den Fangdatensatz übernommen.

Damit entsteht die dauerhafte Wetterhistorie automatisch
über tatsächlich gespeicherte Fänge.

⸻

17. Weather – offene Arbeiten

Priorität 1

Aktuelle vier Weather-Dateien vollständig einlesen:

module.json
weather.js
weather.html
weather.css

Priorität 2

Bestehende Architektur analysieren.

Priorität 3

Provider-Anbindung prüfen.

Priorität 4

Standortermittlung prüfen.

Priorität 5

Ortssuche prüfen.

Priorität 6

Forecast prüfen.

Priorität 7

Wetterdatenmodell definieren bzw. stabilisieren.

Priorität 8

Tagescache implementieren bzw. prüfen.

Priorität 9

Runtime-/Error-Handling prüfen.

Priorität 10

öffentliche Weather-Schnittstelle definieren.

Priorität 11

Gesamttest.

⸻

18. GPS

Status:

Vorentwicklung

Zukünftige Aufgaben:

* aktuelle Position bestimmen
* Latitude / Longitude liefern
* Standortdaten standardisieren
* Berechtigung / Fehler behandeln
* Schnittstelle für andere Module
* Weather-Anbindung
* später Catchbook-Anbindung

⸻

19. Tide

Status:

Vorentwicklung

Zukünftige Aufgaben:

* Tide Provider prüfen
* API-Konfiguration
* Standortabhängigkeit
* aktuelle Tide
* kommende Tide
* Hochwasser
* Niedrigwasser
* Zeitpunkt
* Höhe
* Datenmodell
* Schnittstelle
* später Catchbook-Anbindung

⸻

20. Moon

Status:

Vorentwicklung

Zukünftige Aufgaben:

* Mondphase
* Beleuchtungsgrad
* Aufgang
* Untergang
* Standortabhängigkeit
* Datenmodell
* Schnittstelle
* später Catchbook-Anbindung

⸻

21. Waters

Status:

Vorentwicklung

Zukünftige Aufgaben:

* Gewässerverwaltung
* Gewässertypen
* Standorte
* Eigenschaften
* spätere Verbindung mit GPS
* spätere Verbindung mit Fangbuch

⸻

22. Equipment

Status:

Vorentwicklung

Equipment wird bewusst als eigenständiges Modul fertiggestellt,
bevor es in das Fangbuch integriert wird.

Geplante Bereiche:

* Ruten
* Rollen
* Schnüre
* Vorfächer
* Haken
* Köder
* Kunstköder
* Zubehör
* weitere Ausrüstung

Spätere Beziehung:

Equipment
    ↓
Catchbook

⸻

23. Fish Data

Status:

Vorentwicklung

Wird erst nach den unabhängigen Basis-Modulen fertiggestellt.

Geplante Daten:

* Name
* lokale Namen
* wissenschaftlicher Name
* Familie
* Beschreibung
* Bild
* Lebensraum
* Gewässertyp
* Tiefe
* Wassertemperatur
* Köder
* Fangmethode
* Fangzeit
* Saison
* Schonzeit
* Mindestgröße
* Größe
* Gewicht

⸻

24. Fish Database / Fischkarten

Status:

Vorentwicklung

Langfristiges Ziel:

Eine zentrale Fischdatenbank mit strukturierten Fischkarten.

Sie soll später vom Fangbuch verwendet werden.

Keine unnötige parallele Fertigstellung während der
Basis-Modulphase.

⸻

25. Catchbook / Fangbuch

Status:

Noch nicht fertiggestellt

Das Fangbuch ist bewusst zurückgestellt.

Geplante Integration:

GPS
Weather
Tide
Moon
Waters
Equipment
Fish Data
      ↓
   Catchbook

Geplante Fangdaten:

* Datum
* Uhrzeit
* GPS
* Gewässer
* Fisch
* Wetter
* Tide
* Mond
* Equipment
* Köder
* Fangmethode
* Gewicht
* Länge
* Fotos
* Notizen

⸻

26. Statistics

Status:

Vorentwicklung

Wird erst nach ausreichender Datenbasis aus dem Fangbuch
fertiggestellt.

Mögliche spätere Auswertungen:

* Anzahl Fänge
* Gewicht
* Länge
* Fischarten
* Gewässer
* Köder
* Fangmethoden
* Wetterbedingungen
* Tide
* Mond
* Equipment
* Zeiträume

⸻

27. Records / Hitparade

Status:

Vorentwicklung

Wird erst nach dem Fangbuch entwickelt.

Grundlage:

Catchbook
    ↓
Records
    ↓
Hitparade

⸻

28. Was aktuell NICHT gemacht wird

Solange die Basis-Module nicht fertig sind:

* keine vollständige Catchbook-Integration
* keine umfangreiche Fish Database-Integration
* keine vollständige Hitparade
* keine komplexen Statistiken
* keine parallele Fertigstellung aller Vorentwicklungen

⸻

29. Nächster konkreter Arbeitsschritt

Der nächste Arbeitsschritt ist:

WEATHER MODUL

Zuerst vollständig einlesen:

modules/weather/module.json
modules/weather/weather.js
modules/weather/weather.html
modules/weather/weather.css

Danach:

1. Architektur prüfen
2. bestehende Funktionen erfassen
3. fehlende Funktionen bestimmen
4. Abhängigkeiten prüfen
5. notwendige Änderungen planen
6. vollständige Ersatzdateien erstellen
7. Benutzer übernimmt Dateien über Working Copy
8. Commit prüfen
9. Weather-Modul testen
10. Fehler bereinigen
11. Weather als stabile Basis markieren

⸻

30. Statusdefinitionen

Status	Bedeutung
VORHANDEN	Datei/Modul existiert
VORENTWICKLUNG	Grundstruktur vorhanden, noch nicht fertig
IN ARBEIT	aktuell aktiv bearbeitet
GETESTET	Funktion erfolgreich getestet
STABIL	Modul fertig und als Datenquelle verwendbar
INTEGRATION OFFEN	Modul fertig, aber noch nicht mit anderen Modulen verbunden
ABGESCHLOSSEN	vollständig entwickelt und integriert

⸻

31. Abschlusskriterium für Basis-Module

Ein Basis-Modul gilt erst als STABIL, wenn:

* alle vorgesehenen Dateien vorhanden sind
* keine kritischen Initialisierungsfehler bestehen
* Runtime-Fehler korrekt behandelt werden
* Daten korrekt geliefert werden
* Datenmodell definiert ist
* öffentliche Schnittstelle vorhanden ist
* Fehlerfälle getestet wurden
* Cache-/Speicherverhalten geprüft wurde
* Benutzeroberfläche funktioniert
* keine unnötige Datenhistorie erzeugt wird

⸻

32. Abschlusskriterium für Integrationsmodule

Ein Integrationsmodul gilt erst als abgeschlossen, wenn:

* alle benötigten Basis-Module stabil sind
* Schnittstellen funktionieren
* Daten korrekt übernommen werden
* keine Daten dupliziert oder widersprüchlich gespeichert werden
* Runtime-/Error-System integriert ist
* persistierte Daten korrekt funktionieren
* vollständiger Funktionstest erfolgreich ist

⸻

33. Aktueller Projektpfad

WEATHER
   ↓
GPS
   ↓
TIDE
   ↓
MOON
   ↓
WATERS
   ↓
EQUIPMENT
   ↓
FISH DATA
   ↓
CATCHBOOK
   ↓
STATISTICS / HITPARADE

⸻

34. Aktueller Übergabepunkt

Aktuell bearbeiten: WEATHER

Der nächste Schritt nach dem Statusdokument ist daher nicht
Fish Database oder Catchbook.

Zuerst wird das vorhandene Weather-Modul vollständig
analysiert und stabilisiert.

⸻

Ende PROJECT_STATUS

:::