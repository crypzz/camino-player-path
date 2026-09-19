import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_training_sessions",
  title: "List training sessions",
  description: "List upcoming or recent training sessions visible to the signed-in user.",
  inputSchema: {
    upcoming_only: z.boolean().nullable().describe("True for future sessions only. Null lists all."),
    limit: z.number().int().min(1).max(100).nullable().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ upcoming_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const supabase = supabaseForUser(ctx);

    let query = supabase
      .from("training_sessions")
      .select("id, name, description, session_date, focus_area")
      .order("session_date", { ascending: false })
      .limit(limit ?? 20);
    if (upcoming_only) query = query.gte("session_date", new Date().toISOString());

    const { data, error } = await query;
    if (error) throw new ToolError(error.message);

    const sessions = (data ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      sessionDate: s.session_date,
      focusArea: s.focus_area,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(sessions, null, 2) }],
      structuredContent: { sessions },
    };
  },
});
