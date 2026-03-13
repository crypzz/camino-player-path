import { useState } from 'react';
import { mockPlayers } from '@/data/mockPlayers';
import { StatCard } from '@/components/StatCard';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerDetailPanel } from '@/components/PlayerDetailPanel';
import { Users, Target, CalendarCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateCPI } from '@/types/player';

export default function CoachDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPlayer = mockPlayers.find(p => p.id === selectedId) ?? null;

  const totalGoalsCompleted = mockPlayers.reduce((acc, p) => acc + p.goals.filter(g => g.status === 'completed').length, 0);
  const avgAttendance = Math.round(mockPlayers.reduce((acc, p) => acc + p.attendance, 0) / mockPlayers.length);
  const avgCPI = Math.round(mockPlayers.reduce((acc, p) => acc + calculateCPI(p), 0) / mockPlayers.length);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Welcome back, Coach</h1>
        <p className="text-muted-foreground text-[13px] mt-0.5">Here's how your academy is performing</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total Players" value={mockPlayers.length} subtitle="Across all teams" icon={Users} index={0} />
        <StatCard title="Avg CPI" value={avgCPI} subtitle="Camino Player Index" icon={Award} index={1} />
        <StatCard title="Goals Completed" value={totalGoalsCompleted} subtitle="Development targets" icon={Target} index={2} />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} subtitle="This month" icon={CalendarCheck} index={3} />
      </div>

      <div className={`grid gap-5 ${selectedPlayer ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-foreground text-sm">Squad Overview</h2>
            <span className="text-[11px] text-muted-foreground font-medium">{mockPlayers.length} players</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockPlayers.map((player, i) => (
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
    </div>
  );
}
