import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type NoteVisibility = 'private' | 'player' | 'parent';

export interface CoachingNote {
  id: string;
  match_id: string | null;
  player_id: string | null;
  coach_id: string;
  timestamp_seconds: number | null;
  note: string;
  visibility: NoteVisibility;
  created_at: string;
  updated_at: string;
}

export function useCoachingNotes(matchId: string | null) {
  return useQuery({
    queryKey: ['coaching-notes', matchId],
    enabled: !!matchId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coaching_notes')
        .select('*')
        .eq('match_id', matchId!)
        .order('timestamp_seconds', { ascending: true, nullsFirst: true });
      if (error) throw error;
      return data as CoachingNote[];
    },
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      match_id: string;
      player_id?: string | null;
      timestamp_seconds?: number | null;
      note: string;
      visibility: NoteVisibility;
    }) => {
      const { data, error } = await supabase.from('coaching_notes').insert({
        coach_id: user!.id,
        match_id: input.match_id,
        player_id: input.player_id ?? null,
        timestamp_seconds: input.timestamp_seconds ?? null,
        note: input.note,
        visibility: input.visibility,
      }).select().single();
      if (error) throw error;
      return data as CoachingNote;
    },
    onSuccess: (d) => qc.invalidateQueries({ queryKey: ['coaching-notes', d.match_id] }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; note?: string; visibility?: NoteVisibility; player_id?: string | null }) => {
      const { data, error } = await supabase.from('coaching_notes').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as CoachingNote;
    },
    onSuccess: (d) => qc.invalidateQueries({ queryKey: ['coaching-notes', d.match_id] }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, matchId }: { id: string; matchId: string }) => {
      const { error } = await supabase.from('coaching_notes').delete().eq('id', id);
      if (error) throw error;
      return matchId;
    },
    onSuccess: (matchId) => qc.invalidateQueries({ queryKey: ['coaching-notes', matchId] }),
  });
}
