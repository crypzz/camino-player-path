import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { VideoStatRow } from "@/lib/videoApi";

interface Props {
  stats: VideoStatRow[];
  playerName: (pid: string | null) => string | null;
}

const METRICS: {
  key: "touches" | "distance_m" | "possession_seconds";
  label: string;
  color: string;
  format: (v: number) => string;
}[] = [
  { key: "touches", label: "Touches", color: "hsl(var(--primary))", format: (v) => `${v}` },
  { key: "distance_m", label: "Distance (m)", color: "hsl(var(--success))", format: (v) => `${Math.round(v)}m` },
  { key: "possession_seconds", label: "Possession (s)", color: "hsl(var(--chart-3, var(--primary)))", format: (v) => `${Math.round(v)}s` },
];

export default function VideoStatsCharts({ stats, playerName }: Props) {
  const labelFor = (s: VideoStatRow) =>
    playerName(s.player_id) ?? (s.track_id != null ? `#${s.track_id}` : "—");

  const data = useMemo(
    () =>
      stats.map((s) => ({
        name: labelFor(s),
        touches: s.touches ?? 0,
        distance_m: s.distance_m ?? 0,
        possession_seconds: s.possession_seconds ?? 0,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stats]
  );

  if (stats.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <BarChart3 className="h-4 w-4 text-primary" /> Coaching Insights
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {METRICS.map((m) => (
          <div key={m.key} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent) / 0.4)" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [m.format(v), m.label]}
                />
                <Bar dataKey={m.key} radius={[4, 4, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={m.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
