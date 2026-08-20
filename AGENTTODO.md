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

## Getestet
- `npm test` vollständig ausgeführt.
- Verifiziert: GPS-Lebenszyklus ohne Duplicate Watcher, LocalAuth/Setup-Login-Reload-Persistenz, zentrale App-Name-Konfiguration, neutraler User-UI-Flow, Framework-Regressionen, Admin-Module-/GPS-Verwaltung, neue App-/Modul-Scaffolding-Integration, Module-Templates und zentraler Permissions-Overlay.
- Browserseitige Logik wurde anhand der tatsächlichen API-Verwendung und des erwarteten UI-Verhaltens geprüft: kein automatischer GPS-Start, Start/Stop/GetCurrentPosition auf echter Geolocation-API, korrekte Status- und Fehlermeldungen, Modul-Discovery für die erste App-Shell und die Erstellung neuer Module aus Templates.

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

## Offen / Nächster Arbeitsfortschritt
- Nächster sinnvoller Schritt: weiteres fachliches App-Modul erstellen, das über Catch Log hinaus stärker produktiv und anwendungsnah funktioniert.
- Danach: app-spezifische Module und Rollen-/Rechte-Zuordnung pro Modul und per Feature pro App erweitern.
- Danach: weitere erste fachliche App-Module neben GPS, Catch Log und Dashboard, z. B. Profil-, Standort- oder Aktivitätsbereiche.
- Die Umsetzung bleibt bewusst im neutralen Framework, damit spätere App-Varianten ohne Rework ergänzt werden können.
