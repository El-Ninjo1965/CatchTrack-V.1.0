# PERMISSION_PACKAGE_UI_ARCHITECTURE

## Status
PROPOSED – NO IMPLEMENTATION

## Analyse-Datum
2026-08-13

## Zweck
Diese Datei dokumentiert die endgültige Hybrid-Zielarchitektur für die P0-Lücke im generischen Permission-/Package-/Module-Access-/Feature-Access-/UI-Menü-Vertrag.

Dieser Auftrag ist Architektur- und Review-Dokumentation, kein Implementierungsauftrag. Der Core bleibt eingefroren. Keine produktive Änderung wird in Core, Runtime, App- oder Fachmodulen begonnen.

## Repository-Check
Der bisherige Vorschlag wurde gegen den tatsächlichen Repository-Zustand geprüft.

Ergebnis:
- Core stabil und eingefroren.
- [Core/module-interface.js](Core/module-interface.js) und [Core/module-manager.js](Core/module-manager.js) enthalten die vorhandenen generischen Basisstrukturen.
- [Modules/user-module/user-module.js](Modules/user-module/user-module.js) und [Modules/admin-module/admin-module.js](Modules/admin-module/admin-module.js) zeigen noch konkrete Anwendungs- und Admin-Logik.
- [index.html](index.html) enthält ein UI- und Navigationsmodell, aber keine vollständige, generische Sichtbarkeits- und Policy-Architektur.
- Es wurde keine technisch bessere Lösung als die Hybrid-Architektur aus Policy-first und deklarativer Modul-Variante erkannt.

## Grundsatz
Permission ≠ UI Visibility.

Authorization entscheidet, ob eine Aktion oder ein Feature ausgeführt werden darf.
UI Visibility entscheidet nur, ob ein Element angezeigt werden darf.

Ein ausgeblendetes Element ist kein Sicherheitsmechanismus. Direkte API-/Service-Aufrufe müssen denselben Policy-Check durchlaufen.

## Zentrale Designregel: Package und Permission strikt trennen

Package
- beschreibt vertraglich enthaltene Leistungen
- definiert Entitlements, Paketgrenzen, Module- und Feature-Inhalte
- ist die vertragliche Grundlage eines Plan-/Tier-Modells

Permission
- beschreibt effektiv erlaubte Handlungen oder Zustände
- wird aus Package + Policy + Module State + Feature State + User-Context abgeleitet
- ist die eigentliche Autorisierungsquelle, nicht ein Snapshot aus dem UI oder aus Laufzeitcaches

### Beziehung
Package Entitlements

    +

Permission Grants / Denials / Policies

    +

Module State

    +

Feature State

    ↓

Effective Authorization

Es darf keine konkurrierende Wahrheit geben. Paket, Permission, Modulstatus und Featurezustand sind verschiedene Eingaben. Die effektive Autorisierung ist immer die zentral ausgerechnete Summe dieser Faktoren.

## User-Kontext als abgeleiteter Laufzeitzustand
Folgende Felder dürfen niemals die autoritative Quelle sein:
- activePermissions
- moduleAccessSet
- featureAccessSet
- user role snapshots

Sie dürfen nur abgeleitete Laufzeitinformationen, Caches oder Session-Snapshots sein. Die autoritative Quelle liegt in:
- Package Entitlements
- Permission Grants / Denials
- Module State
- Feature State
- Policy Engine

### Berechnung
Der User-Kontext wird aus der aktuellen Kombination der authoritativen Faktoren berechnet.

### Aktualisierung
Bei jeder Änderung von:
- Package oder Plan
- Permission Grant / Denial
- Module lifecycle state
- Feature state
- Login / Session / Token / Identity-Kontext

muss der User-Kontext neu berechnet bzw. invalidiert werden.

### Invalidierung
- bei Paketwechsel oder Downgrade: alle gespeicherten Effektivwerte müssen invalidiert werden
- bei Permission-Änderung: direktes Re-Compute der User-Policy
- bei Login-Session-Neuaufbau: User-Context neu laden, nicht wiederverwendet
- bei Cache-Stale-State: Policy-Refresh vor weiterer Entscheidung

### Verhalten bei Login/Session
Ein Login baut nur die Identität und die Session auf. Die eigentliche Autorisierung wird erneut berechnet, nicht aus einem alten User-Snapshot übernommen.

### Verhalten bei Cache-Stale-State
Ein veralteter Cache ist keine gültige Autorisierung. Er muss als Hinweis und nicht als autoritative Entscheidung dienen.

## Deklarative Module
Module deklarieren ihre eigenen Fähigkeiten und Anforderungen generisch.

### Modulvertrag
Module

 ├── identity
 ├── permissions
 ├── features
 ├── menu contributions
 ├── dependencies
 ├── lifecycle metadata
 ├── configuration
 └── storage responsibility

Ein Modul darf die zentrale Policy-Engine nicht umgehen.
Die Plattform darf die Deklarationen zentral auswerten, aber kein Modul darf selbst autoritative Entscheidungen über andere Module treffen.

## Zentrale Policy-/Authorization-Schicht
Die Plattform muss eine zentrale generische Policy-Engine bereitstellen. Sie beantwortet mindestens:
- Can user access module X?
- Can user execute feature Y?
- Can user see menu item Z?
- Is module X installed?
- Is module X enabled?
- Is feature Y included in the user's package?
- Is feature Y explicitly denied?
- Is the module dependency satisfied?

### Priorität / Kombinationslogik
Die korrekte Reihenfolge ist:

Identity

→ User

→ Package Entitlements

→ Permission Grants / Denials / Policies

→ Module State

→ Feature State

→ Effective Authorization

→ UI Visibility

Diese Reihenfolge ist korrekt, weil:
- Identity und User die Session- und Personenbasis bieten
- Package und Permission die vertragliche und effektive Zugriffslogik definieren
- Module State und Feature State den technischen und runtime-Kontext enthalten
- Effective Authorization die tatsächliche Berechtigung bildet
- UI Visibility nur noch ein Render- und Sichtbarkeitsfilter ist

Die UI darf niemals die autoritative Entscheidungsquelle sein.

## Permission ≠ UI Visibility

### Authorization
Authorization entscheidet, ob eine Aktion oder eine Funktion tatsächlich ausgeführt werden darf.

### UI Visibility
UI Visibility entscheidet nur, ob ein Menüeintrag, Button oder Bereich angezeigt werden soll.

### Regeln
- UI-Sichtbarkeit ist kein Sicherheitsmechanismus
- Ausgeblendete UI-Elemente dürfen keine Sicherheitsfunktion ersetzen
- gleiche Policy muss für UI und API gelten
- direkte API-/Service-Aufrufe laufen durch dieselbe Autorisierungslogik
- UI-Status muss als Information dienen, nicht als Autorität

## UI-/Menüvertrag
Module liefern deklarative Menübeiträge. Ein Menüeintrag kann enthalten:
- Module
- Feature
- erforderliche Permission
- gewünschte Sichtbarkeit
- Position oder Sortierung
- Label-/Übersetzungsreferenz
- Icon-Referenz
- optionale Metadaten

### Verantwortlichkeiten
- Module liefern Menüdefinitionen als deklarative Metadaten.
- Die Plattform entscheidet anhand des Effective Authorization State, ob der Menüpunkt sichtbar ist.
- UI zeigt nur, was sichtbar sein darf.
- Keine CatchTrack-spezifischen Hardcodings im generischen Vertrag.

## Module Lifecycle
Konsistente Lifecycle-Reihenfolge:

available

→ installable

→ installed

→ enabled

→ disabled

→ uninstalled

### Wichtig
- Ein Benutzer kann berechtigt sein, ein Modul zu verwenden, obwohl es momentan nicht installiert ist.
- Nach Deinstallation bleibt die fachliche Berechtigung im Policy-Kontext erhalten, sofern das Paket oder die Permission sie weiter erlaubt.
- Deinstallation darf nicht automatisch Permission-Gesamtstatus oder die Berechtigungsfähigkeit löschen.
- Wiederinstallation bzw. Reaktivierung ist zulässig, wenn Package und Permission weiterhin erlauben.

### Weitere Regeln
- Abhängigkeiten werden in der Policy-Engine geprüft.
- Deaktivierung ist ein runtime state, keine Berechtigungsauflösung.
- Wiederaktivierung ist nur erlaubt, wenn Abhängigkeiten und Entitlement erfüllt sind.
- Paket-Upgrade erweitert die Entitlements; Paket-Downgrade schränkt sie ein und invalidiert vorherige Effektivwerte.
- fehlende Abhängigkeiten blockieren Zugriff und verhindern unkontrollierte Aktivierung.

## Generisch vs. CatchTrack
### Plattform / Framework
- Identity
- User
- Package
- Permission
- Authorization Policy
- Module Manager
- UI/Menu Registry
- generische Lifecycle-Mechanismen
- generische Config und Storage Abstraction

### CatchTrack-Anwendung
- CatchTrack-spezifische Navigation
- CatchTrack-spezifische App-Konfiguration
- CatchTrack-spezifische Packages, falls vorhanden
- Branding und erste App-Umsetzung

### CatchTrack-Fachmodule
- Fangberichte
- Gewässer
- Ausrüstung
- weitere Fachbereiche

Keine Fachlogik darf in generische Plattformservices verschoben werden.

## Zukunftsfähigkeit
Die Hybridarchitektur bleibt für spätere Szenarien geeignet:
- zweiter App / zweites Produkt
- Store-Verpackung
- Free-/Paid-Pakete
- Beta-/Preview-Module
- Offline-Betrieb
- Serverbetrieb
- Cloudbetrieb
- spätere Synchronisierung
- Erweiterbarkeit und Migration

Das Design erzwingt keine unnötige Abhängigkeit von einem bestimmten Backend oder einer einzelnen App.

## Konkreter Zielvertrag

### 1. Package Contract
Zweck:
- vertraglicher Leistungsumfang eines Plans oder Tiers

Eingaben:
- packageId
- packageName
- packageType
- includeModules
- includeFeatures
- packageLimits
- visibilityDefaults
- previewRules
- downgradeRules
- upgradeRules
- status

Ergebnisse:
- package entitlement set
- default visibility set
- module allow list
- feature allow list

Verantwortlichkeit:
- Definition des vertraglichen Angebots

Abhängigkeiten:
- Permission Policy Engine
- Module Registry
- Feature Registry

Autorisierte Quelle:
- Package Store / Config / Policy Definition

Erweiterbarkeit:
- neue Pakete ohne Core-Änderung möglich

### 2. Permission Contract
Zweck:
- effektive erlaubte Zustände und Aktionen zwischen Package, User und Modulen

Eingaben:
- permissionId
- permissionType
- targetType
- targetId
- scope
- grantSource
- grantedBy
- isGranted
- isDenied
- expiresAt

Ergebnisse:
- effective permission decision
- explicit denial state
- grant/denial history as audit data

Verantwortlichkeit:
- zentrale Berechnung effektiver Autorisierung

Abhängigkeiten:
- Package Entitlements
- Module State
- Feature State
- User Identity / Session

Autorisierte Quelle:
- Permission Policy Engine

Erweiterbarkeit:
- neue Permission-Typen ohne Core-Änderung möglich

### 3. Module Contract
Zweck:
- deklaratives Modulprofil einer Plattform-Erweiterung

Eingaben:
- moduleId
- moduleName
- version
- lifecycle
- permissions
- features
- menuContributions
- dependencies
- configuration
- storageResponsibility

Ergebnisse:
- modulare Zugriffsbeschreibung
- modulare Capability-Definition
- Modulstatus und Abhängigkeitsprüfung

Verantwortlichkeit:
- Modul selbst deklariert seine Leistungen und Anforderungen

Abhängigkeiten:
- Policy Engine
- Module Manager
- UI/Menu Registry

Autorisierte Quelle:
- Modul-Declaration + Policy-Engine-Auswertung

Erweiterbarkeit:
- neue Module ohne Core-Änderung möglich

### 4. Feature Contract
Zweck:
- granularer Zugriff auf einzelne Funktionen

Eingaben:
- featureId
- moduleId
- featureName
- requiredPermission
- dependencies
- packageScope
- isPreview
-
Ergebnisse:
- Feature erlaubt / gesperrt / preview
- Feature generisch je Module bewertet

Verantwortlichkeit:
- Module definiert Feature-Metadaten, Policy entscheidet effektiv

Abhängigkeiten:
- Permission Policy Engine
- Module Contract
- UI Menu Contract

Autorisierte Quelle:
- Policy Engine mit Feature-State und Package-Permission

Erweiterbarkeit:
- neue Features ohne Core-Änderung möglich

### 5. Module Lifecycle Contract
Zweck:
- definierter Plattformzustand eines Moduls

Eingaben:
- moduleId
- lifecycleState
- dependencyState
- installationState
- enabledState

Ergebnisse:
- installed / enabled / disabled / uninstalled / available / installable

Verantwortlichkeit:
- Module Manager und Policy Engine

Abhängigkeiten:
- Module Contract
- Permission Policy Engine
- Package Entitlements

Autorisierte Quelle:
- Module Manager + Policy Engine

Erweiterbarkeit:
- erweiterbar durch neue Lifecycle-Zustände ohne Core-Einschränkung

### 6. Authorization Contract
Zweck:
- zentrale Entscheidungslogik für zulässige Ausführung

Eingaben:
- identity
- user
- package
- permissions
- moduleState
- featureState

Ergebnisse:
- allow / deny / preview / blocked by dependency / blocked by package

Verantwortlichkeit:
- Authorization Policy Engine

Abhängigkeiten:
- Package Contract
- Permission Contract
- Module Contract
- Feature Contract
- UI/Menu Contract

Autorisierte Quelle:
- Policy Engine

Erweiterbarkeit:
- erweiterbar ohne Core-Umbau

### 7. UI/Menu Contract
Zweck:
- deklarative Darstellung und Sichtbarkeitssteuerung der Oberfläche

Eingaben:
- menuId
- label
- position
- moduleId
- featureId
- requiredPermission
- visibilityRule
- iconRef
- translationRef

Ergebnisse:
- visible / hidden / disabled / preview

Verantwortlichkeit:
- UI/Menu Registry + Policy Engine

Abhängigkeiten:
- Effective Authorization
- Module Contract
- Feature Contract

Autorisierte Quelle:
- Policy Engine entscheidet, UI rendert nur das Sichtbare

Erweiterbarkeit:
- neue Menü- und UI-Beschreibungen ohne CatchTrack-Hardcoding

### 8. Effective Authorization Model
Zweck:
- konsistente, berechnete, letztendliche Entscheidung

Formel:
Effective Authorization = resolve(
  Identity,
  User,
  Package Entitlements,
  Permission Grants / Denials,
  Module State,
  Feature State
)

Ergebnisse:
- allow
- deny
- preview
- blocked-by-dependency
- blocked-by-package

Verantwortlichkeit:
- Policy Engine

Autorisierte Quelle:
- Policy Engine

Nicht autoritativ:
- activePermissions
- moduleAccessSet
- featureAccessSet
- UI-only visibility state

## Hybridarchitektur – finale Entscheidung
Die finale Hybridarchitektur ist:
- Policy-first für die eigentliche Autorisierung
- deklarative Modul-/Feature-/Menübeschreibung für Plattform-Deklaration
- UI als Render-/Visibility-Schicht, nicht als Autorität

Das ist die technisch sauberste, neutralste und zukunftsfähigste Lösung für CatchTrack als erste Anwendung auf einer generischen Plattform.

## Offene Punkte
- definierte Package-/Permission-Matrix für reale Produkt-Tiers
- konkrete Policy-Engine-Ownership und Audit-Flow
- Regeln für individuelle Overrides vs. Package-Defaults
- genaue Berechnung von Feature-Flags und Preview-Zuständen im Hybrid-Modell
- Auswahl der konkreten API-/Service-Schnittstelle für die spätere Implementierung

## Abschlussklarstellung
Diese Datei repräsentiert die vorgeschlagene, noch nicht implementierte Zielarchitektur. Sie ist verbindlich als Review- und Architekturgrundlage für eine spätere Produktimplementierung, aber nicht als produktiver Code- oder Core-Stand zu verstehen.
