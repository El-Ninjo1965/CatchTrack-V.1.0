CatchTrack – AI_CONTEXT.md
1. ZWECK DIESER DATEI
Diese Datei definiert die verbindlichen technischen Arbeitsregeln für die Weiterentwicklung von CatchTrack.
Sie dient als zentrale Arbeitsgrundlage für jede weitere Entwicklung.
Der tatsächlich vorhandene GitHub-Dateistand hat grundsätzlich Vorrang vor älteren Annahmen, Chatverläufen oder nicht mehr aktuellen Dokumentationen.
Dateien werden bei der praktischen Projektarbeit über Working Copy auf GitHub übernommen. Ein fehlender direkter Schreibzugriff des Assistenten ist kein Grund, von diesem Arbeitsablauf abzuweichen.
2. PRIORITÄT DER INFORMATIONSQUELLEN
Bei jeder technischen Aufgabe gilt folgende Reihenfolge:
1. Aktueller GitHub-Dateistand
2. Tatsächliche aktuelle Ordner- und Dateistruktur
3. Aktuelle Commit-Historie
4. PROJECT_STATUS.md
5. PROJECT_RULES.md
6. PROJECT_MODULE_PLAN.md
7. AI_CONTEXT.md
8. Ältere Chatverläufe und frühere Annahmen
Bei Widersprüchen ist der tatsächliche aktuelle GitHub-Stand maßgeblich.
3. GRUNDREGEL: NICHT RATEN
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
* Daten-/Service-Dateien
* Konfigurationen
* Unterordner
* sonstige Dateien
* Altbestände
4. ÄNDERUNGSGRUNDSATZ
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
5. CORE-MASTER – VERBINDLICHER FREEZE
Der zentrale CatchTrack-Core wird als Master-Version konsolidiert.
Nach ausdrücklicher Fertigstellung gilt:
CORE MASTER
STATUS: ABGESCHLOSSEN / FROZEN
Zum Core-Master gehören insbesondere:
index.html
app.js
core/*
database/database.js
database/schema.sql
database/migrations/*
Die tatsächlich vorhandenen Dateien haben Vorrang vor dieser beispielhaften Auflistung.
Diese Dateien dürfen bei der Entwicklung einzelner Fachmodule nicht unnötig neu erstellt, ersetzt oder verändert werden.
Insbesondere gilt:
app.js
database/schema.sql
database/database.js
core/*
sind grundsätzlich eingefroren.
6. AUSNAHME VOM CORE-FREEZE
Eine Änderung des Core-Masters ist nur zulässig, wenn eine konkrete technische Anforderung dies zwingend erforderlich macht.
Vor einer Core-Änderung muss ausdrücklich festgestellt werden:
CORE-ÄNDERUNG ERFORDERLICH
Die Änderung wird anschließend begründet und als eigener Arbeitsschritt behandelt.
7. APP.JS – MASTER-REGEL
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
Module müssen über die vorhandenen Core-Schnittstellen eingebunden werden.
8. DATABASE/SCHEMA.SQL – MASTER-REGEL
database/schema.sql ist das zentrale Basisschema für eine neue CatchTrack-Datenbank.
Es ist kein Modul-Schema.
Die Datei wird nicht für jedes neue Modul verändert.
Bereits vorhandene zentrale Datenstrukturen müssen wiederverwendet werden.
Wenn eine neue Datenbankstruktur für ein Modul tatsächlich erforderlich ist, wird dafür eine eigene Migration verwendet.
9. DATENBANK-MIGRATIONSSYSTEM
CatchTrack verwendet ein migrationsbasiertes Datenbanksystem.
Vorhandene Migrationen sind Bestandteil der Datenbankhistorie.
Sie dürfen nicht nachträglich verändert oder gelöscht werden, nur weil spätere Versionen die Struktur erweitern.
Neue strukturelle Änderungen werden ausschließlich durch neue Migrationen vorgenommen.
Eine Migration muss:
* eindeutig versioniert sein
* reproduzierbar sein
* bestehende Daten berücksichtigen
* keine bestehenden Informationen unnötig zerstören
* zur zentralen Datenbankarchitektur passen
10. MODULARCHITEKTUR
Jedes Fachmodul befindet sich unter:
modules/[MODULNAME]/
Eine mögliche Struktur ist beispielsweise:
modules/
└── gps/
    ├── module.json
    ├── gps.html
    ├── gps.css
    └── gps.js
Die tatsächliche Struktur muss jedoch immer aus GitHub gelesen werden.
Es darf keine Dateiliste aus früheren Annahmen vorausgesetzt werden.
11. MODULE MANAGER
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
12. MODULE.JSON
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
Die tatsächlich bestehende Definition hat Vorrang.
13. SCHNITTSTELLEN
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
14. DATENBANKZUGRIFF VON MODULEN
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
15. AUTOMATISCH ERMITTELTE DATEN
Automatisch ermittelte Daten sind grundsätzlich als:
VORSCHLAG
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
16. GPS – ABGESCHLOSSENE VERSION
Stand: 09.08.2026
Das GPS-Modul wurde als funktional abgeschlossene Version 2.5.0 umgesetzt und geprüft.
Modulpfad:
modules/gps/
Aktuelle Dateien:
* gps.html
* gps.css
* gps.js
Die tatsächlich vorhandene module.json ist maßgeblich für die technische Moduldefinition.
17. FUNKTIONEN DES GPS-MODULS
Das GPS-Modul umfasst aktuell:
* aktuelle Standortbestimmung
* explizite Standortaktualisierung
* Vermeidung alter Geolocation-Cache-Daten
* Latitude
* Longitude
* GPS-Genauigkeit
* Höhe über Meeresspiegel, soweit vom Endgerät geliefert
* Höhengenauigkeit, soweit vom Endgerät geliefert
* Zeitpunkt der Standortbestimmung
* Aufenthaltsdauer
* Home Location speichern
* Home Location löschen
* Route zum aktuellen Standort
* Route zur Home Location
* aktuellen Standort teilen
* manuelle Eingabe eines Gewässernamens
* Speicherung des aktuellen GPS-Standorts als Gewässer
* Speicherung der Routing-Koordinaten des Gewässers
Nicht Bestandteil des GPS-Moduls:
* Bewegungsrichtung
* Geschwindigkeit
* Höhenunterschied zu Home
* automatischer Standortstatus
* automatische Gewässererkennung
18. GPS-DATENSTRUKTUR
Ein GPS-Positionsobjekt enthält konzeptionell:
* latitude
* longitude
* accuracy
* altitude
* altitudeAccuracy
* timestamp
* source
Nicht jedes Endgerät liefert zwingend alle Werte.
Insbesondere Höhe und Höhengenauigkeit können abhängig vom Endgerät fehlen.
19. GEWÄSSER-SPEICHERUNG DURCH GPS
Der Benutzer kann auf der GPS-Seite einen eigenen Gewässernamen eingeben.
Erst durch eine bewusste Benutzeraktion wird das Gewässer gespeichert.
Es erfolgt keine automatische Gewässererkennung.
Der gemeinsame Speicher-Schlüssel lautet:
waters:entries
Ein gespeicherter Gewässerdatensatz enthält derzeit:
* id
* name
* latitude
* longitude
* altitude
* accuracy
* timestamp
* createdAt
* source
Latitude und Longitude bilden die Routing-Position.
Das GPS-Modul legt damit die Grundlage für das spätere Waters-Modul.
20. GPS → WATERS
Der aktuelle Übergabepunkt lautet:
GPS → Waters
Das GPS-Modul ermittelt und speichert die Position.
Das Waters-Modul verwaltet die Gewässer.
Grundstruktur:
GPS
  ↓
waters:entries
  ↓
Waters-Modul
21. WATERS-MODUL – NÄCHSTER ARBEITSSCHRITT
Nach Abschluss des GPS-Moduls ist das Waters-Modul das nächste vorgesehene Fachmodul.
Vor der Entwicklung müssen die tatsächlich vorhandenen Dateien unter:
modules/waters/
vollständig geprüft werden.
Insbesondere sind vorhandene Entwurfsdateien einzulesen.
Bekannte historische Entwurfsdateien:
* module.json
* Waters.css
* Waters.html
* Waters.js
Diese Dateien sind Referenzmaterial.
Sie dürfen nicht ungeprüft als aktuelle Architektur übernommen werden.
22. ZIEL DES WATERS-MODULS
Das Waters-Modul soll mindestens ermöglichen:
* gespeicherte Gewässer anzeigen
* Gewässer manuell anlegen
* GPS-Position für ein Gewässer übernehmen
* Gewässername manuell vergeben
* gespeicherte Koordinaten anzeigen
* Gewässer zur Navigation verwenden
* Gewässer bearbeiten
* Gewässer löschen
* gespeicherte Gewässer dauerhaft verwalten
Die endgültige Funktionalität wird erst nach Prüfung des aktuellen Waters-Ordners festgelegt.
23. GPS- UND WATERS-TRENNUNG
GPS und Waters bleiben getrennte Fachmodule.
GPS:
Position ermitteln
Position aktualisieren
Position bereitstellen
Gewässerposition speichern
Waters:
Gewässer verwalten
Gewässer anzeigen
Gewässer bearbeiten
Gewässer löschen
Gewässer routen
Es wird kein zweites GPS-System im Waters-Modul aufgebaut.
Es wird kein paralleler Gewässerspeicher aufgebaut, wenn waters:entries verwendet werden kann.
24. MULTILINGUALITÄT
Neue Module müssen multilingual vorbereitet werden.
Texte dürfen nicht unnötig fest in JavaScript oder HTML eingebaut werden.
Die vorhandene CatchTrackLanguageManager-Architektur ist zu verwenden.
Deutsch ist derzeit die Standardsprache.
Weitere Sprachen müssen später ergänzt werden können.
25. RUNTIME UND FEHLERBEHANDLUNG
Module müssen die vorhandene Runtime- und Fehlerarchitektur verwenden.
Insbesondere:
CatchTrackErrorHandler
CatchTrackRuntimeStatus
CatchTrackRuntimeStorage
Fehler dürfen nicht stillschweigend verschluckt werden.
Modulfehler müssen nachvollziehbar bleiben.
26. WIEDERVERWENDBARKEIT
Funktionen sollen möglichst so entwickelt werden, dass andere Module sie später verwenden können.
GPS stellt eine wiederverwendbare Positionsstruktur bereit.
Andere Module sollen diese Daten verwenden können, ohne GPS-internen Code zu duplizieren.
27. KEINE PARALLELENTWICKLUNG
Bei der Entwicklung eines Moduls werden grundsätzlich keine anderen Fachmodule nebenbei umgebaut.
Ausnahmen sind nur:
* zwingende Core-Abhängigkeiten
* nachgewiesene Schnittstellenfehler
* ausdrücklich beauftragte Änderungen
Ziel:
ein Modul
→ vollständig
→ geprüft
→ abgeschlossen
→ nächstes Modul
28. ARBEITSABLAUF BEI JEDEM NEUEN MODUL
Schritt 1 – Referenzen einlesen
Zuerst werden die aktuellen Projektdateien gelesen:
AI_CONTEXT.md
PROJECT_RULES.md
PROJECT_STATUS.md
PROJECT_MODULE_PLAN.md
Danach werden nur die für das Modul relevanten Referenzdateien gelesen.
Schritt 2 – Tatsächlichen Projektstand prüfen
Zu prüfen sind:
* aktueller GitHub-Dateistand
* relevante Commit-Historie
* dokumentierter Projektstatus
* vorhandene Modulstruktur
* bestehende Schnittstellen
* relevante Abhängigkeiten
Schritt 3 – Vollständigen Modulordner prüfen
Der komplette Ordner:
modules/[MODULNAME]/
wird gelesen.
Nicht nur eine erwartete Dateiliste.
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
29. ENTWICKLUNG EINES MODULS
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
30. VORHANDENE DATEIEN
Eine vorhandene Datei wird nicht zwanghaft geflickt.
Wenn die Struktur sinnvoll ist:
gezielt integrieren
Wenn sie beschädigt, widersprüchlich, veraltet oder unnötig kompliziert ist:
vollständige Master-Version erstellen
Gültige bestehende Funktionen und Informationen dürfen dabei nicht verloren gehen.
31. AUSGABEFORMAT FÜR NEUE DATEIEN
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
32. COPYBLOCK-REGEL
Wenn mehrere Dateien gleichzeitig erstellt oder ersetzt werden müssen, werden sie möglichst gemeinsam in einer Ausgabe geliefert.
Beispiel:
gps.html
gps.css
gps.js
module.json
werden möglichst gemeinsam ausgegeben.
Diese Regel gilt verbindlich für alle weiteren Entwicklungsarbeiten.
33. WORKING-COPY-ARBEITSABLAUF
Der Benutzer übernimmt neue oder geänderte Dateien über Working Copy in das GitHub-Repository.
Daher gilt:
Assistent erstellt bzw. liefert vollständige Dateien.
↓
Benutzer ersetzt/übernimmt Dateien mit Working Copy.
↓
Benutzer speichert und committet.
↓
Assistent prüft den aktuellen GitHub-Stand.
Der Assistent darf keinen erfolgreichen GitHub-Schreibvorgang behaupten, wenn kein tatsächlicher Schreibzugriff vorhanden ist.
Nach einem Benutzer-OK soll, sofern der GitHub-Lesenzugriff verfügbar ist, automatisch geprüft werden:
* Datei vorhanden?
* erwarteter Inhalt vorhanden?
* Version korrekt?
* Commit vorhanden?
* Projektstruktur korrekt?
Bei fehlendem Schreibzugriff wird die Datei als vollständiger Copyblock für Working Copy bereitgestellt.
34. OK-REGEL
Wenn der Assistent Dateien zum Hochladen, Speichern oder Ersetzen bereitstellt und der Benutzer anschließend:
OK
antwortet, bedeutet dies:
Der Benutzer hat seinen Arbeitsschritt ausgeführt.
Danach wird der aktuelle GitHub-Stand geprüft, sofern der GitHub-Lesenzugriff verfügbar ist.
Wenn alles korrekt ist:
→ nächsten vorgesehenen Arbeitsschritt ausführen.
Wenn etwas nicht korrekt ist:
→ konkret mitteilen, was fehlt oder nicht stimmt.
Kein nächster Entwicklungsschritt wird als abgeschlossen dargestellt, wenn die erforderliche Kontrolle fehlgeschlagen ist.
35. AKTUELLER PROJEKTSTATUS
Stand: 09.08.2026
Abgeschlossen:
* Weather-Modul
* GPS-Modul Version 2.5.0
Aktueller Übergabepunkt:
GPS → Waters
Nächster vorgesehener Arbeitsschritt:
1. modules/waters/ vollständig prüfen
2. historische Entwurfsdateien einlesen
3. aktuelle Architektur und Schnittstellen prüfen
4. Bestandsaufnahme ausgeben
5. Waters-Modul als vollständige Master-Version entwickeln
6. testen
7. GitHub-Stand über Lesen kontrollieren
8. Modul abschließen
36. WICHTIGE ABSCHLUSSREGEL
Abgeschlossene Module werden nicht ohne konkreten technischen Grund erneut verändert.
Das GPS-Modul gilt ab Version 2.5.0 als abgeschlossen.
Änderungen am GPS-Modul erfolgen nur bei:
* nachgewiesenem Fehler
* notwendiger Schnittstellenänderung
* notwendiger Core-Anpassung
* ausdrücklich gewünschter Erweiterung
Das Waters-Modul wird unabhängig davon als nächster Arbeitsschritt entwickelt.
Ende AI_CONTEXT.md