import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface VideoAnnotation {
  id: string;
  video_id: string;
  timestamp_seconds: number;
  content: string;
  created_by: string;
  created_at: string;
}

export function useVideoAnnotations(videoId: string | null) {
  return useQuery({
    queryKey: ['video-annotations', videoId],
    enabled: !!videoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_annotations')
        .select('*')
        .eq('video_id', videoId!)
        .order('timestamp_seconds', { ascending: true });
      if (error) throw error;
      return data as VideoAnnotation[];
    },
  });
}

export function useCreateVideoAnnotation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (annotation: { video_id: string; timestamp_seconds: number; content: string }) => {
      const { data, error } = await supabase.from('video_annotations').insert({
        ...annotation,
        created_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data as VideoAnnotation;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ['video-annotations', data.video_id] }),
  });
}

export function useDeleteVideoAnnotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, videoId }: { id: string; videoId: string }) => {
      const { error } = await supabase.from('video_annotations').delete().eq('id', id);
      if (error) throw error;
      return videoId;
    },
    onSuccess: (videoId) => queryClient.invalidateQueries({ queryKey: ['video-annotations', videoId] }),
  });
}
