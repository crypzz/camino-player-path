import { Player, calculateCPI, getCategoryAverage } from '@/types/player';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { X, Target, TrendingUp, Calendar, Video, Flag, Ruler, Weight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  player: Player | null;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  'completed': 'bg-success/15 text-success border-success/20',
  'in-progress': 'bg-primary/15 text-primary border-primary/20',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

export function PlayerDetailPanel({ player, onClose }: Props) {
  if (!player) return null;

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
              {player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground tracking-tight">{player.name}</h2>
              <p className="text-[11px] text-muted-foreground">{player.position} · {player.team}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground/70">
                <span>{player.nationality}</span>
                <span>·</span>
                <span>{player.height}cm</span>
                <span>·</span>
                <span>{player.weight}kg</span>
                <span>·</span>
                <span>{player.preferredFoot}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-center py-2">
          <CPIScoreDisplay player={player} size="sm" />
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="w-full bg-secondary/50 h-8">
            <TabsTrigger value="skills" className="flex-1 text-[11px] h-7">Skills</TabsTrigger>
            <TabsTrigger value="progress" className="flex-1 text-[11px] h-7">Progress</TabsTrigger>
            <TabsTrigger value="goals" className="flex-1 text-[11px] h-7">Goals</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 text-[11px] h-7">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-2 mt-3">
            <div className="grid grid-cols-2 gap-2">
              {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => (
                <div key={cat} className="bg-secondary/40 rounded-md p-2">
                  <h4 className="text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-0 text-center font-medium capitalize">{cat}</h4>
                  <PlayerRadarChart player={player} category={cat} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-3">
            <div className="bg-secondary/40 rounded-md p-3">
              <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 font-medium">CPI Trend</h4>
              <CPIProgressChart player={player} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-secondary/40 rounded-md p-3 text-center">
                <div className="text-base font-display font-bold text-foreground">{player.attendance}%</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Attendance</div>
              </div>
              <div className="bg-secondary/40 rounded-md p-3 text-center">
                <div className="text-base font-display font-bold text-success">
                  +{player.cpiHistory.length >= 2
                    ? player.cpiHistory[player.cpiHistory.length - 1].score - player.cpiHistory[0].score
                    : 0}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">CPI Growth</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-3 space-y-1.5">
            {player.goals.map((goal) => (
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
            {player.videos.map((video) => (
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
