import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, RefreshCw, ExternalLink, Goal, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  useCMSAAgeGroups,
  useCMSAStandings,
  useLatestScrapeRun,
  triggerCMSARefresh,
} from "@/hooks/useCMSAStandings";
import { useCMSAPlayerStats } from "@/hooks/useCMSAPlayerStats";
import { useTeamForm } from "@/hooks/useCMSAMatchResults";
import { CMSAStandingsTable } from "@/components/cmsa/CMSAStandingsTable";
import { TopScorersTable } from "@/components/cmsa/TopScorersTable";
import { TeamFormTable } from "@/components/cmsa/TeamFormTable";
import { LogMatchStatsDialog } from "@/components/cmsa/LogMatchStatsDialog";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

function timeAgo(iso?: string | null) {
  if (!iso) return "never";
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export default function CMSAStandingsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { profile } = useAuth();
  const canLog = profile?.role === "coach" || profile?.role === "director";

  const [ageGroup, setAgeGroup] = useState<string>("u13_u19");
  const [tier, setTier] = useState<string>("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data: ageGroups = [] } = useCMSAAgeGroups();
  const { data: standings = [], isLoading } = useCMSAStandings(ageGroup || undefined);
  const { data: scorers = [], isLoading: scorersLoading } = useCMSAPlayerStats(ageGroup || undefined, tier || undefined);
  const { data: form = [], isLoading: formLoading } = useTeamForm(ageGroup || undefined, tier || undefined);
  const { data: latestRun } = useLatestScrapeRun();

  const tiers = useMemo(() => Array.from(new Set(standings.map(s => s.tier))).sort(), [standings]);

  const filteredStandings = useMemo(() => {
    let r = standings;
    if (tier) r = r.filter(s => s.tier === tier);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(s => s.cmsa_teams?.name?.toLowerCase().includes(q));
    }
    return r;
  }, [standings, tier, search]);

  const filteredScorers = useMemo(() => {
    if (!search.trim()) return scorers;
    const q = search.toLowerCase();
    return scorers.filter(s =>
      s.player_name.toLowerCase().includes(q) ||
      s.cmsa_teams?.name?.toLowerCase().includes(q)
    );
  }, [scorers, search]);

  const filteredForm = useMemo(() => {
    if (!search.trim()) return form;
    const q = search.toLowerCase();
    return form.filter(r => r.team_name.toLowerCase().includes(q));
  }, [form, search]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await triggerCMSARefresh();
      await qc.invalidateQueries({ queryKey: ["cmsa-standings"] });
      await qc.invalidateQueries({ queryKey: ["cmsa-team-form"] });
      await qc.invalidateQueries({ queryKey: ["cmsa-latest-scrape"] });
      toast({ title: "Standings updated", description: "Latest CMSA data pulled." });
    } catch (e) {
      toast({
        title: "Refresh failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            CMSA Standings
          </h1>
          <p className="text-muted-foreground text-[13px] mt-0.5">
            Live team standings from Calgary Minor Soccer Association — Outdoor 2026.
            <span className="ml-2 text-muted-foreground/70">
              Last updated {timeAgo(latestRun?.ran_at)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canLog && <LogMatchStatsDialog ageGroupId={ageGroup} />}
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://calgaryminorsoccer.com/league/schedules-standings/standings"
              target="_blank" rel="noreferrer"
              className="gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Source
            </a>
          </Button>
          <Button size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        <Select value={ageGroup} onValueChange={(v) => { setAgeGroup(v); setTier(""); }}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Age group" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map(ag => (
              <SelectItem key={ag.id} value={ag.id}>{ag.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tier || "all"} onValueChange={(v) => setTier(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[220px] h-8 text-xs">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            {tiers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search team or player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[220px] h-8 text-xs"
        />
      </div>

      <Tabs defaultValue="standings" className="w-full">
        <TabsList>
          <TabsTrigger value="standings" className="gap-1.5"><Trophy className="h-3.5 w-3.5" />Standings</TabsTrigger>
          <TabsTrigger value="scorers" className="gap-1.5"><Goal className="h-3.5 w-3.5" />Top Scorers</TabsTrigger>
          <TabsTrigger value="form" className="gap-1.5"><Activity className="h-3.5 w-3.5" />Team Form</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <CMSAStandingsTable rows={filteredStandings} />
          )}
        </TabsContent>

        <TabsContent value="scorers" className="mt-4">
          {scorersLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <TopScorersTable rows={filteredScorers} />
          )}
        </TabsContent>

        <TabsContent value="form" className="mt-4">
          {formLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <TeamFormTable rows={filteredForm} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
