import { motion } from "framer-motion";

interface GoalRow {
  team: string;
  gf: number;
  ga: number;
  gd: number;
  gp: number;
  perGame: number;
}

export function AdultGoalsTable({ rows }: { rows: GoalRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No goal data imported yet for this division.
      </div>
    );
  }
  const max = Math.max(...rows.map((r) => r.gf), 1);

  return (
    <div className="space-y-1.5">
      {rows.map((r, i) => (
        <motion.div
          key={r.team}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(i * 0.03, 0.4) }}
          className="rounded-lg border border-border bg-card px-3 py-2.5"
        >
          <div className="flex items-center gap-3 text-[13px]">
            <span className={`w-5 font-semibold ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}</span>
            <span className="flex-1 truncate font-medium text-foreground">{r.team}</span>
            <span className="text-xs text-muted-foreground">{r.gp} GP</span>
            <span className="w-16 text-right text-xs text-muted-foreground">
              {r.perGame.toFixed(1)}/g
            </span>
            <span className="w-10 text-right font-bold text-primary tabular-nums">{r.gf}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(r.gf / max) * 100}%` }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.03, 0.4) }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
