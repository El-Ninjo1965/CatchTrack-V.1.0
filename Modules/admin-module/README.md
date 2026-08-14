# Framework Admin Module

**Version:** 1.0.0  
**Status:** ✓ Abgeschlossen  
**Rolle:** Verwaltungs- und Steuerwerkzeug  
**Letzte Aktualisierung:** 2026-08-14

## Zweck

Das Admin-Modul bietet generische Verwaltungs- und Diagnostikfunktionen für das neutrale Framework. Es überwacht Systemstatistiken, Fehler und den Gesundheitszustand der Plattform, ohne fachliche Anwendungsspezifika zu kennen.

## Funktionen

- Systemstatistiken und Modul-Übersicht
- Fehlerprotokollierung und -verwaltung
- Gesundheitsprüfung des Systems (Health Check)
- Debug-Informationen
- Echtzeit-Systemüberwachung

## API

### Methoden

#### `getSystemStats()`
Gibt die aktuellen Systemstatistiken zurück.

```javascript
const stats = AdminModule.getSystemStats();
```

**Rückgabe:**
```javascript
{
    uptime: number,           // Laufzeit in Millisekunden
    moduleCount: number,      // Anzahl geladener Module
    modules: array,           // Array von Modul-Informationen
    errorCount: number,       // Gesamtanzahl Fehler
    recentErrors: array,      // Letzte 10 Fehler
    startedAt: string         // ISO-Zeitstempel des Starts
}
```

---

#### `getLoadedModules()`
Gibt alle geladenen Module zurück.

```javascript
const modules = AdminModule.getLoadedModules();
```

**Rückgabe:** Array von Modul-Objekten

---

#### `getErrorLog()`
Gibt das komplette Fehlerprotokoll zurück.

```javascript
const errors = AdminModule.getErrorLog();
```

**Rückgabe:** Array von Fehler-Objekten

---

#### `clearErrorLog()`
Löscht das Fehlerprotokoll.

```javascript
AdminModule.clearErrorLog();
```

---

#### `performHealthCheck()`
Führt eine Gesundheitsprüfung des Systems durch.

```javascript
const health = AdminModule.performHealthCheck();
```

**Rückgabe:**
```javascript
{
    timestamp: string,           // Zeitstempel der Prüfung
    coreLoaded: boolean,         // Core-Komponente geladen
    moduleManagerLoaded: boolean, // Modul-Manager geladen
    userModuleLoaded: boolean,   // User-Modul geladen
    eventsWorking: boolean,      // Event-System funktioniert
    storageAccessible: boolean,  // Speicher zugänglich
    healthy: boolean             // Allgemeiner Gesundheitsstatus
}
```

---

#### `getDebugInfo()`
Gibt vollständige Debug-Informationen aus.

```javascript
const debug = AdminModule.getDebugInfo();
```

**Rückgabe:**
```javascript
{
    timestamp: string,      // Zeitstempel
    environment: object,    // Umgebungsinformationen
    systemStats: object,    // Systemstatistiken
    healthCheck: object     // Gesundheitsprüfung
}
```

---

#### `logError(error)`
Protokolliert einen Fehler manuell.

```javascript
try {
    // Code
} catch (error) {
    AdminModule.logError(error);
}
```

**Parameter:**
- `error` (Error|object) - Fehler-Objekt

## Fehler-Objektstruktur

```javascript
{
    timestamp: string,    // ISO-Zeitstempel
    message: string,      // Fehlermeldung
    stack: string,        // Stack-Trace
    type: string          // Fehlertyp (z.B. 'TypeError')
}
```

## Modul-Objektstruktur

```javascript
{
    name: string,         // Modulname
    version: string,      // Modulversion
    registeredAt: string, // ISO-Zeitstempel der Registrierung
    status: string        // Status (z.B. 'registered')
}
```

## Events

Das Modul gibt folgende Events aus:

- `admin-module:initialized` - Modul wurde initialisiert
- `admin-module:activated` - Modul wurde aktiviert
- `admin-module:deactivated` - Modul wurde deaktiviert
- `admin-module:error-logged` - Fehler protokolliert
- `admin-module:error-log-cleared` - Fehlerprotokoll gelöscht

## Dateistruktur

```
Modules/admin-module/
├── admin-module.js       # Hauptmodul
├── admin-interface.js    # Modulschnittstelle
└── README.md             # Diese Datei
```

## Entwicklung und Tests

### Health Check durchführen

```javascript
const health = AdminModule.performHealthCheck();
console.log(health.healthy ? 'System OK' : 'Fehler im System');
```

### Systemstatistiken überwachen

```javascript
setInterval(() => {
    const stats = AdminModule.getSystemStats();
    console.log(`Laufzeit: ${stats.uptime}ms`);
    console.log(`Module: ${stats.moduleCount}`);
    console.log(`Fehler: ${stats.errorCount}`);
}, 5000);
```

### Debug-Informationen abrufen

```javascript
const debug = AdminModule.getDebugInfo();
console.log(JSON.stringify(debug, null, 2));
```

## Zukünftige Erweiterungen

- Performance-Monitoring
- Ressourcennutzung (Memory, CPU)
- Detaillierte Logs mit verschiedenen Log-Levels
- Automatische Fehlerbenachrichtigungen
- Datenbank-Statistiken
- Benutzeraktivitäts-Tracking
