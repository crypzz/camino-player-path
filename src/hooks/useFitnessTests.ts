import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FitnessTest {
  id: string;
  player_id: string;
  tested_by: string;
  test_date: string;
  beep_test_level: number | null;
  beep_test_shuttles: number | null;
  sprint_10m: number | null;
  sprint_30m: number | null;
  agility_time: number | null;
  vertical_jump: number | null;
  endurance_distance: number | null;
  notes: string | null;
  created_at: string;
}

export function useFitnessTests(playerId?: string) {
  return useQuery({
    queryKey: ['fitness-tests', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fitness_tests' as any)
        .select('*')
        .eq('player_id', playerId!)
        .order('test_date', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as FitnessTest[];
    },
  });
}

export function useCreateFitnessTest() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (values: {
      player_id: string;
      test_date: string;
      beep_test_level?: number | null;
      beep_test_shuttles?: number | null;
      sprint_10m?: number | null;
      sprint_30m?: number | null;
      agility_time?: number | null;
      vertical_jump?: number | null;
      endurance_distance?: number | null;
      notes?: string;
    }) => {
      if (!session?.user?.id) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('fitness_tests' as any)
        .insert({ ...values, tested_by: session.user.id } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fitness-tests', variables.player_id] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
