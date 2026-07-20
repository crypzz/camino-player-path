import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useAnalyticsMatch, usePlayerMatchStats, useAnalyticsEvents,
  useHighlightClips, useCoachingInsight, useGenerateInsight,
} from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, ChevronLeft } from "lucide-react";
import { PlayerHeatmap } from "@/components/analytics/PlayerHeatmap";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function AnalyticsMatchPage() {
  const { id } = useParams();
  const { data: match } = useAnalyticsMatch(id ?? null);
  const { data: stats } = usePlayerMatchStats(id ?? null);
  const { data: events } = useAnalyticsEvents(id ?? null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const selected = stats?.find((s: any) => s.analytics_player_id === selectedPlayer) ?? stats?.[0];

  if (!match) return <div className="p-6"><Loader2 className="animate-spin" /></div>;

  const eventCounts = (events ?? []).reduce((acc: Record<string, number>, e: any) => {
    acc[e.event_type] = (acc[e.event_type] ?? 0) + 1; return acc;
  }, {} as Record<string, number>);
  const eventChart = Object.entries(eventCounts).map(([type, count]) => ({ type, count }));

  return (
    <div className="p-6 space-y-6">
      <Link to="/dashboard/analytics" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />Back
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{match.title}</h1>
          <p className="text-muted-foreground">
            {match.home_team || "Home"} vs {match.away_team || "Away"} · {match.match_date || match.created_at.slice(0, 10)}
          </p>
        </div>
        <Badge variant="outline">{match.status}</Badge>
      </div>

      {(match.status === "queued" || match.status === "processing") && (
        <Card className="p-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
          <p>Processing match footage… detection, tracking & event tagging in progress.</p>
        </Card>
      )}
      {match.status === "error" && (
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <p className="text-sm text-destructive">{match.error_message}</p>
        </Card>
      )}

      <Tabs defaultValue="players">
        <TabsList>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="clips">Highlights</TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="space-y-4">
          <div className="grid md:grid-cols-[280px,1fr] gap-4">
            <Card className="p-2 max-h-[600px] overflow-y-auto">
              {stats?.map((s: any) => (
                <button key={s.id}
                  onClick={() => setSelectedPlayer(s.analytics_player_id)}
                  className={`w-full text-left p-3 rounded-md hover:bg-accent ${selected?.id === s.id ? "bg-accent" : ""}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">#{s.analytics_players?.jersey_number} {s.analytics_players?.display_name}</div>
                      <div className="text-xs text-muted-foreground">{s.analytics_players?.position}</div>
                    </div>
                    <div className="text-lg font-bold text-primary">{s.rating?.toFixed(1)}</div>
                  </div>
                </button>
              ))}
              {!stats?.length && <p className="p-4 text-sm text-muted-foreground">No player stats yet.</p>}
            </Card>

            {selected && <PlayerDetailPanel stat={selected} matchId={match.id} />}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Event distribution ({events?.length ?? 0} tagged)</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={eventChart}>
                  <XAxis dataKey="type" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <TeamAggregates stats={stats ?? []} />
        </TabsContent>

        <TabsContent value="clips">
          <HighlightsList matchId={match.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlayerDetailPanel({ stat, matchId }: { stat: any; matchId: string }) {
  const { data: insight } = useCoachingInsight(matchId, stat.analytics_player_id);
  const gen = useGenerateInsight();
  const passAcc = stat.passes ? ((stat.passes_completed / stat.passes) * 100).toFixed(0) : "–";
  const duelAcc = stat.duels ? ((stat.duels_won / stat.duels) * 100).toFixed(0) : "–";

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <Stat label="Touches" value={stat.touches} />
          <Stat label="Passes" value={`${stat.passes_completed}/${stat.passes}`} sub={`${passAcc}%`} />
          <Stat label="Shots" value={stat.shots} sub={`${stat.shots_on_target} OT`} />
          <Stat label="Goals" value={stat.goals} />
          <Stat label="Assists" value={stat.assists} />
          <Stat label="Tackles" value={stat.tackles} />
          <Stat label="Intercepts" value={stat.interceptions} />
          <Stat label="Duels" value={`${stat.duels_won}/${stat.duels}`} sub={`${duelAcc}%`} />
          <Stat label="Dribbles" value={stat.dribbles} />
          <Stat label="Recoveries" value={stat.recoveries} />
          <Stat label="Distance" value={`${(stat.distance_m / 1000).toFixed(1)}km`} />
          <Stat label="Sprints" value={stat.sprint_count} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Heatmap & Touch map</h3>
        <PlayerHeatmap points={stat.heatmap ?? []} touches={stat.touchmap ?? []} />
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Coaching insights</h3>
          <Button size="sm" variant="outline" disabled={gen.isPending}
            onClick={() => gen.mutate({ match_id: matchId, analytics_player_id: stat.analytics_player_id })}>
            {gen.isPending ? "Generating…" : insight ? "Regenerate" : "Generate"}
          </Button>
        </div>
        {insight ? (
          <div className="space-y-3 text-sm">
            <p>{insight.summary}</p>
            <InsightList title="Strengths" items={insight.strengths as string[]} color="text-emerald-500" />
            <InsightList title="Weaknesses" items={insight.weaknesses as string[]} color="text-amber-500" />
            <InsightList title="Training priorities" items={insight.training_priorities as string[]} color="text-primary" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No AI insights yet.</p>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: any; sub?: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value ?? 0}</div>
      <div className="text-xs text-muted-foreground">{label}{sub && ` · ${sub}`}</div>
    </div>
  );
}

function InsightList({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className={`font-semibold ${color}`}>{title}</div>
      <ul className="list-disc ml-5">{items.map((i, k) => <li key={k}>{i}</li>)}</ul>
    </div>
  );
}

function TeamAggregates({ stats }: { stats: any[] }) {
  const totals = stats.reduce((a, s) => ({
    goals: a.goals + (s.goals || 0), shots: a.shots + (s.shots || 0),
    passes: a.passes + (s.passes || 0), completed: a.completed + (s.passes_completed || 0),
    tackles: a.tackles + (s.tackles || 0), duels: a.duels + (s.duels || 0), duels_won: a.duels_won + (s.duels_won || 0),
  }), { goals: 0, shots: 0, passes: 0, completed: 0, tackles: 0, duels: 0, duels_won: 0 });
  const passAcc = totals.passes ? ((totals.completed / totals.passes) * 100).toFixed(0) : "–";
  return (
    <Card className="p-4">
      <div className="grid grid-cols-4 gap-3 text-center">
        <Stat label="Team Goals" value={totals.goals} />
        <Stat label="Shots" value={totals.shots} />
        <Stat label="Pass Acc." value={`${passAcc}%`} />
        <Stat label="Duels Won" value={`${totals.duels_won}/${totals.duels}`} />
      </div>
    </Card>
  );
}

function HighlightsList({ matchId }: { matchId: string }) {
  const { data } = useHighlightClips(null, matchId);
  if (!data?.length) return <Card className="p-6 text-center text-muted-foreground">No highlight clips yet.</Card>;
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {data.map((c: any) => (
        <Card key={c.id} className="p-3">
          <Badge variant="outline">{c.event_type}</Badge>
          <div className="text-xs text-muted-foreground mt-1">
            {c.t_start.toFixed(1)}s → {c.t_end.toFixed(1)}s
          </div>
          <div className="text-xs mt-1 truncate">{c.storage_path}</div>
        </Card>
      ))}
    </div>
  );
}
