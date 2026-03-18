import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const mockPlayers = [
  {
    name: "Lucas Martinez", age: 16, position: "Forward", team: "U-17",
    join_date: "2024-01-15", nationality: "Spain", preferred_foot: "Right", height: 178, weight: 68,
    technical: { "First Touch": 8, "Ball Control": 7, "Passing Accuracy": 6, "Dribbling": 9, "Shooting Technique": 8, "Weak Foot": 5, "1v1 Attacking": 9, "1v1 Defending": 4 },
    tactical: { "Positioning": 7, "Decision Making": 7, "Off-Ball Movement": 8, "Defensive Awareness": 5, "Game Understanding": 7 },
    physical: { "10m Sprint": 9, "30m Sprint": 8, "Agility": 8, "Vertical Jump": 7, "Endurance": 7 },
    mental: { "Confidence": 8, "Work Ethic": 7, "Coachability": 7, "Leadership": 6, "Resilience": 8 },
    attendance: 94, overall_rating: 7.5,
  },
  {
    name: "Sofia Chen", age: 15, position: "Midfielder", team: "U-16",
    join_date: "2023-09-01", nationality: "USA", preferred_foot: "Right", height: 165, weight: 55,
    technical: { "First Touch": 7, "Ball Control": 8, "Passing Accuracy": 9, "Dribbling": 7, "Shooting Technique": 5, "Weak Foot": 6, "1v1 Attacking": 6, "1v1 Defending": 7 },
    tactical: { "Positioning": 8, "Decision Making": 9, "Off-Ball Movement": 7, "Defensive Awareness": 8, "Game Understanding": 9 },
    physical: { "10m Sprint": 6, "30m Sprint": 6, "Agility": 7, "Vertical Jump": 5, "Endurance": 8 },
    mental: { "Confidence": 8, "Work Ethic": 9, "Coachability": 9, "Leadership": 7, "Resilience": 8 },
    attendance: 98, overall_rating: 7.6,
  },
  {
    name: "Kai Williams", age: 14, position: "Defender", team: "U-15",
    join_date: "2024-06-10", nationality: "England", preferred_foot: "Left", height: 175, weight: 63,
    technical: { "First Touch": 6, "Ball Control": 6, "Passing Accuracy": 7, "Dribbling": 5, "Shooting Technique": 4, "Weak Foot": 4, "1v1 Attacking": 5, "1v1 Defending": 8 },
    tactical: { "Positioning": 8, "Decision Making": 7, "Off-Ball Movement": 6, "Defensive Awareness": 8, "Game Understanding": 7 },
    physical: { "10m Sprint": 7, "30m Sprint": 7, "Agility": 6, "Vertical Jump": 8, "Endurance": 8 },
    mental: { "Confidence": 7, "Work Ethic": 9, "Coachability": 8, "Leadership": 8, "Resilience": 8 },
    attendance: 91, overall_rating: 6.8,
  },
  {
    name: "Amara Diallo", age: 16, position: "Goalkeeper", team: "U-17",
    join_date: "2023-03-20", nationality: "France", preferred_foot: "Right", height: 185, weight: 75,
    technical: { "First Touch": 5, "Ball Control": 5, "Passing Accuracy": 6, "Dribbling": 3, "Shooting Technique": 2, "Weak Foot": 4, "1v1 Attacking": 2, "1v1 Defending": 9 },
    tactical: { "Positioning": 9, "Decision Making": 8, "Off-Ball Movement": 6, "Defensive Awareness": 9, "Game Understanding": 8 },
    physical: { "10m Sprint": 6, "30m Sprint": 5, "Agility": 9, "Vertical Jump": 8, "Endurance": 7 },
    mental: { "Confidence": 9, "Work Ethic": 8, "Coachability": 8, "Leadership": 8, "Resilience": 9 },
    attendance: 96, overall_rating: 7.1,
  },
  {
    name: "Noah Eriksson", age: 15, position: "Winger", team: "U-16",
    join_date: "2024-02-01", nationality: "Sweden", preferred_foot: "Both", height: 172, weight: 62,
    technical: { "First Touch": 7, "Ball Control": 8, "Passing Accuracy": 6, "Dribbling": 9, "Shooting Technique": 7, "Weak Foot": 8, "1v1 Attacking": 9, "1v1 Defending": 4 },
    tactical: { "Positioning": 6, "Decision Making": 6, "Off-Ball Movement": 7, "Defensive Awareness": 4, "Game Understanding": 6 },
    physical: { "10m Sprint": 10, "30m Sprint": 9, "Agility": 9, "Vertical Jump": 7, "Endurance": 7 },
    mental: { "Confidence": 7, "Work Ethic": 6, "Coachability": 7, "Leadership": 5, "Resilience": 6 },
    attendance: 88, overall_rating: 6.9,
  },
];

const mockGoals: Record<number, Array<{ title: string; description: string; status: string; due_date: string; category: string }>> = {
  0: [
    { title: "Improve weak foot passing", description: "Develop left foot to professional standard", status: "in-progress", due_date: "2026-04-01", category: "technical" },
    { title: "Increase sprint speed by 5%", description: "Focus on explosive acceleration drills", status: "completed", due_date: "2026-03-01", category: "physical" },
    { title: "Improve defensive contribution", description: "Track back more in transition phases", status: "in-progress", due_date: "2026-05-01", category: "tactical" },
  ],
  1: [
    { title: "Develop long-range shooting", description: "Practice shooting from outside the box", status: "in-progress", due_date: "2026-05-01", category: "technical" },
    { title: "Improve sprint times", description: "Speed and acceleration training", status: "in-progress", due_date: "2026-06-01", category: "physical" },
  ],
  2: [
    { title: "Improve aerial ability", description: "Work on heading technique and timing", status: "not-started", due_date: "2026-06-01", category: "physical" },
    { title: "Better passing under pressure", description: "Composure on the ball in tight spaces", status: "in-progress", due_date: "2026-04-15", category: "technical" },
  ],
  3: [
    { title: "Distribution accuracy", description: "Improve long-range passing from goal kicks", status: "in-progress", due_date: "2026-04-30", category: "technical" },
  ],
  4: [
    { title: "Improve defensive tracking", description: "Work rate in defensive transitions", status: "in-progress", due_date: "2026-05-15", category: "tactical" },
    { title: "End product consistency", description: "More assists and goals per game", status: "not-started", due_date: "2026-06-01", category: "technical" },
  ],
};

const mockEvaluations: Record<number, Array<{ date: string; score: number; technical: number; tactical: number; physical: number; mental: number }>> = {
  0: [
    { date: "2025-06-01", score: 62, technical: 6.2, tactical: 5.8, physical: 7.0, mental: 6.5 },
    { date: "2025-09-01", score: 66, technical: 6.8, tactical: 6.2, physical: 7.2, mental: 6.8 },
    { date: "2025-12-01", score: 70, technical: 7.2, tactical: 6.6, physical: 7.5, mental: 7.0 },
    { date: "2026-03-01", score: 73, technical: 7.5, tactical: 6.8, physical: 7.8, mental: 7.2 },
  ],
  1: [
    { date: "2025-06-01", score: 65, technical: 6.5, tactical: 7.0, physical: 5.8, mental: 7.5 },
    { date: "2025-09-01", score: 69, technical: 6.9, tactical: 7.5, physical: 6.0, mental: 7.8 },
    { date: "2025-12-01", score: 73, technical: 7.2, tactical: 8.0, physical: 6.2, mental: 8.0 },
    { date: "2026-03-01", score: 76, technical: 7.4, tactical: 8.2, physical: 6.4, mental: 8.2 },
  ],
  2: [
    { date: "2025-09-01", score: 58, technical: 5.5, tactical: 6.5, physical: 6.8, mental: 7.5 },
    { date: "2025-12-01", score: 62, technical: 5.8, tactical: 7.0, physical: 7.0, mental: 7.8 },
    { date: "2026-03-01", score: 64, technical: 6.0, tactical: 7.2, physical: 7.2, mental: 8.0 },
  ],
  3: [
    { date: "2025-06-01", score: 55, technical: 4.0, tactical: 7.5, physical: 6.5, mental: 8.0 },
    { date: "2025-09-01", score: 59, technical: 4.3, tactical: 7.8, physical: 6.8, mental: 8.2 },
    { date: "2025-12-01", score: 62, technical: 4.5, tactical: 8.0, physical: 7.0, mental: 8.5 },
    { date: "2026-03-01", score: 64, technical: 4.8, tactical: 8.2, physical: 7.2, mental: 8.5 },
  ],
  4: [
    { date: "2025-06-01", score: 60, technical: 6.8, tactical: 5.0, physical: 8.0, mental: 5.5 },
    { date: "2025-09-01", score: 64, technical: 7.0, tactical: 5.3, physical: 8.2, mental: 5.8 },
    { date: "2025-12-01", score: 67, technical: 7.3, tactical: 5.6, physical: 8.5, mental: 6.0 },
    { date: "2026-03-01", score: 70, technical: 7.5, tactical: 5.8, physical: 8.8, mental: 6.2 },
  ],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from token
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user already has players
    const { data: existing } = await supabase
      .from("players")
      .select("id")
      .eq("created_by", user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ message: "Data already seeded", seeded: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert players
    const playerRows = mockPlayers.map((p) => ({ ...p, created_by: user.id }));
    const { data: insertedPlayers, error: playersError } = await supabase
      .from("players")
      .insert(playerRows)
      .select("id");

    if (playersError) throw playersError;

    // Insert goals and evaluations for each player
    for (let i = 0; i < insertedPlayers.length; i++) {
      const playerId = insertedPlayers[i].id;

      const goals = (mockGoals[i] || []).map((g) => ({ ...g, player_id: playerId }));
      if (goals.length > 0) {
        const { error: goalsError } = await supabase.from("development_goals").insert(goals);
        if (goalsError) throw goalsError;
      }

      const evals = (mockEvaluations[i] || []).map((e) => ({
        ...e,
        player_id: playerId,
        evaluated_by: user.id,
      }));
      if (evals.length > 0) {
        const { error: evalsError } = await supabase.from("evaluations").insert(evals);
        if (evalsError) throw evalsError;
      }
    }

    return new Response(JSON.stringify({ message: "Seeded successfully", seeded: true, count: insertedPlayers.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
