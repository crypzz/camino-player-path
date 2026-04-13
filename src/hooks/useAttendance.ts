import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AttendanceRecord {
  id: string;
  session_id: string | null;
  session_date: string;
  session_type: string;
  session_title: string;
  player_id: string;
  present: boolean;
  recorded_by: string;
  created_at: string;
  updated_at: string;
}

export function useAttendanceRecords() {
  return useQuery({
    queryKey: ['attendance-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('session_date', { ascending: false });
      if (error) throw error;
      return data as AttendanceRecord[];
    },
  });
}

export function useUpsertAttendance() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (record: { session_date: string; session_type: string; session_title: string; player_id: string; present: boolean }) => {
      // Try to find existing record
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('session_date', record.session_date)
        .eq('session_title', record.session_title)
        .eq('player_id', record.player_id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('attendance_records')
          .update({ present: record.present })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('attendance_records')
          .insert({ ...record, recorded_by: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance-records'] }),
  });
}
