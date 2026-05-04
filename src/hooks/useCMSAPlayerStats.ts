import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CMSAPlayerStat {
  id: string;
  team_id: string;
  age_group_id: string;
  tier: string;
  player_name: string;
  goals: number;
  assists: number;
  games_played: number;
  updated_at: string;
  cmsa_teams: { id: string; name: string; external_id: string } | null;
}

export function useCMSAPlayerStats(ageGroupId?: string, tier?: string) {
  return useQuery({
    queryKey: ["cmsa-player-stats", ageGroupId, tier],
    queryFn: async () => {
      let q = supabase
        .from("cmsa_player_stats")
        .select("*, cmsa_teams!inner(id, name, external_id)")
        .order("goals", { ascending: false })
        .order("assists", { ascending: false });
      if (ageGroupId) q = q.eq("age_group_id", ageGroupId);
      if (tier) q = q.eq("tier", tier);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as CMSAPlayerStat[];
    },
    staleTime: 30_000,
  });
}

export interface LogMatchEntry {
  player_name: string;
  goals: number;
  assists: number;
  played: boolean;
}

export function useLogMatchStats() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      team_id: string;
      age_group_id: string;
      tier: string;
      match_date: string;
      opponent?: string | null;
      entries: LogMatchEntry[];
    }) => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) throw new Error("Not signed in");
      const rows = input.entries
        .filter(e => e.player_name.trim() && (e.goals > 0 || e.assists > 0 || e.played))
        .map(e => ({
          team_id: input.team_id,
          age_group_id: input.age_group_id,
          tier: input.tier,
          player_name: e.player_name.trim(),
          match_date: input.match_date,
          opponent: input.opponent || null,
          goals: e.goals,
          assists: e.assists,
          played: e.played,
          logged_by: uid,
        }));
      if (rows.length === 0) throw new Error("Add at least one player");
      const { error } = await supabase.from("cmsa_match_goals").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cmsa-player-stats"] });
    },
  });
}
