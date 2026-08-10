CatchTrack – AI_CONTEXT.md

Version: 3.1
Stand: 10.08.2026
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main

⸻

1. Zweck

Diese Datei definiert die verbindlichen Arbeitsregeln für die technische Weiterentwicklung von CatchTrack.

Sie beschreibt:

* wie das Projekt gelesen und analysiert wird
* wie Änderungen durchgeführt werden
* wie Dateien und Abhängigkeiten behandelt werden
* wie die Projektstruktur dokumentiert wird
* wie neue Dateien und Ordner dauerhaft nachvollziehbar bleiben
* wie Wiederholungen und Endlosschleifen vermieden werden

Technische Architektur, Projektstatus und Testdetails werden nicht unnötig hier dupliziert.

⸻

2. Informationspriorität

Bei technischen Aufgaben gilt folgende Priorität:

1. aktueller GitHub-Dateistand
2. tatsächliche aktuelle GitHub-Ordner- und Dateistruktur
3. aktuelle Commit-Historie
4. PROJECT_STATUS.md
5. PROJECT_ARCHITECTURE.md
6. PROJECT_TEST_PLAN.md
7. AI_CONTEXT.md
8. ältere Chatverläufe und Annahmen

Bei Widersprüchen ist der tatsächliche aktuelle GitHub-Stand maßgeblich.

Der AI_CONTEXT dient als Arbeitsgedächtnis und Projektlandkarte, ersetzt aber niemals die tatsächliche Datei auf GitHub.

⸻

3. READ BEFORE WRITE

Vor jeder Änderung an einer bereits auf GitHub vorhandenen Datei:

AI_CONTEXT / bekannter Pfad
↓
GitHub
↓
vollständige aktuelle Datei lesen
↓
relevante Abhängigkeiten prüfen
↓
technische Notwendigkeit feststellen
↓
Änderung auf aktuellem Stand durchführen
↓
vollständige aktualisierte Datei ausgeben

Es werden keine Änderungen auf Basis einer alten Chat-Version einer Datei durchgeführt, wenn die aktuelle Datei auf GitHub verfügbar ist.

⸻

4. CANONICAL PROJECT STRUCTURE

Die folgende Struktur ist die bekannte Projektlandkarte von CatchTrack.

Sie basiert auf dem aktuellen GitHub-Stand.

Root

/
├── .gitignore
├── AI_CONTEXT.md
├── PROJECT_ARCHITECTURE.md
├── PROJECT_STATUS.md
├── PROJECT_TEST_PLAN.md
├── README.md
├── app.js
├── index.html
├── localStorage.json
├── style.css
│
├── assets/
│   └── themes/
│       ├── dark.css
│       └── default.css
│
├── config/
│   ├── app.json
│   ├── languages.json
│   └── modules.json
│
├── core/
│   ├── api.js
│   ├── errorHandler.js
│   ├── identityManager.js
│   ├── languageManager.js
│   ├── moduleInstaller.js
│   ├── moduleManager.js
│   ├── permissionManager.js
│   ├── router.js
│   ├── runtimeStatus.js
│   ├── runtimeStorage.js
│   └── storageManager.js
│
├── database/
│   ├── database.js
│   ├── database.sql
│   ├── fish_names_seed.sql
│   ├── fish_seed.sql
│   ├── schema.sql
│   │
│   └── migrations/
│       ├── 001_initial.sql
│       ├── 002_users.sql
│       ├── 003_core_master.sql
│       ├── 004_waters_user_id.sql
│       └── 005_waters_legacy_ownership.sql
│
├── docs/
│
├── libraries/
│
├── modules/
│
├── runtime/
│
└── services/

Die Unterordner libraries, runtime und services sind Bestandteil der aktuellen Root-Struktur und dürfen nicht mehr als unbekannte oder nicht vorhandene Bereiche angenommen werden.

⸻

5. AKTUELLE MODULSTRUKTUR

Der aktuelle GitHub-Stand enthält unter modules folgende 23 Modulordner:

modules/
├── admin/
├── ai/
├── backup/
├── bluetooth/
├── catchbook/
├── catches/
├── conditions/
├── equipment/
├── export/
├── fishDatabase/
├── gps/
├── leaderboard/
├── maps/
├── moon/
├── photos/
├── records/
├── safety/
├── settings/
├── start/
├── statistics/
├── tides/
├── user/
├── waters/
└── weather/

Diese Liste ist aktuell und vollständig für die auf GitHub verifizierte oberste Ebene von modules.

Wichtig:

Die Modulnamen dürfen nicht aus älteren Chatverläufen rekonstruiert werden.

Bei jeder strukturellen Änderung wird diese Liste aktualisiert.

⸻

6. MODULPFADE

Die verbindliche Modulbasis lautet:

modules/

Ein Modul wird immer über seinen tatsächlichen GitHub-Pfad identifiziert.

Beispiele:

modules/waters
modules/weather
modules/gps
modules/catches
modules/fishDatabase
modules/statistics

Groß-/Kleinschreibung ist Bestandteil des Pfades und muss exakt übernommen werden.

⸻

7. STRUKTUR IST ERWEITERBAR

Die Canonical Project Structure ist eine lebende Projektlandkarte.

Neue Dateien und Ordner werden ausdrücklich unterstützt.

Bei Erstellung eines neuen:

* Ordners
* Moduls
* JavaScript-Datei
* HTML-Datei
* CSS-Datei
* JSON-Konfigurationsdatei
* SQL-Datei
* Migration
* Core-Bestandteils
* Dokumentationsdokuments

wird der neue Pfad nach erfolgreicher Übertragung in das Repository in den AI_CONTEXT aufgenommen.

Die Struktur darf jederzeit erweitert werden.

Bestehende Einträge werden dabei nicht unnötig verändert.

⸻

8. STRUCTURE UPDATE PROTOCOL

Nach dem Erstellen und Übertragen einer neuen Datei oder eines neuen Ordners wird am Ende des AI_CONTEXT ein kurzer Strukturabschluss dokumentiert.

Standardformat:

────────────────────────────────────────
CATCHTRACK STRUCTURE UPDATE
────────────────────────────────────────
Datum:
10.08.2026
Repository:
El-Ninjo1965/CatchTrack-V.1.0
Neue Dateien:
- PFAD/DATEI
Neue Ordner:
- PFAD/ORDNER
Geänderte Dateien:
- PFAD/DATEI
Gelöschte Dateien:
- PFAD/DATEI
Zweck:
Kurze Beschreibung der neuen Struktur/Funktion.
Abhängigkeiten:
- keine
oder
- PFAD/DATEI
Status:
Übertragen und auf GitHub vorhanden.
────────────────────────────────────────

Dieser Block kann nach jedem abgeschlossenen strukturellen Arbeitsschritt direkt unter den bestehenden AI_CONTEXT eingefügt werden.

⸻

9. STRUCTURE UPDATE – VERBINDLICH

Eine neue Datei oder ein neuer Ordner gilt erst dann als Bestandteil der bekannten Projektstruktur, wenn:

1. die Datei bzw. der Ordner erstellt wurde
2. die Übertragung nach GitHub erfolgt ist
3. der Pfad auf GitHub verifiziert wurde
4. der Strukturabschluss dokumentiert wurde

Dadurch bleibt der AI_CONTEXT synchron mit der tatsächlichen Projektstruktur.

⸻

10. NO-LOOP WORKFLOW

CatchTrack wird grundsätzlich ohne unnötige Wiederholungsschleifen entwickelt.

Ein abgeschlossener Prüfschritt wird nicht ohne neuen technischen Anlass wiederholt.

Standard:

1. Aufgabe bestimmen
↓
2. relevante Dateien anhand AI_CONTEXT bestimmen
↓
3. aktuelle Dateien gezielt von GitHub lesen
↓
4. relevante Abhängigkeiten einmalig prüfen
↓
5. technische Ursache feststellen
↓
6. vollständige Master-Datei erstellen
↓
7. Benutzer überträgt Datei
↓
8. GitHub-Stand prüfen
↓
9. Ergebnis feststellen
↓
10. Arbeitsschritt abschließen
↓
11. nächster Arbeitsschritt

Nicht zulässig:

prüfen
↓
prüfen
↓
erneut dieselben Dateien vollständig prüfen
↓
erneut analysieren
↓
erneut dieselbe Änderung durchführen

Eine erneute Prüfung erfolgt nur bei:

* Änderung der Datei
* Änderung einer relevanten Abhängigkeit
* neuem Fehler
* neuem Testergebnis
* neuer Anforderung
* unklarem oder widersprüchlichem GitHub-Stand

⸻

11. TARGETED FILE ACCESS

Wenn der benötigte Dateipfad aus dem AI_CONTEXT bekannt ist:

AI_CONTEXT
↓
bekannter Pfad
↓
GitHub: genau diese Datei vollständig lesen
↓
relevante Abhängigkeiten prüfen

Es muss nicht jedes Mal das gesamte Repository durchsucht werden.

Bei einer neuen Funktion wird nur der dafür relevante Bereich untersucht.

Eine vollständige Repository-Bestandsaufnahme erfolgt nur:

* bei Projektstart
* bei strukturellen Änderungen
* bei einem neuen größeren Modul
* wenn der vorhandene AI_CONTEXT offensichtlich veraltet ist
* wenn die tatsächliche Struktur nicht mehr mit der dokumentierten Struktur übereinstimmt

⸻

12. BESTANDSAUFNAHME VOR MODULENTWICKLUNG

Vor Beginn eines neuen Moduls werden mindestens geprüft:

* Modulordner
* alle vorhandenen Dateien des Moduls
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

13. KEIN RATEN

Existenz, Funktion, Version oder Abhängigkeit einer Datei darf nicht angenommen werden.

Bei technischer Unsicherheit:

nicht raten
↓
gezielt GitHub prüfen
↓
vollständige Datei lesen
↓
technische Beziehung feststellen
↓
erst danach entscheiden

Wenn der GitHub-Inhalt technisch abgeschnitten oder unvollständig geliefert wird:

→ Benutzer nach der vollständigen Originaldatei fragen.

Eine Datei darf nicht aus Fragmenten rekonstruiert werden, wenn dadurch Fehler entstehen könnten.

⸻

14. BESTEHENDE FUNKTIONEN

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

15. CORE-FREEZE

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

16. DATENBANK

CatchTrack verwendet eine zentrale Datenbank.

Keine parallelen Modul-Datenbanken.

Neue strukturelle Änderungen erfolgen über neue Migrationen.

Bestehende Migrationen werden nicht nachträglich verändert oder gelöscht.

⸻

17. IDENTITY

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

18. AUTOMATISCHE DATEN

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

Der Benutzer muss automatische Werte grundsätzlich korrigieren können, sofern die Funktion dies fachlich erlaubt.

⸻

19. MODULARE AUTONOMIE

Fachmodule sollen so selbstständig wie technisch sinnvoll aufgebaut sein.

Grundprinzip:

Modul
↓
eigene fachliche Logik
↓
zentrale Core-Schnittstellen nur dort,
wo sie tatsächlich benötigt werden

Ein Modul darf nicht unnötig von einem anderen Fachmodul abhängig sein.

Insbesondere gilt:

Das Deaktivieren eines Fachmoduls darf ein anderes Fachmodul nicht funktionslos machen, sofern keine zwingende fachliche Abhängigkeit besteht.

Beispiel:

GPS-Modul deaktiviert
↓
Waters darf weiterhin funktionieren,
wenn Waters eine eigene technische Standortabfrage
für seine benötigte Funktion bereitstellen kann.

Fachmodule dürfen bei Bedarf eigene technische Fallbacks implementieren.

Keine unnötigen Abhängigkeiten zwischen Fachmodulen.

Zentrale Core-Komponenten bleiben davon unberührt.

⸻

20. ABHÄNGIGKEITSPRÜFUNG

Vor dem Einbau einer Abhängigkeit wird geprüft:

1. Ist sie technisch zwingend?
2. Ist sie fachlich sinnvoll?
3. Kann das Modul die Funktion selbstständig bereitstellen?
4. Würde das Abschalten des abhängigen Moduls eine andere Funktion beschädigen?
5. Gibt es eine zentrale Core-Schnittstelle, die dafür vorgesehen ist?
6. Würde eine direkte Modulabhängigkeit einen unnötigen Loop erzeugen?

Grundsätzlich gilt:

Minimale notwendige Abhängigkeit.

⸻

21. ABHÄNGIGKEITS-LOOPS VERMEIDEN

Fachmodule dürfen keine zyklischen Abhängigkeiten erzeugen.

Nicht zulässig:

Modul A
↓
Modul B
↓
Modul A

oder:

Waters
↓
GPS
↓
Waters

Abhängigkeiten müssen gerichtet und nachvollziehbar sein.

Wenn zwei Module gegenseitig Funktionen benötigen, ist zunächst zu prüfen, ob:

* die benötigte Funktion in das eigene Modul gehört
* eine Core-Schnittstelle sinnvoll ist
* eine neutrale Service-Schnittstelle erforderlich ist

⸻

22. USER-ID-PRÜFUNG

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

23. MASTER-DATEIEN

Wenn eine Datei erstellt, ersetzt oder überarbeitet wird, wird grundsätzlich die vollständige Datei ausgegeben.

Keine:

* Patch-Fragmente
* Diff-Ausschnitte
* Such-und-Ersetzen-Anweisungen
* unvollständigen Dateien

Bei mehreren zusammengehörenden Dateien werden möglichst alle betroffenen Dateien gemeinsam ausgegeben.

Jede Datei erhält einen eindeutigen Pfad.

⸻

24. AUSGABEFORMAT

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

25. CHATGPT → WORKING COPY → GITHUB

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
gezielt erneut prüfen

⸻

26. NACH-ÜBERTRAGUNGS-PRÜFUNG

Nach der Übertragung einer neuen oder geänderten Datei wird nur das geprüft, was für den abgeschlossenen Arbeitsschritt erforderlich ist.

Mindestens:

* Datei vorhanden
* richtiger Pfad
* Inhalt vollständig
* erwartete Version vorhanden
* relevante Abhängigkeit vorhanden
* keine unerwartete Änderung an anderen Dateien

Danach gilt der Arbeitsschritt als abgeschlossen.

⸻

27. OK-REGEL

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

28. KEINE PARALLELENTWICKLUNG

Grundsätzlich wird jeweils nur ein fachlicher Arbeitsschritt verfolgt.

Ausnahmen:

* zwingende Core-Abhängigkeit
* nachgewiesener Schnittstellenfehler
* ausdrücklich beauftragte Änderung

Mehrere Dateien dürfen innerhalb desselben Arbeitsschritts gemeinsam bearbeitet werden, wenn sie fachlich zusammengehören.

⸻

29. ABGESCHLOSSENE MODULE

Ein abgeschlossenes Modul wird nicht ohne konkreten technischen Grund erneut verändert.

Änderungen nur bei:

* nachgewiesenem Fehler
* zwingender Schnittstellenänderung
* notwendiger Core-Anpassung
* ausdrücklich gewünschter Erweiterung

⸻

30. AKTUELLER ARBEITSÜBERGANG

Der aktuelle technische Übergang ist:

Waters Master

Pfad:

modules/waters

⸻

31. PROJEKTSTRUKTUR AKTUALISIEREN

Wenn während der Entwicklung eine neue Datei oder ein neuer Ordner entsteht, wird nach erfolgreicher Übertragung ein Structure Update erstellt.

Dabei wird niemals nur die Chat-Historie als Grundlage verwendet.

Der neue Pfad wird:

1. auf GitHub verifiziert
2. in die Canonical Project Structure aufgenommen
3. im Structure Update dokumentiert

⸻

32. STRUCTURE UPDATE – KURZFORMAT

Für einfache Ergänzungen kann dieses verkürzte Format verwendet werden:

────────────────────────────────────────
STRUCTURE UPDATE
────────────────────────────────────────
Datum: DD.MM.YYYY
Neu:
- pfad/datei
- pfad/ordner/
Geändert:
- pfad/datei
Gelöscht:
- pfad/datei
Zweck:
Kurze Beschreibung.
Status:
Auf GitHub verifiziert.
────────────────────────────────────────

Dieser Block wird unter dem bestehenden AI_CONTEXT ergänzt.

⸻

33. VERALTETE STRUKTUREINTRÄGE

Wenn eine Datei oder ein Ordner gelöscht oder verschoben wurde:

1. aktuellen GitHub-Stand prüfen
2. alten Eintrag aus der Canonical Project Structure entfernen bzw. korrigieren
3. neuen Pfad aufnehmen
4. Änderung im Structure Update dokumentieren

Keine alten Pfade dauerhaft als gültig behandeln.

⸻

34. STRUKTUR-SYNCHRONISATION

Die Canonical Project Structure ist eine Orientierung.

Bei strukturellen Änderungen gilt:

GitHub
↓
tatsächliche Struktur
↓
AI_CONTEXT aktualisieren

Nicht umgekehrt.

Der AI_CONTEXT darf niemals dazu verwendet werden, eine auf GitHub nicht vorhandene Datei als existent anzunehmen.

⸻

35. ARBEITSGEDÄCHTNIS

Der AI_CONTEXT soll insbesondere folgende Informationen dauerhaft verfügbar halten:

* bekannte Projektpfade
* Root-Struktur
* Modulstruktur
* Modulpfade
* Core-Struktur
* Datenbankstruktur
* abgeschlossene Module
* aktuelle Arbeitsübergänge
* strukturelle Ergänzungen
* wichtige technische Architekturentscheidungen
* vermiedene Abhängigkeiten
* bekannte technische Besonderheiten

Dabei werden keine unnötigen Chatdetails gespeichert.

Ziel ist:

Nicht jedes Mal dieselbe Projektorientierung neu durchführen.

⸻

36. STRUKTURPRÜFUNG OHNE ENDLOSSCHLEIFE

Die Projektstruktur wird nicht bei jedem einzelnen Arbeitsschritt vollständig neu eingelesen.

Stattdessen:

Bekannter Pfad vorhanden
↓
gezielt diese Datei / diesen Ordner prüfen

Eine erneute vollständige Strukturanalyse erfolgt nur bei:

* nachgewiesener struktureller Änderung
* neuem Modul
* mehreren neuen Dateien/Ordnern
* widersprüchlichen Pfadangaben
* veraltetem AI_CONTEXT
* ausdrücklichem Auftrag

Damit wird verhindert, dass die Entwicklung durch wiederholte Gesamtprüfungen in eine Endlosschleife gerät.

⸻

37. GRUNDREGEL

Der aktuelle GitHub-Stand bestimmt die technische Realität.

Der AI_CONTEXT bestimmt die bekannte Arbeitslandkarte.

PROJECT_ARCHITECTURE.md beschreibt die Architektur.

PROJECT_STATUS.md beschreibt den Projektstatus.

PROJECT_TEST_PLAN.md beschreibt die Tests.

Keine dieser Dateien ersetzt die tatsächliche Prüfung einer betroffenen Datei auf GitHub.

⸻

STRUKTURELLER ABSCHLUSS

Nach jedem abgeschlossenen strukturellen Arbeitsschritt kann folgender Block unten angefügt werden:

────────────────────────────────────────
CATCHTRACK STRUCTURE UPDATE
────────────────────────────────────────
Datum:
[Datum]
Neue Dateien:
- [Pfad]
Neue Ordner:
- [Pfad]
Geänderte Dateien:
- [Pfad]
Gelöschte Dateien:
- [Pfad]
Zweck:
[Kurze Beschreibung]
Abhängigkeiten:
[Keine / Pfade]
Status:
Auf GitHub übertragen und verifiziert.
────────────────────────────────────────

Ende AI_CONTEXT.md