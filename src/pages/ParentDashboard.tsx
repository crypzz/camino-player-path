import { mockPlayers, mockTrainingSessions } from '@/data/mockPlayers';
import { StatCard } from '@/components/StatCard';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { Award, CalendarCheck, TrendingUp, Target, Clock, MapPin, Dumbbell, Swords, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
  const player = mockPlayers[0];
  const upcomingSessions = mockTrainingSessions.filter(s => new Date(s.date) >= new Date('2026-03-13')).slice(0, 5);

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
        <StatCard title="CPI Growth" value={`+${player.cpiHistory[player.cpiHistory.length - 1].score - player.cpiHistory[0].score}`} icon={TrendingUp} index={3} />
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
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />Upcoming Schedule
            </h3>
            <div className="space-y-2">
              {upcomingSessions.map((session) => {
                const Icon = typeIcons[session.type];
                return (
                  <div key={session.id} className="p-3 rounded-lg bg-accent/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-sm font-medium text-foreground truncate">{session.title}</h5>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{session.time}</span>
                          <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{session.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
