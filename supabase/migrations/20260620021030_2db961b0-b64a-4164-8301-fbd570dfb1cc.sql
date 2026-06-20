
ALTER TABLE public.tracks ADD CONSTRAINT tracks_match_track_unique UNIQUE (match_id, track_id);
