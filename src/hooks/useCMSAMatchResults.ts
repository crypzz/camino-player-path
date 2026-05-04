import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CMSAMatchResult {
  id: string;
  game_key: string;
  age_group_id: string | null;
  tier: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  home_score: number | null;
  away_score: number | null;
  match_date: string | null;
  played: boolean;
}

export interface TeamFormRow {
  team_id: string;
  team_name: string;
  tier: string;
  results: Array<"W" | "L" | "T">;
  points: number; // points from last 5
  streak: number; // consecutive wins
  goals_for: number;
  goals_against: number;
}

export function useTeamForm(ageGroupId?: string, tier?: string) {
  return useQuery({
    queryKey: ["cmsa-team-form", ageGroupId, tier],
    queryFn: async (): Promise<TeamFormRow[]> => {
      let q = supabase
        .from("cmsa_match_results")
        .select("*")
        .eq("played", true)
        .order("match_date", { ascending: false });
      if (ageGroupId) q = q.eq("age_group_id", ageGroupId);
      if (tier) q = q.eq("tier", tier);
      const { data: matches, error } = await q;
      if (error) throw error;

      const teamIds = new Set<string>();
      (matches || []).forEach(m => {
        if (m.home_team_id) teamIds.add(m.home_team_id);
        if (m.away_team_id) teamIds.add(m.away_team_id);
      });
      if (teamIds.size === 0) return [];
      const { data: teams } = await supabase
        .from("cmsa_teams")
        .select("id, name, tier")
        .in("id", Array.from(teamIds));
      const teamMap = new Map((teams || []).map(t => [t.id, t]));

      const byTeam = new Map<string, TeamFormRow>();
      for (const m of matches || []) {
        if (m.home_score == null || m.away_score == null) continue;
        const handle = (teamId: string | null, gf: number, ga: number) => {
          if (!teamId) return;
          const team = teamMap.get(teamId);
          if (!team) return;
          let row = byTeam.get(teamId);
          if (!row) {
            row = {
              team_id: teamId, team_name: team.name, tier: team.tier || "",
              results: [], points: 0, streak: 0, goals_for: 0, goals_against: 0,
            };
            byTeam.set(teamId, row);
          }
          if (row.results.length >= 5) return;
          const r: "W" | "L" | "T" = gf > ga ? "W" : gf < ga ? "L" : "T";
          row.results.push(r);
          row.goals_for += gf;
          row.goals_against += ga;
        };
        handle(m.home_team_id, m.home_score, m.away_score);
        handle(m.away_team_id, m.away_score, m.home_score);
      }

      const rows = Array.from(byTeam.values()).map(r => {
        r.points = r.results.reduce((s, x) => s + (x === "W" ? 3 : x === "T" ? 1 : 0), 0);
        let s = 0;
        for (const x of r.results) { if (x === "W") s++; else break; }
        r.streak = s;
        return r;
      });
      rows.sort((a, b) => b.points - a.points || (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against));
      return rows;
    },
    staleTime: 60_000,
  });
}

export function useBiggestWinThisWeek(ageGroupId?: string) {
  return useQuery({
    queryKey: ["cmsa-biggest-win", ageGroupId],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);
      let q = supabase
        .from("cmsa_match_results")
        .select("*, home:cmsa_teams!cmsa_match_results_home_team_id_fkey(name), away:cmsa_teams!cmsa_match_results_away_team_id_fkey(name)" as any)
        .eq("played", true)
        .gte("match_date", since.toISOString().slice(0, 10));
      if (ageGroupId) q = q.eq("age_group_id", ageGroupId);
      const { data, error } = await q;
      if (error) return null;
      let best: any = null;
      for (const m of (data || []) as any[]) {
        if (m.home_score == null || m.away_score == null) continue;
        const margin = Math.abs(m.home_score - m.away_score);
        if (!best || margin > best.margin) best = { ...m, margin };
      }
      return best;
    },
    staleTime: 60_000,
  });
}
