import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { TeamFormRow } from "@/hooks/useCMSAMatchResults";

interface Props { rows: TeamFormRow[] }

function pillClass(r: "W" | "L" | "T") {
  if (r === "W") return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
  if (r === "L") return "bg-red-500/20 text-red-500 border-red-500/30";
  return "bg-muted text-muted-foreground border-border";
}

export function TeamFormTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        No completed matches yet. Once games are played, hot streaks show up here automatically.
      </div>
    );
  }

  // Group by tier
  const byTier: Record<string, TeamFormRow[]> = {};
  for (const r of rows) (byTier[r.tier || "Unknown"] ||= []).push(r);

  return (
    <div className="space-y-6">
      {Object.entries(byTier).map(([tier, tierRows]) => (
        <div key={tier} className="rounded-lg border border-border overflow-hidden">
          <div className="bg-primary/10 px-4 py-2 border-b border-border">
            <h3 className="text-sm font-display font-bold text-foreground">{tier}</h3>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
            <span>Team</span>
            <span className="text-center w-[140px]">Last 5</span>
            <span className="text-center w-[40px]">Pts</span>
            <span className="text-center w-[60px]">GD</span>
          </div>
          <div className="divide-y divide-border">
            {tierRows.map((r, i) => (
              <motion.div
                key={r.team_id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 text-xs items-center hover:bg-accent/40"
              >
                <span className="font-medium text-foreground truncate flex items-center gap-2">
                  {r.team_name}
                  {r.streak >= 3 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-orange-500 bg-orange-500/10 border border-orange-500/30 rounded px-1.5 py-0.5">
                      <Flame className="h-2.5 w-2.5" /> {r.streak}W
                    </span>
                  )}
                </span>
                <div className="flex gap-1 w-[140px] justify-center">
                  {r.results.map((res, idx) => (
                    <span key={idx} className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold border rounded ${pillClass(res)}`}>
                      {res}
                    </span>
                  ))}
                  {Array.from({ length: 5 - r.results.length }).map((_, idx) => (
                    <span key={`e${idx}`} className="inline-flex items-center justify-center w-5 h-5 text-[10px] border border-dashed border-border rounded text-muted-foreground/30">·</span>
                  ))}
                </div>
                <span className="text-center w-[40px] font-bold text-primary">{r.points}</span>
                <span className={`text-center w-[60px] text-xs font-medium ${r.goals_for - r.goals_against > 0 ? "text-emerald-500" : r.goals_for - r.goals_against < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                  {r.goals_for - r.goals_against > 0 ? "+" : ""}{r.goals_for - r.goals_against}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
