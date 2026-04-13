import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ScheduleSession {
  id: string;
  created_by: string;
  title: string;
  type: string;
  session_date: string;
  session_time: string;
  location: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useScheduleSessions() {
  return useQuery({
    queryKey: ['schedule-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_sessions')
        .select('*')
        .order('session_date', { ascending: true });
      if (error) throw error;
      return data as ScheduleSession[];
    },
  });
}

export function useCreateScheduleSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (session: { title: string; type: string; session_date: string; session_time: string; location: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('schedule_sessions')
        .insert({ ...session, created_by: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as ScheduleSession;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedule-sessions'] }),
  });
}

export function useDeleteScheduleSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schedule_sessions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedule-sessions'] }),
  });
}
