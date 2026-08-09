# CatchTrack V1.0 – PROJECT MODULE PLAN
# Version 1.1
# Stand: 09.08.2026
Dateiname:
PROJECT_MODULE_PLAN.md
Projekt:
CatchTrack V1.0
Repository:
El-Ninjo1965/CatchTrack-V.1.0
Branch:
main
Planstatus:
AKTUALISIERTE MASTERFASSUNG
==================================================
1. ZWECK DIESER DATEI
==================================================
Diese Datei ist der verbindliche Entwicklungs-, Integrations- und
Bereinigungsplan für die Module von CatchTrack V1.0.
Sie dient gleichzeitig als:
- To-do-Liste
- Modulreihenfolge
- Abhängigkeitsübersicht
- Datei-Inventar
- Entwicklungsfortschrittskontrolle
- Altlasten-/Löschliste
- Abnahmeplan
- historische Referenz
Der Plan wird während der Entwicklung fortlaufend aktualisiert.
Der tatsächliche Zustand des Projekts wird immer mit dem aktuellen
GitHub-Repository abgeglichen.
==================================================
2. VERBINDLICHE REFERENZEN
==================================================
Für die Projektarbeit werden insbesondere berücksichtigt:
1. PROJECT_RULES.md
2. aktueller GitHub-Dateistand
3. PROJECT_MODULE_PLAN.md
4. PROJECT_KNOWLEDGE.md
5. PROJECT_STATUS.md
6. PROJECT_ARCHITECTURE.md
7. PROJECT_TEST_PLAN.md
8. AI_CONTEXT.md
9. Git-Commit-Historie
GitHub ist die technische Referenz für den tatsächlich vorhandenen
Code.
Die Git-Historie dient zusätzlich zur zeitlichen Einordnung.
Ein vorhandener Commit bedeutet nicht automatisch, dass eine Datei
funktional fertiggestellt wurde.
==================================================
3. GRUNDREGEL FÜR BESTEHENDE DATEIEN
==================================================
Vor der Änderung einer bestehenden Datei:
1. aktuelle Datei auf GitHub lesen
2. vollständigen Inhalt analysieren
3. Imports und Exports prüfen
4. Referenzen prüfen
5. Loader-/Modul-Einbindung prüfen
6. Core-Abhängigkeiten prüfen
7. Service-Abhängigkeiten prüfen
8. Datenbankabhängigkeiten prüfen
9. Git-Historie prüfen
10. tatsächlichen Funktionsumfang bestimmen
Erst danach wird entschieden, ob:
- aktualisiert
- erweitert
- repariert
- oder vollständig neu erstellt
wird.
Eine vollständige Master-Neuerstellung ist ausdrücklich erlaubt,
wenn sie technisch sinnvoller ist als Flickwerk.
==================================================
4. STATUSSYSTEM
==================================================
TODO
noch nicht begonnen
ANALYSE
Bestand wird untersucht
SKELETT
Grundstruktur vorhanden
IN ARBEIT
funktionale Entwicklung läuft
ABHÄNGIG
wartet auf ein anderes Modul / eine andere Funktion
TEST
Entwicklung abgeschlossen, Tests laufen
MASTER
vollständig fertig und freigegeben
ACTIVE
vorhanden und weiterhin relevant, aber noch nicht vollständig
LEGACY
ältere Version / alte Architektur
LÖSCHKANDIDAT
wahrscheinlich nicht mehr benötigt
ZUR LÖSCHUNG FREIGEGEBEN
Abhängigkeiten geprüft, Löschung möglich
GELÖSCHT
aus dem Projekt entfernt
==================================================
5. DATEISTATUS
==================================================
MASTER
Aktuelle Architektur und funktional abgeschlossen.
ACTIVE
Aktuelle Architektur, aber noch in Entwicklung.
LEGACY
Aus älterer Architektur.
UNUSED
Vorhanden, aber nachweislich nicht verwendet.
DELETE CANDIDATE
Kann nach Abhängigkeitsprüfung entfernt werden.
==================================================
6. NEUE ENTWICKLUNGSSTRATEGIE
==================================================
Die ursprüngliche Planung wird zugunsten einer technisch
sinnvolleren Reihenfolge angepasst.
Grundidee:
Zuerst werden möglichst unabhängige Module fertiggestellt.
Danach werden die Module entwickelt, die mehrere Datenquellen
miteinander verbinden.
Insbesondere das Fangbuch soll erst dann vollständig aufgebaut
werden, wenn seine Datenquellen stabil verfügbar sind.
==================================================
7. GRUPPE A – UNABHÄNGIGE BASISMODULE
==================================================
Aktuelle Reihenfolge:
A1 Weather
A2 GPS
A3 Tides
A4 Moon
A5 Waters
A6 Equipment
Diese Module sollen möglichst eigenständig funktionieren.
Ziel:
Modul
↓
Datenmodell
↓
Schnittstelle
↓
Fehlerbehandlung
↓
Test
↓
MASTER
↓
spätere Integration
==================================================
8. WEATHER
==================================================
Pfad:
modules/weather/
Vorhandene Dateien:
- module.json
- weather.js
- weather.html
- weather.css
Wichtig:
Alle Dateinamen sind kleingeschrieben.
Nicht vorhandene Varianten wie:
- Weather.js
- Weather.html
- Weather.css
- Weather.cs
dürfen nicht als fehlend betrachtet werden.
STATUS:
IN ARBEIT
ZIEL:
Weather wird als eigenständige Datenquelle fertiggestellt.
Funktionen:
- aktuellen Standort verwenden
- Wetter für aktuellen Standort anzeigen
- alternative Orte suchen
- Forecast mindestens 7 Tage
- Ziel 10 Tage
- Wetter-Symbole
- Temperatur
- Luftdruck
- Luftfeuchtigkeit
- Niederschlag
- Regenwahrscheinlichkeit
- Windgeschwindigkeit
- Windrichtung
- Windböen
- Bewölkung
- UV
- Sonnenaufgang
- Sonnenuntergang
DATENQUELLE:
Vorgesehener erster Provider:
Open-Meteo
Provider muss austauschbar bleiben.
API-KONFIGURATION:
Langfristig über Admin konfigurierbar:
- Provider
- API-URL
- API-Key
- Forecast-Einstellungen
- weitere Providerparameter
CACHE:
Tagescache.
Grundregel:
Erster Abruf des Tages
↓
API
↓
Cache
Gültigkeit grundsätzlich bis 00:00 Uhr Ortszeit.
Zusätzlich:
- anderer Standort = eigener Cache
- manueller Refresh = Cache umgehen
- API-Ausfall = gültigen Cache verwenden
DAUERHAFTE DATEN:
Keine unbegrenzte Wetterhistorie.
Dauerhafte Wetterdaten werden später beim Speichern eines Fangs
als Wetter-Snapshot im Fangdatensatz gespeichert.
SCHNITTSTELLE:
Weather soll einen standardisierten Wetterdatensatz liefern.
Andere Module greifen nicht direkt auf interne Weather-Variablen
oder HTML-Elemente zu.
FERTIGSTELLUNGSKRITERIEN:
- Provider funktioniert
- Standort funktioniert
- Ortssuche funktioniert
- Forecast funktioniert
- relevante Daten werden geliefert
- Cache funktioniert
- Fehlerbehandlung funktioniert
- Schnittstelle definiert
- Runtime integriert
- multilingual vorbereitet
- Test erfolgreich
==================================================
9. GPS
==================================================
Pfad:
modules/gps/
STATUS:
SKELETT / IN ARBEIT
ZIEL:
Zentrale Standortquelle für CatchTrack.
Funktionen:
- aktuellen Standort ermitteln
- Latitude
- Longitude
- Genauigkeit
- Standort speichern
- Home-Standort
- manuelle Standortauswahl
- Standortbearbeitung
- Entfernungsberechnung
- Übergabe an Weather
- Übergabe an Waters
- Übergabe an Maps
- Übergabe an Catchbook
ABHÄNGIGKEITEN:
- Browser Geolocation API
- Core
- Storage
FERTIGSTELLUNGSKRITERIEN:
- Standort zuverlässig ermitteln
- Berechtigungen behandeln
- Fehlerfälle behandeln
- standardisiertes Datenmodell
- öffentliche Schnittstelle
- Tests
- multilingual vorbereitet
==================================================
10. TIDES
==================================================
Pfad:
modules/tides/
STATUS:
SKELETT / ANALYSE
ZIEL:
Standortabhängige Gezeitendaten.
Funktionen:
- aktuelle Tide
- nächstes Hochwasser
- nächstes Niedrigwasser
- Zeitpunkt
- Wasserstand
- Standort
- spätere Übergabe an Fangbuch
ABHÄNGIGKEITEN:
- GPS
- Waters
- Tide-Provider
API:
Provider soll austauschbar und später über Admin konfigurierbar
sein.
==================================================
11. MOON
==================================================
Pfad:
modules/moon/
STATUS:
ACTIVE
ZIEL:
- Mondphase
- Beleuchtungsgrad
- Mondalter
- Mondaufgang
- Monduntergang
- relevante Fangzeitinformationen
ABHÄNGIGKEITEN:
- Datum
- Uhrzeit
- gegebenenfalls GPS
==================================================
12. WATERS
==================================================
Pfad:
modules/waters/
STATUS:
SKELETT
ZIEL:
Zentrale Verwaltung von Gewässern.
Funktionen:
- Gewässer anlegen
- Gewässer bearbeiten
- Gewässer löschen
- Gewässertyp
- Beschreibung
- Koordinaten
- Standort
- Suche
- GPS-Nähe
- spätere Zuordnung zu Fängen
ABHÄNGIGKEITEN:
- Database
- GPS
- Maps
- Catches
==================================================
13. EQUIPMENT
==================================================
Pfad:
modules/equipment/
STATUS:
SKELETT
ZIEL:
Eigenständige Verwaltung der Angelausrüstung.
Bereiche:
- Ruten
- Rollen
- Schnüre
- Vorfächer
- Haken
- Köder
- Kunstköder
- Zubehör
- sonstiges Equipment
WICHTIG:
Equipment wird zuerst eigenständig fertiggestellt.
Erst danach erfolgt die vollständige Integration in das
Fangbuch.
==================================================
14. GRUPPE B – FISCHDATEN
==================================================
Nach Abschluss der unabhängigen Basis-Module:
B1 Fish Database
Pfad:
modules/fishDatabase/
STATUS:
SKELETT / BESTAND PRÜFEN
Vorhandene Dateien laut bisheriger Prüfung:
- fishDatabase.html
- fishDatabase.css
- fishDatabase.js
- module.json
Bereits vorhandene Funktionalität darf nicht als leeres
Skelett behandelt werden.
fishDatabase.js enthält bereits Datenbankzugriffe auf:
- fish
- fish_names
und verwendet unter anderem:
- CatchTrackDatabase
- CatchTrackSettings.language
Vor Weiterentwicklung:
- alle vier Dateien lesen
- Core prüfen
- Database prüfen
- Language Manager prüfen
- Module Manager prüfen
- tatsächliche Tabellen prüfen
- bestehende Funktionen erhalten
ZIEL:
Zentrale Fisch-Stammdaten.
Mögliche Daten:
- deutscher Name
- lokale Namen
- wissenschaftlicher Name
- Familie
- Beschreibung
- Bild
- Lebensraum
- Gewässertyp
- Tiefe
- Wassertemperatur
- Köder
- Fangmethode
- beste Fangzeit
- Saison
- Schonzeit
- Mindestgröße
- typische Größe
- typisches Gewicht
==================================================
15. GRUPPE C – FANGERFASSUNG
==================================================
C1 Catches
Pfad:
modules/catches/
STATUS:
ACTIVE
Bestehende Funktionalität wird erhalten.
Ziel:
- Fisch
- Gewicht
- Länge
- Datum
- Uhrzeit
- Gewässer
- GPS
- Wetter
- Tide
- Mond
- Equipment
- Köder
- Fangmethode
- Fotos
- Notizen
- Bedingungen
ABHÄNGIGKEITEN:
- Fish Database
- Waters
- Equipment
- GPS
- Weather
- Tides
- Moon
- Photos
- Conditions
- Database
==================================================
16. CATCHBOOK
==================================================
Pfad:
modules/catchbook/
STATUS:
ACTIVE / INTEGRATION OFFEN
Das Fangbuch ist ein Integrationsmodul.
Es soll erst vollständig fertiggestellt werden, wenn die
relevanten Basisdaten stabil verfügbar sind.
Funktionen:
- Fänge anzeigen
- suchen
- filtern
- sortieren
- Detailansicht
- bearbeiten
- löschen
- Statistiken aufrufen
Datenquellen:
- Catches
- Fish Database
- GPS
- Waters
- Weather
- Tides
- Moon
- Equipment
- Photos
- Conditions
WICHTIG:
Das Fangbuch darf Funktionen der Basis-Module nicht duplizieren.
==================================================
17. GRUPPE D – KARTEN UND BEDINGUNGEN
==================================================
D1 Maps
Pfad:
modules/maps/
STATUS:
SKELETT
Abhängigkeiten:
- GPS
- Waters
- Catches
D2 Conditions
Pfad:
modules/conditions/
STATUS:
SKELETT
Mögliche Daten:
- Wind
- Strömung
- Sicht
- Wassertemperatur
- Wasserzustand
- manuelle Bedingungen
==================================================
18. PHOTOS
==================================================
Pfad:
modules/photos/
STATUS:
ACTIVE
Ziel:
- Fotoaufnahme
- Speicherung
- Fangzuordnung
- mehrere Fotos
- Anzeige
- Löschen
Abhängigkeiten:
- Catches
- Storage
- Browser/File APIs
==================================================
19. SAFETY
==================================================
Pfad:
modules/safety/
STATUS:
SKELETT
Ziel:
- Sicherheitsinformationen
- Notfallinformationen
- Standort
- Warnungen
Abhängigkeiten:
- GPS
- Settings
==================================================
20. STATISTICS
==================================================
Pfad:
modules/statistics/
STATUS:
SKELETT / ACTIVE
Das Modul wird erst nach Aufbau einer ausreichenden
Fangdatenbasis vollständig entwickelt.
Mögliche Auswertungen:
- Anzahl Fänge
- Gewicht
- Länge
- Fischarten
- Gewässer
- Köder
- Fangmethoden
- Wetter
- Tide
- Mond
- Equipment
- Zeiträume
==================================================
21. RECORDS
==================================================
Pfad:
modules/records/
STATUS:
SKELETT
Ziel:
- persönliche Rekorde
- größte Fische
- schwerste Fänge
- längste Fänge
- Artenrekorde
- Gewässerrekorde
Abhängigkeiten:
- Catches
- Fish Database
- Statistics
==================================================
22. LEADERBOARD / HITPARADE
==================================================
Pfad:
modules/leaderboard/
STATUS:
SKELETT
Grundlage:
Catchbook
↓
Records
↓
Leaderboard
Wird erst nach stabilem Fangbuch entwickelt.
==================================================
23. SETTINGS
==================================================
Pfad:
modules/settings/
STATUS:
ACTIVE
Aufgaben:
- Sprache
- Theme
- Einheiten
- Standortoptionen
- Datenoptionen
- Moduloptionen
WICHTIG:
Die Spracheinstellung ist Teil der globalen Architektur.
==================================================
24. MULTILINGUALITÄT
==================================================
Alle Module müssen multilingual vorbereitet werden.
Unterstützt werden:
1. automatische Gerätesprache
2. manuelle Sprachauswahl
Manuelle Auswahl hat Vorrang.
Die Module verwenden langfristig ein zentrales Language-/i18n-
System.
Keine eigene Sprachverwaltung pro Modul.
Keine unnötig fest codierten UI-Texte.
Interne Daten bleiben sprachneutral.
==================================================
25. EXPORT
==================================================
Pfad:
modules/export/
STATUS:
SKELETT
Ziel:
- JSON Export
- CSV Export
- vollständiger Datenexport
- optional selektiver Export
Abhängigkeiten:
- Database
- Storage
==================================================
26. BACKUP
==================================================
Pfad:
modules/backup/
STATUS:
SKELETT
Ziel:
- vollständiges Backup
- Wiederherstellung
- Validierung
- Integritätsprüfung
Abhängigkeiten:
- Database
- Storage
==================================================
27. BLUETOOTH
==================================================
Pfad:
modules/bluetooth/
STATUS:
SKELETT
Ziel:
Spätere Integration externer Angel-/Sensorgeräte.
Mögliche Daten:
- Bissanzeiger
- Temperatur
- weitere Sensoren
Keine konkrete Geräteintegration, bevor die Architektur
definiert ist.
==================================================
28. AI
==================================================
Pfad:
modules/ai/
STATUS:
SKELETT
Ziel:
Spätere intelligente Auswertung und Assistenz.
Mögliche Funktionen:
- Fangdatenanalyse
- Mustererkennung
- Empfehlungen
- natürliche Suche
- Auswertung historischer Daten
AI wird nicht vor der Stabilisierung der zugrunde liegenden
Datenstrukturen priorisiert.
==================================================
29. ADMIN
==================================================
Pfad:
modules/admin/
STATUS:
ACTIVE
Langfristige Aufgaben:
- Benutzerverwaltung
- Provider-Konfiguration
- API-Konfiguration
- Datenpflege
- Systemdiagnose
- Backup
- Sprachverwaltung
- Modulverwaltung
==================================================
30. START
==================================================
Pfad:
modules/start/
STATUS:
ACTIVE
Startmodul bleibt die zentrale Einstiegsebene der Anwendung.
==================================================
31. DATENFLUSS
==================================================
Grunddaten:
GPS
Weather
Tides
Moon
Waters
Equipment
Fish Database
↓
Catches
↓
Catchbook
↓
Statistics
Records
Leaderboard
==================================================
32. WEATHER-DATENFLUSS
==================================================
GPS
↓
Latitude / Longitude
↓
Weather Provider
↓
Weather Module
↓
standardisierter Wetterdatensatz
↓
Catches / Catchbook
Beim Speichern eines Fangs:
Weather
↓
relevanter Snapshot
↓
Fangdatensatz
Dadurch bleiben historische Wetterbedingungen eines Fangs
unabhängig von späteren Änderungen des Wetterdienstes erhalten.
==================================================
33. AUTOMATISCHE DATEN
==================================================
Automatisch ermittelte Daten gelten zunächst als Vorschläge.
Der Benutzer muss relevante Werte korrigieren können.
Das betrifft insbesondere:
- GPS
- Gewässer
- Wetter
- Tide
- Mond
- Datum
- Uhrzeit
==================================================
34. HISTORISCHE DATEN
==================================================
Bereits gespeicherte Fänge dürfen durch spätere Änderungen
externer Datenanbieter nicht rückwirkend verändert werden.
Beim Speichern eines Fangs werden relevante externe Daten
als Snapshot übernommen.
==================================================
35. RUNTIME / FEHLER
==================================================
Bei jedem Modul müssen Fehler über das zentrale Runtime-System
behandelt werden.
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
API-Fehler dürfen nicht zum Absturz der gesamten Anwendung
führen.
Wo sinnvoll:
gültiger Cache
↓
weiterverwenden
statt:
API-Fehler
↓
App-Absturz
==================================================
36. SPEICHERUNG
==================================================
Keine unnötige dauerhafte Speicherung großer externer
API-Antworten.
Besonders Wetter:
- Tagescache
- keine unbegrenzte Historie
- Fang-Snapshot nur bei gespeichertem Fang
==================================================
37. TESTSTRATEGIE
==================================================
Jedes Modul wird zunächst isoliert getestet.
Danach:
Modul
↓
Schnittstelle
↓
abhängiges Modul
↓
Integrationstest
Ein Modul gilt erst als MASTER, wenn:
- Dateien vollständig
- Funktionen vollständig
- Schnittstellen stabil
- Fehlerbehandlung stabil
- Runtime integriert
- Speicherverhalten geprüft
- Mehrsprachigkeit vorbereitet
- Tests bestanden
==================================================
38. COMMIT- UND STATUSABGLEICH
==================================================
Nach einer Änderung:
1. Benutzer übernimmt Datei in Working Copy
2. Benutzer commitet
3. GitHub-Commit wird geprüft
4. betroffene Datei wird erneut gelesen
5. PROJECT_STATUS.md wird gegebenenfalls aktualisiert
6. PROJECT_MODULE_PLAN.md wird gegebenenfalls aktualisiert
Ein Commit allein bedeutet nicht automatisch:
MASTER.
==================================================
39. AKTUELLE PRIORITÄT
==================================================
AKTUELL:
1. WEATHER
DANACH:
2. GPS
3. TIDES
4. MOON
5. WATERS
6. EQUIPMENT
DANACH:
7. FISH DATABASE
8. CATCHES
9. CATCHBOOK
10. STATISTICS
11. RECORDS
12. LEADERBOARD
==================================================
40. WICHTIGER PLANUNGSWECHSEL
==================================================
Die frühere Planung behandelte Weather als abgeschlossenen
STEP-1-Meilenstein.
Dieser Punkt ist überholt.
Der aktuelle Plan lautet:
Weather wird jetzt zuerst vollständig geprüft und stabilisiert.
Danach werden die weiteren unabhängigen Basis-Module
fertiggestellt.
Erst anschließend beginnt die intensive Integration in
Fischdatenbank und Fangbuch.
==================================================
41. AKTUELLER NÄCHSTER SCHRITT
==================================================
Weather vollständig prüfen.
Dateien:
modules/weather/module.json
modules/weather/weather.js
modules/weather/weather.html
modules/weather/weather.css
Prüfung:
1. Dateiinhalt
2. Architektur
3. Loader
4. Provider
5. Standort
6. Datenmodell
7. Forecast
8. Cache
9. Runtime
10. Error Handling
11. Schnittstelle
12. Mehrsprachigkeit
13. Speicherverhalten
14. Benutzeroberfläche
Danach vollständige Master-Version erstellen, sofern erforderlich.
==================================================
42. ABSOLUTE REGEL
==================================================
Nicht vom Dateinamen auf den Entwicklungsstand schließen.
Nicht von einem Commit auf die Funktionalität schließen.
Nicht unfertige Module unnötig parallel bearbeiten.
Nicht bestehende funktionierende Funktionen zerstören.
Vor Änderungen immer:
LESEN
↓
VERSTEHEN
↓
ABHÄNGIGKEITEN PRÜFEN
↓
PLANEN
↓
VOLLSTÄNDIGE DATEI ERSTELLEN
↓
TESTEN
↓
COMMIT PRÜFEN
==================================================
ENDE PROJECT_MODULE_PLAN
==================================================