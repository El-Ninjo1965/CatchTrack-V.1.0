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
