CatchTrack – AI_CONTEXT.md

1. ZWECK DIESER DATEI

Diese Datei definiert die verbindlichen technischen Arbeitsregeln für die Weiterentwicklung von CatchTrack.

Sie dient als zentrale Arbeitsgrundlage für jede weitere Entwicklung.

Der tatsächlich vorhandene GitHub-Dateistand hat grundsätzlich Vorrang vor älteren Annahmen, Chatverläufen oder nicht mehr aktuellen Dokumentationen.

Die praktische Zusammenarbeit erfolgt über ChatGPT, Working Copy und GitHub.

⸻

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

⸻

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

⸻

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

⸻

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

⸻

6. AUSNAHME VOM CORE-FREEZE

Eine Änderung des Core-Masters ist nur zulässig, wenn eine konkrete technische Anforderung dies zwingend erforderlich macht.

Vor einer Core-Änderung muss ausdrücklich festgestellt werden:

CORE-ÄNDERUNG ERFORDERLICH

Die Änderung wird anschließend begründet und als eigener Arbeitsschritt behandelt.

⸻

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

⸻

8. DATABASE/SCHEMA.SQL – MASTER-REGEL

database/schema.sql ist das zentrale Basisschema für eine neue CatchTrack-Datenbank.

Es ist kein Modul-Schema.

Die Datei wird nicht für jedes neue Modul verändert.

Bereits vorhandene zentrale Datenstrukturen müssen wiederverwendet werden.

Wenn eine neue Datenbankstruktur für ein Modul tatsächlich erforderlich ist, wird dafür eine eigene Migration verwendet.

⸻

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

⸻

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

⸻

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

⸻

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

⸻

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

⸻

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

⸻

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

⸻

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

⸻

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

⸻

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

⸻

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

⸻

20. GPS → WATERS

Der bisherige Übergabepunkt lautet:

GPS
↓
waters:entries
↓
Waters-Modul

Das GPS-Modul ermittelt und speichert die Position.

Das Waters-Modul verwaltet die Gewässer.

Zukünftiger Master-Übergabepunkt:

GPS
↓
Positionsdaten
↓
Waters
↓
zentrale CatchTrack-Datenbank

Die endgültige Speicherung eines persönlichen Gewässers erfolgt im Waters-Datenmodell mit Zuordnung zum aktuellen Benutzer.

⸻

21. IDENTITY CORE – ZENTRALE BENUTZERIDENTITÄT

CatchTrack verwendet eine zentrale Benutzeridentität.

Die bereits vorhandene Datenbankstruktur mit users bildet die Grundlage der Benutzeridentität.

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

⸻

22. USER_ID ALS STANDARD FÜR PERSÖNLICHE DATEN

Daten, die eindeutig einem Benutzer gehören, müssen langfristig über user_id dem Benutzer zugeordnet werden.

Dies betrifft insbesondere:

* Waters
* Catches
* Fotos
* persönliche Einstellungen
* persönliche Fishing Spots
* weitere personenbezogene Fachmoduldaten

Eine bereits vorhandene zentrale user_id wird wiederverwendet.

Es werden keine parallelen Benutzer- oder Identifikationssysteme aufgebaut.

Bei neuen persönlichen Datenstrukturen ist grundsätzlich zu prüfen, ob eine user_id erforderlich ist.

Die Benutzerzuordnung erfolgt möglichst auf Datenbankebene über Foreign Keys und geeignete Indizes.

⸻

23. VERBINDLICHE USER-ID-PRÜFUNG BEI JEDEM MODUL

Bei jedem neuen oder zu überarbeitenden Fachmodul muss vor der Implementierung geprüft werden, ob die vom Modul verwalteten Daten einem Benutzer zugeordnet werden müssen.

Diese Prüfung ist verbindlicher Bestandteil der Modul-Bestandsaufnahme.

Dabei ist insbesondere zu prüfen:

* Ist der Datensatz persönlich?
* Kann der Datensatz von mehreren Benutzern unabhängig voneinander existieren?
* Muss der Datensatz später über den Identity Core gefiltert werden?
* Wird der Datensatz später mit Cloud-/Sharing-Funktionen verwendet?
* Wird der Datensatz für persönliche Statistiken benötigt?
* Kann der Datensatz in anonymisierten oder globalen Statistiken erscheinen?
* Besteht eine Beziehung zu einem bereits user_id-gebundenen Objekt?

Wenn die Daten benutzerbezogen sind:

user_id

wird von Anfang an in:

* Datenmodell
* Migration
* Foreign Keys
* Indizes
* Abfragen
* Speicherlogik
* Lade-/Anzeigeprozesse
* Bearbeitung
* Löschung
* Modul-Schnittstellen

berücksichtigt.

user_id darf nicht erst nachträglich ergänzt werden, wenn bereits erkennbar ist, dass die Daten persönlich sind.

Wenn die fachliche Zuordnung nicht eindeutig ist, darf nicht geraten werden.

In diesem Fall ist vor der Implementierung eine Rückfrage erforderlich.

user_id wird jedoch nicht blind in jede Tabelle aufgenommen.

Rein globale Stammdaten oder Daten, die fachlich keinem Benutzer gehören, benötigen keine künstliche Benutzerzuordnung.

⸻

24. USER-ID UND STATISTIKMODULE

Spätere Statistikmodule müssen die Benutzerzuordnung von Anfang an berücksichtigen.

Statistische Daten können unterschiedliche Ebenen besitzen:

Persönliche Statistik

user_id
↓
persönliche Auswertung

Anonymisierte globale Statistik

freigegebene Benutzerdaten
↓
Anonymisierung
↓
globale Statistik

Nicht-personenbezogene globale Statistik

globale Stammdaten
↓
globale Statistik

Bei der Entwicklung eines Statistikmoduls muss deshalb vorab geprüft werden, aus welcher Datenebene die Statistik gespeist wird.

Statistikmodule dürfen keine persönlichen Daten ohne entsprechende Benutzerzuordnung oder Freigabelogik aggregieren.

⸻

25. CLOUD- UND SHARING-ARCHITEKTUR

CatchTrack ist zunächst als Offline-Anwendung konzipiert.

Die Architektur muss jedoch von Anfang an eine spätere Cloud-Anbindung ermöglichen.

Die lokale Anwendung bleibt dabei die primäre Quelle der persönlichen Daten, solange keine andere Architektur ausdrücklich beschlossen wurde.

Spätere Cloud-Funktionen können insbesondere umfassen:

* Synchronisation
* persönliche Datensicherung
* freigegebene Gewässer
* freigegebene Fänge
* globale Statistiken
* Hitparaden
* Community-Funktionen
* Angeltreffen
* Pinnwand
* Marketplace
* weitere soziale Funktionen

Die spätere Cloud-Architektur darf nicht voraussetzen, dass lokale persönliche Daten bereits öffentlich sind.

⸻

26. DATENFREIGABE UND PRIVATSPHÄRE

Persönliche Daten werden grundsätzlich zunächst privat behandelt.

Eine spätere Cloud-Freigabe muss kontrolliert und benutzerbezogen erfolgen.

Der Benutzer muss perspektivisch festlegen können, welche Informationen öffentlich oder innerhalb der Community sichtbar werden.

Für öffentliche Benutzeridentität sind insbesondere folgende Darstellungen möglich:

* anonym
* user_id
* ausgewählter Benutzername
* ausgewählter Anzeigename

Die konkrete Auswahl und technische Umsetzung wird im späteren Identity-/Privacy-/Cloud-System festgelegt.

Persönliche Identitätsdaten dürfen nicht automatisch öffentlich gemacht werden.

⸻

27. CLOUD-DATEN UND GPS

Nicht jede lokale Information darf automatisch in die Cloud übertragen werden.

Insbesondere sensible oder hochpräzise Standortinformationen wie:

* aktuelle GPS-Position
* Home Location
* exakte persönliche Aufenthaltsposition

müssen gesondert behandelt werden.

Eine spätere Cloud-Funktion muss zwischen:

* intern benötigten Positionsdaten
* persönlichen Positionsdaten
* freigegebenen Positionsdaten
* anonymisierten/geografisch abstrahierten Daten

unterscheiden können.

⸻

28. GEWÄSSERDATEN UND CLOUD

Das Waters-Modul bleibt lokal und fachlich für die Gewässer-Stammdaten zuständig.

Eine spätere Cloud-Version kann freigegebene Gewässerdaten zentral erfassen.

Grundprinzip:

Lokales Waters
↓
user_id
↓
Benutzerfreigabe
↓
Cloud-Synchronisation
↓
globale/communityfähige Gewässerdaten

Die Cloud-Daten dürfen nicht als Ersatz für die lokale Waters-Datenstruktur in das Waters-Modul integriert werden.

Lokale und Cloud-Verantwortlichkeiten bleiben getrennt.

⸻

29. WATERS-MODUL – MASTER-ARCHITEKTUR

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

⸻

30. WATERS BLEIBT SCHLANK

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

⸻

31. CATCHER – FANGHISTORIE

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

⸻

32. FISHING SPOTS

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

⸻

33. FOTOS

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

⸻

34. WASSERBEZOGENE MODULBEZIEHUNGEN

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

⸻

35. GPS → WATERS → FACHMODULE

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

⸻

36. WATERS-MIGRATION

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

⸻

37. MULTILINGUALITÄT

Neue Module müssen multilingual vorbereitet werden.

Texte dürfen nicht unnötig fest in JavaScript oder HTML eingebaut werden.

Die vorhandene CatchTrackLanguageManager-Architektur ist zu verwenden.

Deutsch ist derzeit die Standardsprache.

Weitere Sprachen müssen später ergänzt werden können.

⸻

38. RUNTIME UND FEHLERBEHANDLUNG

Module müssen die vorhandene Runtime- und Fehlerarchitektur verwenden.

Insbesondere:

CatchTrackErrorHandler
CatchTrackRuntimeStatus
CatchTrackRuntimeStorage

Fehler dürfen nicht stillschweigend verschluckt werden.

Modulfehler müssen nachvollziehbar bleiben.

⸻

39. WIEDERVERWENDBARKEIT

Funktionen sollen möglichst so entwickelt werden, dass andere Module sie später verwenden können.

GPS stellt eine wiederverwendbare Positionsstruktur bereit.

Identity stellt eine wiederverwendbare Benutzeridentität bereit.

Waters stellt eine wiederverwendbare Gewässerreferenz über water_id bereit.

Andere Module sollen diese Daten verwenden können, ohne internen Modulcode zu duplizieren.

⸻

40. KEINE PARALLELENTWICKLUNG

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

⸻

41. ARBEITSREIHENFOLGE DER AKTUELLEN ARCHITEKTUR

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

⸻

42. KEINE VORZEITIGE AUSIMPLEMENTIERUNG ZUKÜNFTIGER MODULE

Die Architektur muss spätere Module ermöglichen.

Zukünftige Module werden jedoch nicht vorzeitig als Teil eines anderen Moduls implementiert.

Beispiel:

Waters darf water_id als zentrale Beziehung bereitstellen.

Waters implementiert aber nicht selbst:

* vollständige Fanghistorie
* Fishing-Spots-Verwaltung
* Fotoverwaltung
* Wetterhistorie
* Cloud-Community-Funktionen
* Marketplace
* Angeltreffen

Diese Funktionen werden später in ihren jeweiligen Modulen umgesetzt.

⸻

43. ARCHITEKTURZIEL

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
* Benutzerzuordnung bei persönlichen Daten
* kontrollierte Datenfreigabe für spätere Cloud-Funktionen

⸻

44. MODULREIHENFOLGE UND ABHÄNGIGKEITEN

Der aktuelle Entwicklungsstand wird nicht allein anhand einer historischen Modulliste bestimmt.

Vor Beginn eines neuen Moduls muss geprüft werden:

* bestehende Core-Abhängigkeiten
* bestehende Datenbankabhängigkeiten
* Benutzer-/Identity-Abhängigkeiten
* Schnittstellen zu bereits abgeschlossenen Modulen
* PROJECT_MODULE_PLAN.md
* tatsächlicher GitHub-Stand

Zusätzlich muss bei jedem Modul die Notwendigkeit einer user_id geprüft werden.

Ein Modul darf nicht nur deshalb vorgezogen oder fertiggestellt werden, weil eine ältere Dokumentation dies vorsieht.

Der tatsächlich erforderliche technische Unterbau hat Vorrang.

⸻

45. MASTER-DATEIEN

Bei der Entwicklung eines Moduls werden zusammengehörige Dateien möglichst gemeinsam als vollständige Master-Version erstellt.

Ziel:

* keine unnötigen Zwischenstände
* keine wiederholten Teilreparaturen
* konsistente Schnittstellen
* vollständige Abhängigkeiten
* klare Datenstrukturen
* langfristige Wiederverwendbarkeit
* frühzeitige Berücksichtigung absehbarer user_id-Abhängigkeiten

Eine Master-Version muss den bekannten zukünftigen Architekturanforderungen Rechnung tragen, ohne zukünftige Fachmodule vorzeitig vollständig zu implementieren.

⸻

46. VOLLSTÄNDIGE DATEIEN STATT PATCHES

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

⸻

47. VORHANDENE DATEIEN

Eine vorhandene Datei wird nicht zwanghaft geflickt.

Wenn die Struktur sinnvoll ist:

→ gezielt integrieren

Wenn sie beschädigt, widersprüchlich, veraltet oder unnötig kompliziert ist:

→ vollständige Master-Version erstellen

Gültige bestehende Funktionen und Informationen dürfen dabei nicht verloren gehen.

⸻

48. AUSGABEFORMAT FÜR NEUE DATEIEN

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

⸻

49. COPYBLOCK-REGEL

Wenn mehrere Dateien gleichzeitig erstellt oder ersetzt werden müssen, werden sie möglichst gemeinsam in einer Ausgabe geliefert.

Beispiel:

gps.html
gps.css
gps.js
module.json

werden möglichst gemeinsam ausgegeben.

Diese Regel gilt verbindlich für alle weiteren Entwicklungsarbeiten.

⸻

50. ARBEITSABLAUF: CHATGPT → WORKING COPY → GITHUB

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

⸻

51. OK-REGEL

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

Es ist nicht erforderlich, den Benutzer über fehlenden direkten GitHub-Schreibzugriff zu informieren.

Der festgelegte Arbeitsablauf ist:

ChatGPT erstellt vollständige Dateien
↓
Benutzer übernimmt sie in Working Copy
↓
Working Copy committet nach GitHub
↓
ChatGPT kontrolliert GitHub

Kein nächster Entwicklungsschritt wird als abgeschlossen dargestellt, wenn die erforderliche Kontrolle fehlgeschlagen ist.

⸻

52. KOMMUNIKATIONSREGEL BEI FORTLAUFENDER ENTWICKLUNG

Die technische Zusammenarbeit soll ohne unnötige Wiederholungen und ohne unnötige Zwischenbestätigungen erfolgen.

Nach einem erfolgreichen OK wird der nächste gemäß Architektur vorgesehene Arbeitsschritt ausgeführt.

Es werden keine bereits geklärten Punkte erneut abgefragt.

Längere Erklärungen werden nur gegeben, wenn sie für eine technische Entscheidung erforderlich sind oder ausdrücklich verlangt werden.

Bei einer eindeutig festgelegten technischen Reihenfolge wird diese ohne unnötige Rückfrage abgearbeitet.

⸻

53. AKTUELLER PROJEKTSTATUS

Stand: 10.08.2026

Abgeschlossen:

* Weather-Modul
* GPS-Modul Version 2.5.0
* bisheriger Waters-Entwicklungsstand wurde committed
* Identity Core ist vorhanden
* zentrale users-Struktur ist vorhanden
* app.js wurde als Core-Master geprüft und auf den aktuellen Stand gebracht

Aktueller technischer Übergang:

GPS
↓
Identity Core
↓
Waters Master

Nächste vorgesehene Arbeitsschritte:

1. aktuelle Identity-relevante Core-, Datenbank- und Konfigurationsdateien vollständig prüfen
2. vorhandene users-Struktur und bestehende Benutzerbeziehungen prüfen
3. Identity Core als vollständige Master-Version prüfen und gegebenenfalls abschließen
4. Identity Core testen
5. Waters-Datenbankmigration mit user_id entwickeln bzw. korrigieren
6. bestehende Waters-Daten berücksichtigen
7. Waters-Dateien als vollständige Identity-kompatible Master-Version entwickeln
8. Waters testen
9. GitHub-Stand über Lesen kontrollieren
10. Identity und Waters als abgeschlossenen Architekturstand dokumentieren
11. danach mit dem nächsten technisch vorgesehenen Modul fortfahren

⸻

54. WICHTIGE ABSCHLUSSREGEL

Abgeschlossene Module werden nicht ohne konkreten technischen Grund erneut verändert.

Das GPS-Modul gilt ab Version 2.5.0 als abgeschlossen.

Änderungen am GPS-Modul erfolgen nur bei:

* nachgewiesenem Fehler
* notwendiger Schnittstellenänderung
* notwendiger Core-Anpassung
* ausdrücklich gewünschter Erweiterung

Das Waters-Modul wird auf Grundlage des bestehenden committeden Standes und der neuen Identity-Architektur als Master-Version fertiggestellt.

⸻

55. VERBINDLICHE ZIELARCHITEKTUR

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

⸻

56. VERBINDLICHE REGEL FÜR ZUKÜNFTIGE CLOUD-, COMMUNITY- UND STATISTIKFUNKTIONEN

Die spätere CatchTrack-Cloud wird nicht als unabhängiges zweites Fachsystem entwickelt, sondern baut auf den lokalen Master-Daten und den definierten Fachobjekten auf.

Dazu können später insbesondere gehören:

* globale Gewässerdaten
* globale Fangstatistiken
* Hitparaden
* Köderstatistiken
* Zeit-/Ort-Statistiken
* Community-Funktionen
* Angeltreffen
* Pinnwand
* Marketplace
* Benutzerprofile
* Synchronisation
* optionale Datensicherung

Die hierfür benötigten lokalen Daten müssen bereits bei der Entwicklung der jeweiligen Fachmodule so strukturiert werden, dass sie später eindeutig zugeordnet und abgefragt werden können.

Insbesondere sind dafür grundsätzlich zu berücksichtigen:

user_id
water_id
catch_id
fishing_spot_id
photo_id

soweit das jeweilige Fachobjekt diese Beziehung fachlich benötigt.

Beispiele:

User
↓
Catch
├── user_id
├── water_id
├── fish_id
├── bait_id
└── weitere Fangdaten

Dadurch können spätere Statistikmodule beispielsweise Auswertungen erstellen wie:

* persönliche Fangstatistik
* Fangstatistik pro Gewässer
* Fangstatistik pro Fischart
* Fangstatistik pro Köder
* Fangstatistik nach Uhrzeit
* Fangstatistik nach Zeitraum
* anonymisierte globale Statistiken

Eine solche spätere Auswertung darf nicht dazu führen, dass die ursprünglichen Fachmodule ihre Daten redundant duplizieren müssen.

Die Statistik greift auf die vorhandenen relationalen Daten zu.

⸻

57. VERBINDLICHE FREIGABEARCHITEKTUR FÜR CLOUD-DATEN

Persönliche lokale Daten und öffentlich freigegebene Cloud-Daten sind architektonisch zu unterscheiden.

Grundprinzip:

Lokale persönliche Daten
↓
Identity / Privacy
↓
Benutzerfreigabe
↓
Cloud-Synchronisation
↓
öffentliche / Community-Daten

Die spätere Freigabelogik muss ermöglichen, dass Benutzer festlegen können, welche Daten veröffentlicht werden.

Insbesondere können perspektivisch unterschiedliche Sichtbarkeitsstufen erforderlich sein:

PRIVATE
↓
nur Benutzer
ANONYM
↓
öffentliche Daten ohne persönlichen Namen
USER_ID
↓
öffentliche technische Benutzerreferenz
USERNAME
↓
öffentlicher ausgewählter Benutzername
DISPLAY_NAME
↓
öffentlicher Anzeigename

Die konkrete technische Implementierung dieser Stufen wird erst bei der Entwicklung des Identity-/Privacy-/Cloud-Systems festgelegt.

Kein Fachmodul darf eine eigene parallele Sichtbarkeits- oder Identitätslogik entwickeln.

⸻

58. VERBINDLICHE REGEL FÜR SPÄTERE ADMINISTRATION

CatchTrack soll langfristig über ein zentrales Administrationssystem verwaltet werden können.

Das spätere Admin-Modul bzw. die Cloud-Administration kann unter anderem verwalten:

* Benutzer
* Benutzerstatus
* Berechtigungen
* Pakete/Tarife
* Zusatzmodule/Add-ons
* Freigaben
* Community-Funktionen
* Marketplace-Berechtigungen
* Systemkonfiguration
* Inhalte
* Updates
* weitere administrative Einstellungen

Persönliche Benutzerdaten dürfen dabei nicht ungeordnet direkt aus einzelnen Fachmodulen administriert werden.

Die Administration muss über definierte Core-/API-/Cloud-Schnittstellen erfolgen.

⸻

59. VERBINDLICHE REGEL FÜR PAKETE UND ADD-ONS

CatchTrack kann langfristig unterschiedliche Funktionspakete und optionale Add-ons anbieten.

Beispielsweise können Funktionen wie:

* Marketplace
* erweiterte Community-Funktionen
* Cloud-Speicherung
* erweiterte Statistiken
* zusätzliche Synchronisation
* weitere Premium-Funktionen

über Pakete oder Add-ons freigeschaltet werden.

Die technische Architektur der Fachmodule darf jedoch nicht von einer einzelnen Tarifstufe abhängig implementiert werden.

Berechtigungen müssen zentral über die vorhandene bzw. zukünftige Permission-/Subscription-Architektur geprüft werden.

Es darf keine fest codierte Tariflogik in einzelnen Fachmodulen entstehen.

⸻

60. VERBINDLICHE REGEL FÜR UPDATES

CatchTrack soll langfristig eine kontrollierte Update-Funktion besitzen.

Die Offline-Version bleibt funktionsfähig, auch wenn keine Cloud-Verbindung vorhanden ist.

Wenn Cloud-Funktionen aktiviert sind, kann die Anwendung beim Start perspektivisch prüfen:

App-Start
↓
Cloud erreichbar?
↓
Update-Information verfügbar?
↓
Benutzer informieren
↓
Update nach Benutzerentscheidung

Updates dürfen nicht ungeprüft oder unkontrolliert die lokale Datenbank oder persönliche Daten überschreiben.

Datenbankänderungen müssen weiterhin über das bestehende migrationsbasierte System erfolgen.

⸻

61. ABSCHLIESSENDES ARCHITEKTURPRINZIP

CatchTrack wird nach folgenden langfristigen Grundsätzen entwickelt:

Identity Core
↓
user_id
↓
Fachobjekte
↓
relationale Beziehungen
↓
lokale persönliche Daten
↓
optionale Benutzerfreigabe
↓
Cloud
↓
Community / Statistik / Marketplace / Treffen

Dabei gilt verbindlich:

* GitHub ist die technische Wahrheit.
* Nicht raten.
* Keine unnötigen Änderungen an abgeschlossenen Dateien.
* Keine stillschweigenden Löschungen.
* Keine parallelen Datenbanken.
* Keine parallelen Identitätssysteme.
* Keine unnötige Datenredundanz.
* Persönliche Daten erhalten eine user_id.
* Jedes neue Modul wird auf seine user_id-Notwendigkeit geprüft.
* Bei unklarer Benutzerzuordnung wird vor der Implementierung nachgefragt.
* Statistikmodule verwenden bestehende Datenbeziehungen statt redundanter Kopien.
* Cloud-Daten werden nur über definierte Freigaben veröffentlicht.
* GPS-, Home- und andere sensible Positionsdaten werden gesondert geschützt.
* Fachmodule bleiben fachlich getrennt.
* Core-Schnittstellen werden wiederverwendet.
* Datenbankänderungen erfolgen ausschließlich über Migrationen.
* Automatisch ermittelte Daten bleiben korrigierbare Vorschläge.
* Vollständige Master-Dateien statt Patch-Fragmente.
* Working Copy übernimmt Integration und Commit.
* Nach OK wird der aktuelle GitHub-Stand geprüft und anschließend ohne unnötige Rückfrage der nächste vorgesehene Arbeitsschritt ausgeführt.

Ende AI_CONTEXT.md