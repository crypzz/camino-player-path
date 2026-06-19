import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Drill {
  id: string;
  coach_id: string;
  name: string;
  description: string | null;
  difficulty_level: DifficultyLevel | null;
  created_at: string;
  updated_at: string;
  session_drills?: { count: number }[];
}

export function useDrills() {
  return useQuery({
    queryKey: ['drills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drills')
        .select('*, session_drills(count)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Drill[];
    },
  });
}

export function useCreateDrill() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string | null; difficulty_level?: DifficultyLevel | null }) => {
      const { data, error } = await supabase.from('drills').insert({
        coach_id: user!.id,
        name: input.name,
        description: input.description ?? null,
        difficulty_level: input.difficulty_level ?? null,
      }).select().single();
      if (error) throw error;
      return data as Drill;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['drills'] }),
  });
}

export function useUpdateDrill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; description?: string | null; difficulty_level?: DifficultyLevel | null }) => {
      const { data, error } = await supabase.from('drills').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Drill;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['drills'] }),
  });
}

export function useDeleteDrill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('drills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['drills'] });
      qc.invalidateQueries({ queryKey: ['training-sessions'] });
    },
  });
}
