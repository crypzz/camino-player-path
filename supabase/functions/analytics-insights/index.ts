// Generate coaching insights for a player's match performance using Lovable AI.
// Called from the app (JWT-authenticated user). Compares latest match to previous.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userErr } = await supa.auth.getUser(token);
    const user = userData?.user;
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { match_id, analytics_player_id } = await req.json();
    if (!match_id || !analytics_player_id) throw new Error("match_id and analytics_player_id required");

    // Authorization: caller must own the match, or be a coach/director
    const { data: match } = await supa.from("analytics_matches")
      .select("id, created_by").eq("id", match_id).maybeSingle();
    if (!match) {
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let allowed = match.created_by === user.id;
    if (!allowed) {
      const { data: roleRows } = await supa.from("user_roles")
        .select("role").eq("user_id", user.id);
      allowed = (roleRows ?? []).some((r: { role: string }) => r.role === "coach" || r.role === "director");
    }
    if (!allowed) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    const { data: stats } = await supa.from("analytics_player_match_stats")
      .select("*").eq("match_id", match_id).eq("analytics_player_id", analytics_player_id).maybeSingle();
    if (!stats) throw new Error("no stats for this player/match");

    const { data: prev } = await supa.from("analytics_player_match_stats")
      .select("*")
      .eq("player_id", stats.player_id)
      .neq("match_id", match_id)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    const delta: Record<string, number> = {};
    if (prev) {
      for (const k of ["touches","passes","passes_completed","key_passes","shots","goals","assists","tackles","interceptions","rating"]) {
        delta[k] = (stats[k] ?? 0) - (prev[k] ?? 0);
      }
    }
    const trend = prev ? (stats.rating > prev.rating + 0.2 ? "up" : stats.rating < prev.rating - 0.2 ? "down" : "flat") : "flat";

    const prompt = `You are an elite youth soccer coach. Give concise, actionable feedback.
Player stats this match: ${JSON.stringify(stats)}
Previous match: ${prev ? JSON.stringify(prev) : "n/a"}
Return strict JSON: { "strengths": string[], "weaknesses": string[], "training_priorities": string[], "summary": string }`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": Deno.env.get("LOVABLE_API_KEY")! },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI ${aiRes.status}: ${t}`);
    }
    const aiJson = await aiRes.json();
    const parsed = JSON.parse(aiJson.choices[0].message.content);

    const { data: insight } = await supa.from("analytics_coaching_insights").upsert({
      match_id, analytics_player_id, player_id: stats.player_id,
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      training_priorities: parsed.training_priorities ?? [],
      summary: parsed.summary ?? "",
      trend, comparison_delta: delta,
      model_used: "google/gemini-2.5-flash",
    }, { onConflict: "match_id,analytics_player_id" }).select().single();

    return new Response(JSON.stringify(insight), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analytics-insights error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
