# CatchTrack V1.0 – Project Rules

## 1. Verbindlichkeit

Diese Datei enthält die verbindlichen Projektregeln.

AI-Agenten müssen diese Regeln vor jeder Arbeit am Projekt berücksichtigen.

Regeln dürfen nicht eigenmächtig abgeschwächt oder entfernt werden.

## 2. Aktueller Dokumentationsstatus

Alle Projektdateien befinden sich derzeit im Aufbau.

Das gilt ausdrücklich auch für:

- RULES.md
- WORKFLOW.md
- PROJECT_MASTERLIST.md
- PROJECT_STATUS.md
- PROJECT_CHRONICLE_001.md
- DEV_LOG.md
- Core-Dateien
- Module
- sonstige Projektdateien

Der Core ist derzeit NICHT eingefroren.

Ein Freeze erfolgt erst nach vollständiger technischer Prüfung, Abnahme und ausdrücklicher Projektentscheidung.

Bis dahin dürfen bestehende Dateien geprüft, ersetzt, verschoben oder gelöscht werden, sofern dies dem definierten Workflow entspricht.

## 3. GitHub als verbindliche Referenz

GitHub main ist die maßgebliche Quelle für den aktuellen Projektstand.

Vor jeder Prüfung, Analyse, Erstellung oder Änderung einer Datei wird zuerst geprüft, ob diese Datei bereits auf GitHub main vorhanden ist.

Die aktuelle GitHub-Version wird vollständig ausgelesen und als Grundlage verwendet.

Es darf niemals aus dem Gedächtnis, aus einer alten Version oder aus einer Vermutung gearbeitet werden, wenn eine aktuelle Version auf GitHub vorhanden ist.

## 4. Verbindliche Dateivorprüfung

Vor jeder Dateiausgabe gilt:

ZIEL
→ REGELN LESEN
→ GITHUB MAIN PRÜFEN
→ DATEI VORHANDEN?
→ VORHANDENE DATEI VOLLSTÄNDIG AUSLESEN
→ AKTUELLEN INHALT MIT ZIEL VERGLEICHEN
→ ARBEITSREIHENFOLGE PRÜFEN
→ ERST DANN AUSGEBEN

Wenn die Datei bereits vorhanden ist:

- aktuelle Version verwenden
- keine parallele Version erzeugen
- prüfen, ob überhaupt eine Änderung erforderlich ist

Wenn die vorhandene Version bereits dem Ziel entspricht:

- Datei nicht erneut ausgeben
- direkt mit dem nächsten offenen Arbeitsschritt fortfahren

Wenn die Datei geändert werden muss:

- vorhandene GitHub-Version vollständig als Ausgangsbasis verwenden

Wenn die Datei nicht vorhanden ist:

- erst dann neu erstellen

## 5. Keine unnötigen Dateien

Vor dem Erstellen einer neuen Datei muss geprüft werden, ob bereits eine Datei mit derselben oder einer vergleichbaren Aufgabe existiert.

Doppelte Dateien, parallele Masterdateien und unnötige Hilfsdateien sind zu vermeiden.

Eine bestehende Datei wird ergänzt oder ersetzt, wenn sie die entsprechende Aufgabe bereits erfüllt.

Eine neue Datei wird nur erstellt, wenn sie architektonisch oder organisatorisch tatsächlich erforderlich ist.

## 6. Autonomer Arbeitsmodus

Der Benutzer definiert Ziel und gewünschtes Ergebnis.

Der AI-Agent arbeitet danach eigenständig.

Der AI-Agent:

- liest relevante Dateien selbstständig
- liest vor der Arbeit die relevanten Regeln
- prüft den aktuellen Projektstand
- prüft Abhängigkeiten
- prüft die Arbeitsreihenfolge
- trifft technische Entscheidungen selbstständig
- führt notwendige Prüfungen ohne zusätzliche Bestätigung durch
- setzt eindeutige Anforderungen direkt um
- arbeitet ohne unnötige Zwischenfragen
- führt den Workflow selbstständig zum nächsten sinnvollen Punkt

Der Benutzer muss technische Entscheidungen nicht bestätigen, wenn sie sich eindeutig aus Ziel, Architektur und Regeln ergeben.

## 7. Erklärungen

Lange technische Erklärungen sind zu vermeiden.

Der Benutzer benötigt grundsätzlich:

- das Ergebnis
- notwendige Entscheidungen
- notwendige Hinweise
- die nächste erforderliche Aktion

Erklärungen zu technischen Details werden nur gegeben, wenn sie für eine Entscheidung erforderlich sind oder ausdrücklich verlangt werden.

Der AI-Agent soll nicht wiederholt erklären, warum ein bereits festgelegter Workflow angewendet wird.

## 8. OK-Regel

„OK“ bedeutet:

- gelesen
- verstanden
- bestätigt
- vorhandene technische Vorschläge bestätigt, sofern kein ausdrücklicher Widerspruch erfolgt

Danach gilt:

OK
→ aktuellen Stand bestimmen
→ nächsten offenen Arbeitsschritt bestimmen
→ Regeln prüfen
→ GitHub prüfen
→ Datei prüfen
→ nächsten Arbeitsschritt ausgeben

„OK“ bedeutet ausdrücklich NICHT:

- dieselbe Datei erneut ausgeben
- den vorherigen Arbeitsschritt wiederholen
- erneut nach einer bereits beantworteten Entscheidung fragen

## 9. Projektchronik

Die Projektchronik dokumentiert abgeschlossene Entwicklungsschritte und den aktuellen Fortsetzungspunkt.

Aktuelle Chronik:

PROJECT_CHRONICLE_001.md

Weitere Chroniken werden bei Bedarf erstellt.

Bereits dokumentierte historische Ereignisse dürfen nicht rückwirkend verfälscht werden.

Die Chronik soll den Fortsetzungspunkt so dokumentieren, dass eine spätere KI-Sitzung ohne unnötige Wiederholung weiterarbeiten kann.

## 10. DEV_LOG

DEV_LOG.md dokumentiert technische Entwicklungsarbeit.

Dazu gehören insbesondere:

- Datum
- Uhrzeit
- Aktion
- Terminal-Befehl bzw. Arbeitsschritt
- relevante vollständige Ausgabe
- Ergebnis
- Commit-ID
- Commit-Nachricht
- betroffene Dateipfade

DEV_LOG.md ersetzt nicht die Projektchronik.

Die Chronik dokumentiert Projektfortschritt.

DEV_LOG dokumentiert technische Vorgänge.

## 11. Git und Working Copy

Alle relevanten Projektdateien werden grundsätzlich versioniert.

Ein relevanter Arbeitsschritt gilt erst als abgeschlossen, wenn die betreffenden Dateien committed wurden.

Der manuelle Git-Workflow des Benutzers erfolgt über Working Copy auf dem iPad.

Working Copy ist die vorgesehene Arbeitsumgebung für:

- Übernahme der von der KI erzeugten Dateien
- Prüfung der Dateien
- Commit
- Synchronisation mit GitHub

Der Benutzer arbeitet nicht mit dem Terminal.

Der fehlende direkte GitHub-Schreibzugriff des AI-Agenten ist eine bekannte technische Rahmenbedingung.

Diese Tatsache wird nicht bei jedem Arbeitsschritt erneut geprüft oder erwähnt.

## 12. Terminal-Arbeiten

Terminal-Arbeiten werden ausschließlich durch den AI-Agenten oder einen beauftragten KI-Agenten vorbereitet bzw. ausgeführt.

Der Benutzer muss keine Terminal-Befehle selbst analysieren oder verwalten.

Wenn ein Terminal-Befehl relevante Informationen erzeugt, soll seine Ausgabe unmittelbar in einer versionierbaren Datei gespeichert werden.

Relevante Terminal-Ergebnisse dürfen nicht ausschließlich als Bildschirmtext behandelt werden.

Die gespeicherten Informationen müssen anschließend versionierbar und über Working Copy erreichbar sein.

## 13. Commit-Protokollierung

Relevante Commits sollen nachvollziehbar dokumentiert werden.

Für einen Commit sind nach Möglichkeit festzuhalten:

- Commit-ID
- Commit-Nachricht
- Datum
- Uhrzeit
- betroffene Dateipfade

Damit kann jederzeit nachvollzogen werden, welche Dateien durch welchen Commit verändert wurden.

Die Pfade sind ausdrücklich Bestandteil der Dokumentation.

## 14. Core-Regel

Der Core ist die technische Plattform.

Der Core darf keine konkrete Fachlogik enthalten.

Der Core darf nicht für einzelne Module angepasst werden.

Fachmodule dürfen keine Änderungen an Core-Dateien erzwingen.

Der Core stellt definierte Schnittstellen und technische Infrastruktur bereit.

## 15. Core Freeze

Der Core ist derzeit NICHT eingefroren.

Ein späterer Core Freeze erfolgt erst nach:

- vollständiger Repository-Prüfung
- funktionaler Analyse
- Bereinigung
- Tests
- technischer Abnahme
- ausdrücklicher Projektentscheidung

Erst danach gilt:

/Core/*

als Read-Only für AI-Agenten.

Nach dem Freeze darf der Core nicht durch Installation, Deinstallation, Aktualisierung oder Erweiterung einzelner Module verändert werden.

## 16. Neue Funktionalität

Neue fachliche Funktionalität wird grundsätzlich als Modul umgesetzt.

Vor jeder Änderung wird geprüft:

Ist es Infrastruktur?
→ Core

Ist es fachliche Funktionalität?
→ Modul

Beispiele:

- User
- Admin
- GPS
- Weather
- Catchbook
- Fish Database
- Tides
- Maps
- Statistics

## 17. Keine Core-Anpassung für Module

Grundsätzlich falsch:

Neues Modul
→ Core-Datei ändern
→ Modul einbauen

Richtig:

Neues Modul
→ definierte Core-Schnittstelle verwenden
→ Modul registrieren
→ Modul installieren

Wenn ein Modul eine Core-Änderung benötigt, wird zuerst die Modularchitektur geprüft.

## 18. Module müssen unabhängig bleiben

Module dürfen nicht unnötig voneinander abhängig sein.

Direkte Abhängigkeiten müssen ausdrücklich definiert werden.

Ein Modul darf keine privaten Implementierungsdetails eines anderen Moduls verwenden.

## 19. Module Lifecycle

Installierbare Module müssen konzeptionell folgende Zustände unterstützen:

available
installed
enabled
disabled
updated
uninstalled

Der Module Manager ist für den Lifecycle zuständig.

## 20. Datenbank

Module dürfen eigene Datenstrukturen besitzen.

Datenbankoperationen eines Moduls gehören zum Modul-Lifecycle.

Die generische Datenbankinfrastruktur darf keine unnötige Fachlogik einzelner Module enthalten.

## 21. User und Admin

User und Admin sind Module.

Sie sind keine fachlichen Bestandteile des Core.

Der Core stellt ausschließlich die dafür erforderliche Infrastruktur bereit.

## 22. Rollen und Permissions

Berechtigungen müssen zentral und konsistent behandelt werden.

Ein Benutzer erhält Berechtigungen über Rollen und/oder Paket-/Entitlement-Regeln.

Nicht zugängliche Funktionen werden nicht als verfügbar dargestellt.

## 23. Keine Fake-Funktionen

Nicht verfügbare Funktionen dürfen nicht als verfügbare Funktionen dargestellt werden.

Es werden keine Funktionen vorgetäuscht, die nicht tatsächlich implementiert und getestet wurden.

## 24. Status nicht vortäuschen

Eine Funktion darf nur als:

- fertig
- implementiert
- getestet
- abgenommen
- stabil
- eingefroren

bezeichnet werden, wenn dies tatsächlich überprüft wurde.

## 25. Keine parallelen Startsysteme

CatchTrack darf nicht mehrere konkurrierende Startup-/Runtime-Systeme besitzen.

Der Start der Anwendung muss über einen eindeutig definierten Einstieg erfolgen.

## 26. Vollständige Dateien

Wenn eine bestehende Datei geändert wird, wird sie grundsätzlich als vollständige Datei behandelt.

Keine Patches.

Keine Teilstücke.

Keine gekürzten Dateien.

Keine fragmentierten Ausgaben.

Ausnahmen gelten nur, wenn der Benutzer ausdrücklich eine andere Ausgabeform verlangt.

## 27. Verbindliches Dateiausgabeformat

Wenn eine Datei zur manuellen Übernahme ausgegeben wird, werden immer genau drei getrennte Copy-Blöcke verwendet.

Copy-Block 1:

vollständiger Dateipfad

Copy-Block 2:

exakter Dateiname

Copy-Block 3:

vollständiger Dateiinhalt

Der Dateiname steht nicht im Quelltext-Copyblock.

Der Dateiinhalt wird immer vollständig ausgegeben.

Der Dateiinhalt muss mit einer einzigen Kopieraktion übernommen werden können.

Der dritte Copyblock darf nicht durch darin enthaltene Markdown-Codeblöcke zerstört werden.

Wenn der Dateiinhalt selbst Markdown-Codeblöcke enthält, muss für den äußeren Copyblock eine entsprechend höhere Markdown-Begrenzung verwendet werden.

Der Dateiinhalt darf niemals wegen verschachtelter Codeblöcke aufgeteilt werden.

Zwischen den Copyblöcken stehen keine unnötigen technischen Erklärungen.

Dieses Format gilt für jede Datei unabhängig vom Dateityp.

## 28. Dateien und Pfade

Der vollständige Pfad jeder relevanten Datei muss bekannt und nachvollziehbar bleiben.

Bei jeder Dateiprüfung ist deshalb nicht nur der Dateiname, sondern auch der tatsächliche Repository-Pfad zu berücksichtigen.

Bei Commit-Prüfungen werden die betroffenen Pfade berücksichtigt.

Der AI-Agent darf nicht davon ausgehen, dass eine Datei ausschließlich anhand ihres Dateinamens eindeutig identifizierbar ist.

## 29. Änderungen dokumentieren

Wichtige Architekturentscheidungen, Meilensteine und relevante technische Änderungen werden dokumentiert.

Technische Details:

DEV_LOG.md

Projektentscheidungen und Meilensteine:

PROJECT_CHRONICLE_001.md bzw. folgende Chroniken

Die Dokumentation soll so geführt werden, dass spätere KI-Sitzungen den aktuellen Stand und den nächsten Arbeitsschritt ohne unnötige Wiederholung erkennen können.

## 30. Arbeitsablauf

Der verbindliche Arbeitsablauf lautet:

REGELN EINLESEN
→ GITHUB MAIN PRÜFEN
→ AKTUELLEN PROJEKTSTAND BESTIMMEN
→ NÄCHSTEN OFFENEN ARBEITSSCHRITT BESTIMMEN
→ DATEIEXISTENZ PRÜFEN
→ AKTUELLE DATEI VOLLSTÄNDIG AUSLESEN
→ ZIEL UND ARCHITEKTUR VERGLEICHEN
→ ENTSCHEIDEN
→ UMSETZEN
→ TESTEN
→ KORRIGIEREN
→ DOKUMENTIEREN
→ COMMIT
→ COMMIT UND DATEIPFADE PRÜFEN
→ NÄCHSTEN ARBEITSSCHRITT BESTIMMEN

Notwendige Prüfungen und Einlesungen erfolgen selbstständig.

Eine zusätzliche Benutzerbestätigung ist dafür nicht erforderlich.

Bei sinnvollen Entwicklungsabschnitten wird ein Testpunkt eingeplant, damit der Benutzer nicht erst nach Abschluss eines kompletten Entwicklungsblocks testen muss.

## 31. Teststrategie

Entwicklungsblöcke werden nicht unnötig groß aufgebaut.

Wenn eine sinnvolle funktionsfähige Zwischenstufe erreicht ist:

→ Testpunkt

Danach:

→ Fehler korrigieren
→ erneut testen
→ nächsten Entwicklungsblock beginnen

Damit werden Fehler möglichst früh erkannt.

## 32. Priorität

Bei Entscheidungen gilt:

1. Sicherheit und Datenintegrität
2. aktuelle GitHub-Version
3. aktuelle Projektregeln
4. dokumentierte Architektur
5. Core-/Module-Trennung
6. definierte Schnittstellen
7. bestehende Funktionalität
8. neue Funktionalität
9. minimale Komplexität
10. minimale unnötige Dateianzahl

Neue Funktionalität darf keine bestehende Architekturregel umgehen.

## 33. Grundregel

Der Core stellt Infrastruktur bereit.

Module stellen Funktionen bereit.

GitHub main ist die verbindliche Referenz.

Working Copy ist die manuelle Git-Arbeitsumgebung des Benutzers.

Vor jeder Arbeit werden die relevanten Regeln gelesen.

Vor jeder Dateiänderung wird die aktuelle GitHub-Version geprüft.

Vor jeder neuen Datei wird geprüft, ob bereits eine geeignete Datei existiert.

Keine doppelten Dateien.

Keine doppelten Arbeitsschritte.

Keine Wiederholung bereits erledigter Dateien.

Keine unnötigen Rückfragen.

Keine unnötigen Erklärungen.

Der AI-Agent arbeitet eigenständig und führt den definierten Workflow zum nächsten sinnvollen Arbeitsschritt fort.