CatchTrack – AI_CONTEXT.md

Version: 2.0
Stand: 10.08.2026
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main

1. Zweck

Diese Datei definiert die verbindlichen Arbeitsregeln für die technische Weiterentwicklung von CatchTrack.

Sie beschreibt wie mit dem Projekt gearbeitet wird.

Technische Architektur, Projektstatus und Tests werden nicht hier dupliziert.

⸻

2. Informationspriorität

Bei technischen Aufgaben gilt:

1. aktueller GitHub-Dateistand
2. tatsächliche aktuelle Ordner- und Dateistruktur
3. aktuelle Commit-Historie
4. PROJECT_STATUS.md
5. PROJECT_ARCHITECTURE.md
6. PROJECT_TEST_PLAN.md
7. ältere Chatverläufe und Annahmen

Bei Widersprüchen ist der tatsächliche aktuelle GitHub-Stand maßgeblich.

⸻

3. READ BEFORE WRITE

Vor jeder Änderung an einer bereits vorhandenen Datei:

GitHub
↓
vollständige aktuelle Datei lesen
↓
Abhängigkeiten prüfen
↓
technische Notwendigkeit feststellen
↓
Änderung auf aktuellem Stand durchführen
↓
vollständige aktualisierte Datei ausgeben

Eine vorhandene Datei darf nicht aus einer früheren Chatversion rekonstruiert werden.

Dies gilt für:

* Core
* Datenbank
* Migrationen
* Module
* Konfiguration
* Dokumentation
* Statusdateien
* Testdateien

⸻

4. BESTANDSAUFNAHME VOR MODULENTWICKLUNG

Vor Beginn eines Moduls werden mindestens geprüft:

* Modulordner
* alle vorhandenen Dateien
* module.json, sofern vorhanden
* HTML
* CSS
* JavaScript
* Konfiguration
* Datenbankbeziehungen
* Migrationen
* Core-Abhängigkeiten
* Module Manager
* Router
* Language Manager
* Storage
* bestehende Schnittstellen
* bestehende Legacy-Daten

Es darf keine angenommene Dateistruktur verwendet werden, wenn der aktuelle GitHub-Stand verfügbar ist.

⸻

5. KEIN RATEN

Existenz, Funktion, Version oder Abhängigkeit einer Datei darf nicht angenommen werden.

Bei technischer Unsicherheit:

nicht raten
↓
aktuellen Stand prüfen
↓
wenn weiterhin unklar:
gezielt nachfragen

⸻

6. BESTEHENDE FUNKTIONEN

Bestehende funktionierende Funktionen werden nicht unnötig verändert.

Vor einer Änderung ist zu prüfen:

* Wird die Datei tatsächlich verwendet?
* Wird sie importiert?
* Wird sie dynamisch geladen?
* Wird sie vom Module Manager verwendet?
* Wird sie vom Router verwendet?
* Wird sie von anderen Modulen verwendet?
* Bestehen Datenbankabhängigkeiten?
* Bestehen Konfigurationsabhängigkeiten?
* Ist sie Teil einer abgeschlossenen Architektur?

⸻

7. CORE-FREEZE

Abgeschlossene Core-Komponenten gelten als FROZEN.

Insbesondere:

* app.js
* core/*
* database/database.js
* database/schema.sql

dürfen bei der Entwicklung von Fachmodulen nicht unnötig verändert werden.

Eine Core-Änderung ist nur zulässig, wenn eine konkrete technische Notwendigkeit nachgewiesen wurde.

Dann gilt:

CORE-ÄNDERUNG ERFORDERLICH

Die Änderung wird als eigener Arbeitsschritt behandelt.

⸻

8. DATENBANK

CatchTrack verwendet eine zentrale Datenbank.

Keine parallelen Modul-Datenbanken.

Neue strukturelle Änderungen erfolgen über neue Migrationen.

Bestehende Migrationen werden nicht nachträglich verändert oder gelöscht.

⸻

9. IDENTITY

CatchTrack verwendet eine zentrale Benutzeridentität.

Grundprinzip:

User
↓
Identity Core
↓
user_id
↓
persönliche Fachmoduldaten

Fachmodule dürfen keine eigene parallele Benutzeridentität entwickeln.

Bei jedem persönlichen Datenobjekt ist vor der Implementierung zu prüfen, ob user_id erforderlich ist.

⸻

10. AUTOMATISCHE DATEN

Automatisch ermittelte Daten sind grundsätzlich:

VORSCHLAG

Dies betrifft insbesondere:

* GPS
* Wetter
* Geodaten
* Fischidentifikation
* KI-Ergebnisse
* berechnete Werte
* externe Daten

Automatische Werte dürfen nicht ungeprüft endgültige Benutzerdaten überschreiben.

⸻

11. MODULARITÄT

Fachmodule verwenden vorhandene zentrale Schnittstellen.

Keine parallelen Ersatzsysteme.

Grundprinzip:

Modul
↓
Core / zentrale Schnittstelle
↓
Daten / Service

Ein Modul übernimmt nicht dauerhaft die fachliche Verantwortung eines anderen Moduls.

⸻

12. USER-ID-PRÜFUNG

Vor jedem neuen oder zu überarbeitenden Modul wird geprüft:

1. Sind die Daten persönlich?
2. Benötigen sie user_id?
3. Bestehen Beziehungen zu user_id-gebundenen Objekten?
4. Wird water_id benötigt?
5. Werden die Daten später statistisch verwendet?
6. Sind Cloud-/Sharing-Funktionen vorgesehen?
7. Bestehen Datenschutz- oder Freigabeanforderungen?
8. Gibt es Community- oder Admin-Beziehungen?

Bei personenbezogenen Daten wird user_id von Anfang an berücksichtigt.

⸻

13. MASTER-DATEIEN

Wenn eine Datei erstellt, ersetzt oder überarbeitet wird, wird grundsätzlich die vollständige Datei ausgegeben.

Keine:

* Patch-Fragmente
* Diff-Ausschnitte
* Such-und-Ersetzen-Anweisungen
* unvollständigen Dateien

Bei mehreren zusammengehörenden Dateien werden möglichst alle betroffenen Dateien gemeinsam ausgegeben.

⸻

14. AUSGABEFORMAT

Vor Dateien wird angegeben:

ZU ERSETZEN
- ...
NEU ZU ERSTELLEN
- ...
LÖSCHKANDIDATEN
- ...
UNVERÄNDERT
- ...

Danach folgen die vollständigen Dateien.

⸻

15. CHATGPT → WORKING COPY → GITHUB

Der verbindliche Arbeitsablauf:

GitHub
↓
vollständig lesen
↓
prüfen
↓
ChatGPT
↓
vollständige Master-Datei
↓
Working Copy
↓
Commit
↓
GitHub
↓
erneut prüfen

ChatGPT muss den Schreibzugriff nicht thematisieren.

⸻

16. OK-REGEL

Eine Antwort des Benutzers mit:

OK

bedeutet:

Der vorgesehene Arbeitsschritt wurde ausgeführt.

Danach wird der aktuelle GitHub-Stand geprüft, sofern verfügbar.

Ist alles korrekt:

→ nächster vorgesehener Arbeitsschritt.

Ist etwas nicht korrekt:

→ konkrete Abweichung benennen.

Keine zusätzliche Bestätigung über Speicherung oder Commit verlangen.

⸻

17. KEINE PARALLELENTWICKLUNG

Grundsätzlich wird jeweils nur ein fachlicher Arbeitsschritt verfolgt.

Ausnahmen:

* zwingende Core-Abhängigkeit
* nachgewiesener Schnittstellenfehler
* ausdrücklich beauftragte Änderung

⸻

18. ABGESCHLOSSENE MODULE

Ein abgeschlossenes Modul wird nicht ohne konkreten technischen Grund erneut verändert.

GPS Version 2.5.0 gilt als abgeschlossener Stand.

Änderungen nur bei:

* nachgewiesenem Fehler
* zwingender Schnittstellenänderung
* notwendiger Core-Anpassung
* ausdrücklich gewünschter Erweiterung

⸻

19. AKTUELLER ARBEITSÜBERGANG

Der aktuelle technische Übergang ist:

Waters Master

⸻

20. GRUNDREGEL

Der aktuelle GitHub-Stand bestimmt die technische Realität.

Dokumentation unterstützt die Arbeit, ersetzt aber niemals die Prüfung der tatsächlichen Dateien.

Ende AI_CONTEXT.md