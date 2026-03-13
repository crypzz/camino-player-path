import { Player, calculateCPI, getCategoryAverage } from '@/types/player';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { X, Target, TrendingUp, Calendar, Video, FileText, Flag, Ruler, Weight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  player: Player | null;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  'completed': 'bg-success/20 text-success border-success/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

export function PlayerDetailPanel({ player, onClose }: Props) {
  if (!player) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        className="glass-card rounded-xl p-6 space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary text-lg">
              {player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">{player.name}</h2>
              <p className="text-sm text-muted-foreground">{player.position} · {player.team}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Flag className="h-3 w-3" />{player.nationality}</span>
                <span className="flex items-center gap-1"><Ruler className="h-3 w-3" />{player.height}cm</span>
                <span className="flex items-center gap-1"><Weight className="h-3 w-3" />{player.weight}kg</span>
                <span>{player.preferredFoot} foot</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center">
          <CPIScoreDisplay player={player} size="md" />
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="skills" className="flex-1 text-xs">Skills</TabsTrigger>
            <TabsTrigger value="progress" className="flex-1 text-xs">Progress</TabsTrigger>
            <TabsTrigger value="goals" className="flex-1 text-xs">Goals</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 text-xs">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
                <div key={cat} className="stat-gradient rounded-lg p-3">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 text-center capitalize">{cat}</h4>
                  <PlayerRadarChart player={player} category={cat} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-3">
            <div className="stat-gradient rounded-lg p-4">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">CPI Progress</h4>
              <CPIProgressChart player={player} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="stat-gradient rounded-lg p-3 text-center">
                <Calendar className="h-4 w-4 text-info mx-auto mb-1" />
                <div className="text-lg font-display font-bold text-foreground">{player.attendance}%</div>
                <div className="text-[10px] text-muted-foreground">Attendance</div>
              </div>
              <div className="stat-gradient rounded-lg p-3 text-center">
                <TrendingUp className="h-4 w-4 text-success mx-auto mb-1" />
                <div className="text-lg font-display font-bold text-foreground">
                  {player.cpiHistory.length >= 2
                    ? `+${player.cpiHistory[player.cpiHistory.length - 1].score - player.cpiHistory[0].score}`
                    : '—'}
                </div>
                <div className="text-[10px] text-muted-foreground">CPI Growth</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-3 space-y-2">
            {player.goals.map((goal) => (
              <div key={goal.id} className="p-3 rounded-lg bg-accent/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{goal.title}</span>
                  <Badge variant="outline" className={statusColors[goal.status]}>{goal.status.replace('-', ' ')}</Badge>
                </div>
                {goal.description && <p className="text-xs text-muted-foreground">{goal.description}</p>}
                <p className="text-[10px] text-muted-foreground/60 mt-1">Due: {new Date(goal.dueDate).toLocaleDateString()} · {goal.category}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="mt-3 space-y-2">
            {player.videos.map((video) => (
              <div key={video.id} className="p-3 rounded-lg bg-accent/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-foreground truncate">{video.title}</h5>
                    <p className="text-xs text-muted-foreground">{video.duration} · {new Date(video.date).toLocaleDateString()}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {video.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                    {video.coachComment && <p className="text-xs text-muted-foreground/80 mt-1 italic">"{video.coachComment}"</p>}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </AnimatePresence>
  );
}
