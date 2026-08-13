# AGENT_REVIEW

## Datum
2026-08-13

## Auftrag
Review-First-Regel und Ist-/Gap-Analyse für die P0-Lücke im generischen Permission-/Package-/Module-/Feature-/UI-Vertrag. Die Aufgabe bleibt dokumentarisch und ohne produktive Implementierung.

## Ausgangspunkt
Die bisherige Analyse hat Variante A – Policy-first – als grundsätzlich geeigneten Ansatz identifiziert. Die finalisierte Lösung ist jetzt eine Hybrid-Architektur aus Policy-first und den empfehlenswerten deklarativen Elementen der Variante C.

## Tatsächlicher Repository-Zustand
- Der Core ist eingefroren und dokumentiert stabil.
- Die generische Plattformarchitektur ist im Projektkontext klar definiert.
- Die vorhandene Implementierung enthält Basisstrukturen, aber noch keine vollständig neutrale Policy-/Package-/UI-Architektur.
- Die P0-Lücke betrifft die Trennung von Package, Permission, Module- und Feature-State sowie UI-Sichtbarkeit.
- Es wurde keine technisch bessere Lösung als die Hybrid-Architektur erkannt.

## Bisherige Sichtweise kritisch geprüft
Die Diskussion um Variante A und Variante C war zutreffend: Variante A ist die stabilste Sicherheitsbasis, Variante C liefert die deklarative Dynamik für Menü- und Modulkonstruktion. Variante B bleibt unzureichend, weil sie echte Autorisierung mit UI-Sichtbarkeit vermischt.

## Verworfenes Modell
### Variante B – UI-first visibility model
Verworfen, weil:
- echte Berechtigungen und UI-Sichtbarkeit werden vermischt
- manipulierbare UI-Checks können Sicherheitsfehler erzeugen
- spätere Wiederverwendung und Store-Modellierung werden dadurch erschwert
- Paketwechsel und Downgrades werden fehleranfälliger

## Finalisierte Hybridarchitektur
### Grundprinzip
- Policy-first für die echte Autorisierung
- deklarative Modul- und Feature-Definition für die Plattform
- UI als Render-/Visibility-Schicht, nicht als Autorität

### Zentrale Regel
Package und Permission sind strikt getrennt. Der User-Kontext ist abgeleiteter Laufzeitzustand, nicht die autoritative Quelle.

### Effektive Autorisierung
Package Entitlements

+

Permission Grants / Denials / Policies

+

Module State

+

Feature State

→

Effective Authorization

### UI-Hierarchie
Effective Authorization

→ UI Visibility

UI Visibility darf niemals als Sicherheitsmechanismus dienen.

## Technische Begründung
Die Hybridarchitektur ist das beste Gleichgewicht zwischen:
- Sicherheit
- Wiederverwendbarkeit
- modularer Deklaration
- dynamischer Menürepräsentation
- neutralem Framework ohne CatchTrack-Hardcoding

Sie verhindert das zentrale Problem der früheren Vorschläge: die Verwechslung von Berechtigung und Sichtbarkeit.

## Auswirkungen auf Core
- keine Core-Änderung
- Core bleibt eingefroren
- generische Architektur wird über Policy-/Service-/Registry-Schichten abgebildet

## Auswirkungen auf Module
- Module deklarieren ihre eigenen capabilities
- Module dürfen nicht die Policy-Engine umgehen
- Module liefern Menübeiträge, aber die Plattform entscheidet anhand des effektiven Zugriffs

## Auswirkungen auf Sicherheit
- starke Verbesserung gegenüber UI-first Ansätzen
- API- und Service-Zugriffe durchlaufen dieselbe Policy-Engine
- UI-Visibility ist nur anzeigebezogen und niemals autoritativ

## Auswirkungen auf Wartbarkeit und Wiederverwendbarkeit
- besser als Variante B
- neutral genug für spätere zweite App oder Store-Modelle
- erweitert die generischen Plattformverträge ohne CatchTrack-Hardcoding

## Risiken
- Package-/Permission-Matrix muss sauber modelliert werden
- User-Context-Caches müssen korrekt invalidiert werden
- Policy-Engine-Ownership muss klar definiert sein
- Upgrade-/Downgrade- und Deinstallationsregeln müssen auditierbar sein

## Offene Punkte
- konkrete Package-/Tier-Matrix
- Eigentümer der zentralen Policy Engine
- Override-Regeln für Benutzer oder Rollen
- Abstimmung zwischen default visibility und effective authorization
- spätere Schnittstelle für Cloud-/Server-/Offline-Betrieb

## Empfehlung
Empfohlen wird die finale Hybridarchitektur:
- Policy-first für echte Autorisierung
- deklarative Modul-/Feature-/Menüdefinitionen für die Plattform
- UI als Sichtbarkeitsfilter, nicht als Autorität

Diese Entscheidung setzt den bisherigen Review- und Architekturprozess logisch fort und hält die generische Plattform neutral, sicher und zukunftsfähig.

## Entscheidung
Es wurde keine bessere Lösung als die Hybrid-Variante erkannt. Die Architektur bleibt design-only und nicht implementiert.

# INDEPENDENT ARCHITECTURE ASSESSMENT

## Gesamturteil
Die Architektur ist grundsätzlich in die richtige Richtung, aber sie ist für den aktuellen Projektstand und für ein einzelnes Entwicklerteam zu breit und theoretisch. Die zentrale Idee ist gut: klare Trennung zwischen Package, Permission, Feature-Zugriff und UI-Sichtbarkeit. Der eigentliche Fehler der bisherigen Ausarbeitung ist jedoch nicht die Grundannahme, sondern der Grad der Abstraktion: Es werden bereits sehr viele generische Schichten, Policies, Deklarationen und Laufzeitmodelle beschrieben, obwohl das Repository noch keine belastbare Produkt- und Datenmodellbasis für diese Genauigkeit hat.

Die Architektur trifft die richtigen philosophischen Ziele, aber sie ist noch nicht so einfach, klar und restriktiv genug, dass sie ohne spätere Überforderung in einem kleinen Team realisiert werden könnte.

## Kategorie
B – Konzept gut, gezielt vereinfachen

## Wichtigste Stärken
- Die Trennung zwischen Package und Permission ist richtig und notwendig.
- Permission ≠ UI Visibility ist die wichtigste und korrekteste Aussage der gesamten Architektur.
- Die klare Vorstellung einer Plattform-/Framework-Schicht separat von CatchTrack-Anwendung und Fachmodulen ist plausibel und sinnvoll.
- Die Lebenszyklus- und Modul-Deklarationsideen sind besser als ein reines UI-Flag-Design.
- Die Zielrichtung auf zukünftige Wiederverwendbarkeit ist intelligent, sofern sie nicht in Übermodellierung ausartet.

## Wichtigste Schwächen
- Die Architektur versucht bereits, einen generischen Plattformkern mit vielen Schichten zu definieren, obwohl noch kein konkreter Produktkontext mit realen Features, Datenflüssen und Nutzungsszenarien belastbar modelliert ist.
- Die Darstellung von Effective Authorization als sehr formalisiertes System ist deutlich komplexer als das tatsächliche Projekt benötigt.
- Der Versuch, User-Kontext und Policy-Kontext gleichzeitig als Series of truth zu behandeln, erzeugt den Eindruck, dass zwei Autoritätsquellen existieren. Das ist ein Architekturproblem.
- Die deklarative Module- und Menü-Definition wird zu einem Meta-Framework, obwohl die erste Anwendung noch einfachere strukturelle Regeln braucht.
- Die Open-Points sind noch stark genug, dass die Architektur nicht als Sicherheit und Referenzmodell für die erste Implementierung reif ist.

## 5 größte Risiken
1. Übermodellierung des Systems vor dem Produktbedarf
   - Das Projekt riskiert, eine übergenerische Plattformarchitektur zu bauen, die niemand in der Praxis vollständig beherrscht.

2. Mehrere Autoritätsquellen für Zugriffsentscheidungen
   - Wenn User-Context, Package, Permission, Module State und Feature State gleichzeitig als Autorität wirken, entsteht ein undurchsichtiges Entscheidungsmodell.

3. Policy-Engine-Ownership bleibt unklar
   - Ohne klare Verantwortlichkeit verschiebt sich die eigentliche Entscheidungslogik in unterschiedliche Module und UI-Schichten.

4. UI- und Autorisierungslogik werden in der Theorie getrennt, aber in der Praxis leicht wieder vermischt
   - Das ist das größte Sicherheitsrisiko bei modularen UI-Registern und deklarativen Menüeinträgen.

5. Zukunftsarchitektur ohne belastbare aktuelle Produktbasis
   - Die Architektur ist für spätere App- und Store-Szenarien gut formulierbar, aber für ein kleines Projekt ohne genaue Implementierungsbasis möglicherweise zu groß und zu langsam.

## Vergleich mit modernen Architekturansätzen
- RBAC / ABAC: Die generische Richtung ist im Kern verwandt mit RBAC/ABAC, aber die aktuelle Ausarbeitung ist deutlich dichter und formalisiert als praktisch nötig.
- CASL / policy-based authorization libraries: Die Architektur hat Ähnlichkeit mit Capability- und Policy-Modellen, allerdings ohne den starken Bezug auf einen konkreten Produkt- und Permissionskontext.
- Clean Architecture: Das Ziel, Plattform, Anwendung und Fachmodule sauber zu trennen, entspricht grundsätzlich der Clean-Architecture-Idee.
- Domain-Driven Design: Der Ansatz liegt in der richtigen Richtung, aber die Plattform- und Feature-Schicht ist im aktuellen Stand zu generalisiert und sollte stärker durch echte Domänen- und Capability-Modelle geführt werden.
- Micro-Frontend / Plug-in architecture: Die deklarative Modul- und Menü-Schnittstelle ist technisch nachvollziehbar, aber für dieses Projekt deutlich komplexer als erforderlich.

Wenn man moderne Ansätze ernst nimmt, dann ist die beste Variante keine „vollständig generische Policy-Metawelt“, sondern ein klarer, kleiner Capability- und Policy-Layer mit klaren Regeln, strengem UI-Rendering und einer einfachen Module-Declaration.

## 3 Dinge, die ich anders machen würde
1. Die Policy Engine würde ich deutlich kleiner und direkter halten
   - nur: user, package, module, feature, deny/allow, dependency
   - keine überzogenen Meta-Schichten mit „effective authorization as a full middleware system“

2. Der User-Kontext würde ich als reinen Snapshot definieren
   - nicht als eine zweite Wahrheit
   - immer neu aus Package + Permission + Module/Feature State berechnen und sofort invalidieren

3. Die deklarativen Module würden ich auf Capability-Definitionen begrenzen
   - keine übermäßige Menü-Meta-Formalität als Kernarchitektur
   - Menübeiträge nur als ein optionales Rendering-Interface, nicht als Teil der Autorisierung

## 5 Dinge, die ich beibehalten würde
1. Package und Permission strikt trennen
2. Permission ≠ UI Visibility
3. klare Trennung von Plattform, Anwendung und Fachmodulen
4. modulare deklarative Capability-Definitionen
5. Module Lifecycle als Plattformkonzept mit klaren Zuständen

## Realisierbarkeit für ein einzelnes Entwicklerteam
Die Architektur ist für ein einzelnes Entwicklerteam nur dann realisierbar, wenn sie stark reduziert wird. Als voll ausformulierter, generischer, deklarativer Policy-Metastack ist sie unrealistisch. Als kleiner, klar definierter Capability- und Policy-Layer mit klarer Ownership und wenigen Regeln ist sie sehr gut machbar.

Der Schlüssel ist: nicht die Architektur unendlich verallgemeinern, sondern die erste reale Produktlogik sauber modellieren und nur das Absolute als Plattformvertrag festschreiben.

## Langfristige Wiederverwendbarkeit
Die langfristige Wiederverwendbarkeit ist gut, aber nur unter einer Bedingung: Die Plattform muss so abstrakt sein, dass sie allgemeine Capabilities beschreibt, aber nicht so komplex, dass sie den eigentlichen Produktbau blockiert. Aktuell ist die Wiederverwendbarkeit theoretisch hoch, praktisch aber noch durch zu viel Abstraktion belastet.

## Konkrete Empfehlungen
1. Wichtigste Änderung: Policy Engine deutlich kleiner machen
   - Verantwortung klarer halten
   - keine Mehrfach-Quellen der Autorität

2. Package- und Permission-Modelle weiter vereinfachen
   - Package = contract
   - Permission = effective authorization decisions
   - keine Überlagerung in einem gemeinsamen Modell

3. UI-Menü als reines View-Interface behandeln
   - Deklarative Menüeinträge erlauben, aber nicht als Autoritätsquelle nutzen

4. Cache- und Snapshot-Invalidierung explizit definieren
   - bei Paketwechseln, Sessionwechseln, Downgrades und Reaktivierungen

5. Preview-/Beta-Features als explicit feature states definieren
   - nicht als mystische exception layer in der allgemeinen Policy

## Offene Punkte
- eigentliche Ownership der Policy Engine
- Regeln für individuelle Overrides vs. Package-Defaults
- Preview-/Beta-Features mit klarer Statuslogik
- spätere API-/Service-Schnittstelle ohne unkontrollierte App-Abhängigkeiten
- konkrete Package-/Permission-Matrix für ein wirkliches Produktdesign

## Fazit
Die Architektur ist auf dem richtigen Weg, aber sie ist in der aktuellen Form zu formalisiert und zu breit für die reale Projektgröße. Die Grundidee ist stark, aber die Umsetzung muss mit einem klaren „less is more“-Ansatz erfolgen. Die richtige Version ist kein riesiges Meta-Framework, sondern eine kleine, rigorose Capability-Policy-Schicht mit klarer Autorität, einfachen Regeln und einem starken UI-Filter.

Das ist die beste Gesamtsicht, die auf Basis des tatsächlichen Repository-Zustands und ohne die bisherige Entscheidung als Autorität zu übernehmen, für eine realistische, sichere und zukunftsfähige Architektur möglich ist.

# BACKUP AND RESTORE STRATEGY

## Zielstellung
Das Ziel ist kein "guter Stand zum späteren Weiterarbeiten", sondern ein echter 1:1-Rückfallpunkt des aktuellen Projektzustands. Für dieses Repository muss später exakt rekonstruierbar sein:
- vollständiger Projektordner inklusive versteckter Dateien und Metadaten
- Git-Status mit Commit-/Tag-Zustand
- zustandsspezifische lokale Informationen wie Konfigurationen und Hilfsdateien
- vollständiger Reset auf den zuvor gesicherten Zustand ohne Informationverlust

## Relevanter Repository-Kontext
Das Projekt ist ein lokales Browser-/Modul-Projekt in Codespaces mit:
- Git-Repository mit .git-Verzeichnis
- relevanten Projektdateien im Root-Verzeichnis
- lokaler Entwicklungs- und Worktree-Kontext
- .gitignore mit ignorierten Dateitypen wie .env, node_modules, build-Outputs, Logs, Caches und lokale Entwicklungsdaten
- möglich begrenzte, aber relevante versteckte Dateien wie .vscode, .env, lokale Konfigurationsdateien und Worktree-spezifische Daten

Das ist genau der Fall, in dem eine reine Git-Logik nicht ausreicht, wenn der gewünschte Backup-Anspruch die vollständige Projekt- und Arbeitsumgebung betrifft.

## Variante A – Vollständige 1:1-Dateikopie des gesamten Projektordners
### Vorteil
- enthält genau den aktuellen Dateizustand des Ordners inkl. versteckter Dateien, sofern korrekt kopiert
- funktioniert für vollständigen Reset auf einen beliebigen kompletten Stand
- sehr robust, wenn das Projekt vollständig in einen Archivordner oder eine externe Kopie verschoben wird
- einfach verständlich und gut rekonstruierbar

### Nachteil
- nur dann wirklich exakt, wenn die Kopie alle versteckten Dateien und Symlinks mitnimmt
- .git-Verzeichnis und Git-Status sind nur dann vollständig enthalten, wenn die Kopie das gesamte Repository inklusive .git übernimmt
- untracked, ignorierte und lokale Laufzeitdateien können dabei mitkopiert werden, auch wenn sie in einem späteren Wiederherstellungsfall nicht erwünscht sind
- es besteht das Risiko, dass ein einfacher Dateiauszug oder ZIP-Export die Details nicht exakt wiederherstellt
- bei lokalen Konfigurationen oder Secrets kann die Kopie unbeabsichtigt sensible Informationen mit enthalten

### Bewertung
Als reine Methode ist Variante A nur dann wirklich sauber, wenn der vollständige Folder inklusive .git, versteckter Dateien, Symlinks und Betriebssystemdetails 1:1 archiviert wird. Wenn nicht, ist sie ungenau.

## Variante B – Git Commit + Tag
### Vorteil
- sehr sauber und nachvollziehbar
- gut für source-controlled Änderungen
- erleichtert Wiederherstellung zu einem bestimmten Commit oder Tag
- leicht über GitHub oder lokal rekonstruierbar

### Nachteil
- kein vollständiger Ersatz für den kompletten Arbeitszustand
- Git speichert keine untracked oder ignorierten lokalen Dateien wie .env, node_modules, .cache, build-Ausgaben, lokale Laufzeit- und Entwicklungskonfigurationen
- Git kann den tatsächlichen Dateizustand des Working Tree und die uncommitteten lokalen Anpassungen nicht "sichtbar" als 1:1-Snapshot reproduzieren, wenn sie nicht committed oder als Tag markiert wurden
- Git allein ist nicht identisch zu einer kompletten Dateikopie des aktuellen Projektordners
- selbst bei einem Tag ist die Wiederherstellung nicht unbedingt identisch zu dem Zustand der Arbeitsumgebung im Codespace, weil lokale Dev-Dateien, Cache und Generator-Ausgaben nicht Teil des Git-Zustands sind

### Bewertung
Variante B ist eine sehr wichtige und notwendige Komponente, aber für den Anspruch "aktuellen Zustand exakt sichern und vollständig auf diesen Zustand zurückkehren" ist sie zu unvollständig.

## Variante C – Git Commit + Tag + vollständige lokale Dateikopie
### Vorteil
- kombiniert die Best-Practice von Git mit dem vollständigen Dateisnapshot
- lässt sich exakt auf den Git-Stand zurücksetzen
- liefert zusätzlich einen 1:1-Dateisatz des kompletten Projektordners, inklusive versteckter Dateien, sofern korrekt kopiert
- sehr geeignet für einen späteren Reset auf den Ausgangszustand
- erfasst gleichzeitig Quellen, Konfigurationen, lokale Arbeitsdaten und verteilte Projektmetadaten

### Nachteil
- die Kopie kann sensible Dateien, lokale Konfigurationen oder Secrets mit aufnehmen
- bei großen Projekten ist die Größe höher
- es muss klar definiert sein, welche Dateien bewusst ausgeschlossen werden, sonst kann die Backup-Kopie zu viel und zu unsicher werden
- die Wiederherstellung erfordert Sorgfalt: Kopie + Git-Reset + ggf. lokale Konfigurationsdateien wiederherstellen

### Bewertung
Für dieses konkrete Repository ist Variante C die zuverlässigste Kombination. Sie erfüllt am ehesten die Anforderung „aktueller Zustand exakt sichern und bei Bedarf vollständig auf diesen Zustand zurückkehren“.

## Variante D – Empfohlene zusätzliche Sicherheitsvariante
### Vorschlag
Git-Tag + vollständige verknüpfte Archivkopie des Projektordners + separater Export sensibler lokaler Dateien in einem gesicherten, bewusst geteilten Bereich.

### Vorteil
- klare Trennung zwischen reproduzierbarem Quellcode und sensiblen lokalen Daten
- verhindert, dass Secrets versehentlich im Ordnerbackup landen
- erleichtert Recovery in Codespace oder Working Copy

### Nachteil
- höherer administrativer Aufwand
- erfordert gepflegte Regeln für Sicherungstypen und Entsorgung von Secrets

### Bewertung
Dies ist für ein echtes Projekt mit lokalen .env-, Cache- und IDE-Dateien die beste operationalisierte Version. In der Praxis ist dies praktisch Variante C mit einer gesicherten Secret-Strategie.

## Kritische Prüfung: Was genau in eine exakte Sicherung gehört
Für ein vollständiges Backup des aktuellen Zustands müssen mindestens diese Bereiche berücksichtigt werden:
- gesamtes Projektverzeichnis inklusive Root-Dateien und Unterordner
- versteckte Dateien und Ordner, insbesondere .git, .vscode, .env, .env.*, .npmrc.local, .idea, .cache
- Git-Referenzen, Commits, Tags und Index-Zustand, also das komplette .git-Verzeichnis
- lokale Arbeitsdateien, die nicht von Git erfasst werden
- generierte Dateien, sofern sie Teil des aktuellen Zustands sind
- lokale Entwicklungsdateien, die zur Laufzeit oder für den Code-Run nötig sind
- Dateirechte und Symlinks, sofern im Codespace bzw. auf der Zielmaschine relevant

## Was nicht identisch zu Git ist
Git speichert nicht automatisch den kompletten Arbeitsordnerzustand. Das gilt besonders für:
- untracked Dateien
- ignorierte Dateien
- lokale kontextuelle Konfigurationsdateien
- generierte oder temporäre Laufzeitdaten
- IDE-/Editor-Dateien
- Cache und build-Artefakte
- lokales Secret-Handling

Damit ist eine Wiederherstellung nur aus Git nicht identisch zu einer vollständigen Dateikopie. Git ist eine exakte Quelle für den Source-Stand, aber kein vollständiger Ersatz für die Arbeitsumgebung.

## .gitignore und lokale Zustände im konkreten Repository
Das aktuelle .gitignore zeigt genau, welche Elemente bewusst außerhalb der Git-Pflege bleiben:
- .env, .env.*
- node_modules/
- .npm/
- build/, dist/, out/
- coverage/
- cache-Verzeichnisse
- .vscode/* mit Auswahl von wichtigen Dateien
- *.local
- *.sqlite-shm, *.sqlite-wal
- terminal.md

Das bedeutet: Ein reiner Git-Snapshot würde diese Dateien nicht erfassen. Für den Anspruch eines vollständigen Rückfallpunktes müssen sie entweder als bewusst separat gesichert oder als Teil des kompletten Ordner-Backups mit archiviert werden.

## Sicherheits- und Risikofragen
### Secrets
- .env und .env.* können Schlüssel, Tokens und lokale Zugangsdaten enthalten
- .npmrc.local kann private Paket-Registrierungskonfigurationen enthalten
- lokale App-Konfigurationen können sensible Werte enthalten

Diese Dateien dürfen nicht ungeprüft in einem allgemeinen Backup landen, wenn sie trotz Sicherung nicht mehr in der Umgebung vorhanden sein dürfen. Für eine saubere Strategie müssen diese Informationen entweder bewusst mitgesichert und geschützt werden oder beim Restore gezielt nachgeführt werden.

### Generierte Dateien
- build/, dist/, out/, coverage/ und node_modules/ sind in diesem Repository bewusst ignoriert
- sie sind normalerweise nicht Teil der source-of-truth, sondern Laufzeit-/Buildzustände
- sie können bei einer vollständigen Wiederherstellung als verzichtbar gelten, wenn das Ziel nur der Quellcode- und Repository-Stand ist
- sie müssen trotzdem berücksichtigt werden, wenn der Prozess den exakten Arbeitszustand einer konkreten Entwicklungsumgebung abbilden soll

### Symlinks, Dateirechte und Laufzeitumgebung
- in einem normalen Git-/Codespace-Kontext sind Symlinks und Dateirechte zwar selten, aber trotzdem relevant
- werden sie bei einer Ordnerkopie nicht korrekt übernommen, verliert man teilweisen Projektkontext
- eine Archive mit cp -a oder rsync -a ist hier deutlich besser als ein normaler ZIP-Export

## Empfehlung für dieses konkrete Repository
Für dieses spezifische Repository ist die zuverlässigste Methode:

1. Git-Stand sichern via Commit oder Tag, damit der source-controlled Zustand reproduzierbar ist
2. vollständige 1:1-Dateikopie des gesamten Projektordners inklusive versteckter Dateien und .git erstellen
3. die Kopie in einem gut benannten Backup-Archiv abspeichern, mit Zeitstempel und klarer Versionsmarke
4. bei der Wiederherstellung zuerst die vollständige Ordnerkopie wiederherstellen oder den Überblick mit dem Git-Tag rekonstruieren
5. danach den gewünschten Entwicklungszustand gezielt auf den Git-Stand der Sicherung zurücksetzen

Diese Kombination erfüllt am besten die Anforderung „aktueller Zustand exakt sichern und bei Bedarf vollständig auf diesen Zustand zurückkehren“.

## Exakter Sicherungsumfang
Die sichere Backup-Summe für dieses Repository ist:
- vollständiger Projektordner mit allen sichtbaren und versteckten Dateien
- .git-Verzeichnis mit Commit-Historie, Index und Tags
- .gitignore und alle lokalen Git/IDE-Konfigurationen des Worktrees
- lokale Dev-/Config-Dateien, soweit für den Arbeitsstand relevant
- nicht von Git erfasste Dateien, sofern sie Teil der bekannten Arbeitsumgebung sind
- optional: separate, sichere Sicherung von Secret-Dateien mit strenger Zugriffskontrolle

## Exakter Wiederherstellungsablauf
### Option 1: Wiederherstellung über vollständige Ordnerkopie
1. Backup-Ordner oder Archiv identifizieren
2. Projektordner vollständig auf das Backup-Ziel zurücksetzen oder in einen neuen Arbeitsordner auspacken
3. sicherstellen, dass .git und versteckte Dateien mitkopiert wurden
4. für genaueren Git-Referenzstand: `git reset --hard <tag|commit>` ausführen
5. ggf. lokale ignorierte Dateien und Konfigurationen aus separatem Secret-Backup wiederherstellen
6. Status prüfen: `git status`, `git rev-parse HEAD`, Dateisystem- und hidden-file-Checks

### Option 2: Wiederherstellung direkt aus GitHub/Git
1. Repository auf GitHub neu anlegen oder clonen
2. den relevanten Tag oder Commit auschecken
3. alle ignorierten, lokalen und generierten Dateien separat nachziehen, falls nötig
4. das Projekt ist dann reproduzierbar, aber nicht unbedingt identisch zum vollständigen lokalen Arbeitszustand

## Ergebnis
Für den konkreten Anspruch „aktueller Zustand exakt sichern und bei Bedarf vollständig auf diesen Zustand zurückkehren“ ist die beste zuverlässige Lösung:
- Variante C als Kernstrategie
- mit zusätzlicher Vorsicht für Secrets und lokale Laufzeitzustände
- optional als Variante D operationalisiert

Variante A allein ist nur dann vollständig, wenn .git und alle versteckten Dateien exakt mitkopiert werden. Variante B allein ist für den gesetzten Anspruch unzureichend. Variante C liefert die höchste Zuverlässigkeit und die beste Wiederherstellbarkeit in Codespace und Working Copy.

## Kurzfazit
- Git allein ist nicht identisch mit der vollständigen 1:1-Arbeitsumgebung
- eine vollständige Ordnerkopie allein ist ebenfalls kritisch, wenn .git, hidden files oder Symlinks nicht exakt mitkopiert werden
- das beste Modell für dieses Repository ist Git Commit/Tag + vollständige lokale Kopie des Projektordners inklusive .git und versteckter Dateien
- Secrets und lokale Laufzeitdaten müssen bewusst separat und sicher behandelt werden

# END BACKUP AND RESTORE STRATEGY
