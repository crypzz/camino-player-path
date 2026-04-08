import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
