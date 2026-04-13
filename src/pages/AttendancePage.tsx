import { usePlayers } from '@/hooks/usePlayers';
import { useAttendanceRecords, useUpsertAttendance } from '@/hooks/useAttendance';
import { motion } from 'framer-motion';
import { CalendarCheck, X, Check, Dumbbell, Swords, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

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

// Generate sessions based on current date (these are the sessions to track against)
function generateSessions() {
  const sessions = [];
  const types: Array<'training' | 'match' | 'fitness'> = ['training', 'match', 'fitness'];
  const titles = {
    training: ['Technical Session', 'Tactical Drills', 'Passing Practice', 'Set Piece Training'],
    match: ['Friendly Match', 'League Match', 'Cup Fixture'],
    fitness: ['Sprint & Agility', 'Strength & Conditioning', 'Endurance Training'],
  };
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const type = types[i % 3];
    const titleList = titles[type];
    sessions.push({
      id: `session-${i}`,
      date: date.toISOString().split('T')[0],
      type,
      title: titleList[i % titleList.length],
      time: ['09:00', '10:30', '14:00'][i % 3],
      location: ['Main Pitch', 'Training Ground A', 'Indoor Arena'][i % 3],
    });
  }
  return sessions;
}

export default function AttendancePage() {
  const { data: players = [], isLoading: playersLoading } = usePlayers();
  const { data: records = [], isLoading: recordsLoading } = useAttendanceRecords();
  const upsertAttendance = useUpsertAttendance();
  const sessions = useMemo(() => generateSessions(), []);

  const isLoading = playersLoading || recordsLoading;

  // Build a lookup map: "date|title|playerId" -> record
  const recordMap = useMemo(() => {
    const map = new Map<string, boolean>();
    records.forEach(r => {
      map.set(`${r.session_date}|${r.session_title}|${r.player_id}`, r.present);
    });
    return map;
  }, [records]);

  const getAttendance = (sessionDate: string, sessionTitle: string, playerId: string) => {
    const key = `${sessionDate}|${sessionTitle}|${playerId}`;
    if (recordMap.has(key)) return recordMap.get(key)!;
    return undefined;
  };

  const toggleAttendance = (session: typeof sessions[0], playerId: string) => {
    const current = getAttendance(session.date, session.title, playerId);
    const newPresent = current === undefined ? true : !current;
    
    upsertAttendance.mutate({
      session_date: session.date,
      session_type: session.type,
      session_title: session.title,
      player_id: playerId,
      present: newPresent,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  if (players.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-muted-foreground text-sm mt-1">No players available yet.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Attendance Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Track player attendance across sessions — data saves automatically</p>
      </motion.div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium sticky left-0 bg-card z-10 min-w-[200px]">
                  Session
                </th>
                {players.map(player => (
                  <th key={player.id} className="p-4 text-center min-w-[80px]">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary text-xs mx-auto mb-1">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate max-w-[70px]">{player.name.split(' ')[0]}</span>
                  </th>
                ))}
                <th className="p-4 text-center text-xs uppercase tracking-wider text-muted-foreground font-medium min-w-[60px]">Rate</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, i) => {
                const Icon = typeIcons[session.type];
                const presentCount = players.filter(p => getAttendance(session.date, session.title, p.id) === true).length;
                const rate = players.length > 0 ? Math.round((presentCount / players.length) * 100) : 0;

                return (
                  <motion.tr
                    key={session.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                  >
                    <td className="p-4 sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{session.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{new Date(session.date).toLocaleDateString()}</span>
                            <Badge variant="outline" className={`text-[9px] py-0 ${typeColors[session.type]}`}>{session.type}</Badge>
                          </div>
                        </div>
                      </div>
                    </td>
                    {players.map(player => {
                      const present = getAttendance(session.date, session.title, player.id);

                      return (
                        <td key={player.id} className="p-4 text-center">
                          <button
                            onClick={() => toggleAttendance(session, player.id)}
                            disabled={upsertAttendance.isPending}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              present === true
                                ? 'bg-success/20 text-success hover:bg-success/30'
                                : present === false
                                  ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                                  : 'bg-secondary text-muted-foreground hover:bg-accent'
                            }`}
                          >
                            {present === true ? <Check className="h-4 w-4" /> : present === false ? <X className="h-4 w-4" /> : <span className="text-xs">–</span>}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <span className={`text-sm font-display font-bold ${rate >= 80 ? 'text-success' : rate >= 60 ? 'text-warning' : 'text-destructive'}`}>
                        {rate}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
