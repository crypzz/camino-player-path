import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { CMSAPlayerStat } from "@/hooks/useCMSAPlayerStats";

interface Props { rows: CMSAPlayerStat[] }

function obfuscate(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function rankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-3.5 w-3.5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-3.5 w-3.5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-3.5 w-3.5 text-amber-700" />;
  return <span className="text-[11px] text-muted-foreground font-mono">{rank}</span>;
}

export function TopScorersTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        No goals logged yet. Coaches — log your first match to put your players on the board.
      </div>
    );
  }

  // Group by tier
  const byTier: Record<string, CMSAPlayerStat[]> = {};
  for (const r of rows) (byTier[r.tier] ||= []).push(r);

  return (
    <div className="space-y-6">
      {Object.entries(byTier).map(([tier, tierRows]) => (
        <div key={tier} className="rounded-lg border border-border overflow-hidden">
          <div className="bg-primary/10 px-4 py-2 border-b border-border">
            <h3 className="text-sm font-display font-bold text-foreground">{tier}</h3>
          </div>
          <div className="grid grid-cols-[40px_1fr_1fr_repeat(4,40px)] gap-2 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
            <span>#</span>
            <span>Player</span>
            <span>Team</span>
            <span className="text-center">GP</span>
            <span className="text-center font-bold text-primary">G</span>
            <span className="text-center">A</span>
            <span className="text-center">G+A</span>
          </div>
          <div className="divide-y divide-border">
            {tierRows.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`grid grid-cols-[40px_1fr_1fr_repeat(4,40px)] gap-2 px-4 py-2.5 text-xs items-center hover:bg-accent/40 ${
                  i < 3 ? "bg-primary/5" : ""
                }`}
              >
                <span className="flex items-center justify-center">{rankIcon(i + 1)}</span>
                <span className="font-medium text-foreground truncate">{obfuscate(r.player_name)}</span>
                <span className="text-muted-foreground truncate">{r.cmsa_teams?.name}</span>
                <span className="text-center text-muted-foreground">{r.games_played}</span>
                <span className="text-center font-bold text-primary">{r.goals}</span>
                <span className="text-center text-muted-foreground">{r.assists}</span>
                <span className="text-center font-semibold text-foreground">{r.goals + r.assists}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
