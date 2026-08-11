CatchTrack V1.0 – Verifizierte Fehler direkt beheben

Auftrag

Arbeite direkt im aktuellen Repository:

El-Ninjo1965/CatchTrack-V.1.0

Branch:

main

Die Datei chatgpt-info.md enthält die aktuelle technische Bestandsprüfung. Die dort genannten Fehler wurden gegen den aktuellen Repository-Stand verifiziert.

Behebe die verifizierten Fehler direkt im Code.

Keinen neuen Analysebericht erstellen und keinen neuen Architekturentwurf beginnen.

⸻

1. Core Runtime reparieren

Datei:

Core/core-runtime.js

Behebe den Fehler in isRunning().

Der tatsächliche Runtime-Zustand muss zuverlässig zurückgegeben werden.

Prüfe danach alle Verwendungen von:

isRunning()
running

und stelle sicher, dass keine zweite oder widersprüchliche Zustandsquelle entsteht.

⸻

2. Event-System reparieren

Prüfe das tatsächlich vorhandene Core-Event-System.

Aktuell existieren:

on()
off()
emit()

Das Admin-Modul verwendet zusätzlich:

once()

Entscheide anhand der bestehenden Architektur, welche Lösung sauberer ist.

Bevorzugt:

* once() korrekt und konsistent im Core implementieren, wenn dies zum bestehenden Event-System passt.

Alternativ:

* Admin so ändern, dass ausschließlich die vorhandene Event-API verwendet wird.

Kein zweites Event-System erzeugen.

Danach alle Event-Verwendungen im Repository prüfen.

⸻

3. Error Handling vereinheitlichen

Aktuell besteht eine Inkonsistenz zwischen:

error
error:handled

Der Core Error Handler muss das verbindliche Fehler-Event auslösen und das Admin-Modul muss exakt dieses Event verwenden.

Behebe die Inkonsistenz.

Danach prüfen:

* Error Handler
* Error Log
* Admin Error Tracking
* Event Bus

müssen zusammen funktionieren.

⸻

4. Database Lifecycle reparieren

Datei:

Database/database-manager.js

Behebe den Fehler, dass die interne Store-Liste nur während onupgradeneeded aufgebaut wird.

Die tatsächlichen Stores müssen auch beim Öffnen einer bereits existierenden Datenbank korrekt verfügbar sein.

Insbesondere:

getStats()

muss sowohl bei einer neuen als auch bei einer bereits vorhandenen IndexedDB funktionieren.

⸻

5. Database und Config synchronisieren

Aktuell verwendet die Datenbank:

users
modules
logs
sessions
settings
cache
sync

Die Config kennt jedoch nur einen Teil davon.

Vereinheitliche die Definition.

Es darf nicht zwei unterschiedliche Wahrheiten über die Datenbankstruktur geben.

Dabei möglichst die vorhandene Architektur verwenden und keine unnötige neue Konfigurationsdatei erstellen.

⸻

6. User/Auth reparieren

Aktuell bestehen zwei inkompatible Modelle:

User Module:
status
Auth Service:
active

und:

User Module:
RAM
User Service:
Database

Behebe die tatsächliche funktionale Inkompatibilität.

Ziel:

* Authentifizierung funktioniert mit den vorhandenen Demo-Benutzern.
* User- und Auth-Service verwenden dasselbe Datenmodell.
* Keine parallele zweite Benutzerverwaltung erzeugen.

Die bestehende User-Modul-Funktionalität soll erhalten bleiben, soweit sie sinnvoll ist.

⸻

7. Weather Cache reparieren

Datei:

Modules/weather-module/weather-module.js

Der Cache darf nicht ausschließlich unter einem globalen Schlüssel wie:

ct_weather_v1

gespeichert werden, wenn dadurch Wetterdaten verschiedener Standorte verwechselt werden können.

Der Cache muss standortbezogen werden.

Mindestens berücksichtigen:

latitude
longitude

Das Verhalten von:

setLocation()
getWeather()
clearCache()
forceRefresh

muss danach weiterhin funktionieren.

forceRefresh darf nicht als Workaround für einen fehlerhaften Cache dienen.

⸻

8. Startup konsolidieren

Prüfe:

Core/app.js
Core/index.js
Core/core-entry.js
Core/core-startup.js
Core/core-loader.js
index.html
dev.html
preview.html

Es existieren mehrere Startup-Pfade.

Behebe die tatsächliche Doppelinitialisierung.

Ziel:

HTML
 ↓
ein definierter Application Entry
 ↓
Core
 ↓
Module

Es darf nicht möglich sein, dass derselbe Core unbeabsichtigt mehrfach gestartet wird.

Core/index.js darf entfernt werden, wenn nach vollständiger Prüfung eindeutig feststeht, dass es nur ein redundanter Startup-Weg ist.

Ebenso preview.html nur dann ändern/entfernen, wenn die bestehende Funktion dadurch nicht benötigt wird.

⸻

9. Modul-API nicht neu erfinden

Prüfe die vorhandene Modul-Schnittstelle.

Module sollen möglichst über ihre definierte öffentliche API miteinander kommunizieren.

Direkte Zugriffe auf:

window.CatchTrack...

nur dann ändern, wenn dadurch tatsächlich eine bestehende Architekturregel verletzt wird.

Keine komplette Modularchitektur neu bauen.

Die vorhandene Struktur soll stabilisiert werden.

⸻

10. Services nicht unnötig umbauen

Prüfe die Überschneidungen zwischen:

Core
Services
Modules
Database

Behebe zunächst nur konkrete funktionale Konflikte.

Keine großflächige Umstrukturierung durchführen, solange sie nicht notwendig ist, um die verifizierten Fehler zu beheben.

⸻

11. GPS

Keine grundlegende Änderung am GPS-Modul vornehmen.

Nur offensichtliche Dokumentationsfehler korrigieren, sofern sie durch die aktuelle Implementierung eindeutig veraltet sind.

Reverse Geocoding nicht im Rahmen dieses Arbeitsschritts aus dem Modul herauslösen.

Das ist eine spätere Architekturentscheidung.

⸻

12. Tests / Verifikation

Nach den Änderungen die Anwendung und die betroffenen Komponenten tatsächlich testen.

Mindestens überprüfen:

Core Startup
Runtime Status
Event on/off/once/emit
Error Handling
Admin Health Check
Database neue DB
Database bestehende DB
Database getStats()
User Authentication
Weather Cache mit Standortwechsel
Module Loading

Wenn keine automatisierte Testsuite vorhanden ist, die vorhandenen Entwicklungs-/Preview-Möglichkeiten verwenden und zusätzlich gezielte Code-/Runtime-Prüfungen durchführen.

Keine Tests als erfolgreich melden, die nicht tatsächlich ausgeführt oder verifiziert wurden.

⸻

13. Dokumentation anschließend aktualisieren

Erst nachdem der Code funktioniert:

* chatgpt-info.md aktualisieren oder als historische Prüfung bestehen lassen.
* PROJECT_STATUS.md auf den tatsächlichen Zustand bringen.
* Betroffene README-Dateien korrigieren.

Historische Chronikdateien nicht verfälschen.

⸻

14. Regeln

Direkt implementieren.

Keine vorherige Rückfrage, sofern die notwendigen Informationen im Repository vorhanden sind.

Keine neuen parallelen Dateien erzeugen, wenn eine vorhandene Datei sinnvoll erweitert werden kann.

Keine Funktionen doppelt implementieren.

Keine Architektur komplett neu schreiben.

Keine funktionierenden Teile ohne Grund verändern.

Vor dem Löschen einer Datei deren Abhängigkeiten im gesamten Repository prüfen.

⸻

15. Abschluss

Nach erfolgreicher Umsetzung:

1. alle Änderungen testen
2. Syntaxfehler prüfen
3. betroffene Dateien auf gegenseitige Konsistenz prüfen
4. Git-Diff kontrollieren
5. kurze Zusammenfassung ausgeben:

BEHOBEN
- ...
GEÄNDERT
- ...
ENTFERNT
- ...
GETESTET
- ...
NOCH OFFEN
- ...

Nur tatsächlich ausgeführte Änderungen und Tests nennen.