# AI_CONTEXT Version 1.6
# Updated: 2026-08-09
# CatchTrack – AI Context
## 1. Zweck
Diese Datei ist der zentrale Einstiegspunkt für ChatGPT/AI zur
Wiederaufnahme der CatchTrack-Entwicklung.
Bei einer neuen Unterhaltung soll dieser Context zuerst eingelesen
werden.
Danach sind die darin genannten Referenzdateien und der aktuelle
GitHub-Projektstand zu prüfen.
Der tatsächliche Projektstand auf GitHub hat Vorrang vor älteren
Annahmen oder Erinnerungen.
—
# 2. Projekt
Repository:
`El-Ninjo1965/CatchTrack-V.1.0`
Branch:
`main`
Der Benutzer arbeitet lokal mit **Working Copy** und überträgt
Änderungen anschließend nach GitHub.
Bei Pfadangaben wird `main/` nicht als Bestandteil des Pfades
angegeben.
Beispiel:
`modules/weather/weather.js`
nicht:
`main/modules/weather/weather.js`
—
# 3. Grundsätzliche Arbeitsweise
CatchTrack wird modular entwickelt.
Grundprinzip:
```text
Basis- und Datenmodule
        ↓
stabile Schnittstellen
        ↓
integrative Module
        ↓
Fangbuch
        ↓
Auswertung / Hitparade

Module sollen möglichst:

* eigenständig funktionieren
* unabhängig testbar sein
* klar definierte Schnittstellen besitzen
* strukturierte Daten liefern
* nicht direkt auf interne HTML-Strukturen anderer Module zugreifen
* später erweiterbar und konfigurierbar sein

⸻

4. Keine direkten Schreibrechte

ChatGPT arbeitet im CatchTrack-Projekt grundsätzlich lesend.

Der Benutzer übernimmt Änderungen über Working Copy.

ChatGPT darf deshalb nicht behaupten:

* eine Datei geändert zu haben
* einen Commit erstellt zu haben
* Änderungen nach GitHub übertragen zu haben

wenn dies nicht tatsächlich über eine verfügbare Schreibfunktion
erfolgt ist.

Der normale Ablauf lautet:

ChatGPT
  ↓
Analyse
  ↓
vollständige Ersatzdatei
  ↓
Benutzer übernimmt Datei in Working Copy
  ↓
Benutzer commitet
  ↓
ChatGPT prüft Commit

⸻

5. Vollständige Dateien

Bei Code- oder Inhaltsänderungen werden grundsätzlich
vollständige Dateien ausgegeben.

Keine:

* Patch-Fragmente
* Such-/Ersetzungsanweisungen
* unvollständigen Codeblöcke

Das gilt insbesondere für:

* .js
* .html
* .css
* .json
* .md
* Konfigurationsdateien

Wenn mehrere Dateien geändert werden müssen, sollen alle
vollständigen Ersatzdateien gemeinsam ausgegeben werden.

⸻

6. Bestehende Dateien zuerst prüfen

Vor einer Änderung einer bereits vorhandenen Datei gilt:

1. aktuelle Datei auf GitHub suchen
2. zugehörigen Commit prüfen
3. aktuelle Datei vollständig einlesen
4. vorhandene Funktionen und Informationen analysieren
5. Abhängigkeiten prüfen
6. erst danach über die Art der Änderung entscheiden

Grundsatz:

Erst verstehen, dann ändern.

⸻

7. Master-Version statt sinnloses Flickwerk

Eine bestehende Datei muss nicht zwanghaft Stück für Stück
repariert werden.

Nach dem Einlesen ist zu entscheiden:

Variante A – gezielte Aktualisierung

Wenn die vorhandene Struktur sinnvoll und stabil ist:

* vorhandenen Inhalt erhalten
* notwendige Änderungen ergänzen
* vollständige neue Version ausgeben

Variante B – vollständige Neuerstellung

Wenn die vorhandene Datei:

* strukturell beschädigt
* widersprüchlich
* unnötig kompliziert
* veraltet
* schlecht organisiert
* oder durch wiederholte Änderungen unübersichtlich geworden ist,

darf eine vollständige Master-Version erstellt werden.

Dabei müssen alle weiterhin gültigen Informationen,
Entscheidungen und Regeln übernommen werden.

Grundsatz:

Inhalt bewahren, schlechte Struktur nicht.

⸻

8. Commit-Prüfung

Wenn der Benutzer sagt:

„Prüfe, ob die Datei auf GitHub ist.“

wird nicht ausschließlich nach dem Dateipfad gesucht.

Die Prüfung erfolgt in dieser Reihenfolge:

1. Commit-Historie prüfen
2. nach dem erwarteten Commit suchen
3. Commit-Namen und Dateinamen berücksichtigen
4. Commit-SHA prüfen
5. Commit-Inhalt prüfen
6. feststellen, ob die Datei Bestandteil des Commits ist
7. Datei anschließend direkt im Repository suchen

Der Benutzer verwendet häufig den Dateinamen als Commit-Namen.

Beispiel:

fishData.js

kann gleichzeitig der Commit-Name sein.

⸻

9. Wiederholte GitHub-Prüfung

GitHub bzw. der Connector kann gelegentlich temporäre
Verbindungsprobleme haben.

Wenn eine Datei laut Benutzer übertragen wurde, aber der erste
Abruf fehlschlägt:

* Prüfung automatisch wiederholen
* bis zu vier Versuche direkt hintereinander
* keine Zwischenmeldung
* keine zusätzliche Bestätigung verlangen

Wenn der Commit eindeutig bestätigt, dass die Datei übertragen
wurde, gilt die Übertragung als bestätigt.

⸻

10. Verhalten bei „OK“

Ein „OK“ des Benutzers bestätigt den vorherigen Schritt.

Danach keine unnötige Rückfrage.

Wenn der nächste sinnvolle Schritt selbstständig ermittelt werden
kann, soll er durchgeführt werden.

Mehrere logisch zusammengehörige Prüfungen sollen möglichst in
einem Arbeitsgang erfolgen.

⸻

11. Projektdateien als Referenz

Je nach Aufgabe prüfen:

PROJECT_RULES.md
PROJECT_KNOWLEDGE.md
PROJECT_MODULE_PLAN.md
AI_CONTEXT.md

Zusätzlich bei Runtime-/Fehlerfragen:

runtime/error.log
runtime/runtime_status.json
localStorage.json

Die tatsächlichen Dateien auf GitHub haben Vorrang.

⸻

12. Runtime und Fehler

Grundlegende Runtime-Kette:

Fehler
 ↓
core/errorHandler.js
 ↓
core/runtimeStorage.js
 ↓
Browser LocalStorage
 ↓
localStorage.json

Zusätzlich relevant:

runtime/error.log
runtime/runtime_status.json

Eine leere error.log bedeutet nicht automatisch,
dass keine Fehler vorhanden sind.

Bei Fehleranalysen deshalb auch prüfen:

* errorHandler
* Runtime Storage
* Runtime Status
* localStorage.json
* Browser LocalStorage, soweit verfügbar

⸻

13. localStorage.json

localStorage.json ist eine wichtige Diagnose- und
Persistenzreferenz.

Sie kann enthalten:

* Runtime Status
* Error Log
* Datenbank-Snapshot
* persistierte Modul-/Anwendungsdaten

Wenn der Benutzer eine aktualisierte localStorage.json
über Working Copy überträgt, muss diese bei der nächsten
Analyse berücksichtigt werden.

Vor Änderungen an Storage-/Runtime-Dateien muss die aktuelle
localStorage.json geprüft werden.

Bestehende Daten dürfen nicht unbeabsichtigt überschrieben
oder durch eine erfundene Struktur ersetzt werden.

⸻

14. runtime/error.log

runtime/error.log dient als lesbares Runtime-Fehlerprotokoll.

Fehler müssen immer nach Ursache bewertet werden.

Wenn der Benutzer beim Testen ein Modul mehrfach öffnet,
kann derselbe Fehler mehrfach protokolliert werden.

Beispiel:

Initializer nicht gefunden: CatchTrackEquipmentModule

Mehrere identische Einträge bedeuten nicht automatisch mehrere
unterschiedliche Fehler.

⸻

15. Umgang mit unfertigen Modulen

Viele vorhandene Module sind derzeit Vorentwicklungen.

Ein Fehler in einem unfertigen Modul bedeutet nicht automatisch,
dass dieses Modul sofort fertiggestellt werden muss.

Bei einem solchen Fehler prüfen:

1. Existiert die Datei?
2. Ist sie eingebunden?
3. Existiert der erwartete Initializer?
4. Ist das Modul laut Entwicklungsplan bereits an der Reihe?
5. Wird der Fehler tatsächlich durch die aktuelle Testaktion
    ausgelöst?
6. Handelt es sich lediglich um eine Vorentwicklung?

Unfertige Module werden nicht unnötig parallel repariert.

⸻

16. Entwicklungsstrategie

Die Entwicklung wird bewusst in zwei Gruppen geteilt.

Gruppe A – unabhängige Basis-/Datenmodule

Diese werden zuerst fertiggestellt.

* Wetter
* GPS
* Tide
* Moon
* Waters
* Equipment
* weitere eigenständige Datenmodule

Ziel:

eigenständig
↓
testen
↓
Fehler bereinigen
↓
stabile Schnittstelle
↓
für andere Module nutzbar

⸻

Gruppe B – integrative Module

Diese werden später entwickelt.

* Fish Data
* Fish Database / Fischkarten
* Catchbook / Fangbuch
* Statistics
* Records
* Hitparade

Diese Module sollen die zuvor fertiggestellten Datenquellen
verwenden.

⸻

17. Verbindliche Entwicklungsreihenfolge

Aktuelle Reihenfolge:

1. Wetter
2. GPS
3. Tide
4. Moon
5. Waters
6. Equipment
7. Fish Data
8. Catchbook
9. Statistics / Hitparade

Diese Reihenfolge kann geändert werden, wenn eine technische
Abhängigkeit dies erforderlich macht.

Änderungen müssen jedoch bewusst entschieden und dokumentiert
werden.

⸻

18. Aktueller Entwicklungsstand

Der aktuelle Fokus liegt auf den unabhängigen Basis-Modulen.

Das Wettermodul ist der aktuelle Entwicklungsbereich.

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

Erst danach:

Fish Data
↓
Catchbook
↓
Statistics / Hitparade

⸻

19. Wettermodul – Ziel

Das Wettermodul soll eigenständig funktionieren und später
strukturierte Wetterdaten für das Fangbuch bereitstellen.

Es ist nicht nur eine Anzeige.

Es ist eine Datenquelle.

Grundstruktur:

GPS / Standort
      ↓
Geolocation
      ↓
Weather Provider
      ↓
Weather Module
      ↓
standardisierter Wetterdatensatz
      ↓
Catchbook

⸻

20. Wetter – aktueller Standort

Beim normalen Aufruf soll das Wetter für den aktuellen
Aufenthaltsort des Benutzers angezeigt werden.

Der Standort wird über GPS bzw. vorhandene
Standortinformationen ermittelt.

Nicht dauerhaft einen festen Ort programmieren.

⸻

21. Wetter – alternative Orte

Der Benutzer soll zusätzlich andere Orte auswählen können.

Beispiele:

* zukünftiger Angelort
* Reiseort
* Urlaubsort
* anderer Wohnort

Mögliche Bedienung:

* Suchfeld
* Ortssuche
* Auswahl aus Suchergebnissen
* später optional Favoriten

Die Suche soll mindestens liefern:

* Ortsname
* Region
* Land
* Latitude
* Longitude

⸻

22. Wetterort und Fangort trennen

Ein manuell ausgewählter Wetterort darf den späteren Fangort
nicht automatisch verändern.

Beispiel:

Wetterort:
Hua Hin
Fangort:
GPS-Position beim tatsächlichen Fang

Beide Informationen müssen unabhängig voneinander bleiben.

⸻

23. Wetter – Forecast

Das Wettermodul soll mindestens sieben Tage anzeigen.

Ziel:

10 Tage

Wenn der Anbieter 10 Tage zuverlässig bereitstellt,
werden 10 Tage verwendet.

Die Darstellung soll grafisch und übersichtlich sein.

Mögliche Tagesinformationen:

* Wetter-Symbol
* Wetterbeschreibung
* Temperatur
* Höchsttemperatur
* Tiefsttemperatur
* Niederschlag
* Regenwahrscheinlichkeit
* Wind
* Windrichtung
* Luftdruck
* Luftfeuchtigkeit
* Bewölkung

⸻

24. Wetter – wichtige Daten

Das interne Datenmodell soll bereits die später für das
Fangbuch benötigten Daten unterstützen.

Wichtige Werte:

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

Nicht jeder Wert muss dauerhaft auf der Benutzeroberfläche
angezeigt werden.

⸻

25. Wetter – Provider

Als erster Provider:

Open-Meteo

Der Provider muss austauschbar bleiben.

Provider-spezifische Details dürfen nicht fest mit der
Darstellung gekoppelt werden.

Die Architektur soll später alternative Anbieter erlauben.

⸻

26. Wetter – API-Konfiguration

Die Wetter-API soll langfristig über den Admin-Bereich
konfigurierbar sein.

Mögliche Einstellungen:

* Provider
* API-URL
* API-Key
* Forecast-Tage
* Aktualisierungsoptionen
* weitere Providerparameter

Open-Meteo benötigt zunächst keinen API-Key.

Die Architektur soll trotzdem optionale API-Keys unterstützen.

⸻

27. Wetter – Datenmodell

Das Modul soll einen standardisierten Wetterdatensatz liefern.

Beispiel:

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

Dies ist ein Architekturbeispiel.

Die tatsächliche Implementierung muss sich an den
Providerantworten und dem bestehenden Projekt orientieren.

⸻

28. Wetter – Tagescache

Das Wettermodul verwendet einen Tagescache.

Kein starrer 30-Minuten-Cache.

Regel:

Erster Abruf des Tages
        ↓
API-Abfrage
        ↓
Tagescache

Der Cache gilt bis:

00:00 Uhr Ortszeit

⸻

29. Wetter – Cache-Regeln

Situation	Verhalten
erster Abruf heute	API-Abfrage
weiterer Abruf desselben Standorts heute	Cache verwenden
anderer Standort	neue API-Abfrage
manueller Aktualisieren-Befehl	Cache umgehen
00:00 Uhr Ortszeit	Cache verfällt
erster Abruf am neuen Tag	neue API-Abfrage
API nicht erreichbar	gültigen Cache verwenden
kein Cache vorhanden und API nicht erreichbar	Fehler anzeigen / behandeln

Der Cache ist immer standortbezogen.

Ein Cache für Pran Buri darf nicht als Wettercache für Hua Hin
verwendet werden.

⸻

30. Wetter – keine permanente Wetterhistorie

Das Wettermodul soll keine unbegrenzte Wetterhistorie speichern.

Nicht dauerhaft sammeln:

* alte Forecasts
* alte API-Antworten
* tägliche Wetterdaten ohne Bezug zu einem Fang

Der Wettercache ist eine technische Optimierung,
keine Wetterdatenbank.

⸻

31. Wetter – Fangbuch-Snapshot

Wenn später ein Fang gespeichert wird:

Fang speichern
      ↓
aktuellen Wetterdatensatz bestimmen
      ↓
relevante Wetterdaten in Fangdatensatz übernehmen

Damit entsteht die dauerhafte Wetterhistorie dort,
wo sie tatsächlich benötigt wird:

im Fangbuch.

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
    └── weitere relevante Werte

⸻

32. Wetter – Schnittstelle

Andere Module sollen nicht auf interne Variablen oder
HTML-Elemente des Wettermoduls zugreifen.

Es soll eine definierte Schnittstelle geben.

Beispiel:

CatchTrackWeatherModule.getWeatherData()

Der konkrete Name darf sich an die bestehende CatchTrack-
Architektur anpassen.

Wichtig ist die klare Trennung:

Weather intern
      ↓
öffentliche Schnittstelle
      ↓
andere Module

⸻

33. Wetter – Fehlerbehandlung

Wetterfehler werden über die bestehende Runtime-
Fehlerbehandlung verarbeitet.

Grundstruktur:

Weather API
    ↓
Fehler
    ↓
errorHandler
    ↓
runtimeStorage
    ↓
runtime/error.log

Ein API-Ausfall darf nicht die gesamte Anwendung zum Absturz
bringen.

Wenn ein gültiger Tagescache vorhanden ist, soll dieser
weiter verwendet werden.

⸻

34. Wetter – Speicherbegrenzung

Das Wettermodul soll möglichst wenig dauerhafte Daten erzeugen.

Daher:

* Tagescache
* keine unbegrenzte Wetterhistorie
* keine dauerhafte Speicherung kompletter API-Antworten
* dauerhafte Wetterdaten nur im Zusammenhang mit gespeicherten
    Fängen

⸻

35. Wetter – Symbole

Wetterzustände sollen grafisch dargestellt werden.

Provider-Codes sollen intern auf eine CatchTrack-
Darstellung abgebildet werden.

Mögliche Zustände:

* Sonne
* teilweise bewölkt
* bewölkt
* Regen
* starker Regen
* Gewitter
* Nebel
* weitere Providerzustände

Die Benutzeroberfläche soll möglichst unabhängig vom
Wetteranbieter bleiben.

⸻

36. Wetter – aktueller Abruf

Beim Aufruf des Wettermoduls:

1. Standort feststellen
2. ausgewählten alternativen Standort berücksichtigen
3. Tagescache prüfen
4. falls gültig → Cache verwenden
5. falls nicht gültig → API abrufen
6. Forecast und aktuelle Daten anzeigen
7. standardisierten Datensatz bereitstellen

Es findet keine dauerhafte Hintergrundsammlung statt.

⸻

37. Fish Data – später

Fish Data wird bewusst erst nach den Basis-Modulen entwickelt.

Langfristig vorgesehen:

* deutscher Name
* lokale Namen
* wissenschaftlicher Name
* Familie
* Beschreibung
* Bild
* Lebensraum
* Gewässertyp
* bevorzugte Tiefe
* Wassertemperatur
* Köder
* Fangmethode
* beste Fangzeit
* Tageszeit
* Saison
* Schonzeit
* Mindestgröße
* typische Größe
* typisches Gewicht

Spätere Verknüpfungen:

* Catchbook
* Wetter
* GPS
* Tide
* Moon
* Waters
* Equipment

⸻

38. Catchbook – später

Das Fangbuch wird erst entwickelt, wenn die erforderlichen
Datenquellen stabil sind.

Geplante Daten:

* Fisch
* Datum
* Uhrzeit
* GPS
* Gewässer
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
zusammenführen und nicht deren Funktionen duplizieren.

⸻

39. Equipment – später

Equipment wird zunächst als eigenständiges Modul entwickelt.

Ziel:

Verwaltung der verwendeten Angelausrüstung.

Mögliche Bereiche:

* Ruten
* Rollen
* Schnüre
* Vorfächer
* Haken
* Köder
* Kunstköder
* Zubehör
* weitere Ausrüstung

Das Equipment-Modul soll später vom Fangbuch verwendet werden.

⸻

40. Keine unnötige Parallelentwicklung

Während ein Basis-Modul entwickelt wird:

* keine parallele Fertigstellung des Fangbuchs
* keine parallele Fertigstellung der Fish Database
* keine unnötige Integration unfertiger Module

Ziel ist ein stabiler Unterbau.

⸻

41. Versionsregel

Die erste Zeile dieser Datei enthält immer die Version.

Format:

# AI_CONTEXT Version X.Y

Die zweite Zeile enthält das Änderungsdatum.

Format:

# Updated: YYYY-MM-DD

Aktuelle Version:

1.6

Versionierung:

* 1.0 Ausgangsversion
* 1.1 Projekt-/Regelanpassungen
* 1.2 Entwicklungsstrategie
* 1.3 Runtime-/LocalStorage-Regeln
* 1.4 Modulreihenfolge / Vorentwicklungen
* 1.5 bestehende Dateien zuerst einlesen / Wetterarchitektur
* 1.6 Master-Neuordnung und Konsolidierung des gesamten Contexts

⸻

42. Änderungsprinzip für diesen AI Context

Auch diese Datei folgt den allgemeinen Dateiregeln.

Vor jeder Änderung:

1. aktuelle GitHub-Version einlesen
2. aktuelle Versionnummer feststellen
3. vorhandene Informationen prüfen
4. Änderungen integrieren
5. Versionsnummer erhöhen
6. Änderungsdatum aktualisieren
7. vollständige Datei ausgeben

Wenn die bestehende Struktur schlecht oder beschädigt ist,
darf eine neue Master-Version erstellt werden.

Dabei dürfen gültige Projektinformationen nicht verloren gehen.

⸻

43. Priorität bei widersprüchlichen Informationen

Bei widersprüchlichen Informationen gilt:

1. tatsächlicher GitHub-Dateistand
2. aktueller Commit
3. aktueller Runtime-/Teststatus
4. aktuelle localStorage.json
5. PROJECT_RULES.md
6. PROJECT_KNOWLEDGE.md
7. PROJECT_MODULE_PLAN.md
8. ältere Dokumentation
9. Annahmen

Bei einem nachweisbaren Widerspruch muss dieser benannt
und vor einer kritischen Architekturentscheidung geklärt werden.

⸻

44. Keine Zugangsdaten

Diese Datei darf niemals enthalten:

* Passwörter
* Access Tokens
* API Keys
* SSH Private Keys
* sonstige geheime Zugangsdaten

⸻

45. Aktueller Übergabepunkt

Die Runtime-/Logging-Struktur wurde überprüft.

localStorage.json wird als wichtige Diagnose- und
Persistenzreferenz behandelt.

Die bisher festgestellten Fehler betreffen überwiegend
noch nicht fertig entwickelte Module.

Der aktuelle Entwicklungsfokus ist:

Wetter

Danach:

GPS → Tide → Moon → Waters → Equipment

Danach:

Fish Data → Catchbook → Statistics / Hitparade

⸻

Ende AI_CONTEXT

:::