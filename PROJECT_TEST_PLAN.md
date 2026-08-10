CatchTrack V1.0 – PROJECT TEST PLAN

Version: 2.0
Stand: 10.08.2026
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main

1. Zweck

Dieser Testplan definiert die technischen Prüfungen für CatchTrack.

Ein Modul wird erst als MASTER bezeichnet, wenn die relevanten Prüfungen erfolgreich abgeschlossen wurden.

⸻

2. Teststatus

Status	Bedeutung
TODO	noch nicht getestet
RUNNING	Test läuft
PASS	erfolgreich
FAIL	fehlgeschlagen
BLOCKED	Abhängigkeit verhindert Prüfung
N/A	nicht relevant

⸻

3. Allgemeiner Modultest

Jedes Modul wird geprüft auf:

* Laden
* Initialisierung
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
* öffentliche Schnittstellen
* keine unnötigen parallelen Datenstrukturen

⸻

4. Read-Before-Write-Test

Vor jedem Test einer bestehenden Datei ist sicherzustellen:

aktuellen GitHub-Stand lesen
↓
Abhängigkeiten prüfen
↓
Testumfang bestimmen

Es darf kein Test auf Grundlage einer veralteten Chatversion durchgeführt werden.

⸻

5. Datenbanktests

Zu prüfen:

* Datenbank öffnet
* Tabellen vorhanden
* Spalten vorhanden
* Primärschlüssel
* Foreign Keys
* Indizes
* Lesen
* Schreiben
* Ändern
* Löschen
* Migrationen
* Fehlerbehandlung
* bestehende Daten bleiben erhalten

⸻

6. Identity-Core-Test

Datei:

core/identityManager.js

Zu prüfen:

* Identity Core lädt
* vorhandener Benutzer kann geladen werden
* user_id wird korrekt bereitgestellt
* aktueller Benutzer kann gesetzt werden
* aktueller Benutzer kann zurückgesetzt werden
* ungültige Benutzer werden erkannt
* keine parallele Benutzeridentität entsteht
* Benutzerwechsel verändert nur den zulässigen Datenkontext
* Fehler werden zentral behandelt

Benutzerdatentrennung

Zu prüfen:

User A
↓
user_id A
↓
persönliche Daten A
User B
↓
user_id B
↓
persönliche Daten B

Ein Benutzer darf keine persönlichen Daten eines anderen Benutzers lesen oder verändern können.

Status: TODO

⸻

7. GPS-Test

GPS Version 2.5.0:

Status: MASTER / FROZEN

Nur Regressionstests, sofern erforderlich.

Zu prüfen:

* Standort
* Genauigkeit
* Aktualisierung
* Höhe, sofern verfügbar
* Home Location
* Routing
* Teilen
* Gewässerübergabe

Keine erneute funktionale Neuentwicklung ohne technischen Grund.

⸻

8. Waters-Test

Zu prüfen:

* Gewässer laden
* Gewässer erstellen
* Gewässer anzeigen
* Gewässer bearbeiten
* Gewässer löschen
* GPS-Position übernehmen
* user_id
* Datenbankzuordnung
* Foreign Key
* Index
* Benutzertrennung
* Legacy-Daten
* Navigation

Besonders:

User A
↓
Waters A
User B
↓
Waters B

Ein manipuliertes water_id darf keinen Zugriff auf ein fremdes persönliches Gewässer ermöglichen.

Status: TODO

⸻

9. Modul-Ladetest

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
3. betroffene Datei bestimmen
4. Abhängigkeit prüfen
5. aktuellen GitHub-Stand prüfen

⸻

10. Runtime-Test

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

Zu prüfen:

* JavaScript-Fehler
* Promise-Rejections
* Modulfehler
* Datenbankfehler
* Storage-Fehler
* API-Fehler
* Stacktrace
* Modulzuordnung

⸻

11. Sprachtest

Jedes Modul muss geprüft werden auf:

1. automatische Gerätesprache
2. manuelle Sprachauswahl
3. Sprachwechsel
4. fehlende Übersetzung
5. Fallback
6. unterschiedliche Textlängen
7. gespeicherte Spracheinstellung

Manuelle Sprache hat Vorrang.

Interne Daten bleiben sprachneutral.

⸻

12. Automatische Daten

Zu prüfen:

* automatische Werte werden als Vorschlag behandelt
* Benutzer kann Werte korrigieren
* bestätigte Werte bleiben erhalten
* Herkunft ist nachvollziehbar, sofern erforderlich
* automatische Daten überschreiben keine bestätigten Werte ungeprüft

⸻

13. Legacy-Daten

Bei Migrationen:

* vorhandene Daten identifizieren
* Zuordnung prüfen
* keine zufällige Zuordnung
* keine stille Löschung
* Migration reproduzierbar
* Ergebnis kontrollieren
* Legacy-Speicher nach erfolgreicher Migration nicht unnötig parallel weiterführen

⸻

14. MASTER-Abschlussprüfung

Ein Modul darf als MASTER dokumentiert werden, wenn:

* Funktion vollständig vorhanden
* relevante Tests PASS
* Datenmodell stabil
* Abhängigkeiten geprüft
* Schnittstellen definiert
* Benutzertrennung geprüft, sofern erforderlich
* Fehlerbehandlung geprüft
* Mehrsprachigkeit berücksichtigt
* keine bekannte kritische Blockade besteht
* aktueller GitHub-Stand kontrolliert wurde

⸻

15. Abschlusskontrolle

Nach einem abgeschlossenen Arbeitsschritt:

Working Copy
↓
Commit
↓
GitHub
↓
aktuellen Stand erneut lesen
↓
Dateien kontrollieren
↓
Version / Status aktualisieren

Erst danach gilt der Arbeitsschritt als abgeschlossen.

Ende PROJECT_TEST_PLAN.md