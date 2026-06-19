import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TrainingSession {
  id: string;
  coach_id: string;
  name: string;
  description: string | null;
  session_date: string | null;
  focus_area: string | null;
  created_at: string;
  updated_at: string;
  session_players?: { id: string; player_id: string }[];
  session_drills?: { id: string; drill_id: string; completed: boolean; completed_at: string | null }[];
}

export function useTrainingSessions() {
  return useQuery({
    queryKey: ['training-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*, session_players(id, player_id), session_drills(id, drill_id, completed, completed_at)')
        .order('session_date', { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data as TrainingSession[];
    },
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string | null; session_date?: string | null; focus_area?: string | null }) => {
      const { data, error } = await supabase.from('training_sessions').insert({
        coach_id: user!.id,
        name: input.name,
        description: input.description ?? null,
        session_date: input.session_date ?? null,
        focus_area: input.focus_area ?? null,
      }).select().single();
      if (error) throw error;
      return data as TrainingSession;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; description?: string | null; session_date?: string | null; focus_area?: string | null }) => {
      const { data, error } = await supabase.from('training_sessions').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as TrainingSession;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('training_sessions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}

export function useAddSessionPlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ session_id, player_id }: { session_id: string; player_id: string }) => {
      const { error } = await supabase.from('session_players').insert({ session_id, player_id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}

export function useRemoveSessionPlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('session_players').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}

export function useAddSessionDrill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ session_id, drill_id }: { session_id: string; drill_id: string }) => {
      const { error } = await supabase.from('session_drills').insert({ session_id, drill_id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}

export function useRemoveSessionDrill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('session_drills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}

export function useToggleSessionDrill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from('session_drills')
        .update({ completed, completed_at: completed ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-sessions'] }),
  });
}
