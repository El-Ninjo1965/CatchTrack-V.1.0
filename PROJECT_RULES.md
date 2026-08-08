CatchTrack – PROJECT RULES

Zweck

Diese Datei definiert die verbindlichen Arbeitsregeln für die Entwicklung von CatchTrack-V.1.0.

Sie ist eine dauerhafte Projektverfassung.

Sie enthält bewusst keine laufenden Statusinformationen. Der tatsächliche Projektstand wird aus dem GitHub-Repository und der Git-Historie ermittelt.

⸻

1. Masterquelle

Das GitHub-Repository

El-Ninjo1965/CatchTrack-V.1.0

ist die technische Masterquelle des Projekts.

Der Branch main ist der maßgebliche Entwicklungsstand, sofern kein anderer Branch ausdrücklich als Arbeitsstand festgelegt wurde.

⸻

2. Vor jeder Änderung

Vor jeder Änderung müssen folgende Punkte geprüft werden:

1. aktueller Branch
2. aktueller Commit
3. aktuelle Version der betroffenen Datei
4. Abhängigkeiten der betroffenen Datei
5. vorhandene Funktionen
6. Auswirkungen auf andere Komponenten

Es darf nicht auf Grundlage einer veralteten Chat-Erinnerung gearbeitet werden, wenn der aktuelle Repository-Stand verfügbar ist.

⸻

3. Bestehende Dateien

Eine vorhandene Datei wird nicht neu erstellt, wenn sie bereits die benötigte Funktion enthält.

Vor einer Änderung muss geprüft werden, ob die gewünschte Funktion bereits vorhanden ist.

Bereits funktionierende Bestandteile dürfen nicht ohne konkreten Auftrag umgebaut werden.

⸻

4. Keine ungeplanten Nebenänderungen

Ein Arbeitsauftrag betrifft grundsätzlich nur die dafür notwendigen Dateien.

Nicht betroffene Bereiche bleiben unverändert.

Insbesondere dürfen Änderungen nicht nebenbei:

* die Architektur verändern
* andere Module umbauen
* Datenbankstrukturen verändern
* bestehende Prozesse ersetzen
* bestehende Services verändern
* funktionierende Schnittstellen verändern

Wenn eine zusätzliche Änderung technisch notwendig wird, muss sie vor ihrer Durchführung ausdrücklich festgestellt und begründet werden.

⸻

5. Fertige Komponenten

Eine als fertig etablierte Komponente wird als geschützt betrachtet.

Sie darf nur verändert werden, wenn:

* ein konkreter Fehler behoben werden muss
* eine ausdrücklich gewünschte Funktion ergänzt wird
* eine dokumentierte technische Abhängigkeit dies erforderlich macht

Eine fertige Komponente wird nicht aus Gründen der Vereinfachung oder persönlicher Präferenz neu geschrieben.

⸻

6. Vollständige Dateien

Bei Codeänderungen wird grundsätzlich eine vollständige, konsistente Version der betroffenen Datei erstellt.

Keine unnötigen Teilstücke, Such-und-Ersetzen-Anweisungen oder unvollständigen Zwischenstände.

Ziel ist immer eine direkt verwendbare Masterversion.

⸻

7. Architektur

CatchTrack ist modular aufgebaut.

Bestehende Architekturprinzipien sind zu erhalten.

Insbesondere gilt:

Module
   ↓
Core / Services
   ↓
Zentrale Datenbank

Module sollen nicht unnötig direkt miteinander gekoppelt werden.

Bestehende zentrale Schnittstellen werden bevorzugt weiterverwendet.

⸻

8. Datenbank

Die zentrale Datenbank ist Bestandteil der bestehenden CatchTrack-Architektur.

Datenbankstrukturen dürfen nicht nebenbei verändert werden.

Schemaänderungen müssen:

1. ausdrücklich erforderlich sein
2. auf Kompatibilität geprüft werden
3. mit bestehenden Daten und Funktionen abgeglichen werden
4. nachvollziehbar dokumentiert werden

⸻

9. Entwicklungsreihenfolge

Die Entwicklung erfolgt schrittweise.

Ein abgeschlossener Arbeitsschritt wird nicht erneut begonnen, solange kein konkreter Fehler oder Änderungsauftrag vorliegt.

Der bekannte Übergabepunkt ist:

Step 1 → abgeschlossen bis einschließlich Weather-Modul

Die weitere Entwicklung beginnt danach mit Step 2.

Bereits vorhandene Dateien werden dabei zuerst geprüft.

⸻

10. Keine Rekonstruktion aus Erinnerung

ChatGPT darf den Projektstand nicht aus einer früheren Unterhaltung rekonstruieren, wenn der aktuelle Repository-Stand verfügbar ist.

GitHub ist maßgeblich.

Bei widersprüchlichen Informationen gilt:

aktueller Repository-Stand
        >
Git-Historie
        >
Projekt-Dokumentation
        >
Chat-Erinnerung

⸻

11. Vor Änderungen prüfen

Vor einer Änderung muss beantwortet werden können:

* Was soll geändert werden?
* Warum soll es geändert werden?
* Welche Datei ist betroffen?
* Welche bestehenden Funktionen hängen davon ab?
* Was darf ausdrücklich nicht verändert werden?
* Wie wird nach der Änderung geprüft?

Wenn diese Fragen nicht ausreichend beantwortet werden können, wird zunächst geprüft und nicht verändert.

⸻

12. Nach Änderungen prüfen

Nach jeder Änderung werden mindestens geprüft:

* Syntax
* Dateireferenzen
* Abhängigkeiten
* bestehende Funktionen
* Auswirkungen auf andere Module
* Konsistenz mit der bestehenden Architektur

Danach wird der tatsächliche GitHub-Stand erneut geprüft, sofern die Änderung bereits synchronisiert wurde.

⸻

13. Git-Historie

Commits gelten als tatsächliches Änderungsprotokoll.

Commit-Nachrichten sollen die Änderung eindeutig beschreiben.

Unnötige Sammeländerungen verschiedener unabhängiger Aufgaben in einem Commit sollen vermieden werden.

⸻

14. Änderungen durch Working Copy

Wenn ChatGPT keinen direkten Schreibzugriff auf GitHub besitzt, wird Working Copy als Übertragungsweg verwendet.

Ablauf:

GitHub
   ↓
ChatGPT liest aktuellen Stand
   ↓
Änderung wird gemeinsam festgelegt
   ↓
ChatGPT erstellt vollständige Masterdatei
   ↓
Working Copy übernimmt die Datei
   ↓
Commit
   ↓
Push nach GitHub
   ↓
ChatGPT prüft den neuen GitHub-Stand

⸻

15. Sicherheitsregel

Bei Unsicherheit wird nichts überschrieben.

Insbesondere gilt:

Nicht sicher = zuerst lesen und prüfen.

Es ist besser, eine Änderung zu verzögern, als eine bereits funktionierende Komponente versehentlich zu ersetzen.

⸻

16. Ziel

CatchTrack soll schrittweise zu einer stabilen, nachvollziehbaren und wartbaren Anwendung entwickelt werden.

Die Prioritäten sind:

1. bestehende Funktionalität erhalten
2. Änderungen kontrolliert durchführen
3. unnötige Rückarbeit vermeiden
4. Architektur konsistent halten
5. jeden Entwicklungsschritt nachvollziehbar machen
6. niemals bereits erledigte Arbeit ohne Grund wiederholen
