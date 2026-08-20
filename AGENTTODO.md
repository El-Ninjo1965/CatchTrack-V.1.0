# AGENTTODO

## Erledigt
- GPS-Modul als registriertes, aktivierbares, persistentes User-Modul in der Registry und UI verknüpft.
- Offline-First-Developer-Flow mit einem einzigen lokalen Auth-Zustand für Setup, Reload und Login stabilisiert.
- Zentraler App-Name konfiguriert und in der User-UI verwendet.
- Neutraler Startseiten- und Modul-UI-Flow umgesetzt: Login erhalten, keine sichtbare „Modules“-Heading mehr, aktive Module als Buttons dargestellt.
- Sichtbarer Modulname und technischer Name sauber getrennt; GPS erscheint als `GPS`.
- Admin-Zugang über den normalen Auth-Zustand stabilisiert; Rollen werden aus dem authentifizierten Zustand abgeleitet.
- Admin-Menü und Admin-Module erweitert: Module können jetzt im Admin-UI aktiviert/deaktiviert werden und der GPS-Adminbereich bietet echte Verwaltungsaktionen (Get Current Position, Start Tracking, Stop Tracking).
- Session-/Reload-Schutz ergänzt: persistierte Auth-Sitzungen werden nur noch mit gültigem Browser-Storage behandelt.
- GPS-Button-Labels in der Benutzeroberfläche auf die konkreten Vorgänge korrigiert (`Get Current Position`, `Start Tracking`, `Stop Tracking`).
- Workflow-Dokumentation mit dem aktuellen stabilen Zwischenstand aktualisiert.
- Zentrale Rollen-/Rechte-Registrierung für framework-overarching governance ergänzt.
- Erste App-Basis für CatchTrack als neutraler Starter-Application-Shell angelegt.
- Erstes Dashboard-Modul als modulare Landing-/Overview-Funktion erstellt.
- Zusätzliches Business-Modul `catch-log` erstellt und in die erste App-Shell integriert.
- Zweites Business-Modul `fishing-spots` als GPS-gestützter Lage-/Favoriten-Manager ergänzt.
- `VERSION.md` als Versionierungs- und Zustandsdokument eingeführt.
- Generische Module-Templates im Admin hinzugefügt, damit neue Module aus vorgefertigten Schemata erstellt werden können.
- Modul-/Rollen-Permissions-Ansicht erweitert, sodass systemweite und modulare Rechte zusammen sichtbar sind.
- Benutzerprofil- und Einstellungsbereich für Funktionsauswahl, Privacy-Controls und lokale Sync-Entscheidungen ergänzt.
- GPS-Modul gegen den nicht aktivierten Zustand abgesichert; Start- und Abfrageaktionen aktivieren das Modul jetzt automatisch und bleiben damit im echten User-Flow nutzbar.
- Admin-Lebenszyklus für Module erweitert: Installieren, Deaktivieren und Deinstallieren sind nun als echte Framework-Aktionen im Admin-Panel verfügbar, ohne die Kernarchitektur zu gefährden.
- Storage-/Connection-Architektur erweitert: Der Admin kann jetzt im Bereich „Connections“ zwischen Text/JSON-Dateien und SQL-Varianten wie SQLite/MySQL/PostgreSQL wechseln und die Konfiguration direkt im Framework-/Admin-Workflow persistieren.
- Connection-Model und default Config erweitert, damit die Daten-Speicherstrategie nicht hart verdrahtet, sondern im Admin konfigurierbar ist.
- Live-Storage-Adapter ergänzt: File-Storage nutzt jetzt echte JSON-Dateien im Server-Runtime-Verzeichnis, während SQL-Varianten als konfigurierbare, zukunftsfähige Adapter-Modelle im Admin-Workflow nutzbar sind und die Verbindung direkt validiert.
- SQLite-Adapter implementiert: Der SQL-Pfad nutzt nun echte SQLite-Datenbanken im Runtime-Verzeichnis und unterstützt Schreiben, Lesen, Auflisten und Löschen mit persistenter Datenhaltung.
- Berechtigungsprüfung für resource-scoped User-Schreibrechte korrigiert: Entwickler/Admins können nun Benutzer anlegen und verwalten, ohne durch eine doppelte `user:user:write`-Prüfung blockiert zu werden.
- Admin-Benutzerverwaltung erweitert: Bestehende Nutzer können jetzt direkt im Adminbereich bearbeitet werden, inklusive Benutzername, Anzeigename, E-Mail, Rolle, Berechtigungen und Status.
- Modul-Governance im Admin erweitert: Module lassen sich jetzt direkt im Admin-Workspace über App-ID, Name, Display-Name, Beschreibung, Berechtigungen, Fähigkeiten und Status verwalten. Damit werden einzelne Module als echte CMS-artige Einträge im Framework gesteuert, statt nur als rohe Registry-Objekte zu bestehen.
- Modul-Editor im UI ergänzt: Module können im Adminbereich direkt über eine Metadata-Form bearbeitet und per Toggle/Back-Flow zurück in der Verwaltungsübersicht gesteuert werden.
- App-spezifische Modul-Zugriffskontrolle ergänzt: Jede App kann jetzt pro Modul und pro Rolle explizit festlegen, ob ein Modul für bestimmte Rollen freigegeben oder blockiert ist. Das wirkt sich in der User-UI direkt auf die sichtbaren Module aus und bildet die Grundlage für modulare App-Varianten ohne Core-Rework.
- App-spezifische Feature-Zugriffskontrolle ergänzt: Neben Modulen gibt es jetzt auch eine app- und rollenbasierte Feature-Matrix, damit Feature-Gruppen wie Dashboard, Profile, Module oder zukünftige Module-Bereiche für einzelne Rollen frei- oder gesperrt werden können, ohne das Core-Framework anzufassen.
- Generische Daten-/Schema-Engine im Admin ergänzt: Der Admin hat jetzt eine eigene "Data"-Ansicht, in der Entity-Schemata angelegt, Felder definiert, bearbeitet und Record-Einträge per Formular erstellt und gelöscht werden können, ohne das Core-Framework manuell zu erweitern.
- Retail-Store-Template als echte Referenz-App für die Framework-Validierung ergänzt: Ein neues App-Template mit Produkt-, Kategoriens-, Kunden- und Bestell-Schemata wurde eingeführt, damit das neutrale Framework mit einem realen Business-Szenario geprüft wird, ohne das Core hardcoded an ein Einzelprodukt zu binden.
- Store-UI-Module ergänzt: Für das Retail-Store-Template wurden echte Laufzeitmodule für Katalog, Bestellungen und Kunden hinzugefügt, sodass die neutralen Entity-Schemas jetzt auch in einer sichtbaren, realen Shopping-/CRM-UI genutzt werden.

## Getestet
- `node --test tests/master-framework.test.js` erfolgreich ausgeführt.
- Verifiziert: GPS-Lebenszyklus ohne Duplicate Watcher, LocalAuth/Setup-Login-Reload-Persistenz, zentrale App-Name-Konfiguration, neutraler User-UI-Flow, Framework-Regressionen, Admin-Module-/GPS-Verwaltung, neue App-/Modul-Scaffolding-Integration, Module-Templates, zentraler Permissions-Overlay, korrigierte Admin-Berechtigungen für Benutzerverwaltung, direkte Benutzerbearbeitung im Admin-Panel, die neue Modul-Metadaten-Governance im Admin-Workspace, die app-spezifische Modul-/Rollen-Matrix für die aktive App und die app-spezifische Feature-/Rollen-Matrix für Feature-Gruppen innerhalb der App.
- Browserseitige Logik wurde anhand der tatsächlichen API-Verwendung und des erwarteten UI-Verhaltens geprüft: kein automatischer GPS-Start, Start/Stop/GetCurrentPosition auf echter Geolocation-API, korrekte Status- und Fehlermeldungen, Modul-Discovery für die erste App-Shell, die Erstellung neuer Module aus Templates und die echte Bearbeitung vorhandener Benutzerprofil- und Rollenwerte.

## Tatsächlich funktional
- User-Login funktioniert über das normale User-Interface.
- Lokaler Dev-Login und Setup nutzen denselben persistenten Auth-Zustand.
- Rollen werden aus dem authentifizierten Zustand ermittelt und nicht aus der angezeigten Seite.
- Administratorzugriff wird über den normalen Auth-Zustand erkannt, ohne separate Login-Pfade zu benötigen.
- GPS bleibt ein echtes registriertes Modul; Tracking startet erst nach explizitem Benutzer-Start.
- Startseite und Navigation sind neutral und stabil.
- Admin-Module können aktiv/deaktiviert werden; der GPS-Adminbereich steuert die echte Geolocation-API an.
- Die erste produktive App-Basis (`catchtrack`) ist als modulare App-Definition aktiv.
- Das Dashboard-Modul dient als erster generischer App-Home und als Vorlage für spätere Module.
- Das Catch-Log-Modul ist die erste echte fachliche Module-Instanz mit lokalem Datensatz und einfacher Eingabe.
- Der Admin kann jetzt Module aus Templates generieren und die Rechte-/Modulmatrix präventiv verwalten.

## Architektur- und Freigabe-Status
- Grundprinzip: Jede App inklusive Admin und Server muss eigenständig und unabhängig arbeiten. Keine App darf in der Architektur von einer anderen App abhängen.
- Keine weiteren app-abhängigen Module werden installiert, solange nicht die Kernarchitektur, Admin-Governance, Rollen-/Rechte-Logik, Storage-/Connection- und Server-/Runtime-Struktur für eine eigenständige App-Instanz vollständig durchlaufen, stabil und mit deinem Review freigegeben sind.
- Der aktuelle Arbeitsblock ist bewusst auf Framework-Konsolidierung, App-Entkopplung und Admin-/Server-Integration ausgerichtet, nicht auf neue Domain-Module.

## Offen / Nächster Arbeitsfortschritt
- Abschluss der eigenständigen App-Architektur: Jede App trägt ihren eigenen Runtime-/Admin-Kontext, Rollen-/Permission-Scope und Storage-/Server-Kontext, ohne auf andere Apps zuzugreifen.
- Abschluss der systemischen Validierung: App-Setup, Server-Setup, Admin-Login, Rollen-/Rechte-Checks, Connections, Storage-Adapter und App-Template-Instanziierung müssen ohne Cross-App-Abhängigkeit sauber funktionieren.
- Nächster logischer Schritt: eine generische Daten-/Schema-Engine für app-lokale Business-Objekte, damit Module und spätere App-Varianten (z. B. Store, CRM, Booking, Portal) mit einheitlichen Schema-, CRUD- und Rechte-Mechaniken arbeiten, ohne das Core-Framework für jede neue App hart zu erweitern.
- Danach: erst nach freiem Review und Zustimmung, neue fachliche App-Module oder neue Server-/Admin-Features ergänzen.
- Reale Hosting- und Deployment-Validierung: shared hosting, JSON/Text-Storage, optional SQL-Upgrade-Pfad und eigenständige App-Instanzierung nach dem vorher festgelegten Framework-Prinzip.

## Aktuell in Arbeit
- App-Umgebung und Runtime-Context wurden auf eigenständige App-Instanzen umgestellt.
- Die aktive App wird zentral als eigener Konfigurations-/Runtime-Kontext verwaltet, mit eigener Storage-Namespace, Admin-Scope und isolierter Server-/UI-Konfiguration.
- Die Server-Initialisierung nutzt jetzt einen app-spezifischen Bootstrap-Workflow statt hart codierter Global-Registrierungen.
- Die Framework-Validierung läuft über eine gezielte Runtime-Regression zur App-Isolation, damit keine Cross-App-Kontamination mehr entsteht.
- Der Admin hat jetzt ein eigenes App-Konfigurations-Panel für aktive App-Auswahl, App-Name, Modus und Storage-Strategie erhalten, damit Branding und Datenhaltung direkt im CMS-artigen Admin gesteuert werden können.
- Die generische Data-/Schema-Engine wurde ergänzt: app-spezifische Entity-Schemata, Validierung, CRUD-Operations und persistente Record-Storage folgen jetzt einem zentralen, wiederverwendbaren Muster und sind für spätere Module und Store-/App-Templates vorbereitet.
- Architektur- und Freigabe-Block aktiv: keine neuen appabhängigen Module mehr bis zur vollständigen, geprüften Eigenständigkeit der App-/Admin-/Server-Instanz.
