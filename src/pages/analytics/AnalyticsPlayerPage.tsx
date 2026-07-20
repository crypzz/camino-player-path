import { useParams } from "react-router-dom";
import { usePlayerMatchHistoryAnalytics, usePlayerSeasonStats, useHighlightClips } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function AnalyticsPlayerPage() {
  const { playerId } = useParams();
  const { data: history } = usePlayerMatchHistoryAnalytics(playerId ?? null);
  const { data: season } = usePlayerSeasonStats(playerId ?? null);
  const { data: clips } = useHighlightClips(playerId ?? null);

  const trend = history?.slice().reverse().map((h: any) => ({
    date: h.analytics_matches?.match_date ?? h.created_at.slice(0, 10),
    rating: h.rating, goals: h.goals, passes: h.passes_completed,
  })) ?? [];

  const total = season?.[0];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Player Analytics</h1>

      {total && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Season {total.season}</h3>
          <div className="grid grid-cols-6 gap-3 text-center">
            <Stat label="Matches" value={total.matches_played} />
            <Stat label="Goals" value={total.goals} />
            <Stat label="Assists" value={total.assists} />
            <Stat label="Passes" value={total.passes_completed} />
            <Stat label="Tackles" value={total.tackles} />
            <Stat label="Avg Rating" value={total.avg_rating?.toFixed(2)} />
          </div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Performance trend</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={trend}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Line dataKey="rating" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line dataKey="goals" stroke="hsl(45 100% 60%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Match history</h3>
        <div className="space-y-2">
          {history?.map((h: any) => (
            <div key={h.id} className="flex items-center justify-between border-b py-2 last:border-0">
              <div>
                <div className="font-medium">{h.analytics_matches?.title}</div>
                <div className="text-xs text-muted-foreground">{h.analytics_matches?.match_date}</div>
              </div>
              <div className="flex gap-3 text-sm">
                <span>G {h.goals}</span><span>A {h.assists}</span>
                <Badge variant="outline">Rating {h.rating?.toFixed(1)}</Badge>
              </div>
            </div>
          ))}
          {!history?.length && <p className="text-sm text-muted-foreground">No matches yet.</p>}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Highlight clips</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {clips?.map((c: any) => (
            <div key={c.id} className="rounded-md border p-3">
              <Badge variant="outline">{c.event_type}</Badge>
              <div className="text-xs text-muted-foreground mt-1">{c.t_start.toFixed(1)}s → {c.t_end.toFixed(1)}s</div>
            </div>
          ))}
          {!clips?.length && <p className="text-sm text-muted-foreground">No clips yet.</p>}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value ?? 0}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
