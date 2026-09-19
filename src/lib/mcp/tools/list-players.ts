import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_players",
  title: "List players",
  description:
    "List players visible to the signed-in user, optionally filtered by name, team or position.",
  inputSchema: {
    search: z.string().trim().nullable().describe("Filter by player name (partial match). Null for no filter."),
    position: z.string().trim().nullable().describe("Filter by position, e.g. 'Midfielder'. Null for no filter."),
    limit: z.number().int().min(1).max(100).nullable().describe("Max rows to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, position, limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("players")
      .select("id, name, age, position, team, age_group, overall_rating, attendance, jersey_number, is_public")
      .order("overall_rating", { ascending: false })
      .limit(limit ?? 25);
    if (search) query = query.ilike("name", `%${search}%`);
    if (position) query = query.ilike("position", `%${position}%`);

    const { data, error } = await query;
    if (error) throw new ToolError(error.message);

    const players = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      position: p.position,
      team: p.team,
      ageGroup: p.age_group,
      overallRating: p.overall_rating,
      attendance: p.attendance,
      jerseyNumber: p.jersey_number,
      isPublic: p.is_public,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(players, null, 2) }],
      structuredContent: { players },
    };
  },
});
