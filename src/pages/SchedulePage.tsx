import { usePlayers } from '@/hooks/usePlayers';
import { motion } from 'framer-motion';
import { CalendarCheck, MapPin, Clock, Dumbbell, Swords, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

// Generate upcoming schedule from current date
function generateSchedule() {
  const sessions = [];
  const types: Array<'training' | 'match' | 'fitness'> = ['training', 'match', 'fitness'];
  const titles = {
    training: ['Technical Session', 'Tactical Drills', 'Passing Practice', 'Set Piece Training', 'Positional Play'],
    match: ['Friendly Match vs Rivals', 'League Match', 'Cup Fixture', 'Inter-Academy Match'],
    fitness: ['Sprint & Agility', 'Strength & Conditioning', 'Endurance Training', 'Recovery Session'],
  };
  const locations = ['Main Pitch', 'Training Ground A', 'Indoor Arena', 'Gym', 'Training Ground B'];
  const times = ['09:00', '10:30', '14:00', '15:30', '16:00'];

  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i + 1);
    if (date.getDay() === 0) continue; // skip sundays

    const type = types[i % 3];
    const titleList = titles[type];
    sessions.push({
      id: `s-${i}`,
      date: date.toISOString().split('T')[0],
      type,
      title: titleList[i % titleList.length],
      time: times[i % times.length],
      location: locations[i % locations.length],
    });
  }
  return sessions;
}

export default function SchedulePage() {
  const { data: players = [] } = usePlayers();
  const sessions = generateSchedule();

  // Group sessions by week
  const grouped: Record<string, typeof sessions> = {};
  sessions.forEach(s => {
    const date = new Date(s.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const key = weekStart.toISOString().split('T')[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Training Schedule</h1>
        <p className="text-muted-foreground text-sm mt-1">Upcoming sessions and matches</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(['training', 'match', 'fitness'] as const).map(type => {
          const count = sessions.filter(s => s.type === type).length;
          const Icon = typeIcons[type];
          return (
            <motion.div key={type} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-lg font-display font-bold text-foreground">{count}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider capitalize">{type === 'fitness' ? 'Fitness' : type === 'match' ? 'Matches' : 'Training'}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Schedule Timeline */}
      {Object.entries(grouped).map(([weekKey, weekSessions], wi) => {
        const weekDate = new Date(weekKey);
        const weekEnd = new Date(weekDate);
        weekEnd.setDate(weekDate.getDate() + 6);
        const weekLabel = `${weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

        return (
          <motion.div key={weekKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.08 }}>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground/60 font-medium mb-3">{weekLabel}</h3>
            <div className="space-y-2">
              {weekSessions.map((session, i) => {
                const Icon = typeIcons[session.type];
                const sessionDate = new Date(session.date);
                const dayLabel = sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: wi * 0.08 + i * 0.03 }}
                    className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-colors"
                  >
                    <div className="w-12 text-center shrink-0">
                      <div className="text-xs text-muted-foreground">{sessionDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-lg font-display font-bold text-foreground">{sessionDate.getDate()}</div>
                    </div>
                    <div className="w-px h-10 bg-border shrink-0" />
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{session.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{session.location}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${typeColors[session.type]}`}>
                      {session.type}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
