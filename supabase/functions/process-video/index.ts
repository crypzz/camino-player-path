import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const JSON_HEADERS = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

const MAX_INLINE_VIDEO_BYTES = 20 * 1024 * 1024;
const MAX_INLINE_VIDEO_MB = 20;
const ACTIVE_JOB_WINDOW_MS = 10 * 60 * 1000;

const ANALYSIS_PROMPT = `You are a professional football/soccer match analyst AI. Analyze this match video and detect players at multiple timestamps throughout the video.

For each timestamp you analyze, report all visible players on the pitch with their bounding box positions.

Return a JSON object with this exact structure:
{
  "frames": [
    {
      "timestamp_seconds": 0,
      "players": [
        {
          "tracking_id": "player_1",
          "jersey_number": "7",
          "team_color": "red",
          "bbox": { "x": 25.5, "y": 30.2, "width": 5.0, "height": 12.0 },
          "confidence": 0.85
        }
      ],
      "ball": { "x": 50.0, "y": 45.0 }
    }
  ]
}

Rules:
- Analyze the video at roughly 3-5 second intervals
- bbox coordinates are PERCENTAGES of frame dimensions (0-100)
- tracking_id: try to keep consistent IDs for the same player across frames (use jersey number or position)
- team_color: dominant jersey/kit color
- If you can read a jersey number, include it; otherwise omit
- confidence 0-1
- ball position as percentage coordinates, or null if not visible
- Only detect actual players on the pitch, not spectators
- Return as many frames as you can reasonably analyze`;

type MatchVideoRow = {
  id: string;
  title: string;
  created_by: string;
  video_url: string;
  duration_seconds: number | null;
  status: string;
  ai_processing_started_at: string | null;
};

type EdgeRuntimeLike = {
  waitUntil: (promise: Promise<unknown>) => void;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

function createAdminClient() {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Backend credentials are missing");
  }

  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
}

function getEdgeRuntime() {
  return (globalThis as typeof globalThis & { EdgeRuntime?: EdgeRuntimeLike }).EdgeRuntime;
}

function parsePositiveNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function splitStoragePath(path: string) {
  const segments = path.split("/").filter(Boolean);
  const fileName = segments.pop() ?? "";
  return {
    directory: segments.join("/"),
    fileName,
  };
}

function isActiveProcessingJob(video: Pick<MatchVideoRow, "status" | "ai_processing_started_at">) {
  if ((video.status !== "processing" && video.status !== "queued") || !video.ai_processing_started_at) {
    return false;
  }

  const startedAt = new Date(video.ai_processing_started_at).getTime();
  return Number.isFinite(startedAt) && Date.now() - startedAt < ACTIVE_JOB_WINDOW_MS;
}

async function updateVideoStatus(
  supabase: ReturnType<typeof createAdminClient>,
  videoId: string,
  updates: Record<string, unknown>
) {
  const { error } = await supabase
    .from("match_videos")
    .update(updates)
    .eq("id", videoId);

  if (error) {
    console.error("Failed to update video status:", error);
  }
}

async function failVideo(
  supabase: ReturnType<typeof createAdminClient>,
  videoId: string,
  message: string
) {
  await updateVideoStatus(supabase, videoId, {
    status: "error",
    ai_processing_error: message,
  });
}

async function resolveVideoSizeBytes(
  supabase: ReturnType<typeof createAdminClient>,
  videoPath: string,
  signedUrl: string
) {
  const { directory, fileName } = splitStoragePath(videoPath);

  if (fileName) {
    const { data: files, error } = await supabase.storage
      .from("match-videos")
      .list(directory, { search: fileName, limit: 100 });

    if (error) {
      console.warn("Storage size lookup failed:", error.message);
    } else {
      const exactMatch = (files?.find((file) => file.name === fileName) ?? files?.[0]) as
        | { metadata?: { size?: number | string } }
        | undefined;
      const metadataSize = parsePositiveNumber(exactMatch?.metadata?.size);
      if (metadataSize) {
        return metadataSize;
      }
    }
  }

  const headResponse = await fetch(signedUrl, { method: "HEAD" });
  if (headResponse.ok) {
    const contentLength = parsePositiveNumber(headResponse.headers.get("content-length"));
    if (contentLength) {
      return contentLength;
    }
  }

  return null;
}

async function processVideoInBackground(videoId: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const supabase = createAdminClient();

  if (!LOVABLE_API_KEY) {
    await failVideo(supabase, videoId, "AI not configured");
    return;
  }

  try {
    const { data: video, error: videoErr } = await supabase
      .from("match_videos")
      .select("*")
      .eq("id", videoId)
      .single();

    if (videoErr || !video) {
      console.error("Video not found for background processing:", videoErr);
      return;
    }

    await updateVideoStatus(supabase, videoId, {
      status: "processing",
      ai_processing_started_at: new Date().toISOString(),
      ai_processing_error: null,
    });

    const { data: signedData, error: signedUrlError } = await supabase.storage
      .from("match-videos")
      .createSignedUrl(video.video_url, 3600);

    if (signedUrlError || !signedData?.signedUrl) {
      await failVideo(supabase, videoId, "Could not access video file");
      return;
    }

    const sizeBytes = await resolveVideoSizeBytes(supabase, video.video_url, signedData.signedUrl);
    if (sizeBytes && sizeBytes > MAX_INLINE_VIDEO_BYTES) {
      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
      await failVideo(
        supabase,
        videoId,
        `Video is ${sizeMB}MB. AI analysis currently supports clips up to ${MAX_INLINE_VIDEO_MB}MB.`
      );
      return;
    }

    const videoDuration = video.duration_seconds || 90;
    console.log(`Processing video: ${video.title}, duration: ${videoDuration}s`);

    const videoResponse = await fetch(signedData.signedUrl);
    if (!videoResponse.ok) {
      await failVideo(supabase, videoId, "Failed to download video");
      return;
    }

    const contentLength = parsePositiveNumber(videoResponse.headers.get("content-length"));
    if (contentLength && contentLength > MAX_INLINE_VIDEO_BYTES) {
      await failVideo(
        supabase,
        videoId,
        `Video is ${(contentLength / (1024 * 1024)).toFixed(1)}MB. AI analysis currently supports clips up to ${MAX_INLINE_VIDEO_MB}MB.`
      );
      await videoResponse.body?.cancel();
      return;
    }

    const videoBytes = new Uint8Array(await videoResponse.arrayBuffer());
    const videoSizeMB = videoBytes.length / (1024 * 1024);
    console.log(`Video size: ${videoSizeMB.toFixed(1)} MB`);

    if (videoBytes.length > MAX_INLINE_VIDEO_BYTES) {
      await failVideo(
        supabase,
        videoId,
        `Video is ${videoSizeMB.toFixed(1)}MB. AI analysis currently supports clips up to ${MAX_INLINE_VIDEO_MB}MB.`
      );
      return;
    }

    let base64 = "";
    const chunkSize = 32768;
    for (let i = 0; i < videoBytes.length; i += chunkSize) {
      const chunk = videoBytes.subarray(i, Math.min(i + chunkSize, videoBytes.length));
      base64 += String.fromCharCode(...chunk);
    }
    base64 = btoa(base64);

    console.log("Sending video to AI for analysis...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this ${videoDuration} second football match video. Detect all players and ball positions at multiple timestamps throughout. Sample every 3-5 seconds.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:video/mp4;base64,${base64}`,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_video_analysis",
              description: "Report detected players and ball positions across multiple video frames",
              parameters: {
                type: "object",
                properties: {
                  frames: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        timestamp_seconds: { type: "number" },
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
                                  x: { type: "number" },
                                  y: { type: "number" },
                                  width: { type: "number" },
                                  height: { type: "number" },
                                },
                                required: ["x", "y", "width", "height"],
                              },
                              confidence: { type: "number" },
                            },
                            required: ["tracking_id", "bbox", "confidence"],
                          },
                        },
                        ball: {
                          type: "object",
                          properties: {
                            x: { type: "number" },
                            y: { type: "number" },
                          },
                        },
                      },
                      required: ["timestamp_seconds", "players"],
                    },
                  },
                },
                required: ["frames"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_video_analysis" } },
      }),
    });

    if (aiResponse.status === 429) {
      await failVideo(supabase, videoId, "AI rate limited — please try again in a minute");
      return;
    }

    if (aiResponse.status === 402) {
      await failVideo(supabase, videoId, "AI credits exhausted");
      return;
    }

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      await failVideo(supabase, videoId, `AI analysis failed (${aiResponse.status})`);
      return;
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response:", JSON.stringify(aiData).slice(0, 500));
      await failVideo(supabase, videoId, "AI returned no detections");
      return;
    }

    let analysis: { frames: any[] };
    try {
      analysis = JSON.parse(toolCall.function.arguments);
    } catch {
      console.error("Failed to parse AI response");
      await failVideo(supabase, videoId, "Failed to parse AI response");
      return;
    }

    console.log(`AI returned ${analysis.frames?.length || 0} frames`);

    const allTrackingRows: any[] = [];
    for (const frame of analysis.frames || []) {
      const ts = frame.timestamp_seconds || 0;
      const frameNumber = Math.round(ts * 30);

      for (const det of frame.players || []) {
        if (!det.bbox) continue;
        allTrackingRows.push({
          video_id: videoId,
          tracking_id: `ai_${det.tracking_id || "unknown"}`,
          player_id: null,
          frame_number: frameNumber,
          timestamp_seconds: ts,
          bbox_x: det.bbox.x || 0,
          bbox_y: det.bbox.y || 0,
          bbox_width: det.bbox.width || 5,
          bbox_height: det.bbox.height || 10,
          confidence: det.confidence || 0.5,
          source: "ai",
          created_by: video.created_by,
        });
      }
    }

    const { error: cleanupError } = await supabase
      .from("player_tracking")
      .delete()
      .eq("video_id", videoId)
      .eq("source", "ai");

    if (cleanupError) {
      throw cleanupError;
    }

    if (allTrackingRows.length > 0) {
      for (let i = 0; i < allTrackingRows.length; i += 100) {
        const chunk = allTrackingRows.slice(i, i + 100);
        const { error: insertErr } = await supabase
          .from("player_tracking")
          .insert(chunk);

        if (insertErr) {
          throw insertErr;
        }
      }
      console.log(`Inserted ${allTrackingRows.length} tracking records`);
    }

    await updateVideoStatus(supabase, videoId, {
      status: "ready",
      ai_processing_error: null,
    });

    const uniqueTracks = new Set(allTrackingRows.map((row) => row.tracking_id)).size;
    console.log(
      `Processing complete: ${allTrackingRows.length} detections, ${uniqueTracks} unique players, ${analysis.frames?.length || 0} frames`
    );
  } catch (err) {
    console.error("process-video background error:", err);
    await failVideo(
      supabase,
      videoId,
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!Deno.env.get("LOVABLE_API_KEY")) {
    return jsonResponse({ error: "AI not configured" }, 500);
  }

  try {
    // Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return jsonResponse({ error: "Backend credentials missing" }, 500);
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const userId = claimsData.claims.sub;

    const body = await req.json().catch(() => ({}));
    const videoId = typeof body.video_id === "string" ? body.video_id : "";

    if (!videoId) {
      return jsonResponse({ error: "video_id required" }, 400);
    }

    const supabase = createAdminClient();
    const { data: video, error: videoErr } = await supabase
      .from("match_videos")
      .select("id, status, ai_processing_started_at, created_by")
      .eq("id", videoId)
      .single();

    if (videoErr || !video) {
      return jsonResponse({ error: "Video not found" }, 404);
    }

    // Ownership check — only the video creator may trigger AI processing
    if (video.created_by !== userId) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    if (isActiveProcessingJob(video)) {
      return jsonResponse({ success: true, already_running: true, video_id: videoId }, 202);
    }

    const { error: queueError } = await supabase
      .from("match_videos")
      .update({
        status: "queued",
        ai_processing_error: null,
        ai_processing_started_at: null,
      })
      .eq("id", videoId);

    if (queueError) {
      throw queueError;
    }

    const backgroundTask = processVideoInBackground(videoId);
    const edgeRuntime = getEdgeRuntime();

    if (edgeRuntime?.waitUntil) {
      edgeRuntime.waitUntil(backgroundTask);
    } else {
      void backgroundTask;
    }

    return jsonResponse({ success: true, queued: true, video_id: videoId }, 202);
  } catch (err) {
    console.error("process-video request error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Unknown error" },
      500
    );
  }
});
