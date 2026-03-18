import { useState } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { useSeedPlayers } from '@/hooks/useSeedPlayers';
import { StatCard } from '@/components/StatCard';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerDetailPanel } from '@/components/PlayerDetailPanel';
import { Users, Target, CalendarCheck, Award, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateCPI } from '@/types/player';
import { Button } from '@/components/ui/button';
import { AddPlayerDialog } from '@/components/AddPlayerDialog';
import { toast } from 'sonner';

export default function CoachDashboard() {
  const { data: players = [], isLoading } = usePlayers();
  const seedMutation = useSeedPlayers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPlayer = players.find(p => p.id === selectedId) ?? null;

  const totalGoalsCompleted = players.reduce((acc, p) => acc + p.goals.filter(g => g.status === 'completed').length, 0);
  const avgAttendance = players.length ? Math.round(players.reduce((acc, p) => acc + p.attendance, 0) / players.length) : 0;
  const avgCPI = players.length ? Math.round(players.reduce((acc, p) => acc + calculateCPI(p), 0) / players.length) : 0;

  const handleSeed = async () => {
    try {
      const result = await seedMutation.mutateAsync();
      if (result.seeded) {
        toast.success(`Seeded ${result.count} players successfully!`);
      } else {
        toast.info('Data already seeded');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to seed data');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Welcome back, Coach</h1>
          <p className="text-muted-foreground text-[13px] mt-0.5">Here's how your academy is performing</p>
        </div>
        <div className="flex items-center gap-2">
          <AddPlayerDialog />
          {players.length === 0 && (
            <Button onClick={handleSeed} disabled={seedMutation.isPending} variant="outline" size="sm" className="gap-2">
              <Database className="h-4 w-4" />
              {seedMutation.isPending ? 'Seeding...' : 'Load Sample Data'}
            </Button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total Players" value={players.length} subtitle="Across all teams" icon={Users} index={0} />
        <StatCard title="Avg CPI" value={avgCPI} subtitle="Camino Player Index" icon={Award} index={1} />
        <StatCard title="Goals Completed" value={totalGoalsCompleted} subtitle="Development targets" icon={Target} index={2} />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} subtitle="This month" icon={CalendarCheck} index={3} />
      </div>

      {players.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No players yet. Click "Load Sample Data" above to get started.
        </div>
      ) : (
        <div className={`grid gap-5 ${selectedPlayer ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-foreground text-sm">Squad Overview</h2>
              <span className="text-[11px] text-muted-foreground font-medium">{players.length} players</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {players.map((player, i) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  index={i}
                  onClick={() => setSelectedId(player.id === selectedId ? null : player.id)}
                />
              ))}
            </div>
          </div>

          {selectedPlayer && (
            <div className="hidden lg:block">
              <PlayerDetailPanel player={selectedPlayer} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
