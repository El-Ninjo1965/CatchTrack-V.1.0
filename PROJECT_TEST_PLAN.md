CatchTrack V1.0 – PROJECT TEST PLAN

Projekt: CatchTrack V1.0
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main
Stand: 09.08.2026
Status: Initialfassung

⸻

1. Zweck

Dieser Testplan definiert die verbindlichen Prüfungen für CatchTrack V1.0.

Ein Modul gilt erst als MASTER, wenn die für das Modul relevanten Prüfungen erfolgreich abgeschlossen wurden.

Der Testplan wird während der Entwicklung fortlaufend aktualisiert und muss jederzeit den tatsächlichen Projektstand widerspiegeln.

⸻

2. Verbindlicher Arbeitsworkflow

Der Benutzer nimmt keine manuellen Codeänderungen vor.

Der Benutzer sucht keine einzelnen Codepassagen und führt keine manuellen „Suchen & Ersetzen“-Änderungen durch.

Bei Änderungen an bestehenden Dateien wird grundsätzlich die vollständige aktuelle Ersatzdatei geliefert.

Bei neuen Dateien wird grundsätzlich die vollständige Datei geliefert.

Der Benutzer übernimmt die vollständige Datei über Working Copy.

Bestätigungsregel

Wenn ChatGPT eine konkrete nächste Datei zur vollständigen Ausgabe ankündigt und der Benutzer anschließend mit:

* OK
* Okay
* Ok

bestätigt, gilt dies unmittelbar als Auftrag zur Ausgabe dieser Datei.

Es erfolgt danach:

* keine erneute Ankündigung
* keine erneute Rückfrage
* keine Wiederholung der Planung
* keine zusätzliche Bestätigung

Stattdessen wird unmittelbar die vollständige Datei ausgegeben.

Standardworkflow

GitHub aktuellen Stand einlesen
        ↓
Dateien und Abhängigkeiten prüfen
        ↓
vollständige Ersatz-/Neue Datei erstellen
        ↓
Benutzer übernimmt Datei über Working Copy
        ↓
Commit / Push
        ↓
GitHub erneut einlesen
        ↓
Runtime-/Fehlerprüfung
        ↓
Testplan aktualisieren

⸻

3. Teststatus

Status	Bedeutung
TODO	noch nicht getestet
RUNNING	Test läuft
PASS	erfolgreich
FAIL	fehlgeschlagen
BLOCKED	Test wegen Abhängigkeit nicht möglich
N/A	für dieses Modul nicht relevant

⸻

4. Grundprüfung jedes Moduls

Jedes Modul wird mindestens auf folgende Punkte geprüft:

* Modul wird korrekt geladen
* Modul wird korrekt initialisiert
* HTML wird korrekt dargestellt
* CSS wird korrekt geladen
* JavaScript erzeugt keine Fehler
* Navigation funktioniert
* Daten werden korrekt gelesen
* Daten werden korrekt gespeichert
* Daten werden korrekt geändert
* Daten werden korrekt gelöscht, sofern vorgesehen
* Fehler werden korrekt behandelt
* Sprachsystem funktioniert
* Abhängigkeiten funktionieren
* mobile Darstellung funktioniert
* Runtime-Status wird korrekt aktualisiert
* Fehler werden im Error-Log protokolliert

⸻

5. Runtime-System

5.1 Runtime Status

Datei:

runtime/runtime_status.json

Zu prüfen:

* Datei existiert
* gültiges JSON
* Status kann aktualisiert werden
* Zeitstempel wird korrekt geschrieben
* Anwendungsversion wird erkannt
* Module werden erkannt
* Modulstatus wird korrekt erfasst
* Ladezustand wird korrekt erfasst
* Fehlerstatus wird korrekt erfasst
* keine veralteten Daten bleiben nach einem Status-Scan bestehen

Status:

TODO

⸻

6. Error Log

Datei:

runtime/error.log

Zu prüfen:

* Datei existiert
* neue Fehler werden automatisch protokolliert
* Datum wird gespeichert
* Uhrzeit wird gespeichert
* Fehlerlevel wird gespeichert
* Modul wird gespeichert
* Datei wird gespeichert, sofern bekannt
* Funktion wird gespeichert, sofern bekannt
* Fehlermeldung wird gespeichert
* Stacktrace wird gespeichert, sofern verfügbar
* Promise-Rejections werden erkannt
* Modul-Ladefehler werden erkannt
* Datenbankfehler werden erkannt
* API-Fehler werden erkannt
* Storage-Fehler werden erkannt

Status:

TODO

⸻

7. Absichtlicher Fehler-Test

Das System muss einen kontrollierten Testfehler erzeugen können.

Erwartung:

Fehler entsteht
      ↓
Error Handler erkennt Fehler
      ↓
error.log erhält Eintrag
      ↓
runtime_status.json aktualisiert Fehlerstatus
      ↓
Admin kann Fehler anzeigen

Nach dem Test muss der Testfehler eindeutig erkennbar sein.

⸻

8. Datenbanktests

Zu prüfen:

* Datenbank wird geöffnet
* Tabellen sind vorhanden
* Lesen funktioniert
* Schreiben funktioniert
* Aktualisieren funktioniert
* Löschen funktioniert
* Fehler werden erkannt
* Transaktionen funktionieren, sofern verwendet
* Migrationen funktionieren
* Seed-Daten sind verfügbar
* keine unzulässigen parallelen Datenstrukturen entstehen

⸻

9. Core-Tests

API

* Initialisierung
* Requests
* Fehlerbehandlung
* Timeout-/Fehlerfälle

Database

* Verbindung
* Queries
* Fehlerbehandlung

Error Handler

* JavaScript-Fehler
* Promise-Rejections
* Modulfehler
* Logging

Language Manager

* Sprache laden
* Übersetzung
* fehlende Übersetzung

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

10. Modul-Ladetests

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

Bei Fehlern:

* Error Log prüfen
* Runtime Status prüfen
* betroffene Datei identifizieren

⸻

11. Fish Database

Funktionen

* Fischarten anzeigen
* Suche
* Auswahl
* Detailansicht
* Daten lesen
* Daten speichern
* Daten bearbeiten
* Daten löschen, sofern vorgesehen

Abhängigkeiten

* Database
* Storage
* Language Manager

Status

TODO

⸻

12. Equipment

Funktionen

* Equipment anzeigen
* Kategorien
* Hinzufügen
* Bearbeiten
* Löschen
* Fangzuordnung

Abhängigkeiten

* Database
* Storage
* Catches

Status

TODO

⸻

13. Waters

Funktionen

* Gewässer anzeigen
* Gewässer erstellen
* bearbeiten
* löschen
* Koordinaten
* Details
* Fangzuordnung

Abhängigkeiten

* Database
* GPS
* Maps
* Catches

Status

TODO

⸻

14. GPS

Funktionen

* Standort anfordern
* Koordinaten ermitteln
* Genauigkeit anzeigen
* Standort speichern
* Standort an andere Module übergeben

Fehlerfälle

* Berechtigung verweigert
* GPS nicht verfügbar
* Timeout
* ungenaue Position

Abhängigkeiten

* Browser Geolocation API
* Catches
* Waters
* Maps

Status

TODO

⸻

15. Maps

Funktionen

* Karte laden
* aktuelle Position
* Gewässerpositionen
* Fangpositionen
* Marker
* Navigation

Fehlerfälle

* Kartenanbieter nicht erreichbar
* Position fehlt
* ungültige Koordinaten

Abhängigkeiten

* GPS
* Waters
* Catches

Status

TODO

⸻

16. Catches

Funktionen

* Fang erstellen
* Fang anzeigen
* Fang bearbeiten
* Fang löschen
* Fischart
* Gewicht
* Länge
* Datum
* Uhrzeit
* Gewässer
* Position
* Wetter
* Gezeiten
* Mond
* Bedingungen
* Equipment
* Fotos
* Notizen

Integrationsprüfung

Alle verfügbaren abhängigen Module müssen getestet werden.

Status

TODO

⸻

17. Catchbook

Funktionen

* Fänge anzeigen
* Suche
* Filter
* Sortierung
* Detailansicht
* Bearbeitung
* Löschung

Abhängigkeiten

* Catches
* Database
* Statistics

Status

TODO

⸻

18. Weather

Weather ist der abgeschlossene STEP-1-Meilenstein.

Status:

MASTER

Nur folgende Prüfungen bleiben möglich:

* Regressionstest
* notwendige Integrationsprüfung
* Fehlerkorrektur bei nachgewiesenem Problem

⸻

19. Tides

Funktionen

* Gezeiten anzeigen
* Hochwasser
* Niedrigwasser
* Zeit
* Höhe
* Fangzuordnung

Fehlerfälle

* keine Daten
* API-Fehler
* ungültiger Standort
* Netzwerkfehler

Status

TODO

⸻

20. Moon

Funktionen

* Mondphase
* Mondalter
* Beleuchtung
* Datum/Zeit
* Fangzuordnung

Status

TODO

⸻

21. Conditions

Funktionen

* Angelbedingungen
* Wasserbedingungen
* Wind
* Strömung
* Sicht
* Temperatur
* manuelle Eingaben
* Fangzuordnung

Status

TODO

⸻

22. Photos

Funktionen

* Foto hinzufügen
* mehrere Fotos
* Vorschau
* Fangzuordnung
* Speichern
* Löschen

Fehlerfälle

* fehlende Berechtigung
* ungültige Datei
* Speicherfehler
* fehlende Datei

Status

TODO

⸻

23. Statistics

Funktionen

* Fanganzahl
* Gewicht
* Durchschnitt
* Arten
* Gewässer
* Zeiträume
* Köder
* Equipment
* Wetter
* Gezeiten
* Mond
* Bedingungen

Status

TODO

⸻

24. Records

Funktionen

* größter Fisch
* schwerster Fisch
* längster Fisch
* Artenrekorde
* Gewässerrekorde
* persönliche Rekorde

Status

TODO

⸻

25. Leaderboard

Funktionen

* Ranglisten
* Filter
* Artenvergleich
* Gewässervergleich
* Zeitraum

Status

TODO

⸻

26. Settings

Funktionen

* Sprache
* Theme
* Einheiten
* Standort
* Datenoptionen
* Moduloptionen

Status

TODO

⸻

27. Export

Funktionen

* JSON Export
* CSV Export
* vollständiger Export
* selektiver Export

Tests

Exportierte Dateien müssen strukturell geprüft werden.

Status

TODO

⸻

28. Backup

Funktionen

* Backup erstellen
* Backup speichern
* Backup prüfen
* Backup wiederherstellen
* beschädigtes Backup erkennen

Status

TODO

⸻

29. Safety

Funktionen

* Sicherheitsinformationen
* Standortinformationen
* Warnungen
* relevante Hinweise

Status

TODO

⸻

30. Bluetooth

Funktionen

* Geräte erkennen
* Verbindung
* Trennung
* Gerätedaten
* Fehlerbehandlung

Fehlerfälle

* Bluetooth deaktiviert
* Gerät nicht gefunden
* Berechtigung verweigert
* Verbindung verloren

Status

TODO

⸻

31. AI

Funktionen

* Datenanalyse
* Fangmuster
* Empfehlungen
* Auswertung

Abhängigkeiten

* Catches
* Statistics
* Weather
* Conditions
* Fish Database

Status

TODO

⸻

32. Start

Funktionen

* Startseite
* Navigation
* Modulübersicht
* Statusanzeige

Status

TODO

⸻

33. Admin

Funktionen

* Systemstatus
* Modulstatus
* Runtime Status
* Error Log
* Diagnose
* Wartung
* Status aktualisieren

Runtime-Tests

Der Admin-Bereich muss mindestens anzeigen können:

* Anwendungsversion
* Anzahl Module
* aktive Module
* Ladefehler
* letzte Statusaktualisierung
* letzte Fehler

Status

TODO

⸻

34. Regressionstests

Nach jedem größeren Modulabschluss werden bereits fertige Kernfunktionen erneut geprüft.

Mindestens:

* Start
* Navigation
* Module Manager
* Database
* Storage
* Language Manager
* Weather
* Catches
* Catchbook

Weitere Regressionstests werden entsprechend den Abhängigkeiten ergänzt.

⸻

35. Altlastenprüfung

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
LÖCHKANDIDAT
↓
ZUR LÖSCHUNG FREIGEGEBEN
↓
GELÖSCHT

⸻

36. Abschlusskriterium MASTER

Ein Modul darf erst MASTER werden, wenn:

* Funktionen vollständig implementiert
* Datenbankzugriffe geprüft
* Abhängigkeiten geprüft
* UI geprüft
* Navigation geprüft
* Fehlerfälle geprüft
* Runtime Status geprüft
* Error Log geprüft
* Regressionstest bestanden
* Altlasten geprüft
* Löschkandidaten dokumentiert

⸻

37. Testprotokoll

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

38. STEP-2-ABSCHLUSS

STEP 2 gilt erst als abgeschlossen, wenn:

* alle vorgesehenen Module MASTER sind
* alle relevanten Tests PASS sind
* keine ungeklärten kritischen Fehler bestehen
* Altlasten identifiziert wurden
* freigegebene Altlasten entfernt wurden
* Runtime-System funktioniert
* Error-Logging funktioniert
* Regressionstests erfolgreich sind
* GitHub den dokumentierten Masterstand enthält

⸻

39. AKTUELLER STATUS

STEP 1        MASTER
Weather       MASTER
STEP 2        TODO
Runtime       TODO
Error Log     TODO
Testsystem    TODO
Module        noch nicht vollständig abgearbeitet

⸻

40. ÄNDERUNGSPROTOKOLL

Datum	Änderung	Status
09.08.2026	Initiale Erstellung des Testplans	INITIAL
09.08.2026	Bestätigungsregel für direkte Dateiausgabe ergänzt	INITIAL

⸻

41. VERBINDLICHE REGELN

Dieser Testplan wird nicht als theoretische Dokumentation behandelt.

Die Einträge müssen den tatsächlichen Teststand widerspiegeln.

Ein Modul darf nicht auf MASTER gesetzt werden, nur weil die Dateien vorhanden sind.

MASTER bedeutet:

Implementiert + integriert + getestet + geprüft + dokumentiert.

Zusätzliche verbindliche Arbeitsregel:

Wenn ChatGPT eine konkrete nächste Datei zur vollständigen Ausgabe ankündigt und der Benutzer anschließend mit „OK“, „Okay“ oder „Ok“ bestätigt, wird unmittelbar die vollständige Datei ausgegeben.

Keine erneute Ankündigung und keine erneute Bestätigung.