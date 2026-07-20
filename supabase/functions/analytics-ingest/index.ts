// Ingest endpoint for the analytics worker.
// Writes match metadata, players, tracks, events, frames, and per-match stats.
// Auth: requires x-worker-secret header matching ANALYTICS_WORKER_SECRET.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const secret = Deno.env.get("ANALYTICS_WORKER_SECRET");
  if (!secret || req.headers.get("x-worker-secret") !== secret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json();
    const { match_id, status, fps, duration_seconds, model_version, error_message,
            players = [], tracks = [], events = [], frames = [], player_stats = [] } = body;

    if (!match_id) throw new Error("match_id required");

    // Update match
    const matchUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) matchUpdate.status = status;
    if (fps !== undefined) matchUpdate.fps = fps;
    if (duration_seconds !== undefined) matchUpdate.duration_seconds = duration_seconds;
    if (model_version) matchUpdate.model_version = model_version;
    if (error_message) matchUpdate.error_message = error_message;
    await supa.from("analytics_matches").update(matchUpdate).eq("id", match_id);

    if (players.length) {
      await supa.from("analytics_players").upsert(
        players.map((p: any) => ({ ...p, match_id })),
        { onConflict: "match_id,jersey_number,team_side" },
      );
    }
    if (tracks.length) {
      await supa.from("analytics_tracks").upsert(
        tracks.map((t: any) => ({ ...t, match_id })),
        { onConflict: "match_id,track_id" },
      );
    }
    if (frames.length) {
      // Chunk to keep payload manageable
      for (let i = 0; i < frames.length; i += 1000) {
        await supa.from("analytics_frames").insert(
          frames.slice(i, i + 1000).map((f: any) => ({ ...f, match_id })),
        );
      }
    }
    if (events.length) {
      await supa.from("analytics_events").insert(events.map((e: any) => ({ ...e, match_id })));
    }
    if (player_stats.length) {
      await supa.from("analytics_player_match_stats").upsert(
        player_stats.map((s: any) => ({ ...s, match_id })),
        { onConflict: "match_id,analytics_player_id" },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analytics-ingest error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
