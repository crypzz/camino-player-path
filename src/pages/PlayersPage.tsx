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
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Players</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and evaluate your academy players</p>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      <div className={`grid gap-6 ${selectedPlayer ? 'lg:grid-cols-[1fr_420px]' : 'grid-cols-1'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={i}
              onClick={() => setSelectedId(player.id === selectedId ? null : player.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm col-span-2 text-center py-12">No players found</p>
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
