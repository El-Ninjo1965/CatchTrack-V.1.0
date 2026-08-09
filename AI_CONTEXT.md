AI_CONTEXT Version 1.9

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
vollständigen Ersatzdateien gemeinsam ausgegeben.

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

Ein „OK“ bestätigt den vorherigen Schritt.

Danach keine unnötige Rückfrage.

Wenn der nächste sinnvolle Schritt selbstständig ermittelt werden
kann, soll er durchgeführt werden.

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

Priorität

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

t(„weather.temperature“)

statt:

„Temperature“

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

24. Entwicklungsstrategie

Die Entwicklung wird bewusst in zwei Gruppen geteilt.

Gruppe A – unabhängige Basis-/Datenmodule

Zuerst:

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

Gruppe B – integrative Module

Danach:

* Fish Data
* Fish Database / Fischkarten
* Catchbook / Fangbuch
* Statistics
* Records
* Hitparade

⸻

25. Verbindliche Entwicklungsreihenfolge

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

Die Reihenfolge kann geändert werden, wenn technische
Abhängigkeiten dies erforderlich machen.

Änderungen müssen bewusst entschieden und dokumentiert werden.

⸻

26. Aktueller Entwicklungsstand

Der aktuelle Fokus liegt auf den unabhängigen Basis-Modulen.

Aktueller Entwicklungsbereich:

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
Catchbook
↓
Statistics / Hitparade

⸻

27. Weather-Modul

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

28. Wetter – Ziel

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

29. Wetter – aktueller Standort

Beim normalen Aufruf wird das Wetter für den aktuellen
Aufenthaltsort des Benutzers angezeigt.

Der Standort wird über GPS bzw. vorhandene
Standortinformationen ermittelt.

Ein fester Standort darf nicht dauerhaft programmiert werden.

⸻

30. Wetter – alternative Orte

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

31. Wetterort und Fangort trennen

Ein manuell ausgewählter Wetterort darf den späteren Fangort
nicht automatisch verändern.

Beispiel:

Wetterort:
Hua Hin
Fangort:
GPS-Position beim tatsächlichen Fang

Beide Informationen bleiben unabhängig.

⸻

32. Wetter – Forecast

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

33. Wetter – wichtige Daten

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

34. Wetter – Provider

Als erster Provider:

Open-Meteo

Der Provider muss austauschbar bleiben.

Provider-spezifische Details dürfen nicht fest mit der
Darstellung gekoppelt werden.

Die Architektur soll alternative Anbieter erlauben.

⸻

35. Wetter – API-Konfiguration

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

36. Wetter – Tagescache

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

37. Wetter – keine permanente Wetterhistorie

Das Wettermodul soll keine unbegrenzte Wetterhistorie speichern.

Nicht dauerhaft sammeln:

* alte Forecasts
* alte API-Antworten
* tägliche Wetterdaten ohne Bezug zu einem Fang

Der Wettercache ist eine technische Optimierung und keine
Wetterdatenbank.

⸻

38. Wetter – Fangbuch-Snapshot

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

39. Wetter – Schnittstelle

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

40. Wetter – Fehlerbehandlung

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

41. Wetter – Speicherbegrenzung

Das Wettermodul soll möglichst wenig dauerhafte Daten erzeugen.

Daher:

* Tagescache
* keine unbegrenzte Wetterhistorie
* keine dauerhafte Speicherung kompletter API-Antworten
* dauerhafte Wetterdaten nur im Zusammenhang mit gespeicherten
    Fängen

⸻

42. Fish Data – später

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

43. Catchbook – später

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

44. Equipment – später

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

45. Keine unnötige Parallelentwicklung

Während ein Basis-Modul entwickelt wird:

* keine parallele Fertigstellung des Fangbuchs
* keine parallele Fertigstellung der Fish Database
* keine unnötige Integration unfertiger Module

Ziel ist ein stabiler Unterbau.

⸻

46. Versionsregel

Die erste Zeile dieser Datei enthält immer die Version.

Format:

# AI_CONTEXT Version X.Y

Die zweite Zeile enthält das Änderungsdatum.

Format:

# Updated: YYYY-MM-DD

Aktuelle Version:

1.9

Versionsänderungen müssen dokumentiert werden.

⸻

47. Änderungsprinzip für diesen AI Context

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

48. Dokumentationsänderungen – VERBINDLICHE REGEL

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
PROJECT_KNOWLEDGE.md, PROJECT_STATUS.md,
PROJECT_ARCHITECTURE.md, PROJECT_TEST_PLAN.md oder andere
Dokumentationsdatei neu erstellt werden.

Nur der tatsächlich notwendige Änderungsbereich wird ergänzt
oder korrigiert.

⸻

49. Dokumentationsrollen nicht vermischen

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

50. Dokumentationsprüfung vor neuem Arbeitsschritt

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

51. Keine unnötigen Wiederholungen

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

52. Priorität bei widersprüchlichen Informationen

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

53. Keine Zugangsdaten

Diese Datei darf niemals enthalten:

* Passwörter
* Access Tokens
* API Keys
* SSH Private Keys
* sonstige geheime Zugangsdaten

⸻

54. Aktueller Übergabepunkt

Der aktuelle Entwicklungsfokus ist:

Weather

Danach:

GPS → Tide → Moon → Waters → Equipment

Danach:

Fish Data → Catchbook → Statistics / Hitparade

⸻

55. Projektfortsetzung in einem neuen Chat

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

56. Grundsatz für den tatsächlichen Projektstand

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

57. Letzte Dokumentationsprüfung

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

Der nächste Arbeitsschritt soll sich auf den tatsächlichen
technischen Projektstand konzentrieren.

⸻

58. Aktueller technischer Fokus

Der nächste technische Arbeitsschritt ist die Prüfung bzw.
Weiterentwicklung des vorhandenen:

modules/weather/

mit:

module.json
weather.js
weather.html
weather.css

Vor Änderungen müssen diese Dateien erneut vollständig eingelesen
und gegen die aktuelle Architektur und den Testplan geprüft werden.

⸻

59. Verbindlicher Grundsatz

Nicht wiederholen, was bereits aktuell ist.

Nicht neu schreiben, was bereits korrekt dokumentiert ist.

Nicht eine Dokumentationsdatei ändern, nur weil eine andere
Information hinzugekommen ist.

Zuerst prüfen, ob die Information bereits in der zuständigen
Datei vorhanden ist.

Nur bei tatsächlichem Änderungsbedarf aktualisieren.

Bei technischen Aufgaben möglichst direkt zur technischen Arbeit
übergehen.

⸻

Ende AI_CONTEXT