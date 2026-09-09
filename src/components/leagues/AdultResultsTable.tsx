import { motion } from "framer-motion";
import type { AdultMatchResult } from "@/hooks/useAdultLeagues";

function fmtDate(d: string | null) {
  if (!d) return "TBD";
  return new Date(`${d}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function AdultResultsTable({ rows }: { rows: AdultMatchResult[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No games imported yet for this division.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {rows.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i * 0.015, 0.3) }}
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-[13px]"
        >
          <span className="w-14 shrink-0 text-xs text-muted-foreground">{fmtDate(r.match_date)}</span>
          <span className="flex-1 truncate text-right font-medium text-foreground">{r.home_team_name}</span>
          {r.played ? (
            <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary tabular-nums">
              {r.home_score} – {r.away_score}
            </span>
          ) : (
            <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">vs</span>
          )}
          <span className="flex-1 truncate font-medium text-foreground">{r.away_team_name}</span>
          <span className="hidden w-40 shrink-0 truncate text-xs text-muted-foreground sm:block">
            {r.venue ?? ""}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
