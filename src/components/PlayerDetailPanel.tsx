import { useState } from 'react';
import { Player, calculateCPI, getCategoryAverage, TechnicalMetrics, TacticalMetrics, PhysicalMetrics, MentalMetrics } from '@/types/player';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { useUpdatePlayer } from '@/hooks/usePlayers';
import { X, Pencil, Save, XCircle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Props {
  player: Player | null;
  onClose: () => void;
}

const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF'];
const teams = ['U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'First Team'];

const statusColors: Record<string, string> = {
  'completed': 'bg-success/15 text-success border-success/20',
  'in-progress': 'bg-primary/15 text-primary border-primary/20',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

type MetricCategory = 'technical' | 'tactical' | 'physical' | 'mental';

export function PlayerDetailPanel({ player, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Player>>({});
  const updatePlayer = useUpdatePlayer();

  if (!player) return null;

  const startEdit = () => {
    setEditData({
      name: player.name,
      age: player.age,
      position: player.position,
      team: player.team,
      nationality: player.nationality,
      preferredFoot: player.preferredFoot,
      height: player.height,
      weight: player.weight,
      technical: { ...player.technical },
      tactical: { ...player.tactical },
      physical: { ...player.physical },
      mental: { ...player.mental },
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      await updatePlayer.mutateAsync({ id: player.id, ...editData });
      toast.success('Player updated!');
      setEditing(false);
      setEditData({});
    } catch (e: any) {
      toast.error(e.message || 'Failed to update player');
    }
  };

  const updateMetric = (category: MetricCategory, key: string, value: number) => {
    setEditData(prev => ({
      ...prev,
      [category]: { ...(prev[category] as Record<string, number>), [key]: value },
    }));
  };

  const displayPlayer = editing
    ? { ...player, ...editData } as Player
    : player;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="glass-card p-5 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center font-display font-bold text-primary text-sm">
              {displayPlayer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              {editing ? (
                <Input
                  value={editData.name || ''}
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-7 text-sm font-bold w-40"
                />
              ) : (
                <h2 className="font-display font-bold text-base text-foreground tracking-tight">{player.name}</h2>
              )}
              {editing ? (
                <div className="flex items-center gap-1 mt-1">
                  <Select value={editData.position} onValueChange={v => setEditData(prev => ({ ...prev, position: v }))}>
                    <SelectTrigger className="h-6 text-[10px] w-16 px-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={editData.team} onValueChange={v => setEditData(prev => ({ ...prev, team: v }))}>
                    <SelectTrigger className="h-6 text-[10px] w-16 px-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{teams.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">{player.position} · {player.team}</p>
              )}
              {editing ? (
                <div className="flex items-center gap-1 mt-1">
                  <Input
                    value={editData.nationality || ''}
                    onChange={e => setEditData(prev => ({ ...prev, nationality: e.target.value }))}
                    placeholder="Nationality"
                    className="h-5 text-[10px] w-16 px-1"
                  />
                  <Input
                    type="number"
                    value={editData.height || 170}
                    onChange={e => setEditData(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="h-5 text-[10px] w-14 px-1"
                  />
                  <Input
                    type="number"
                    value={editData.weight || 65}
                    onChange={e => setEditData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                    className="h-5 text-[10px] w-14 px-1"
                  />
                  <Select value={editData.preferredFoot} onValueChange={v => setEditData(prev => ({ ...prev, preferredFoot: v as 'Left' | 'Right' | 'Both' }))}>
                    <SelectTrigger className="h-5 text-[10px] w-16 px-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Left', 'Right', 'Both'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground/70">
                  <span>{player.nationality}</span>
                  <span>·</span>
                  <span>{player.height}cm</span>
                  <span>·</span>
                  <span>{player.weight}kg</span>
                  <span>·</span>
                  <span>{player.preferredFoot}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {editing ? (
              <>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEdit} disabled={updatePlayer.isPending}>
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-success" onClick={saveEdit} disabled={updatePlayer.isPending}>
                  <Save className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={startEdit}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            <button onClick={onClose} className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-center py-2">
          <CPIScoreDisplay player={displayPlayer} size="sm" />
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="w-full bg-secondary/50 h-8">
            <TabsTrigger value="skills" className="flex-1 text-[11px] h-7">Skills</TabsTrigger>
            <TabsTrigger value="progress" className="flex-1 text-[11px] h-7">Progress</TabsTrigger>
            <TabsTrigger value="goals" className="flex-1 text-[11px] h-7">Goals</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 text-[11px] h-7">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-2 mt-3">
            {editing ? (
              <div className="space-y-4">
                {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => {
                  const metrics = (editData[cat] || player[cat]) as Record<string, number>;
                  return (
                    <div key={cat} className="bg-secondary/40 rounded-md p-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 font-medium capitalize">{cat}</h4>
                      <div className="space-y-2">
                        {Object.entries(metrics).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground w-24 truncate">{key}</span>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              value={[val]}
                              onValueChange={([v]) => updateMetric(cat, key, v)}
                              className="flex-1"
                            />
                            <span className="text-[10px] font-medium text-foreground w-5 text-right">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
                  <div key={cat} className="bg-secondary/40 rounded-md p-2">
                    <h4 className="text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-0 text-center font-medium capitalize">{cat}</h4>
                    <PlayerRadarChart player={displayPlayer} category={cat} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-3">
            <div className="bg-secondary/40 rounded-md p-3">
              <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 font-medium">CPI Trend</h4>
              <CPIProgressChart player={displayPlayer} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-secondary/40 rounded-md p-3 text-center">
                <div className="text-base font-display font-bold text-foreground">{displayPlayer.attendance}%</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Attendance</div>
              </div>
              <div className="bg-secondary/40 rounded-md p-3 text-center">
                <div className="text-base font-display font-bold text-success">
                  +{displayPlayer.cpiHistory.length >= 2
                    ? displayPlayer.cpiHistory[displayPlayer.cpiHistory.length - 1].score - displayPlayer.cpiHistory[0].score
                    : 0}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">CPI Growth</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-3 space-y-1.5">
            {displayPlayer.goals.map((goal) => (
              <div key={goal.id} className="p-2.5 rounded-md bg-secondary/40">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[12px] font-medium text-foreground">{goal.title}</span>
                  <Badge variant="outline" className={`text-[9px] py-0 px-1.5 ${statusColors[goal.status]}`}>{goal.status.replace('-', ' ')}</Badge>
                </div>
                {goal.description && <p className="text-[10px] text-muted-foreground">{goal.description}</p>}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="mt-3 space-y-1.5">
            {displayPlayer.videos.map((video) => (
              <div key={video.id} className="p-2.5 rounded-md bg-secondary/40 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  <Video className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[12px] font-medium text-foreground truncate">{video.title}</h5>
                  <p className="text-[10px] text-muted-foreground">{video.duration} · {new Date(video.date).toLocaleDateString()}</p>
                  {video.coachComment && <p className="text-[10px] text-muted-foreground/70 mt-0.5 italic">"{video.coachComment}"</p>}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </AnimatePresence>
  );
}
