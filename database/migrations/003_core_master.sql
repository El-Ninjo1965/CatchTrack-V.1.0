-- CatchTrack
-- Migration 003: Core Master Foundation
-- Version: 3.0
-- Date: 2026-08-09

PRAGMA foreign_keys = ON;


CREATE TABLE IF NOT EXISTS system (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    key TEXT NOT NULL UNIQUE,

    value TEXT,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS migrations (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    version TEXT NOT NULL UNIQUE,

    description TEXT,

    applied_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE INDEX IF NOT EXISTS idx_system_key
    ON system(key);


INSERT OR IGNORE INTO system
(
    key,
    value
)
VALUES
(
    'architecture_version',
    '3.0'
);