import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RefreshCw, ExternalLink, Goal, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  useAdultLeagues,
  useAdultDivisions,
  useAdultStandings,
  useAdultResults,
  useAdultTopTeamGoals,
  useLatestAdultRun,
  triggerAdultRefresh,
} from "@/hooks/useAdultLeagues";
import { AdultStandingsTable } from "@/components/leagues/AdultStandingsTable";
import { AdultResultsTable } from "@/components/leagues/AdultResultsTable";
import { AdultGoalsTable } from "@/components/leagues/AdultGoalsTable";

function timeAgo(iso?: string | null) {
  if (!iso) return "never";
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

export default function AdultLeaguesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { profile } = useAuth();
  const canRefresh = profile?.role === "coach" || profile?.role === "director";

  const [leagueId, setLeagueId] = useState<string>("cusa");
  const [divisionId, setDivisionId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data: leagues = [] } = useAdultLeagues();
  const { data: divisions = [] } = useAdultDivisions(leagueId);
  const { data: standings = [], isLoading } = useAdultStandings(divisionId || undefined);
  const { data: results = [], isLoading: resultsLoading } = useAdultResults(divisionId || undefined);
  const { rows: goalRows } = useAdultTopTeamGoals(divisionId || undefined);
  const { data: latestRun } = useLatestAdultRun(leagueId);

  const league = leagues.find((l) => l.id === leagueId);

  useEffect(() => {
    if (divisions.length > 0 && !divisions.some((d) => d.id === divisionId)) {
      setDivisionId(divisions[0].id);
    }
  }, [divisions, divisionId]);

  const filteredStandings = useMemo(() => {
    if (!search.trim()) return standings;
    const q = search.toLowerCase();
    return standings.filter((s) => s.adult_teams?.name?.toLowerCase().includes(q));
  }, [standings, search]);

  const filteredResults = useMemo(() => {
    if (!search.trim()) return results;
    const q = search.toLowerCase();
    return results.filter(
      (r) =>
        r.home_team_name?.toLowerCase().includes(q) ||
        r.away_team_name?.toLowerCase().includes(q),
    );
  }, [results, search]);

  const filteredGoals = useMemo(() => {
    if (!search.trim()) return goalRows;
    const q = search.toLowerCase();
    return goalRows.filter((r) => r.team.toLowerCase().includes(q));
  }, [goalRows, search]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await triggerAdultRefresh(leagueId);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["adult-leagues"] }),
        qc.invalidateQueries({ queryKey: ["adult-divisions"] }),
        qc.invalidateQueries({ queryKey: ["adult-standings"] }),
        qc.invalidateQueries({ queryKey: ["adult-results"] }),
        qc.invalidateQueries({ queryKey: ["adult-latest-run"] }),
      ]);
      toast({ title: "Standings updated", description: `Latest ${league?.short_name ?? ""} data pulled.` });
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
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <h1 className="flex items-center gap-2 text-xl font-display font-bold tracking-tight text-foreground">
            <Trophy className="h-5 w-5 text-primary" />
            Calgary Adult Leagues
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Men's (CUSA) and Women's (CWSA) standings, results and goals — imported straight from the league sites.
            <span className="ml-2 text-muted-foreground/70">Last updated {timeAgo(latestRun?.ran_at)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {league && (
            <Button variant="outline" size="sm" asChild>
              <a href={league.site_url} target="_blank" rel="noreferrer" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Source
              </a>
            </Button>
          )}
          {canRefresh && (
            <Button size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1.5">
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {leagues.map((l) => (
          <Button
            key={l.id}
            size="sm"
            variant={l.id === leagueId ? "default" : "outline"}
            onClick={() => {
              setLeagueId(l.id);
              setDivisionId("");
            }}
            className="h-8 text-xs"
          >
            {l.gender === "womens" ? "Women's" : "Men's"} · {l.short_name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={divisionId} onValueChange={setDivisionId}>
          <SelectTrigger className="h-8 w-[240px] text-xs">
            <SelectValue placeholder="Division" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-[220px] text-xs"
        />
        {league?.season_label && (
          <span className="flex items-center rounded-md bg-muted px-2.5 text-xs text-muted-foreground">
            {league.season_label}
          </span>
        )}
      </div>

      {divisions.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No divisions imported yet.{" "}
          {canRefresh ? "Hit Refresh to pull the leagues in." : "Ask a coach or director to run the first import."}
        </div>
      ) : (
        <Tabs defaultValue="standings" className="w-full">
          <TabsList>
            <TabsTrigger value="standings" className="gap-1.5"><Trophy className="h-3.5 w-3.5" />Standings</TabsTrigger>
            <TabsTrigger value="goals" className="gap-1.5"><Goal className="h-3.5 w-3.5" />Goals</TabsTrigger>
            <TabsTrigger value="results" className="gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Results</TabsTrigger>
          </TabsList>

          <TabsContent value="standings" className="mt-4">
            {isLoading ? <Spinner /> : <AdultStandingsTable rows={filteredStandings} />}
          </TabsContent>

          <TabsContent value="goals" className="mt-4">
            {isLoading ? <Spinner /> : <AdultGoalsTable rows={filteredGoals} />}
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            {resultsLoading ? <Spinner /> : <AdultResultsTable rows={filteredResults} />}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
