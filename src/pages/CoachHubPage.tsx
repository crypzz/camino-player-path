import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Video, ClipboardList, Dumbbell, Users, Plus, Calendar, Target, PencilLine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { usePlayers } from '@/hooks/usePlayers';
import { useTrainingSessions, TrainingSession } from '@/hooks/useTrainingSessions';
import { useDrills, Drill } from '@/hooks/useDrills';
import SessionDialog from '@/components/coach/SessionDialog';
import DrillDialog from '@/components/coach/DrillDialog';

type Tab = 'sessions' | 'drills' | 'team';

const DIFF_COLORS: Record<string, string> = {
  Beginner: 'bg-success/20 text-success border-success/30',
  Intermediate: 'bg-primary/20 text-primary border-primary/30',
  Advanced: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function CoachHubPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('sessions');
  const [sessionDialog, setSessionDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [drillDialog, setDrillDialog] = useState(false);
  const [activeDrill, setActiveDrill] = useState<Drill | null>(null);

  const { data: players = [] } = usePlayers();
  const { data: sessions = [], isLoading: sessionsLoading } = useTrainingSessions();
  const { data: drills = [], isLoading: drillsLoading } = useDrills();

  const openNewSession = () => { setActiveSession(null); setSessionDialog(true); };
  const openSession = (s: TrainingSession) => { setActiveSession(s); setSessionDialog(true); };
  const openNewDrill = () => { setActiveDrill(null); setDrillDialog(true); };
  const openDrill = (d: Drill) => { setActiveDrill(d); setDrillDialog(true); };

  // keep activeSession in sync with latest fetched data while dialog is open
  const liveActiveSession = activeSession ? sessions.find(s => s.id === activeSession.id) ?? activeSession : null;

  const navItems = [
    { key: 'video', label: 'Video Analysis', icon: Video, action: () => navigate('/dashboard/videos') },
    { key: 'sessions', label: 'Training Sessions', icon: ClipboardList, action: () => setTab('sessions') },
    { key: 'drills', label: 'Drills Library', icon: Dumbbell, action: () => setTab('drills') },
    { key: 'team', label: 'Team', icon: Users, action: () => setTab('team') },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Left nav */}
      <aside className="lg:w-56 shrink-0">
        <div className="glass-card rounded-xl p-2 flex lg:flex-col gap-1 overflow-x-auto">
          {navItems.map(item => {
            const active = item.key === tab;
            return (
              <button
                key={item.key}
                onClick={item.action}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0',
                  active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 space-y-5">
        {tab === 'sessions' && (
          <SessionsTab
            sessions={sessions} loading={sessionsLoading} drills={drills}
            onNew={openNewSession} onOpen={openSession}
          />
        )}
        {tab === 'drills' && (
          <DrillsTab drills={drills} loading={drillsLoading} onNew={openNewDrill} onOpen={openDrill} />
        )}
        {tab === 'team' && <TeamTab players={players} />}
      </div>

      <SessionDialog open={sessionDialog} onOpenChange={setSessionDialog} session={liveActiveSession} players={players} />
      <DrillDialog open={drillDialog} onOpenChange={setDrillDialog} drill={activeDrill} />
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-display font-bold text-foreground tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-[13px] mt-0.5">{subtitle}</p>
      </div>
      {action}
    </motion.div>
  );
}

function SessionsTab({ sessions, loading, drills, onNew, onOpen }: {
  sessions: TrainingSession[]; loading: boolean; drills: Drill[];
  onNew: () => void; onOpen: (s: TrainingSession) => void;
}) {
  return (
    <>
      <SectionHeader
        title="Training Sessions" subtitle="Plan sessions, assign players and drills"
        action={<Button onClick={onNew} size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Session</Button>}
      />
      {loading ? (
        <Loading />
      ) : sessions.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No sessions yet" desc="Create your first training session to start planning." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {sessions.map((s, i) => {
            const date = s.session_date ? new Date(s.session_date) : null;
            const upcoming = date ? date.getTime() > Date.now() : true;
            const drillCount = s.session_drills?.length ?? 0;
            const doneCount = s.session_drills?.filter(d => d.completed).length ?? 0;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => onOpen(s)}
                className="glass-card rounded-xl p-4 text-left hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">{s.name}</h3>
                  <Badge variant="outline" className={upcoming ? 'bg-info/20 text-info border-info/30' : 'bg-success/20 text-success border-success/30'}>
                    {upcoming ? 'Upcoming' : 'Completed'}
                  </Badge>
                </div>
                {s.focus_area && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary mb-2">
                    <Target className="h-3 w-3" /> {s.focus_area}
                  </span>
                )}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-1">
                  {date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{date.toLocaleDateString()}</span>}
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{s.session_players?.length ?? 0} players</span>
                  <span className="flex items-center gap-1"><Dumbbell className="h-3 w-3" />{doneCount}/{drillCount} drills</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </>
  );
}

function DrillsTab({ drills, loading, onNew, onOpen }: {
  drills: Drill[]; loading: boolean; onNew: () => void; onOpen: (d: Drill) => void;
}) {
  return (
    <>
      <SectionHeader
        title="Drills Library" subtitle="Build a reusable library of training drills"
        action={<Button onClick={onNew} size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Drill</Button>}
      />
      {loading ? (
        <Loading />
      ) : drills.length === 0 ? (
        <EmptyState icon={Dumbbell} title="No drills yet" desc="Add drills to assign them to training sessions." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {drills.map((d, i) => {
            const assignedCount = d.session_drills?.[0]?.count ?? 0;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-4 flex flex-col"
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-display font-semibold text-foreground text-sm truncate">{d.name}</h3>
                  {d.difficulty_level && <Badge variant="outline" className={cn('shrink-0', DIFF_COLORS[d.difficulty_level])}>{d.difficulty_level}</Badge>}
                </div>
                {d.description && <p className="text-[12px] text-muted-foreground line-clamp-2 flex-1">{d.description}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                  <span className="text-[11px] text-muted-foreground">Assigned to {assignedCount} session{assignedCount === 1 ? '' : 's'}</span>
                  <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => onOpen(d)}>
                    <PencilLine className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}

function TeamTab({ players }: { players: { id: string; name: string; position: string; team: string }[] }) {
  return (
    <>
      <SectionHeader title="Team" subtitle="Players available for sessions" action={null} />
      {players.length === 0 ? (
        <EmptyState icon={Users} title="No players yet" desc="Add players from the main dashboard to assign them to sessions." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {players.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-display font-semibold text-sm shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-foreground text-sm truncate">{p.name}</h3>
                <p className="text-[11px] text-muted-foreground truncate">{p.position}{p.team ? ` · ${p.team}` : ''}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

function Loading() {
  return <div className="flex items-center justify-center py-16"><div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full" /></div>;
}

function EmptyState({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-foreground text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs">{desc}</p>
    </div>
  );
}
