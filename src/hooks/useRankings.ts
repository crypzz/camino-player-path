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
  rankingScore: number;
  consistencyScore: number;
  improvementScore: number;
}

function calculateRankingScore(
  cpi: number,
  sessionsLast30Days: number,
  cpi30DaysAgo: number | null
) {
  // Consistency: sessions in last 30 days, max out at 5
  const consistencyScore = Math.min((sessionsLast30Days / 5) * 100, 100);

  // Improvement: CPI change over 30 days, normalized to 0–100
  const improvementRaw = cpi30DaysAgo !== null ? cpi - cpi30DaysAgo : 0;
  let improvementScore = 50 + improvementRaw * 5;
  improvementScore = Math.max(0, Math.min(100, improvementScore));

  // Final: 60% CPI + 20% Consistency + 20% Improvement
  const rankingScore =
    cpi * 0.6 +
    consistencyScore * 0.2 +
    improvementScore * 0.2;

  return { rankingScore, consistencyScore, improvementScore };
}

export function useRankings(filters?: { ageGroup?: string; location?: string }) {
  return useQuery({
    queryKey: ['rankings', filters?.ageGroup, filters?.location],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const cutoff = thirtyDaysAgo.toISOString().split('T')[0];

      // Fetch players, recent evaluations, and recent fitness tests in parallel
      const [playersRes, evalsRes, fitnessRes] = await Promise.all([
        supabase
          .from('players')
          .select('id, name, avatar, position, team, age, age_group, location, overall_rating, is_public'),
        supabase
          .from('evaluations')
          .select('player_id, date, score')
          .gte('date', cutoff)
          .order('date', { ascending: true }),
        supabase
          .from('fitness_tests')
          .select('player_id, test_date')
          .gte('test_date', cutoff),
      ]);

      if (playersRes.error) throw playersRes.error;

      const evals = evalsRes.data || [];
      const fitness = fitnessRes.data || [];

      // Build per-player session counts and CPI history
      const sessionCounts: Record<string, number> = {};
      const earliestCpi: Record<string, number> = {};

      evals.forEach(e => {
        sessionCounts[e.player_id] = (sessionCounts[e.player_id] || 0) + 1;
        // Track earliest eval score in the window as "cpi30DaysAgo"
        if (!(e.player_id in earliestCpi)) {
          earliestCpi[e.player_id] = Number(e.score);
        }
      });

      fitness.forEach(f => {
        sessionCounts[f.player_id] = (sessionCounts[f.player_id] || 0) + 1;
      });

      // Compute ranking scores
      const allPlayers = (playersRes.data || []).map(p => {
        const cpi = Number(p.overall_rating) || 0;
        const sessions = sessionCounts[p.id] || 0;
        const cpi30Ago = p.id in earliestCpi ? earliestCpi[p.id] : null;

        const { rankingScore, consistencyScore, improvementScore } =
          calculateRankingScore(cpi, sessions, cpi30Ago);

        return {
          ...p,
          avatar: p.avatar || '',
          age_group: (p as any).age_group || '',
          location: (p as any).location || '',
          is_public: (p as any).is_public ?? false,
          overall_rating: cpi,
          rankingScore,
          consistencyScore,
          improvementScore,
          globalRank: 0,
          localRank: 0,
        };
      });

      // Sort by ranking score (descending) and assign global ranks
      allPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
      allPlayers.forEach((p, i) => { p.globalRank = i + 1; });

      // Compute local ranks per location+age_group
      const groups: Record<string, typeof allPlayers> = {};
      allPlayers.forEach(p => {
        const key = `${p.location}|${p.age_group}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(p);
      });
      Object.values(groups).forEach(group => {
        group.sort((a, b) => b.rankingScore - a.rankingScore);
        group.forEach((p, i) => { p.localRank = i + 1; });
      });

      // Apply filters
      let result = allPlayers;
      if (filters?.ageGroup) result = result.filter(p => p.age_group === filters.ageGroup);
      if (filters?.location) result = result.filter(p => p.location === filters.location);

      // Re-sort after filtering
      result.sort((a, b) => b.rankingScore - a.rankingScore);

      return result as RankedPlayer[];
    },
  });
}

export function usePlayerRank(playerId: string) {
  const { data: rankings } = useRankings();
  const player = rankings?.find(p => p.id === playerId);
  return player ? { globalRank: player.globalRank, localRank: player.localRank } : null;
}
