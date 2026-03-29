import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculatePlayerLevel, PlayerLevel } from '@/lib/playerLevel';
import { calculateCPI, Player } from '@/types/player';

export function usePlayerLevel(player: Player | null | undefined) {
  return useQuery({
    queryKey: ['player-level', player?.id],
    enabled: !!player,
    queryFn: async (): Promise<PlayerLevel> => {
      if (!player) throw new Error('No player');

      const cpi = calculateCPI(player);

      const [evalsRes, fitnessRes] = await Promise.all([
        supabase
          .from('evaluations')
          .select('id', { count: 'exact', head: true })
          .eq('player_id', player.id),
        supabase
          .from('fitness_tests')
          .select('id', { count: 'exact', head: true })
          .eq('player_id', player.id),
      ]);

      const evalCount = evalsRes.count || 0;
      const fitnessCount = fitnessRes.count || 0;

      return calculatePlayerLevel(cpi, evalCount, fitnessCount);
    },
  });
}
