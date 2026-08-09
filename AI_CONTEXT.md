# AI_CONTEXT Version 1.5
# Updated: 2026-08-09
# CatchTrack – AI Context
## Zweck
Diese Datei ist der zentrale Einstiegspunkt für ChatGPT/AI zur
Wiederaufnahme der CatchTrack-Entwicklung.
Wenn der Benutzer sagt:
„AI einlesen“
oder
„Lies die AI-Datei ein“
sollen zunächst diese Datei und anschließend alle darin
aufgeführten Referenzdateien eingelesen werden.
—
# 1. Verbindliche Projektregeln
Zuerst einlesen:
- `PROJECT_RULES.md`
Diese Datei definiert die verbindlichen Arbeitsregeln.
—
# 2. Aktueller Projektwissensstand
Einlesen:
- `PROJECT_KNOWLEDGE.md`
Diese Datei beschreibt den bekannten Projektstand,
Architektur, Entscheidungen und Übergabepunkte.
—
# 3. Modul- und Arbeitsplan
Einlesen:
- `PROJECT_MODULE_PLAN.md`
Diese Datei enthält:
- Modulreihenfolge
- zu erstellende Dateien
- bereits bearbeitete Dateien
- offene Dateien
- Abhängigkeiten
- Altlasten
- geplante Löschungen
- Bearbeitungsstatus
—
# 4. Runtime- und Teststatus
Einlesen:
- `runtime/runtime_status.json`
- `runtime/error.log`
- `localStorage.json`
Diese Dateien zeigen:
- aktuellen Laufzeitstatus
- Fehler
- Modulstatus
- Datenbank-Snapshot
- persistierte Runtime-Daten
`localStorage.json` ist eine wichtige Diagnose- und
Persistenzreferenz.
—
# 5. Projektstruktur
Die tatsächliche GitHub-Projektstruktur prüfen.
Besonders:
- `core/`
- `modules/`
- `config/`
- `database/`
- `runtime/`
- `libraries/`
Die tatsächliche Projektstruktur hat Vorrang vor älteren
Dokumentationen oder Annahmen.
—
# 6. GitHub-Referenz
Repository:
`El-Ninjo1965/CatchTrack-V.1.0`
Branch:
`main`
Bei Wiederaufnahme prüfen:
1. aktuellen Branch-Stand
2. letzten relevanten Commit
3. Commit-Datum
4. Commit-Nachricht
5. geänderte Dateien
6. relevante Diff-Informationen
Der Benutzer verwendet grundsätzlich den Dateinamen als
Commit-Namen.
Beispiel:
`fishData.js`
kann gleichzeitig der Commit-Name sein.
Bei Pfadangaben wird `main/` nicht als Bestandteil des
Dateipfades angegeben.
Beispiel:
Richtig:
`modules/weather/weather.js`
Nicht:
`main/modules/weather/weather.js`
—
# 7. GitHub-Verifikation
Wenn der Benutzer nach einer Dateiübertragung sagt:
„Prüfe, ob die Datei auf GitHub ist.“
gilt zunächst:
Die Datei wurde vom Benutzer vermutlich übertragen.
Prüfreihenfolge:
1. Commit-Historie prüfen
2. erwarteten Commit anhand des Dateinamens suchen
3. Commit-SHA und Commit-Inhalt prüfen
4. feststellen, ob die Datei Bestandteil des Commits ist
5. Datei anhand des tatsächlichen Repository-Pfades abrufen
Bei temporären GitHub-/Connector-Problemen bis zu vier
Abrufversuche direkt hintereinander durchführen.
Keine Zwischenmeldung und keine Rückfrage.
Wenn ein passender Commit die Datei eindeutig enthält,
ist die Übermittlung bestätigt, auch wenn der direkte
Dateiabruf vorübergehend fehlschlägt.
—
# 8. Schreibrechte
ChatGPT arbeitet im CatchTrack-Projekt grundsätzlich
lesend.
Der Benutzer verwendet Working Copy für Änderungen.
Daher:
- ChatGPT liest GitHub.
- ChatGPT analysiert GitHub.
- ChatGPT prüft Commits.
- ChatGPT erstellt keine direkten Repository-Änderungen,
  sofern keine bestätigte Schreibmöglichkeit vorhanden ist.
- Der Benutzer übernimmt Änderungen manuell über
  Working Copy.
- Danach wird der Commit von ChatGPT geprüft.
Bei fehlenden Schreibrechten niemals behaupten, eine Datei
sei geändert oder committed worden.
—
# 9. Vollständige Ersatzdateien
Der Benutzer bevorzugt vollständige Dateien.
Bei Änderungen bestehender Dateien:
- keine Patch-Fragmente
- keine Such-/Ersetzungsanweisungen
- keine unvollständigen Codeabschnitte
Stattdessen:
**immer die vollständige Ersatzdatei ausgeben.**
Das gilt besonders für:
- JavaScript
- HTML
- CSS
- JSON
- Markdown
- Konfigurationsdateien
- `AI_CONTEXT.md`
- `PROJECT_RULES.md`
- `PROJECT_KNOWLEDGE.md`
- `PROJECT_MODULE_PLAN.md`
Wenn `AI_CONTEXT.md` geändert wird, immer die komplette
Datei ausgeben.
—
# 10. Bestehende Dateien zuerst einlesen
**Dies ist eine verbindliche Regel für alle bestehenden
Projektdateien.**
Wenn eine vorhandene Datei geändert, erweitert, repariert
oder aktualisiert werden soll:
1. aktuelle Datei auf GitHub suchen
2. zugehörigen Commit prüfen
3. aktuelle Datei vollständig einlesen
4. vorhandenen Inhalt als Grundlage verwenden
5. bestehende Funktionen, Strukturen und Informationen
   erhalten
6. nur notwendige Änderungen oder Ergänzungen durchführen
7. vollständige aktualisierte Ersatzdatei ausgeben
Eine bestehende Datei darf nicht einfach durch eine neu
erstellte Kurzfassung ersetzt werden.
Insbesondere bei:
- `AI_CONTEXT.md`
- `PROJECT_RULES.md`
- `PROJECT_KNOWLEDGE.md`
- `PROJECT_MODULE_PLAN.md`
- Konfigurationsdateien
- Datenbankdateien
- Runtime-Dateien
- Moduldateien
muss der vorhandene Inhalt zuerst geprüft werden.
**Grundsatz:**
> Bestehende Datei aktualisieren, nicht neu erfinden.
Diese Regel gilt für **jede Projektdatei**, nicht nur für
den AI Context.
—
# 11. Verhalten nach „OK“
„OK“ bedeutet:
Der vorherige Schritt ist bestätigt.
Nicht erneut nachfragen.
Wenn danach eine Prüfung oder Analyse sinnvoll ist,
selbstständig durchführen.
Mehrere zusammengehörige Prüfungen sollen möglichst
in einem Arbeitsgang erledigt werden.
—
# 12. Grundprinzip der CatchTrack-Architektur
CatchTrack soll langfristig modular aufgebaut sein.
Module sollen möglichst:
- eigenständig funktionieren
- klar definierte Schnittstellen besitzen
- eine gemeinsame Datenbasis verwenden
- unabhängig testbar sein
- erweiterbar sein
- später über eine zentrale Admin-Oberfläche
  konfigurierbar sein
Die Architektur soll langfristig eher einem modularen
CMS/E-Commerce-System entsprechen als einer Sammlung
fest programmierter Einzelansichten.
Konfigurierbar sollen später insbesondere sein:
- Texte
- Beschriftungen
- Eingabefelder
- Feldtypen
- Kategorien
- Reihenfolgen
- Inhalte
- Aktivierung/Deaktivierung
- weitere Modulparameter
—
# 13. WICHTIGE ENTWICKLUNGSSTRATEGIE
Die Entwicklung wird bewusst in zwei Gruppen getrennt.
## Gruppe A – unabhängige Basis- und Datenmodule
Diese Module werden zuerst fertiggestellt.
Dazu gehören insbesondere:
- Wetter
- GPS
- Tide
- Mond
- Gewässer
- Equipment
- weitere eigenständige Datenmodule
Diese Module sollen zunächst:
1. eigenständig funktionieren
2. getestet werden
3. Fehler bereinigt werden
4. stabile Daten liefern
5. später als Datenquellen für andere Module dienen
—
## Gruppe B – integrative Module
Diese Module werden erst später entwickelt.
Dazu gehören:
- Fish Data
- Fischkarten
- Catchbook / Fangbuch
- Statistics
- Hitparade
- komplexe Verknüpfungen zwischen Fisch,
  Fang, Wetter, GPS, Tide, Mond, Gewässer und Equipment
—
# 14. VERBINDLICHE MODULREIHENFOLGE
Die aktuelle Entwicklungsreihenfolge lautet:
### 1. Wetter
Eigenständige Wetterdaten.
Später Datenquelle für Fangdaten.
### 2. GPS
Eigenständige Standortbestimmung.
Später Standortdaten für Fänge.
### 3. Tide
Eigenständige Gezeiteninformationen.
Später Verknüpfung mit Fangbedingungen.
### 4. Moon
Eigenständige Mond-/Mondphaseninformationen.
Später Verknüpfung mit Fangbedingungen.
### 5. Waters
Gewässerdaten.
Erst als eigenständiges Modul entwickeln.
### 6. Equipment
Verwaltung der verwendeten Angelausrüstung.
Zunächst unabhängig vom Fangbuch.
### 7. Fish Data
Fischdatenbank und Fischkarten.
Erst beginnen, wenn die vorherigen Datenquellen stabil
funktionieren.
### 8. Catchbook
Fangbuch.
Hier werden die vorher entwickelten Module miteinander
verbunden.
### 9. Statistics / Hitparade
Auswertung der vorhandenen Fangdaten.
—
# 15. VORHANDENE UNFERTIGE MODULE
Die aktuellen Module sind teilweise nur Vorentwicklungen.
Dazu gehören unter anderem:
- Fish Database
- Equipment
- GPS
- Maps
- Waters
- Statistics
- Records
- weitere noch nicht fertiggestellte Module
Ein Fehler wie:
`Initializer nicht gefunden: CatchTrack...Module`
bedeutet bei diesen Vorentwicklungen nicht automatisch,
dass dieses Modul jetzt sofort fertiggestellt werden muss.
Solche Fehler werden zunächst dokumentiert und bei Bedarf
im Zusammenhang mit dem jeweiligen Modul bearbeitet.
Es besteht ausdrücklich **keine Verpflichtung**, alle
vorhandenen Vorentwicklungen gleichzeitig funktionsfähig
zu machen.
—
# 16. WICHTIGE REGEL ZU UNFERTIGEN MODULEN
Nicht mehrere unfertige Module gleichzeitig reparieren.
Wenn ein Modul noch nicht auf der aktuellen
Entwicklungsstufe benötigt wird:
- nicht unnötig umbauen
- nicht integrieren
- nicht vollständig reparieren
- Fehler nur dokumentieren
- Abhängigkeiten feststellen
Erst wenn das Modul laut Entwicklungsreihenfolge an der
Reihe ist, wird es vollständig analysiert und entwickelt.
Dadurch vermeiden wir:
- parallele Baustellen
- widersprüchliche Schnittstellen
- unnötige Änderungen
- doppelte Arbeit
- spätere Rückbauten
—
# 17. Aktueller Fokus
Der nächste Entwicklungsbereich ist:
**WETTER**
Nicht:
- Fish Database
- Fish Data
- Catchbook
- Hitparade
- Statistics
Diese Bereiche werden bewusst zurückgestellt.
—
# 18. Arbeitsweise für jedes Basis-Modul
Für jedes Modul gilt:
### Schritt 1
Aktuelle GitHub-Dateien vollständig einlesen.
### Schritt 2
Abhängigkeiten feststellen.
### Schritt 3
Datenbank-/Storage-Anbindung prüfen.
### Schritt 4
Vorhandene Vorentwicklung analysieren.
### Schritt 5
Entscheiden:
- bestehende Datei weiterverwenden
- bestehende Datei komplett ersetzen
- neue Datei erstellen
### Schritt 6
Alle erforderlichen Dateien gemeinsam vorbereiten.
### Schritt 7
Dem Benutzer vollständige Ersatzdateien zeigen.
### Schritt 8
Benutzer übernimmt sie über Working Copy.
### Schritt 9
Benutzer erstellt Commit.
### Schritt 10
GitHub-Commit prüfen.
### Schritt 11
Modul testen.
### Schritt 12
Erst danach nächstes Modul beginnen.
**Dabei gilt zusätzlich immer Abschnitt 10:**
Vorhandene Dateien müssen vor jeder Änderung vollständig
eingelesen und als Grundlage verwendet werden.
—
# 19. Fish Data – später
Fish Data wird momentan bewusst zurückgestellt.
Langfristiges Ziel:
Eine zentrale Fischdatenbank mit Fischkarten.
Mögliche Daten:
- deutscher Name
- lokale Namen
- wissenschaftlicher Name
- Familie
- Beschreibung
- Bild
- Lebensraum
- Gewässertyp
- bevorzugte Tiefe
- Wassertemperatur
- Köder
- Fangmethode
- beste Fangzeit
- Tageszeit
- Saison
- Schonzeit
- Mindestgröße
- typische Größe
- typisches Gewicht
- weitere Informationen
Später Verbindung mit:
- Catchbook
- Wetter
- GPS
- Tide
- Moon
- Waters
- Equipment
Fish Data soll keine rein statische HTML-Liste werden.
—
# 20. Catchbook / Fangbuch – später
Das Fangbuch wird erst entwickelt, wenn die notwendigen
Datenquellen stabil sind.
Geplante Verknüpfungen:
- Fisch
- Datum
- Uhrzeit
- GPS
- Gewässer
- Wetter
- Tide
- Mond
- Equipment
- Köder
- Fangmethode
- Gewicht
- Länge
- Fotos
- Notizen
Die vorhandene Datenbank enthält bereits Strukturen für
entsprechende Beziehungen.
Diese vorhandenen Datenstrukturen müssen vor einem Umbau
geprüft werden.
—
# 21. Runtime / Fehler / Storage
Die Runtime-Kette lautet grundsätzlich:
```text
Fehler
 ↓
core/errorHandler.js
 ↓
core/runtimeStorage.js
 ↓
Browser LocalStorage
 ↓
localStorage.json

Runtime-Dateien:

* runtime/error.log
* runtime/runtime_status.json

localStorage.json ist der persistierte Snapshot des
Browser-LocalStorage.

⸻

22. localStorage.json

localStorage.json ist eine zentrale Referenzdatei.

Sie kann enthalten:

* Runtime Status
* Error Log
* Datenbank-Snapshot
* weitere persistierte CatchTrack-Daten

Vor Änderungen an:

* runtimeStorage.js
* errorHandler.js
* runtimeStatus.js
* Datenbank-/Storage-Systemen

muss die aktuelle localStorage.json geprüft werden.

Sie darf niemals durch eine erfundene oder vereinfachte
Struktur ersetzt werden.

Bestehende Daten müssen erhalten bleiben.

Wenn der Benutzer eine aktualisierte
localStorage.json über Working Copy überträgt, muss diese
bei der nächsten Analyse berücksichtigt werden.

⸻

23. Runtime Error Log

runtime/error.log ist eine lesbare Runtime-/Exportdatei.

Eine leere error.log bedeutet nicht automatisch:

„Es gab keine Fehler.“

Zusätzlich prüfen:

* localStorage.json
* Runtime Status
* Error Handler
* Runtime Storage
* Browser LocalStorage

Der persistierte Error Log im LocalStorage ist bei der
Diagnose ebenfalls relevant.

⸻

24. Runtime-Status

runtime/runtime_status.json enthält unter anderem:

* Application Status
* Modulstatus
* Fehlerstatus
* Zeitstempel

Ein Fehler im Status ist zunächst als Diagnoseinformation
zu behandeln.

Nicht jeder protokollierte Initializer-Fehler bedeutet,
dass das betreffende Modul jetzt repariert werden muss.

Bei unfertigen Modulen kann ein solcher Fehler aus dem
aktuellen Entwicklungsstand resultieren.

⸻

25. Testverhalten

Wenn der Benutzer beim Testen mehrere Module öffnet, können
dadurch mehrere Fehlerlog-Einträge entstehen.

Beispiel:

Ein Modul wird fünfmal geöffnet und jedes Mal versucht der
Module Manager einen nicht vorhandenen Initializer aufzurufen.

Dann können fünf entsprechende Fehler im Error Log stehen.

Deshalb müssen Fehleranzahl und Fehlerursache gemeinsam
bewertet werden.

Nicht allein anhand der Anzahl der Logeinträge entscheiden.

⸻

26. Umgang mit Module-Manager-Fehlern

Ein Fehler wie:

Initializer nicht gefunden: CatchTrackEquipmentModule

wird zunächst als Hinweis auf eine fehlende oder noch nicht
fertige Modulimplementierung betrachtet.

Prüfen:

1. Existiert die Moduldatei?
2. Ist sie eingebunden?
3. Ist der erwartete globale Initializer vorhanden?
4. Ist das Modul laut Entwicklungsplan bereits an der Reihe?
5. Wird der Fehler durch das Öffnen des Moduls ausgelöst?
6. Ist das Modul lediglich eine Vorentwicklung?

Nur wenn das Modul laut Entwicklungsreihenfolge benötigt
wird, wird der Fehler vollständig behoben.

⸻

27. Wettermodul – Grundarchitektur

Das Wettermodul ist ein eigenständiges Basis-Modul.

Es soll nicht nur eine Wetteranzeige darstellen, sondern
strukturierte Wetterdaten für andere CatchTrack-Module
bereitstellen.

Der spätere Datenfluss:

GPS / Standort
      ↓
Weather Provider
      ↓
Wettermodul
      ↓
standardisierter Wetterdatensatz
      ↓
Catchbook

Das Fangbuch soll später nicht HTML-Elemente auslesen,
sondern einen strukturierten Datensatz vom Wettermodul
übernehmen.

⸻

28. Wetteranbieter

Als erster Anbieter ist:

Open-Meteo

vorgesehen.

Der Anbieter muss jedoch austauschbar bleiben.

Nicht fest in die eigentliche Wetterlogik einbauen:

* Provider
* API-URL
* API-Key
* Endpunkte
* konkrete Antwortstruktur

Stattdessen Provider-Schicht verwenden.

Dadurch kann später über die Admin-Oberfläche ein anderer
Wetteranbieter konfiguriert werden.

⸻

29. Wetter-API-Konfiguration

Die API-Konfiguration soll langfristig über den
Admin-Bereich verwaltet werden.

Konfigurierbar sollen insbesondere sein:

* Provider
* API-URL
* API-Key, falls erforderlich
* Forecast-Tage
* Aktualisierungsoptionen
* weitere Providerparameter

Auch wenn Open-Meteo zunächst ohne API-Key verwendet wird,
muss die Architektur einen optionalen API-Key unterstützen.

⸻

30. Wetterstandort – aktueller Aufenthaltsort

Beim normalen Wetteraufruf soll standardmäßig der aktuelle
Standort des Benutzers verwendet werden.

Ablauf:

GPS
 ↓
Latitude / Longitude
 ↓
Weather API
 ↓
Wetter für aktuellen Standort

Das Wettermodul darf nicht einfach einen fest programmierten
Ort verwenden.

Der aktuelle Standort wird für die Wetterabfrage verwendet.

⸻

31. Wetterstandort – alternative Orte

Der Benutzer soll zusätzlich Wetter für andere Orte
anzeigen können.

Beispiele:

* Reiseplanung
* zukünftiger Angelort
* anderer Wohnort
* anderer Urlaubsort

Dafür soll eine Ortssuche vorhanden sein.

Mögliche Bedienung:

* Suchfeld
* Standortsuche
* Auswahl aus Suchergebnissen
* später optional Favoriten

Eine feste Liste von Städten soll nicht die Grundlage
des Systems sein.

Die Ortssuche liefert unter anderem:

* Ortsname
* Region
* Land
* Latitude
* Longitude

⸻

32. Anzeigeort und Fangort trennen

Ein ausgewählter Wetterort darf niemals automatisch den
Fangort verändern.

Beispiel:

Der Benutzer sucht:

Hua Hin

um das Wetter für morgen zu prüfen.

Das bedeutet nicht:

Fangort = Hua Hin

Die Systeme müssen getrennt bleiben:

Weather View Location
        ↓
nur Wetteranzeige
Catch Location
        ↓
GPS beim tatsächlichen Fang
        ↓
später Fangbuch

⸻

33. Wettervorhersage

Das Wettermodul soll mindestens sieben Tage Forecast
bereitstellen.

Ziel:

10 Tage

Wenn der Anbieter 10 Tage zuverlässig bereitstellt,
werden 10 Tage verwendet.

Die Darstellung soll grafisch erfolgen.

Pro Tag möglichst:

* Wetter-Symbol
* Wetterbeschreibung
* Höchsttemperatur
* Tiefsttemperatur
* Niederschlag
* Regenwahrscheinlichkeit
* Wind
* Luftdruck
* weitere wichtige Daten

Eine optionale Stundenansicht kann später ergänzt werden.

⸻

34. Wetterdaten – wichtige Felder

Das interne Wetterdatenmodell soll bereits ausreichend
vollständig sein, damit später keine Architekturänderung
für das Fangbuch erforderlich wird.

Wichtige Daten:

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
* Zeitpunkt der Wetterdaten
* Provider

Nicht jeder Wert muss dauerhaft angezeigt werden.

⸻

35. Wetterdaten – Beispielstruktur

Intern soll das Modul einen strukturierten Datensatz
bereitstellen, beispielsweise:

{
    location: {
        name: „Pran Buri“,
        latitude: 12.38,
        longitude: 99.90
    },
    timestamp: „2026-08-09T10:30:00Z“,
    current: {
        temperature: 29.4,
        feelsLike: 33.1,
        pressure: 1007.4,
        humidity: 74,
        precipitation: 0,
        precipitationProbability: 10,
        cloudCover: 62,
        windSpeed: 12.3,
        windDirection: 210,
        windGusts: 19.4,
        weatherCode: 3,
        uvIndex: 7.2
    },
    astronomy: {
        sunrise: „...“,
        sunset: „...“
    },
    forecast: [],
    provider: „open-meteo“
}

Das ist ein Architekturbeispiel und keine festgeschriebene
numerische Teststruktur.

⸻

36. Wetterdaten und Fangbuch

Das Wettermodul erzeugt selbst keine dauerhafte
Wetterhistorie.

Wenn später ein Fang gespeichert wird:

Fang speichern
      ↓
aktuellen Wetterdatensatz abrufen
      ↓
Wetterdaten in Fangdatensatz übernehmen

Dadurch entsteht die relevante Wetterhistorie automatisch
innerhalb der Fangdaten.

Beispiel:

Fang
├── Datum
├── Uhrzeit
├── GPS
├── Gewässer
├── Fisch
├── Köder
├── Equipment
└── Wetter
    ├── Temperatur
    ├── Luftdruck
    ├── Luftfeuchtigkeit
    ├── Wind
    ├── Windrichtung
    ├── Bewölkung
    ├── Niederschlag
    └── weitere Daten

⸻

37. Wetter-Cache

Das Wettermodul verwendet keinen starren
30-Minuten-Cache.

Stattdessen gilt:

Tages-Cache.

Die Wetterdaten werden beim ersten erfolgreichen Abruf
des Tages für den jeweiligen Standort geladen.

Der Cache bleibt bis:

00:00 Uhr Ortszeit

gültig.

⸻

38. Wetter-Cache – Regeln

Situation	Verhalten
erster Wetteraufruf des Tages	API-Abfrage
weiterer Aufruf desselben Standorts am selben Tag	Cache
neuer Standort	neue API-Abfrage
manueller „Aktualisieren“-Befehl	Cache umgehen
00:00 Uhr Ortszeit	Cache verfällt
erster Aufruf am neuen Tag	neue API-Abfrage
API nicht erreichbar	vorhandenen Cache anzeigen
API-Fehler	Runtime Error Handler verwenden

Der Cache soll standortbezogen funktionieren.

Ein Cache für Pran Buri darf nicht als Wettercache für
Hua Hin verwendet werden.

⸻

39. Wetter-Cache – keine Wetterhistorie

Der Tages-Cache ist nur eine technische Optimierung.

Er ist keine Wetterdatenbank.

Nicht dauerhaft speichern:

* vergangene Forecasts
* alte API-Antworten
* tägliche Wetterhistorien

Dauerhafte Wetterdaten entstehen später ausschließlich
durch tatsächlich gespeicherte Fänge.

⸻

40. Wetter-Symbole

Das Wettermodul soll Wetterzustände grafisch darstellen.

Die Provider-Wettercodes sollen auf eine interne
CatchTrack-Wetterdarstellung abgebildet werden.

Dadurch bleibt die Oberfläche unabhängig vom Anbieter.

Mögliche Zustände:

* Sonne
* teilweise bewölkt
* bewölkt
* Regen
* starker Regen
* Gewitter
* Schnee, falls relevant
* Nebel
* weitere Providerzustände

Die Anzeige soll übersichtlich und wettertypisch sein.

⸻

41. Wettermodul – Eigenständigkeit

Das Wettermodul muss zunächst vollständig eigenständig
funktionieren.

Es darf für den Grundbetrieb nicht vom späteren
Fangbuch abhängig sein.

Das Fangbuch wird später das Wettermodul als Datenquelle
verwenden.

Nicht umgekehrt.

⸻

42. Wettermodul – Schnittstelle

Das Modul soll später eine klare öffentliche Schnittstelle
bereitstellen.

Beispiel:

CatchTrackWeatherModule.getWeatherData()

oder eine vergleichbare definierte API.

Andere Module sollen den Wetterdatensatz darüber abrufen.

Sie sollen nicht auf interne Variablen oder HTML-Elemente
des Wettermoduls zugreifen.

⸻

43. Wettermodul – Fehlerbehandlung

Wetterfehler müssen über die bestehende Runtime-Struktur
behandelt werden.

Grundsätzlich:

Weather API
    ↓
Fehler
    ↓
errorHandler
    ↓
runtimeStorage
    ↓
runtime/error.log

Ein API-Ausfall darf nicht dazu führen, dass die gesamte
CatchTrack-Anwendung abstürzt.

Wenn ein gültiger Tagescache vorhanden ist, soll dieser
angezeigt werden.

⸻

44. Wettermodul – Speicherbegrenzung

Wetterdaten dürfen CatchTrack nicht unnötig vergrößern.

Deshalb:

* keine unbegrenzte Wetterhistorie
* keine dauerhaften API-Antworten
* nur Tagescache
* Fangdaten enthalten später nur die beim Fang relevanten
    Wetterdaten

⸻

45. Wetterdaten – Abrufverhalten

Wetterdaten werden nicht permanent im Hintergrund gesammelt.

Beim Aufruf des Wettermoduls:

1. Standort bestimmen bzw. ausgewählten Standort verwenden
2. prüfen, ob für diesen Standort ein gültiger Tagescache
    vorhanden ist
3. falls kein Cache vorhanden ist, Wetterdaten abrufen
4. aktuelle Wetterdaten und Forecast anzeigen
5. Daten temporär halten
6. bei Bedarf über die Modul-Schnittstelle bereitstellen

Es werden keine unnötigen historischen Wetterdaten
gesammelt.

⸻

46. Wetterdaten – Fangbuch-Snapshot

Wenn später ein Fang gespeichert wird, soll das Fangbuch
den zu diesem Zeitpunkt verfügbaren standardisierten
Wetterdatensatz übernehmen.

Damit wird der Wetterzustand des tatsächlichen Fangs
dauerhaft gespeichert.

Der Tagescache des Wettermoduls selbst ist davon unabhängig.

⸻

47. Versionsverwaltung

Die erste Zeile enthält immer:

# AI_CONTEXT Version X.Y

Die zweite Zeile:

# Updated: YYYY-MM-DD

Aktuelle Version:

1.5

Änderungen:

* 1.0 Ausgangsversion
* 1.1 Regel-/Projektanpassungen
* 1.2 Entwicklungsstrategie
* 1.3 Runtime-/LocalStorage-Regeln
* 1.4 neue verbindliche Modulreihenfolge und Umgang mit
    unfertigen Vorentwicklungen
* 1.5 Regel zum Aktualisieren bestehender Dateien,
    Wetterarchitektur, Standortsuche, Wetterdatenmodell,
    10-Tage-Forecast und Tages-Cache

⸻

48. Priorität bei widersprüchlichen Informationen

Bei widersprüchlichen Informationen gilt:

1. tatsächliche GitHub-Datei
2. aktueller GitHub-Commit
3. aktueller Runtime-/Teststatus
4. aktuelle localStorage.json
5. PROJECT_KNOWLEDGE.md
6. PROJECT_MODULE_PLAN.md
7. ältere Dokumentation
8. Annahmen

Die tatsächliche Projektstruktur hat Vorrang.

⸻

49. Keine Zugangsdaten

Diese Datei darf niemals enthalten:

* Passwörter
* Access Tokens
* API Keys
* SSH Private Keys
* sonstige Zugangsdaten

⸻

50. Aktueller Übergabepunkt

Die Runtime-/Logging-Infrastruktur wurde überprüft.

localStorage.json hat gezeigt, dass Runtime-Fehler korrekt
persistiert werden können.

Die vorhandenen Fehler betreffen derzeit überwiegend noch
nicht fertig entwickelte Module.

Diese Fehler werden nicht pauschal als kritische
Projektfehler behandelt.

Der aktuelle Entwicklungsfokus ist:

Wetter

Danach:

GPS → Tide → Moon → Waters → Equipment

Danach:

Fish Data → Catchbook → Statistics / Hitparade

⸻

Ende AI_CONTEXT

:::
Damit bleibt der **gesamte bisherige Inhalt der Version 1.4 erhalten**; die neuen Regeln und Wetterentscheidungen sind ergänzt statt die Datei zu verkürzen. Die Version wird auf **1.5** angehoben. 
**Diese Vorgehensweise gilt ab jetzt für alle bestehenden Dateien:** erst Original von GitHub einlesen, dann gezielt aktualisieren, anschließend immer die vollständige neue Datei ausgeben.