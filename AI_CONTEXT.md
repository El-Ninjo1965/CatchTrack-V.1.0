CatchTrack – AI CONTEXT

1. Zweck dieser Datei

Diese Datei definiert die verbindlichen technischen Arbeitsregeln für die Weiterentwicklung von CatchTrack.

Sie dient als zentrale Arbeitsgrundlage für jede weitere Entwicklung.

Der tatsächlich vorhandene GitHub-Dateistand hat grundsätzlich Vorrang vor älteren Annahmen, Chatverläufen oder nicht mehr aktuellen Dokumentationen.

⸻

2. Verbindliche Priorität der Informationsquellen

Bei jeder technischen Aufgabe gilt folgende Reihenfolge:

1. Aktueller GitHub-Dateistand
2. Tatsächliche aktuelle Ordner- und Dateistruktur
3. Aktuelle Commit-Historie
4. PROJECT_STATUS.md
5. PROJECT_RULES.md
6. PROJECT_MODULE_PLAN.md
7. Diese Datei
8. Ältere Chatverläufe und frühere Annahmen

Bei Widersprüchen ist der tatsächliche aktuelle GitHub-Stand maßgeblich.

Es darf nichts aus älteren Gesprächen als weiterhin gültig angenommen werden, wenn der aktuelle Projektstand etwas anderes zeigt.

⸻

3. Grundregel: Nicht raten

Es darf niemals aufgrund einer erwarteten oder früher bekannten Struktur angenommen werden, dass eine Datei oder Funktion existiert.

Vor Änderungen müssen die tatsächlich vorhandenen Dateien geprüft werden.

Insbesondere bei Modulen:

modules/[MODULNAME]/

muss immer der vollständige aktuelle Ordner geprüft werden.

Dabei sind einzubeziehen:

* HTML
* CSS
* JavaScript
* JSON
* Konfigurationen
* Daten-/Service-Dateien
* Unterordner
* sonstige Dateien
* Altbestände

⸻

4. Änderungsgrundsatz

Bestehende funktionierende Dateien werden nicht unnötig verändert.

Vor jeder Änderung ist zu prüfen:

* Wird die Datei tatsächlich benötigt?
* Wird sie importiert?
* Wird sie dynamisch geladen?
* Wird sie vom Module Manager verwendet?
* Wird sie vom Router verwendet?
* Wird sie von anderen Modulen verwendet?
* Bestehen Datenbankabhängigkeiten?
* Bestehen Konfigurationsabhängigkeiten?
* Ist sie Bestandteil einer abgeschlossenen Architektur?

Keine Datei darf stillschweigend gelöscht werden.

Löschungen müssen ausdrücklich als Löschkandidaten ausgewiesen werden.

⸻

5. Core-Master – verbindlicher Freeze

Der zentrale CatchTrack-Core wurde als Master-Version konsolidiert.

Der Core gilt ab diesem Stand als:

CORE MASTER
STATUS: ABGESCHLOSSEN / FROZEN

Die folgenden Dateien sind Bestandteil des Core-Masters:

index.html
app.js
core/storageManager.js
core/languageManager.js
core/permissionManager.js
core/api.js
core/router.js
core/moduleInstaller.js
core/moduleManager.js
core/runtimeStorage.js
core/runtimeStatus.js
core/errorHandler.js
database/database.js
database/schema.sql
database/migrations/001_initial.sql
database/migrations/002_users.sql
database/migrations/003_core_master.sql

Diese Dateien dürfen bei der Entwicklung einzelner Fachmodule nicht unnötig neu erstellt, ersetzt oder verändert werden.

Insbesondere gilt:

app.js
database/schema.sql
database/database.js
core/*

sind grundsätzlich eingefroren.

⸻

6. Ausnahme vom Core-Freeze

Eine Änderung des Core-Masters ist nur zulässig, wenn eine konkrete technische Anforderung dies zwingend erforderlich macht.

Beispiele:

* ein bisher nicht vorgesehener globaler Dienst wird benötigt
* eine bestehende Schnittstelle ist nachweislich fehlerhaft
* eine Sicherheits- oder Datenintegritätsproblematik wird festgestellt
* eine globale Architekturentscheidung wird ausdrücklich geändert
* mehrere Module benötigen eine neue zentrale Funktion

In diesem Fall darf der Core nicht einfach nebenbei verändert werden.

Vor einer Core-Änderung muss ausdrücklich festgestellt werden:

CORE-ÄNDERUNG ERFORDERLICH

Anschließend muss die Änderung begründet und als eigener Arbeitsschritt behandelt werden.

⸻

7. app.js – Master-Regel

app.js ist der zentrale Application Bootstrap.

Die Datei ist für globale Initialisierung zuständig.

Dazu gehören insbesondere:

* Konfiguration laden
* Datenbank initialisieren
* Migrationen registrieren
* Core-Dienste initialisieren
* Modulkonfiguration laden
* Module starten
* globale Fehlerbehandlung
* Runtime-Status

Ein einzelnes Fachmodul darf nicht dazu führen, dass app.js bei jedem Modulwechsel erweitert wird.

Die Module müssen über die vorhandenen Core-Schnittstellen eingebunden werden.

⸻

8. database/schema.sql – Master-Regel

database/schema.sql ist das zentrale Basisschema für eine neue CatchTrack-Datenbank.

Es ist kein Modul-Schema.

Die Datei wird nicht für jedes neue Modul verändert.

Bereits vorhandene zentrale Datenstrukturen müssen wiederverwendet werden.

Ein Modul darf nicht einfach zusätzliche zentrale Tabellen in schema.sql verlangen.

Wenn eine neue Datenbankstruktur für ein Modul tatsächlich erforderlich ist, wird dafür eine eigene Migration verwendet.

⸻

9. Datenbank-Migrationssystem

CatchTrack verwendet ein migrationsbasiertes Datenbanksystem.

Aktuelle Migrationen:

database/migrations/001_initial.sql
database/migrations/002_users.sql
database/migrations/003_core_master.sql

Diese Migrationen sind Bestandteil der Datenbankhistorie.

Sie dürfen nicht nachträglich verändert oder gelöscht werden, nur weil spätere Versionen die Struktur erweitern.

Neue strukturelle Änderungen werden ausschließlich durch neue Migrationen vorgenommen.

Beispiel:

004_gps.sql
005_weather.sql
006_tide.sql

Eine Migration muss:

* eindeutig versioniert sein
* reproduzierbar sein
* bestehende Daten berücksichtigen
* keine bestehenden Informationen unnötig zerstören
* zur zentralen Datenbankarchitektur passen

⸻

10. Modularchitektur

Jedes Fachmodul befindet sich unter:

modules/[MODULNAME]/

Ein Modul ist grundsätzlich eigenständig.

Typische Struktur:

modules/
└── gps/
    ├── module.json
    ├── GPS.html
    ├── GPS.css
    └── GPS.js

Die tatsächliche Struktur muss jedoch immer aus GitHub gelesen werden.

Es darf keine Dateiliste aus früheren Annahmen vorausgesetzt werden.

⸻

11. Module Manager

Module werden über den zentralen Module Manager geladen.

Der Module Manager übernimmt unter anderem:

* Moduldefinition
* Aktivierung
* HTML-Laden
* CSS-Laden
* JavaScript-Laden
* Initialisierung
* Modulstatus
* Fehlerbehandlung

Ein Fachmodul darf nicht am Module Manager vorbei eigene globale Ladewege etablieren.

⸻

12. module.json

module.json definiert die technische Modulbeschreibung.

Dazu können gehören:

* Modulname
* Version
* Pfad
* Aktivierungsstatus
* HTML-Datei
* CSS-Datei
* JavaScript-Datei
* Initializer
* Abhängigkeiten
* weitere Modulmetadaten

Die tatsächliche bestehende Definition hat Vorrang.

⸻

13. Schnittstellen

Module müssen klare Schnittstellen zum Core besitzen.

Ein Modul darf globale Core-Funktionen verwenden, soll diese aber nicht duplizieren.

Beispiele:

CatchTrackDatabase
CatchTrackAPI
CatchTrackRouter
CatchTrackStorageManager
CatchTrackLanguageManager
CatchTrackPermissionManager
CatchTrackRuntimeStatus
CatchTrackErrorHandler
CatchTrackModuleManager

Wenn eine benötigte globale Funktion bereits existiert, wird sie verwendet.

Es werden keine parallelen Ersatzsysteme gebaut.

⸻

14. Datenbankzugriff von Modulen

Module greifen auf die zentrale Datenbank zu.

Es wird keine zweite parallele Datenbank aufgebaut.

Grundsätzlich:

Modul
  ↓
CatchTrackDatabase
  ↓
SQL.js
  ↓
zentrale CatchTrack-Datenbank

Modulspezifische Datenbankerweiterungen werden über Migrationen vorgenommen.

⸻

15. Automatisch ermittelte Daten

Automatisch ermittelte Daten sind grundsätzlich als:

Vorschlag

zu behandeln, sofern sie nicht ausdrücklich als verlässlich und endgültig definiert wurden.

Das betrifft insbesondere:

* GPS
* Wetter
* Fischidentifikation
* Geodaten
* automatische Standortbestimmung
* KI-Ergebnisse
* externe Daten
* berechnete Werte

Der Benutzer muss automatische Werte bei Bedarf korrigieren können.

Automatisch ermittelte Daten dürfen nicht ungeprüft endgültige Benutzerdaten überschreiben.

⸻

16. GPS-Grundprinzip

GPS ist eine Datenquelle.

GPS liefert unter anderem:

* Latitude
* Longitude
* Genauigkeit
* Höhe
* Zeitpunkt
* Quelle

GPS-Daten können anderen Modulen zur Verfügung gestellt werden.

Insbesondere das Fangmodul kann einen GPS-Snapshot speichern.

Die bereits vorbereiteten GPS-Felder im zentralen Fangdatensatz dürfen nicht unnötig dupliziert werden.

GPS ist daher nicht automatisch gleichbedeutend mit einer eigenen zentralen GPS-Tabelle.

⸻

17. Multilingualität

Neue Module müssen multilingual vorbereitet werden.

Texte dürfen nicht unnötig fest in JavaScript oder HTML eingebaut werden.

Die vorhandene:

CatchTrackLanguageManager

Architektur ist zu verwenden.

Deutsch ist derzeit die Standardsprache.

Weitere Sprachen müssen später ergänzt werden können.

⸻

18. Runtime und Fehlerbehandlung

Module müssen die vorhandene Runtime- und Fehlerarchitektur verwenden.

Insbesondere:

CatchTrackErrorHandler
CatchTrackRuntimeStatus
CatchTrackRuntimeStorage

Fehler dürfen nicht stillschweigend verschluckt werden.

Modulfehler müssen nachvollziehbar bleiben.

⸻

19. Wiederverwendbarkeit

Funktionen sollen möglichst so entwickelt werden, dass andere Module sie später verwenden können.

Beispiel:

GPS sollte nicht nur eine Oberfläche darstellen, sondern eine klare Datenstruktur bereitstellen.

Beispielhafte konzeptionelle Struktur:

GPS Service
    ↓
Position
    ├── latitude
    ├── longitude
    ├── accuracy
    ├── altitude
    ├── timestamp
    └── source

Andere Module sollen diese Daten verwenden können, ohne GPS-internen Code duplizieren zu müssen.

⸻

20. Keine Parallelentwicklung

Bei der Entwicklung eines Moduls werden grundsätzlich keine anderen Fachmodule nebenbei umgebaut.

Ausnahmen sind nur:

* zwingende Core-Abhängigkeiten
* nachgewiesene Schnittstellenfehler
* ausdrücklich beauftragte Änderungen

Ziel:

ein Modul
→ vollständig
→ getestet
→ abgeschlossen
→ nächstes Modul

⸻

21. Arbeitsablauf bei jedem neuen Modul

Schritt 1 – Referenzen

Zuerst werden die aktuellen Projektdateien gelesen:

AI_CONTEXT.md
PROJECT_RULES.md
PROJECT_STATUS.md
PROJECT_MODULE_PLAN.md

Danach werden nur die für das Modul relevanten Referenzdateien gelesen.

⸻

Schritt 2 – tatsächlichen Projektstand prüfen

Zu prüfen sind:

* aktueller GitHub-Dateistand
* relevante Commit-Historie
* dokumentierter Projektstatus
* vorhandene Modulstruktur
* bestehende Schnittstellen
* relevante Abhängigkeiten

⸻

Schritt 3 – vollständigen Modulordner prüfen

Der komplette Ordner:

modules/[MODULNAME]/

wird gelesen.

Nicht nur eine erwartete Dateiliste.

⸻

Schritt 4 – Bestandsaufnahme

Vor jeder Entwicklung wird zunächst kurz ausgegeben:

1. aktueller Modulstand
2. vorhandene Dateien
3. fehlende Dateien
4. Abhängigkeiten
5. Altbestände / Löschkandidaten
6. bereits vorhandene Funktionen
7. notwendige nächste Schritte

Danach wird auf Bestätigung gewartet.

⸻

22. Entwicklung eines Moduls

Nach Bestätigung wird das Modul als vollständige Master-Version entwickelt.

Wenn mehrere Dateien zusammengehören, werden sie gemeinsam entwickelt.

Die Dateien müssen:

* miteinander harmonieren
* zur CatchTrack-Architektur passen
* bestehende fertige Funktionen berücksichtigen
* klare Schnittstellen besitzen
* wiederverwendbar sein
* multilingual vorbereitet sein
* Runtime- und Fehlerbehandlung verwenden
* die zentrale Datenbankarchitektur verwenden
* automatische Daten als korrigierbare Vorschläge behandeln

⸻

23. Vorhandene Dateien

Eine vorhandene Datei wird nicht zwanghaft geflickt.

Wenn die Struktur sinnvoll ist:

gezielt integrieren

Wenn sie beschädigt, widersprüchlich, veraltet oder unnötig kompliziert ist:

vollständige Master-Version erstellen

Gültige bestehende Funktionen und Informationen dürfen dabei nicht verloren gehen.

⸻

24. Ausgabeformat für neue Dateien

Bei der Entwicklung werden zunächst vollständig aufgelistet:

ZU ERSETZEN
- Dateien
NEU ZU ERSTELLEN
- Dateien
LÖSCHKANDIDATEN
- Dateien
- kurze Begründung
UNVERÄNDERT
- Dateien

Danach folgen die vollständigen Inhalte.

Keine unnötigen Teilstücke.

Keine unvollständigen Patch-Fragmente, wenn eine vollständige Master-Datei sinnvoller ist.

⸻

25. Copyblock-Regel

Wenn mehrere Dateien gleichzeitig erstellt oder ersetzt werden müssen, werden sie möglichst gemeinsam in einer Ausgabe geliefert.

Der Benutzer soll nicht vier oder sechs aufeinanderfolgende Antworten mit jeweils einer einzelnen Datei erhalten.

Stattdessen:

ein Arbeitsschritt
→ ein zusammenhängender Dateisatz
→ alle benötigten Dateien

Beispiel:

GPS.html
GPS.css
GPS.js
module.json

werden möglichst gemeinsam ausgegeben.

Die Anzahl der Dateien ist nicht begrenzt.

Diese Regel gilt verbindlich für alle weiteren Entwicklungsarbeiten.

⸻

26. Keine unnötigen Wiederholungen

Bereits bestätigte und abgeschlossene Dateien werden nicht erneut vollständig ausgegeben, sofern keine Änderung erforderlich ist.

Insbesondere der Core-Master wird nicht bei jedem Modul erneut produziert.

⸻

27. Löschregeln

Eine Datei darf nicht stillschweigend gelöscht werden.

Vor einem Löschvorschlag müssen geprüft werden:

* statische Imports
* dynamische Imports
* Script-Lader
* Module Manager
* module.json
* Router
* Core-Abhängigkeiten
* andere Module
* Konfiguration
* Migrationen
* historische Funktion

Erst danach darf eine Datei als:

LÖSCHKANDIDAT

aufgeführt werden.

⸻

28. Aktueller Core-Löschkandidat

Der derzeit bekannte redundante Altbestand ist:

core/database.js

Begründung:

* alter paralleler Datenbank-Stub
* aktueller Datenbankmanager befindet sich unter database/database.js
* aktuelles index.html lädt database/database.js
* keine aktuelle Core-Abhängigkeit auf core/database.js

Die Datei bleibt bis zur ausdrücklichen Löschung als Altbestand bestehen.

⸻

29. GitHub-Commit-Regel

Nach einer Entwicklung gilt:

Die Dateien gelten erst dann als tatsächlich im Projektstand angekommen, wenn sie auf GitHub überprüft wurden.

Nach Mitteilung:

Commit erfolgt

wird erneut geprüft:

* Dateien vorhanden
* Dateiinhalt
* Commit
* Commit-SHA
* relevante Abhängigkeiten
* Modulstruktur

Erst danach wird der erreichte technische Stand bestätigt.

Es darf niemals behauptet werden, eine Datei sei auf GitHub übertragen worden, wenn dies nicht tatsächlich geprüft wurde.

⸻

30. Projektfortschritt

Der aktuelle Fortschritt wird primär in:

PROJECT_STATUS.md

geführt.

Diese Datei beschreibt den tatsächlichen Projektzustand.

AI_CONTEXT.md beschreibt dagegen die dauerhaften Arbeits- und Architekturregeln.

Daher gilt:

AI_CONTEXT.md
    =
verbindliche Arbeitsregeln / Architektur
PROJECT_STATUS.md
    =
aktueller Projektfortschritt

⸻

31. Arbeitsprinzip ab dem Core-Freeze

Ab dem abgeschlossenen Core-Master gilt:

CORE
    ↓
FROZEN
FACHMODULE
    ↓
einzeln
    ↓
vollständig
    ↓
über definierte Schnittstellen
    ↓
auf den Core aufsetzen

Der Core wird nicht bei jedem neuen Modul erneut umgebaut.

Wenn ein Modul mit dem vorhandenen Core auskommt:

Core unverändert lassen.

Wenn ein Modul nachweislich eine neue globale Funktion benötigt:

Core-Änderung ausdrücklich feststellen
→ begründen
→ separat behandeln
→ neuen Core-Stand dokumentieren

⸻

32. Verbindliche Grundregel

Die technische Leitlinie für CatchTrack lautet:

Nicht raten.
Nicht unnötig neu bauen.
Keine fertigen Dateien ohne Grund verändern.
Keine Dateien stillschweigend löschen.
Keine parallelen Systeme entwickeln.
Bestehende Schnittstellen verwenden.
Neue Funktionen sauber kapseln.
Core stabil halten.
Module einzeln vollständig fertigstellen.
Aktuellen GitHub-Stand als Wahrheit behandeln.

Diese Regeln gelten für die weitere CatchTrack-Entwicklung verbindlich.