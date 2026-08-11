# CatchTrack GPS Module

**Version:** 1.0.0  
**Status:** ✓ Abgeschlossen  
**Rolle:** GPS-Positionsbestimmung und Standortbereitstellung  
**Letzte Aktualisierung:** 2026-08-11

## Zweck

Das GPS-Modul erfasst die geografische Position des Geräts über die native Browser Geolocation API und stellt die Daten über eine einheitliche, stabile Schnittstelle bereit.

Es ist vollständig eigenständig und besitzt keine Abhängigkeiten zu anderen CatchTrack-Modulen.

**Datenfluss:**
```
Andere Module → CatchTrackGpsModule (Schnittstelle)
```
Das GPS-Modul kennt keine anderen Module und benötigt sie nicht.

## Dateistruktur

```
Modules/gps-module/
├── gps-module.js      # Hauptlogik
├── gps-interface.js   # Öffentliche Schnittstelle (für andere Module)
├── gps-loader.js      # Registrierung und Aktivierung im Core
└── README.md          # Diese Datei
```

## Öffentliche Schnittstelle

Andere Module verwenden ausschließlich `window.CatchTrackGpsModule`:

```javascript
// Einmalige Positionsabfrage
const pos = await CatchTrackGpsModule.getCurrentPosition();

// Kontinuierliches Tracking
CatchTrackGpsModule.startTracking(null, onUpdate, onError);
CatchTrackGpsModule.stopTracking();

// Letzte bekannte Position
const pos = CatchTrackGpsModule.getLastPosition();

// Gültige frische Position vorhanden?
const ok = CatchTrackGpsModule.hasValidPosition();

// Aktueller Zustand
const state = CatchTrackGpsModule.getStatus();

// Browser-Permission prüfen
const perm = await CatchTrackGpsModule.checkPermission();

// Simulierte Testposition
CatchTrackGpsModule.setSimulatedPosition(48.137, 11.576, { accuracy: 10 });
CatchTrackGpsModule.clearSimulatedPosition();
```

## Normalisiertes Datenformat

```javascript
{
  latitude:         number,       // Dezimalgrad
  longitude:        number,       // Dezimalgrad
  accuracy:         number,       // Meter (Genauigkeit)
  altitude:         number|null,  // Meter über Meeresspiegel
  altitudeAccuracy: number|null,
  speed:            number|null,  // m/s
  heading:          number|null,  // Grad (0–360)
  timestamp:        string,       // ISO-8601
  source:           string,       // 'gps' | 'simulated'
  status:           string,       // 'available'
  isStale:          boolean       // true wenn älter als 5 Minuten
}
```

## Statuszustände

| Status | Bedeutung |
|---|---|
| `idle` | Keine Anfrage gestellt |
| `requesting` | Position wird ermittelt |
| `available` | Frische gültige Position vorhanden |
| `stale` | Position älter als 5 Minuten |
| `denied` | Berechtigung verweigert |
| `unavailable` | Standortdienste nicht verfügbar |
| `timeout` | Zeitüberschreitung (15s) |
| `error` | Anderer Fehler |

## Berechtigungen

Das Modul fordert die Berechtigung erst beim ersten Aufruf von `getCurrentPosition()` oder `startTracking()` an. Der Status kann vorab mit `checkPermission()` geprüft werden.

## Offline-Verhalten

Die Browser Geolocation API funktioniert ohne Internetverbindung (GPS, WLAN-Triangulation, Mobilfunk). Das Modul ist vollständig Offline-first.

## Tests

### Mit realer GPS-Hardware
- Seite öffnen → GPS-View aufrufen → „Position ermitteln"
- Berechtigung im Browser erteilen
- Position wird angezeigt

### Ohne GPS-Hardware (Testmodus)
```javascript
// Testposition setzen (kein Einfluss auf produktiven Datenfluss)
CatchTrackGpsModule.setSimulatedPosition(48.137, 11.576, { accuracy: 15 });

// Testen
const pos = await CatchTrackGpsModule.getCurrentPosition();
console.log(pos.source); // 'simulated'

// Simulation beenden
CatchTrackGpsModule.clearSimulatedPosition();
```

## Events

| Event | Auslöser |
|---|---|
| `gps-module:initialized` | Modul geladen |
| `gps-module:activated` | Modul aktiviert |
| `gps-module:deactivated` | Modul deaktiviert |
| `gps-module:requesting` | Positionsanfrage gestartet |
| `gps-module:position-updated` | Neue Position verfügbar |
| `gps-module:tracking-started` | Tracking begonnen |
| `gps-module:tracking-stopped` | Tracking beendet |
| `gps-module:error` | Fehler bei Positionsermittlung |

## Verwendung durch andere Module

```javascript
// Weather-Modul: GPS-Position für Wetterabfrage verwenden
const pos = await CatchTrackGpsModule.getCurrentPosition();
CatchTrackWeatherModule.setLocation(pos.latitude, pos.longitude, 'Mein Spot');

// Catch-Modul (zukünftig): Position bei Fangeintrag speichern
const pos = CatchTrackGpsModule.getLastPosition();
if (CatchTrackGpsModule.hasValidPosition()) {
  catch.location = { lat: pos.latitude, lon: pos.longitude };
}
```

## Bekannte Einschränkungen

- Genauigkeit abhängig von Gerät und Umgebung (Gebäude, Wälder reduzieren Genauigkeit)
- Safari/iOS benötigt HTTPS für Geolocation
- Kontinuierliches Tracking erhöht den Akkuverbrauch
- Kein automatischer Standortname (Reverse Geocoding nicht implementiert)
