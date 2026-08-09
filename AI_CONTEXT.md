# AI_CONTEXT Version 1.3
# Updated: 2026-08-09
# CatchTrack – AI Context
## Zweck
Diese Datei ist der zentrale Einstiegspunkt für ChatGPT/AI zur
Wiederaufnahme der CatchTrack-Entwicklung.
Wenn der Benutzer sagt:
„AI einlesen“
oder
„Lies die AI-Datei ein“
sollen zunächst diese Datei und anschließend alle darin
aufgeführten Referenzdateien eingelesen werden.
—
## 1. Verbindliche Projektregeln
Zuerst einlesen:
- `PROJECT_RULES.md`
Diese Datei definiert die verbindlichen Arbeitsregeln.
—
## 2. Aktueller Projektwissensstand
Einlesen:
- `PROJECT_KNOWLEDGE.md`
Diese Datei beschreibt den bisher bekannten Projektstand,
Entscheidungen, Architektur und Übergabepunkte.
—
## 3. Modul- und Arbeitsplan
Einlesen:
- `PROJECT_MODULE_PLAN.md`
Diese Datei enthält:
- Modulreihenfolge
- zu erstellende Dateien
- bereits bearbeitete Dateien
- offene Dateien
- Abhängigkeiten
- Altlasten
- geplante Löschungen
- Bearbeitungsstatus
—
## 4. Runtime- und Teststatus
Einlesen:
- `runtime/runtime_status.json`
- `runtime/error.log`
- `localStorage.json`
Diese Dateien zeigen den aktuellen Laufzeitstatus,
bekannte Fehler und den zuletzt übertragenen
Browser-LocalStorage-Snapshot.
`localStorage.json` ist bei CatchTrack eine wichtige
Persistenz- und Diagnosequelle und darf bei der Analyse
der Runtime nicht ignoriert werden.
—
## 5. Projektstruktur
Die aktuelle GitHub-Projektstruktur prüfen.
Besonders beachten:
- `core/`
- `modules/`
- `config/`
- `database/`
- `runtime/`
- `libraries/`
Nicht nur die genannten Dateien verwenden, sondern die
tatsächliche GitHub-Struktur als Referenz betrachten.
—
## 6. GitHub-Referenz
Repository:
`El-Ninjo1965/CatchTrack-V.1.0`
Branch:
`main`
Bei jeder Wiederaufnahme zusätzlich prüfen:
1. aktuellen Branch-Stand
2. letzten relevanten Commit
3. Commit-Datum und Uhrzeit
4. Commit-Nachricht
5. geänderte Dateien
6. relevante Diff-Informationen
Die Commit-Historie dient als zusätzliche Fortschrittsreferenz.
Der Benutzer verwendet grundsätzlich den Dateinamen als
Commit-Namen.
Beispiel:
`fishData.js`
Der Commit-Name kann deshalb direkt als Hinweis darauf
verwendet werden, welche Datei zuletzt übertragen wurde.
—
## 7. Arbeitsreihenfolge bei Wiederaufnahme
Bei „AI einlesen“:
1. `AI_CONTEXT.md`
2. `PROJECT_RULES.md`
3. `PROJECT_KNOWLEDGE.md`
4. `PROJECT_MODULE_PLAN.md`
5. `runtime/runtime_status.json`
6. `runtime/error.log`
7. `localStorage.json`
8. aktuelle GitHub-Projektstruktur
9. relevante aktuelle Dateien
10. relevante Commit-Historie
Danach den tatsächlichen Stand mit den Planungsdateien
abgleichen.
—
## 8. GitHub-Zugriff und Schreibrechte
Die GitHub-Anbindung von ChatGPT wird grundsätzlich als
lesender Zugriff behandelt.
ChatGPT soll nicht davon ausgehen, dass Schreibrechte auf
das Repository vorhanden sind.
Der Benutzer führt Änderungen am Repository über
Working Copy auf dem iPad durch.
Daher gilt:
- ChatGPT liest Dateien und Projektstände von GitHub.
- ChatGPT prüft Commits und Dateien auf GitHub.
- ChatGPT schreibt grundsätzlich nicht direkt in das Repository.
- Änderungen werden vom Benutzer manuell über Working Copy
  übernommen.
- Anschließend erstellt der Benutzer den GitHub-Commit.
- Danach prüft ChatGPT den neuen Stand wieder auf GitHub.
Falls ein Schreibversuch über die GitHub-Anbindung mit
fehlenden Berechtigungen, insbesondere HTTP 403, abgelehnt
wird, darf nicht behauptet werden, dass die Änderung
durchgeführt wurde.
Die Änderung muss dann über Working Copy erfolgen.
—
## 9. GitHub-Verifikation nach „OK“
Wenn der Benutzer nach einer Dateiübertragung „OK“ sagt und
die Datei anschließend auf GitHub geprüft werden soll, ist
zunächst davon auszugehen, dass die Datei vom Benutzer
ordnungsgemäß hochgeladen und committed wurde.
Die Prüfung erfolgt verbindlich in dieser Reihenfolge.
### Schritt 1 – Commit-Historie prüfen
Zuerst wird die GitHub-Commit-Historie geprüft.
Dabei wird nach dem erwarteten Dateinamen bzw. Commit-Namen
gesucht.
Beispiel:
Erwartete Datei:
`fishData.js`
Erwarteter Commit:
`fishData.js`
Es wird geprüft:
- ob der Commit vorhanden ist
- Commit-Nachricht
- Commit-Datum
- Commit-Uhrzeit
- Commit-SHA
- geänderte Dateien
- gegebenenfalls Commit-Diff
Der Commit ist damit die erste Übermittlungsreferenz.
### Schritt 2 – Commit verifizieren
Wenn ein passender Commit gefunden wurde, wird geprüft,
ob die erwartete Datei tatsächlich Bestandteil dieses
Commits ist.
### Schritt 3 – Datei direkt abrufen
Erst danach wird die Datei anhand ihres tatsächlichen
Repository-Pfades direkt abgerufen.
### Wiederholungsregel
Bei:
- 404 / Not Found
- Timeout
- leerem Ergebnis
- unvollständigem Ergebnis
- Connector-Fehler
- offensichtlichem temporärem GitHub-Problem
werden bis zu **vier Abrufversuche direkt hintereinander**
durchgeführt.
Die Wiederholungen erfolgen:
- ohne Zwischenmeldung
- ohne Rückfrage
- unmittelbar hintereinander
### Schritt 4 – Commit als Fallback
Wenn der Commit eindeutig vorhanden ist und die Datei im
Commit nachweisbar ist, der direkte Dateiabruf aber weiterhin
fehlschlägt, gilt die Datei als übermittelt.
Der Commit dient dann als maßgebliche
Übermittlungsreferenz.
—
## 10. Dateiarbeit
Der Benutzer arbeitet über Working Copy.
Dateien werden vom Benutzer einzeln nach GitHub übertragen
und committed.
Bei Änderungen bestehender Dateien:
1. aktuelle Datei aus GitHub lesen
2. Abhängigkeiten prüfen
3. Projektplan prüfen
4. vollständige Datei erstellen
5. vollständige Datei dem Benutzer zur Übernahme geben
6. Benutzer übernimmt die Datei über Working Copy
7. Benutzer erstellt den GitHub-Commit
8. anschließend GitHub-Stand und Commit prüfen
Der Benutzer möchte grundsätzlich vollständige
Ersatzdateien.
Keine:
- Teiländerungen
- Patch-Anweisungen
- „Ersetze diesen Abschnitt“-Anweisungen
- unvollständigen Codeblöcke
wenn eine vollständige Ersatzdatei möglich ist.
Nach Möglichkeit immer die komplette fertige Datei liefern.
—
## 11. Vollständige Dateien als verbindliche Regel
Wenn eine bestehende Datei geändert werden soll, wird nach
Möglichkeit immer die vollständige aktuelle Ersatzdatei
ausgegeben.
Dies gilt insbesondere für:
- JavaScript
- HTML
- CSS
- JSON
- Markdown
- Konfigurationsdateien
- Projektregeln
- Projektdokumentation
- `AI_CONTEXT.md`
- `PROJECT_RULES.md`
- `PROJECT_KNOWLEDGE.md`
- `PROJECT_MODULE_PLAN.md`
Wenn `AI_CONTEXT.md` geändert wird, muss dem Benutzer immer
die vollständige Datei ausgegeben werden.
Wenn `PROJECT_RULES.md` geändert wird, muss dem Benutzer immer
die vollständige Datei ausgegeben werden.
—
## 12. Verhalten bei „OK“
Wenn der Benutzer „OK“ sagt, gilt die vorherige Anweisung als
bestätigt bzw. ausgeführt.
Nicht erneut fragen, ob der bestätigte Schritt ausgeführt
werden soll.
Stattdessen direkt mit dem nächsten sinnvollen Arbeitsschritt
fortfahren.
Wenn nach einem „OK“ eine GitHub-Prüfung vorgesehen ist,
wird diese selbstständig durchgeführt.
—
## 13. Entwicklungsprinzip
CatchTrack soll langfristig modular aufgebaut werden.
Neue Module sollen nach Möglichkeit:
- eigenständig funktionieren
- klar definierte Schnittstellen besitzen
- die zentrale Datenbank verwenden
- mit anderen Modulen kommunizieren können
- mehrsprachig vorbereitet sein
- erweiterbar sein
- keine unnötigen Abhängigkeiten erzeugen
Daten- und Inhaltsmodule sollen später über eine zentrale
Admin-Oberfläche administrierbar sein.
Das betrifft nach Möglichkeit:
- Inhalte
- Texte
- Beschriftungen
- Eingabefelder
- Feldtypen
- Kategorien
- Reihenfolgen
- aktivierte/deaktivierte Felder
- weitere konfigurierbare Eigenschaften
Die Architektur soll langfristig eher einem modularen CMS
bzw. E-Commerce-System entsprechen als einer Sammlung fest
programmierter Einzelansichten.
Die erste Implementierung eines Moduls soll trotzdem zunächst
klein, stabil und testbar bleiben.
—
## 14. Entwicklungsstrategie – Basis zuerst
Die Entwicklung wird grundsätzlich in zwei Gruppen aufgeteilt.
### Gruppe A – eigenständige Basis- und Datenmodule
Diese Module werden zuerst fertiggestellt.
Dazu gehören insbesondere:
- Wetter
- GPS / Standort
- Equipment
- weitere eigenständige Datenmodule
- sonstige Module ohne komplexe Integration in Fish Data
  oder das Fangbuch
Diese Module sollen:
1. vollständig implementiert werden
2. eigenständig funktionieren
3. getestet werden
4. Fehler bereinigt werden
5. als stabile Datenquellen für spätere Module dienen
### Gruppe B – integrative Module
Diese Module werden erst danach entwickelt.
Dazu gehören insbesondere:
- Fangbuch / Catchbook
- Fish Data
- Fischkarten
- komplexe Verknüpfungen zwischen Fisch-, Fang-,
  Wetter-, GPS- und Equipmentdaten
- umfassende Fisch-/Fangverwaltung
### Grundregel
Zuerst werden die benötigten Datenquellen stabil aufgebaut.
Danach werden die integrativen Module entwickelt.
Dadurch sollen:
- doppelte Implementierungen vermieden werden
- spätere Umbauten reduziert werden
- Schnittstellen auf tatsächlich vorhandenen Daten basieren
- das Fangbuch auf bereits getestete Module zugreifen können
- Fish Data erst mit fertigen Datenquellen verbunden werden
—
## 15. Entwicklungsreihenfolge
### Phase 1 – unabhängige Module
Zuerst:
- Wetter
- GPS / Standort
- Equipment
- weitere unabhängige Daten- und Funktionsmodule
Bereits fertiggestellte Module werden nicht unnötig neu
geschrieben.
### Phase 2 – Datenbasis überprüfen
Nach Fertigstellung der unabhängigen Module:
- Datenstrukturen prüfen
- Schnittstellen prüfen
- Datenzugriff prüfen
- Abhängigkeiten prüfen
- gemeinsame Nutzungsmöglichkeiten feststellen
### Phase 3 – Fangbuch / Catchbook
Erst danach wird das Fangbuch aufgebaut.
Das Fangbuch soll auf fertige Module zugreifen können.
Später können beispielsweise verknüpft werden:
- Fangdatum
- Uhrzeit
- GPS / Standort
- Wetter
- Gewässer
- Equipment
- Köder
- Fischart
- Fangdaten
### Phase 4 – Fish Data / Fischkarten
Danach wird Fish Data als umfassende Fischdatenbank und
Fischkarten-System aufgebaut.
### Phase 5 – Gesamtintegration
Zum Schluss werden:
- Fangbuch
- Fish Data
- Wetter
- GPS
- Equipment
- weitere Module
miteinander verbunden.
Die Integration erfolgt erst, wenn die beteiligten
Einzelmodule stabil sind.
—
## 16. Fish Data – späterer Entwicklungsbereich
Fish Data wird bewusst zurückgestellt, solange relevante
eigenständige Basis-/Datenmodule fertigzustellen sind.
Geplante Datei:
`modules/fishDatabase/fishData.js`
Die bisherige:
`modules/fishDatabase/fishDatabase.js`
wird zunächst nicht gelöscht.
### Langfristiges Ziel
Fish Data soll die zentrale Fischdatenbank bzw.
Fischkarten-Funktion von CatchTrack bilden.
Ein Fischdatensatz kann später unter anderem enthalten:
- deutscher Name
- weitere lokale Namen
- wissenschaftlicher Name
- Familie
- Beschreibung
- Bild
- Lebensraum
- Gewässertyp
- bevorzugte Tiefe
- bevorzugte Wassertemperatur
- Köder
- Fangmethoden
- beste Fangzeit
- Tageszeit
- Saison
- Schonzeit
- Mindestgröße
- typische Größe
- typisches Gewicht
- weitere fischereiliche Eigenschaften
- Verknüpfungen zum Fangbuch
Die tatsächlichen Datenfelder werden erst anhand der
vorhandenen Gesamtarchitektur festgelegt.
Fish Data darf nicht nur eine statische HTML-Anzeige sein.
Datenhaltung, Datenzugriff und Darstellung sollen soweit
sinnvoll getrennt werden.
—
## 17. Runtime, Storage und Fehlerprotokollierung
### Grundstruktur
Die Runtime-Persistenz besteht aus mehreren Ebenen:
```text
Fehler
  ↓
core/errorHandler.js
  ↓
core/runtimeStorage.js
  ↓
Browser LocalStorage
  ↓
localStorage.json

runtime/error.log und runtime/runtime_status.json
sind die lesbaren Projekt-/Runtime-Dateien.

core/errorHandler.js

Der Error Handler soll:

* normale JavaScript-Fehler erfassen
* unhandledrejection erfassen
* Fehler intern zwischenspeichern
* Fehler an den Runtime Storage übergeben
* Fehler an den Runtime Status melden
* Fehler diagnostizierbar machen

core/runtimeStorage.js

Der Runtime Storage ist für die Runtime-Persistenz zuständig.

Er darf nicht nur eine nicht persistente
Zwischenspeicherung darstellen.

Die genaue Persistenztechnik muss sich an der tatsächlich
vorhandenen CatchTrack-Architektur orientieren.

localStorage.json

localStorage.json ist der von CatchTrack verwendete
persistierte Snapshot des Browser-LocalStorage.

Die Datei kann unter anderem enthalten:

* Datenbank-Snapshots
* Runtime-Daten
* Statusdaten
* Fehler-/Logdaten
* weitere persistierte CatchTrack-Daten

Deshalb gilt:

localStorage.json ist eine wichtige Referenzdatei und darf
bei Runtime-, Storage-, Error-Handler- oder Datenbankproblemen
nicht ignoriert werden.

Wenn der Benutzer eine aktualisierte localStorage.json
über Working Copy nach GitHub überträgt, muss sie bei der
nächsten Prüfung berücksichtigt werden.

Wichtige Regel

localStorage.json darf niemals einfach durch eine neu
erfundene oder vereinfachte Struktur ersetzt werden.

Vor Änderungen an:

* core/runtimeStorage.js
* core/errorHandler.js
* core/runtimeStatus.js
* Datenbank-/Storage-Mechanismen

muss die aktuelle localStorage.json geprüft werden.

Bestehende persistierte Daten müssen erhalten bleiben.

Snapshot-Workflow

Wenn sich Runtime-Daten im Browser geändert haben:

1. Browser-/CatchTrack-LocalStorage aktualisieren
2. aktuellen LocalStorage-Snapshot erzeugen bzw. übernehmen
3. localStorage.json über Working Copy aktualisieren
4. Datei nach GitHub committen
5. Commit prüfen
6. localStorage.json erneut von GitHub einlesen
7. Inhalt mit dem erwarteten Runtime-Stand vergleichen

Die Datei ist damit nicht nur eine statische Projektdatei,
sondern gleichzeitig eine Diagnose- und
Persistenzreferenz.

runtime/error.log

runtime/error.log dient als lesbare Fehler-/Exportdatei.

Dass diese Datei leer ist, beweist nicht automatisch, dass
keine Laufzeitfehler aufgetreten sind.

Bei einer leeren error.log müssen zusätzlich geprüft werden:

* core/errorHandler.js
* core/runtimeStorage.js
* core/runtimeStatus.js
* localStorage.json
* tatsächliche Script-Ladereihenfolge
* Browser-LocalStorage

⸻

18. Script-Ladereihenfolge

Bei Runtime-abhängigen Funktionen muss die tatsächliche
Ladereihenfolge der JavaScript-Dateien geprüft werden.

Insbesondere muss sichergestellt sein, dass benötigte globale
Objekte vorhanden sind, bevor andere Module darauf zugreifen.

Beispiel:

runtimeStorage
  ↓
errorHandler
  ↓
runtimeStatus

Die tatsächliche Projektstruktur und index.html sind dabei
maßgeblich.

Keine Abhängigkeit darf nur angenommen werden.

⸻

19. Umgang mit bestehenden Dateien

Bestehende funktionierende Dateien werden nicht unnötig
verändert.

Vor jeder Änderung:

1. aktuelle Datei aus GitHub lesen
2. Abhängigkeiten feststellen
3. localStorage.json prüfen, wenn Storage/Runtime betroffen ist
4. Projektplan prüfen
5. prüfen, ob die Datei tatsächlich geändert werden muss
6. erst danach eine vollständige Ersatzdatei erstellen

Bei einem neuen Modul möglichst eine neue Datei verwenden,
anstatt eine funktionierende Altdatei immer wieder umzubauen.

Alte Dateien werden erst entfernt, wenn:

* die neue Implementierung funktioniert
* alle Abhängigkeiten umgestellt wurden
* die alte Datei nicht mehr benötigt wird
* der Schritt dokumentiert wurde

⸻

20. Test- und Fortschrittsverfahren

Nach jeder wichtigen Datei:

1. vollständige Datei erstellen
2. Benutzer übernimmt sie über Working Copy
3. Benutzer erstellt einen GitHub-Commit
4. GitHub-Commit prüfen
5. Datei auf GitHub erneut einlesen
6. Funktion testen
7. Fehler dokumentieren
8. erst danach nächsten Entwicklungsschritt beginnen

Bei Runtime-/Storage-Änderungen zusätzlich:

9. localStorage.json prüfen
10. Persistenz prüfen
11. runtime/error.log prüfen
12. runtime/runtime_status.json prüfen

Die GitHub-Commit-Historie ist dabei eine zusätzliche
Fortschrittsreferenz.

⸻

21. Aktueller Übergabepunkt

Das Basisskelett des Projekts steht.

Die bisherige Fish-Database-Implementierung zeigte beim Test
mehrfach wiederholte Fischdatensätze und anschließend eine
weiße Seite.

Fish Data wird deshalb momentan nicht weiter ausgebaut.

Der aktuelle Entwicklungsweg lautet:

1. unabhängige Module und Datenquellen fertigstellen

2. Datenbasis und Schnittstellen prüfen

3. Fangbuch / Catchbook entwickeln

4. Fish Data / Fischkarten entwickeln

5. Gesamtintegration durchführen

Die bisherige Fish-Database-Datei wird nicht unnötig verändert
oder gelöscht.

⸻

22. Versionsverwaltung dieser Datei

Die erste Zeile dieser Datei enthält immer die aktuelle
Version.

Format:

# AI_CONTEXT Version X.Y

Die zweite Zeile enthält das Datum der letzten inhaltlichen
Änderung:

# Updated: YYYY-MM-DD

Versionsbeispiele:

* 1.0 = Ausgangsversion
* 1.1 = kleinere Regel-/Inhaltsänderung
* 1.2 = Änderung der Entwicklungsstrategie
* 1.3 = Runtime-/LocalStorage-Regeln ergänzt
* 2.0 = größere strukturelle Änderung

Die Versionsnummer ersetzt nicht die GitHub-Commit-Historie,
sondern ergänzt sie.

⸻

23. Wichtig

Diese Datei enthält keine:

* Passwörter
* Access Tokens
* SSH-Private-Keys
* sonstigen Zugangsdaten

Bei widersprüchlichen Informationen gilt:

tatsächliche GitHub-Datei

GitHub-Commit-Historie

aktueller Runtime-/Teststatus

localStorage.json

Projektwissensstand

Projektplan

ältere Dokumentation

Die tatsächliche Projektstruktur und die tatsächlich auf
GitHub vorhandenen Dateien haben Vorrang vor Annahmen.

⸻

Ende AI_CONTEXT

:::