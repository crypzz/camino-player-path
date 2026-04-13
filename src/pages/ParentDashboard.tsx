import { usePlayers } from '@/hooks/usePlayers';
import { useSeedPlayers } from '@/hooks/useSeedPlayers';
import { StatCard } from '@/components/StatCard';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { Award, CalendarCheck, TrendingUp, Target, Clock, MapPin, Dumbbell, Swords, HeartPulse, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useScheduleSessions } from '@/hooks/useScheduleSessions';

const statusColors: Record<string, string> = {
  'completed': 'bg-success/20 text-success border-success/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

const typeIcons: Record<string, typeof Dumbbell> = {
  training: Dumbbell,
  match: Swords,
  fitness: HeartPulse,
};

const typeColors: Record<string, string> = {
  training: 'bg-info/20 text-info border-info/30',
  match: 'bg-primary/20 text-primary border-primary/30',
  fitness: 'bg-success/20 text-success border-success/30',
};

export default function ParentDashboard() {
  const { data: players = [], isLoading } = usePlayers();
  const { data: sessions = [] } = useScheduleSessions();
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

  const upcomingSessions = sessions
    .filter(s => new Date(s.session_date) >= new Date())
    .slice(0, 5);

  const cpiGrowth = player.cpiHistory.length >= 2
    ? player.cpiHistory[player.cpiHistory.length - 1].score - player.cpiHistory[0].score
    : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">
          {player.name}'s Development
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track your child's progress at the academy</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CPI Score" value={player.cpiHistory[player.cpiHistory.length - 1]?.score ?? '—'} icon={Award} index={0} />
        <StatCard title="Attendance" value={`${player.attendance}%`} icon={CalendarCheck} index={1} />
        <StatCard title="Active Goals" value={player.goals.filter(g => g.status === 'in-progress').length} icon={Target} index={2} />
        <StatCard title="CPI Growth" value={`${cpiGrowth >= 0 ? '+' : ''}${cpiGrowth}`} icon={TrendingUp} index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-2">CPI Progress Over Time</h3>
            <CPIProgressChart player={player} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">Skills Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
                <div key={cat} className="stat-gradient rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground text-center capitalize mb-1">{cat}</p>
                  <PlayerRadarChart player={player} category={cat} />
                </div>
              ))}
            </div>
          </motion.div>

          {player.reports.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Latest Development Report</h3>
              <p className="text-sm text-muted-foreground mb-4">{player.reports[0].summary}</p>
              <div className="p-4 rounded-lg stat-gradient mb-3">
                <h4 className="font-display font-semibold text-foreground text-sm mb-2">Coach Feedback</h4>
                <p className="text-sm text-muted-foreground italic">"{player.reports[0].coachFeedback}"</p>
                <p className="text-xs text-muted-foreground/60 mt-2">— {player.reports[0].coach}, {player.reports[0].quarter}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recommendations</h4>
                <ul className="space-y-1.5">
                  {player.reports[0].recommendations.map((rec, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 flex justify-center">
            <CPIScoreDisplay player={player} size="md" />
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
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                </div>
              ))}
              {player.goals.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No goals set yet</p>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />Upcoming Schedule
            </h3>
            <div className="space-y-2">
              {upcomingSessions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No upcoming sessions</p>
              ) : (
                upcomingSessions.map((session) => {
                  const Icon = typeIcons[session.type] || Dumbbell;
                  return (
                    <div key={session.id} className="p-3 rounded-lg bg-accent/50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-sm font-medium text-foreground truncate">{session.title}</h5>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                            <span>{new Date(session.session_date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{session.session_time}</span>
                            {session.location && <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{session.location}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
