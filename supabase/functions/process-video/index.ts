import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const videoDuration = video.duration_seconds || 90;
    console.log(`Processing video: ${video.title}, duration: ${videoDuration}s`);

    // Download video and convert to base64
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
    
    // Check size — Gemini supports up to ~20MB inline
    const videoSizeMB = videoBytes.length / (1024 * 1024);
    console.log(`Video size: ${videoSizeMB.toFixed(1)} MB`);

    if (videoSizeMB > 20) {
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "Video too large for AI analysis (max 20MB). Try a shorter clip." })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "Video too large (max 20MB)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert to base64
    let base64 = "";
    const chunkSize = 32768;
    for (let i = 0; i < videoBytes.length; i += chunkSize) {
      const chunk = videoBytes.subarray(i, Math.min(i + chunkSize, videoBytes.length));
      base64 += String.fromCharCode(...chunk);
    }
    base64 = btoa(base64);

    console.log("Sending video to AI for analysis...");

    // Send entire video to Gemini for multi-frame analysis
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
      }
    );

    if (aiResponse.status === 429) {
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "AI rate limited — please try again in a minute" })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "Rate limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (aiResponse.status === 402) {
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "AI credits exhausted" })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "Credits exhausted" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: `AI analysis failed (${aiResponse.status})` })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response:", JSON.stringify(aiData).slice(0, 500));
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "AI returned no detections" })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "No detections" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let analysis: { frames: any[] };
    try {
      analysis = JSON.parse(toolCall.function.arguments);
    } catch {
      console.error("Failed to parse AI response");
      await supabase
        .from("match_videos")
        .update({ status: "error", ai_processing_error: "Failed to parse AI response" })
        .eq("id", video_id);
      return new Response(JSON.stringify({ error: "Parse error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`AI returned ${analysis.frames?.length || 0} frames`);

    // Convert to tracking rows
    const allTrackingRows: any[] = [];
    for (const frame of (analysis.frames || [])) {
      const ts = frame.timestamp_seconds || 0;
      const frameNumber = Math.round(ts * 30);

      for (const det of (frame.players || [])) {
        if (!det.bbox) continue;
        allTrackingRows.push({
          video_id,
          tracking_id: `ai_${det.tracking_id || 'unknown'}`,
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

    // Batch insert tracking data
    if (allTrackingRows.length > 0) {
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

    // Mark as ready
    await supabase
      .from("match_videos")
      .update({
        status: "ready",
        ai_processing_error: null,
      })
      .eq("id", video_id);

    const uniqueTracks = new Set(allTrackingRows.map(r => r.tracking_id)).size;
    console.log(`Processing complete: ${allTrackingRows.length} detections, ${uniqueTracks} unique players, ${analysis.frames?.length} frames`);

    return new Response(
      JSON.stringify({
        success: true,
        frames_processed: analysis.frames?.length || 0,
        detections: allTrackingRows.length,
        unique_tracks: uniqueTracks,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("process-video error:", err);

    try {
      const { video_id } = await req.clone().json().catch(() => ({ video_id: null }));
      if (video_id) {
        await supabase
          .from("match_videos")
          .update({ status: "error", ai_processing_error: String(err) })
          .eq("id", video_id);
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
