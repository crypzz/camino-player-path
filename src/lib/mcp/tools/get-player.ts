import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_player",
  title: "Get player profile",
  description:
    "Get one player's full profile: bio, attribute groups (technical, tactical, physical, mental), recent evaluations and fitness tests.",
  inputSchema: { player_id: z.string().uuid().describe("The player's id.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ player_id }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const supabase = supabaseForUser(ctx);

    const { data: player, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", player_id)
      .maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!player) throw new ToolError("Player not found or not visible to you.");

    const [{ data: evals }, { data: fitness }] = await Promise.all([
      supabase
        .from("evaluations")
        .select("id, date, score, technical, tactical, physical, mental, notes")
        .eq("player_id", player_id)
        .order("date", { ascending: false })
        .limit(5),
      supabase
        .from("fitness_tests")
        .select("id, test_date, beep_test_level, sprint_10m, sprint_30m, agility_time, vertical_jump, endurance_distance")
        .eq("player_id", player_id)
        .order("test_date", { ascending: false })
        .limit(3),
    ]);

    const profile = {
      id: player.id as string,
      name: player.name as string,
      age: player.age as number | null,
      position: player.position as string | null,
      team: player.team as string | null,
      ageGroup: player.age_group as string | null,
      nationality: player.nationality as string | null,
      preferredFoot: player.preferred_foot as string | null,
      heightCm: player.height as number | null,
      weightKg: player.weight as number | null,
      bio: player.bio as string | null,
      attendance: player.attendance as number | null,
      overallRating: player.overall_rating as number | null,
      attributes: {
        technical: player.technical ?? null,
        tactical: player.tactical ?? null,
        physical: player.physical ?? null,
        mental: player.mental ?? null,
      },
      recentEvaluations: (evals ?? []).map((e) => ({
        id: e.id,
        date: e.date,
        score: e.score,
        technical: e.technical,
        tactical: e.tactical,
        physical: e.physical,
        mental: e.mental,
        notes: e.notes,
      })),
      recentFitnessTests: (fitness ?? []).map((f) => ({
        id: f.id,
        testDate: f.test_date,
        beepTestLevel: f.beep_test_level,
        sprint10m: f.sprint_10m,
        sprint30m: f.sprint_30m,
        agilityTime: f.agility_time,
        verticalJump: f.vertical_jump,
        enduranceDistance: f.endurance_distance,
      })),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: { player: profile },
    };
  },
});
