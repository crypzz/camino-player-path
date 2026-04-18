// Coach AI Assistant — streams answers grounded in the coach's player data
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function calcCPI(p: any): number {
  const avg = (o: Record<string, number> | null | undefined) => {
    if (!o) return 0;
    const v = Object.values(o);
    if (!v.length) return 0;
    return v.reduce((a, b) => a + Number(b || 0), 0) / v.length;
  };
  const t = avg(p.technical), ta = avg(p.tactical), ph = avg(p.physical), m = avg(p.mental);
  return Math.round((t * 0.4 + ta * 0.3 + ph * 0.2 + m * 0.1) * 10 * 10) / 10;
}

function buildPlayerContext(players: any[], evals: any[], fitness: any[], attendance: any[]) {
  const evalsByPlayer = new Map<string, any[]>();
  for (const e of evals) {
    const arr = evalsByPlayer.get(e.player_id) ?? [];
    arr.push(e);
    evalsByPlayer.set(e.player_id, arr);
  }
  const fitnessByPlayer = new Map<string, any[]>();
  for (const f of fitness) {
    const arr = fitnessByPlayer.get(f.player_id) ?? [];
    arr.push(f);
    fitnessByPlayer.set(f.player_id, arr);
  }
  const attByPlayer = new Map<string, { present: number; total: number }>();
  for (const a of attendance) {
    const cur = attByPlayer.get(a.player_id) ?? { present: 0, total: 0 };
    cur.total += 1;
    if (a.present) cur.present += 1;
    attByPlayer.set(a.player_id, cur);
  }

  return players.map((p) => {
    const cpi = calcCPI(p);
    const playerEvals = (evalsByPlayer.get(p.id) ?? []).slice(0, 3);
    const playerFitness = (fitnessByPlayer.get(p.id) ?? []).slice(0, 1)[0];
    const att = attByPlayer.get(p.id);
    const attendancePct = att && att.total > 0 ? Math.round((att.present / att.total) * 100) : p.attendance ?? null;

    return {
      name: p.name,
      age: p.age,
      position: p.position,
      team: p.team,
      cpi,
      attendance_pct: attendancePct,
      technical_avg: Math.round(((Object.values(p.technical || {}).reduce((a: number, b: any) => a + Number(b || 0), 0) as number) / Math.max(1, Object.keys(p.technical || {}).length)) * 10) / 10,
      tactical_avg: Math.round(((Object.values(p.tactical || {}).reduce((a: number, b: any) => a + Number(b || 0), 0) as number) / Math.max(1, Object.keys(p.tactical || {}).length)) * 10) / 10,
      physical_avg: Math.round(((Object.values(p.physical || {}).reduce((a: number, b: any) => a + Number(b || 0), 0) as number) / Math.max(1, Object.keys(p.physical || {}).length)) * 10) / 10,
      mental_avg: Math.round(((Object.values(p.mental || {}).reduce((a: number, b: any) => a + Number(b || 0), 0) as number) / Math.max(1, Object.keys(p.mental || {}).length)) * 10) / 10,
      recent_evaluations: playerEvals.map((e) => ({
        date: e.date,
        score: e.score,
        notes: e.notes?.slice(0, 200),
      })),
      latest_fitness: playerFitness
        ? {
            date: playerFitness.test_date,
            sprint_10m: playerFitness.sprint_10m,
            sprint_30m: playerFitness.sprint_30m,
            agility: playerFitness.agility_time,
            vertical_jump: playerFitness.vertical_jump,
            endurance: playerFitness.endurance_distance,
          }
        : null,
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch coach's players + related data
    const { data: players } = await supabase
      .from("players")
      .select("id,name,age,position,team,attendance,technical,tactical,physical,mental")
      .eq("created_by", userId);

    const playerIds = (players ?? []).map((p) => p.id);

    const [evalsRes, fitnessRes, attRes] = await Promise.all([
      playerIds.length
        ? supabase
            .from("evaluations")
            .select("player_id,date,score,notes,technical,tactical,physical,mental")
            .in("player_id", playerIds)
            .order("date", { ascending: false })
            .limit(200)
        : Promise.resolve({ data: [] as any[] }),
      playerIds.length
        ? supabase
            .from("fitness_tests")
            .select("player_id,test_date,sprint_10m,sprint_30m,agility_time,vertical_jump,endurance_distance")
            .in("player_id", playerIds)
            .order("test_date", { ascending: false })
            .limit(200)
        : Promise.resolve({ data: [] as any[] }),
      playerIds.length
        ? supabase
            .from("attendance_records")
            .select("player_id,present,session_date")
            .in("player_id", playerIds)
            .order("session_date", { ascending: false })
            .limit(500)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const ctx = buildPlayerContext(
      players ?? [],
      (evalsRes as any).data ?? [],
      (fitnessRes as any).data ?? [],
      (attRes as any).data ?? []
    );

    const systemPrompt = `You are Camino's AI Coach Assistant. You help a soccer academy coach understand and develop their players.

You have access to the coach's full roster with computed stats. Use this data to answer questions with specific player names, numbers, and concrete recommendations.

CPI = Camino Player Index (0–100, weighted: 40% technical, 30% tactical, 20% physical, 10% mental).

When asked about progress, regression, or comparisons, cite the actual numbers. When asked for training plans, base them on the player's weakest category. Keep answers concise, scannable, and actionable. Use markdown bullets and bold names.

If the coach has no players yet, say so and suggest seeding sample data.

ROSTER DATA (JSON):
${JSON.stringify(ctx, null, 2)}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiResp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("coach-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
