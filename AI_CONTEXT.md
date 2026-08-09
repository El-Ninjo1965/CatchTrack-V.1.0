AI_CONTEXT Version 2.2
Updated: 2026-08-09
CatchTrack – AI Context

1. Zweck

Diese Datei ist der zentrale Einstiegspunkt für ChatGPT/AI zur
Wiederaufnahme der CatchTrack-Entwicklung.

Bei einer neuen Unterhaltung wird dieser Context zuerst gelesen.
Danach werden die darin genannten Referenzdateien sowie der
aktuelle GitHub-Projektstand geprüft.

Der tatsächliche Projektstand auf GitHub hat Vorrang vor älteren
Annahmen, Erinnerungen oder dokumentierten Planungen.

⸻

2. Projekt

Repository:
El-Ninjo1965/CatchTrack-V.1.0

Branch:
main

Der Benutzer arbeitet lokal mit Working Copy und überträgt
Änderungen anschließend nach GitHub.

Bei Pfadangaben wird main/ nicht als Bestandteil des Pfades
angegeben.

Beispiel:

modules/weather/weather.js

nicht:

main/modules/weather/weather.js

⸻

3. Grundsätzliche Arbeitsweise

CatchTrack wird modular entwickelt.

Grundprinzip:

Basis- und Datenmodule
↓
stabile Schnittstellen
↓
integrative Module
↓
Fangbuch
↓
Auswertung / Hitparade

Module sollen:

* eigenständig funktionieren
* unabhängig testbar sein
* klare Schnittstellen besitzen
* strukturierte Daten liefern
* nicht direkt auf interne HTML-Strukturen anderer Module zugreifen
* erweiterbar und konfigurierbar sein
* von Anfang an multilingual vorbereitet sein

⸻

4. Keine direkten Schreibrechte

ChatGPT arbeitet im CatchTrack-Projekt grundsätzlich lesend.

Der Benutzer übernimmt Änderungen über Working Copy.

ChatGPT darf nicht behaupten:

* eine Datei geändert zu haben
* einen Commit erstellt zu haben
* Änderungen nach GitHub übertragen zu haben

wenn dies nicht tatsächlich erfolgt ist.

Normaler Ablauf:

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

Bei Code- oder Inhaltsänderungen werden grundsätzlich vollständige
Dateien ausgegeben.

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

Wenn mehrere Dateien geändert werden müssen, werden alle
vollständigen Ersatzdateien gemeinsam in einer Antwort ausgegeben.

Jede Datei soll möglichst in genau einem vollständigen Copyblock
stehen.

Es sollen nicht mehrere aufeinanderfolgende Antworten notwendig
sein, um zusammengehörende Dateien zu übernehmen.

⸻

6. Bestehende Dateien zuerst prüfen

Vor einer Änderung einer bereits vorhandenen Datei:

1. aktuelle Datei auf GitHub suchen
2. relevante Commit-Historie prüfen
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

Variante A – gezielte Aktualisierung

Wenn die vorhandene Struktur sinnvoll und stabil ist:

* vorhandenen Inhalt erhalten
* notwendige Änderungen integrieren
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

Alle weiterhin gültigen Informationen, Entscheidungen und Regeln
müssen übernommen werden.

Grundsatz:

Inhalt bewahren, schlechte Struktur nicht.

⸻

8. Commit-Prüfung

Wenn der Benutzer sagt:

„Prüfe, ob die Datei auf GitHub ist.“

wird nicht ausschließlich nach dem Dateipfad gesucht.

Reihenfolge:

1. Commit-Historie prüfen
2. erwarteten Commit suchen
3. Commit-Namen und Dateinamen berücksichtigen
4. Commit-SHA prüfen
5. Commit-Inhalt prüfen
6. feststellen, ob die Datei Bestandteil des Commits ist
7. Datei direkt im Repository suchen
8. aktuellen Dateiinhalt einlesen, wenn relevant

Der Benutzer verwendet häufig den Dateinamen als Commit-Namen.

⸻

9. Wiederholte GitHub-Prüfung

Bei temporären GitHub-/Connector-Problemen:

* Prüfung automatisch wiederholen
* bis zu vier Versuche
* keine unnötige Zwischenmeldung
* keine zusätzliche Bestätigung verlangen

Wenn ein Commit eindeutig bestätigt, dass eine Datei übertragen
wurde, gilt die Übertragung als bestätigt.

⸻

10. Verhalten bei „OK“

„OK“ ist eine verbindliche Arbeitsbestätigung.

Ein „OK“ bedeutet:

* Der unmittelbar vorherige Arbeitsschritt wurde vom Benutzer
    erledigt.
* Die bereitgestellte Datei wurde übernommen, wenn zuvor eine
    Dateiübernahme vorgesehen war.
* Ein vorgesehener Upload oder Commit wurde durchgeführt, wenn
    dies der unmittelbar vorherige Arbeitsschritt war.
* Der nächste logisch notwendige Arbeitsschritt soll unmittelbar
    begonnen werden.

Nach einem eindeutigen „OK“ darf nicht erneut gefragt werden,
ob der vorherige Schritt durchgeführt wurde.

Wenn der nächste sinnvolle Schritt selbstständig ermittelt werden
kann, wird direkt fortgefahren.

Bei einem vorherigen GitHub-Upload oder Commit wird vor der
technischen Weiterarbeit der aktuelle GitHub-Stand geprüft.

Logisch zusammengehörige Prüfungen sollen möglichst in einem
Arbeitsgang erfolgen.

⸻

11. Verbindliche Projekt-Referenzdateien

Je nach Aufgabe sind folgende Dateien zu berücksichtigen:

AI_CONTEXT.md
PROJECT_RULES.md
PROJECT_KNOWLEDGE.md
PROJECT_MODULE_PLAN.md
PROJECT_STATUS.md

Zusätzlich bei Architekturfragen:

PROJECT_ARCHITECTURE.md

Zusätzlich bei Testfragen:

PROJECT_TEST_PLAN.md

Zusätzlich bei Runtime-/Fehlerfragen:

runtime/error.log
runtime/runtime_status.json
localStorage.json

Die tatsächlichen Dateien auf GitHub haben Vorrang.

⸻

12. PROJECT_STATUS.md

PROJECT_STATUS.md ist die zentrale Übersicht über den
dokumentierten Entwicklungsstand.

Sie beschreibt:

* vorhandene Module
* Status der Module
* aktuelle Entwicklungsphase
* offene Aufgaben
* bekannte Fehler
* nächsten Arbeitsschritt
* geplante Entwicklungsreihenfolge

PROJECT_STATUS.md ersetzt nicht die Prüfung des tatsächlichen
Repository-Stands.

⸻

13. Statusabgleich

Bei einer Projektfortsetzung muss der dokumentierte Status mit
dem tatsächlichen GitHub-Stand abgeglichen werden.

Grundsätzlich:

AI_CONTEXT.md
↓
PROJECT_STATUS.md
↓
GitHub-Commit-Historie
↓
tatsächliche Dateien
↓
aktueller tatsächlicher Stand

Dokumentation beschreibt den erwarteten Stand.

GitHub und die tatsächlichen Dateien bestimmen den tatsächlichen
Stand.

Wenn PROJECT_STATUS.md ein Modul als fertig bezeichnet, eine
benötigte Datei aber fehlt, gilt das Modul nicht als fertig.

⸻

14. Versions- und Commitprüfung

Das Erstellungs- oder Änderungsdatum einer Datei dient nur zur
Orientierung.

Es darf nicht allein zur Bestimmung des aktuellen Standes
verwendet werden.

Eine ältere Datei kann später geändert worden sein.

Daher:

Dateidatum
≠
aktueller Dateiinhalt
≠
letzter relevanter Commit

Für den tatsächlichen Stand zählen:

* Commit-Historie
* aktueller Commit
* aktueller Dateiinhalt
* dokumentierter Status

⸻

15. Runtime und Fehler

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

Bei Fehleranalysen sind möglichst alle relevanten Quellen
abzugleichen.

⸻

16. localStorage.json

localStorage.json ist eine wichtige Diagnose- und
Persistenzreferenz.

Sie kann enthalten:

* Runtime Status
* Error Log
* Datenbank-Snapshot
* persistierte Modul-/Anwendungsdaten

Wenn der Benutzer eine aktualisierte localStorage.json
über Working Copy überträgt, muss diese bei der nächsten Analyse
berücksichtigt werden.

Vor Änderungen an Storage-/Runtime-Dateien muss die aktuelle
localStorage.json geprüft werden.

Bestehende Daten dürfen nicht unbeabsichtigt überschrieben oder
durch eine erfundene Struktur ersetzt werden.

⸻

17. runtime/error.log

runtime/error.log dient als lesbares Runtime-Fehlerprotokoll.

Fehler müssen nach Ursache bewertet werden.

Mehrere identische Einträge können durch wiederholtes Öffnen oder
Testen eines Moduls entstehen und bedeuten nicht automatisch
mehrere unterschiedliche Fehler.

⸻

18. Umgang mit unfertigen Modulen

Viele vorhandene Module sind derzeit Vorentwicklungen.

Ein Fehler in einem unfertigen Modul bedeutet nicht automatisch,
dass dieses Modul sofort fertiggestellt werden muss.

Prüfen:

1. Existiert die Datei?
2. Ist sie eingebunden?
3. Existiert der erwartete Initializer?
4. Ist das Modul laut Entwicklungsplan bereits an der Reihe?
5. Wird der Fehler tatsächlich durch die aktuelle Testaktion
    ausgelöst?
6. Handelt es sich lediglich um eine Vorentwicklung?

Unfertige Module werden nicht unnötig parallel repariert.

⸻

19. Globale Mehrsprachigkeitsregel

CatchTrack wird von Anfang an multilingual konzipiert.

Die Anwendung darf nicht auf Deutsch oder Englisch als feste
Sprache beschränkt werden.

Jedes Modul muss multilingual-fähig entwickelt werden.

Die Sprache muss auf zwei Wegen bestimmt werden können:

A – automatische Spracherkennung

Die Anwendung verwendet standardmäßig die vom Endgerät bzw.
Browser gemeldete bevorzugte Sprache.

B – manuelle Auswahl

Der Benutzer kann die Sprache innerhalb der Anwendung manuell
auswählen.

Priorität:

Die manuelle Auswahl des Benutzers hat Vorrang vor der
automatischen Spracherkennung.

Die gewählte Sprache gilt grundsätzlich für die gesamte
Anwendung.

⸻

20. Zentrales i18n-/Language-System

Die Sprachlogik wird nicht in jedem Modul separat implementiert.

Langfristig wird ein zentrales Language-/Internationalization-
System verwendet.

Module greifen auf dieses System zu.

Beispiel:

Language System
↓
Weather
GPS
Tide
Moon
Waters
Equipment
Fish Data
Catchbook
Statistics
Records

Module dürfen keine eigene, voneinander unabhängige
Sprachverwaltung entwickeln.

⸻

21. Keine fest codierten UI-Texte

Texte, die dem Benutzer angezeigt werden, sollen nicht unnötig
direkt in der Programmlogik fest codiert werden.

Dazu gehören insbesondere:

* Menüpunkte
* Buttons
* Überschriften
* Beschriftungen
* Hinweise
* Fehlermeldungen
* Statusmeldungen
* Dialoge
* Filter
* Auswahlwerte
* Einstellungen

Stattdessen sollen Übersetzungsschlüssel verwendet werden.

Beispiel:

t(“weather.temperature”)

statt:

“Temperature”

Der konkrete Name der Übersetzungsfunktion richtet sich nach
der später festgelegten Architektur.

⸻

22. Neue Module müssen multilingual vorbereitet sein

Auch wenn das zentrale Language-System zu einem späteren Zeitpunkt
vollständig implementiert wird, müssen neue Module bereits so
entwickelt werden, dass die spätere Übersetzung ohne grundlegende
Änderung der Programmlogik möglich ist.

Daher:

Modul erstellen
↓
keine Sprache fest verdrahten
↓
Übersetzungsschlüssel verwenden
↓
zentrale Sprachlogik

Dies gilt für jedes neue Modul.

⸻

23. Sprache und gespeicherte Daten

Die Sprache der Benutzeroberfläche darf nicht automatisch die
zugrunde liegenden strukturierten Daten verändern.

Beispiel:

pressure = 1013.2

Deutsch:
Luftdruck

English:
Pressure

Die Daten bleiben sprachneutral.

Nur Darstellung und Benutzeroberfläche werden übersetzt.

Dies ist insbesondere für das spätere Fangbuch und die
Statistiken wichtig.

⸻

24. CORE-MASTER-ARCHITEKTUR

CatchTrack wird vor der weiteren Fachmodul-Entwicklung auf einen
stabilen Core-Master gebracht.

Ziel:

Der Core stellt alle zentralen Funktionen und Schnittstellen
bereit, sodass spätere Fachmodule den Core grundsätzlich nicht
mehr verändern müssen.

Der Core umfasst insbesondere:

* app.js
* zentrale Datenbankarchitektur
* schema.sql
* versioniertes Migrationssystem
* moduleManager.js
* runtimeStatus.js
* runtimeStorage.js
* errorHandler.js
* storageManager.js
* languageManager.js
* api.js
* router.js
* zentrale Konfiguration

Grundprinzip:

Core
↓
stabile, dokumentierte Schnittstellen
↓
Fachmodule

Fachmodule dürfen zentrale Core-Dateien nicht unnötig verändern.

⸻

25. Core – app.js

app.js ist ein generischer Bootstrap.

app.js darf nicht für jedes einzelne Fachmodul individuell
angepasst werden.

Neue Module werden über die zentrale Modularchitektur geladen.

Grundsätzlich gilt:

Neues Modul
↓
Module Manager / Konfiguration
↓
generisches app.js
↓
Modul wird geladen

Ein Fachmodul darf grundsätzlich keine individuelle Änderung an
app.js benötigen.

Eine Änderung an app.js ist nur zulässig, wenn tatsächlich eine
zentrale Architekturänderung erforderlich ist.

⸻

26. Core – Datenbank

CatchTrack verwendet langfristig eine zentrale Datenbankarchitektur.

Es darf nicht dauerhaft mehrere konkurrierende oder parallele
Datenbankimplementierungen geben.

Die zentrale Datenbankschnittstelle muss eindeutig festgelegt sein.

schema.sql definiert die zentrale Basisschicht der Datenbank.

Modulspezifische Erweiterungen werden über versionierte
Migrationen umgesetzt.

Ein neues Fachmodul darf nicht dazu führen, dass schema.sql bei
jedem Modul erneut manuell verändert werden muss.

Grundstruktur:

Zentrale Datenbank
↓
Core-Daten
↓
Migrationen
↓
Moduldaten

⸻

27. Core – Migrationen

Migrationen müssen:

* versioniert
* reproduzierbar
* eindeutig
* rückverfolgbar
* mit der zentralen Datenbankarchitektur kompatibel sein

Eine Migration darf nicht dieselbe Datenbankfunktion parallel
zu einer anderen Migration implementieren.

Bei einem Modul mit eigenem Datenbedarf gilt grundsätzlich:

Modul
↓
eigene Migration
↓
zentrale Datenbank

Die Migration wird nicht als Ersatz für eine saubere Core-
Architektur verwendet.

⸻

28. Core – Modulgrenzen

Ein Modul kapselt seine Fachlogik.

Module kommunizieren über definierte öffentliche Schnittstellen
und strukturierte Daten.

Module dürfen:

* öffentliche Core-APIs verwenden
* öffentliche APIs anderer fertiger Module verwenden

Module dürfen nicht:

* interne HTML-Strukturen anderer Module manipulieren
* interne Variablen anderer Module verwenden
* dieselbe Core-Funktion parallel selbst implementieren
* den Core ohne technische Notwendigkeit verändern

⸻

29. Core – gemeinsame Funktionen

Funktionen, die von mehreren Modulen benötigt werden, gehören
grundsätzlich in den Core oder in eine klar definierte gemeinsame
Service-Schicht.

Beispiele:

* Fehlerbehandlung
* Datenbankzugriff
* Persistenz
* Runtime-Status
* Übersetzungen
* Routing
* Modul-Lifecycle
* Validierung
* allgemeine Datenkonvertierung
* gemeinsame API-Kommunikation

Fachmodule sollen solche Funktionen nicht mehrfach unabhängig
implementieren.

⸻

30. Core-Master – Konsolidierung

Vor der weiteren Fachmodul-Entwicklung wird der vorhandene Core
vollständig geprüft und als Master-Version konsolidiert.

Dabei gilt:

bestehende gültige Funktionen
+
bestehende gültige Informationen
+
erforderliche Architektur
↓
eine saubere Master-Version

Beschädigte, doppelte, widersprüchliche oder veraltete Strukturen
dürfen vollständig ersetzt werden.

Gültige Funktionen und Informationen dürfen dabei nicht verloren
gehen.

Eine bestehende Datei muss nicht künstlich erhalten werden, wenn
eine saubere Master-Struktur eine bessere Lösung darstellt.

⸻

31. Core-Master – Zielzustand

Nach Fertigstellung des Core-Masters sollen die folgenden
Funktionen zentral und stabil bereitstehen:

* Application Bootstrap
* Datenbankverbindung
* Datenbankmigrationen
* Datenbankspeicherung
* Modul-Lifecycle
* Runtime-Status
* Fehlerbehandlung
* persistenter Storage
* Routing
* zentrale API-Schnittstellen
* Mehrsprachigkeit
* Konfiguration
* gemeinsame Validierung

Danach werden Fachmodule auf diesen Schnittstellen aufgebaut.

⸻

32. Entwicklungsstrategie

Die Entwicklung wird bewusst in zwei Gruppen geteilt.

Gruppe A – unabhängige Basis-/Datenmodule

Zuerst:

* Weather
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

Gruppe B – integrative Module

Danach:

* Fish Data
* Fish Database / Fischkarten
* Catchbook / Fangbuch
* Statistics
* Records
* Hitparade

⸻

33. Verbindliche Entwicklungsreihenfolge

Die technische Reihenfolge lautet:

1. Core-Master
2. Weather
3. GPS
4. Tide
5. Moon
6. Waters
7. Equipment
8. Fish Data
9. Catchbook
10. Statistics / Hitparade

Das Weather-Modul bleibt der bereits bearbeitete Übergabepunkt
und wird bei der Core-Konsolidierung berücksichtigt.

Die Reihenfolge kann geändert werden, wenn technische
Abhängigkeiten dies erforderlich machen.

Änderungen müssen bewusst entschieden und dokumentiert werden.

⸻

34. Aktueller Entwicklungsstand

Der aktuelle Projektfokus wird vor dem nächsten Fachmodul auf den
Core-Master erweitert.

Aktueller Arbeitsschritt:

Core-Master
↓
Weather-Stand gegen Core prüfen
↓
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
Catchbook
↓
Statistics / Hitparade

⸻

35. Weather-Modul

Aktueller tatsächlicher Ordner:

modules/weather/

├── module.json
├── weather.js
├── weather.html
└── weather.css

Alle tatsächlichen Dateinamen dieses Moduls sind kleingeschrieben.

Nicht vorhandene Varianten wie:

Weather.js
Weather.html
Weather.css
Weather.cs

dürfen nicht als fehlende Dateien behandelt werden.

⸻

36. Wetter – Ziel

Das Weather-Modul soll eigenständig funktionieren und später
strukturierte Wetterdaten für das Fangbuch bereitstellen.

Es ist nicht nur eine Anzeige, sondern eine Datenquelle.

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

37. Wetter – aktueller Standort

Beim normalen Aufruf wird das Wetter für den aktuellen
Aufenthaltsort des Benutzers angezeigt.

Der Standort wird über GPS bzw. vorhandene
Standortinformationen ermittelt.

Ein fester Standort darf nicht dauerhaft programmiert werden.

⸻

38. Wetter – alternative Orte

Der Benutzer soll zusätzlich andere Orte auswählen können.

Mögliche Bedienung:

* Suchfeld
* Ortssuche
* Suchergebnisse
* später optional Favoriten

Die Suche soll mindestens liefern:

* Ortsname
* Region
* Land
* Latitude
* Longitude

⸻

39. Wetterort und Fangort trennen

Ein manuell ausgewählter Wetterort darf den späteren Fangort
nicht automatisch verändern.

Beispiel:

Wetterort:
Hua Hin

Fangort:
GPS-Position beim tatsächlichen Fang

Beide Informationen bleiben unabhängig.

⸻

40. Wetter – Forecast

Das Wettermodul soll mindestens sieben Tage anzeigen.

Ziel:

10 Tage

Wenn der Provider 10 Tage zuverlässig liefert, werden 10 Tage
verwendet.

Die Darstellung soll grafisch und übersichtlich sein.

Wichtige Daten:

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

41. Wetter – wichtige Daten

Das interne Datenmodell soll bereits die später für das Fangbuch
benötigten Daten unterstützen.

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

42. Wetter – Provider

Als erster Provider:

Open-Meteo

Der Provider muss austauschbar bleiben.

Provider-spezifische Details dürfen nicht fest mit der
Darstellung gekoppelt werden.

Die Architektur soll alternative Anbieter erlauben.

⸻

43. Wetter – API-Konfiguration

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

44. Wetter – Tagescache

Das Wettermodul verwendet einen Tagescache.

Regel:

Erster Abruf des Tages
↓
API-Abfrage
↓
Tagescache

Der Cache gilt bis:

00:00 Uhr Ortszeit

Zusätzlich:

* anderer Standort → eigener Cache
* manueller Refresh → Cache umgehen
* API-Ausfall → gültigen Cache verwenden
* kein Cache + API-Ausfall → Fehlerbehandlung

Der Cache ist keine Wetterhistorie.

⸻

45. Wetter – keine permanente Wetterhistorie

Das Wettermodul soll keine unbegrenzte Wetterhistorie speichern.

Nicht dauerhaft sammeln:

* alte Forecasts
* alte API-Antworten
* tägliche Wetterdaten ohne Bezug zu einem Fang

Der Wettercache ist eine technische Optimierung und keine
Wetterdatenbank.

⸻

46. Wetter – Fangbuch-Snapshot

Wenn später ein Fang gespeichert wird:

Fang speichern
↓
aktuellen Wetterdatensatz bestimmen
↓
relevante Wetterdaten in Fangdatensatz übernehmen

Damit entsteht die dauerhafte Wetterhistorie dort, wo sie
benötigt wird:

im Fangbuch.

⸻

47. Wetter – Schnittstelle

Andere Module sollen nicht auf interne Variablen oder
HTML-Elemente des Wettermoduls zugreifen.

Es soll eine definierte Schnittstelle geben.

Beispiel:

CatchTrackWeatherModule.getWeatherData()

Der konkrete Name richtet sich nach der bestehenden
CatchTrack-Architektur.

Wichtig ist die Trennung:

Weather intern
↓
öffentliche Schnittstelle
↓
andere Module

⸻

48. Wetter – Fehlerbehandlung

Wetterfehler werden über die bestehende Runtime-Fehlerbehandlung
verarbeitet.

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

Bei vorhandenem gültigem Tagescache soll dieser weiter verwendet
werden.

⸻

49. Wetter – Speicherbegrenzung

Das Wettermodul soll möglichst wenig dauerhafte Daten erzeugen.

Daher:

* Tagescache
* keine unbegrenzte Wetterhistorie
* keine dauerhafte Speicherung kompletter API-Antworten
* dauerhafte Wetterdaten nur im Zusammenhang mit gespeicherten
    Fängen

⸻

50. Fish Data – später

Fish Data wird erst nach den Basis-Modulen entwickelt.

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

51. Catchbook – später

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
zusammenführen und deren Funktionen nicht duplizieren.

⸻

52. Equipment – später

Equipment wird zunächst als eigenständiges Modul entwickelt.

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

53. Keine unnötige Parallelentwicklung

Während ein Basis-Modul entwickelt wird:

* keine parallele Fertigstellung des Fangbuchs
* keine parallele Fertigstellung der Fish Database
* keine unnötige Integration unfertiger Module

Ziel ist ein stabiler Unterbau.

⸻

54. Versionsregel

Die erste Zeile dieser Datei enthält immer die Version.

Format:

AI_CONTEXT Version X.Y

Die zweite Zeile enthält das Änderungsdatum.

Format:

Updated: YYYY-MM-DD

Aktuelle Version:

2.2

Versionsänderungen müssen dokumentiert werden.

⸻

55. Änderungsprinzip für diesen AI Context

Vor jeder Änderung:

1. aktuelle GitHub-Version einlesen
2. aktuelle Versionsnummer feststellen
3. vorhandene Informationen prüfen
4. Änderungen integrieren
5. Versionsnummer erhöhen
6. Änderungsdatum aktualisieren
7. vollständige Datei ausgeben

Wenn die bestehende Struktur schlecht oder beschädigt ist, darf
eine neue Master-Version erstellt werden.

Gültige Projektinformationen dürfen dabei nicht verloren gehen.

⸻

56. Dokumentationsänderungen – VERBINDLICHE REGEL

Eine bereits aktuelle Projektdokumentation darf nicht ohne
konkreten Änderungsgrund erneut überarbeitet werden.

Vor jeder Änderung an einer Dokumentationsdatei muss geprüft werden:

1. Ist die Datei bereits vorhanden?
2. Welche Version besitzt sie?
3. Wann wurde sie zuletzt aktualisiert?
4. Welche Inhalte enthält sie bereits?
5. Ist die gewünschte Information bereits enthalten?
6. Widerspricht sie dem tatsächlichen GitHub-Stand?
7. Muss tatsächlich etwas geändert werden?

Wenn die Datei bereits aktuell ist:

Datei aktuell
↓
keine Änderung
↓
keine neue Ersatzdatei
↓
keine Wiederholung

Es darf nicht automatisch eine bereits vorhandene
PROJECT_KNOWLEDGE.md, PROJECT_STATUS.md, PROJECT_ARCHITECTURE.md,
PROJECT_TEST_PLAN.md oder andere Dokumentationsdatei neu erstellt
werden.

Nur der tatsächlich notwendige Änderungsbereich wird ergänzt
oder korrigiert.

⸻

57. Dokumentationsrollen nicht vermischen

Die Dokumentationsdateien haben unterschiedliche Aufgaben.

AI_CONTEXT.md
↓
Arbeitsanweisungen für AI

PROJECT_RULES.md
↓
verbindliche Projektregeln

PROJECT_KNOWLEDGE.md
↓
gesammeltes Projektwissen

PROJECT_STATUS.md
↓
aktueller Entwicklungsstand

PROJECT_MODULE_PLAN.md
↓
Entwicklungsplanung

PROJECT_ARCHITECTURE.md
↓
technische Architektur

PROJECT_TEST_PLAN.md
↓
Teststrategie und Teststatus

Eine Information soll nicht nur deshalb in eine andere Datei
kopiert werden, weil sie bereits in einer passenden Referenzdatei
existiert.

Bei Bedarf wird auf die zuständige Datei verwiesen.

⸻

58. Dokumentationsprüfung vor neuem Arbeitsschritt

Wenn ein neuer Arbeitsschritt beginnt, wird nicht automatisch
jede Dokumentationsdatei erneut verändert.

Stattdessen:

Aufgabe bestimmen
↓
zuständige Referenzdatei bestimmen
↓
aktuelle Datei lesen
↓
Ist-Stand prüfen
↓
Änderung notwendig?

↙          ↘
NEIN         JA
↓            ↓
weiter       gezielt
aktualisieren

Wenn keine Änderung notwendig ist, wird direkt mit der technischen
Arbeit fortgefahren.

⸻

59. Keine unnötigen Wiederholungen

Bereits bestätigte Informationen sollen nicht ohne Grund erneut
erarbeitet werden.

Insbesondere nicht:

* bereits geprüfte Dateistrukturen
* bereits bestätigte Dokumentationsstände
* bereits bestätigte Architekturentscheidungen
* bereits bestätigte Modulreihenfolgen
* bereits bestätigte Dateinamen
* bereits bestätigte Regeln

Bei einer erneuten Prüfung wird nur dann erneut gearbeitet, wenn:

* sich der GitHub-Stand geändert hat
* eine neue Datei hinzugekommen ist
* ein Commit relevant ist
* der Benutzer ausdrücklich eine erneute Prüfung verlangt
* ein Widerspruch festgestellt wurde

⸻

60. Priorität bei widersprüchlichen Informationen

Bei widersprüchlichen Informationen gilt:

1. tatsächlicher GitHub-Dateistand
2. aktueller Commit
3. aktueller Runtime-/Teststatus
4. aktuelle localStorage.json
5. PROJECT_STATUS.md
6. PROJECT_RULES.md
7. PROJECT_KNOWLEDGE.md
8. PROJECT_MODULE_PLAN.md
9. ältere Dokumentation
10. Annahmen

Bei einem nachweisbaren Widerspruch muss dieser benannt werden.

⸻

61. Keine Zugangsdaten

Diese Datei darf niemals enthalten:

* Passwörter
* Access Tokens
* API Keys
* SSH Private Keys
* sonstige geheime Zugangsdaten

⸻

62. Aktueller Übergabepunkt

Der aktuelle technische Schwerpunkt ist zunächst:

Core-Master

Danach:

Weather
↓
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
Catchbook
↓
Statistics / Hitparade

⸻

63. Projektfortsetzung in einem neuen Chat

Bei einer neuen Unterhaltung mit CatchTrack:

1. AI_CONTEXT.md lesen
2. PROJECT_STATUS.md lesen
3. relevante Projektregeln lesen
4. relevanten Modulplan lesen
5. relevante GitHub-Commits prüfen
6. tatsächliche Dateien prüfen
7. bei Runtime-Themen localStorage.json,
    runtime/error.log und runtime/runtime_status.json prüfen
8. tatsächlichen aktuellen Stand bestimmen

Nicht allein anhand des letzten Gesprächs oder einer alten
Erinnerung weiterarbeiten.

⸻

64. Grundsatz für den tatsächlichen Projektstand

Der aktuelle CatchTrack-Stand wird immer aus drei Ebenen bestimmt:

Dokumentation
+
GitHub-Historie
+
aktuelle Dateien
↓
tatsächlicher Projektstand

PROJECT_STATUS.md dient der Orientierung.

GitHub bestätigt, was tatsächlich übertragen wurde.

Der aktuelle Dateiinhalt bestimmt, was tatsächlich vorhanden
und implementiert ist.

⸻

65. Letzte Dokumentationsprüfung

Stand:

09.08.2026

Geprüfte zentrale Dokumentation:

AI_CONTEXT.md
PROJECT_RULES.md
PROJECT_KNOWLEDGE.md
PROJECT_MODULE_PLAN.md
PROJECT_STATUS.md
PROJECT_ARCHITECTURE.md
PROJECT_TEST_PLAN.md

Ergebnis:

Die Dokumentationsrollen sind festgelegt.

PROJECT_KNOWLEDGE.md wird nicht erneut bearbeitet, solange
keine konkrete inhaltliche Änderung erforderlich ist.

Der nächste technische Arbeitsschritt konzentriert sich zunächst
auf den Core-Master.

⸻

66. Core-Master als einmaliger Grundlagen-Schritt

Der Core-Master wird bewusst vor der weiteren Fachmodul-
Entwicklung erstellt.

Ziel ist eine stabile Grundlage, auf der die nachfolgenden
Module aufbauen können.

Der Core soll nach seiner Konsolidierung nicht für jedes neue
Modul erneut verändert werden müssen.

Grundsatz:

Core einmal sauber aufbauen
↓
stabile Schnittstellen
↓
Module darauf aufbauen

Eine spätere Core-Änderung bleibt möglich, wenn eine echte
zentrale technische Notwendigkeit besteht.

Sie darf jedoch nicht durch unnötige modulabhängige Architektur
verursacht werden.

⸻

67. Verbindliche Modul-Gesamtprüfung

Bei der Entwicklung oder Überarbeitung eines Moduls wird immer
zuerst der vollständige tatsächliche Modulordner auf GitHub
eingelesen.

Es darf nicht nur von einer erwarteten Dateiliste ausgegangen
werden.

Beispiel:

modules/weather/

Der komplette Inhalt dieses Ordners muss vor der Erstellung oder
Änderung des Moduls geprüft werden.

Dabei sind zu erfassen:

* alle Dateien
* Dateinamen
* Dateiendungen
* Unterordner
* Konfigurationsdateien
* HTML
* CSS
* JavaScript
* JSON
* Services
* Daten-/Hilfsdateien
* sonstige Dateien

⸻

68. Altbestände innerhalb eines Moduls

Beim Einlesen eines Modulordners muss ausdrücklich geprüft werden,
ob dort Altbestände vorhanden sind.

Ein Altbestand kann beispielsweise sein:

* alte Version einer Datei
* nicht mehr verwendete Datei
* umbenannte Datei
* doppelte Datei
* frühere Implementierung
* Testdatei
* temporäre Datei
* veraltete Konfiguration
* Datei aus einer früheren Modulstruktur

Solche Dateien dürfen nicht einfach ignoriert werden.

Sie werden zunächst als:

LÖSCHKANDIDAT

gekennzeichnet.

⸻

69. Prüfung von Löschkandidaten

Eine Datei darf erst zur Löschung empfohlen werden, nachdem
geprüft wurde:

1. Wird sie von einer anderen Datei importiert?
2. Wird sie dynamisch geladen?
3. Wird sie vom Module Manager referenziert?
4. Wird sie in module.json angegeben?
5. Wird sie vom Router verwendet?
6. Wird sie von Core-Dateien verwendet?
7. Wird sie von anderen Modulen verwendet?
8. Gibt es relevante Referenzen in Konfigurationen?
9. Gehört sie zu einer noch benötigten Funktion?
10. Ist sie lediglich ein veralteter Altbestand?

Erst danach erfolgt die Einstufung:

AKTUELL

oder:

LÖSCHKANDIDAT

⸻

70. Benutzer muss über Löschkandidaten informiert werden

ChatGPT löscht solche Dateien nicht stillschweigend.

Wenn eine Datei nicht mehr benötigt wird, wird sie dem Benutzer
ausdrücklich genannt.

Beispiel:

Altbestand gefunden:

modules/weather/old-weather.js

Bewertung:

nicht mehr verwendet
keine Referenzen gefunden

Empfehlung:

Datei kann gelöscht werden.

Der Benutzer entscheidet anschließend über die tatsächliche
Löschung.

⸻

71. Modul als vollständiges Paket entwickeln

Ein Modul wird grundsätzlich als zusammengehöriges Gesamtpaket
betrachtet.

Vor der Erstellung:

Modulordner prüfen
↓
alle vorhandenen Dateien einlesen
↓
Abhängigkeiten prüfen
↓
Altbestände erkennen
↓
Architektur prüfen
↓
Masterstruktur festlegen
↓
alle benötigten Dateien gemeinsam erstellen

Es wird nicht nur eine einzelne Datei isoliert erstellt, wenn
mehrere Dateien für die Funktion des Moduls erforderlich sind.

⸻

72. Master-Modul in einem Arbeitsgang

Wenn ein Modul fertiggestellt oder grundlegend überarbeitet wird,
sollen nach Möglichkeit alle erforderlichen Dateien des Moduls
in einem Arbeitsgang als abgestimmte Master-Version erstellt
werden.

Beispiel:

modules/weather/

├── module.json
├── weather.html
├── weather.css
└── weather.js

Alle Dateien müssen miteinander harmonieren.

Wenn das Modul weitere Dateien benötigt, werden diese ebenfalls
in derselben Arbeitsphase erstellt.

Beispiel:

modules/equipment/

├── module.json
├── equipment.html
├── equipment.css
├── equipment.js
├── equipmentService.js
└── equipmentData.js

Die Anzahl der Dateien wird nicht künstlich begrenzt.

⸻

73. Keine künstliche Dateierhaltung

Eine vorhandene Datei muss nicht erhalten bleiben, nur weil sie
bereits existiert.

Wenn eine saubere Master-Struktur eine andere Dateiaufteilung
erfordert, darf:

* eine Datei vollständig ersetzt werden
* eine Datei auf mehrere Dateien aufgeteilt werden
* mehrere Dateien zusammengeführt werden
* eine überflüssige Datei als Löschkandidat markiert werden

Dabei müssen alle Abhängigkeiten geprüft werden.

Grundsatz:

Funktionierende und wartbare Gesamtstruktur vor Erhaltung
historischer Altbestände.

⸻

74. Abschluss eines Modul-Arbeitsschritts

Nach Abschluss der Entwicklung eines Moduls muss die Ausgabe
grundsätzlich eine vollständige Übersicht enthalten:

MODUL:
modules/weather/

ZU ERSETZEN:

1. modules/weather/module.json
2. modules/weather/weather.html
3. modules/weather/weather.css
4. modules/weather/weather.js

NEU ZU ERSTELLEN:

5. …

LÖSCHKANDIDATEN:

6. …

UNVERÄNDERT:

7. …

Danach werden die vollständigen Inhalte aller zu ersetzenden oder
neu zu erstellenden Dateien gemeinsam ausgegeben.

⸻

75. Keine unnötigen Einzeldatei-Schritte

Wenn bereits feststeht, dass mehrere Dateien eines Moduls
zusammengehören und gemeinsam angepasst werden müssen, sollen
diese nicht künstlich über mehrere Arbeitsschritte verteilt
werden.

Ziel:

ein Modul
↓
vollständige Analyse
↓
vollständige Master-Version
↓
alle erforderlichen Dateien
↓
ein Kopier-/Übertragungsvorgang
↓
Commit
↓
Gesamttest

⸻

76. Modul-Abschlussprüfung

Ein Modul gilt erst als technisch abgeschlossen, wenn:

* vollständiger Modulordner geprüft
* alle benötigten Dateien vorhanden
* Dateien miteinander abgestimmt
* Abhängigkeiten geprüft
* Altbestände identifiziert
* Löschkandidaten dokumentiert
* Mehrsprachigkeit berücksichtigt
* Fehlerbehandlung berücksichtigt
* Runtime-System berücksichtigt
* Daten-Schnittstellen geprüft
* Modul getestet
* keine ungeklärten kritischen Fehler bestehen

Danach kann das Modul als MASTER eingestuft werden.

⸻

77. Vollständige Ausgabe einer Ersatzdatei

Wenn eine vollständige Datei als Ersatzdatei ausgegeben wird,
muss sie grundsätzlich möglichst in einem einzigen Copyblock
ausgegeben werden.

Bei mehreren Dateien eines Moduls gilt:

Alle Dateien werden vollständig und gemeinsam in derselben
Antwort ausgegeben.

Es soll nicht vorkommen, dass beispielsweise sechs zusammen-
gehörende Dateien über sechs aufeinanderfolgende Antworten
verteilt werden.

Ziel ist, dass der Benutzer die Dateien direkt übernehmen und
in Working Copy kopieren kann.

⸻

78. Gemeinsame Ausgabe zusammengehörender Dateien

Wenn mehrere Dateien technisch zusammengehören, werden sie
möglichst vollständig gemeinsam ausgegeben.

Beispiel:

ZU ERSETZEN:

modules/gps/module.json
modules/gps/gps.html
modules/gps/gps.css
modules/gps/gps.js

Dann:

Datei 1 – module.json
[vollständiger Copyblock]

Datei 2 – gps.html
[vollständiger Copyblock]

Datei 3 – gps.css
[vollständiger Copyblock]

Datei 4 – gps.js
[vollständiger Copyblock]

Nicht:

eine Datei
↓
Benutzer übernimmt
↓
nächste Antwort
↓
zweite Datei
↓
Benutzer übernimmt
↓
nächste Antwort

Alle zusammengehörenden Dateien sollen in einer Antwort
bereitgestellt werden.

⸻

79. Keine unnötigen Wiederholungen bei Dateiausgaben

Eine bereits als fertig übergebene Datei wird nicht erneut
vollständig ausgegeben, solange sie nicht tatsächlich geändert
werden muss.

Bei einem Folgearbeitsschritt werden nur die Dateien ausgegeben,
die:

* neu erstellt werden müssen
* tatsächlich ersetzt werden müssen
* oder deren Inhalt sich tatsächlich geändert hat.

Unveränderte Dateien werden in der Übersicht als UNVERÄNDERT
aufgeführt, aber nicht erneut als Copyblock ausgegeben.

⸻

80. Verbindlicher Arbeitsablauf mit „OK“

Der Benutzer arbeitet die von ChatGPT bereitgestellten Dateien
über Working Copy und GitHub ab.

Daher gilt:

ChatGPT erstellt vollständige Dateien
↓
Benutzer übernimmt die Dateien
↓
Benutzer lädt / committet sie
↓
Benutzer schreibt „OK“
↓
ChatGPT betrachtet den vorherigen Arbeitsschritt als erledigt
↓
ChatGPT prüft bei einem GitHub-Schritt den aktuellen Stand
↓
ChatGPT fährt mit dem nächsten logischen Schritt fort

„OK“ ist keine Aufforderung zu einer erneuten Bestätigung.

Wenn der vorherige Schritt beispielsweise die Übernahme einer
Datei war, bedeutet „OK“, dass diese Übernahme erfolgt ist.

Wenn der vorherige Schritt ein Commit war, bedeutet „OK“, dass
der Benutzer diesen Commit durchgeführt hat.

Der tatsächliche GitHub-Stand wird anschließend trotzdem
technisch geprüft, bevor daraus weitere Aussagen über den
Repository-Stand abgeleitet werden.

⸻

81. Arbeitsablauf bei mehreren Dateien

Wenn mehrere Dateien gemeinsam erstellt oder ersetzt werden:

1. vollständigen Änderungsumfang feststellen
2. alle betroffenen Dateien analysieren
3. Abhängigkeiten zwischen den Dateien prüfen
4. Master-Versionen gemeinsam erstellen
5. alle Dateien in einer Antwort ausgeben
6. jede Datei möglichst in genau einem Copyblock
7. Benutzer übernimmt alle Dateien
8. Benutzer bestätigt mit „OK“
9. aktuellen GitHub-Stand prüfen
10. erst danach nächsten Arbeitsschritt beginnen

Dadurch sollen unnötige Zwischenübertragungen und wiederholte
Dateiausgaben vermieden werden.

⸻

82. Abschluss eines Modul-Arbeitsschritts

Nach Abschluss der Entwicklung eines Moduls muss die Ausgabe
grundsätzlich eine vollständige Übersicht enthalten:

ZU ERSETZEN

* Dateien

NEU ZU ERSTELLEN

* Dateien

LÖSCHKANDIDATEN

* Dateien
* kurze Begründung

UNVERÄNDERT

* Dateien

Danach werden alle zu ersetzenden und neu zu erstellenden Dateien
vollständig und gemeinsam ausgegeben.

Möglichst jede Datei in genau einem Copyblock.

⸻

83. Nach dem Benutzer-Commit

Wenn der Benutzer nach einer Dateiübernahme oder einem
Entwicklungsschritt „OK“ meldet und der vorherige Schritt einen
GitHub-Commit voraussetzte, wird der aktuelle GitHub-Stand erneut
geprüft.

Dabei sind zu kontrollieren:

* Datei vorhanden
* aktueller Dateiinhalt
* Commit
* Commit-SHA
* relevante Abhängigkeiten
* Modulstruktur

Anschließend wird der tatsächlich erreichte Stand bestätigt.

⸻

84. Keine stillschweigenden Löschungen

Dateien dürfen nicht stillschweigend gelöscht werden.

Wenn eine Datei nicht mehr benötigt wird:

1. Datei prüfen
2. Referenzen prüfen
3. Altbestand feststellen
4. als LÖSCHKANDIDAT aufführen
5. Begründung nennen

Die Löschung erfolgt erst nach ausdrücklicher Entscheidung bzw.
dem dafür vorgesehenen Benutzer-Arbeitsschritt.

⸻

85. Keine unnötige Core-Änderung durch Module

Ein Fachmodul darf grundsätzlich keine Änderungen an:

* app.js
* zentraler Datenbankarchitektur
* schema.sql
* zentralem Module Manager
* zentralem Runtime-System
* zentralem Language-System

erzwingen.

Wenn eine solche Änderung notwendig erscheint, muss zuerst
geprüft werden, ob die Funktion nicht über eine vorhandene
Core-Schnittstelle gelöst werden kann.

Nur wenn eine echte zentrale Architekturänderung erforderlich
ist, darf der Core angepasst werden.

⸻

86. Core-Master vor Fachmodulen

Der Core-Master wird als einmaliger grundlegender
Konsolidierungsschritt durchgeführt.

Danach werden Fachmodule auf den stabilen Core-Schnittstellen
aufgebaut.

Ziel:

Core
↓
stabile APIs / Services
↓
GPS
Weather
Tide
Moon
Waters
Equipment
…
↓
integrative Module

Ein neues Fachmodul soll möglichst nur:

* seinen eigenen Modulordner
* seine eigenen Daten
* seine eigene Konfiguration
* und gegebenenfalls seine eigene Migration

benötigen.

⸻

87. Verbindlicher Grundsatz

Bei jedem Modul zuerst den tatsächlichen Ordner prüfen.

Niemals nur von einer erwarteten Dateiliste ausgehen.

Altbestände erkennen und ausdrücklich melden.

Löschkandidaten nicht stillschweigend entfernen.

Alle für das Modul erforderlichen Dateien möglichst in einem
Arbeitsgang als abgestimmte Master-Version erstellen.

Am Ende alle zu ersetzenden, neu zu erstellenden und eventuell
löschbaren Dateien gemeinsam auflisten.

Vollständige Dateien möglichst immer in einer einzigen Antwort
ausgeben.

„OK“ bedeutet: vorherigen Arbeitsschritt als erledigt behandeln
und mit dem nächsten logischen Schritt fortfahren.

Nach einem GitHub-relevanten Arbeitsschritt wird der tatsächliche
GitHub-Stand geprüft.

Erst danach wird der nächste technische Arbeitsschritt begonnen.

⸻

Ende AI_CONTEXT