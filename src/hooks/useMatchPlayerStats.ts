import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface MatchPlayerStat {
  id: string;
  video_id: string;
  player_id: string;
  movement_intensity: number;
  activity_score: number;
  estimated_touches: number;
  time_on_field: number;
  positions_tracked: number;
  sprint_count: number;
  avg_speed: number;
  distance_covered: number;
  heatmap_data: Array<{ x: number; y: number }>;
  integrated: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useMatchPlayerStats(videoId: string | null) {
  return useQuery({
    queryKey: ['match-player-stats', videoId],
    enabled: !!videoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_player_stats')
        .select('*')
        .eq('video_id', videoId!)
        .order('activity_score', { ascending: false });
      if (error) throw error;
      return data as MatchPlayerStat[];
    },
  });
}

export function usePlayerMatchHistory(playerId: string | null) {
  return useQuery({
    queryKey: ['player-match-history', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_player_stats')
        .select('*, match_videos(title, match_date, team, opponent)')
        .eq('player_id', playerId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertMatchPlayerStats() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (stats: {
      video_id: string;
      player_id: string;
      movement_intensity?: number;
      activity_score?: number;
      estimated_touches?: number;
      time_on_field?: number;
      positions_tracked?: number;
      sprint_count?: number;
      avg_speed?: number;
      distance_covered?: number;
      heatmap_data?: Array<{ x: number; y: number }>;
    }) => {
      const { data, error } = await supabase.from('match_player_stats').upsert({
        ...stats,
        created_by: user!.id,
      }, { onConflict: 'video_id,player_id' }).select().single();
      if (error) throw error;
      return data as MatchPlayerStat;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ['match-player-stats', data.video_id] }),
  });
}

export function useIntegrateStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (statId: string) => {
      const { data, error } = await supabase
        .from('match_player_stats')
        .update({ integrated: true })
        .eq('id', statId)
        .select()
        .single();
      if (error) throw error;
      return data as MatchPlayerStat;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['match-player-stats', data.video_id] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
