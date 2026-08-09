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

Jeder vom Benutzer einzeln hochgeladene und benannte Commit
kann als zusätzliche Fortschrittsmarke verwendet werden.

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

## 8. Dateiarbeit

Der Benutzer arbeitet über Working Copy.

Dateien werden vom Benutzer einzeln nach GitHub übertragen
und committed.

Bei Änderungen bestehender Dateien:

1. aktuelle Datei aus GitHub einlesen
2. Abhängigkeiten prüfen
3. Projektplan prüfen
4. vollständige Datei nach Möglichkeit ausgeben
5. Benutzer übernimmt die Datei über Working Copy
6. Benutzer erstellt den GitHub-Commit
7. anschließend GitHub-Stand und Commit prüfen

Der Benutzer möchte grundsätzlich vollständige Ersatzdateien
und keine Teiländerungen, Patch-Anweisungen oder
„ersetze diesen Abschnitt“-Anweisungen.

Nach Möglichkeit immer die komplette fertige Datei liefern.

Wenn der Benutzer „OK“ sagt, gilt die vorherige Anweisung als
bestätigt bzw. ausgeführt. Nicht erneut fragen, ob der
bestätigte Schritt ausgeführt werden soll, sondern direkt mit
dem nächsten sinnvollen Arbeitsschritt fortfahren.

—

## 9. Entwicklungsprinzip

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

## 10. Fish Data – neuer Entwicklungsplan

### Ziel

Das bisherige Fish-Database-Modul wird nicht weiter durch
kleinteilige Reparaturen erweitert.

Stattdessen wird ein neues, eigenständiges Fish-Data-Modul
aufgebaut.

Geplante Datei:

`modules/fishDatabase/fishData.js`

Die bisherige:

`modules/fishDatabase/fishDatabase.js`

wird zunächst nicht gelöscht.

Sie bleibt als Rückfall- bzw. Vergleichsversion erhalten,
bis das neue Modul stabil funktioniert.

### Ziel des Fish-Data-Moduls

Fish Data soll langfristig die zentrale Fischdatenbank bzw.
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
- eigene Fangdaten bzw. Verknüpfungen zum Fangbuch

Die tatsächlichen Datenfelder werden schrittweise festgelegt
und nicht unnötig vorab fest verdrahtet.

### Entwicklungsstufen

#### Stufe 1 – Stabiler Kern

Zuerst muss das neue Modul:

- fehlerfrei geladen werden
- nur einmal initialisiert werden
- keine Endlosschleifen erzeugen
- keine Datensätze mehrfach rendern
- vorhandene Fischdaten korrekt lesen
- eine einfache Fischliste bzw. Fischansicht darstellen
- mit der vorhandenen Datenbank kompatibel bleiben

Erst wenn dieser Kern stabil funktioniert, folgt die nächste
Stufe.

#### Stufe 2 – Fischkarte

Danach:

- Fischübersicht
- einzelne Fischkarte
- Detailansicht
- strukturierte Darstellung der Eigenschaften
- Bilder
- übersichtliche Kategorien

#### Stufe 3 – Erweiterte Fischdaten

Danach schrittweise:

- Köder
- Tiefe
- Fangzeit
- Saison
- Gewässer
- Lebensraum
- Fangmethoden
- weitere fischereiliche Informationen

#### Stufe 4 – Administration

Danach wird die Administration aufgebaut.

Ziel:

Fischdaten sollen nicht mehr ausschließlich im JavaScript
fest programmiert sein.

Die Admin-Oberfläche soll später ermöglichen:

- Fische anlegen
- Fische bearbeiten
- Fische löschen/deaktivieren
- Texte bearbeiten
- Felder verwalten
- Eigenschaften verwalten
- Kategorien verwalten
- Reihenfolge bestimmen
- Inhalte aktivieren/deaktivieren

#### Stufe 5 – CMS-artige Erweiterbarkeit

Langfristig soll das System ermöglichen, neue Eigenschaften
möglichst über die Administration hinzuzufügen, ohne jedes
Mal die komplette Frontend-Logik neu programmieren zu müssen.

Dabei wird zwischen:

- Daten
- Darstellung
- Konfiguration
- Administration

getrennt.

—

## 11. Fish Data – wichtige Architekturregel

Fish Data darf nicht nur eine statische HTML-Anzeige sein.

Das Modul soll als eigenständige Funktion innerhalb von
CatchTrack arbeiten.

Datenhaltung, Datenzugriff und Darstellung sollen so weit
wie sinnvoll getrennt werden.

Andere CatchTrack-Module sollen später auf die Fischdaten
zugreifen können.

Insbesondere das Fangbuch soll später eine Fischart aus
Fish Data auswählen bzw. mit einem Fang verknüpfen können.

—

## 12. Umgang mit bestehenden Dateien

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

## 13. Test- und Fortschrittsverfahren

Nach jeder wichtigen Datei:

1. vollständige Datei erstellen
2. Benutzer übernimmt sie über Working Copy
3. Benutzer erstellt einen eindeutigen GitHub-Commit
4. GitHub-Commit prüfen
5. Datei auf GitHub erneut einlesen
6. Funktion testen
7. Fehler dokumentieren
8. erst danach nächsten Entwicklungsschritt beginnen

Die GitHub-Commit-Historie ist dabei eine zusätzliche
Fortschrittsreferenz.

Der Commit-Name des Benutzers kann als Hinweis darauf
verwendet werden, welche Datei bzw. welcher Arbeitsschritt
zuletzt übertragen wurde.

—

## 14. Aktueller Übergabepunkt

Das Basisskelett des Projekts steht.

Die bisherige Fish-Database-Implementierung zeigte beim Test
mehrfach wiederholte Fischdatensätze und anschließend eine
weiße Seite.

Deshalb wird die Fish-Funktion nicht weiter auf Basis der
bisherigen `fishDatabase.js` schrittweise repariert.

Der nächste Entwicklungsabschnitt ist:

**NEU: FISH DATA**

Geplante erste Datei:

`modules/fishDatabase/fishData.js`

Ziel der ersten Version:

**stabiler, eigenständiger Fish-Data-Kern.**

Danach schrittweise Ausbau zur Fischkarte und anschließend
zur administrierbaren CMS-artigen Fischdatenverwaltung.

—

## 15. Wichtig

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