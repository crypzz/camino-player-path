import { motion } from "framer-motion";
import type { AdultStanding } from "@/hooks/useAdultLeagues";

export function AdultStandingsTable({ rows }: { rows: AdultStanding[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No standings imported yet for this division. Hit Refresh to pull the latest.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="px-3 py-2.5 text-left font-medium w-10">#</th>
            <th className="px-3 py-2.5 text-left font-medium">Team</th>
            <th className="px-2 py-2.5 text-center font-medium">GP</th>
            <th className="px-2 py-2.5 text-center font-medium">W</th>
            <th className="px-2 py-2.5 text-center font-medium">L</th>
            <th className="px-2 py-2.5 text-center font-medium">T</th>
            <th className="px-2 py-2.5 text-center font-medium">GF</th>
            <th className="px-2 py-2.5 text-center font-medium">GA</th>
            <th className="px-2 py-2.5 text-center font-medium">GD</th>
            <th className="px-3 py-2.5 text-center font-semibold text-primary">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="border-b border-border/50 last:border-0 hover:bg-muted/40"
            >
              <td className={`px-3 py-2.5 font-semibold ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                {r.rank ?? i + 1}
              </td>
              <td className="px-3 py-2.5 font-medium text-foreground">{r.adult_teams?.name}</td>
              <td className="px-2 py-2.5 text-center text-muted-foreground">{r.gp}</td>
              <td className="px-2 py-2.5 text-center text-muted-foreground">{r.w}</td>
              <td className="px-2 py-2.5 text-center text-muted-foreground">{r.l}</td>
              <td className="px-2 py-2.5 text-center text-muted-foreground">{r.t}</td>
              <td className="px-2 py-2.5 text-center text-foreground">{r.gf}</td>
              <td className="px-2 py-2.5 text-center text-muted-foreground">{r.ga}</td>
              <td className={`px-2 py-2.5 text-center font-medium ${r.gd > 0 ? "text-emerald-500" : r.gd < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {r.gd > 0 ? `+${r.gd}` : r.gd}
              </td>
              <td className="px-3 py-2.5 text-center font-bold text-primary">{r.pts}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
