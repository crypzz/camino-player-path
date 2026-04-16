import { usePlayers } from '@/hooks/usePlayers';
import { useSeedPlayers } from '@/hooks/useSeedPlayers';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { StatCard } from '@/components/StatCard';
import { TrendingUp, Target, CalendarCheck, Award, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'completed': 'bg-success/20 text-success border-success/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

export default function PlayerDashboard() {
  const { data: players = [], isLoading } = usePlayers();
  const seedMutation = useSeedPlayers();
  const player = players[0];

  const handleSeed = async () => {
    try {
      const result = await seedMutation.mutateAsync();
      if (result.seeded) toast.success(`Seeded ${result.count} players!`);
      else toast.info('Data already seeded');
    } catch (e: any) {
      toast.error(e.message || 'Failed to seed data');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground text-sm">No player data available yet.</p>
        <Button onClick={handleSeed} disabled={seedMutation.isPending} variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          {seedMutation.isPending ? 'Seeding...' : 'Load Sample Data'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary text-lg">
          {player.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">{player.name}</h1>
          <p className="text-muted-foreground text-[13px] mt-0.5">{player.position} · {player.team} · Age {player.age} · {player.nationality}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="CPI Score" value={player.cpiHistory[player.cpiHistory.length - 1]?.score ?? '—'} icon={Award} index={0} />
            <StatCard title="Attendance" value={`${player.attendance}%`} icon={CalendarCheck} index={1} />
            <StatCard title="Active Goals" value={player.goals.filter(g => g.status === 'in-progress').length} icon={Target} index={2} />
            <StatCard title="Video Clips" value={player.videos.length} icon={Video} index={3} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-2">CPI Progress</h3>
            <CPIProgressChart player={player} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
              <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
                <h3 className="font-display font-semibold text-foreground capitalize mb-2">{cat} Skills</h3>
                <PlayerRadarChart player={player} category={cat} />
              </motion.div>
            ))}
          </div>

          {player.videos.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />Video Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {player.videos.map(video => (
                  <div key={video.id} className="p-3 rounded-lg bg-accent/50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-sm font-medium text-foreground truncate">{video.title}</h5>
                      <p className="text-xs text-muted-foreground">{video.duration} · {new Date(video.date).toLocaleDateString()}</p>
                      {video.coachComment && <p className="text-xs text-muted-foreground/80 mt-1 italic">"{video.coachComment}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 flex justify-center">
            <CPIScoreDisplay player={player} size="lg" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />Development Goals
            </h3>
            <div className="space-y-2">
              {player.goals.map((goal) => (
                <div key={goal.id} className="p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{goal.title}</span>
                    <Badge variant="outline" className={statusColors[goal.status]}>{goal.status.replace('-', ' ')}</Badge>
                  </div>
                  {goal.description && <p className="text-xs text-muted-foreground">{goal.description}</p>}
                </div>
              ))}
              {player.goals.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No goals set yet</p>}
            </div>
          </motion.div>

          {player.reports.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Latest Coach Feedback</h3>
              <p className="text-sm text-muted-foreground italic">"{player.reports[0].coachFeedback}"</p>
              <p className="text-xs text-muted-foreground/60 mt-2">— {player.reports[0].coach}, {player.reports[0].quarter}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
