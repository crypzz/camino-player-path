import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PlayerTracking {
  id: string;
  video_id: string;
  player_id: string | null;
  tracking_id: string;
  frame_number: number;
  timestamp_seconds: number;
  bbox_x: number;
  bbox_y: number;
  bbox_width: number;
  bbox_height: number;
  confidence: number;
  source: string;
  created_by: string;
  created_at: string;
}

export function usePlayerTracking(videoId: string | null) {
  return useQuery({
    queryKey: ['player-tracking', videoId],
    enabled: !!videoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_tracking')
        .select('*')
        .eq('video_id', videoId!)
        .order('timestamp_seconds', { ascending: true });
      if (error) throw error;
      return data as PlayerTracking[];
    },
  });
}

export function useCreatePlayerTracking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tracking: {
      video_id: string;
      player_id?: string;
      tracking_id: string;
      frame_number: number;
      timestamp_seconds: number;
      bbox_x: number;
      bbox_y: number;
      bbox_width: number;
      bbox_height: number;
      confidence?: number;
      source?: string;
    }) => {
      const { data, error } = await supabase.from('player_tracking').insert({
        ...tracking,
        created_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data as PlayerTracking;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ['player-tracking', data.video_id] }),
  });
}

export function useDeletePlayerTracking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, videoId }: { id: string; videoId: string }) => {
      const { error } = await supabase.from('player_tracking').delete().eq('id', id);
      if (error) throw error;
      return videoId;
    },
    onSuccess: (videoId) => queryClient.invalidateQueries({ queryKey: ['player-tracking', videoId] }),
  });
}

/** Get unique tracked players for a video (distinct player_id + tracking_id combos) */
export function useTrackedPlayers(videoId: string | null) {
  const { data: tracking } = usePlayerTracking(videoId);
  
  const trackedPlayers = new Map<string, { trackingId: string; playerId: string | null; count: number }>();
  
  if (tracking) {
    for (const t of tracking) {
      if (!trackedPlayers.has(t.tracking_id)) {
        trackedPlayers.set(t.tracking_id, {
          trackingId: t.tracking_id,
          playerId: t.player_id,
          count: 0,
        });
      }
      trackedPlayers.get(t.tracking_id)!.count++;
    }
  }

  return Array.from(trackedPlayers.values());
}
