# AGENTTODO

## Erledigt
- GPS-Modul als registriertes, aktivierbares, persistentes User-Modul in der Registry und UI verknüpft.
- Offline-First-Developer-Flow mit einem einzigen lokalen Auth-Zustand für Setup, Reload und Login stabilisiert.
- Zentraler App-Name konfiguriert und in der User-UI verwendet.
- Neutraler Startseiten- und Modul-UI-Flow umgesetzt: Login erhalten, keine sichtbare „Modules“-Heading mehr, aktive Module als Buttons dargestellt.
- Sichtbarer Modulname und technischer Name sauber getrennt; GPS erscheint als `GPS`.
- Auth-, GPS- und App-Name-Prüfung erfolgreich validiert.
- Workflow-Dokumentation aktualisiert und zusammen mit den Änderungen committed/pushed.
- Finaler GitHub-Sync-Check mit HEAD-Vergleich durchgeführt.

## Getestet
- `npm test` vollständig ausgeführt.
- Verifiziert: GPS-Lebenszyklus ohne Duplicate Watcher, LocalAuth/Setup-Login-Reload-Persistenz, zentrale App-Name-Konfiguration, neutraler User-UI-Flow und Framework-Regressionen.
- Browser-seitige Logik wurde anhand der tatsächlichen API-Verwendung und des erwarteten UI-Verhaltens geprüft: kein automatischer GPS-Start, Start/Stop/GetCurrentPosition auf echter Geolocation-API, korrekte Status- und Fehlermeldungen.

## Tatsächlich funktional
- User-Login funktioniert über das normale User-Interface.
- Lokaler Dev-Login und Setup nutzen denselben persistenten Auth-Zustand.
- Rollen werden aus dem authentifizierten Zustand ermittelt und nicht aus der angezeigten Seite.
- Administratorzugriff wird über den normalen Auth-Zustand erkannt, ohne separate Login-Pfade zu benötigen.
- GPS bleibt ein echtes registriertes Modul; Tracking startet erst nach explizitem Benutzer-Start.
- Startseite und Navigation sind neutral und stabil.

## Offen / Nächster Prüfpunkt beim nächsten Arbeitsbeginn
- Keine kritischen offenen Implementierungsblocker im aktuellen Stand.
- Wenn später weitere Web- oder Server-Funktionen ergänzt werden, zuerst die Auth-/Session-Konsistenz und die Module-Registrierung erneut prüfen, bevor neue Features ergänzt werden.
- Nächster sinnvoller Startpunkt: lokaler Login-/Admin-Status nach Reload erneut verifizieren, danach erst neue Features ergänzen.
