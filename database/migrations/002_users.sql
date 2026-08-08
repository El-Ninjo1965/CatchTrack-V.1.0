-- CatchTrack
-- Migration 002: User / Account foundation
-- Version: 2.0
-- Date: 2026-08-08

PRAGMA foreign_keys = ON;


CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,

    display_name TEXT,

    email TEXT UNIQUE,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS user_settings (

    user_id INTEGER PRIMARY KEY,

    language TEXT
        NOT NULL
        DEFAULT 'de',

    timezone TEXT,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS privacy_settings (

    user_id INTEGER PRIMARY KEY,

    location_sharing INTEGER
        NOT NULL
        DEFAULT 0,

    home_location_sharing INTEGER
        NOT NULL
        DEFAULT 0,

    social_sharing INTEGER
        NOT NULL
        DEFAULT 0,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


CREATE INDEX IF NOT EXISTS idx_users_username
    ON users(username);


CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);