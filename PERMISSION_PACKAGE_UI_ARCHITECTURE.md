# PERMISSION_PACKAGE_UI_ARCHITECTURE

## Status
Proposed / noch nicht implementiert

## Analyse-Datum
2026-08-13

## Zweck
Diese Datei dokumentiert die neutrale Zielarchitektur für die identifizierte P0-Lücke im generischen Permission-/Package-/Module-Access-/Feature-Access-/UI-Menü-Vertrag.

Dieser Auftrag ist Architektur- und Review-Dokumentation, kein Implementierungsauftrag. Der Core bleibt eingefroren.

## Relevanter Ist-Zustand im Repository
Aktuell ist der tatsächliche Zustand im Repository entsprechend dem dokumentierten Ziel und dem bisherigen Review:

- Core bleibt stabil und eingefroren.
- Die generische Plattformarchitektur ist dokumentiert, aber noch nicht vollständig in eine neutrale Implementierungsstruktur überführt.
- [Core/module-interface.js](Core/module-interface.js) definiert Muster für Module, Statuswerte und Aktivierung.
- [Core/module-manager.js](Core/module-manager.js) verwaltet Module, Status und Lifecycle in einer noch nicht vollständig neutralen Form.
- [Modules/user-module/user-module.js](Modules/user-module/user-module.js) enthält konkrete Benutzer- und Rollenlogik, aber noch keine generische Plattform-Identity-/Permission-Schicht.
- [Modules/admin-module/admin-module.js](Modules/admin-module/admin-module.js) enthält konkrete Administration und Module-Status, aber noch keine generische Plattform-Admin-/Governance-Schicht.
- [index.html](index.html) zeigt bereits ein UI-/Navigationsmodell, aber noch keine vollständig generische, permission-lenkende Menüarchitektur.
- Die bisherige Architektur-Dokumentation bestätigt den allgemeinen Soll-Zustand, aber die konkrete P0-Entscheidung ist noch offen.

## Grundsatz
Permission ≠ UI Visibility.

Die UI darf nur anzeigen, was der Nutzer sehen soll. Die echte Autorisierung erfolgt unabhängig davon auf Service-/Server-/Policy-Ebene.

## Zielmodell

Identity

   ↓

User

   ↓

Package / Plan

   ↓

Permissions

   ↓

Module Access

   ↓

Feature Access

   ↓

UI / Menu Visibility

Diese Reihenfolge ist für die effektive Zugriffspipeline sinnvoll. Die UI ist dabei der letzte Filter, nicht die Quelle der Berechtigung.

## Ebene 1: Identity
### Zweck
Identifiziert den Nutzer eindeutig und neutral.

### Verantwortlichkeit
- eindeutige Identität des Nutzers
- Zuordnung zu Profilen und Session-Kontexten
- AuthN-/Identity-Informationen ohne App-Spezifik

### Datenmodell
- identityId
- userId
- authenticationProvider
- authState
- tenantId (optional)
- createdAt
- updatedAt

### Beziehungen
- 1:n zu User
- 1:n zu PackageAssignment
- 1:n zu PermissionAssignment

### Abhängigkeiten
- keine CatchTrack-spezifischen Annahmen
- nur Identitäts- und Session-Services

### Zugriffskontrolle
- nur AuthN-, Session- und Policy-Services dürfen sie lesen

### Erweiterbarkeit
- für spätere Apps und Store-Szenarien geeignet

### Wiederverwendbarkeit
- Framework / Plattform-Ebene

## Ebene 2: User
### Zweck
Repräsentiert den aktuellen Nutzerkontext in der Anwendung.

### Verantwortlichkeit
- aktuelle Sitzung und Personalisierung
- Zusammenführung aus Identity, Package, Permission und Modulstatus
- App-übergreifende Session- und Kontextsynthese

### Datenmodell
- userId
- identityId
- packageId
- activeRoleSet
- activePermissions
- moduleAccessSet
- featureAccessSet
- uiPreferenceSet

### Beziehungen
- n:1 zu Identity
- n:1 zu Package / Plan
- 1:n zu PermissionAssignment
- 1:n zu UI Preference

### Abhängigkeiten
- Policy-Service, Package-Service, Module Access Policy

### Zugriffskontrolle
- Restriktionen auf Service-/Policy-Ebene, nicht im UI allein

### Erweiterbarkeit
- User-Profile und App-Scope bleiben erweiterbar

### Wiederverwendbarkeit
- generischer Service

## Ebene 3: Package / Plan
### Zweck
Definiert den Vertrags- und Leistungsumfang eines Nutzers.

### Verantwortlichkeit
- Plan-/Paketdefinition
- Definition von Module- und Feature-Entitlements
- Standard-Entitlements und Upgrade-/Downgrade-Regeln
- generische Vertragsschicht ohne CatchTrack-Hardcoding

### Datenmodell
- packageId
- packageName
- packageType
- status
- featureAllowList
- moduleAllowList
- visibilityDefaults
- upgradeRules
- downgradeRules
- previewRules

### Beispiele
- Free
- Basic
- Standard
- Premium
- EarlyAccess
- Beta
- Preview
- future app package

### Beziehungen
- 1:n zu User
- 1:n zu PermissionSet
- 1:n zu ModuleAccessPolicy
- 1:n zu FeatureAccessPolicy

### Abhängigkeiten
- keine direkte Abhängigkeit zu CatchTrack-Fachmodulen

### Zugriffskontrolle
- Paket ist Vertragsrahmen, keine UI-Entscheidung

### Erweiterbarkeit
- neue Pakete ohne Core-Umbau möglich

### Wiederverwendbarkeit
- Plattform-/Framework-Ebene

## Ebene 4: Permissions
### Zweck
Definiert die effektiven Berechtigungen und Entitlements.

### Verantwortlichkeit
- Rechte- und Entitlement-Logik
- Zusammenführung aus Package-, User- und Modulfaktoren
- zentrale Berechnung des Effektivstatus

### Datenmodell
- permissionId
- permissionType
- scope
- targetType
- targetId
- grantSource
- grantedBy
- isActive
- expiresAt (optional)

### Beispieltypen
- packageAccess
- moduleAccess
- featureAccess
- adminAccess
- previewAccess
- betaAccess
- userPreferenceOverride

### Beziehungen
- n:1 zu User
- n:1 zu Package
- n:1 zu Module
- n:1 zu Feature

### Abhängigkeiten
- Policy-Engine und Module Access Policy

### Zugriffskontrolle
- nur Service-, Policy- und Server-Schicht darf die Berechtigung auswerten

### Erweiterbarkeit
- neue Permission-Typen ohne Core-Umbau

### Wiederverwendbarkeit
- generischer Service

## Ebene 5: Module Access
### Zweck
Bestimmt, ob ein Modul für einen Nutzer oder ein Paket logisch zugänglich ist.

### Verantwortlichkeit
- Entitlement eines Moduls
- Installations-, Aktivierungs- und Deaktivierungszustand
- Security-Gateway für modulare Funktionen

### Datenmodell
- moduleId
- moduleName
- moduleVersion
- lifecycleState
- isInstalled
- isEnabled
- isAvailable
- isPreview
- packageBindings
- permissionBindings
- effectiveAccessState

### Beziehungen
- n:1 zu Package
- n:1 zu User
- n:1 zu Permission
- 1:n zu Feature Access

### Abhängigkeiten
- Module Manager
- Permission Engine
- Feature Policy

### Zugriffskontrolle
- Service-/Policy-Ebene entscheidet
- UI zeigt nur Sichtbarkeit

### Erweiterbarkeit
- neue Module und neue Modul-Features ohne Core-Umbau möglich

### Wiederverwendbarkeit
- Plattform-/Framework-Ebene

## Ebene 6: Feature Access
### Zweck
Bestimmt den Zugriff auf einzelne Funktionen, Actions und Screens.

### Verantwortlichkeit
- granularer Feature- und Action-Zugriff
- Schutz sensibler Funktionen
- Trennung von UI-Sichtbarkeit und tatsächlicher Ausführung

### Datenmodell
- featureId
- moduleId
- featureName
- featureType
- requiredPermission
- isVisible
- isEnabled
- isPreview
- packageScope
- dependencyRules

### Beziehungen
- n:1 zu Module Access
- n:1 zu Permission
- n:1 zu UI Menu Item

### Abhängigkeiten
- Permission Court, UI Policy, Module Policy

### Zugriffskontrolle
- Service-/API- und Feature-Policy-Schicht

### Erweiterbarkeit
- neue Features ohne Core-Umbau möglich

### Wiederverwendbarkeit
- generisches Service-/Feature-Modell

## Ebene 7: UI / Menu Visibility
### Zweck
Definiert, was der Benutzer in der Oberfläche sehen darf.

### Verantwortlichkeit
- Menüeinträge, Buttons, Tabs, Vorschau, Ausblenden, Priorisierung
- Laufzeitfilterung nach Permissions, Paket, Module State

### Datenmodell
- menuId
- parentMenuId
- label
- route
- moduleId
- featureId
- packageScope
- permissionScope
- visibilityRule
- isDisabled
- isPreview
- priority

### Beziehungen
- n:1 zu Module Access
- n:1 zu Feature Access
- n:1 zu User Preference
- n:1 zu Package

### Abhängigkeiten
- UI Policy Manager
- Permission Engine
- User Preference Service

### Zugriffskontrolle
- UI darf nur anzeigen, was sichtbar sein darf
- UI prüft nicht die endgültige Autorisierung

### Erweiterbarkeit
- dynamische Menüs für andere Apps möglich

### Wiederverwendbarkeit
- generisches UI-Framework

## Package-System
### Zweck
Das Package-/Plan-Modell ist der Vertragsrahmen für einen Nutzertyp oder Leistungsumfang.

### Was gehört zum Package?
- Plan-/Paketname und -typ
- Module-Entitlements
- Feature-Entitlements
- Standard-Permissions
- Preview-/Beta-Regeln
- Upgrade-/Downgrade-Regeln
- visibilityDefaults

### Was gehört zur Permission?
- konkrete Berechtigungen
- temporäre Freigaben
- modul- und feature-spezifische Zusätze
- Abweichungen vom Paket

### Was gehört zum Modul?
- Modul-ID, Metadaten, Abhängigkeiten, Lifecycle, Konfiguration, Feature-Modelle
- keine direkte Paket- oder App-Logik

### Was gehört zur Anwendung?
- CatchTrack-spezifische UI, App-Branding, konkrete Module und App-Logik

### Paketwechsel / Downgrade
- Beim Wechsel muss der neue effektive Status sofort neu berechnet werden.
- Altzustände dürfen nicht weiter als gültige Berechtigung dienen.
- Deinstallierte oder nicht installierte Module bleiben weiterhin im Paket-/Entitlement-Model sichtbar, sofern das Paket oder die Permission sie noch zulassen.

### Deaktivierte Module
- Ein deaktiviertes Modul darf nicht aktiv genutzt werden.
- Es kann als deaktiviert, preview-visible oder verfügbar erscheinen, aber nicht als aktiv zugelassen.

### Nicht installierte Module
- Nicht installierte Module sind nicht aktiv, aber als installierbar bzw. verfügbar einsehbar.
- Paket und Permissions entscheiden darüber, ob sie für den Nutzer relevant und sichtbar sind.

## Module Lifecycle
Die in der Dokumentation bereits genannte Reihenfolge ist technisch grundsätzlich passend:

available

↓

installable

↓

installed

↓

enabled

↓

disabled

↓

uninstalled

Die Zustände sollten als Plattformzustände modelliert werden und nicht als UI-Status allein. Wichtig ist:

- Deinstallation entfernt die Runtime-/Installationsinstanz, nicht die Berechtigung an sich.
- Berechtigungen bleiben als Paket-/Entitlement- oder Permission-Status erhalten, sofern das Paket bzw. die Permission sie noch gewährt.
- Das UI zeigt nur den aktuellen sichtbaren State an, nicht den effektiven Berechtigungsstatus.

## Permission vs. UI Visibility
### Definition
Permission = echte Autorisierung.
UI Visibility = Präsentationsfilter.

### Wer entscheidet was?
- Permission: Policy-/Service-/Server-Ebene
- Module Access: Policy-/Module-Management-Ebene
- Feature Access: Feature-Policy-Ebene
- UI: Sichtbarkeitsfilterung

### Welche Prüfungen müssen server-/service-seitig erfolgen?
- API-Zugriffe
- Action-Ausführung
- Feature- und Modul-Access
- Paket- und Permission-Entitlements
- Änderungen beim Downgrade oder beim Package-Wechsel

### Welche Prüfung dient nur der UI?
- Menü- und Button-Sichtbarkeit
- Vorschauanzeige
- Upgrade-Hinweise
- deaktivierte UI-Elemente als nicht aktiv

## UI-/Menüvertrag
### Anforderungen
- dynamische Menüs
- modulare Menüeinträge
- permission-aware menu entries
- package-aware menu entries
- install-state-aware menu entries
- Preview-/Upgrade-Anzeigen für gesperrte Features
- CatchTrack-Anwendung kann eigene Menüpunkte definieren
- andere Apps dürfen andere Menüs definieren

### Allgemeiner Vertrag
- Module liefern Menü-Metadaten
- UI rendert nur basierend auf dem aktuellen Policy-State
- Visibility-Policy entscheidet über Sichtbarkeit
- echte Autorisierung bleibt außerhalb des UI-Metadatenmodells

## Sicherheit
### UI-only Permission Checks
Niemals ausreichend.

### Serverseitige Autorisierung
Muss immer existieren.

### Direkte API-Aufrufe
Müssen policybasiert geprüft werden.

### Manipulierte Requests
Dürfen niemals als gültige Berechtigung gelten.

### Fehlende Module
Ein fehlendes Modul darf nicht automatisch als aktiv oder autorisiert gelten.

### Deaktivierte Module
Ein deaktiviertes Modul bleibt nicht aktiv und ist nicht autorisiert.

### Paket-Downgrade
Ein Downgrade muss in einen konsistenten neuen Zugriffszustand führen.

### Berechtigungsänderungen
Änderungen müssen sofort in die nächste Policy-Auswertung einfließen.

## Neutralität
### Framework / Plattform
- Identity
- Package
- Permissions
- Module Access
- Feature Access
- UI Menu Model
- Policy Engine

### Generischer Service
- Permission Service
- Module Access Service
- Feature Access Service
- UI Visibility Service

### Generisches UI
- Menü-Renderer
- Route-/Visibility-Filter
- Preview-/Upgrade-State

### Module Manager
- Modulstatus und Installation

### CatchTrack-Anwendung
- App-Init, Branding, konkrete App-Logik und CatchTrack-Module

### CatchTrack-Fachmodul
- CatchTrack-spezifische Features wie Fänge, GPS, Wetter, Equipment, Kalender

## Architekturvarianten

### Variante A: Policy-first service model
#### Beschreibung
Echte Autorisierung und Entitlement liegen in einer Policy-Service-Schicht. Das UI verwendet nur einen separaten Sichtbarkeitsfilter.

#### Datenmodell
- Identity
- User
- Package
- Permission
- ModuleAccess
- FeatureAccess
- UIVisibilityRule

#### Beziehungen
User → Package → Permission → ModuleAccess → FeatureAccess → UI Menu Item

#### Autorisierung
- Berechtigung wird im Policy-Service entschieden
- Package-/Permission-/Module-/Feature-Level werden dort ausgewertet
- UI dient nur der Sichtbarkeitsfilterung

#### UI
- Menü und Button nur anhand der effektiven Policy berechnet
- Preview/Upgrade sichtbar, aber echte Ausführung bleibt policybasiert gesperrt

#### Vorteile
- höchste Sicherheit
- klare Trennung von Permission und UI
- gut für spätere Wiederverwendung und Store-/App-Perspektive
- gut für Paketwechsel, Downgrade und Moduldynamik

#### Nachteile
- mehr Infrastruktur und klarere Policy-Schichten
- initial aufwendiger als UI-first

#### Sicherheitsauswirkungen
- sehr gut

#### Wartbarkeit
- gut

#### Erweiterbarkeit
- sehr gut

#### Wiederverwendbarkeit
- sehr gut

#### Core-Abhängigkeit
- gering

#### Migrationsrisiko
- mittel, aber kontrolliert

### Variante B: UI-first visibility model
#### Beschreibung
Das UI versucht, Sichtbarkeit auf Basis von Paket-, Modul- und Menü-Attributen zu filtern. Echte Autorisierung bleibt teilweise in UI oder Modulen liegen.

#### Datenmodell
- User
- Package
- ModuleState
- MenuItem
- FeatureFlag
- PermissionHint

#### Beziehungen
User → Package → ModuleState → MenuItem → FeatureFlag

#### Autorisierung
- UI sieht zunächst aus wie zentrale Autorisierung
- echte Prüfung bleibt an vielen Stellen verteilt und ist fehleranfällig

#### UI
- dynamische Menüs und Vorschauen, aber keine harte Trennung von Sichtbarkeit und Autorisierung

#### Vorteile
- einfacher in der ersten Umsetzung
- geringere Initial-Kosten

#### Nachteile
- schwächere Security
- UI und echte Berechtigung werden vermischt
- schlechter für spätere Apps, Store und spätere Wiederverwendung
- höheres Migrationsrisiko bei Paketwechseln und Berechtigungsänderungen

#### Sicherheitsauswirkungen
- schwach bis mittel

#### Wartbarkeit
- gering

#### Erweiterbarkeit
- mittel

#### Wiederverwendbarkeit
- gering

#### Core-Abhängigkeit
- gering

#### Migrationsrisiko
- hoch

### Variante C: Hybrid-Model
#### Beschreibung
Eine Kombination aus Policy-first für effektive Autorisierung und UI-first für UI-Rendering-Helfer. Das UI bekommt zusätzliche Meta-Informationen, aber die eigentliche Berechtigung bleibt in der Policy-Service-Schicht.

#### Datenmodell
- User
- Package
- Permission
- ModuleAccess
- FeatureAccess
- UIVisibilityMetadata

#### Beziehungen
User → Package → Permission → ModuleAccess → FeatureAccess → UIVisibilityMetadata → MenuItem

#### Autorisierung
- Policy-Service entscheidet.
- UI nutzt die Ergebnisse nur zur Darstellung.
- UI-Meta-Informationen sind Hinweise, keine Autorisierung.

#### UI
- flexibler für dynamische Menüs, aber ohne Autoritäts- und Audit-Fehler.

#### Vorteile
- gute Balance zwischen Dynamik und Sicherheit
- flexible Umsetzung für App-spezifische Menüs
- sehr gut für die neutrale Plattformarchitektur

#### Nachteile
- höherer Modellierungsaufwand als reine Variante A
- erfordert klare Verantwortungsgrenzen zwischen Policy und UI

#### Sicherheitsauswirkungen
- gut

#### Wartbarkeit
- gut

#### Erweiterbarkeit
- gut

#### Wiederverwendbarkeit
- gut

#### Core-Abhängigkeit
- gering

#### Migrationsrisiko
- mittel

## Variantenvergleich

| Kriterium | Variante A | Variante B | Variante C |
|---|---|---|---|
| Sicherheit | Sehr hoch | Niedrig bis mittel | Hoch |
| Einfachheit | Mittel | Hoch initial | Mittel |
| Wartbarkeit | Sehr gut | Schwach | Gut |
| Erweiterbarkeit | Sehr gut | Mittel | Gut |
| Performance | Gut | Gut initial | Gut |
| Core-Abhängigkeit | Gering | Gering | Gering |
| Modulabhängigkeit | Mittel | Hoch | Mittel |
| UI-Flexibilität | Gut | Sehr gut | Sehr gut |
| Package-System | Sehr gut | Mittel | Sehr gut |
| Permission-System | Sehr gut | Schwach | Sehr gut |
| Wiederverwendbarkeit | Sehr gut | Schwach | Gut |
| Store-Perspektive | Sehr gut | Schwach | Gut |
| Migrationsrisiko | Mittel | Hoch | Mittel |

## Empfohlene Variante
Empfohlen wird Variante A mit gezielten Elementen aus Variante C.

### Warum Variante A?
- Die Trennung von Permission und UI Visibility ist technisch am saubersten.
- Die Access-Pipeline bleibt nachvollziehbar und neutral.
- Die Architektur bleibt für zukünftige Apps und Store-Modelle wiederverwendbar.
- Sie respektiert den Core-Freeze, weil der Core nicht geändert werden muss.
- Sie funktioniert für CatchTrack als erste Anwendung, ohne die Plattform an CatchTrack zu binden.

### Warum nicht Variante B?
- Sie vermischt Sichtbarkeit und echte Autorisierung.
- Das ist für Sicherheit, Review, Audit und spätere Wiederverwendung problematisch.
- Sie stellt das UI in den Mittelpunkt und erhöht das Risiko, dass spätere App-Entscheidungen in die generische Plattform eingearbeitet werden.

### Warum C als Ergänzung?
- C ist eine gute technische Ergänzung als UI-Hilfsmodell, aber nicht als alleinige Autorisierungsschicht.
- Die Autorisierung bleibt in Variante A.
- C dient als Informations- und Rendering-Adapter zwischen Policy und UI.

## Konkreter Zielvertrag
### 1. Package-Vertrag
Ein Package definiert:
- packageId
- packageName
- packageType
- moduleAllowList
- featureAllowList
- visibilityDefaults
- previewRules
- downgradeRules
- upgradeRules
- status

Ein Package entscheidet nicht direkt über die UI-Anzeige, sondern liefert Entitlements und Standardregeln.

### 2. Permission-Vertrag
Ein Permission-Objekt definiert:
- permissionId
- permissionType
- scope
- targetType
- targetId
- grantSource
- isActive
- expiresAt

Permissionen werden zentral ausgewertet und sind die Grundlage für echte Autorisierung.

### 3. Module-Access-Vertrag
Ein Module-Access-Objekt definiert:
- moduleId
- moduleName
- moduleVersion
- lifecycleState
- isInstalled
- isEnabled
- isAvailable
- isPreview
- effectiveAccessState

Die Module-Access-Entscheidung erfolgt in der Policy-/Service-Schicht, nicht im UI.

### 4. Feature-Access-Vertrag
Ein Feature-Access-Objekt definiert:
- featureId
- moduleId
- featureType
- requiredPermission
- isVisible
- isEnabled
- isPreview
- dependencyRules

Feature-Zugriffe werden granular in der Service-/Policy-Schicht geprüft.

### 5. UI-/Menüvertrag
Ein Menü- oder UI-Item definiert:
- menuId
- label
- parentMenuId
- route
- moduleId
- featureId
- visibilityRule
- priority
- isDisabled
- isPreview

Das UI zeigt nur, was auf Basis der berechneten Policy sichtbar ist. Es validiert nicht die echte Autorisierung.

### 6. Module-Lifecycle-Vertrag
Zustände:
- available
- installable
- installed
- enabled
- disabled
- uninstalled

Diese Zustände sind Plattformzustände, keine UI-Entscheidung. Ein Modul darf deinstalliert werden, ohne dass die Berechtigung an sich verschwindet. Die Berechtigung bleibt im Policy-Kontext erhalten, sofern das Paket oder die Permission sie weiterhin gewährt.

### 7. Autorisierungsvertrag
Die Autorisierung folgt dieser Reihenfolge:

Identity → User → Package → Permission → ModuleAccess → FeatureAccess → UI Visibility

Der UI-Status ist jeweils ein Render- und Sichtbarkeitsfilter, keine Entscheidungsquelle.

### 8. Trennung Framework / Anwendung / Fachmodul
- Framework / Plattform: Identity, User, Package, Permission, Module Access, Feature Access, UI Menu Policy
- generische Services: Policy Engine, Permission Service, UI Visibility Service, Module Manager
- CatchTrack-Anwendung: App-Boot, Branding, konkrete Anwendungskonfiguration, App-Flow
- CatchTrack-Fachmodul: Catches, Equipment, GPS, Wetter, Kalender usw.

## Offene Entscheidungen
- Welche Entitlements sind Paket-spezifisch und welche sind Benutzer-spezifisch?
- Wie werden Paketswechsel, Downgrades und Deinstallationen bei bereits vorhandenen Modul- und Feature-Entitlements behandelt?
- Welche Attribute sind universell generisch und welche vollständig app-spezifisch?
- Wo liegt die autoritative Policy-Engine für die spätere Implementierung?

## Abschlussklarstellung
Dieser Dokumentationsauftrag ist nicht als beschlossen oder implementiert zu verstehen. Er ist ein Proposed-Design für eine spätere Entwicklerentscheidung und Implementierung. Die Architektur wird erst nach der Entscheidung des Entwicklers verbindlich.
