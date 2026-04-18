// Generate weekly progress report — coach version + parent version
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function avg(o: Record<string, number> | null | undefined): number {
  if (!o) return 0;
  const v = Object.values(o);
  if (!v.length) return 0;
  return v.reduce((a, b) => a + Number(b || 0), 0) / v.length;
}

function calcCPI(p: any): number {
  return Math.round((avg(p.technical) * 0.4 + avg(p.tactical) * 0.3 + avg(p.physical) * 0.2 + avg(p.mental) * 0.1) * 10 * 10) / 10;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { player_id } = await req.json();
    if (!player_id) {
      return new Response(JSON.stringify({ error: "player_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: player, error: pErr } = await supabase
      .from("players")
      .select("id,name,age,position,team,attendance,technical,tactical,physical,mental")
      .eq("id", player_id)
      .single();

    if (pErr || !player) {
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [evalsRes, fitnessRes, attRes, goalsRes] = await Promise.all([
      supabase.from("evaluations").select("date,score,notes,technical,tactical,physical,mental").eq("player_id", player_id).order("date", { ascending: false }).limit(10),
      supabase.from("fitness_tests").select("test_date,sprint_10m,sprint_30m,agility_time,vertical_jump,endurance_distance,notes").eq("player_id", player_id).order("test_date", { ascending: false }).limit(5),
      supabase.from("attendance_records").select("present,session_date,session_type").eq("player_id", player_id).gte("session_date", sevenDaysAgo),
      supabase.from("development_goals").select("title,status,category,due_date").eq("player_id", player_id),
    ]);

    const evaluations = evalsRes.data ?? [];
    const fitness = fitnessRes.data ?? [];
    const attendance = attRes.data ?? [];
    const goals = goalsRes.data ?? [];

    const presentCount = attendance.filter((a) => a.present).length;
    const totalCount = attendance.length;
    const weeklyAttendance = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : null;

    const cpi = calcCPI(player);
    const prevEval = evaluations[1];
    const cpiTrend = prevEval ? cpi - (Number(prevEval.score) || 0) : 0;

    const ctx = {
      player: {
        name: player.name,
        age: player.age,
        position: player.position,
        team: player.team,
        cpi,
        cpi_trend: Math.round(cpiTrend * 10) / 10,
        technical_avg: Math.round(avg(player.technical as any) * 10) / 10,
        tactical_avg: Math.round(avg(player.tactical as any) * 10) / 10,
        physical_avg: Math.round(avg(player.physical as any) * 10) / 10,
        mental_avg: Math.round(avg(player.mental as any) * 10) / 10,
        full_metrics: {
          technical: player.technical,
          tactical: player.tactical,
          physical: player.physical,
          mental: player.mental,
        },
      },
      this_week: {
        sessions_attended: presentCount,
        sessions_total: totalCount,
        attendance_pct: weeklyAttendance,
      },
      recent_evaluations: evaluations.slice(0, 3),
      latest_fitness: fitness[0] ?? null,
      goals,
    };

    const systemPrompt = `You are Camino's report writer. Generate TWO weekly progress reports for the same player.

CPI = Camino Player Index (0–100, weighted: 40% technical, 30% tactical, 20% physical, 10% mental).

The COACH version is technical, data-rich, references specific metrics, identifies coaching priorities, and proposes drills.
The PARENT version is warm, jargon-free, celebrates effort, frames weaknesses as growth areas, and is shareable.

Both should be concise (180–260 words each), use markdown headers and bullets, and feel personal.

PLAYER DATA:
${JSON.stringify(ctx, null, 2)}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate the weekly report for ${player.name}.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_weekly_report",
              description: "Return both versions of the weekly progress report.",
              parameters: {
                type: "object",
                properties: {
                  headline: { type: "string", description: "One-line summary of the week (max 90 chars)" },
                  coach_report: { type: "string", description: "Markdown report for the coach (180-260 words)" },
                  parent_report: { type: "string", description: "Markdown report for the parent (180-260 words)" },
                  highlights: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 short bullet highlights of the week",
                  },
                  focus_next_week: {
                    type: "string",
                    description: "One sentence: what to focus on next week",
                  },
                },
                required: ["headline", "coach_report", "parent_report", "highlights", "focus_next_week"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_weekly_report" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(aiJson));
      return new Response(JSON.stringify({ error: "AI did not return a structured report" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Failed to parse report" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ player_name: player.name, cpi, cpi_trend: ctx.player.cpi_trend, ...parsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-weekly-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
