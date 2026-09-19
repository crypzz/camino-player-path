import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "add_player_feedback",
  title: "Add coach feedback",
  description: "Write coach feedback for a player: strengths, areas to improve and extra notes.",
  inputSchema: {
    player_id: z.string().uuid().describe("The player's id."),
    strengths: z.string().trim().min(1).describe("What the player does well."),
    improvements: z.string().trim().min(1).describe("What the player should work on."),
    notes: z.string().trim().nullable().describe("Additional notes. Null for none."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ player_id, strengths, improvements, notes }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const supabase = supabaseForUser(ctx);

    const { data, error } = await supabase
      .from("player_feedback")
      .insert({
        player_id,
        coach_id: ctx.getUserId(),
        strengths,
        improvements,
        notes: notes?.trim() || "",
      })
      .select("id, player_id, created_at")
      .single();
    if (error) throw new ToolError(error.message);

    const feedback = { id: data.id, playerId: data.player_id, createdAt: data.created_at };
    return {
      content: [{ type: "text", text: "Feedback saved for the player." }],
      structuredContent: { feedback },
    };
  },
});
