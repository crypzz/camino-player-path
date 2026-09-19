import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const rating = z.number().min(0).max(100);

export default defineTool({
  name: "create_evaluation",
  title: "Record a player evaluation",
  description:
    "Record a new evaluation for a player with technical, tactical, physical and mental ratings (0-100) and optional notes.",
  inputSchema: {
    player_id: z.string().uuid().describe("The player's id."),
    date: z.string().nullable().describe("Evaluation date as YYYY-MM-DD. Null uses today."),
    technical: rating.describe("Technical rating 0-100."),
    tactical: rating.describe("Tactical rating 0-100."),
    physical: rating.describe("Physical rating 0-100."),
    mental: rating.describe("Mental rating 0-100."),
    notes: z.string().trim().nullable().describe("Coach notes. Null for none."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ player_id, date, technical, tactical, physical, mental, notes }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const supabase = supabaseForUser(ctx);

    const score = Number(
      (technical * 0.4 + tactical * 0.3 + physical * 0.2 + mental * 0.1).toFixed(1),
    );

    const { data, error } = await supabase
      .from("evaluations")
      .insert({
        player_id,
        evaluated_by: ctx.getUserId(),
        date: date || new Date().toISOString().slice(0, 10),
        technical,
        tactical,
        physical,
        mental,
        score,
        notes: notes?.trim() || null,
      })
      .select("id, player_id, date, score")
      .single();
    if (error) throw new ToolError(error.message);

    const evaluation = { id: data.id, playerId: data.player_id, date: data.date, score: data.score };
    return {
      content: [{ type: "text", text: `Evaluation saved (score ${evaluation.score}).` }],
      structuredContent: { evaluation },
    };
  },
});
