# PERMISSION_PACKAGE_UI_ARCHITECTURE

## Analyse-Datum
2026-08-13

## Zweck
Diese Datei dokumentiert die neutrale Zielarchitektur für die identifizierte P0-Lücke im generischen Permission-/Package-/Module-Access-/Feature-Access-/UI-Menü-Vertrag.

Dieser Auftrag ist Architektur- und Review-Dokumentation, nicht Implementierung. Der Core bleibt eingefroren.

## Verankerung im Projektkontext
Der langfristige Zielzustand des Projekts ist eine neutrale, wiederverwendbare Plattform. CatchTrack bleibt die erste konkrete Anwendung auf dieser Plattform. Die Architektur darf keine CatchTrack-spezifische Einbindung in generische Plattformschichten erzwingen.

## Grundsatz
Permission ≠ UI Visibility.

Die UI darf nur zeigen, was der Nutzer sehen soll. Die echte Autorisierung erfolgt unabhängig davon auf Service-/Server-/Policy-Ebene.

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

## Ebene 1: Identity
### Zweck
Identifiziert den Nutzer eindeutig und neutral.

### Verantwortlichkeit
- eindeutige Identität des Nutzers
- Zuordnung zu einem oder mehreren Konten/Profilen
- sichere und neutrale Bereitstellung der Identitätsdaten
- keine App-spezifische Business-Logik

### Datenmodell
- userId
- tenantId (optional)
- profileId
- authenticationState
- createdAt
- updatedAt

### Beziehungen
- 1:n zu User
- 1:n zu PackageAssignment
- 1:n zu PermissionAssignment

### Abhängigkeiten
- keine CatchTrack-spezifischen Annahmen
- nur für AuthN/AuthZ- oder Profilkontext relevant

### Zugriffskontrolle
- nur AuthN- und Profil-Services dürfen sie lesen oder weitergeben

### Erweiterbarkeit
- für spätere Apps und Store-Szenarien geeignet

### Wiederverwendbarkeit
- Framework / Plattform-Ebene

## Ebene 2: User
### Zweck
Repräsentiert den tatsächlichen Nutzerkontext in der Anwendung.

### Verantwortlichkeit
- Identitätskontext für die aktuelle Sitzung
- Zusammenführung aus Identity, Package, Permission und Modul-Status

### Datenmodell
- userId
- packageId
- packageState
- roleSet
- moduleAccessSet
- featureAccessSet
- uiPreferenceSet

### Beziehungen
- n:1 zu Identity
- n:1 zu Package / Plan
- 1:n zu Permission Assignment
- 1:n zu UI Preferences

### Abhängigkeiten
- auf Policy-/Permission-Services angewiesen
- nicht in Domain-Modulen verankert

### Zugriffskontrolle
- Restriktionen auf Service-/Policy-Ebene, nicht nur im UI

### Erweiterbarkeit
- User-Profile und App-Scope bleiben erweiterbar

### Wiederverwendbarkeit
- generischer Service, keine CatchTrack-spezifische Logik

## Ebene 3: Package / Plan
### Zweck
Definiert den verfügbaren Vertrags-/Leistungsumfang für einen Nutzer.

### Verantwortlichkeit
- Plan-/Paketdefinition
- Definition der enthaltenen Module und Features
- Bereitstellung der Default-Werte für Entitlements
- Down-/Upgrade- und Upgrade-Änderungskontekste

### Datenmodell
- packageId
- packageName
- packageType
- status
- entitlements
- moduleAllowList
- featureAllowList
- upgradeRules
- downgradeRules
- visibilityRules

### Beispiele
- Free
- Basic
- Standard
- Premium
- Beta
- Preview
- enterprise-like future package

### Beziehungen
- 1:n zu User
- 1:n zu PermissionSet
- 1:n zu ModuleAccessPolicy
- 1:n zu FeatureAccessPolicy

### Abhängigkeiten
- keine Direktabhängigkeit zu CatchTrack-Fachmodulen
- packageDefinition bleibt generisch

### Zugriffskontrolle
- package muss als Vertragsrahmen, nicht als UI-Entscheidung dienen

### Erweiterbarkeit
- neue Pakete ohne Core-Umbau möglich

### Wiederverwendbarkeit
- Plattform-/Framework-Ebene

## Ebene 4: Permissions
### Zweck
Definiert die allgemeinen Berechtigungen und Entitlements.

### Verantwortlichkeit
- Rechte- und Entitlement-Logik
- Kombination aus Package-, User- und Modul-Policies
- sichere, zentrale Berechnung des effektiven Zugriffs

### Datenmodell
- permissionId
- permissionType
- scope
- targetType
- targetId
- grantSource
- isActive
- expiresAt (optional)

### Beispieltypen
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
- Policy-Engine, nicht UI-Logik

### Zugriffskontrolle
- nur Service-/Server-/Policy-Schicht darf die effektive Berechtigung auswerten

### Erweiterbarkeit
- neue Permission-Typen ohne Core-Umbau

### Wiederverwendbarkeit
- generischer Service

## Ebene 5: Module Access
### Zweck
Bestimmt, ob ein Modul für einen User oder ein Paket technisch zugänglich ist.

### Verantwortlichkeit
- Modul-Entitlement
- Modul-Installationszustand
- Modul-Status als Plattformkontext
- Security-Gateway für Modul-Funktionen

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
- Auf Service-/Policy-Ebene prüfen
- Das UI zeigt nur Sichtbarkeit, nicht Autorisierung

### Erweiterbarkeit
- neue Module und neue modulare Feature-Sets möglich

### Wiederverwendbarkeit
- Plattform-/Framework-Ebene

## Ebene 6: Feature Access
### Zweck
Bestimmt, ob einzelne Funktionen eines Moduls für einen User zugänglich sind.

### Verantwortlichkeit
- granularer Zugriff auf Features und Actions
- Schutz von sensiblen Aktionen und Screens
- Trennung zwischen Sichtbarkeit und tatsächlicher Ausführung

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
- n:1 zu UI-Routing oder Menüeintrag

### Abhängigkeiten
- Module, Permission, UI Menu Policy

### Zugriffskontrolle
- Service-/API- und Feature-Policy-Ebene

### Erweiterbarkeit
- neue Features ohne Core-Umbau möglich

### Wiederverwendbarkeit
- generischer Service und generisches UI-Metadatenmodell

## Ebene 7: UI / Menu Visibility
### Zweck
Definiert, was der Nutzer in der Oberfläche sehen darf.

### Verantwortlichkeit
- Menüeinträge, Buttons, Tabs, Vorschau, Ausblenden, Priorisierung
- Laufzeit-Filterung basierend auf aktuellen Berechtigungen und Modulzuständen

### Datenmodell
- menuId
- menuLabel
- parentMenuId
- moduleId
- featureId
- visibilityRule
- packageScope
- permissionScope
- isDisabled
- isPreview
- priority
- route

### Beziehungen
- n:1 zu Module Access
- n:1 zu Feature Access
- n:1 zu User Preference
- n:1 zu Package

### Abhängigkeiten
- UI Policy Manager
- User Preference Service
- Permission Engine

### Zugriffskontrolle
- UI darf nur anzeigen, was sichtbar sein darf
- UI prüft nicht die endgültige Autorisierung

### Erweiterbarkeit
- dynamische Menüs für andere Apps möglich

### Wiederverwendbarkeit
- generisches UI-Framework mit App-übergreifender Datenstruktur

## Kritische Bewertung der Reihenfolge
Die Reihenfolge Identity → User → Package / Plan → Permissions → Module Access → Feature Access → UI / Menu Visibility ist technisch sinnvoll, sofern sie als Berechnungspipeline verstanden wird und nicht als UI-Entscheidung mit übergeordneter Sichtbarkeit.

Die zentrale Korrektur ist: UI Visibility ist nicht die Quelle der Autorisierung; sie ist der letzte Filter. Der tatsächliche Berechtigungsentscheid liegt bei Permission, Module Access und Feature Access. Die UI entscheidet nur noch, was einem Nutzer angezeigt werden darf.

## Package-System
### Zweck
Package / Plan ist der Vertragsrahmen für eine Benutzerklasse oder Leistungsstufe.

### Was gehört zum Package?
- Plan-Name und Typ
- Module- und Feature-Entitlements
- Standard-Berechtigungen
- Preview-, Beta- und Upgrade-Regeln
- visibilityDefaults
- downgradeRules

### Was gehört zur Permission?
- konkrete Berechtigungen eines Benutzers oder einer Session
- temporäre Freigaben
- modul- und feature-spezifische Zusätze
- Abweichungen vom Paket

### Was gehört zum Modul?
- Modul-ID, Metadaten, Lebenszyklus, Abhängigkeiten, Konfiguration, Features
- keine direkte App- oder Paket-Logik

### Was gehört zur Anwendung?
- CatchTrack-specific UI, App-Branding, Bootstrapping, konkrete Module und App-Logik

### Paketwechsel
- Beim Wechsel muss der neue effektive Status sofort berechnet werden.
- Berechtigungen aus dem alten Paket dürfen nur nach den Regeln der neuen Lage wirksam sein.
- Nutzer muss keine Modul-Installation verlieren, wenn die Berechtigung für das Modul an das Paket gebunden war.

### Downgrade
- Features und Module, die im neuen Paket nicht erlaubt sind, werden deaktiviert oder als Preview/blocked gemeldet.
- bisherige Installationen müssen nicht automatisch gelöscht werden, sofern das Modul weiterhin auf der Plattform vorhanden ist.
- das UI zeigt nur die aktuellen gültigen Zustände an

### Deaktivierte Module
- Ein deaktiviertes Modul darf nicht aktiv in der UI verwendet werden.
- Es kann als nicht aktiv, optional verfügbar oder preview-visible erscheinen.

### Nicht installierte Module
- Nicht installierte Module sind nicht aktiv, aber als installierbar oder verfügbar einsehbar.
- Das Paket und die Permissions entscheiden, ob sie für den Nutzer angezeigt oder installierbar sind.

## Module Lifecycle
Die logisch saubere Reihenfolge ist:

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

Die Reihenfolge ist grundsätzlich sinnvoll, aber die Zustände sollten als Plattformzustand und nicht als reine UI-Statusbeschreibung behandelt werden.

Wichtiger Punkt:
Ein Benutzer darf ein nicht benötigtes Modul deinstallieren, ohne dass seine Berechtigung für dieses Modul verloren geht.

Nach der Deinstallation muss das Modul als verfügbar/installierbar erscheinen können, wenn der Nutzer bzw. das Paket das Modul wieder aktiviert oder erneut installiert.

Das bedeutet:
- Deinstallation entfernt die Installations-/Runtime-Instanz, nicht die Berechtigung an sich.
- Berechtigungen bleiben als Entitlement oder Package-Seat erhalten, sofern das Paket oder die Permission sie noch gewährt.
- Das Materialisieren der endgültigen Sichtbarkeit erfolgt durch das Permission-/Module-Access-System, nicht nur über den UI-Menükontext.

## Permission vs. UI Visibility
### Definition
Permission ist die effektive Autorisierung. UI Visibility ist nur der Präsentationsfilter.

### UI-Menü
UI-Menü entscheidet nur, was angezeigt wird.

### Buttons
Für einzelne Buttons gilt: UI kann den Button verbergen, aber die tatsächliche Execution wird immer auf Service-/API-Ebene autorisiert.

### Aktionen
Aktionen müssen auf Service-/Server-Ebene geprüft werden.

### Module
Module-Level-Zugriff erfolgt über Module Access Policy.

### Features
Feature-Level-Zugriff erfolgt über Feature Access Policy.

### API-/Service-Zugriff
API- und Service-Zugriffe müssen immer serverseitig und policybasiert geprüft werden.

## UI-/Menüvertrag
### Anforderungen
- dynamische Menüs
- modulare Menüeinträge
- permission-aware menu entries
- package-aware menu entries
- install-state-aware menu entries
- Preview-/Upgrade-Anzeigen für gesperrte Features
- CatchTrack-Anwendung kann eigene Menüpunkte ergänzen
- andere Apps können eigene Menüdefinitionen ergänzen

### Allgemeiner Vertrag
- Module liefern Menü-Definitionen als Metadaten
- UI rendert nur auf Basis des aktuellen Policy-States
- Visibility-Policy entscheidet, was sichtbar ist
- echte Autorisierung bleibt außerhalb des UI-Metadatenmodells

## Sicherheit
### UI-only Permission Checks
Niemals ausreichend.

### Serverseitige Autorisierung
Muss immer erfolgen.

### Direkte API-Aufrufe
Müssen policybasiert geprüft werden.

### Manipulierte Requests
Dürfen niemals als gültige Authorization gelten.

### Fehlende Module
Ein fehlendes Modul darf nicht als aktiv oder autorisiert betrachtet werden.

### Deaktivierte Module
Ein deaktiviertes Modul bleibt technisch nicht als aktiviert gültig.

### Paket-Downgrade
Ein Downgrade muss zu einem neuen gültigen Zugriffszustand führen, ohne die App in einen inkonsistenten Zustand zu bringen.

### Berechtigungsänderungen
Änderungen müssen sofort zur nächsten Auswertung der Policy führen; UI und Service müssen sich konsistent neu evaluieren.

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
- route/visibility filter
- preview/upgrade states

### Module Manager
- Modulstatus- und Installationsverwaltung

### CatchTrack-Anwendung
- konkrete App-Init, Branding, Domain-Module, App-Flow

### CatchTrack-Fachmodul
- CatchTrack-domain features like catches, equipment, GPS, weather, calendar

## Architekturvarianten

### Variante A: Policy-first service model
#### Beschreibung
Echte Autorisierung und Entitlement bleiben in einer Policy-/Permission-Service-Schicht. UI Visibility ist ein separater Filter auf Basis des effektiven Zustands.

#### Vorteile
- höchste Sicherheit
- beste Trennung von Permission und UI
- gut für spätere Wiederverwendung
- gut für Store-/App-Strategie
- klarer Lifecycle bei Paketwechseln und Downgrades

#### Nachteile
- etwas mehr Infrastruktur und Policy-Schichten
- die erste Struktur ist komplexer als ein UI-only Ansatz

#### Sicherheitsauswirkungen
- stark positiv

#### Wartbarkeit
- gut

#### Komplexität
- mittel bis hoch

#### Erweiterbarkeit
- hoch

#### Wiederverwendbarkeit
- hoch

#### Auswirkungen auf Store-/App-Perspektive
- sehr gut

#### Auswirkungen auf bestehende Module
- erfordert saubere Entitlement- und UI-Abstraktionen

#### Auswirkungen auf Core
- keine direkte Core-Änderung nötig

### Variante B: UI-first visibility model
#### Beschreibung
Das UI entscheidet anhand von Menü- und Feature-Attributen, ob etwas sichtbar ist. Echte Autorisierung bleibt teilweise im UI oder in einzelnen Modulen.

#### Vorteile
- schneller umzusetzen
- einfacher in der ersten Perspektive

#### Nachteile
- unsicherer als Policy-first
- UI-Sichtbarkeit und echte Berechtigung werden vermischt
- schlechter für spätere Wiederverwendung und Store-/App-Strategie
- höheres Risiko bei manipulierten Requests

#### Sicherheitsauswirkungen
- schwach bis mittel

#### Wartbarkeit
- geringer

#### Komplexität
- niedrig upfront, aber später höher

#### Erweiterbarkeit
- mittel

#### Wiederverwendbarkeit
- gering

#### Auswirkungen auf Store-/App-Perspektive
- schwach

#### Auswirkungen auf bestehende Module
- höheres Risiko, dass Module auf UI-Status statt Policy-Status reagieren

#### Auswirkungen auf Core
- keine Änderung im Core nötig, aber schlechte Architektur-Verfestigung in Modulen

## Empfehlung
Die bevorzugte Architektur ist Variante A: Policy-first service model.

Grund:
- klare Trennung von Berechtigung und UI-Sichtbarkeit
- besser für Sicherheit, Wartbarkeit und spätere Wiederverwendung
- kompatibel mit neutraler Plattformarchitektur
- gut geeignet für spätere Store- oder App-Verpackung
- schützt den Core-Freeze und lässt CatchTrack als erste Anwendung auf der Plattform

## Offene Entscheidungen
- Welche Entitlements sind Paket-spezifisch, welche user-spezifisch?
- Wie werden Modul-Entitlements beim Deinstallieren und erneuten Installieren verwaltet?
- Welche UI- und Menüattribute müssen generisch und welche app-spezifisch sein?
- Welche Service-Ebene ist die autoritative Entscheidung für Permission, Module Access und Feature Access?
- Welche App-übergreifende Struktur unterstützt spätere Anwendungen ohne CatchTrack-Entscheidungen zu verfestigen?

## Abschlussklarstellung
Diese Datei ist eine dauerhafte Architektur-Dokumentation. Sie dokumentiert die Zielarchitektur ohne produktive Implementierung. Das Projekt bleibt im Design-/Review-Status für diese P0-Lücke.
