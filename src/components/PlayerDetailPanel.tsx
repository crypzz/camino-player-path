import { Player } from '@/types/player';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { X, Target, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Props {
  player: Player | null;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  'completed': 'bg-success/20 text-success border-success/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

export function PlayerDetailPanel({ player, onClose }: Props) {
  if (!player) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        className="glass-card rounded-xl p-6 space-y-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary text-lg">
              {player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">{player.name}</h2>
              <p className="text-sm text-muted-foreground">{player.position} · {player.team} · Age {player.age}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="stat-gradient rounded-lg p-3 text-center">
            <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
            <div className="text-xl font-display font-bold text-foreground">{player.overallRating}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Overall</div>
          </div>
          <div className="stat-gradient rounded-lg p-3 text-center">
            <Calendar className="h-4 w-4 text-info mx-auto mb-1" />
            <div className="text-xl font-display font-bold text-foreground">{player.attendance}%</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendance</div>
          </div>
          <div className="stat-gradient rounded-lg p-3 text-center">
            <Target className="h-4 w-4 text-success mx-auto mb-1" />
            <div className="text-xl font-display font-bold text-foreground">{player.goals.filter(g => g.status === 'completed').length}/{player.goals.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Goals Done</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
            <div key={cat} className="stat-gradient rounded-lg p-3">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1 text-center capitalize">{cat}</h4>
              <PlayerRadarChart player={player} category={cat} />
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Development Goals
          </h4>
          <div className="space-y-2">
            {player.goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <span className="text-sm text-foreground">{goal.title}</span>
                <Badge variant="outline" className={statusColors[goal.status]}>
                  {goal.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
