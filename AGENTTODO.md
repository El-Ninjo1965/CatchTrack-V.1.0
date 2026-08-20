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
- `VERSION.md` als Versionierungs- und Zustandsdokument eingeführt.

## Getestet
- `npm test` vollständig ausgeführt.
- Verifiziert: GPS-Lebenszyklus ohne Duplicate Watcher, LocalAuth/Setup-Login-Reload-Persistenz, zentrale App-Name-Konfiguration, neutraler User-UI-Flow, Framework-Regressionen, Admin-Module-/GPS-Verwaltung und neue App-/Modul-Scaffolding-Integration.
- Browserseitige Logik wurde anhand der tatsächlichen API-Verwendung und des erwarteten UI-Verhaltens geprüft: kein automatischer GPS-Start, Start/Stop/GetCurrentPosition auf echter Geolocation-API, korrekte Status- und Fehlermeldungen, Modul-Discovery für die erste App-Shell.

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

## Offen / Nächster Arbeitsfortschritt
- Erste App und Dashboard sind angelegt; als nächster sinnvoller Schritt folgt die Standardisierung von Modul-Templates und App-Spezifikationen.
- Danach: modulare Rollen-/Rechte-Zuordnung pro Modul und pro App-Feature, um neue Module ohne Core-Änderung zu erweitern.
- Danach: erste echte fachliche App-Module neben GPS und Dashboard, z. B. Basisfunktionen für Standort-/Aktivitäts-/Profilbereiche.
- Die nächste Umsetzung bleibt bewusst im neutralen Framework, damit spätere App-Varianten ohne Rework ergänzt werden können.
