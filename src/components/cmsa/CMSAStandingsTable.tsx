import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { CMSAStanding } from "@/hooks/useCMSAStandings";

interface Props { rows: CMSAStanding[] }

function rankIcon(rank: number | null) {
  if (rank === 1) return <Trophy className="h-3.5 w-3.5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-3.5 w-3.5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-3.5 w-3.5 text-amber-700" />;
  return <span className="text-[11px] text-muted-foreground font-mono">{rank ?? "-"}</span>;
}

export function CMSAStandingsTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        No standings yet. Hit "Refresh now" to pull the latest from CMSA.
      </div>
    );
  }

  // Group by tier
  const byTier: Record<string, CMSAStanding[]> = {};
  for (const r of rows) {
    (byTier[r.tier] ||= []).push(r);
  }

  return (
    <div className="space-y-6">
      {Object.entries(byTier).map(([tier, tierRows]) => (
        <div key={tier} className="rounded-lg border border-border overflow-hidden">
          <div className="bg-primary/10 px-4 py-2 border-b border-border">
            <h3 className="text-sm font-display font-bold text-foreground">{tier}</h3>
          </div>
          <div className="grid grid-cols-[40px_1fr_repeat(8,32px)] gap-2 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
            <span>#</span>
            <span>Team</span>
            <span className="text-center">GP</span>
            <span className="text-center">W</span>
            <span className="text-center">T</span>
            <span className="text-center">L</span>
            <span className="text-center font-bold text-primary">PTS</span>
            <span className="text-center">GF</span>
            <span className="text-center">GA</span>
            <span className="text-center">GD</span>
          </div>
          <div className="divide-y divide-border">
            {tierRows.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`grid grid-cols-[40px_1fr_repeat(8,32px)] gap-2 px-4 py-2.5 text-xs items-center hover:bg-accent/40 ${
                  (r.rank ?? 99) <= 3 ? "bg-primary/5" : ""
                }`}
              >
                <span className="flex items-center justify-center">{rankIcon(r.rank)}</span>
                <span className="font-medium text-foreground truncate">{r.cmsa_teams?.name}</span>
                <span className="text-center text-muted-foreground">{r.gp}</span>
                <span className="text-center text-muted-foreground">{r.w}</span>
                <span className="text-center text-muted-foreground">{r.t}</span>
                <span className="text-center text-muted-foreground">{r.l}</span>
                <span className="text-center font-bold text-primary">{r.pts}</span>
                <span className="text-center text-muted-foreground">{r.gf}</span>
                <span className="text-center text-muted-foreground">{r.ga}</span>
                <span className={`text-center font-medium ${r.gd > 0 ? "text-emerald-500" : r.gd < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
