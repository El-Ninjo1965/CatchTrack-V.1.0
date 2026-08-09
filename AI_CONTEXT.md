# AI_CONTEXT Version 1.2
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
Diese Dateien zeigen den aktuellen Laufzeitstatus und bekannte
Fehler.
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
7. aktuelle GitHub-Projektstruktur
8. relevante aktuelle Dateien
9. relevante Commit-Historie
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
Damit wird unterschieden zwischen:
- Commit vorhanden und Datei enthalten
- Commit vorhanden, aber andere Datei geändert
- falscher bzw. älterer Commit
- Commit nicht vorhanden
### Schritt 3 – Datei direkt abrufen
Erst danach wird die Datei anhand ihres tatsächlichen
Repository-Pfades direkt abgerufen.
Beispiel:
`modules/fishDatabase/fishData.js`
Wenn der direkte Abruf einen vorübergehenden Fehler liefert,
wird die Abfrage automatisch wiederholt.
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
fehlschlägt, gilt die Datei als übermittelt, sofern der
Commit die Datei eindeutig enthält.
In diesem Fall darf nicht vorschnell behauptet werden,
dass die Datei nicht übertragen wurde.
Der Commit dient dann als maßgebliche Übermittlungsreferenz.
### Schritt 5 – Ergebnis
Erfolgreich:
**Commit vorhanden + Datei im Commit vorhanden + Datei direkt
abrufbar**
oder:
**Commit vorhanden + Datei eindeutig im Commit enthalten,
direkter Abruf trotz Wiederholungen nicht möglich**
Nicht übertragen:
**Kein passender Commit + Datei nicht auffindbar**
Erst dann wird dem Benutzer mitgeteilt, dass die Datei nicht
verifiziert werden konnte.
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
Der Benutzer soll dadurch eine Datei in Working Copy
vollständig ersetzen können, ohne manuell einzelne Stellen
suchen oder ergänzen zu müssen.
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
Die Module sollen langfristig so aufgebaut werden, dass sie
nicht nur eine feste Anzeige darstellen.
Insbesondere Daten- und Inhaltsmodule sollen später über eine
zentrale Admin-Oberfläche administrierbar sein.
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
Dabei soll die Architektur eher einem modularen CMS bzw.
E-Commerce-System entsprechen als einer Sammlung fest
programmierter Einzelansichten.
Die erste Implementierung eines Moduls soll trotzdem zunächst
klein, stabil und testbar bleiben.
Nicht gleichzeitig unnötig viele Erweiterungen einbauen.
—
## 14. Entwicklungsstrategie – Basis zuerst
Die Entwicklung wird grundsätzlich in zwei Gruppen aufgeteilt:
### Gruppe A – eigenständige Basis- und Datenmodule
Diese Module sollen zuerst fertiggestellt werden.
Dazu gehören insbesondere Module wie:
- Wetter
- GPS / Standort
- weitere eigenständige Datenmodule
- Equipment
- sonstige Module, die ohne komplexe Integration in
  Fish Data oder das Fangbuch funktionieren
Diese Module sollen jeweils:
1. vollständig implementiert werden
2. eigenständig funktionieren
3. getestet werden
4. Fehler bereinigt werden
5. als stabile Datenquelle für spätere Module dienen
### Gruppe B – integrative Module
Diese Module werden erst danach entwickelt.
Dazu gehören insbesondere:
- Fangbuch / Catchbook
- Fish Data
- Fischkarten
- komplexe Verknüpfungen zwischen Fisch-, Fang-,
  Wetter-, GPS- und Equipmentdaten
- spätere umfassende Fisch-/Fangverwaltung
### Grundregel
Ein Modul, das später Daten aus mehreren anderen Modulen
zusammenführen oder in das Fangbuch bzw. die Fischverwaltung
integriert werden muss, soll nicht unnötig früh fertig
programmiert werden.
Zuerst werden die benötigten Datenquellen stabil aufgebaut.
Danach werden die integrativen Module entwickelt.
Dadurch sollen:
- doppelte Implementierungen vermieden werden
- spätere Umbauten reduziert werden
- Schnittstellen auf tatsächlich vorhandenen Daten basieren
- das Fangbuch auf bereits getestete Module zugreifen können
- Fish Data erst dann mit den fertigen Datenquellen verbunden
  werden
—
## 15. Entwicklungsreihenfolge
Die konkrete Reihenfolge wird anhand des tatsächlichen
Projektstands und des bestehenden Modulplans bestimmt.
Grundsätzlich gilt jedoch:
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
Das Fangbuch soll dann bereits auf fertige Module zugreifen
können.
Beispielsweise können später automatisch oder manuell
verknüpft werden:
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
Fish Data soll dann bereits auf die zuvor festgelegten und
getesteten Strukturen Rücksicht nehmen können.
### Phase 5 – Gesamtintegration
Zum Schluss:
- Fangbuch
- Fish Data
- Wetter
- GPS
- Equipment
- weitere Module
miteinander verbinden.
Die Integration erfolgt erst, wenn die beteiligten
Einzelmodule stabil sind.
—
## 16. Fish Data – geplanter späterer Entwicklungsbereich
Fish Data wird bewusst **nicht als nächster
Entwicklungsschritt behandelt**, solange noch relevante
eigenständige Basis-/Datenmodule fertigzustellen sind.
Die geplante Datei bleibt:
`modules/fishDatabase/fishData.js`
Die bisherige:
`modules/fishDatabase/fishDatabase.js`
wird zunächst nicht gelöscht.
Sie bleibt als Rückfall- bzw. Vergleichsversion erhalten,
bis die spätere Fish-Data-Implementierung stabil funktioniert.
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
### Geplante Entwicklungsstufen
#### Stufe 1 – stabiler Kern
- fehlerfreies Laden
- einmalige Initialisierung
- keine Endlosschleifen
- keine doppelten Datensätze
- korrekter Datenzugriff
- einfache Fischansicht
#### Stufe 2 – Fischkarte
- Fischübersicht
- einzelne Fischkarte
- Detailansicht
- strukturierte Eigenschaften
- Bilder
- Kategorien
#### Stufe 3 – erweiterte Fischdaten
- Köder
- Tiefe
- Fangzeit
- Saison
- Gewässer
- Lebensraum
- Fangmethoden
- weitere fischereiliche Informationen
#### Stufe 4 – Administration
Die Fischdaten sollen später über die Admin-Oberfläche
administrierbar sein.
Möglichst ohne Änderungen am Frontend-Code für jede einzelne
inhaltliche Änderung.
#### Stufe 5 – CMS-artige Erweiterbarkeit
Langfristig sollen neue Eigenschaften möglichst über die
Administration ergänzt werden können.
Dabei wird zwischen:
- Daten
- Darstellung
- Konfiguration
- Administration
getrennt.
—
## 17. Fish Data – wichtige Architekturregel
Fish Data darf nicht nur eine statische HTML-Anzeige sein.
Das Modul soll als eigenständige Funktion innerhalb von
CatchTrack arbeiten.
Datenhaltung, Datenzugriff und Darstellung sollen so weit
wie sinnvoll getrennt werden.
Andere CatchTrack-Module sollen später auf die Fischdaten
zugreifen können.
Insbesondere das Fangbuch soll später eine Fischart aus
Fish Data auswählen bzw. mit einem Fang verknüpfen können.
Die genaue Schnittstelle zwischen Fangbuch und Fish Data
wird erst festgelegt, wenn die vorher benötigten Module und
Datenstrukturen stabil sind.
—
## 18. Umgang mit bestehenden Dateien
Bestehende funktionierende Dateien werden nicht unnötig
verändert.
Vor jeder Änderung:
1. aktuelle Datei aus GitHub lesen
2. Abhängigkeiten feststellen
3. prüfen, ob die Datei tatsächlich geändert werden muss
4. erst danach eine vollständige Ersatzdatei erstellen
Bei einem neuen Modul möglichst eine neue Datei verwenden,
anstatt eine funktionierende Altdatei immer wieder umzubauen.
Alte Dateien werden erst entfernt, wenn:
- die neue Implementierung funktioniert
- alle Abhängigkeiten umgestellt wurden
- die alte Datei nicht mehr benötigt wird
- der Schritt dokumentiert wurde
—
## 19. Test- und Fortschrittsverfahren
Nach jeder wichtigen Datei:
1. vollständige Datei erstellen
2. Benutzer übernimmt sie über Working Copy
3. Benutzer erstellt einen GitHub-Commit
4. GitHub-Commit prüfen
5. Datei auf GitHub erneut einlesen
6. Funktion testen
7. Fehler dokumentieren
8. erst danach nächsten Entwicklungsschritt beginnen
Die GitHub-Commit-Historie ist dabei eine zusätzliche
Fortschrittsreferenz.
Der Commit-Name des Benutzers entspricht grundsätzlich dem
Dateinamen und kann deshalb direkt als Hinweis auf den
übertragenen Arbeitsschritt verwendet werden.
Bei einem Modul wird nicht automatisch mit dem nächsten Modul
begonnen.
Erst wenn das aktuelle Modul stabil getestet wurde, wird der
nächste geplante Schritt begonnen.
—
## 20. Aktueller Übergabepunkt
Das Basisskelett des Projekts steht.
Die bisherige Fish-Database-Implementierung zeigte beim Test
mehrfach wiederholte Fischdatensätze und anschließend eine
weiße Seite.
Die Fish-Funktion wird deshalb momentan nicht weiter
ausgebaut.
Der zuvor geplante nächste Schritt:
**NEU: FISH DATA**
wird zurückgestellt.
Stattdessen gilt ab Version 1.2:
**Zuerst die eigenständigen Module und Datenquellen
fertigstellen.**
Danach:
**Fangbuch / Catchbook**
und anschließend:
**Fish Data / Fischkarten**
und danach die vollständige Integration.
Die bisherige Fish-Database-Datei wird dabei nicht unnötig
verändert oder gelöscht.
—
## 21. Versionsverwaltung dieser Datei
Die erste Zeile dieser Datei enthält immer die aktuelle
Version.
Format:
`# AI_CONTEXT Version X.Y`
Zusätzlich enthält die zweite Zeile das Datum der letzten
inhaltlichen Änderung:
`# Updated: YYYY-MM-DD`
Bei jeder inhaltlichen Änderung wird die Versionsnummer
erhöht.
Beispiele:
- `1.0` = Ausgangsversion
- `1.1` = kleinere Regel- oder Inhaltsänderung
- `1.2` = Änderung der Entwicklungsstrategie
- `1.3` = weitere kleinere Änderung
- `2.0` = größere strukturelle Änderung
Damit kann beim Einlesen jederzeit festgestellt werden,
welche Fassung aktuell ist.
Bei einer Änderung von `AI_CONTEXT.md` muss die neue
Versionsnummer in der vollständigen Ersatzdatei aktualisiert
werden.
Die Versionsnummer ersetzt nicht die GitHub-Commit-Historie,
sondern ergänzt sie.
—
## 22. Wichtig
Diese Datei ist ein Lesefahrplan.
Sie enthält keine:
- Passwörter
- Access Tokens
- SSH-Private-Keys
- sonstigen Zugangsdaten
Bei widersprüchlichen Informationen gilt:
tatsächliche GitHub-Datei
>
GitHub-Commit-Historie
>
aktueller Runtime-/Teststatus
>
Projektwissensstand
>
Projektplan
>
ältere Dokumentation
Die tatsächliche Projektstruktur und die tatsächlich auf
GitHub vorhandenen Dateien haben Vorrang vor Annahmen.
—
## Ende AI_CONTEXT