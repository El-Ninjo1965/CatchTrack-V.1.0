CatchTrack – AI_CONTEXT.md

1. ZWECK DIESER DATEI

Diese Datei definiert die verbindlichen technischen Arbeitsregeln für die Weiterentwicklung von CatchTrack.

Sie dient als zentrale Arbeitsgrundlage für jede weitere Entwicklung.

Der tatsächlich vorhandene GitHub-Dateistand hat grundsätzlich Vorrang vor älteren Annahmen, Chatverläufen oder nicht mehr aktuellen Dokumentationen.

Die praktische Zusammenarbeit erfolgt über ChatGPT, Working Copy und GitHub.

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
CatchTrackIdentity

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

Der bisherige gemeinsame Speicher-Schlüssel lautet:

waters:entries

Ein bisher gespeicherter Legacy-Gewässerdatensatz enthält derzeit:

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

Das GPS-Modul hat damit die Grundlage für das Waters-Modul geschaffen.

Der bisherige waters:entries-Speicher gilt im Rahmen der späteren Identity-/Waters-Migration als Legacy-Bestand.

Er darf nicht ungeprüft als dauerhafte parallele Datenquelle weitergeführt werden.

20. GPS → WATERS

Der bisherige Übergabepunkt lautet:

GPS → Waters

Das GPS-Modul ermittelt und speichert die Position.

Das Waters-Modul verwaltet die Gewässer.

Historischer Übergabepunkt:

GPS
↓
waters:entries
↓
Waters-Modul

Zukünftiger Master-Übergabepunkt:

GPS
↓
Positionsdaten
↓
Waters
↓
zentrale CatchTrack-Datenbank

Die endgültige Speicherung eines persönlichen Gewässers erfolgt im Waters-Datenmodell mit Zuordnung zum aktuellen Benutzer.

21. IDENTITY CORE – ZENTRALE BENUTZERIDENTITÄT

CatchTrack verwendet eine zentrale Benutzeridentität.

Die bereits vorhandene Datenbankstruktur mit users bildet die Grundlage der Benutzeridentität.

Die technische Core-Implementierung befindet sich unter:

core/identityManager.js

Der Identity Core stellt für die gesamte Anwendung mindestens folgende Informationen und Funktionen bereit:

* aktueller Benutzer
* aktuelle user_id
* Benutzer laden
* aktuellen Benutzer setzen
* aktuellen Benutzer wechseln, sofern dies später erforderlich ist
* aktuellen Benutzer zurücksetzen
* Prüfung, ob ein gültiger Benutzer vorhanden ist

Die konkrete technische Implementierung muss sich in die vorhandene CatchTrack-Core-Architektur integrieren.

Es darf kein Fachmodul eine eigene Benutzeridentität oder eigene user_id-Logik entwickeln.

Grundprinzip:

User
↓
Identity Core
↓
current user_id
↓
persönliche Daten aller Fachmodule

Der Identity Core ist eine zentrale technische Abhängigkeit für alle persönlichen Datenmodule.

22. USER_ID ALS STANDARD FÜR PERSÖNLICHE DATEN

Daten, die eindeutig einem Benutzer gehören, müssen langfristig über user_id dem Benutzer zugeordnet werden.

Dies betrifft insbesondere:

* Waters
* Catches
* Fotos
* persönliche Einstellungen
* weitere personenbezogene Fachmoduldaten

Eine bereits vorhandene zentrale user_id wird wiederverwendet.

Es werden keine parallelen Benutzer- oder Identifikationssysteme aufgebaut.

Bei neuen persönlichen Datenstrukturen ist zu prüfen, ob eine user_id erforderlich ist.

Die Benutzerzuordnung erfolgt möglichst auf Datenbankebene über Foreign Keys und geeignete Indizes.

23. WATERS-MODUL – MASTER-ARCHITEKTUR

Das Waters-Modul verwaltet ausschließlich die Stammdaten eines Gewässers.

Die zukünftige Master-Struktur besteht konzeptionell aus:

* id
* user_id
* name
* type
* country
* region
* description
* gps_lat
* gps_lon
* created_at
* updated_at

Die tatsächlich implementierte Struktur wird durch den aktuellen GitHub-Stand und die Datenbankmigrationen bestimmt.

user_id ist verbindlicher Bestandteil der zukünftigen Master-Struktur.

Ein Waters-Datensatz gehört genau zu dem Benutzer, dem er zugeordnet wurde.

Waters-Zugriffe müssen die Benutzerzuordnung berücksichtigen.

Insbesondere müssen:

* Auflisten
* Anzeigen
* Suchen
* Bearbeiten
* Löschen
* GPS-Übernahme
* Navigation

auf die zulässigen Datensätze des aktuellen Benutzers begrenzt werden.

Ein Benutzer darf niemals über eine manipulierte Datensatz-ID auf ein fremdes persönliches Gewässer zugreifen können.

24. WATERS BLEIBT SCHLANK

Das Waters-Modul wird nicht zu einer Sammeldatenbank für sämtliche Informationen über ein Gewässer.

Waters enthält primär die Gewässer-Stammdaten.

Folgende Informationen werden ausdrücklich nicht ungeordnet in die Waters-Tabelle aufgenommen:

* Fanghistorie
* einzelne Fangstellen
* Fotos
* Wetterhistorien
* sonstige umfangreiche Fachinformationen

Diese Informationen werden später über eigene Fachmodule bzw. Datenstrukturen mit water_id verbunden.

Grundprinzip:

waters
│
├── water_id → Catches
├── water_id → Fishing Spots
├── water_id → Photos
└── water_id → weitere gewässerbezogene Daten

25. CATCHER – FANGHISTORIE

Das Fangbuch-Modul Catcher ist für die Fanghistorie zuständig.

Ein Fang gehört fachlich zum Fangbuch und nicht zur Waters-Stammdatentabelle.

Ein Fang kann über water_id einem Gewässer zugeordnet werden.

Zusätzlich bleibt die Benutzerzuordnung über user_id bestehen.

Grundprinzip:

User
↓
Catch
├── user_id
└── water_id
↓
Waters

Die Fanghistorie wird nicht redundant in Waters gespeichert.

26. FISHING SPOTS

Ein späteres Fishing-Spots-Modul kann konkrete Angelstellen innerhalb eines Gewässers verwalten.

Eine Angelstelle ist nicht dasselbe wie ein Gewässer.

Eine Fishing-Spot-Struktur kann insbesondere enthalten:

* id
* user_id
* water_id
* name
* gps_lat
* gps_lon
* description
* created_at
* updated_at

Die genaue Struktur wird erst bei der Entwicklung des entsprechenden Moduls festgelegt.

GPS-Koordinaten dienen dabei als Positionsdaten der Angelstelle.

Eine automatische Erkennung oder automatische endgültige Speicherung darf nicht vorausgesetzt werden.

Automatisch ermittelte GPS-Daten gelten gemäß den allgemeinen CatchTrack-Regeln zunächst als korrigierbare Vorschläge.

27. FOTOS

Fotos werden nicht grundsätzlich als Binärdaten direkt in die Waters-Tabelle integriert.

Das spätere Fotosystem soll möglichst wiederverwendbar aufgebaut werden.

Ein Foto kann perspektivisch mit unterschiedlichen Fachobjekten verbunden werden, beispielsweise:

* Gewässer
* Fishing Spot
* Catch

Die konkrete Datenstruktur wird erst bei Entwicklung des Fotosystems festgelegt.

Grundprinzip:

Photo
├── user_id
├── water_id
├── fishing_spot_id (optional)
└── catch_id (optional)

28. WASSERBEZOGENE MODULBEZIEHUNGEN

CatchTrack verwendet für gewässerbezogene Fachinformationen grundsätzlich Beziehungen statt redundanter Datenhaltung.

Das Gewässer ist der zentrale Bezugspunkt.

Beispiel:

Waters
│
├── Catches
├── Fishing Spots
├── Photos
└── Weather

Dadurch bleiben die einzelnen Module fachlich getrennt und können trotzdem miteinander arbeiten.

Module dürfen benötigte Informationen über definierte Schnittstellen und IDs beziehen.

Informationen dürfen nicht unnötig in mehreren Modulen dupliziert werden.

29. GPS → WATERS → FACHMODULE

GPS liefert Positionsdaten.

Waters verwaltet Gewässer.

Catcher verwaltet Fänge.

Fishing Spots verwaltet konkrete Angelstellen.

Photos verwaltet Fotos.

Weather verwaltet Wetterinformationen.

Diese Verantwortlichkeiten bleiben getrennt.

Grundprinzip:

GPS
↓
Position
↓
Waters
↓
water_id
├── Catcher
├── Fishing Spots
├── Photos
└── Weather

Kein Fachmodul übernimmt dauerhaft die fachliche Verantwortung eines anderen Moduls.

30. WATERS-MIGRATION

Da Waters ursprünglich ohne user_id angelegt wurde, muss die Erweiterung über eine neue Datenbankmigration erfolgen.

Vorhandene Migrationen werden nicht nachträglich verändert.

Die neue Migration muss:

* waters.user_id ergänzen
* einen geeigneten Foreign Key herstellen
* einen geeigneten Index anlegen
* bestehende Waters-Datensätze berücksichtigen
* keine vorhandenen Gewässerdaten unnötig zerstören
* mit der vorhandenen Users-Struktur kompatibel sein

Die Zuordnung bestehender Datensätze muss eindeutig und reproduzierbar erfolgen.

Es darf keine stillschweigende Löschung oder zufällige Benutzerzuordnung stattfinden.

Der bisherige waters:entries-Bestand wird bei der Migration als Legacy-Datenquelle behandelt.

Nach erfolgreicher Migration darf keine unnötige parallele Waters-Datenhaltung entstehen.

31. MULTILINGUALITÄT

Neue Module müssen multilingual vorbereitet werden.

Texte dürfen nicht unnötig fest in JavaScript oder HTML eingebaut werden.

Die vorhandene CatchTrackLanguageManager-Architektur ist zu verwenden.

Deutsch ist derzeit die Standardsprache.

Weitere Sprachen müssen später ergänzt werden können.

32. RUNTIME UND FEHLERBEHANDLUNG

Module müssen die vorhandene Runtime- und Fehlerarchitektur verwenden.

Insbesondere:

CatchTrackErrorHandler
CatchTrackRuntimeStatus
CatchTrackRuntimeStorage

Fehler dürfen nicht stillschweigend verschluckt werden.

Modulfehler müssen nachvollziehbar bleiben.

33. WIEDERVERWENDBARKEIT

Funktionen sollen möglichst so entwickelt werden, dass andere Module sie später verwenden können.

GPS stellt eine wiederverwendbare Positionsstruktur bereit.

Identity stellt eine wiederverwendbare Benutzeridentität bereit.

Waters stellt eine wiederverwendbare Gewässerreferenz über water_id bereit.

Andere Module sollen diese Daten verwenden können, ohne internen Modulcode zu duplizieren.

34. KEINE PARALLELENTWICKLUNG

Bei der Entwicklung eines Moduls werden grundsätzlich keine anderen Fachmodule nebenbei umgebaut.

Ausnahmen sind nur:

* zwingende Core-Abhängigkeiten
* nachgewiesene Schnittstellenfehler
* ausdrücklich beauftragte Änderungen

Die Identity-Implementierung ist in diesem Zusammenhang eine zwingende Core-/Architekturabhängigkeit für die Benutzerzuordnung persönlicher Daten.

Ziel:

ein Modul
→ vollständig
→ geprüft
→ abgeschlossen
→ nächstes Modul

35. ARBEITSREIHENFOLGE DER AKTUELLEN ARCHITEKTUR

Die Entwicklung erfolgt grundsätzlich in technischer Abhängigkeitsreihenfolge.

Aktueller Übergang:

GPS
↓
Identity Core
↓
Waters Master

Danach folgen die weiteren Fachmodule gemäß aktuellem PROJECT_MODULE_PLAN.md.

Die konkrete Reihenfolge zukünftiger Module wird durch den aktuellen Projektstand und PROJECT_MODULE_PLAN.md bestimmt.

Technische Abhängigkeiten haben Vorrang vor einer rein alphabetischen oder historischen Reihenfolge.

36. KEINE VORZEITIGE AUSIMPLEMENTIERUNG ZUKÜNFTIGER MODULE

Die Architektur muss spätere Module ermöglichen.

Zukünftige Module werden jedoch nicht vorzeitig als Teil eines anderen Moduls implementiert.

Beispiel:

Waters darf water_id als zentrale Beziehung bereitstellen.

Waters implementiert aber nicht selbst:

* vollständige Fanghistorie
* Fishing-Spots-Verwaltung
* Fotoverwaltung
* Wetterhistorie
* Community-Funktionen
* Marketplace-Funktionen
* Cloud-Synchronisation
* Abonnementverwaltung

Diese Funktionen werden später in ihren jeweiligen Modulen bzw. zentralen Diensten umgesetzt.

37. ARCHITEKTURZIEL

CatchTrack soll langfristig aus klar getrennten, miteinander verbundenen Fachmodulen bestehen.

Die zentrale Identität bildet die Benutzergrenze.

Die Fachobjekte werden über IDs miteinander verbunden.

Grundprinzip:

Identity Core
↓
user_id
↓
Fachobjekte
↓
Beziehungen über IDs

Dabei gilt:

* keine unnötige Datenredundanz
* keine parallelen Speichersysteme
* keine parallelen Identitätssysteme
* klare Modulverantwortlichkeiten
* zentrale Datenbank
* migrationsbasierte Erweiterungen
* wiederverwendbare Schnittstellen
* automatische Daten nur als korrigierbare Vorschläge

38. MODULREIHENFOLGE UND ABHÄNGIGKEITEN

Der aktuelle Entwicklungsstand wird nicht allein anhand einer historischen Modulliste bestimmt.

Vor Beginn eines neuen Moduls muss geprüft werden:

* bestehende Core-Abhängigkeiten
* bestehende Datenbankabhängigkeiten
* Benutzer-/Identity-Abhängigkeiten
* Schnittstellen zu bereits abgeschlossenen Modulen
* PROJECT_MODULE_PLAN.md
* tatsächlicher GitHub-Stand

Ein Modul darf nicht nur deshalb vorgezogen oder fertiggestellt werden, weil eine ältere Dokumentation dies vorsieht.

Der tatsächlich erforderliche technische Unterbau hat Vorrang.

39. MASTER-DATEIEN

Bei der Entwicklung eines Moduls werden zusammengehörige Dateien möglichst gemeinsam als vollständige Master-Version erstellt.

Ziel:

* keine unnötigen Zwischenstände
* keine wiederholten Teilreparaturen
* konsistente Schnittstellen
* vollständige Abhängigkeiten
* klare Datenstrukturen
* langfristige Wiederverwendbarkeit

Eine Master-Version muss den bekannten zukünftigen Architekturanforderungen Rechnung tragen, ohne zukünftige Fachmodule vorzeitig vollständig zu implementieren.

40. VOLLSTÄNDIGE DATEIEN STATT PATCHES

Wenn eine Datei erstellt, ersetzt oder überarbeitet werden muss, wird grundsätzlich immer die vollständige Datei ausgegeben.

Es werden keine:

* Patch-Fragmente
* Diff-Ausschnitte
* einzelnen zu ersetzenden Codezeilen
* Such-und-Ersetzen-Anweisungen
* unvollständigen Dateiausschnitte

als primäre Arbeitsgrundlage geliefert.

Auch bei kleinen Änderungen wird die vollständige aktuelle Master-Version der betroffenen Datei ausgegeben.

Wenn mehrere Dateien zusammengehören, werden alle betroffenen Dateien gemeinsam als vollständige Dateien ausgegeben.

Ziel ist, dass jede bereitgestellte Datei direkt als vollständige Datei in Working Copy übernommen werden kann.

41. VORHANDENE DATEIEN

Eine vorhandene Datei wird nicht zwanghaft geflickt.

Wenn die Struktur sinnvoll ist:

→ gezielt integrieren

Wenn sie beschädigt, widersprüchlich, veraltet oder unnötig kompliziert ist:

→ vollständige Master-Version erstellen

Gültige bestehende Funktionen und Informationen dürfen dabei nicht verloren gehen.

42. AUSGABEFORMAT FÜR NEUE DATEIEN

Bei der Entwicklung werden zunächst vollständig aufgelistet:

ZU ERSETZEN

* Dateien

NEU ZU ERSTELLEN

* Dateien

LÖSCHKANDIDATEN

* Dateien
* kurze Begründung

UNVERÄNDERT

* Dateien

Danach folgen die vollständigen Inhalte aller zu ersetzenden und neu zu erstellenden Dateien.

Jede Datei wird möglichst in genau einem Copyblock ausgegeben.

Keine unnötigen Teilstücke.

Keine unvollständigen Patch-Fragmente.

43. COPYBLOCK-REGEL

Wenn mehrere Dateien gleichzeitig erstellt oder ersetzt werden müssen, werden sie möglichst gemeinsam in einer Ausgabe geliefert.

Beispiel:

gps.html
gps.css
gps.js
module.json

werden möglichst gemeinsam ausgegeben.

Diese Regel gilt verbindlich für alle weiteren Entwicklungsarbeiten.

44. ARBEITSABLAUF: CHATGPT → WORKING COPY → GITHUB

Die CatchTrack-Entwicklung erfolgt nach folgendem verbindlichen Arbeitsablauf:

ChatGPT
↓
vollständige Master-Dateien / Änderungen
↓
Benutzer übernimmt die Dateien mit Working Copy
↓
Working Copy speichert und committet
↓
GitHub
↓
ChatGPT liest den aktuellen GitHub-Stand zur Kontrolle

ChatGPT übernimmt die Entwicklung, technische Prüfung und Kontrolle.

Working Copy übernimmt die lokale Integration, Speicherung und den Commit.

GitHub ist der maßgebliche technische Projektstand.

ChatGPT muss nicht prüfen oder thematisieren, ob ein direkter Schreibzugriff auf GitHub besteht.

Nach dem Benutzer-OK wird der aktuelle GitHub-Stand erneut gelesen.

Dabei werden abhängig vom Arbeitsschritt insbesondere geprüft:

* Dateien vorhanden
* aktueller Dateiinhalt
* relevante Ordnerstruktur
* Versionen
* Commit
* Commit-SHA, sofern verfügbar
* relevante Abhängigkeiten
* tatsächlicher Projektstand

Die Zusammenarbeit wird nicht durch wiederholte Rückfragen nach bereits ausgeführten Arbeitsschritten unterbrochen.

Wenn der Benutzer den vorgesehenen Arbeitsschritt mit OK bestätigt, gilt dieser als ausgeführt und die Kontrolle erfolgt unmittelbar.

45. OK-REGEL

Wenn der Benutzer:

OK

antwortet, bedeutet dies verbindlich:

Der Benutzer hat den vorgesehenen Arbeitsschritt ausgeführt.

Nach OK wird ohne weitere Rückfrage der aktuelle GitHub-Stand geprüft, sofern der GitHub-Zugriff verfügbar ist.

Wenn die Prüfung erfolgreich ist:

→ nächsten vorgesehenen Arbeitsschritt ausführen.

Wenn etwas nicht korrekt ist:

→ konkret mitteilen, was fehlt oder nicht stimmt.

Es ist keine zusätzliche Bestätigung erforderlich, dass Dateien gespeichert, übernommen oder committed wurden.

Es ist nicht erforderlich, dem Benutzer mitzuteilen, dass ChatGPT selbst keine Dateien direkt verändert hat.

Kein nächster Entwicklungsschritt wird als abgeschlossen dargestellt, wenn die erforderliche Kontrolle fehlgeschlagen ist.

46. CLOUD-FIRST-READINESS / OFFLINE-FIRST-ARCHITEKTUR

CatchTrack bleibt grundsätzlich eine Offline-First-Anwendung.

Die lokale CatchTrack-Datenbank ist die primäre Datenquelle für den lokalen Betrieb.

Eine spätere Cloud-Anbindung erweitert CatchTrack, ersetzt aber nicht die lokale Datenbank.

Grundprinzip:

Lokale CatchTrack-Datenbank
↓
lokaler vollständiger Betrieb
↓
optionale Cloud-Anbindung
↓
Synchronisation / Veröffentlichung / Community / Statistik

Die Cloud darf nicht zur zwingenden Voraussetzung für die grundlegende Nutzung von CatchTrack werden.

Module müssen so entwickelt werden, dass relevante Daten später über definierte IDs und Schnittstellen in eine Cloud-Synchronisation übernommen werden können.

Die Cloud-Architektur wird nicht vorzeitig in einzelne Fachmodule eingebaut.

Stattdessen müssen Fachmodule bereits jetzt eindeutige und stabile Datenidentitäten besitzen.

47. USER_ID ALS TECHNISCHER IDENTITÄTSSCHLÜSSEL

Die user_id ist der technische Identitätsschlüssel eines Benutzers.

Benutzernamen, Anzeigenamen oder öffentliche Namen dürfen niemals als primärer technischer Schlüssel für Beziehungen zwischen Daten verwendet werden.

Grundprinzip:

user_id
↓
technische Zuordnung

Anzeigename / Benutzername
↓
öffentliche Darstellung

Ein Benutzer kann seinen öffentlichen Namen später ändern, ohne dass dadurch bestehende Datenbeziehungen ungültig werden.

Die user_id bleibt dauerhaft die technische Referenz.

48. IDENTITÄT, PRIVATHEIT UND ÖFFENTLICHE DARSTELLUNG

Die technische Benutzeridentität und die öffentliche Darstellung eines Benutzers müssen voneinander getrennt werden.

Ein Benutzer kann später selbst bestimmen, welche Identitätsinformationen bei freigegebenen Cloud-Daten dargestellt werden.

Mögliche Darstellungsformen sind beispielsweise:

* anonym
* Benutzername
* öffentlicher Anzeigename

Die konkrete Auswahl wird über das Identity-/Privacy-System geregelt.

Ein technisch vorhandener user_id-Wert bedeutet niemals automatisch, dass der Benutzername oder andere personenbezogene Daten öffentlich sichtbar werden dürfen.

Grundprinzip:

user_id
↓
interne technische Identität

Privacy / Sharing
↓
entscheidet über Sichtbarkeit

Public Identity
↓
entscheidet über angezeigte Identität

49. DATENFREIGABE UND CLOUD-SHARING

Die spätere Cloud-Anbindung muss zwischen:

* privaten Daten
* synchronisierten persönlichen Daten
* geteilten Daten
* öffentlichen Daten

unterscheiden können.

Ein Benutzer muss später selbst festlegen können, welche Daten für welche Verwendung freigegeben werden.

Dies kann insbesondere betreffen:

* Gewässer
* Fänge
* Fotos
* Fishing Spots
* Statistiken
* Community-Aktivitäten

Die Freigabe eines Datensatzes darf nicht automatisch die Veröffentlichung aller mit diesem Datensatz verbundenen Informationen bedeuten.

Beispiel:

Ein Gewässer kann öffentlich sichtbar sein, während:

* exakte private Fangstellen
* persönliche Fotos
* private Fangnotizen
* persönliche Identitätsinformationen

weiterhin geschützt bleiben.

Die genaue Sharing-Struktur wird später als eigener Architektur-/Cloud-Schritt festgelegt.

50. WATERS UND SPÄTERE CLOUD-NUTZUNG

Waters muss bereits jetzt so aufgebaut sein, dass Gewässer später cloudfähig referenziert werden können.

Dafür sind insbesondere erforderlich:

* stabile water_id
* user_id
* klare Eigentümerschaft
* klare Stammdaten
* eindeutige Beziehungen
* keine Abhängigkeit vom Benutzernamen
* keine Abhängigkeit von lokalen Speicher-Schlüsseln als dauerhafte Identität

Waters implementiert jedoch nicht selbst die spätere Cloud-Synchronisation.

Die Cloud erhält die Möglichkeit, Waters-Daten später über definierte Schnittstellen und IDs abzufragen und zu synchronisieren.

51. FANGDATEN ALS GRUNDLAGE SPÄTERER STATISTIKEN

CatchTrack soll später aus relevanten Fangdaten statistische Erkenntnisse erzeugen können.

Dafür sollen relevante Rohdaten strukturiert erhalten bleiben.

Mögliche Daten sind beispielsweise:

* user_id
* water_id
* fish_id
* bait_id
* Zeitpunkt
* Wetterdaten
* Wasserbedingungen
* relevante Positionsdaten
* Fanggewicht
* Fanglänge
* weitere fachlich relevante Fangdaten

Die konkreten Strukturen werden in den jeweiligen Fachmodulen definiert.

Statistiken werden möglichst aus strukturierten Rohdaten berechnet und nicht ausschließlich als manuell gepflegte Endwerte gespeichert.

Beispiele für spätere Auswertungen:

* beste Fangzeit für eine Fischart
* erfolgreichste Köder für eine Fischart
* Erfolgswahrscheinlichkeit bestimmter Köder an bestimmten Gewässern
* saisonale Fangmuster
* regionale Fangstatistiken

Automatisch berechnete statistische Ergebnisse sind grundsätzlich als berechnete Daten und nicht als unveränderliche Benutzerdaten zu behandeln.

52. CLOUD-DATEN UND AKTUELLE GPS-POSITION

Die aktuelle persönliche GPS-Position des Benutzers wird nicht automatisch als öffentliches Cloud-Datum behandelt.

Insbesondere:

* aktuelle Live-Position
* Aufenthaltsort
* Bewegungsdaten

dürfen nicht allein aufgrund aktivierter Cloud-Funktionen veröffentlicht werden.

Eine spätere bewusste Freigabe oder ein ausdrücklich definierter Community-Fall kann hiervon unterscheiden.

Die lokale GPS-Funktion bleibt unabhängig von der Cloud funktionsfähig.

53. COMMUNITY-ARCHITEKTUR

CatchTrack soll später um Community-Funktionen erweitert werden.

Dazu können insbesondere gehören:

* Angeltreffen
* Community-Pinnwand
* öffentliche Gewässerinformationen
* öffentliche Fangstatistiken
* gemeinsame Aktivitäten
* weitere Community-Funktionen

Diese Funktionen werden als eigene Fachmodule bzw. zentrale Community-Dienste entwickelt.

Sie werden nicht vorzeitig in Waters oder Catcher implementiert.

Grundprinzip:

Community
├── Fishing Events
├── Community Board
├── öffentliche Waters
└── weitere Community-Dienste

54. ANGELTREFFEN / FISHING EVENTS

Ein späteres Fishing-Events-Modul soll Benutzern ermöglichen, Angeltreffen zu planen.

Ein mögliches Konzept ist:

* Benutzer erstellt Treffen
* Gewässer wird über water_id referenziert
* Datum und Uhrzeit
* Beschreibung
* Teilnehmer
* Teilnahmebestätigung
* Sichtbarkeit

Beispiel:

user_id
↓
Fishing Event
├── water_id
├── date
├── time
├── description
└── participants

Die konkrete Datenstruktur wird erst bei Entwicklung des Fishing-Events-Moduls festgelegt.

Waters bleibt für die Stammdaten des Gewässers verantwortlich.

55. COMMUNITY-PINNWAND

Eine spätere Community-Pinnwand kann als allgemeine Plattform für Benutzerbeiträge dienen.

Mögliche Inhalte:

* Fragen
* Ankündigungen
* Angeltreffen
* Empfehlungen
* regionale Hinweise
* sonstige zulässige Community-Inhalte

Die Pinnwand wird als eigenes Community-System aufgebaut.

Sie gehört nicht in die Waters-Stammdaten.

56. MARKETPLACE

CatchTrack soll später optional einen Marketplace bereitstellen können.

Der Marketplace wird als eigenständiges Fachmodul bzw. Cloud-Dienst umgesetzt.

Mögliche Funktionen:

* private Verkaufsangebote
* Bilder
* Beschreibung
* Preis
* Kategorie
* Standort / Region
* Kontaktaufnahme
* Angebotsstatus
* Laufzeit
* Hervorhebung

Der Marketplace darf nicht Bestandteil von Waters oder Catcher werden.

Marketplace-Daten erhalten eigene technische IDs und können über user_id mit dem Verkäufer verbunden werden.

Die Identität des Verkäufers wird gemäß Privacy-/Sharing-Einstellungen dargestellt.

57. TARIF-, PAKET- UND ADD-ON-SYSTEM

CatchTrack soll langfristig unterschiedliche Funktionspakete anbieten können.

Beispielhafte Ebenen:

* Free
* Plus
* Pro
* optionale Add-ons

Die konkreten Produktnamen und Preise sind noch nicht endgültig festgelegt.

Tarife dürfen nicht als einfacher statischer Textwert direkt in Fachmodulen gespeichert werden.

Langfristig soll eine zentrale Subscription-/Entitlement-Struktur verwendet werden.

Grundprinzip:

User
↓
Subscription / Plan
↓
Entitlements
↓
PermissionManager
↓
Funktion darf verwendet werden

Mögliche Entitlements sind beispielsweise:

* cloud_sync
* marketplace_create
* marketplace_extended
* advanced_statistics
* community_events
* additional_cloud_storage

Die konkreten Entitlements werden später zentral definiert.

58. PERMISSION- UND ENTITLEMENT-ARCHITEKTUR

Fachmodule dürfen nicht selbst entscheiden, welches Paket ein Benutzer besitzt.

Ein Fachmodul fragt ausschließlich eine zentrale Berechtigungs-/Entitlement-Schnittstelle ab.

Beispiel:

CatchTrackPermissionManager
↓
can(“marketplace.create”)
can(“community.event.create”)
can(“cloud.sync”)
can(“advanced.analytics”)

Die tatsächliche Berechtigung wird zentral aus Benutzer-, Tarif-, Add-on- und gegebenenfalls Administrationsdaten bestimmt.

Dadurch können Tarife und Add-ons später geändert werden, ohne Fachmodule technisch umzubauen.

59. ADMIN / CMS – LANGFRISTIGES ARCHITEKTURZIEL

CatchTrack soll langfristig ein zentrales Admin-/CMS-System erhalten.

Das Admin-System soll später insbesondere ermöglichen:

* Benutzer verwalten
* Benutzerinformationen bearbeiten
* Benutzer sperren oder aktivieren
* Tarife verwalten
* Abonnements verwalten
* Add-ons zuweisen
* Berechtigungen verwalten
* Community-Inhalte moderieren
* Marketplace-Inhalte verwalten
* Stammdaten verwalten
* Statistiken anzeigen
* Cloud-Dienste verwalten
* App-Versionen verwalten
* Systeminformationen verwalten

Das Admin-/CMS-System ist zunächst als spätere Architektur vorgesehen.

Es wird nicht vorzeitig in Waters implementiert.

60. ADMIN UND BENUTZERIDENTITÄT

Das spätere Admin-System darf Benutzer nicht über Namen als technische Primäridentität verwalten.

Technische Verwaltung erfolgt über user_id.

Darstellung kann zusätzlich enthalten:

* Benutzername
* öffentlicher Name
* E-Mail, sofern vorhanden und zulässig
* Status
* Tarif
* Berechtigungen

Technische Beziehungen bleiben an user_id gebunden.

61. CLOUD-SYNCHRONISATION

Die spätere Cloud-Synchronisation muss grundsätzlich unterscheiden zwischen:

* lokalen Primärdaten
* noch nicht synchronisierten Daten
* synchronisierten Daten
* geänderten Daten
* zur Veröffentlichung freigegebenen Daten

Die genaue Synchronisationsstrategie wird später als eigener Architektur-Schritt definiert.

Ein Fachmodul darf keine eigene parallele Cloud-Synchronisation implementieren.

Die Synchronisation wird über einen zentralen Cloud-/Sync-Dienst bzw. eine klar definierte Core-Schnittstelle erfolgen.

62. CLOUD UND DATENHOHEIT

Die Aktivierung der Cloud bedeutet nicht automatisch die Veröffentlichung aller lokalen Daten.

Der Benutzer bleibt grundsätzlich Herr über die Freigabe seiner persönlichen Daten, soweit gesetzliche, technische oder ausdrücklich vereinbarte Bedingungen nichts anderes erfordern.

Besonders sensible Daten müssen standardmäßig geschützt bleiben.

Die Cloud-Architektur muss deshalb Datenschutz und technische Zugriffskontrolle berücksichtigen.

63. UPDATE-ARCHITEKTUR

CatchTrack soll später eine zentrale Update-Funktion erhalten.

Wenn die Cloud-Funktion aktiviert ist, kann beim Start der Anwendung geprüft werden, ob eine neue CatchTrack-Version verfügbar ist.

Grundprinzip:

CatchTrack startet
↓
Cloud aktiviert?
├── NEIN
│   ↓
│ normaler Start
│
└── JA
↓
Update-/Versionsdienst
↓
verfügbare Version prüfen
↓
neue Version vorhanden?
├── NEIN → normaler Start
└── JA
↓
Benutzer informieren
↓
Update nach Benutzerbestätigung

Updates sollen grundsätzlich nicht ungefragt oder unkontrolliert installiert werden.

Die konkrete technische Update-Infrastruktur wird später als eigener Core-/Cloud-Schritt entwickelt.

64. UPDATE-DATEN

Ein späterer Update-Dienst kann insbesondere bereitstellen:

* aktuelle App-Version
* verfügbare Version
* Mindestversion
* Update erforderlich / optional
* Release-Informationen
* Download-/Installationsinformationen
* gegebenenfalls Migrationserfordernisse

Die konkrete Struktur wird erst bei Entwicklung des Update-Systems festgelegt.

Die lokale App muss auch bei deaktivierter Cloud weiterhin grundsätzlich funktionsfähig bleiben.

65. CLOUD-FUNKTIONEN NICHT VORZEITIG IMPLEMENTIEREN

Die langfristige Cloud-Architektur wird bereits bei der Datenmodellierung berücksichtigt.

Die eigentliche Cloud-Funktionalität wird jedoch nicht vorzeitig in einzelne Fachmodule eingebaut.

Insbesondere Waters implementiert nicht selbst:

* Cloud-Synchronisation
* Marketplace
* Fishing Events
* Community Board
* globale Benutzerverwaltung
* Tarifverwaltung
* globale Statistiken
* Update-Service

Waters stellt lediglich saubere, eindeutig referenzierbare Stammdaten bereit.

66. LOKALE DATENBANK ALS PRIMÄRQUELLE

CatchTrack bleibt Offline-First.

Die lokale Datenbank ist für den lokalen Betrieb die primäre Datenquelle.

Cloud-Daten sind eine zusätzliche Synchronisations-, Veröffentlichungs-, Community- oder Statistikebene.

Grundprinzip:

Local First
↓
Cloud Optional
↓
Cloud erweitert CatchTrack
↓
Cloud ersetzt nicht den lokalen Kern

67. MODULVERANTWORTLICHKEITEN

Die langfristigen Verantwortlichkeiten sind grundsätzlich getrennt:

GPS
→ Position

Identity
→ Benutzeridentität

Waters
→ Gewässer-Stammdaten

Catcher
→ Fänge

Fishing Spots
→ konkrete Angelstellen

Photos
→ Fotos

Weather
→ Wetterdaten

Community
→ Community-Funktionen

Fishing Events
→ Angeltreffen

Marketplace
→ Verkaufsangebote

Subscriptions / Entitlements
→ Pakete und Funktionsfreigaben

Admin / CMS
→ Administration und Inhaltsverwaltung

Cloud / Sync
→ Synchronisation und Cloud-Daten

Update Service
→ Versionsprüfung und Aktualisierungen

Die tatsächlichen Modulnamen werden durch PROJECT_MODULE_PLAN.md und den aktuellen GitHub-Stand bestimmt.

68. MODULREIHENFOLGE UND ABHÄNGIGKEITEN – ERWEITERT

Neue Fachmodule werden erst entwickelt, wenn ihre erforderlichen technischen Grundlagen vorhanden sind.

Beispiel:

Identity
↓
persönliche Daten

Waters
↓
water_id

Catcher
↓
user_id + water_id

Fishing Spots
↓
user_id + water_id

Community
↓
user_id + öffentliche Referenzen

Fishing Events
↓
user_id + water_id

Marketplace
↓
user_id + Entitlements

Cloud / Sync
↓
bestehende stabile Datenidentitäten

Admin / CMS
↓
Identity + Permission + Subscription + Cloud

Technische Abhängigkeiten haben Vorrang vor einer rein historischen Reihenfolge.

69. KEINE VORZEITIGE CLOUD-DATENMODELLIERUNG IN FACHMODULEN

Fachmodule sollen nur die Daten speichern, für die sie fachlich verantwortlich sind.

Spätere Cloud-Felder dürfen nicht ohne definierte Semantik in bestehende Tabellen eingefügt werden.

Insbesondere dürfen keine unklaren Felder wie:

* cloud_status
* public
* sync
* published

nur auf Verdacht angelegt werden.

Wenn Cloud- oder Sharing-Felder tatsächlich benötigt werden, müssen deren Bedeutung, Lebenszyklus und Datenschutzwirkung zuvor technisch definiert werden.

Die stabile Grundlage bilden zunächst:

* user_id
* fachliche Objekt-ID
* Beziehungen über IDs
* strukturierte Daten
* klare Modulverantwortlichkeit

70. STATISTISCHE UND KI-BASIERTE AUSWERTUNGEN

CatchTrack soll langfristig aus den gesammelten, freigegebenen Daten statistische und gegebenenfalls KI-basierte Erkenntnisse ableiten können.

Beispiele:

* beste Fangzeit
* beste Köder
* Fischarten nach Gewässer
* saisonale Muster
* regionale Muster
* Erfolgswahrscheinlichkeiten
* Zusammenhänge zwischen Wetter und Fang

Solche Ergebnisse müssen als:

BERECHNET / VORSCHLAG

behandelt werden.

Sie dürfen nicht ungeprüft als endgültige fachliche Wahrheit dargestellt werden.

Die zugrunde liegenden Rohdaten müssen nachvollziehbar bleiben, soweit Datenschutz und Freigabeeinstellungen dies erlauben.

71. MASTER-DATEIEN UND ZUKÜNFTIGE ARCHITEKTUR

Eine Master-Datei muss nicht jede zukünftig denkbare Funktion enthalten.

Sie muss jedoch bekannte, verbindlich beschlossene Architekturentscheidungen berücksichtigen.

Beispiel:

Waters muss user_id und water_id sauber unterstützen.

Waters muss später über definierte Schnittstellen cloudfähig abfragbar sein.

Waters muss aber nicht bereits jetzt Marketplace, Community oder Cloud-Synchronisation implementieren.

Ziel:

Heute vollständige Master-Version
+
saubere Schnittstellen
+
keine unnötige Vorabimplementierung

72. AKTUELLER PROJEKTSTATUS

Stand: 10.08.2026

Abgeschlossen:

* Weather-Modul
* GPS-Modul Version 2.5.0
* Identity Core befindet sich im aktuellen Projektstand
* bisheriger Waters-Entwicklungsstand wurde committed

Aktueller technischer Übergang:

GPS
↓
Identity Core
↓
Waters Master

Aktuell zu erledigen:

1. aktuellen Identity-Core-Stand gegen GitHub prüfen
2. vorhandene Users-Struktur und Benutzerbeziehungen prüfen
3. Waters-Migration mit user_id prüfen und gegebenenfalls als saubere Master-Migration herstellen
4. bestehende Waters-Daten berücksichtigen
5. vollständigen aktuellen Waters-Ordner prüfen
6. Waters-Dateien gegen Identity Core prüfen
7. Waters als vollständige Identity-kompatible Master-Version fertigstellen
8. Waters testen
9. GitHub-Stand über Lesen kontrollieren
10. Waters als abgeschlossenen Architekturstand dokumentieren
11. danach mit dem nächsten technisch vorgesehenen Modul fortfahren

Die konkrete Reihenfolge wird bei jedem Schritt erneut gegen den tatsächlichen GitHub-Stand geprüft.

73. WICHTIGE ABSCHLUSSREGEL

Abgeschlossene Module werden nicht ohne konkreten technischen Grund erneut verändert.

Das GPS-Modul gilt ab Version 2.5.0 als abgeschlossen.

Änderungen am GPS-Modul erfolgen nur bei:

* nachgewiesenem Fehler
* notwendiger Schnittstellenänderung
* notwendiger Core-Anpassung
* ausdrücklich gewünschter Erweiterung

Das Waters-Modul wird auf Grundlage des bestehenden committeden Standes und der Identity-Architektur als Master-Version fertiggestellt.

74. VERBINDLICHE ZIELARCHITEKTUR

Die langfristige CatchTrack-Architektur folgt diesem Grundprinzip:

User
↓
Identity Core
↓
user_id
↓
┌──────────────┬──────────────┬──────────────┬──────────────┐
│              │              │              │              │
Waters       Catcher        Photos        Settings       weitere
│              │              │              │              │
│              │              │              │              │
water_id       water_id       water_id       user_id        user_id
│              │              │
└──────────────┴──────────────┴──────────────┘

Waters bleibt dabei das zentrale Gewässer-Stammdatenobjekt.

Andere Fachinformationen werden über definierte Beziehungen angebunden.

Die Architektur darf nicht dadurch vereinfacht werden, dass unterschiedliche Fachinformationen dauerhaft in eine einzige große Waters-Tabelle integriert werden.

Ziel ist eine langfristig wartbare, erweiterbare und wiederverwendbare CatchTrack-Masterarchitektur.

75. VERBINDLICHE LANGFRISTIGE GESAMTARCHITEKTUR

CatchTrack wird langfristig als mehrschichtige Offline-First-Anwendung mit optionaler Cloud-Erweiterung aufgebaut.

Grundstruktur:

LOCAL APPLICATION
│
├── Core
│   ├── Identity
│   ├── Database
│   ├── Permissions
│   ├── Runtime
│   ├── Module Manager
│   └── weitere Core-Dienste
│
├── Fachmodule
│   ├── GPS
│   ├── Waters
│   ├── Catcher
│   ├── Fishing Spots
│   ├── Photos
│   ├── Weather
│   └── weitere Fachmodule
│
└── optionale Cloud-Anbindung
│
├── Synchronisation
├── Community
├── Fishing Events
├── Marketplace
├── globale Statistiken
├── Benutzer-/Tarifverwaltung
└── Updates

Die lokale Anwendung muss auch ohne Cloud-Verbindung grundsätzlich funktionsfähig bleiben.

Die Cloud erweitert CatchTrack, ersetzt aber nicht die lokale Kernarchitektur.

76. VERBINDLICHE ARCHITEKTUR FÜR ZUKÜNFTIGE ERWEITERUNGEN

Bei jeder zukünftigen technischen Erweiterung ist zu prüfen:

* Welche user_id benötigt die Funktion?
* Welche fachliche Objekt-ID wird benötigt?
* Welche bestehenden IDs können wiederverwendet werden?
* Welche Daten gehören lokal?
* Welche Daten können später synchronisiert werden?
* Welche Daten dürfen später veröffentlicht werden?
* Welche Daten müssen privat bleiben?
* Welche Permission bzw. welches Entitlement wird benötigt?
* Gehört die Funktion tatsächlich in das aktuelle Modul?
* Gibt es bereits eine zentrale Core-Schnittstelle?
* Wird eine Migration benötigt?
* Muss eine spätere Cloud-Schnittstelle berücksichtigt werden?

Es darf keine Funktion nur deshalb direkt in ein bestehendes Modul eingebaut werden, weil die Funktion fachlich mit diesem Modul zusammenhängt.

Fachliche Nähe ist nicht automatisch technische Modulverantwortlichkeit.

77. VERBINDLICHER GRUNDSATZ FÜR DIE WEITERE ENTWICKLUNG

CatchTrack wird Schritt für Schritt als vollständige Master-Architektur aufgebaut.

Dabei gilt:

prüfen
↓
verstehen
↓
Architektur festlegen
↓
vollständige Master-Dateien erstellen
↓
Working Copy
↓
Commit
↓
GitHub erneut prüfen
↓
Modul abschließen
↓
nächsten technisch erforderlichen Schritt ausführen

Es werden keine unnötigen Zwischenlösungen geschaffen, wenn eine saubere Master-Lösung bereits möglich ist.

Gleichzeitig werden zukünftige Funktionen nicht vorzeitig implementiert, solange ihre fachliche und technische Verantwortung noch nicht eindeutig definiert ist.

Ende AI_CONTEXT.md