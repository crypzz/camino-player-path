import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicPlayerCard {
  id: string;
  position: string | null;
  age_group: string | null;
  overall_rating: number | null;
  preferred_foot: string | null;
  team: string | null;
  avatar: string | null;
  is_public: boolean | null;
}

/** Fetch a single public player card by ID — uses the restricted view for anonymous access */
export function usePublicPlayer(playerId: string | undefined) {
  return useQuery({
    queryKey: ['public-player', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_player_cards')
        .select('*')
        .eq('id', playerId!)
        .single();
      if (error) throw error;
      return data as PublicPlayerCard;
    },
  });
}
