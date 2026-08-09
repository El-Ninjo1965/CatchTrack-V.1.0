CatchTrack V1.0 – PROJECT TEST PLAN

Projekt: CatchTrack V1.0
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main
Stand: 09.08.2026
Status: AKTUALISIERTE MASTERFASSUNG

⸻

1. Zweck

Dieser Testplan definiert die verbindlichen Prüfungen für CatchTrack V1.0.

Ein Modul gilt erst als MASTER, wenn die für das Modul relevanten Prüfungen erfolgreich abgeschlossen wurden.

Der Testplan wird während der Entwicklung fortlaufend aktualisiert und muss jederzeit den tatsächlichen Projektstand widerspiegeln.

⸻

2. Verbindlicher Arbeitsworkflow

Vor jeder Prüfung oder Änderung:

GitHub aktuellen Stand einlesen
        ↓
Dateien und Abhängigkeiten prüfen
        ↓
bestehende Funktionen verstehen
        ↓
Test-/Änderungsumfang festlegen
        ↓
vollständige Ersatz-/Neue Datei erstellen
        ↓
Working Copy
        ↓
Commit / Push
        ↓
GitHub erneut einlesen
        ↓
Runtime-/Fehlerprüfung
        ↓
Testplan aktualisieren

Bei bestehenden Dateien gilt:

* vollständige aktuelle Datei zuerst einlesen
* Abhängigkeiten prüfen
* Git-Historie berücksichtigen
* vorhandene funktionierende Funktionen erhalten
* bei Bedarf vollständig neu als Master-Version erstellen

Manuelle Teiländerungen oder „Suchen & Ersetzen“ sind nicht vorgesehen.

⸻

3. Teststatus

Status	Bedeutung
TODO	noch nicht getestet
RUNNING	Test läuft
PASS	erfolgreich
FAIL	fehlgeschlagen
BLOCKED	wegen Abhängigkeit nicht möglich
N/A	nicht relevant

⸻

4. Grundprüfung jedes Moduls

Jedes Modul wird mindestens geprüft auf:

* korrektes Laden
* korrekte Initialisierung
* HTML
* CSS
* JavaScript
* Navigation
* Daten lesen
* Daten speichern
* Daten ändern
* Daten löschen, sofern vorgesehen
* Fehlerbehandlung
* Language Manager
* Abhängigkeiten
* mobile Darstellung
* Runtime-Status
* Error-Logging

Zusätzlich:

* keine unnötigen Daten dauerhaft speichern
* keine unnötigen parallelen Datenstrukturen
* definierte öffentliche Schnittstellen
* keine direkten Abhängigkeiten auf interne DOM-Strukturen anderer Module

⸻

5. Runtime-System

5.1 Runtime Status

Datei:

runtime/runtime_status.json

Zu prüfen:

* Datei vorhanden
* gültiges JSON
* Status aktualisierbar
* Zeitstempel korrekt
* Anwendungsversion erkannt
* Module erkannt
* Modulstatus korrekt
* Ladezustand korrekt
* Fehlerstatus korrekt
* keine veralteten Statusinformationen

Status:

TODO

⸻

6. Error Log

Datei:

runtime/error.log

Zu prüfen:

* Datei vorhanden
* neue Fehler werden automatisch protokolliert
* Datum
* Uhrzeit
* Fehlerlevel
* Modul
* Datei, sofern bekannt
* Funktion, sofern bekannt
* Fehlermeldung
* Stacktrace, sofern verfügbar
* Promise-Rejections
* Modul-Ladefehler
* Datenbankfehler
* API-Fehler
* Storage-Fehler

Status:

TODO

⸻

7. Error Handler

Datei:

core/errorHandler.js

Zu prüfen:

Fehler
 ↓
Error Handler
 ↓
Fehlerklassifizierung
 ↓
error.log
 ↓
runtime_status.json
 ↓
Admin / Diagnose

Zusätzlich:

* Fehler dürfen die gesamte Anwendung nicht unnötig zum Absturz bringen
* API-Fehler müssen kontrolliert behandelt werden
* Storage-Fehler müssen kontrolliert behandelt werden
* Modulfehler müssen einem Modul zugeordnet werden
* Stacktraces sollen erhalten bleiben
* Testfehler müssen eindeutig erkennbar sein

Status:

TODO

⸻

8. Absichtlicher Fehler-Test

Das System muss einen kontrollierten Testfehler erzeugen können.

Erwartung:

Testfehler
   ↓
Error Handler
   ↓
error.log
   ↓
runtime_status.json
   ↓
Diagnose / Admin

Der Testfehler muss anschließend eindeutig identifizierbar sein.

Nach dem Test wird geprüft, ob:

* der Fehler vollständig protokolliert wurde
* der Runtime-Status korrekt ist
* die Anwendung weiter funktioniert
* kein falscher dauerhafter Fehlerstatus zurückbleibt

⸻

9. LocalStorage-Test

Datei:

localStorage.json

Zu prüfen:

* gültiges Datenformat
* erwartete Schlüssel
* Runtime-Daten korrekt
* Fehlerdaten korrekt
* keine unerwarteten Altlasten
* Datenstruktur kompatibel mit dem aktuellen Storage-System

Eine aktualisierte localStorage.json ist bei einer Runtime-/Fehleranalyse als aktueller Persistenz-Snapshot zu berücksichtigen.

Sie ist nicht automatisch eine statische Konfigurationsdatei.

Status:

TODO

⸻

10. Datenbanktests

Zu prüfen:

* Datenbank wird geöffnet
* Tabellen vorhanden
* Lesen
* Schreiben
* Aktualisieren
* Löschen
* Fehlerbehandlung
* Transaktionen, sofern verwendet
* Migrationen
* Seed-Daten
* keine unzulässigen parallelen Datenstrukturen

⸻

11. Core-Tests

API

* Initialisierung
* Requests
* Fehlerbehandlung
* Timeout
* Netzwerkfehler
* Providerfehler

Database

* Verbindung
* Queries
* Fehlerbehandlung

Error Handler

* JavaScript-Fehler
* Promise-Rejections
* Modulfehler
* API-Fehler
* Storage-Fehler
* Logging

Language Manager

* automatische Sprache
* manuelle Sprache
* Sprachwechsel
* Übersetzung
* fehlende Übersetzung
* Fallback

Module Manager

* Modul erkennen
* Modul laden
* Modul initialisieren
* Modul deaktivieren
* Modulfehler erkennen

Router

* Navigation
* Modulwechsel
* ungültige Route

Storage Manager

* speichern
* lesen
* ändern
* löschen
* Fehlerfälle

⸻

12. Modul-Ladetests

Für jedes Modul:

Modul erkannt
 ↓
Modul geladen
 ↓
Abhängigkeiten geladen
 ↓
HTML geladen
 ↓
CSS geladen
 ↓
JavaScript initialisiert
 ↓
UI verfügbar

Bei Fehler:

1. Error Log prüfen
2. Runtime Status prüfen
3. betroffene Datei identifizieren
4. Abhängigkeit prüfen
5. GitHub-Dateistand prüfen

⸻

13. WEATHER

Pfad:

modules/weather/

Dateien:

module.json
weather.js
weather.html
weather.css

Alle Dateinamen sind kleingeschrieben.

13.1 Grundfunktionen

Zu prüfen:

* aktueller Standort
* manuelle Ortssuche
* alternativer Standort
* Wetteranzeige
* Wetter-Symbole
* aktuelle Temperatur
* Luftdruck
* Luftfeuchtigkeit
* Niederschlag
* Regenwahrscheinlichkeit
* Windgeschwindigkeit
* Windrichtung
* Windböen
* Bewölkung
* UV
* Sonnenaufgang
* Sonnenuntergang
* Forecast mindestens 7 Tage
* Ziel 10 Tage

13.2 Standorttest

GPS
 ↓
Latitude / Longitude
 ↓
Weather Provider
 ↓
Wetter für aktuellen Standort

Prüfen:

* GPS verfügbar
* GPS verweigert
* GPS ungenau
* Standortwechsel
* manueller Standort
* Suche nach anderem Ort
* Rückkehr zum aktuellen Standort

Wichtig:

Eine manuelle Wetterortauswahl darf den tatsächlichen Fangstandort nicht verändern.

13.3 Provider-Test

Vorgesehener erster Provider:

Open-Meteo

Zu prüfen:

* API erreichbar
* korrekte Koordinaten
* korrekte Antwort
* Forecast vollständig
* Fehlerantwort
* Netzwerkfehler
* Timeout

Provider muss später austauschbar sein.

13.4 Cache-Test

Grundprinzip:

erster Abruf des Tages
        ↓
API
        ↓
Tagescache

Zu prüfen:

* erster Abruf erzeugt Cache
* weiterer Abruf verwendet Cache
* Cache gilt bis 00:00 Uhr Ortszeit
* anderer Standort besitzt eigenen Cache
* manueller Refresh kann Cache umgehen
* API-Ausfall verwendet gültigen Cache
* kein Cache + API-Ausfall erzeugt kontrollierten Fehler

Der Cache darf keine unbegrenzte Wetterhistorie erzeugen.

13.5 Wetter-Snapshot

Beim Speichern eines Fangs:

Weather
 ↓
relevante Wetterdaten
 ↓
Catch Snapshot

Zu prüfen:

* Snapshot wird gespeichert
* historische Daten bleiben unverändert
* späterer Providerwechsel verändert alte Fänge nicht

13.6 Weather-Status

IN ARBEIT

Weather ist nicht mehr als MASTER zu betrachten.

Die frühere Einstufung als abgeschlossener STEP-1-Meilenstein ist veraltet.

⸻

14. GPS

Zu prüfen:

* Standort anfordern
* Koordinaten
* Genauigkeit
* Standort speichern
* Standortübergabe

Fehlerfälle:

* Berechtigung verweigert
* GPS nicht verfügbar
* Timeout
* ungenaue Position

Abhängigkeiten:

* Browser Geolocation API
* Catches
* Waters
* Maps
* Weather

Status:

TODO

⸻

15. TIDES

Zu prüfen:

* Gezeiten
* Hochwasser
* Niedrigwasser
* Zeitpunkt
* Wasserstand
* Standort
* Fangzuordnung

Fehlerfälle:

* keine Daten
* API-Fehler
* ungültiger Standort
* Netzwerkfehler

Provider muss austauschbar bleiben.

Status:

TODO

⸻

16. MOON

Zu prüfen:

* Mondphase
* Mondalter
* Beleuchtung
* Mondaufgang
* Monduntergang
* Datum/Zeit
* Standort
* Fangzuordnung

Status:

TODO

⸻

17. WATERS

Zu prüfen:

* Gewässer anzeigen
* erstellen
* bearbeiten
* löschen
* Koordinaten
* Details
* Fangzuordnung

Abhängigkeiten:

* Database
* GPS
* Maps
* Catches

Status:

TODO

⸻

18. EQUIPMENT

Zu prüfen:

* Equipment anzeigen
* Kategorien
* hinzufügen
* bearbeiten
* löschen
* Fangzuordnung

Bereiche:

* Ruten
* Rollen
* Schnüre
* Vorfächer
* Haken
* Köder
* Kunstköder
* Zubehör

Status:

TODO

⸻

19. FISH DATABASE

Zu prüfen:

* Fischarten anzeigen
* Suche
* Auswahl
* Detailansicht
* Daten lesen
* Daten speichern
* Daten bearbeiten
* Daten löschen, sofern vorgesehen
* Mehrsprachigkeit
* Datenbankintegrität

Abhängigkeiten:

* Database
* Storage
* Language Manager

Status:

TODO

⸻

20. CATCHES

Zu prüfen:

* Fang erstellen
* anzeigen
* bearbeiten
* löschen
* Fischart
* Gewicht
* Länge
* Datum
* Uhrzeit
* Gewässer
* Position
* Wetter-Snapshot
* Tide-Snapshot
* Mond
* Bedingungen
* Equipment
* Fotos
* Notizen

Integrationsprüfung erst, wenn die jeweiligen Basis-Module verfügbar sind.

Status:

TODO

⸻

21. CATCHBOOK

Zu prüfen:

* Fänge anzeigen
* Suche
* Filter
* Sortierung
* Detailansicht
* Bearbeitung
* Löschung
* Integration aller verfügbaren Datenquellen

Abhängigkeiten:

* Catches
* Database
* Statistics

Status:

TODO

⸻

22. MAPS

Zu prüfen:

* Karte laden
* aktuelle Position
* Gewässerpositionen
* Fangpositionen
* Marker
* Navigation

Fehlerfälle:

* Kartenanbieter nicht erreichbar
* Position fehlt
* ungültige Koordinaten

Status:

TODO

⸻

23. CONDITIONS

Zu prüfen:

* Angelbedingungen
* Wasserbedingungen
* Wind
* Strömung
* Sicht
* Temperatur
* manuelle Eingaben
* Fangzuordnung

Automatische und manuelle Werte müssen unterscheidbar bleiben.

Status:

TODO

⸻

24. PHOTOS

Zu prüfen:

* Foto hinzufügen
* mehrere Fotos
* Vorschau
* Fangzuordnung
* Speichern
* Löschen

Fehlerfälle:

* fehlende Berechtigung
* ungültige Datei
* Speicherfehler
* fehlende Datei

Status:

TODO

⸻

25. STATISTICS

Zu prüfen:

* Fanganzahl
* Gewicht
* Durchschnitt
* Arten
* Gewässer
* Zeiträume
* Köder
* Equipment
* Wetter
* Tide
* Mond
* Bedingungen

Status:

TODO

⸻

26. RECORDS

Zu prüfen:

* größter Fisch
* schwerster Fisch
* längster Fisch
* Artenrekorde
* Gewässerrekorde
* persönliche Rekorde

Status:

TODO

⸻

27. LEADERBOARD

Zu prüfen:

* Ranglisten
* Filter
* Artenvergleich
* Gewässervergleich
* Zeitraum

Status:

TODO

⸻

28. SETTINGS

Zu prüfen:

* Sprache
* automatische Gerätesprache
* manuelle Sprachauswahl
* Theme
* Einheiten
* Standort
* Datenoptionen
* Moduloptionen

Status:

TODO

⸻

29. MULTILINGUALITÄT

Jedes Modul muss getestet werden mit:

1. automatischer Gerätesprache
2. manueller Sprachauswahl
3. Sprachwechsel
4. fehlender Übersetzung
5. Fallback
6. UI-Längenunterschieden
7. gespeicherter Spracheinstellung

Manuelle Auswahl hat Vorrang.

Daten müssen sprachneutral gespeichert werden.

Status:

TODO

⸻

30. EXPORT

Zu prüfen:

* JSON Export
* CSV Export
* vollständiger Export
* selektiver Export
* Dateistruktur
* Datenintegrität
* Mehrsprachigkeit der Exportbezeichnungen, sofern vorgesehen

Status:

TODO

⸻

31. BACKUP

Zu prüfen:

* Backup erstellen
* Backup speichern
* Backup prüfen
* Backup wiederherstellen
* beschädigtes Backup erkennen
* Versionskompatibilität

Status:

TODO

⸻

32. SAFETY

Zu prüfen:

* Sicherheitsinformationen
* Standortinformationen
* Warnungen
* relevante Hinweise

Status:

TODO

⸻

33. BLUETOOTH

Zu prüfen:

* Geräte erkennen
* Verbindung
* Trennung
* Gerätedaten
* Fehlerbehandlung

Fehlerfälle:

* Bluetooth deaktiviert
* Gerät nicht gefunden
* Berechtigung verweigert
* Verbindung verloren

Status:

TODO

⸻

34. AI

Zu prüfen:

* Datenanalyse
* Fangmuster
* Empfehlungen
* Auswertung
* Zugriff auf freigegebene Datenquellen

Abhängigkeiten:

* Catches
* Statistics
* Weather
* Conditions
* Fish Database

Status:

TODO

⸻

35. START

Zu prüfen:

* Startseite
* Navigation
* Modulübersicht
* Statusanzeige
* Sprachsystem

Status:

TODO

⸻

36. ADMIN

Zu prüfen:

* Systemstatus
* Modulstatus
* Runtime Status
* Error Log
* Diagnose
* Wartung
* Provider-Konfiguration
* API-Konfiguration
* Status aktualisieren

Mindestens anzeigen:

* Anwendungsversion
* Anzahl Module
* aktive Module
* Ladefehler
* letzte Statusaktualisierung
* letzte Fehler

Status:

TODO

⸻

37. REGRESSIONSTESTS

Nach jedem größeren Modulabschluss werden zentrale Funktionen erneut geprüft.

Mindestens:

* Start
* Navigation
* Module Manager
* Database
* Storage
* Language Manager
* Error Handler
* Weather
* Catches
* Catchbook

Weitere Regressionstests werden entsprechend den Abhängigkeiten ergänzt.

⸻

38. ALTlastenprüfung

Nach Fertigstellung eines Moduls:

1. Dateien des alten Moduls erfassen
2. globale Referenzsuche
3. Imports prüfen
4. dynamische Imports prüfen
5. Module Manager prüfen
6. Config prüfen
7. Services prüfen
8. Core prüfen
9. Datenbankreferenzen prüfen
10. Git-Historie prüfen

Danach:

ALT
 ↓
LÖSCHKANDIDAT
 ↓
ZUR LÖSCHUNG FREIGEGEBEN
 ↓
GELÖSCHT

⸻

39. MASTER-KRITERIEN

Ein Modul darf erst MASTER werden, wenn:

* Funktionen vollständig implementiert
* Datenbankzugriffe geprüft
* Abhängigkeiten geprüft
* UI geprüft
* Navigation geprüft
* Fehlerfälle geprüft
* Runtime Status geprüft
* Error Log geprüft
* Mehrsprachigkeit geprüft
* Regressionstest bestanden
* Altlasten geprüft
* Löschkandidaten dokumentiert
* GitHub-Masterstand geprüft

⸻

40. TESTPROTOKOLL

Für jeden abgeschlossenen Test:

Datum:
Modul:
Test:
Ergebnis:
Fehler:
Fehlerlog-Eintrag:
Behoben:
Git-Commit:
Bemerkungen:

⸻

41. STEP-2-ABSCHLUSS

STEP 2 gilt erst als abgeschlossen, wenn:

* alle vorgesehenen Module MASTER sind
* alle relevanten Tests PASS sind
* keine ungeklärten kritischen Fehler bestehen
* Altlasten identifiziert wurden
* freigegebene Altlasten entfernt wurden
* Runtime-System funktioniert
* Error-Logging funktioniert
* Regressionstests erfolgreich sind
* Mehrsprachigkeit funktioniert
* GitHub den dokumentierten Masterstand enthält

⸻

42. AKTUELLER STATUS

STEP 1
→ abgeschlossen als Entwicklungsphase
Weather
→ IN ARBEIT
GPS
→ TODO
Tides
→ TODO
Moon
→ TODO
Waters
→ TODO
Equipment
→ TODO
Fish Database
→ TODO
Catches
→ TODO
Catchbook
→ TODO
Runtime
→ TODO
Error Log
→ TODO
Testsystem
→ IN ARBEIT

⸻

43. AKTUELLER TESTSCHWERPUNKT

Der nächste vollständige Testschwerpunkt ist:

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

Erst danach:

FISH DATABASE
 ↓
CATCHES
 ↓
CATCHBOOK

⸻

44. ÄNDERUNGSPROTOKOLL

Datum	Änderung	Status
09.08.2026	Initiale Testplan-Erstellung	INITIAL
09.08.2026	Bestätigungsregel ergänzt	AKTIV
09.08.2026	Weather-MASTER-Status korrigiert	AKTIV
09.08.2026	Runtime/Error-Log-Prüfung erweitert	AKTIV
09.08.2026	Weather-Cache- und Snapshot-Tests ergänzt	AKTIV
09.08.2026	Multilingualitäts-Tests ergänzt	AKTIV
09.08.2026	aktuelle Modulreihenfolge übernommen	AKTIV

⸻

45. VERBINDLICHE REGEL

Dieser Testplan ist keine theoretische Dokumentation.

Die Einträge müssen den tatsächlichen Teststand widerspiegeln.

Ein Modul darf nicht auf MASTER gesetzt werden, nur weil:

* die Dateien vorhanden sind
* das Modul geladen wird
* die Oberfläche angezeigt wird
* ein einzelner Funktionstest erfolgreich war

MASTER bedeutet:

IMPLEMENTIERT
+
INTEGRIERT
+
GETESTET
+
FEHLERFREI IM RELEVANTEN TESTUMFANG
+
DOKUMENTIERT
+
GITHUB-MASTERSTAND GEPRÜFT