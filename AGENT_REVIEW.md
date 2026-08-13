# AGENT_REVIEW

## Datum
2026-08-13

## Auftrag
Review-First-Regel und Ist-/Gap-Analyse für die dokumentierten Plattformverträge, mit besonderem Fokus auf die P0-Lücke im generischen Permission-/Package- und UI-/Menüvertrag.

## Ausgangsvorschlag
Es wird ein unmittelbarer technischer Implementierungsstart für den nächsten Plattformschritt vorgeschlagen, direkt nach der dokumentierten Gap-Erkenntnis.

## Tatsächlicher Repository-Zustand
- Der Core ist eingefroren und dokumentiert stabil.
- Die generische Plattformarchitektur ist in den Projekt- und Arbeitsdokumenten klar definiert.
- Die vorhandene Implementierung enthält teilweise generische Strukturen, aber noch keine durchgängig neutrale Plattform-Identity-, Permission-/Package- und UI-/Menü-Architektur.
- Es existieren Module und Manager-Strukturen, aber die tatsächliche Umsetzung ist noch nicht vollständig mit den dokumentierten Verträgen vereinbar.
- Die bestehende repository-reale Architektur ist noch nicht vollständig neutral genug für spätere Wiederverwendung.

## Erkannte Schwäche des Ausgangsvorschlags
Der Ausgangsvorschlag impliziert, dass der nächste Schritt automatisch als umsetzungsreifer technischer Auftrag gelten kann. Das ist aus Sicht des tatsächlichen Repository-Zustands nicht gerechtfertigt, da die Analyse die zentrale Lücke klar benennt, aber noch keine Entscheidung über die konkrete Architekturvariante vorliegt. Eine unmittelbare Implementierung würde das Risko erhöhen, die neutrale Plattformarchitektur durch App-spezifische Lösungen zu verfestigen.

## Eigener Alternativvorschlag
Nicht sofort implementieren. Stattdessen:
1. die dokumentierte Ist-/Gap-Analyse ohne produktive Umsetzung fortführen,
2. alternative technische Varianten für die P0-Lücke prüfen,
3. die Auswirkungen auf Core, Module, Sicherheit und Wiederverwendbarkeit dokumentieren,
4. die Entscheidung des Entwicklers abwarten,
5. danach erst einen klaren Implementierungsauftrag formulieren.

## Technische Begründung
Die P0-Lücke ist nach der Ist-/Gap-Analyse real vorhanden, aber noch nicht in einer ausreichend belastbaren Entscheidung aufgelöst. Ein Implementierungsstart ohne Entwicklerentscheidung riskiert, die Plattformarchitektur in die falsche Richtung zu prägen. Die neutralere und sicherere Vorgehensweise ist eine dokumentierende Review- und Entscheidungsphase, da der Repository-Zustand noch eine App-gebundene Umsetzung zeigt, obwohl die Architektur neutral sein soll.

## Vor- und Nachteile
Vor- und Nachteile des Ausgangsvorschlags:
- Vorteil: schnellerer Beginn mit konkreter Umsetzung
- Nachteil: erhöhtes Risiko für Architekturverfestigung, falsche Abstraktionen und spätere Rework
- Vorteil: potenziell unmittelbare technische Klarheit
- Nachteil: fehlende Sicherheit bei generischer Permission-/Package- und UI-/Menü-Logik

Vor- und Nachteile der Alternativvorschlag-Variante:
- Vorteil: bessere Entscheidungsbasis und klarere Risikoabgrenzung
- Nachteil: ein zusätzlicher Review-Schritt statt sofortiger Umsetzung
- Vorteil: schützt Core-Freeze und neutrale Plattformarchitektur
- Nachteil: verzögert mögliche produktive Arbeit bis zur Entscheidung

## Auswirkungen auf Core
- Keine Core-Änderung in diesem Auftrag.
- Core-Freeze bleibt bestehen.
- Der Core bleibt stabil und unverändert.
- Die geplante Förderung der Plattformarchitektur muss über generische Schichten und Module erfolgen, nicht über den Core.

## Auswirkungen auf Module
- Module bleiben unverändert.
- Die P0-Lücke betrifft das generische Modul-/Permission-/UI-Vertragsmodell mehr als konkrete Fachmodule.
- Sollte eine spätere Implementierung erfolgen, müssen die Module durch eine neutrale Zugriffsschicht und UI-/Menüdefinition abstrahiert statt hard-coded gekoppelt werden.

## Auswirkungen auf Sicherheit
- Die derzeitige Lücke betrifft andere Sicherheits- und Zugriffsschichten: Autorisierung, Sichtbarkeit, Paketgrenzen und UI-Restriktion sind noch nicht vollständig separiert.
- Eine direkte Umsetzung ohne Review erhöht das Risiko, dass UI-Sichtbarkeiten und echte Berechtigungen falsch zusammenlaufen.
- Die neutralere Entscheidung verhindert Sicherheitsfehler durch App-spezifische Annahmen.

## Auswirkungen auf Wartbarkeit
- Eine unmittelbare Implementierung ohne Review würde wahrscheinlich Wartungs-Hacks produzieren.
- Die Review-First-Variante verbessert die langfristige Wartbarkeit, da sie die Lücke vor der Umsetzung sauber definiert.

## Auswirkungen auf spätere Wiederverwendbarkeit
- Ein unkritischer Start würde die Plattform weiter in CatchTrack-spezifische Lösungen ziehen.
- Die dokumentierte Review-Variante schützt die spätere Wiederverwendbarkeit deutlich besser.

## Auswirkungen auf Store-/App-Perspektive
- Die Store-/App-Perspektive verlangt eine generische Plattformbasis.
- Die P0-Lücke ist genau dort relevant: Wenn Package-/Permission- und UI-/Menüverträge nicht neutralisiert sind, wird spätere Wiederverwendung schwieriger.

## Empfohlene Variante
Die empfohlene Variante ist: Review-First und dokumentierte Entwicklerentscheidung vor der Implementierung. Der aktuelle Auftrag bleibt als Analyse- und Dokumentationsauftrag gültig. Eine Umsetzung wird erst nach der Entscheidung des Entwicklers starten.

## Offene Entscheidungsfragen
- Welche konkrete Package-/Permission-Strategie soll die generische Plattform langfristig implementieren?
- Wie sollen UI-Menüdefinitionen und Sichtbarkeitsregeln auf generische Module angewandt werden?
- Welche Sichtbarkeits- und Restriktionsregeln müssen auf UI-Ebene und auf Server-/Service-Ebene voneinander getrennt werden?
- Wie soll die spätere Wiederverwendbarkeit für andere Apps mit der current CatchTrack-Perspektive zusammenwirken?
- Welche generische Lösung ist für die P0-Lücke die beste Balance zwischen Einfachheit, Sicherheit und Wartbarkeit?

## Entscheidungsbasis
Der bisherige Review-/Architekturansatz ist grundsätzlich sinnvoll. Es wurde keine bessere Alternative zum grundsätzlichen Review-/Architekturvorgehen erkannt.

## Aktualisierte Variante
Die konkrete P0-Architektur wurde in drei technisch realistischen Varianten bewertet:
- Variante A: Policy-first service model
- Variante B: UI-first visibility model
- Variante C: Hybrid-Model

## Variantenvergleich
- Variante A ist aus Sicherheits-, Wartungs- und Wiederverwendbarkeitsgründen die geeignetste Grundlage.
- Variante B ist technisch leichter, aber deutlich weniger sicher und weniger neutral für spätere andere Apps.
- Variante C ist als Ergänzung sinnvoll, aber nicht als alleinige Autorisierungsschicht.

## Risiken und offene Punkte
- Paketwechsel und Downgrade-Regeln müssen klar definiert werden.
- Module und Features müssen als Entitlements separat von UI-Sichtbarkeit modelliert werden.
- Die endgültige Policy-Engine und der genaue Service-Owner bleiben offen.
- Die konkrete Implementierung bleibt ausdrücklich noch nicht freigegeben.

## Entscheidung
Keine bessere Alternative zum grundsätzlichen Review-/Architekturvorgehen erkannt.

Die Datei bleibt ein temporärer Entscheidungs- und Review-Kontext, nicht eine dauerhafte Architekturquelle.
