import { useState } from 'react';
import { mockPlayers, mockTrainingSessions, mockAttendance } from '@/data/mockPlayers';
import { motion } from 'framer-motion';
import { CalendarCheck, X, Check, Dumbbell, Swords, HeartPulse } from 'lucide-react';
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

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(mockAttendance);

  const toggleAttendance = (sessionId: string, playerId: string) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.sessionId === sessionId && a.playerId === playerId);
      if (existing) {
        return prev.map(a => a.sessionId === sessionId && a.playerId === playerId ? { ...a, present: !a.present } : a);
      }
      return [...prev, { sessionId, playerId, present: true }];
    });
  };

  const getAttendance = (sessionId: string, playerId: string) => {
    return attendance.find(a => a.sessionId === sessionId && a.playerId === playerId);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Attendance Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Track player attendance across sessions</p>
      </motion.div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium sticky left-0 bg-card z-10 min-w-[200px]">
                  Session
                </th>
                {mockPlayers.map(player => (
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
              {mockTrainingSessions.map((session, i) => {
                const Icon = typeIcons[session.type];
                const presentCount = mockPlayers.filter(p => getAttendance(session.id, p.id)?.present).length;
                const rate = mockPlayers.length > 0 ? Math.round((presentCount / mockPlayers.length) * 100) : 0;

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
                    {mockPlayers.map(player => {
                      const record = getAttendance(session.id, player.id);
                      const isPresent = record?.present;

                      return (
                        <td key={player.id} className="p-4 text-center">
                          <button
                            onClick={() => toggleAttendance(session.id, player.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              isPresent
                                ? 'bg-success/20 text-success hover:bg-success/30'
                                : record
                                  ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                                  : 'bg-secondary text-muted-foreground hover:bg-accent'
                            }`}
                          >
                            {isPresent ? <Check className="h-4 w-4" /> : record ? <X className="h-4 w-4" /> : <span className="text-xs">–</span>}
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
