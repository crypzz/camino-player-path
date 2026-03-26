import { usePlayers } from '@/hooks/usePlayers';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Circle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors: Record<string, string> = {
  'completed': 'bg-success/15 text-success border-success/20',
  'in-progress': 'bg-primary/15 text-primary border-primary/20',
  'not-started': 'bg-muted text-muted-foreground border-border',
};

const statusIcons: Record<string, typeof CheckCircle2> = {
  'completed': CheckCircle2,
  'in-progress': Clock,
  'not-started': Circle,
};

const categoryColors: Record<string, string> = {
  'technical': 'bg-info/15 text-info border-info/20',
  'tactical': 'bg-primary/15 text-primary border-primary/20',
  'physical': 'bg-success/15 text-success border-success/20',
  'mental': 'bg-warning/15 text-warning border-warning/20',
};

export default function PlayerGoalsPage() {
  const { data: players = [], isLoading } = usePlayers();
  const player = players[0];

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  if (!player || player.goals.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground">My Goals</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your development targets</p>
        </motion.div>
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          No development goals set yet. Your coach will assign goals for you.
        </div>
      </div>
    );
  }

  const goals = player.goals;
  const completed = goals.filter(g => g.status === 'completed').length;
  const inProgress = goals.filter(g => g.status === 'in-progress').length;
  const notStarted = goals.filter(g => g.status === 'not-started').length;
  const completionRate = Math.round((completed / goals.length) * 100);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">My Goals</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage your development targets</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-foreground">{goals.length}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Goals</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-success">{completed}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Completed</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-primary">{inProgress}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">In Progress</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-display font-bold text-muted-foreground">{notStarted}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Not Started</div>
        </motion.div>
      </div>

      {/* Completion Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground text-sm">Overall Completion</h3>
          <span className="text-sm font-display font-bold text-primary">{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-2" />
      </motion.div>

      {/* Goals by Status */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary/50 h-9">
          <TabsTrigger value="all" className="text-xs">All ({goals.length})</TabsTrigger>
          <TabsTrigger value="in-progress" className="text-xs">Active ({inProgress})</TabsTrigger>
          <TabsTrigger value="not-started" className="text-xs">Pending ({notStarted})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Done ({completed})</TabsTrigger>
        </TabsList>

        {['all', 'in-progress', 'not-started', 'completed'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {goals
              .filter(g => tab === 'all' || g.status === tab)
              .map((goal, i) => {
                const StatusIcon = statusIcons[goal.status];
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-md ${goal.status === 'completed' ? 'bg-success/15' : goal.status === 'in-progress' ? 'bg-primary/15' : 'bg-secondary'}`}>
                        <StatusIcon className={`h-4 w-4 ${goal.status === 'completed' ? 'text-success' : goal.status === 'in-progress' ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${goal.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {goal.title}
                          </h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${categoryColors[goal.category]}`}>
                              {goal.category}
                            </Badge>
                            <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${statusColors[goal.status]}`}>
                              {goal.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground mb-1.5">{goal.description}</p>
                        )}
                        {goal.dueDate && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                            <Calendar className="h-3 w-3" />
                            Due {new Date(goal.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
