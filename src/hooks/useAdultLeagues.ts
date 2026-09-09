import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdultLeague {
  id: string;
  name: string;
  short_name: string;
  gender: string;
  site_url: string;
  season_label: string | null;
  display_order: number;
}

export interface AdultDivision {
  id: string;
  league_id: string;
  name: string;
  external_did: string;
  external_catid: string;
  display_order: number;
}

export interface AdultStanding {
  id: string;
  league_id: string;
  division_id: string;
  team_id: string;
  rank: number | null;
  gp: number; w: number; l: number; t: number;
  pts: number; gf: number; ga: number; gd: number;
  scraped_at: string;
  adult_teams: { id: string; name: string } | null;
}

export interface AdultMatchResult {
  id: string;
  league_id: string;
  division_id: string | null;
  home_team_name: string | null;
  away_team_name: string | null;
  home_score: number | null;
  away_score: number | null;
  match_date: string | null;
  venue: string | null;
  played: boolean;
}

export function useAdultLeagues() {
  return useQuery({
    queryKey: ["adult-leagues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adult_leagues")
        .select("id, name, short_name, gender, site_url, season_label, display_order")
        .order("display_order");
      if (error) throw error;
      return (data || []) as AdultLeague[];
    },
    staleTime: 60_000,
  });
}

export function useAdultDivisions(leagueId?: string) {
  return useQuery({
    queryKey: ["adult-divisions", leagueId],
    enabled: !!leagueId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adult_divisions")
        .select("id, league_id, name, external_did, external_catid, display_order")
        .eq("league_id", leagueId!)
        .order("display_order");
      if (error) throw error;
      return (data || []) as AdultDivision[];
    },
    staleTime: 60_000,
  });
}

export function useAdultStandings(divisionId?: string) {
  return useQuery({
    queryKey: ["adult-standings", divisionId],
    enabled: !!divisionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adult_standings")
        .select("*, adult_teams!inner(id, name)")
        .eq("division_id", divisionId!)
        .order("rank", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as AdultStanding[];
    },
    staleTime: 60_000,
  });
}

export function useAdultResults(divisionId?: string) {
  return useQuery({
    queryKey: ["adult-results", divisionId],
    enabled: !!divisionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adult_match_results")
        .select("*")
        .eq("division_id", divisionId!)
        .order("match_date", { ascending: false, nullsFirst: false })
        .limit(200);
      if (error) throw error;
      return (data || []) as unknown as AdultMatchResult[];
    },
    staleTime: 60_000,
  });
}

export function useLatestAdultRun(leagueId?: string) {
  return useQuery({
    queryKey: ["adult-latest-run", leagueId],
    queryFn: async () => {
      let q = supabase
        .from("adult_scrape_runs")
        .select("*")
        .order("ran_at", { ascending: false })
        .limit(1);
      if (leagueId) q = q.eq("league_id", leagueId);
      const { data, error } = await q.maybeSingle();
      if (error) throw error;
      return data;
    },
    refetchInterval: 60_000,
  });
}

export async function triggerAdultRefresh(leagueId?: string) {
  const { data, error } = await supabase.functions.invoke("scrape-adult-leagues", {
    body: leagueId ? { league_id: leagueId } : {},
  });
  if (error) throw error;
  return data;
}

/** Team goal totals taken straight from the league's published results. */
export function useAdultTopTeamGoals(divisionId?: string) {
  const { data: standings = [], isLoading } = useAdultStandings(divisionId);
  const rows = [...standings]
    .sort((a, b) => b.gf - a.gf)
    .map((s) => ({
      team: s.adult_teams?.name ?? "Unknown",
      gf: s.gf,
      ga: s.ga,
      gd: s.gd,
      gp: s.gp,
      perGame: s.gp > 0 ? s.gf / s.gp : 0,
    }));
  return { rows, isLoading };
}
