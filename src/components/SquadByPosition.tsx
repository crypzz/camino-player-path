import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Player, calculateCPI } from '@/types/player';
import { Shield, ShieldCheck, Zap, Target } from 'lucide-react';

interface Props {
  players: Player[];
  onSelect: (id: string) => void;
}

type GroupKey = 'GK' | 'DEF' | 'MID' | 'FWD';

const GROUPS: { key: GroupKey; label: string; icon: typeof Shield; positions: string[] }[] = [
  { key: 'GK', label: 'Goalkeepers', icon: ShieldCheck, positions: ['GK'] },
  { key: 'DEF', label: 'Defenders', icon: Shield, positions: ['CB', 'LB', 'RB', 'LWB', 'RWB', 'SW'] },
  { key: 'MID', label: 'Midfielders', icon: Zap, positions: ['CDM', 'CM', 'CAM', 'LM', 'RM', 'DM', 'AM'] },
  { key: 'FWD', label: 'Forwards', icon: Target, positions: ['LW', 'RW', 'ST', 'CF', 'SS'] },
];

function groupOf(position: string): GroupKey {
  const p = position?.toUpperCase() ?? '';
  for (const g of GROUPS) if (g.positions.includes(p)) return g.key;
  return 'MID';
}

export function SquadByPosition({ players, onSelect }: Props) {
  const grouped = useMemo(() => {
    const map: Record<GroupKey, Player[]> = { GK: [], DEF: [], MID: [], FWD: [] };
    for (const p of players) map[groupOf(p.position)].push(p);
    for (const k of Object.keys(map) as GroupKey[]) {
      map[k].sort((a, b) => calculateCPI(b) - calculateCPI(a));
    }
    return map;
  }, [players]);

  return (
    <div className="space-y-6">
      {GROUPS.map((g, gi) => {
        const list = grouped[g.key];
        if (list.length === 0) return null;
        const Icon = g.icon;

        return (
          <motion.section
            key={g.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05, duration: 0.25 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-3 pl-1">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Icon className="h-3 w-3 text-primary" />
              </div>
              <h3 className="font-display text-[11px] uppercase tracking-[0.16em] text-foreground/80 font-semibold">
                {g.label}
              </h3>
              <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                {list.length}
              </span>
              <div className="flex-1 h-px bg-border/50 ml-1" />
            </div>

            {/* Player rows */}
            <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden divide-y divide-border/40">
              {list.map((player, i) => {
                const cpi = calculateCPI(player);
                const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <motion.button
                    key={player.id}
                    type="button"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gi * 0.05 + i * 0.02, duration: 0.2 }}
                    onClick={() => onSelect(player.id)}
                    className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-display font-semibold text-primary text-[12px] shrink-0 ring-1 ring-border/40 group-hover:ring-primary/30 transition-all">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-medium text-[13.5px] text-foreground truncate group-hover:text-primary transition-colors">
                        {player.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {player.position} · {player.team}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-display font-bold text-[14px] text-foreground tabular-nums leading-none">
                        {cpi}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70 mt-1">
                        CPI
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
