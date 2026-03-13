import { useState } from 'react';
import { mockPlayers } from '@/data/mockPlayers';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerDetailPanel } from '@/components/PlayerDetailPanel';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function PlayersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const selectedPlayer = mockPlayers.find(p => p.id === selectedId) ?? null;

  const filtered = mockPlayers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Players</h1>
        <p className="text-muted-foreground text-[13px] mt-0.5">Manage and evaluate your academy players</p>
      </motion.div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-8 h-8 text-[13px] bg-card border-border"
        />
      </div>

      <div className={`grid gap-5 ${selectedPlayer ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={i}
              onClick={() => setSelectedId(player.id === selectedId ? null : player.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-[13px] col-span-2 text-center py-12">No players found</p>
          )}
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
