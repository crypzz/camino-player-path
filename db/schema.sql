CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE players (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id     UUID,
    name        TEXT NOT NULL,
    jersey_num  INT,
    position    TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE matches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id         UUID,
    title           TEXT,
    video_path      TEXT NOT NULL,
    status          TEXT DEFAULT 'queued',   -- queued|processing|done|error
    fps             FLOAT,
    duration_secs   FLOAT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE track_identity_map (
    match_id    UUID REFERENCES matches(id),
    track_id    INT NOT NULL,
    player_id   UUID REFERENCES players(id),
    tagged_at   TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (match_id, track_id)
);

CREATE TABLE player_match_stats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id        UUID REFERENCES matches(id),
    player_id       UUID REFERENCES players(id),
    touches         INT DEFAULT 0,
    distance_m      FLOAT DEFAULT 0,
    possession_secs FLOAT DEFAULT 0,
    frames_tracked  INT DEFAULT 0,
    computed_at     TIMESTAMPTZ DEFAULT now(),
    UNIQUE (match_id, player_id)
);

CREATE TABLE frame_events (
    id          BIGSERIAL PRIMARY KEY,
    match_id    UUID REFERENCES matches(id),
    player_id   UUID REFERENCES players(id),
    frame_num   INT NOT NULL,
    centroid_x  FLOAT,
    centroid_y  FLOAT,
    has_touch   BOOLEAN DEFAULT FALSE
);
