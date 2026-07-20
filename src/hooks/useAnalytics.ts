import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AnalyticsMatch = {
  id: string; created_by: string; club_id: string | null;
  title: string; match_date: string | null;
  home_team: string | null; away_team: string | null;
  video_url: string; fps: number | null; duration_seconds: number | null;
  status: "queued" | "processing" | "done" | "error";
  error_message: string | null; model_version: string | null;
  created_at: string; updated_at: string;
};

export function useAnalyticsMatches() {
  return useQuery({
    queryKey: ["analytics-matches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_matches")
        .select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as AnalyticsMatch[];
    },
  });
}

export function useAnalyticsMatch(id: string | null) {
  return useQuery({
    queryKey: ["analytics-match", id],
    enabled: !!id,
    refetchInterval: (q) => {
      const s = (q.state.data as AnalyticsMatch | undefined)?.status;
      return s === "queued" || s === "processing" ? 4000 : false;
    },
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_matches")
        .select("*").eq("id", id!).single();
      if (error) throw error;
      return data as AnalyticsMatch;
    },
  });
}

export function useAnalyticsPlayers(matchId: string | null) {
  return useQuery({
    queryKey: ["analytics-players", matchId],
    enabled: !!matchId,
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_players")
        .select("*, players(name)").eq("match_id", matchId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useAnalyticsEvents(matchId: string | null, playerId?: string) {
  return useQuery({
    queryKey: ["analytics-events", matchId, playerId],
    enabled: !!matchId,
    queryFn: async () => {
      let q = supabase.from("analytics_events").select("*")
        .eq("match_id", matchId!).order("t_start", { ascending: true });
      if (playerId) q = q.eq("analytics_player_id", playerId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function usePlayerMatchStats(matchId: string | null) {
  return useQuery({
    queryKey: ["analytics-player-stats", matchId],
    enabled: !!matchId,
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_player_match_stats")
        .select("*, analytics_players(display_name, jersey_number, position, team_side)")
        .eq("match_id", matchId!).order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePlayerSeasonStats(playerId: string | null) {
  return useQuery({
    queryKey: ["analytics-season", playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_player_season_stats")
        .select("*").eq("player_id", playerId!).order("season", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePlayerMatchHistoryAnalytics(playerId: string | null) {
  return useQuery({
    queryKey: ["analytics-player-history", playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_player_match_stats")
        .select("*, analytics_matches(title, match_date)")
        .eq("player_id", playerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useHighlightClips(playerId: string | null, matchId?: string) {
  return useQuery({
    queryKey: ["analytics-clips", playerId, matchId],
    enabled: !!playerId || !!matchId,
    queryFn: async () => {
      let q = supabase.from("analytics_highlight_clips").select("*")
        .order("t_start", { ascending: true });
      if (playerId) q = q.eq("player_id", playerId);
      if (matchId) q = q.eq("match_id", matchId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCoachingInsight(matchId: string | null, analyticsPlayerId: string | null) {
  return useQuery({
    queryKey: ["analytics-insight", matchId, analyticsPlayerId],
    enabled: !!matchId && !!analyticsPlayerId,
    queryFn: async () => {
      const { data, error } = await supabase.from("analytics_coaching_insights")
        .select("*").eq("match_id", matchId!).eq("analytics_player_id", analyticsPlayerId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useGenerateInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { match_id: string; analytics_player_id: string }) => {
      const { data, error } = await supabase.functions.invoke("analytics-insights", { body: p });
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["analytics-insight", v.match_id, v.analytics_player_id] }),
  });
}

export function useCreateAnalyticsMatch() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (m: { title: string; video_url: string; match_date?: string; home_team?: string; away_team?: string }) => {
      const { data, error } = await supabase.from("analytics_matches")
        .insert({ ...m, created_by: user!.id }).select().single();
      if (error) throw error;
      return data as AnalyticsMatch;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analytics-matches"] }),
  });
}
