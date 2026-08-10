-- CatchTrack
-- Migration 006: Waters location separation and fangplatz photo support
-- Version: 6.0
-- Date: 2026-08-10

PRAGMA foreign_keys = ON;

ALTER TABLE waters
ADD COLUMN city TEXT;

ALTER TABLE waters
ADD COLUMN gps_accuracy_m REAL;

ALTER TABLE waters
ADD COLUMN gps_timestamp TEXT;

UPDATE waters
SET city = NULL
WHERE city IS NULL;

UPDATE waters
SET gps_accuracy_m = NULL
WHERE gps_accuracy_m IS NULL;

UPDATE waters
SET gps_timestamp = updated_at
WHERE gps_timestamp IS NULL
  AND gps_lat IS NOT NULL
  AND gps_lon IS NOT NULL;

CREATE INDEX IF NOT EXISTS
idx_waters_user_city
ON waters(user_id, city);

CREATE INDEX IF NOT EXISTS
idx_waters_user_gps
ON waters(user_id, gps_lat, gps_lon);

CREATE TABLE IF NOT EXISTS water_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    water_id INTEGER NOT NULL,

    file_name TEXT NOT NULL,

    mime_type TEXT NOT NULL
        DEFAULT 'image/webp',

    size_bytes INTEGER NOT NULL
        DEFAULT 0,

    width INTEGER NOT NULL
        DEFAULT 720,

    height INTEGER NOT NULL
        DEFAULT 720,

    cloud_status TEXT NOT NULL
        DEFAULT 'pending',

    cloud_id TEXT,

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(water_id)
);

CREATE INDEX IF NOT EXISTS
idx_water_photos_user
ON water_photos(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS
idx_water_photos_water
ON water_photos(water_id);