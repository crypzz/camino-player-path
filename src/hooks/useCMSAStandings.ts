import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CMSAStanding {
  id: string;
  team_id: string;
  age_group_id: string;
  tier: string;
  rank: number | null;
  gp: number; w: number; t: number; l: number;
  pts: number; gf: number; ga: number; gd: number;
  scraped_at: string;
  cmsa_teams: { id: string; name: string; external_id: string } | null;
}

export function useCMSAAgeGroups() {
  return useQuery({
    queryKey: ["cmsa-age-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cmsa_age_groups")
        .select("id, label, source_url, display_order")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCMSAStandings(ageGroupId?: string, tier?: string) {
  return useQuery({
    queryKey: ["cmsa-standings", ageGroupId, tier],
    queryFn: async () => {
      let q = supabase
        .from("cmsa_standings")
        .select("*, cmsa_teams!inner(id, name, external_id)")
        .order("tier", { ascending: true })
        .order("rank", { ascending: true });
      if (ageGroupId) q = q.eq("age_group_id", ageGroupId);
      if (tier) q = q.eq("tier", tier);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as CMSAStanding[];
    },
    staleTime: 60_000,
  });
}

export function useLatestScrapeRun() {
  return useQuery({
    queryKey: ["cmsa-latest-scrape"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cmsa_scrape_runs")
        .select("*")
        .order("ran_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    refetchInterval: 30_000,
  });
}

export async function triggerCMSARefresh() {
  const { data, error } = await supabase.functions.invoke("scrape-cmsa-standings", {
    body: {},
  });
  if (error) throw error;
  return data;
}
