import { mockPlayers } from '@/data/mockPlayers';
import { StatCard } from '@/components/StatCard';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { Award, CalendarCheck, TrendingUp, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  'completed': 'bg-success/20 text-success border-success/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

export default function ParentDashboard() {
  const player = mockPlayers[0]; // Simulating parent viewing their child

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">
          {player.name}'s Development
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track your child's progress at the academy</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Rating" value={player.overallRating} icon={Award} index={0} />
        <StatCard title="Attendance" value={`${player.attendance}%`} icon={CalendarCheck} index={1} />
        <StatCard title="Active Goals" value={player.goals.filter(g => g.status === 'in-progress').length} icon={Target} index={2} />
        <StatCard title="Completed" value={player.goals.filter(g => g.status === 'completed').length} icon={TrendingUp} index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-2">Skills Overview</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
              <div key={cat}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground text-center capitalize mb-1">{cat}</p>
                <PlayerRadarChart player={player} category={cat} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Development Goals
          </h3>
          <div className="space-y-3">
            {player.goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <div>
                  <span className="text-sm text-foreground">{goal.title}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className={statusColors[goal.status]}>
                  {goal.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg stat-gradient">
            <h4 className="font-display font-semibold text-foreground text-sm mb-2">Latest Coach Note</h4>
            <p className="text-sm text-muted-foreground">
              "{player.name} has shown excellent improvement in ball control and decision making this month. Continue working on weak foot development."
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">— Coach Rivera, March 2026</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
