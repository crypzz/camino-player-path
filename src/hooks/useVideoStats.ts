import { useMemo } from 'react';
import { VideoEvent } from './useVideoEvents';

export interface PlayerStat {
  playerId: string;
  playerName?: string;
  touches: number;
  passes: number;
  shots: number;
  goals: number;
  assists: number;
  tackles: number;
  interceptions: number;
  fouls: number;
  saves: number;
  crosses: number;
  dribbles: number;
  total: number;
}

export function useVideoStats(events: VideoEvent[] | undefined, players: { id: string; name: string }[]) {
  return useMemo(() => {
    if (!events || events.length === 0) return [];

    const map = new Map<string, PlayerStat>();

    for (const e of events) {
      const pid = e.player_id || 'unknown';
      if (!map.has(pid)) {
        const p = players.find(pl => pl.id === pid);
        map.set(pid, {
          playerId: pid,
          playerName: p?.name || 'Unassigned',
          touches: 0, passes: 0, shots: 0, goals: 0, assists: 0,
          tackles: 0, interceptions: 0, fouls: 0, saves: 0, crosses: 0, dribbles: 0, total: 0,
        });
      }
      const s = map.get(pid)!;
      s.total++;
      switch (e.event_type) {
        case 'touch': s.touches++; break;
        case 'pass': s.passes++; break;
        case 'shot': s.shots++; break;
        case 'goal': s.goals++; break;
        case 'assist': s.assists++; break;
        case 'tackle': s.tackles++; break;
        case 'interception': s.interceptions++; break;
        case 'foul': s.fouls++; break;
        case 'save': s.saves++; break;
        case 'cross': s.crosses++; break;
        case 'dribble': s.dribbles++; break;
      }
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [events, players]);
}
