import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PlayerCV {
  id: string;
  player_id: string;
  user_id: string;
  slug: string;
  full_name: string;
  position: string;
  preferred_foot: string;
  height: number | null;
  weight: number | null;
  age: number | null;
  date_of_birth: string | null;
  current_team: string;
  previous_teams: string[];
  achievements: string[];
  bio: string;
  highlight_video_url: string | null;
  template: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).slice(2, 8);
}

export function usePlayerCV(playerId: string | null) {
  return useQuery({
    queryKey: ['player-cv', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_cvs')
        .select('*')
        .eq('player_id', playerId!)
        .maybeSingle();
      if (error) throw error;
      return data as PlayerCV | null;
    },
  });
}

export function usePlayerCVBySlug(slug: string | null) {
  return useQuery({
    queryKey: ['player-cv-slug', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_cvs')
        .select('*')
        .eq('slug', slug!)
        .eq('is_published', true)
        .maybeSingle();
      if (error) throw error;
      return data as PlayerCV | null;
    },
  });
}

export function useCreatePlayerCV() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (cv: Omit<PlayerCV, 'id' | 'user_id' | 'slug' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('player_cvs')
        .insert({
          ...cv,
          user_id: user!.id,
          slug: generateSlug(cv.full_name),
        })
        .select()
        .single();
      if (error) throw error;
      return data as PlayerCV;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['player-cv', data.player_id] });
    },
  });
}

export function useUpdatePlayerCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<PlayerCV>) => {
      const { data, error } = await supabase
        .from('player_cvs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as PlayerCV;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['player-cv', data.player_id] });
      queryClient.invalidateQueries({ queryKey: ['player-cv-slug'] });
    },
  });
}
