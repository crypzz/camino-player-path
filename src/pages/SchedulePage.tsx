import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, MapPin, Clock, Dumbbell, Swords, HeartPulse, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useScheduleSessions, useCreateScheduleSession, useDeleteScheduleSession } from '@/hooks/useScheduleSessions';
import { toast } from 'sonner';

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

export default function SchedulePage() {
  const { data: sessions = [], isLoading } = useScheduleSessions();
  const createSession = useCreateScheduleSession();
  const deleteSession = useDeleteScheduleSession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('training');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');

  const handleCreate = async () => {
    if (!title || !date) { toast.error('Title and date are required'); return; }
    try {
      await createSession.mutateAsync({ title, type, session_date: date, session_time: time, location });
      toast.success('Session created');
      setOpen(false);
      setTitle(''); setDate(''); setLocation('');
    } catch (e: any) {
      toast.error(e.message || 'Failed to create session');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSession.mutateAsync(id);
      toast.success('Session deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete session');
    }
  };

  // Group sessions by week
  const grouped: Record<string, typeof sessions> = {};
  sessions.forEach(s => {
    const date = new Date(s.session_date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const key = weekStart.toISOString().split('T')[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Training Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">Upcoming sessions and matches</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Session</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Technical Session" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="match">Match</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Time</Label><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
                <div><Label>Location</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Main Pitch" /></div>
              </div>
              <Button onClick={handleCreate} disabled={createSession.isPending} className="w-full">
                {createSession.isPending ? 'Creating...' : 'Create Session'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(['training', 'match', 'fitness'] as const).map(t => {
          const count = sessions.filter(s => s.type === t).length;
          const Icon = typeIcons[t];
          return (
            <motion.div key={t} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-lg font-display font-bold text-foreground">{count}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider capitalize">{t === 'fitness' ? 'Fitness' : t === 'match' ? 'Matches' : 'Training'}</div>
            </motion.div>
          );
        })}
      </div>

      {sessions.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarCheck className="h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="font-display font-semibold text-foreground mb-1">No sessions scheduled</h3>
          <p className="text-sm text-muted-foreground">Add your first training session to get started</p>
        </motion.div>
      ) : (
        Object.entries(grouped).map(([weekKey, weekSessions], wi) => {
          const weekDate = new Date(weekKey);
          const weekEnd = new Date(weekDate);
          weekEnd.setDate(weekDate.getDate() + 6);
          const weekLabel = `${weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

          return (
            <motion.div key={weekKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.08 }}>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground/60 font-medium mb-3">{weekLabel}</h3>
              <div className="space-y-2">
                {weekSessions.map((session, i) => {
                  const Icon = typeIcons[session.type] || Dumbbell;
                  const sessionDate = new Date(session.session_date);

                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: wi * 0.08 + i * 0.03 }}
                      className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-colors group"
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
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.session_time}</span>
                          {session.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{session.location}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${typeColors[session.type]}`}>
                        {session.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(session.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
