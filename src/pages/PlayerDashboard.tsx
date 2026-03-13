import { mockPlayers } from '@/data/mockPlayers';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { StatCard } from '@/components/StatCard';
import { TrendingUp, Target, CalendarCheck, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  'completed': 'bg-success/20 text-success border-success/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

export default function PlayerDashboard() {
  const player = mockPlayers[0]; // Simulating logged-in player

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary text-xl">
          {player.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{player.name}</h1>
          <p className="text-muted-foreground text-sm">{player.position} · {player.team} · Age {player.age}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Rating" value={player.overallRating} icon={Award} index={0} />
        <StatCard title="Attendance" value={`${player.attendance}%`} icon={CalendarCheck} index={1} />
        <StatCard title="Goals Active" value={player.goals.filter(g => g.status === 'in-progress').length} icon={Target} index={2} />
        <StatCard title="Goals Done" value={player.goals.filter(g => g.status === 'completed').length} icon={TrendingUp} index={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
          <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground capitalize mb-2">{cat} Skills</h3>
            <PlayerRadarChart player={player} category={cat} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          My Development Goals
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
      </motion.div>
    </div>
  );
}
