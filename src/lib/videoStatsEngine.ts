/**
 * Video Stats Engine — Calculates player performance metrics from tracking data.
 * Designed as an abstraction layer so real AI models can replace the logic later.
 */

import { PlayerTracking } from '@/hooks/usePlayerTracking';
import { VideoEvent } from '@/hooks/useVideoEvents';

export interface ComputedPlayerStats {
  playerId: string;
  movementIntensity: number;   // 0–100
  activityScore: number;       // 0–100
  estimatedTouches: number;
  timeOnField: number;         // seconds
  positionsTracked: number;
  sprintCount: number;
  avgSpeed: number;            // px/s conceptual
  distanceCovered: number;     // arbitrary units
  heatmapData: Array<{ x: number; y: number }>;
}

/** Compute stats for all players in a video from tracking + event data */
export function computePlayerStats(
  tracking: PlayerTracking[],
  events: VideoEvent[],
  videoDuration: number,
): ComputedPlayerStats[] {
  const playerMap = new Map<string, PlayerTracking[]>();
  const eventMap = new Map<string, VideoEvent[]>();

  // Group tracking by player
  for (const t of tracking) {
    if (!t.player_id) continue;
    if (!playerMap.has(t.player_id)) playerMap.set(t.player_id, []);
    playerMap.get(t.player_id)!.push(t);
  }

  // Group events by player
  for (const e of events) {
    if (!e.player_id) continue;
    if (!eventMap.has(e.player_id)) eventMap.set(e.player_id, []);
    eventMap.get(e.player_id)!.push(e);
  }

  // Merge all player IDs
  const allPlayerIds = new Set([...playerMap.keys(), ...eventMap.keys()]);
  const results: ComputedPlayerStats[] = [];

  for (const playerId of allPlayerIds) {
    const tracks = playerMap.get(playerId) || [];
    const playerEvents = eventMap.get(playerId) || [];

    // Sort tracks by timestamp
    tracks.sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);

    // Calculate distance from position changes
    let totalDistance = 0;
    let sprintCount = 0;
    const speeds: number[] = [];
    const heatmapData: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < tracks.length; i++) {
      heatmapData.push({ x: tracks[i].bbox_x + tracks[i].bbox_width / 2, y: tracks[i].bbox_y + tracks[i].bbox_height / 2 });

      if (i > 0) {
        const dx = tracks[i].bbox_x - tracks[i - 1].bbox_x;
        const dy = tracks[i].bbox_y - tracks[i - 1].bbox_y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dt = tracks[i].timestamp_seconds - tracks[i - 1].timestamp_seconds;
        totalDistance += dist;

        if (dt > 0) {
          const speed = dist / dt;
          speeds.push(speed);
          if (speed > 15) sprintCount++; // threshold for "sprint"
        }
      }
    }

    // Time on field: span from first to last tracking entry
    const timeOnField = tracks.length >= 2
      ? tracks[tracks.length - 1].timestamp_seconds - tracks[0].timestamp_seconds
      : videoDuration;

    // Touches from events
    const touchEvents = ['touch', 'pass', 'shot', 'dribble', 'cross'];
    const estimatedTouches = playerEvents.filter(e => touchEvents.includes(e.event_type)).length;

    // Movement intensity: normalize distance over time (0–100)
    const movementIntensity = Math.min(100, Math.round(
      (totalDistance / Math.max(timeOnField, 1)) * 10
    ));

    // Activity score: combination of events + tracking density
    const eventDensity = playerEvents.length / Math.max(videoDuration / 60, 1); // events per minute
    const trackDensity = tracks.length / Math.max(videoDuration / 60, 1);
    const activityScore = Math.min(100, Math.round(
      (eventDensity * 8 + trackDensity * 2 + movementIntensity * 0.3)
    ));

    const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

    results.push({
      playerId,
      movementIntensity,
      activityScore,
      estimatedTouches,
      timeOnField,
      positionsTracked: tracks.length,
      sprintCount,
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      distanceCovered: Math.round(totalDistance),
      heatmapData,
    });
  }

  return results.sort((a, b) => b.activityScore - a.activityScore);
}
