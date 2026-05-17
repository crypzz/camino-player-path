// Single-frame soccer player detector.
// Receives a JPEG frame + timestamp, asks Gemini Vision for bounding boxes,
// inserts rows into player_tracking. Called once per sampled frame by the
// client-side useFrameByFrameTracker hook.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const JSON_HEADERS = { ...corsHeaders, "Content-Type": "application/json" };

const PROMPT = `You are a soccer match computer-vision detector. Look at this single video frame and return every visible field player (and the goalkeeper) with a tight bounding box.

Rules:
- bbox coordinates are PERCENTAGES of the image dimensions (0-100).
- x,y is the TOP-LEFT corner of the box, width/height are box size.
- Do NOT include referees, coaches, spectators, sideline staff.
- team_color = dominant jersey color in plain English (e.g. "red", "white", "blue").
- jersey_number: only include if you can clearly read it.
- confidence is 0-1.
- ball: object {x,y} as percentages of image dimensions for the ball center, or null if not visible.
- tracking_id: a short stable label for this player WITHIN THIS FRAME (e.g. "red_7" or "blue_left_back"). Cross-frame identity does not matter.
Return ONLY the function call.`;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const ANON = Deno.env.get("SUPABASE_ANON_KEY");
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!LOVABLE_API_KEY || !SUPABASE_URL || !ANON || !SERVICE) {
    return jsonResponse({ error: "Server not configured" }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return jsonResponse({ error: "Unauthorized" }, 401);
  const userId = userData.user.id;

  let body: any;
  try { body = await req.json(); } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }

  const videoId = typeof body?.video_id === "string" ? body.video_id : "";
  const ts = Number(body?.timestamp_seconds);
  const frameB64 = typeof body?.frame_jpeg_b64 === "string" ? body.frame_jpeg_b64 : "";
  const detectBall = body?.detect_ball !== false;
  const replaceFrame = body?.replace_frame === true;

  if (!videoId || !Number.isFinite(ts) || ts < 0 || !frameB64) {
    return jsonResponse({ error: "video_id, timestamp_seconds and frame_jpeg_b64 required" }, 400);
  }
  if (frameB64.length > 2_000_000) {
    return jsonResponse({ error: "Frame too large (max ~1.5MB encoded)" }, 413);
  }

  const admin = createClient(SUPABASE_URL, SERVICE);

  // Confirm caller owns the video
  const { data: video, error: vErr } = await admin
    .from("match_videos")
    .select("id, created_by")
    .eq("id", videoId)
    .single();
  if (vErr || !video) return jsonResponse({ error: "Video not found" }, 404);
  if (video.created_by !== userId) return jsonResponse({ error: "Forbidden" }, 403);

  const tools = [{
    type: "function",
    function: {
      name: "report_frame",
      description: "Report detected soccer players and ball in this single frame.",
      parameters: {
        type: "object",
        properties: {
          players: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tracking_id: { type: "string" },
                jersey_number: { type: "string" },
                team_color: { type: "string" },
                bbox: {
                  type: "object",
                  properties: {
                    x: { type: "number" }, y: { type: "number" },
                    width: { type: "number" }, height: { type: "number" },
                  },
                  required: ["x", "y", "width", "height"],
                },
                confidence: { type: "number" },
              },
              required: ["tracking_id", "bbox", "confidence"],
            },
          },
          ball: {
            type: ["object", "null"],
            properties: { x: { type: "number" }, y: { type: "number" } },
          },
        },
        required: ["players"],
      },
    },
  }];

  const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `Frame at t=${ts.toFixed(2)}s.${detectBall ? "" : " Skip the ball."}` },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${frameB64}` } },
          ],
        },
      ],
      tools,
      tool_choice: { type: "function", function: { name: "report_frame" } },
    }),
  });

  if (aiResp.status === 429) return jsonResponse({ error: "AI rate limited" }, 429);
  if (aiResp.status === 402) return jsonResponse({ error: "AI credits exhausted" }, 402);
  if (!aiResp.ok) {
    const t = await aiResp.text();
    console.error("AI error", aiResp.status, t.slice(0, 300));
    return jsonResponse({ error: `AI failed (${aiResp.status})` }, 502);
  }

  const aiData = await aiResp.json();
  const call = aiData?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) {
    return jsonResponse({ detections: 0, ball: false });
  }

  let parsed: { players?: any[]; ball?: { x: number; y: number } | null };
  try { parsed = JSON.parse(call.function.arguments); }
  catch { return jsonResponse({ error: "AI returned malformed JSON" }, 502); }

  const frameNumber = Math.round(ts * 30);

  if (replaceFrame) {
    await admin
      .from("player_tracking")
      .delete()
      .eq("video_id", videoId)
      .eq("source", "ai")
      .eq("frame_number", frameNumber);
  }

  const rows: any[] = [];
  for (const p of parsed.players ?? []) {
    if (!p?.bbox) continue;
    const x = Number(p.bbox.x), y = Number(p.bbox.y);
    const w = Number(p.bbox.width), h = Number(p.bbox.height);
    if (![x, y, w, h].every((n) => Number.isFinite(n))) continue;
    rows.push({
      video_id: videoId,
      tracking_id: `ai_${String(p.tracking_id ?? "p").slice(0, 32)}`,
      player_id: null,
      frame_number: frameNumber,
      timestamp_seconds: ts,
      bbox_x: Math.max(0, Math.min(100, x)),
      bbox_y: Math.max(0, Math.min(100, y)),
      bbox_width: Math.max(0.5, Math.min(100, w)),
      bbox_height: Math.max(0.5, Math.min(100, h)),
      confidence: Math.max(0, Math.min(1, Number(p.confidence) || 0.5)),
      source: "ai",
      created_by: userId,
    });
  }

  let ballInserted = false;
  if (detectBall && parsed.ball && Number.isFinite(parsed.ball.x) && Number.isFinite(parsed.ball.y)) {
    rows.push({
      video_id: videoId,
      tracking_id: "ai_ball",
      player_id: null,
      frame_number: frameNumber,
      timestamp_seconds: ts,
      bbox_x: Math.max(0, Math.min(100, Number(parsed.ball.x) - 1)),
      bbox_y: Math.max(0, Math.min(100, Number(parsed.ball.y) - 1)),
      bbox_width: 2,
      bbox_height: 2,
      confidence: 0.6,
      source: "ai",
      created_by: userId,
    });
    ballInserted = true;
  }

  if (rows.length > 0) {
    const { error: insErr } = await admin.from("player_tracking").insert(rows);
    if (insErr) {
      console.error("insert error", insErr);
      return jsonResponse({ error: insErr.message }, 500);
    }
  }

  return jsonResponse({
    detections: rows.length - (ballInserted ? 1 : 0),
    ball: ballInserted,
    frame_number: frameNumber,
  });
});
