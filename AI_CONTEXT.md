# AI_CONTEXT Version 1.4
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
# 1. Verbindliche Projektregeln
Zuerst einlesen:
- `PROJECT_RULES.md`
Diese Datei definiert die verbindlichen Arbeitsregeln.
—
# 2. Aktueller Projektwissensstand
Einlesen:
- `PROJECT_KNOWLEDGE.md`
Diese Datei beschreibt den bekannten Projektstand,
Architektur, Entscheidungen und Übergabepunkte.
—
# 3. Modul- und Arbeitsplan
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
# 4. Runtime- und Teststatus
Einlesen:
- `runtime/runtime_status.json`
- `runtime/error.log`
- `localStorage.json`
Diese Dateien zeigen:
- aktuellen Laufzeitstatus
- Fehler
- Modulstatus
- Datenbank-Snapshot
- persistierte Runtime-Daten
`localStorage.json` ist eine wichtige Diagnose- und
Persistenzreferenz.
—
# 5. Projektstruktur
Die tatsächliche GitHub-Projektstruktur prüfen.
Besonders:
- `core/`
- `modules/`
- `config/`
- `database/`
- `runtime/`
- `libraries/`
Die tatsächliche Projektstruktur hat Vorrang vor älteren
Dokumentationen oder Annahmen.
—
# 6. GitHub-Referenz
Repository:
`El-Ninjo1965/CatchTrack-V.1.0`
Branch:
`main`
Bei Wiederaufnahme prüfen:
1. aktuellen Branch-Stand
2. letzten relevanten Commit
3. Commit-Datum
4. Commit-Nachricht
5. geänderte Dateien
6. relevante Diff-Informationen
Der Benutzer verwendet grundsätzlich den Dateinamen als
Commit-Namen.
Beispiel:
`fishData.js`
kann gleichzeitig der Commit-Name sein.
—
# 7. GitHub-Verifikation
Wenn der Benutzer nach einer Dateiübertragung sagt:
„Prüfe, ob die Datei auf GitHub ist.“
gilt zunächst:
Die Datei wurde vom Benutzer vermutlich übertragen.
Prüfreihenfolge:
1. Commit-Historie prüfen
2. erwarteten Commit anhand des Dateinamens suchen
3. Commit-SHA und Commit-Inhalt prüfen
4. feststellen, ob die Datei Bestandteil des Commits ist
5. Datei anhand des tatsächlichen Repository-Pfades abrufen
Bei temporären GitHub-/Connector-Problemen bis zu vier
Abrufversuche direkt hintereinander durchführen.
Keine Zwischenmeldung und keine Rückfrage.
Wenn ein passender Commit die Datei eindeutig enthält,
ist die Übermittlung bestätigt, auch wenn der direkte
Dateiabruf vorübergehend fehlschlägt.
—
# 8. Schreibrechte
ChatGPT arbeitet im CatchTrack-Projekt grundsätzlich
lesend.
Der Benutzer verwendet Working Copy für Änderungen.
Daher:
- ChatGPT liest GitHub.
- ChatGPT analysiert GitHub.
- ChatGPT prüft Commits.
- ChatGPT erstellt keine direkten Repository-Änderungen,
  sofern keine bestätigte Schreibmöglichkeit vorhanden ist.
- Der Benutzer übernimmt Änderungen manuell über
  Working Copy.
- Danach wird der Commit von ChatGPT geprüft.
Bei fehlenden Schreibrechten niemals behaupten, eine Datei
sei geändert oder committed worden.
—
# 9. Vollständige Ersatzdateien
Der Benutzer bevorzugt vollständige Dateien.
Bei Änderungen bestehender Dateien:
- keine Patch-Fragmente
- keine Such-/Ersetzungsanweisungen
- keine unvollständigen Codeabschnitte
Stattdessen:
**immer die vollständige Ersatzdatei ausgeben.**
Das gilt besonders für:
- JavaScript
- HTML
- CSS
- JSON
- Markdown
- Konfigurationsdateien
- `AI_CONTEXT.md`
- `PROJECT_RULES.md`
- `PROJECT_KNOWLEDGE.md`
- `PROJECT_MODULE_PLAN.md`
Wenn `AI_CONTEXT.md` geändert wird, immer die komplette
Datei ausgeben.
—
# 10. Verhalten nach „OK“
„OK“ bedeutet:
Der vorherige Schritt ist bestätigt.
Nicht erneut nachfragen.
Wenn danach eine Prüfung oder Analyse sinnvoll ist,
selbstständig durchführen.
Mehrere zusammengehörige Prüfungen sollen möglichst
in einem Arbeitsgang erledigt werden.
—
# 11. Grundprinzip der CatchTrack-Architektur
CatchTrack soll langfristig modular aufgebaut sein.
Module sollen möglichst:
- eigenständig funktionieren
- klar definierte Schnittstellen besitzen
- eine gemeinsame Datenbasis verwenden
- unabhängig testbar sein
- erweiterbar sein
- später über eine zentrale Admin-Oberfläche
  konfigurierbar sein
Die Architektur soll langfristig eher einem modularen
CMS/E-Commerce-System entsprechen als einer Sammlung
fest programmierter Einzelansichten.
Konfigurierbar sollen später insbesondere sein:
- Texte
- Beschriftungen
- Eingabefelder
- Feldtypen
- Kategorien
- Reihenfolgen
- Inhalte
- Aktivierung/Deaktivierung
- weitere Modulparameter
—
# 12. WICHTIGE ENTWICKLUNGSSTRATEGIE
Die Entwicklung wird bewusst in zwei Gruppen getrennt.
## Gruppe A – unabhängige Basis- und Datenmodule
Diese Module werden zuerst fertiggestellt.
Dazu gehören insbesondere:
- Wetter
- GPS
- Tide
- Mond
- Gewässer
- Equipment
- weitere eigenständige Datenmodule
Diese Module sollen zunächst:
1. eigenständig funktionieren
2. getestet werden
3. Fehler bereinigt werden
4. stabile Daten liefern
5. später als Datenquellen für andere Module dienen
—
## Gruppe B – integrative Module
Diese Module werden erst später entwickelt.
Dazu gehören:
- Fish Data
- Fischkarten
- Catchbook / Fangbuch
- Statistics
- Hitparade
- komplexe Verknüpfungen zwischen Fisch,
  Fang, Wetter, GPS, Tide, Mond, Gewässer und Equipment
—
# 13. VERBINDLICHE MODULREIHENFOLGE
Die aktuelle Entwicklungsreihenfolge lautet:
### 1. Wetter
Eigenständige Wetterdaten.
Später Datenquelle für Fangdaten.
### 2. GPS
Eigenständige Standortbestimmung.
Später Standortdaten für Fänge.
### 3. Tide
Eigenständige Gezeiteninformationen.
Später Verknüpfung mit Fangbedingungen.
### 4. Moon
Eigenständige Mond-/Mondphaseninformationen.
Später Verknüpfung mit Fangbedingungen.
### 5. Waters
Gewässerdaten.
Erst als eigenständiges Modul entwickeln.
### 6. Equipment
Verwaltung der verwendeten Angelausrüstung.
Zunächst unabhängig vom Fangbuch.
### 7. Fish Data
Fischdatenbank und Fischkarten.
Erst beginnen, wenn die vorherigen Datenquellen stabil
funktionieren.
### 8. Catchbook
Fangbuch.
Hier werden die vorher entwickelten Module miteinander
verbunden.
### 9. Statistics / Hitparade
Auswertung der vorhandenen Fangdaten.
—
# 14. VORHANDENE UNFERTIGE MODULE
Die aktuellen Module sind teilweise nur Vorentwicklungen.
Dazu gehören unter anderem:
- Fish Database
- Equipment
- GPS
- Maps
- Waters
- Statistics
- Records
- weitere noch nicht fertiggestellte Module
Ein Fehler wie:
`Initializer nicht gefunden: CatchTrack...Module`
bedeutet bei diesen Vorentwicklungen nicht automatisch,
dass dieses Modul jetzt sofort fertiggestellt werden muss.
Solche Fehler werden zunächst dokumentiert und bei Bedarf
im Zusammenhang mit dem jeweiligen Modul bearbeitet.
Es besteht ausdrücklich **keine Verpflichtung**, alle
vorhandenen Vorentwicklungen gleichzeitig funktionsfähig
zu machen.
—
# 15. WICHTIGE REGEL ZU UNFERTIGEN MODULEN
Nicht mehrere unfertige Module gleichzeitig reparieren.
Wenn ein Modul noch nicht auf der aktuellen
Entwicklungsstufe benötigt wird:
- nicht unnötig umbauen
- nicht integrieren
- nicht vollständig reparieren
- Fehler nur dokumentieren
- Abhängigkeiten feststellen
Erst wenn das Modul laut Entwicklungsreihenfolge an der
Reihe ist, wird es vollständig analysiert und entwickelt.
Dadurch vermeiden wir:
- parallele Baustellen
- widersprüchliche Schnittstellen
- unnötige Änderungen
- doppelte Arbeit
- spätere Rückbauten
—
# 16. Aktueller Fokus
Der nächste Entwicklungsbereich ist:
**WETTER**
Nicht:
- Fish Database
- Fish Data
- Catchbook
- Hitparade
- Statistics
Diese Bereiche werden bewusst zurückgestellt.
—
# 17. Arbeitsweise für jedes Basis-Modul
Für jedes Modul gilt:
### Schritt 1
Aktuelle GitHub-Dateien vollständig einlesen.
### Schritt 2
Abhängigkeiten feststellen.
### Schritt 3
Datenbank-/Storage-Anbindung prüfen.
### Schritt 4
Vorhandene Vorentwicklung analysieren.
### Schritt 5
Entscheiden:
- bestehende Datei weiterverwenden
- bestehende Datei komplett ersetzen
- neue Datei erstellen
### Schritt 6
Alle erforderlichen Dateien gemeinsam vorbereiten.
### Schritt 7
Dem Benutzer vollständige Ersatzdateien zeigen.
### Schritt 8
Benutzer übernimmt sie über Working Copy.
### Schritt 9
Benutzer erstellt Commit.
### Schritt 10
GitHub-Commit prüfen.
### Schritt 11
Modul testen.
### Schritt 12
Erst danach nächstes Modul beginnen.
—
# 18. Fish Data – später
Fish Data wird momentan bewusst zurückgestellt.
Langfristiges Ziel:
Eine zentrale Fischdatenbank mit Fischkarten.
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
- weitere Informationen
Später Verbindung mit:
- Catchbook
- Wetter
- GPS
- Tide
- Moon
- Waters
- Equipment
Fish Data soll keine rein statische HTML-Liste werden.
—
# 19. Catchbook / Fangbuch – später
Das Fangbuch wird erst entwickelt, wenn die notwendigen
Datenquellen stabil sind.
Geplante Verknüpfungen:
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
Die vorhandene Datenbank enthält bereits Strukturen für
entsprechende Beziehungen.
Diese vorhandenen Datenstrukturen müssen vor einem Umbau
geprüft werden.
—
# 20. Runtime / Fehler / Storage
Die Runtime-Kette lautet grundsätzlich:
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

Runtime-Dateien:

* runtime/error.log
* runtime/runtime_status.json

localStorage.json ist der persistierte Snapshot des
Browser-LocalStorage.

⸻

21. localStorage.json

localStorage.json ist eine zentrale Referenzdatei.

Sie kann enthalten:

* Runtime Status
* Error Log
* Datenbank-Snapshot
* weitere persistierte CatchTrack-Daten

Vor Änderungen an:

* runtimeStorage.js
* errorHandler.js
* runtimeStatus.js
* Datenbank-/Storage-Systemen

muss die aktuelle localStorage.json geprüft werden.

Sie darf niemals durch eine erfundene oder vereinfachte
Struktur ersetzt werden.

Bestehende Daten müssen erhalten bleiben.

Wenn der Benutzer eine aktualisierte
localStorage.json über Working Copy überträgt, muss diese
bei der nächsten Analyse berücksichtigt werden.

⸻

22. Runtime Error Log

runtime/error.log ist eine lesbare Runtime-/Exportdatei.

Eine leere error.log bedeutet nicht automatisch:

„Es gab keine Fehler.“

Zusätzlich prüfen:

* localStorage.json
* Runtime Status
* Error Handler
* Runtime Storage
* Browser LocalStorage

Der persistierte Error Log im LocalStorage ist bei der
Diagnose ebenfalls relevant.

⸻

23. Runtime-Status

runtime/runtime_status.json enthält unter anderem:

* Application Status
* Modulstatus
* Fehlerstatus
* Zeitstempel

Ein Fehler im Status ist zunächst als Diagnoseinformation
zu behandeln.

Nicht jeder protokollierte Initializer-Fehler bedeutet,
dass das betreffende Modul jetzt repariert werden muss.

Bei unfertigen Modulen kann ein solcher Fehler aus dem
aktuellen Entwicklungsstand resultieren.

⸻

24. Testverhalten

Wenn der Benutzer beim Testen mehrere Module öffnet, können
dadurch mehrere Fehlerlog-Einträge entstehen.

Beispiel:

Ein Modul wird fünfmal geöffnet und jedes Mal versucht der
Module Manager einen nicht vorhandenen Initializer aufzurufen.

Dann können fünf entsprechende Fehler im Error Log stehen.

Deshalb müssen Fehleranzahl und Fehlerursache gemeinsam
bewertet werden.

Nicht allein anhand der Anzahl der Logeinträge entscheiden.

⸻

25. Umgang mit Module-Manager-Fehlern

Ein Fehler wie:

Initializer nicht gefunden: CatchTrackEquipmentModule

wird zunächst als Hinweis auf eine fehlende oder noch nicht
fertige Modulimplementierung betrachtet.

Prüfen:

1. Existiert die Moduldatei?
2. Ist sie eingebunden?
3. Ist der erwartete globale Initializer vorhanden?
4. Ist das Modul laut Entwicklungsplan bereits an der Reihe?
5. Wird der Fehler durch das Öffnen des Moduls ausgelöst?
6. Ist das Modul lediglich eine Vorentwicklung?

Nur wenn das Modul laut Entwicklungsreihenfolge benötigt
wird, wird der Fehler vollständig behoben.

⸻

26. Versionsverwaltung

Die erste Zeile enthält immer:

# AI_CONTEXT Version X.Y

Die zweite Zeile:

# Updated: YYYY-MM-DD

Aktuelle Version:

1.4

Änderungen:

* 1.0 Ausgangsversion
* 1.1 Regel-/Projektanpassungen
* 1.2 Entwicklungsstrategie
* 1.3 Runtime-/LocalStorage-Regeln
* 1.4 neue verbindliche Modulreihenfolge und Umgang mit
    unfertigen Vorentwicklungen

⸻

27. Priorität bei widersprüchlichen Informationen

Bei widersprüchlichen Informationen gilt:

1. tatsächliche GitHub-Datei
2. aktueller GitHub-Commit
3. aktueller Runtime-/Teststatus
4. aktuelle localStorage.json
5. PROJECT_KNOWLEDGE.md
6. PROJECT_MODULE_PLAN.md
7. ältere Dokumentation
8. Annahmen

Die tatsächliche Projektstruktur hat Vorrang.

⸻

28. Keine Zugangsdaten

Diese Datei darf niemals enthalten:

* Passwörter
* Access Tokens
* API Keys
* SSH Private Keys
* sonstige Zugangsdaten

⸻

29. Aktueller Übergabepunkt

Die Runtime-/Logging-Infrastruktur wurde überprüft.

localStorage.json hat gezeigt, dass Runtime-Fehler korrekt
persistiert werden können.

Die vorhandenen Fehler betreffen derzeit überwiegend noch
nicht fertig entwickelte Module.

Diese Fehler werden nicht pauschal als kritische
Projektfehler behandelt.

Der aktuelle Entwicklungsfokus ist:

Wetter → GPS → Tide → Moon → Waters → Equipment

Danach:

Fish Data → Catchbook → Statistics / Hitparade

⸻

Ende AI_CONTEXT

:::