-- CatchTrack
-- Migration 001: Initial database structure
-- Version: 1.0
-- Date: 2026-08-08

PRAGMA foreign_keys = ON;


CREATE TABLE IF NOT EXISTS system (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    key TEXT UNIQUE NOT NULL,

    value TEXT,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS modules (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT UNIQUE NOT NULL,

    version TEXT,

    enabled INTEGER
        DEFAULT 0,

    status TEXT
        DEFAULT 'installed',

    config TEXT,

    database_ready INTEGER
        DEFAULT 0,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS fish (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    scientific_name TEXT UNIQUE NOT NULL,

    family TEXT,

    minimum_size REAL,

    record_weight REAL,

    description TEXT,

    image TEXT,

    verified INTEGER
        DEFAULT 1,

    created_by TEXT,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS fish_names (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    fish_id INTEGER NOT NULL,

    language TEXT NOT NULL,

    name TEXT NOT NULL,

    verified INTEGER
        DEFAULT 1,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fish_id)
        REFERENCES fish(id)
        ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS waters (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    type TEXT,

    country TEXT,

    region TEXT,

    description TEXT,

    gps_lat REAL,

    gps_lon REAL,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS equipment (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    category TEXT,

    name TEXT,

    brand TEXT,

    model TEXT,

    description TEXT,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS catches (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    fish_id INTEGER,

    fish_name TEXT,

    date TEXT,

    time TEXT,

    weight REAL,

    length REAL,

    bait TEXT,

    method TEXT,

    water_id INTEGER,

    depth REAL,

    gps_lat REAL,

    gps_lon REAL,

    weather_id INTEGER,

    moon_id INTEGER,

    tide_id INTEGER,

    photo TEXT,

    notes TEXT,

    cloud_id TEXT,

    sync_status TEXT
        DEFAULT 'local',

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fish_id)
        REFERENCES fish(id),

    FOREIGN KEY (water_id)
        REFERENCES waters(id)

);


CREATE TABLE IF NOT EXISTS fish_reports (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    photo TEXT,

    suggested_name TEXT,

    scientific_guess TEXT,

    status TEXT
        DEFAULT 'pending',

    ai_result TEXT,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS sync_queue (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    table_name TEXT,

    record_id INTEGER,

    action TEXT,

    status TEXT
        DEFAULT 'pending',

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


INSERT OR IGNORE INTO system (
    key,
    value
)

VALUES (
    'database_version',
    '1.0'
);