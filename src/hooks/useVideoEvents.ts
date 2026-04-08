import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface VideoEvent {
  id: string;
  video_id: string;
  player_id: string | null;
  event_type: string;
  timestamp_seconds: number;
  x_position: number | null;
  y_position: number | null;
  notes: string | null;
  tagged_by: string;
  created_at: string;
}

export const EVENT_TYPES = ['touch', 'pass', 'shot', 'tackle', 'foul', 'save', 'goal', 'assist', 'cross', 'dribble', 'interception'] as const;
export type EventType = typeof EVENT_TYPES[number];

export const EVENT_COLORS: Record<string, string> = {
  touch: 'hsl(215, 95%, 58%)',
  pass: 'hsl(215, 95%, 58%)',
  shot: 'hsl(30, 95%, 52%)',
  tackle: 'hsl(0, 72%, 51%)',
  foul: 'hsl(0, 72%, 51%)',
  save: 'hsl(160, 72%, 42%)',
  goal: 'hsl(160, 72%, 42%)',
  assist: 'hsl(160, 72%, 42%)',
  cross: 'hsl(215, 95%, 58%)',
  dribble: 'hsl(45, 100%, 58%)',
  interception: 'hsl(0, 72%, 51%)',
};

export function useVideoEvents(videoId: string | null) {
  return useQuery({
    queryKey: ['video-events', videoId],
    enabled: !!videoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_events')
        .select('*')
        .eq('video_id', videoId!)
        .order('timestamp_seconds', { ascending: true });
      if (error) throw error;
      return data as VideoEvent[];
    },
  });
}

export function useCreateVideoEvent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (event: { video_id: string; player_id?: string; event_type: string; timestamp_seconds: number; x_position?: number; y_position?: number; notes?: string }) => {
      const { data, error } = await supabase.from('video_events').insert({
        ...event,
        tagged_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data as VideoEvent;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ['video-events', data.video_id] }),
  });
}

export function useDeleteVideoEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, videoId }: { id: string; videoId: string }) => {
      const { error } = await supabase.from('video_events').delete().eq('id', id);
      if (error) throw error;
      return videoId;
    },
    onSuccess: (videoId) => queryClient.invalidateQueries({ queryKey: ['video-events', videoId] }),
  });
}
