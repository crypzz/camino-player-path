import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export interface MatchVideo {
  id: string;
  created_by: string;
  title: string;
  type: string;
  video_url: string;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  match_date: string | null;
  team: string | null;
  opponent: string | null;
  notes: string | null;
  status: string;
  age_group: string | null;
  ai_processing_started_at: string | null;
  ai_processing_error: string | null;
  created_at: string;
  updated_at: string;
}

export function useMatchVideos(filter?: string) {
  return useQuery({
    queryKey: ['match-videos', filter],
    queryFn: async () => {
      let q = supabase.from('match_videos').select('*').order('created_at', { ascending: false });
      if (filter && filter !== 'all') q = q.eq('type', filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as MatchVideo[];
    },
  });
}

export function useMatchVideo(id: string | null) {
  return useQuery({
    queryKey: ['match-video', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('match_videos').select('*').eq('id', id!).single();
      if (error) throw error;
      return data as MatchVideo;
    },
  });
}

/** Poll a video's status while it's processing */
export function useVideoProcessingPoll(videoId: string | null, status: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!videoId || (status !== 'processing' && status !== 'queued')) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('match_videos')
        .select('status, ai_processing_error')
        .eq('id', videoId)
        .single();

      if (data && (data.status !== 'processing' && data.status !== 'queued')) {
        queryClient.invalidateQueries({ queryKey: ['match-videos'] });
        queryClient.invalidateQueries({ queryKey: ['match-video', videoId] });
        queryClient.invalidateQueries({ queryKey: ['player-tracking', videoId] });
        queryClient.invalidateQueries({ queryKey: ['match-player-stats', videoId] });
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [videoId, status, queryClient]);
}

export function useCreateMatchVideo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (video: { title: string; type: string; video_url: string; duration_seconds?: number; match_date?: string; team?: string; opponent?: string; notes?: string }) => {
      const { data, error } = await supabase.from('match_videos').insert({
        ...video,
        created_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data as MatchVideo;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['match-videos'] }),
  });
}

export function useDeleteMatchVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('match_videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['match-videos'] }),
  });
}

export function useAIAnalyzeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      // Set status to processing first
      await supabase
        .from('match_videos')
        .update({ status: 'processing' })
        .eq('id', videoId);

      queryClient.invalidateQueries({ queryKey: ['match-videos'] });

      const { data, error } = await supabase.functions.invoke('process-video', {
        body: { video_id: videoId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-videos'] });
    },
  });
}
