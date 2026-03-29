import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RankedPlayer {
  id: string;
  name: string;
  avatar: string;
  position: string;
  team: string;
  age: number;
  age_group: string;
  location: string;
  overall_rating: number;
  is_public: boolean;
  globalRank: number;
  localRank: number;
}

export function useRankings(filters?: { ageGroup?: string; location?: string }) {
  return useQuery({
    queryKey: ['rankings', filters?.ageGroup, filters?.location],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, avatar, position, team, age, age_group, location, overall_rating, is_public')
        .order('overall_rating', { ascending: false });

      if (error) throw error;

      // Compute global ranks
      const allPlayers = (data || []).map((p, i) => ({
        ...p,
        avatar: p.avatar || '',
        age_group: (p as any).age_group || '',
        location: (p as any).location || '',
        is_public: (p as any).is_public ?? false,
        overall_rating: Number(p.overall_rating) || 0,
        globalRank: i + 1,
        localRank: 0,
      }));

      // Compute local ranks per location+age_group
      const groups: Record<string, typeof allPlayers> = {};
      allPlayers.forEach(p => {
        const key = `${p.location}|${p.age_group}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(p);
      });
      Object.values(groups).forEach(group => {
        group.sort((a, b) => b.overall_rating - a.overall_rating);
        group.forEach((p, i) => { p.localRank = i + 1; });
      });

      // Apply filters
      let result = allPlayers;
      if (filters?.ageGroup) result = result.filter(p => p.age_group === filters.ageGroup);
      if (filters?.location) result = result.filter(p => p.location === filters.location);

      return result as RankedPlayer[];
    },
  });
}

export function usePlayerRank(playerId: string) {
  const { data: rankings } = useRankings();
  const player = rankings?.find(p => p.id === playerId);
  return player ? { globalRank: player.globalRank, localRank: player.localRank } : null;
}
