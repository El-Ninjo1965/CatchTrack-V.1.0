# CATCHTRACK V1.0 – AKTUELLER PROJEKT-WISSENSSTAND
Version: 1.1
Stand: 09.08.2026
Referenz: GitHub Repository El-Ninjo1965/CatchTrack-V.1.0
==================================================
1. VERBINDLICHE REFERENZ
==================================================
GitHub ist die maßgebliche Referenz für den tatsächlichen
Projektstand.
Repository:
El-Ninjo1965/CatchTrack-V.1.0
Branch:
main
Die tatsächliche Projektstruktur, vorhandene Dateien,
Commit-Historie und aktuellen Datei-Inhalte sind bei jeder
Fortsetzung zu berücksichtigen.
Zusätzlich relevante Referenzdateien:
- AI_CONTEXT.md
- PROJECT_RULES.md
- PROJECT_STATUS.md
- PROJECT_MODULE_PLAN.md
Bei Architekturfragen zusätzlich:
- PROJECT_ARCHITECTURE.md
Bei Testfragen zusätzlich:
- PROJECT_TEST_PLAN.md
Bei Runtime-/Fehlerfragen zusätzlich:
- runtime/error.log
- runtime/runtime_status.json
- localStorage.json
Es gilt:
Dokumentation beschreibt den geplanten bzw. dokumentierten Stand.
GitHub-Dateien und Git-Historie bestimmen zusammen mit dem
tatsächlichen Verhalten den realen Stand.
==================================================
2. PROJEKTREGELN
==================================================
PROJECT_RULES.md ist die verbindliche Projektgrundlage.
Aktuelle Version:
2.1
Stand:
08.08.2026
Wichtige Grundsätze:
- keine fertigen Funktionen unnötig erneut erstellen
- keine fertigen Dateien ohne Grund verändern
- keine bestehenden Abläufe unbeabsichtigt verändern
- keine Module unnötig parallel entwickeln
- Abhängigkeiten berücksichtigen
- zentrale Datenbank verwenden
- Daten mehrbenutzerfähig planen
- automatisch ermittelte Daten als Vorschläge behandeln
- Benutzerkorrekturen ermöglichen
- historische Fangdaten stabil halten
- klare Modulschnittstellen verwenden
- vollständige Ersatzdateien verwenden
==================================================
3. AKTUELLE ENTWICKLUNGSSTRATEGIE
==================================================
Die ursprüngliche Entwicklungsreihenfolge wurde zugunsten einer
technisch sinnvolleren Vorgehensweise angepasst.
Viele vorhandene Module sind derzeit nur Vorentwicklungen.
Zuerst werden möglichst unabhängige Daten- und Basis-Module
vollständig stabilisiert.
Danach werden die komplexeren Integrationsmodule entwickelt.
Grundprinzip:
BASISMODULE
↓
STABILE DATEN
↓
STABILE SCHNITTSTELLEN
↓
INTEGRATION
↓
FANGBUCH
↓
STATISTIK / HITPARADE
==================================================
4. AKTUELLE REIHENFOLGE
==================================================
Aktueller Schwerpunkt:
1. Weather
2. GPS
3. Tides
4. Moon
5. Waters
6. Equipment
Danach:
7. Fish Data
8. Fish Database
9. Catchbook / Fangbuch
10. Statistics
11. Records / Hitparade
Die Reihenfolge darf geändert werden, wenn technische
Abhängigkeiten dies erforderlich machen.
Es soll jedoch nicht einfach alphabetisch gearbeitet werden.
Entscheidend sind:
- Abhängigkeiten
- Datenstrukturen
- Schnittstellen
- vorhandene Implementierungen
- Testbarkeit
- späterer Integrationsbedarf
==================================================
5. BASISSKELETT
==================================================
Das Basisskelett des Projekts steht.
Vorhanden sind unter anderem:
- Core
- Database
- Services
- Config
- Module-Struktur
- zentrale Datenstrukturen
- Moduldefinitionen
- UI-Grundstruktur
Die vorhandene Struktur wird nicht unnötig neu aufgebaut.
Vorhandene Dateien werden zuerst gelesen und bewertet.
==================================================
6. MODULE
==================================================
In config/modules.json sind aktuell folgende Module definiert:
1. Start
2. Admin
3. Catches
4. Catchbook
5. Fish Database
6. Equipment
7. GPS
8. Maps
9. Waters
10. Statistics
11. Records
12. Leaderboard
13. Weather
14. Tides
15. Moon
16. AI
17. Bluetooth
18. Backup
19. Export
20. Conditions
21. Photos
22. Safety
23. Settings
Die tatsächliche Implementierung ist unterschiedlich weit
fortgeschritten.
Wichtig:
Die bloße Existenz eines Modulordners oder einer Datei bedeutet
NICHT automatisch, dass das Modul funktional fertig ist.
==================================================
7. AKTUELLER MODULSTATUS
==================================================
Start:
- Grundfunktion vorhanden
- Startoberfläche vorhanden
Admin:
- Grundstruktur vorhanden
- Verwaltungsoberfläche vorhanden
Catches:
- bereits relativ weit entwickelt
- nicht als leeres Skelett behandeln
- vollständige Integration noch offen
Catchbook:
- bereits relativ weit entwickelt
- endgültige Integrationsarchitektur noch offen
Fish Database:
- Grundverwaltung vorhanden
- funktionale Erweiterung erforderlich
Equipment:
- Grundverwaltung vorhanden
- funktionale Erweiterung erforderlich
- wird als eigenständiges Modul weiterentwickelt
GPS:
- Grundfunktion vorhanden
- weitere Funktionen erforderlich
Maps:
- vorbereitete Grundstruktur
- weitere Funktionalität erforderlich
Waters:
- Grundverwaltung vorhanden
- Gewässer können grundsätzlich erfasst werden
- weitere Integration/Funktionalität erforderlich
Statistics:
- Grundgerüst vorhanden
- Auswertungslogik noch auszubauen
Records:
- Grundfunktion vorhanden
- weitere Logik erforderlich
Leaderboard:
- Grundgerüst vorhanden
- weitere Daten-/Auswertungslogik erforderlich
Weather:
- vorhanden
- aktueller Entwicklungsschwerpunkt
- muss für den aktuellen Projektstand vollständig geprüft
  und stabilisiert werden
Tides:
- überwiegend Vorbereitung/Platzhalter
- vollständige Funktionalität noch erforderlich
Moon:
- einfache Grundberechnung vorhanden
- weitere Integration/Funktionalität erforderlich
AI:
- Vorbereitung/Grundstruktur
- eigentliche AI-Funktionalität noch nicht vollständig umgesetzt
Bluetooth:
- Grundfunktion/Grundstruktur vorhanden
- Geräte-/Sensorintegration noch nicht vollständig
Backup:
- Grundstruktur vorhanden
- Backup/Restore noch vollständig umzusetzen
Export:
- Grundgerüst vorhanden
- JSON-/CSV-Export vorbereitet
Conditions:
- Grundgerüst/Platzhalter
- Angelbedingungen noch funktional aufzubauen
Photos:
- lokale Speicherung grundsätzlich vorhanden
- noch nicht vollständig mit Fängen und Datenmodell gekoppelt
Safety:
- Grundstruktur vorhanden
- vollständige Sicherheitsfunktionen noch ausstehend
Settings:
- Grundfunktion vorhanden
- weitere Einstellungen/Integration erforderlich
==================================================
8. GIT-HISTORIE
==================================================
Die Git-Historie wird zur Beurteilung des tatsächlichen
Entwicklungsstands herangezogen.
Viele vorhandene Dateien wurden am 08.08.2026 gemeinsam in das
neue Repository übertragen.
Deshalb darf aus einem Übertragungs-Commit nicht geschlossen
werden, dass die betreffende Datei an diesem Tag vollständig
neu entwickelt oder fertiggestellt wurde.
Die Git-Historie dient insbesondere dazu:
- vorhandene Entwicklungsstände einzuordnen
- spätere Änderungen zu erkennen
- Versionen zu unterscheiden
- Bearbeitungszeitpunkte zu rekonstruieren
- Dateien und Funktionen einem Entwicklungsabschnitt
  zuzuordnen
Ein Commit ist kein automatischer Beweis für eine fertige
Funktion.
Entscheidend ist die Kombination aus:
GitHub-Dateistand
+
Commit-Historie
+
PROJECT_STATUS.md
+
PROJECT_RULES.md
+
tatsächliche Funktionalität.
==================================================
9. WEATHER-MODUL
==================================================
Weather ist aktuell der erste Entwicklungsbereich der neuen
Basis-Modul-Strategie.
Aktueller Ordner:
modules/weather/
Enthalten:
- module.json
- weather.js
- weather.html
- weather.css
Alle Dateinamen sind kleingeschrieben.
Varianten wie:
- Weather.js
- Weather.html
- Weather.css
- Weather.cs
gelten nicht als vorhandene Dateien.
Das Weather-Modul soll nicht nur eine Anzeige sein.
Es ist eine Datenquelle für spätere Module.
==================================================
10. WEATHER – ZIEL
==================================================
Weather soll:
- aktuellen Standort verwenden
- Wetter für den aktuellen Aufenthaltsort anzeigen
- alternative Orte suchen lassen
- mindestens 7 Tage Forecast anzeigen
- möglichst 10 Tage Forecast anzeigen
- grafische Wetterdarstellung verwenden
- Wetter-Symbole anzeigen
- Temperatur anzeigen
- Luftdruck anzeigen
- Luftfeuchtigkeit anzeigen
- Niederschlag anzeigen
- Regenwahrscheinlichkeit anzeigen
- Windgeschwindigkeit anzeigen
- Windrichtung anzeigen
- relevante weitere Wetterdaten bereitstellen
Die Oberfläche muss übersichtlich bleiben.
Nicht benötigte Wetterdaten sollen nicht unnötig dauerhaft
gespeichert werden.
==================================================
11. WEATHER – STANDORT
==================================================
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
Der Benutzer soll beispielsweise das Wetter für einen Ort
anzeigen können, an den er am nächsten Tag fahren möchte.
Der Wetterort und der tatsächliche Fangort müssen getrennt
bleiben.
Ein manuell ausgewählter Wetterort darf den späteren Fangort
nicht verändern.
==================================================
12. WEATHER – FORECAST
==================================================
Mindestziel:
7 Tage
Bevorzugtes Ziel:
10 Tage
Die Darstellung soll grafisch erfolgen.
Wetter-Symbole des Providers sollen verwendet werden,
soweit dies technisch sinnvoll und lizenzrechtlich zulässig ist.
==================================================
13. WEATHER – DATENMODELL
==================================================
Das interne Wetterdatenmodell muss die später für das Fangbuch
relevanten Daten unterstützen.
Dazu gehören insbesondere:
- Temperatur
- gefühlte Temperatur
- Wetterzustand
- Wettercode
- Wetter-Symbol
- Niederschlag
- Regenwahrscheinlichkeit
- Luftdruck
- Luftfeuchtigkeit
- Windgeschwindigkeit
- Windrichtung
- Windböen
- Bewölkung
- UV-Index
- Sonnenaufgang
- Sonnenuntergang
- Latitude
- Longitude
- Ortsname
- Zeitpunkt
- Provider
Interne Daten bleiben sprachneutral.
==================================================
14. WEATHER – PROVIDER
==================================================
Vorgesehener erster Provider:
Open-Meteo
Der Provider muss austauschbar bleiben.
Provider-spezifische Details dürfen nicht fest mit der
Darstellung gekoppelt werden.
Die Architektur muss später alternative Wetteranbieter
ermöglichen.
==================================================
15. WEATHER – API-KONFIGURATION
==================================================
Die Wetter-API soll später über den Admin-Bereich konfigurierbar
sein.
Mögliche Einstellungen:
- Provider
- API-URL
- API-Key
- Forecast-Tage
- Aktualisierungsoptionen
- Providerparameter
Open-Meteo benötigt zunächst keinen API-Key.
Die Architektur muss trotzdem optionale API-Keys unterstützen.
==================================================
16. WEATHER – TAGESCACHE
==================================================
Das Wettermodul soll einen Tagescache verwenden.
Grundprinzip:
Erster Abruf des Tages
↓
API-Abfrage
↓
Tagescache
Der Cache soll grundsätzlich bis 00:00 Uhr Ortszeit gültig sein.
Zusätzlich:
- anderer Standort → eigener Cache
- manueller Refresh → Cache umgehen
- API-Ausfall → gültigen Cache verwenden
- kein Cache + API-Ausfall → Fehlerbehandlung
Der Cache ist keine Wetterhistorie.
==================================================
17. WEATHER – DATENMENGE
==================================================
Das Wettermodul soll keine unnötige dauerhafte Datenmenge erzeugen.
Daher:
- aktuelle Daten beim Aufruf
- gültiger Tagescache
- keine unbegrenzte Wetterhistorie
- keine dauerhafte Speicherung kompletter API-Antworten
Dauerhafte Wetterdaten werden später im Zusammenhang mit
gespeicherten Fängen als historische Snapshots benötigt.
==================================================
18. WEATHER – FANGBUCH-SNAPSHOT
==================================================
Wenn später ein Fang gespeichert wird:
Fang speichern
↓
relevanten Wetterdatensatz bestimmen
↓
Wetter-Snapshot dem Fang zuordnen
Damit bleibt die historische Wetterinformation eines Fangs
auch dann erhalten, wenn sich die Daten des Wetterdienstes
später ändern.
==================================================
19. WEATHER – SCHNITTSTELLE
==================================================
Andere Module dürfen nicht auf interne Variablen oder
HTML-Elemente des Weather-Moduls zugreifen.
Weather muss eine definierte öffentliche Schnittstelle besitzen.
Beispiel:
Weather.getData(latitude, longitude, timestamp)
Der konkrete Name richtet sich nach der endgültigen
CatchTrack-Architektur.
Das Fangbuch soll später Weather verwenden und nicht selbst
die Wetterermittlung implementieren.
==================================================
20. GPS
==================================================
GPS ist ein eigenständiges Grundmodul.
Es soll unter anderem unterstützen:
- aktuellen Standort ermitteln
- Home-Standort verwalten
- Fangposition ermitteln
- Gewässerposition ermitteln
- Standort manuell auswählen
- Standort bearbeiten
- gespeicherte Standorte verwalten
- Entfernungen berechnen
- Standort teilen
Beispielhafte Schnittstellen:
GPS.getCurrentLocation()
GPS.getHomeLocation()
GPS.saveHomeLocation()
GPS.saveLocation()
GPS.getLocation()
GPS.calculateDistance()
GPS.shareLocation()
GPS soll später als zentrale Standortquelle für andere Module
dienen.
==================================================
21. TIDES
==================================================
Tides ist ein eigenständiges Datenmodul.
Es soll später:
- aktuelle Tide
- kommende Tide
- Hochwasser
- Niedrigwasser
- Zeitpunkt
- Höhe
- Standortabhängigkeit
bereitstellen.
Die Daten sollen über eine definierte Schnittstelle
anderen Modulen zur Verfügung stehen.
Die Tide-API soll später über den Admin-Bereich austauschbar
bzw. konfigurierbar sein.
==================================================
22. MOON
==================================================
Moon ist ein eigenständiges Datenmodul.
Es soll später unter anderem liefern:
- Mondphase
- Beleuchtungsgrad
- Mondaufgang
- Monduntergang
- weitere relevante Mondinformationen
Die Berechnung bzw. Abfrage erfolgt anhand des relevanten
Zeitpunktes und gegebenenfalls Standortes.
==================================================
23. WATERS
==================================================
Waters ist ein eigenständiges Modul für Gewässer.
Es soll:
- Gewässer verwalten
- Gewässerpositionen speichern
- Gewässer suchen
- Gewässer anhand GPS vorschlagen
- Gewässer anderen Modulen bereitstellen
Beispiel:
Waters.getNearby(latitude, longitude)
==================================================
24. EQUIPMENT
==================================================
Equipment wird als eigenständiges Modul entwickelt.
Geplante Bereiche:
- Ruten
- Rollen
- Schnüre
- Vorfächer
- Haken
- Köder
- Kunstköder
- Zubehör
- weitere Ausrüstung
Ziel:
Equipment soll zunächst unabhängig funktionieren.
Danach kann das Fangbuch ausgewählte Equipment-Daten
einem Fang zuordnen.
==================================================
25. FISH DATA / FISH DATABASE
==================================================
Fish Data bzw. Fish Database wird nach den unabhängigen
Basis-Modulen weiterentwickelt.
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
Die Datenbank soll später als zentrale Referenz für
Fischinformationen dienen.
==================================================
26. CATCHBOOK / FANGBUCH
==================================================
Das Fangbuch wird erst nach Stabilisierung der benötigten
Basisdaten vollständig integriert.
Geplante Daten:
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
Das Fangbuch soll Daten aus anderen Modulen verwenden und
deren interne Logik nicht duplizieren.
==================================================
27. STATISTICS
==================================================
Statistics wird nach Aufbau einer ausreichenden Datenbasis
entwickelt.
Mögliche Auswertungen:
- Anzahl Fänge
- Gewicht
- Länge
- Fischarten
- Gewässer
- Köder
- Fangmethoden
- Wetterbedingungen
- Tide
- Mond
- Equipment
- Zeiträume
==================================================
28. RECORDS / HITPARADE
==================================================
Records / Hitparade wird nach dem Fangbuch entwickelt.
Grundlage:
Catchbook
↓
Records
↓
Hitparade
Die Auswertung soll auf den tatsächlich gespeicherten,
bestätigten Fangdaten beruhen.
==================================================
29. AUTOMATISCH ERMITTELTE DATEN
==================================================
Automatisch ermittelte Daten sind grundsätzlich Vorschläge.
Sie dürfen nicht als unveränderbare Werte behandelt werden.
Das gilt insbesondere für:
- Datum
- Uhrzeit
- GPS
- Gewässer
- Temperatur
- Luftdruck
- Luftfeuchtigkeit
- Wind
- Niederschlag
- Wetterzustand
- Gezeiten
- Mondinformationen
Der Benutzer muss Werte korrigieren können, wenn dies fachlich
sinnvoll ist.
==================================================
30. DATENHERKUNFT
==================================================
Wenn ein automatisch ermittelter Wert verändert werden kann,
muss die Herkunft nachvollziehbar bleiben.
Beispiel:
temperature
temperature_source
Mögliche Quellen:
- api
- gps
- calculated
- user
Alternativ:
temperature_auto
temperature_user
Der bestätigte Benutzerwert hat für den entsprechenden
Datensatz Vorrang.
==================================================
31. HISTORISCHE DATEN
==================================================
Bereits gespeicherte Fangdaten dürfen nicht rückwirkend durch
spätere Änderungen externer Datenanbieter verändert werden.
Beispiel:
Ein Wetterdienst ändert später historische Daten.
Ein bereits gespeicherter Fang behält den beim Fang
bestätigten Wetter-Snapshot.
Das gleiche Prinzip gilt für:
- Tide
- Mond
- GPS
- Gewässer
- andere automatisch ermittelte Fangdaten
==================================================
32. ZENTRALE DATENBANK
==================================================
CatchTrack verwendet grundsätzlich eine zentrale SQLite-Datenbank.
Es werden keine unabhängigen Datenbanken pro Modul angelegt.
Gründe:
- Beziehungen zwischen Daten
- Benutzerzuordnung
- Datenintegrität
- Backups
- Statistiken
- Datenmigrationen
- Vermeidung redundanter Daten
Die Datenlogik bleibt innerhalb der jeweiligen Module gekapselt.
==================================================
33. MEHRBENUTZERFÄHIGKEIT
==================================================
CatchTrack muss mehrere unabhängige Benutzer unterstützen.
Jeder Benutzer besitzt eine eindeutige user_id.
Benutzerbezogene Daten müssen, soweit relevant, einer user_id
zugeordnet werden.
Beispiele:
catches.user_id
waters.user_id
photos.user_id
saved_locations.user_id
Statistiken müssen immer auf den jeweiligen Benutzer
begrenzt werden.
==================================================
34. SPRACHEN / MULTILINGUALITÄT
==================================================
CatchTrack wird von Anfang an multilingual konzipiert.
Die Anwendung darf nicht dauerhaft auf Deutsch oder Englisch
beschränkt werden.
Jedes Modul muss multilingual nutzbar sein.
Die Sprache kann:
A) automatisch anhand der bevorzugten Sprache des Endgerätes
   bzw. Browsers erkannt werden
oder
B) manuell durch den Benutzer ausgewählt werden.
Die manuelle Auswahl hat Vorrang.
==================================================
35. ZENTRALES LANGUAGE-/I18N-SYSTEM
==================================================
Die einzelnen Module entwickeln keine eigene Sprachverwaltung.
Langfristig wird ein zentrales Language-/i18n-System verwendet.
Es betrifft:
- Menüs
- Buttons
- Überschriften
- Beschriftungen
- Hinweise
- Fehlermeldungen
- Statusmeldungen
- Dialoge
- Einstellungen
- Filter
- Auswahlwerte
Interne Daten bleiben sprachneutral.
Beispiel:
pressure = 1013.2
Darstellung:
Deutsch:
Luftdruck
English:
Pressure
==================================================
36. KEINE FEST CODIERTEN BENUTZERTEXTE
==================================================
Benutzertexte sollen über Übersetzungsschlüssel bzw. das
zentrale Sprachsystem bereitgestellt werden.
Beispiel:
t(„weather.temperature“)
statt:
„Temperature“
Der konkrete technische Aufbau wird später im zentralen
Language-System festgelegt.
==================================================
37. RUNTIME / ERROR
==================================================
Grundstruktur:
Fehler
↓
core/errorHandler.js
↓
core/runtimeStorage.js
↓
LocalStorage
↓
localStorage.json
Zusätzlich:
runtime/error.log
runtime/runtime_status.json
Bei Fehleranalysen sind alle relevanten Runtime-Quellen
abzugleichen.
==================================================
38. LOCALSTORAGE
==================================================
`localStorage.json` ist ein wichtiger Snapshot der
persistierten Laufzeitdaten.
Wenn der Benutzer eine aktualisierte Datei über Working Copy
überträgt, muss diese Version bei der nächsten Analyse
berücksichtigt werden.
Bestehende Daten dürfen nicht unbeabsichtigt überschrieben
werden.
==================================================
39. FEHLER IN VORENTWICKLUNGEN
==================================================
Ein Fehler in einem noch nicht fertig entwickelten Modul
bedeutet nicht automatisch, dass dieses Modul sofort
fertiggestellt werden muss.
Zuerst prüfen:
- Modulstatus
- Einbindung
- erwarteter Initializer
- aktuelle Entwicklungsphase
- Ursache des Fehlers
- Zusammenhang mit dem aktuellen Test
Unfertige Module werden nicht unnötig parallel bearbeitet.
==================================================
40. VOLLSTÄNDIGE DATEIEN
==================================================
Bei Änderungen werden grundsätzlich vollständige Dateien
ausgegeben.
Keine:
- Patch-Fragmente
- Such-/Ersetzungsanweisungen
- unvollständigen Codeabschnitte
- einzelnen Zeilenänderungen
Vor einer Änderung einer bestehenden Datei:
1. aktuelle Datei auf GitHub einlesen
2. Inhalt analysieren
3. Abhängigkeiten prüfen
4. Änderungsumfang bestimmen
5. vollständige neue Version erstellen
Wenn eine bestehende Struktur keinen sinnvollen Erhalt mehr
zulässt, darf eine vollständige Master-Version erstellt werden.
==================================================
41. PROJEKTSTATUS
==================================================
PROJECT_STATUS.md ist die zentrale Statusübersicht.
Sie dokumentiert:
- vorhandene Module
- Entwicklungsstatus
- offene Aufgaben
- bekannte Fehler
- aktuelle Entwicklungsphase
- nächsten Arbeitsschritt
Der Status muss regelmäßig mit dem tatsächlichen GitHub-Stand
abgeglichen werden.
==================================================
42. GITHUB-COMMIT-HISTORIE
==================================================
Bei einer Bestandsaufnahme werden:
- aktuelle Datei
- Commit-Historie
- Commit-Datum
- Commit-Nachricht
- relevante Änderungen
miteinander verglichen.
Das Dateidatum allein reicht nicht aus.
Ein Übertragungs-Commit bedeutet nicht automatisch,
dass die Datei vollständig fertig entwickelt wurde.
==================================================
43. MASTERPRINZIP
==================================================
CatchTrack wird nach folgendem Prinzip entwickelt:
ZENTRALE DATENBANK
+
MEHRBENUTZERFÄHIGKEIT
+
UNABHÄNGIGE MODULE
+
KLARE SCHNITTSTELLEN
+
WIEDERVERWENDBARE FUNKTIONEN
+
AUTOMATISCHE DATEN ALS VORSCHLÄGE
+
BENUTZERKORREKTUR
+
HISTORISCHE DATENSTABILITÄT
+
MULTILINGUALITÄT
+
ZENTRALES LANGUAGE-SYSTEM
+
DOKUMENTIERTE ARCHITEKTUR
Ziel ist eine stabile CatchTrack V1.0, bei der neue Funktionen
bestehende Funktionen nicht unnötig verändern oder zerstören.
==================================================
44. ABSOLUTE ARBEITSREGEL
==================================================
Bei Unsicherheit:
NICHT raten.
NICHT von einem alten Projektstand ausgehen.
NICHT fertige Funktionen neu erstellen.
NICHT bestehende Abläufe unnötig verändern.
NICHT Dateien löschen.
Zuerst den aktuellen GitHub-Stand lesen.
Dann Abhängigkeiten prüfen.
Dann die kleinste sinnvolle Änderung planen.
Dann die vollständige betroffene Datei erstellen.
Nach der Übertragung über Working Copy den neuen GitHub-Stand
erneut prüfen.
Erst danach mit dem nächsten Arbeitsschritt fortfahren.
==================================================
45. AKTUELLER ÜBERGABEPUNKT
==================================================
Die aktuelle Projektstrategie befindet sich bei:
WEATHER
Danach:
GPS
↓
TIDES
↓
MOON
↓
WATERS
↓
EQUIPMENT
Danach:
FISH DATA
↓
FISH DATABASE
↓
CATCHBOOK
↓
STATISTICS
↓
RECORDS / HITPARADE
Alle neuen Module müssen bereits bei ihrer Entwicklung
multilingual vorbereitet werden.
==================================================
ENDE PROJECT_KNOWLEDGE
==================================================