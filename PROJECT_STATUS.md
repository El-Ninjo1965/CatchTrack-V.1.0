# PROJECT_STATUS Version 1.1
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
- welche Module bereits als Datenquelle für spätere
  Integrationen vorbereitet sind
Diese Datei ist eine Statusübersicht.
Die detaillierten Entwicklungsregeln befinden sich in:
- `AI_CONTEXT.md`
- `PROJECT_RULES.md`
- `PROJECT_KNOWLEDGE.md`
- `PROJECT_MODULE_PLAN.md`
Der tatsächliche Repository-Stand wird zusätzlich anhand der
GitHub-Commit-Historie und der tatsächlich vorhandenen Dateien
geprüft.
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

ChatGPT besitzt für dieses Projekt grundsätzlich keine direkten
Schreibrechte.

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
Multilingualitäts-Konzept	festgelegt
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

Datenmodule wie Wetter, GPS, Tide und Moon sind technisch
relativ unabhängig.

Das Fangbuch muss dagegen später zahlreiche Datenquellen
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

6. Globale Mehrsprachigkeit

CatchTrack wird von Anfang an multilingual entwickelt.

Die Anwendung darf nicht auf Deutsch oder Englisch beschränkt
werden.

Jedes Modul muss später mehrsprachig nutzbar sein.

Die Sprache wird auf zwei Wegen bestimmt:

Automatisch

Die bevorzugte Sprache des Endgerätes bzw. Browsers wird
automatisch erkannt.

Manuell

Der Benutzer kann innerhalb der Anwendung eine Sprache auswählen.

Die manuelle Auswahl hat Vorrang vor der automatischen
Erkennung.

Gerätesprache
      ↓
automatische Sprache
      ↓
CatchTrack
oder:
Benutzer wählt Sprache
      ↓
manuelle Sprache
      ↓
CatchTrack

Die Spracheinstellung gilt grundsätzlich für die gesamte
Anwendung.

⸻

7. Zentrales Sprachsystem

Die einzelnen Module dürfen keine eigene, voneinander
unabhängige Sprachlogik entwickeln.

Langfristig wird ein zentrales Language-/i18n-System verwendet.

Es betrifft unter anderem:

* Menüs
* Buttons
* Überschriften
* Beschriftungen
* Hinweise
* Fehlermeldungen
* Statusmeldungen
* Dialoge
* Filter
* Einstellungen
* Auswahlwerte

Keine unnötig fest codierten Benutzertexte.

Die interne Datenstruktur bleibt sprachneutral.

Beispiel:

interner Wert:
pressure = 1013.2
Deutsch:
Luftdruck
English:
Pressure

Neue Module müssen bereits bei ihrer Erstellung für dieses
System vorbereitet werden.

⸻

8. Runtime / Core

Vorhanden:

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

9. Runtime-Status

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

Eine vollständige technische Endabnahme erfolgt später, wenn
die einzelnen Module stabil integriert sind.

⸻

10. Bekannte Runtime-Fehler

Beim Testen wurden unter anderem Initializer-Fehler
protokolliert.

Beispiele:

CatchTrackFishDatabaseModule
CatchTrackEquipmentModule
CatchTrackGPSModule
CatchTrackMapsModule
CatchTrackWatersModule
CatchTrackStatisticsModule
CatchTrackRecordsModule

Diese Fehler stammen überwiegend aus noch nicht fertig
entwickelten Vorentwicklungen.

Sie werden deshalb momentan nicht automatisch als kritische
Core-Fehler behandelt.

Vor einer endgültigen Bewertung wird geprüft:

* ob das Modul bereits fertig sein soll
* ob der Initializer tatsächlich erwartet wird
* ob die Datei vorhanden ist
* ob das Modul bereits eingebunden sein muss
* ob der Fehler durch die aktuelle Testaktion ausgelöst wurde

⸻

11. localStorage.json

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

12. Weather-Modul

Aktueller Ordner:

modules/weather/
├── module.json
├── weather.js
├── weather.html
└── weather.css

Alle Dateinamen sind kleingeschrieben.

Nicht vorhandene Varianten wie:

Weather.js
Weather.html
Weather.css
Weather.cs

werden nicht als fehlende Dateien behandelt.

⸻

13. Weather – aktueller Entwicklungsstand

Das Weather-Modul ist der aktuelle Entwicklungsschwerpunkt.

Vorhanden:

* Moduldefinition
* JavaScript
* HTML
* CSS

Noch vollständig zu prüfen bzw. fertigzustellen:

* Provider-Anbindung
* Standortermittlung
* Ortssuche
* Forecast
* Wetterdatenmodell
* Cache
* Fehlerbehandlung
* öffentliche Schnittstelle
* Darstellung
* Runtime-Integration
* vollständiger Test

⸻

14. Weather – Ziel

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

15. Weather – Standort

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

Ein manuell ausgewählter Wetterort darf den späteren Fangort
nicht verändern.

⸻

16. Weather – Provider

Vorgesehener erster Provider:

Open-Meteo

Die Provider-Schicht soll austauschbar bleiben.

Langfristig soll der Admin-Bereich ermöglichen:

* Provider ändern
* API-URL ändern
* API-Key hinterlegen
* Forecast-Einstellungen ändern
* weitere Providerparameter konfigurieren

Open-Meteo benötigt zunächst keinen API-Key.

Die Architektur muss trotzdem optionale API-Keys unterstützen.

⸻

17. Weather – relevante Daten

Das interne Wetterdatenmodell soll mindestens die später für
das Fangbuch benötigten Werte unterstützen:

* Temperatur
* gefühlte Temperatur
* Wetterzustand
* Wettercode
* Wetter-Symbol
* Niederschlag
* Regenwahrscheinlichkeit
* Luftdruck
* Luftfeuchtigkeit
* Windgeschwindigkeit
* Windrichtung
* Windböen
* Bewölkung
* UV-Index
* Sonnenaufgang
* Sonnenuntergang
* Latitude
* Longitude
* Ortsname
* Zeitpunkt
* Provider

Nicht jeder interne Wert muss dauerhaft auf der Oberfläche
angezeigt werden.

⸻

18. Weather – Forecast

Mindestens:

7 Tage

Ziel:

10 Tage

Die Darstellung soll grafisch und übersichtlich erfolgen.

Die vom Provider gelieferten Wetter-Symbole sollen verwendet
werden, soweit technisch sinnvoll.

⸻

19. Weather – Cache

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

20. Weather – Datenmenge

Das Wettermodul soll keine unnötige dauerhafte Datenmenge
erzeugen.

Daher:

* nur aktuelle Daten beim Aufruf bzw. gültigen Tagescache
* keine unbegrenzte Wetterhistorie
* keine dauerhafte Speicherung kompletter API-Antworten
* dauerhafte Wetterdaten später nur im Zusammenhang mit
    gespeicherten Fängen

⸻

21. Weather – Fangbuch-Integration

Das Weather-Modul soll später einen standardisierten
Wetterdatensatz bereitstellen.

Weather Module
      ↓
standardisierter Wetterdatensatz
      ↓
Catchbook

Beim Speichern eines Fangs werden die relevanten Wetterdaten
als Snapshot in den Fangdatensatz übernommen.

Damit entsteht die dauerhafte Wetterhistorie über tatsächlich
gespeicherte Fänge.

⸻

22. Weather – öffentliche Schnittstelle

Andere Module sollen nicht auf interne Variablen oder
HTML-Elemente des Weather-Moduls zugreifen.

Es soll eine definierte öffentliche Schnittstelle geben.

Beispiel:

CatchTrackWeatherModule.getWeatherData()

Der konkrete Name richtet sich nach der bestehenden
CatchTrack-Architektur.

⸻

23. GPS

Status:

Vorentwicklung

Zukünftige Aufgaben:

* aktuelle Position bestimmen
* Latitude / Longitude liefern
* Standortdaten standardisieren
* Berechtigungen behandeln
* Fehler behandeln
* öffentliche Schnittstelle
* Weather-Anbindung
* spätere Catchbook-Anbindung
* multilingual nutzbar

⸻

24. Tide

Status:

Vorentwicklung

Zukünftige Aufgaben:

* Tide-Provider prüfen
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
* spätere Catchbook-Anbindung
* multilingual nutzbar

⸻

25. Moon

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
* spätere Catchbook-Anbindung
* multilingual nutzbar

⸻

26. Waters

Status:

Vorentwicklung

Zukünftige Aufgaben:

* Gewässerverwaltung
* Gewässertypen
* Standorte
* Eigenschaften
* Verbindung mit GPS
* spätere Verbindung mit Fangbuch
* multilingual nutzbar

⸻

27. Equipment

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

Auch Equipment muss vollständig multilingual vorbereitet sein.

⸻

28. Fish Data

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

29. Fish Database / Fischkarten

Status:

Vorentwicklung

Langfristiges Ziel:

Eine zentrale Fischdatenbank mit strukturierten Fischkarten.

Sie soll später vom Fangbuch verwendet werden.

Keine unnötige parallele Fertigstellung während der
Basis-Modulphase.

⸻

30. Catchbook / Fangbuch

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

Das Fangbuch soll die bereits entwickelten Module
zusammenführen und deren Funktionen nicht duplizieren.

⸻

31. Statistics

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

32. Records / Hitparade

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

33. Was aktuell NICHT gemacht wird

Solange die Basis-Module nicht stabil sind:

* keine vollständige Catchbook-Integration
* keine umfangreiche Fish-Database-Integration
* keine vollständige Hitparade
* keine komplexen Statistiken
* keine parallele Fertigstellung aller Vorentwicklungen

⸻

34. Nächster konkreter Arbeitsschritt

Aktuell:

WEATHER MODUL

Zuerst vollständig prüfen:

modules/weather/module.json
modules/weather/weather.js
modules/weather/weather.html
modules/weather/weather.css

Danach:

1. Architektur prüfen
2. bestehende Funktionen erfassen
3. fehlende Funktionen bestimmen
4. Abhängigkeiten prüfen
5. Datenmodell prüfen
6. Provider prüfen
7. Standort prüfen
8. Forecast prüfen
9. Cache prüfen
10. Runtime-/Error-Handling prüfen
11. öffentliche Schnittstelle definieren
12. vollständige Ersatzdateien erstellen
13. Benutzer übernimmt Dateien über Working Copy
14. Commit prüfen
15. Weather testen
16. Fehler bereinigen
17. Weather als stabile Basis markieren

⸻

35. Statusdefinitionen

Status	Bedeutung
VORHANDEN	Datei/Modul existiert
VORENTWICKLUNG	Grundstruktur vorhanden, noch nicht fertig
IN ARBEIT	aktuell aktiv bearbeitet
GETESTET	Funktion erfolgreich getestet
STABIL	Modul fertig und als Datenquelle verwendbar
INTEGRATION OFFEN	Modul fertig, aber noch nicht mit anderen Modulen verbunden
ABGESCHLOSSEN	vollständig entwickelt und integriert

⸻

36. Abschlusskriterium für Basis-Module

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
* Mehrsprachigkeit vorbereitet ist
* automatische Gerätesprache unterstützt werden kann
* manuelle Sprachauswahl unterstützt werden kann

⸻

37. Abschlusskriterium für Integrationsmodule

Ein Integrationsmodul gilt erst als abgeschlossen, wenn:

* alle benötigten Basis-Module stabil sind
* Schnittstellen funktionieren
* Daten korrekt übernommen werden
* keine Daten unnötig dupliziert werden
* keine widersprüchlichen Daten entstehen
* Runtime-/Error-System integriert ist
* persistierte Daten korrekt funktionieren
* vollständiger Funktionstest erfolgreich ist
* Mehrsprachigkeit vollständig berücksichtigt ist

⸻

38. Projektstatus und GitHub-Abgleich

PROJECT_STATUS.md beschreibt den dokumentierten Entwicklungsstand.

Der tatsächliche Stand muss zusätzlich anhand von:

1. GitHub-Commit-Historie
2. aktuellen Dateien
3. aktuellem Dateiinhalt
4. Runtime-/Teststatus
5. localStorage.json

geprüft werden.

Grundsatz:

Dokumentation
     +
GitHub-Historie
     +
aktuelle Dateien
     ↓
tatsächlicher Projektstand

Ein Eintrag in dieser Datei darf nicht allein als Beweis gelten,
dass eine Datei tatsächlich auf GitHub vorhanden oder fertig ist.

⸻

39. Änderungsprinzip

Auch diese Datei wird nicht unnötig komplett neu erfunden.

Vor einer Aktualisierung:

1. vorhandene PROJECT_STATUS.md einlesen
2. aktuelle Version feststellen
3. vorhandene Informationen erhalten
4. tatsächlichen GitHub-Stand berücksichtigen
5. neue Erkenntnisse integrieren
6. widersprüchliche Informationen korrigieren
7. Version erhöhen
8. Änderungsdatum aktualisieren
9. vollständige Datei ausgeben

Wenn die bestehende Struktur technisch keinen Sinn mehr ergibt,
darf eine vollständige Master-Version erstellt werden.

⸻

40. Aktueller Übergabepunkt

Aktueller Fokus:

Weather

Danach:

GPS
↓
Tide
↓
Moon
↓
Waters
↓
Equipment

Danach:

Fish Data
↓
Fish Database
↓
Catchbook
↓
Statistics
↓
Records / Hitparade

⸻

Ende PROJECT_STATUS

:::