import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';


export interface Team {
  id: string;
  name: string;
  club_name: string;
  age_group: string | null;
  created_by: string;
  created_at: string;
}

export interface CoachAssignment {
  id: string;
  team_id: string;
  coach_user_id: string;
  status: string;
  assigned_at: string;
  team_name?: string;
  coach_name?: string;
}

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase.from('teams').select('*').order('name');
      if (error) throw error;
      return data as Team[];
    },
  });
}

export function useCoachAssignments() {
  return useQuery({
    queryKey: ['coach_assignments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('coach_assignments').select('*');
      if (error) throw error;
      return data as CoachAssignment[];
    },
  });
}

export function useDirectorStats() {
  return useQuery({
    queryKey: ['director-stats'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [playersRes, teamsRes, evalsRes, fitnessRes] = await Promise.all([
        supabase.from('players').select('id, name, overall_rating, team, age_group, updated_at, avatar, position'),
        supabase.from('teams').select('*'),
        supabase.from('evaluations').select('player_id, score, date').gte('date', thirtyDaysAgo.toISOString().split('T')[0]),
        supabase.from('fitness_tests').select('player_id, test_date').gte('test_date', thirtyDaysAgo.toISOString().split('T')[0]),
      ]);

      const players = playersRes.data || [];
      const teams = teamsRes.data || [];
      const recentEvals = evalsRes.data || [];
      const recentFitness = fitnessRes.data || [];

      const activePlayerIds = new Set([
        ...recentEvals.map(e => e.player_id),
        ...recentFitness.map(f => f.player_id),
      ]);

      const avgCPI = players.length > 0
        ? players.reduce((sum, p) => sum + (Number(p.overall_rating) || 0), 0) / players.length
        : 0;

      // Most improved: player with most evaluations recently
      const evalCounts: Record<string, number> = {};
      recentEvals.forEach(e => { evalCounts[e.player_id] = (evalCounts[e.player_id] || 0) + 1; });
      const mostImprovedId = Object.entries(evalCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const mostImproved = players.find(p => p.id === mostImprovedId);

      // Top ranked
      const topRanked = [...players].sort((a, b) => (Number(b.overall_rating) || 0) - (Number(a.overall_rating) || 0))[0];

      return {
        totalPlayers: players.length,
        totalTeams: teams.length,
        activePlayers: activePlayerIds.size,
        avgCPI: Math.round(avgCPI * 10) / 10,
        mostImproved: mostImproved ? { name: mostImproved.name, id: mostImproved.id } : null,
        topRanked: topRanked ? { name: topRanked.name, id: topRanked.id, rating: Number(topRanked.overall_rating) } : null,
        players,
        teams,
      };
    },
  });
}

export function useUpdateCoachStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('coach_assignments').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coach_assignments'] }),
  });
}

export function useProfiles() {
  return useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data;
    },
  });
}
