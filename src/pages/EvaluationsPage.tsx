import { useState } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { Player, getCategoryAverage } from '@/types/player';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdatePlayer } from '@/hooks/usePlayers';

export default function EvaluationsPage() {
  const { data: players = [], isLoading } = usePlayers();
  const updatePlayer = useUpdatePlayer();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'technical' | 'tactical' | 'physical' | 'mental'>('technical');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [initialized, setInitialized] = useState(false);

  // Initialize once players load
  if (players.length > 0 && !initialized) {
    const firstId = players[0].id;
    setSelectedPlayerId(firstId);
    setRatings({ ...players[0][selectedCategory] as Record<string, number> });
    setInitialized(true);
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  if (players.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground">Player Evaluations</h1>
          <p className="text-muted-foreground text-sm mt-1">No players available yet.</p>
        </motion.div>
      </div>
    );
  }

  const player = players.find(p => p.id === selectedPlayerId) || players[0];

  const handlePlayerChange = (id: string) => {
    setSelectedPlayerId(id);
    const p = players.find(p => p.id === id)!;
    setRatings({ ...p[selectedCategory] as Record<string, number> });
  };

  const handleCategoryChange = (cat: 'technical' | 'tactical' | 'physical' | 'mental') => {
    setSelectedCategory(cat);
    setRatings({ ...player[cat] as Record<string, number> });
  };

  const handleReset = () => {
    setRatings({ ...player[selectedCategory] as Record<string, number> });
    toast.info('Ratings reset');
  };

  const handleSave = async () => {
    try {
      await updatePlayer.mutateAsync({
        id: player.id,
        [selectedCategory]: ratings,
      });
      toast.success(`${selectedCategory} ratings saved for ${player.name}`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save ratings');
    }
  };

  const tempPlayer = { ...player, [selectedCategory]: { ...ratings } };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Player Evaluations</h1>
        <p className="text-muted-foreground text-sm mt-1">Rate players on a 1–10 scale across all categories</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedPlayerId} onValueChange={handlePlayerChange}>
          <SelectTrigger className="w-full sm:w-64 bg-card border-border">
            <SelectValue placeholder="Select player" />
          </SelectTrigger>
          <SelectContent>
            {players.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name} – {p.position}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={(v) => handleCategoryChange(v as any)}>
          <SelectTrigger className="w-full sm:w-48 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="tactical">Tactical</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="mental">Mental</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-foreground capitalize">{selectedCategory} Metrics</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updatePlayer.isPending} className="gap-1.5">
                <Save className="h-3 w-3" /> {updatePlayer.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            {Object.entries(ratings).map(([metric, value]) => (
              <div key={metric}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{metric}</span>
                  <span className="text-sm font-display font-bold text-primary w-8 text-right">{value}</span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={([v]) => setRatings(prev => ({ ...prev, [metric]: v }))}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 text-center">Live Preview</h4>
            <PlayerRadarChart player={tempPlayer as Player} category={selectedCategory} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-5 flex justify-center">
            <CPIScoreDisplay player={tempPlayer as Player} size="sm" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-4">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Category Averages</h4>
            {(['technical', 'tactical', 'physical', 'mental'] as const).map((cat) => {
              const avg = cat === selectedCategory
                ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
                : getCategoryAverage(player[cat]).toFixed(1);
              return (
                <div key={cat} className="flex items-center justify-between py-1.5">
                  <span className={`text-sm capitalize ${cat === selectedCategory ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{cat}</span>
                  <span className="text-sm font-display font-bold text-foreground">{avg}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
