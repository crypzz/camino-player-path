import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Detection {
  tracking_id: string;
  jersey_number?: string;
  team_color?: string;
  bbox: { x: number; y: number; width: number; height: number };
  confidence: number;
}

interface FrameAnalysis {
  players: Detection[];
  ball?: { x: number; y: number };
}

const SYSTEM_PROMPT = `You are a football/soccer video frame analyzer. Analyze the frame and detect all visible players and the ball.

Return a JSON object with this exact structure:
{
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

Rules:
- bbox coordinates are PERCENTAGES of frame dimensions (0-100)
- tracking_id should be consistent: use "player_N" where N is assigned left-to-right
- team_color should describe the dominant jersey/kit color
- If you can read a jersey number, include it; otherwise omit
- confidence 0-1 for how sure you are this is a player
- ball position as percentage coordinates, or null if not visible
- Only detect actual players on the pitch, not spectators or officials if clearly distinguishable`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "AI not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const { video_id } = await req.json();
    if (!video_id) {
      return new Response(JSON.stringify({ error: "video_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get video record
    const { data: video, error: videoErr } = await supabase
      .from("match_videos")
      .select("*")
      .eq("id", video_id)
      .single();

    if (videoErr || !video) {
      return new Response(JSON.stringify({ error: "Video not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark as processing
    await supabase
      .from("match_videos")
      .update({
        status: "processing",
        ai_processing_started_at: new Date().toISOString(),
        ai_processing_error: null,
      })
      .eq("id", video_id);

    // Get signed URL for the video
    const { data: signedData } = await supabase.storage
      .from("match-videos")
      .createSignedUrl(video.video_url, 3600);

    if (!signedData?.signedUrl) {
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "Could not access video file" })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "Could not access video" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract frames using ffmpeg
    const videoDuration = video.duration_seconds || 90;
    const frameInterval = Math.max(3, Math.ceil(videoDuration / 30)); // Max ~30 frames
    const frameCount = Math.min(30, Math.ceil(videoDuration / frameInterval));

    console.log(`Processing video: ${video.title}, duration: ${videoDuration}s, extracting ~${frameCount} frames every ${frameInterval}s`);

    // Download video to temp file
    const videoResponse = await fetch(signedData.signedUrl);
    if (!videoResponse.ok) {
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "Failed to download video" })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "Failed to download video" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const videoBytes = new Uint8Array(await videoResponse.arrayBuffer());
    const tmpVideo = `/tmp/video_${video_id}.mp4`;
    const tmpFrameDir = `/tmp/frames_${video_id}`;

    await Deno.writeFile(tmpVideo, videoBytes);
    try {
      await Deno.mkdir(tmpFrameDir, { recursive: true });
    } catch { /* exists */ }

    // Extract frames with ffmpeg
    const ffmpegCmd = new Deno.Command("ffmpeg", {
      args: [
        "-i", tmpVideo,
        "-vf", `fps=1/${frameInterval}`,
        "-q:v", "5",
        "-frames:v", String(frameCount),
        `${tmpFrameDir}/frame_%03d.jpg`,
      ],
      stdout: "null",
      stderr: "piped",
    });

    const ffmpegResult = await ffmpegCmd.output();
    if (!ffmpegResult.success) {
      const stderr = new TextDecoder().decode(ffmpegResult.stderr);
      console.error("ffmpeg error:", stderr);
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "Failed to extract frames" })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "Frame extraction failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read extracted frames
    const frameFiles: string[] = [];
    for await (const entry of Deno.readDir(tmpFrameDir)) {
      if (entry.isFile && entry.name.endsWith(".jpg")) {
        frameFiles.push(entry.name);
      }
    }
    frameFiles.sort();

    console.log(`Extracted ${frameFiles.length} frames`);

    const allTrackingRows: any[] = [];
    const allBallPositions: Array<{ timestamp: number; x: number; y: number }> = [];

    // Process each frame with AI
    for (let i = 0; i < frameFiles.length; i++) {
      const framePath = `${tmpFrameDir}/${frameFiles[i]}`;
      const frameBytes = await Deno.readFile(framePath);
      const base64 = btoa(String.fromCharCode(...frameBytes));
      const timestampSeconds = i * frameInterval;

      console.log(`Analyzing frame ${i + 1}/${frameFiles.length} at ${timestampSeconds}s`);

      try {
        const aiResponse = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `Analyze this football match frame captured at ${timestampSeconds} seconds. Detect all players and the ball position.`,
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:image/jpeg;base64,${base64}`,
                      },
                    },
                  ],
                },
              ],
              tools: [
                {
                  type: "function",
                  function: {
                    name: "report_detections",
                    description: "Report detected players and ball position in the frame",
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
                          required: ["x", "y"],
                        },
                      },
                      required: ["players"],
                    },
                  },
                },
              ],
              tool_choice: { type: "function", function: { name: "report_detections" } },
            }),
          }
        );

        if (aiResponse.status === 429) {
          console.warn("Rate limited, waiting 5s...");
          await new Promise((r) => setTimeout(r, 5000));
          i--; // retry
          continue;
        }

        if (aiResponse.status === 402) {
          await supabase
            .from("match_videos")
            .update({ status: "error", ai_processing_error: "AI credits exhausted" })
            .eq("id", video_id);
          break;
        }

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error(`AI error on frame ${i}:`, errText);
          continue;
        }

        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

        if (!toolCall?.function?.arguments) {
          console.warn(`No detections for frame ${i}`);
          continue;
        }

        let analysis: FrameAnalysis;
        try {
          analysis = JSON.parse(toolCall.function.arguments);
        } catch {
          console.warn(`Failed to parse AI response for frame ${i}`);
          continue;
        }

        // Convert detections to tracking rows
        const frameNumber = Math.round(timestampSeconds * 30); // assume 30fps
        for (const det of analysis.players) {
          allTrackingRows.push({
            video_id,
            tracking_id: `ai_${det.tracking_id}`,
            player_id: null,
            frame_number: frameNumber,
            timestamp_seconds: timestampSeconds,
            bbox_x: det.bbox.x,
            bbox_y: det.bbox.y,
            bbox_width: det.bbox.width,
            bbox_height: det.bbox.height,
            confidence: det.confidence,
            source: "ai",
            created_by: video.created_by,
          });
        }

        if (analysis.ball) {
          allBallPositions.push({
            timestamp: timestampSeconds,
            x: analysis.ball.x,
            y: analysis.ball.y,
          });
        }

        // Small delay between requests
        if (i < frameFiles.length - 1) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (frameErr) {
        console.error(`Error processing frame ${i}:`, frameErr);
      }
    }

    // Batch insert tracking data
    if (allTrackingRows.length > 0) {
      // Insert in chunks of 100
      for (let i = 0; i < allTrackingRows.length; i += 100) {
        const chunk = allTrackingRows.slice(i, i + 100);
        const { error: insertErr } = await supabase
          .from("player_tracking")
          .insert(chunk);
        if (insertErr) {
          console.error("Tracking insert error:", insertErr);
        }
      }
      console.log(`Inserted ${allTrackingRows.length} tracking records`);
    }

    // Compute and store stats per unique tracking_id
    const trackingByPlayer = new Map<string, any[]>();
    for (const row of allTrackingRows) {
      if (!trackingByPlayer.has(row.tracking_id)) {
        trackingByPlayer.set(row.tracking_id, []);
      }
      trackingByPlayer.get(row.tracking_id)!.push(row);
    }

    // Note: stats computation is simplified here; the frontend can recompute with full engine
    let statsCount = 0;
    for (const [trackId, tracks] of trackingByPlayer) {
      tracks.sort((a: any, b: any) => a.timestamp_seconds - b.timestamp_seconds);

      let totalDist = 0;
      let sprintCount = 0;
      const speeds: number[] = [];
      const heatmap: Array<{ x: number; y: number }> = [];

      for (let i = 0; i < tracks.length; i++) {
        heatmap.push({ x: tracks[i].bbox_x + tracks[i].bbox_width / 2, y: tracks[i].bbox_y + tracks[i].bbox_height / 2 });
        if (i > 0) {
          const dx = tracks[i].bbox_x - tracks[i - 1].bbox_x;
          const dy = tracks[i].bbox_y - tracks[i - 1].bbox_y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const dt = tracks[i].timestamp_seconds - tracks[i - 1].timestamp_seconds;
          totalDist += dist;
          if (dt > 0) {
            const speed = dist / dt;
            speeds.push(speed);
            if (speed > 5) sprintCount++;
          }
        }
      }

      const timeOnField = tracks.length >= 2 ? tracks[tracks.length - 1].timestamp_seconds - tracks[0].timestamp_seconds : videoDuration;
      const movementIntensity = Math.min(100, Math.round((totalDist / Math.max(timeOnField, 1)) * 10));
      const avgSpeed = speeds.length > 0 ? speeds.reduce((a: number, b: number) => a + b, 0) / speeds.length : 0;

      // Estimate touches via ball proximity
      let touchCount = 0;
      for (const t of tracks) {
        const cx = t.bbox_x + t.bbox_width / 2;
        const cy = t.bbox_y + t.bbox_height / 2;
        for (const ball of allBallPositions) {
          if (Math.abs(ball.timestamp - t.timestamp_seconds) < frameInterval) {
            const dist = Math.sqrt((cx - ball.x) ** 2 + (cy - ball.y) ** 2);
            if (dist < 8) { touchCount++; break; }
          }
        }
      }

      const activityScore = Math.min(100, Math.round(touchCount * 8 + tracks.length * 2 + movementIntensity * 0.3));

      // We don't have a player_id yet (coach assigns later), so we skip match_player_stats
      // The frontend "Generate Stats" button will handle that after identity tagging
      statsCount++;
    }

    // Clean up temp files
    try { await Deno.remove(tmpVideo); } catch { /* ok */ }
    try { await Deno.remove(tmpFrameDir, { recursive: true }); } catch { /* ok */ }

    // Mark as ready
    await supabase
      .from("match_videos")
      .update({
        status: "ready",
        ai_processing_error: null,
        duration_seconds: videoDuration,
      })
      .eq("id", video_id);

    console.log(`Processing complete: ${allTrackingRows.length} detections across ${frameFiles.length} frames`);

    return new Response(
      JSON.stringify({
        success: true,
        frames_processed: frameFiles.length,
        detections: allTrackingRows.length,
        unique_tracks: trackingByPlayer.size,
        ball_positions: allBallPositions.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("process-video error:", err);

    // Try to mark as error
    try {
      const body = await req.clone().json().catch(() => null);
      if (body?.video_id) {
        await supabase
          .from("match_videos")
          .update({ status: "error", ai_processing_error: String(err) })
          .eq("id", body.video_id);
      }
    } catch { /* ignore */ }

    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
