CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS artists (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  era         TEXT,
  movement    TEXT,
  bio         TEXT
);

CREATE TABLE IF NOT EXISTS museums (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  city      TEXT,
  country   TEXT,
  geom      geography(Point, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS artworks (
  id          TEXT PRIMARY KEY,
  artist_id   TEXT NOT NULL REFERENCES artists(id),
  title       TEXT NOT NULL,
  year        TEXT,
  image_url   TEXT,
  rarity      TEXT NOT NULL CHECK (rarity IN ('common','rare','epic','legendary')),
  is_signature BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS exhibitions (
  id          TEXT PRIMARY KEY,
  artwork_id  TEXT NOT NULL REFERENCES artworks(id),
  museum_id   TEXT NOT NULL REFERENCES museums(id),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id        TEXT PRIMARY KEY,   -- Clerk user id
  handle    TEXT,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS collections (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id),
  artwork_id      TEXT NOT NULL REFERENCES artworks(id),
  collected_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  museum_id       TEXT REFERENCES museums(id),    -- where it was when captured
  exhibition_label TEXT,                           -- snapshot e.g. "MoMA, New York (2026)"
  selfie_url      TEXT,
  photo_url       TEXT,
  note            TEXT,
  UNIQUE (user_id, artwork_id)
);

CREATE INDEX IF NOT EXISTS idx_museums_geom ON museums USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_exhibitions_artwork ON exhibitions(artwork_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
