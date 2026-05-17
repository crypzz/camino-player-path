import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayers, useUpdatePlayer } from '@/hooks/usePlayers';
import { Player, getCategoryAverage } from '@/types/player';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { RatingPills } from '@/components/evaluations/RatingPills';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Save, RotateCcw, Target, Brain, Zap, Heart, Search, CheckCircle2, Loader2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Cat = 'technical' | 'tactical' | 'physical' | 'mental';

const CATS: { key: Cat; label: string; icon: any; tint: string }[] = [
  { key: 'technical', label: 'Technical', icon: Target, tint: 'text-amber-400' },
  { key: 'tactical', label: 'Tactical', icon: Brain, tint: 'text-sky-400' },
  { key: 'physical', label: 'Physical', icon: Zap, tint: 'text-emerald-400' },
  { key: 'mental', label: 'Mental', icon: Heart, tint: 'text-violet-400' },
];

type Ratings = Record<Cat, Record<string, number>>;

function cloneRatings(p: Player): Ratings {
  return {
    technical: { ...p.technical },
    tactical: { ...p.tactical },
    physical: { ...p.physical },
    mental: { ...p.mental },
  };
}

function isDirty(a: Ratings, b: Ratings): boolean {
  return (['technical', 'tactical', 'physical', 'mental'] as Cat[]).some((c) =>
    Object.keys(a[c]).some((k) => a[c][k] !== b[c]?.[k]),
  );
}

export default function EvaluationsPage() {
  const { data: players = [], isLoading } = usePlayers();
  const updatePlayer = useUpdatePlayer();
  const [selectedId, setSelectedId] = useState<string>('');
  const [activeCat, setActiveCat] = useState<Cat>('technical');
  const [ratings, setRatings] = useState<Ratings | null>(null);
  const [baseline, setBaseline] = useState<Ratings | null>(null);
  const [search, setSearch] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = players.find((p) => p.id === selectedId);

  // initialize on first load / player switch
  useEffect(() => {
    if (!players.length) return;
    if (!selectedId) {
      setSelectedId(players[0].id);
      return;
    }
    const p = players.find((x) => x.id === selectedId);
    if (p && !ratings) {
      const fresh = cloneRatings(p);
      setRatings(fresh);
      setBaseline(fresh);
    }
  }, [players, selectedId, ratings]);

  const dirty = ratings && baseline ? isDirty(ratings, baseline) : false;

  const handleSwitchPlayer = (id: string) => {
    if (dirty) {
      const ok = window.confirm('You have unsaved changes. Discard them?');
      if (!ok) return;
    }
    const p = players.find((x) => x.id === id)!;
    const fresh = cloneRatings(p);
    setSelectedId(id);
    setRatings(fresh);
    setBaseline(fresh);
    setSavedAt(null);
  };

  const handleRate = (cat: Cat, metric: string, v: number) => {
    setRatings((prev) => (prev ? { ...prev, [cat]: { ...prev[cat], [metric]: v } } : prev));
  };

  const save = async (silent = false) => {
    if (!player || !ratings) return;
    try {
      await updatePlayer.mutateAsync({
        id: player.id,
        technical: ratings.technical as any,
        tactical: ratings.tactical as any,
        physical: ratings.physical as any,
        mental: ratings.mental as any,
      });
      setBaseline(ratings);
      setSavedAt(Date.now());
      if (!silent) toast.success(`Saved ${player.name}`);
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    }
  };

  // debounced autosave
  useEffect(() => {
    if (!dirty) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(true), 1500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratings]);

  const filteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q));
  }, [players, search]);

  const positionGroup = (pos: string): 'Goalkeepers' | 'Defenders' | 'Midfielders' | 'Attackers' | 'Other' => {
    const p = (pos || '').toLowerCase();
    if (/(gk|goal|keeper|portero)/.test(p)) return 'Goalkeepers';
    if (/(def|back|cb|lb|rb|wb|sweep|libero|defensa)/.test(p)) return 'Defenders';
    if (/(mid|cm|cdm|cam|dm|am|volante|mediocampista|pivot)/.test(p)) return 'Midfielders';
    if (/(fwd|forward|striker|winger|wing|st|cf|lw|rw|attack|delantero|extremo)/.test(p)) return 'Attackers';
    return 'Other';
  };

  const GROUP_ORDER: Array<ReturnType<typeof positionGroup>> = ['Goalkeepers', 'Defenders', 'Midfielders', 'Attackers', 'Other'];

  const groupedPlayers = useMemo(() => {
    const map = new Map<string, typeof filteredPlayers>();
    for (const g of GROUP_ORDER) map.set(g, []);
    for (const p of filteredPlayers) {
      const g = positionGroup(p.position);
      map.get(g)!.push(p);
    }
    return GROUP_ORDER.filter((g) => (map.get(g)?.length ?? 0) > 0).map((g) => ({ group: g, players: map.get(g)! }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPlayers]);

  const bumpAll = (cat: Cat, delta: number) =>
    setRatings((prev) =>
      prev
        ? {
            ...prev,
            [cat]: Object.fromEntries(
              Object.entries(prev[cat]).map(([k, v]) => [k, Math.max(1, Math.min(10, (v as number) + delta))]),
            ),
          }
        : prev,
    );

  const resetCat = (cat: Cat) => {
    if (!baseline) return;
    setRatings((prev) => (prev ? { ...prev, [cat]: { ...baseline[cat] } } : prev));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading…</div>;
  }
  if (players.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Player Evaluations</h1>
        <p className="text-muted-foreground text-sm">Add a player to start evaluating.</p>
      </div>
    );
  }
  if (!player || !ratings) return null;

  const tempPlayer = {
    ...player,
    technical: ratings.technical,
    tactical: ratings.tactical,
    physical: ratings.physical,
    mental: ratings.mental,
  } as Player;

  const avg = getCategoryAverage(ratings[activeCat]);

  return (
    <div className="space-y-5 pb-28">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Player Evaluations</h1>
          <p className="text-muted-foreground text-sm mt-1">Tap a number to rate. Changes save automatically.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {updatePlayer.isPending ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
          ) : dirty ? (
            <span className="text-amber-400">Unsaved changes</span>
          ) : savedAt ? (
            <><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Saved</>
          ) : null}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-5">
        {/* Player picker */}
        <div className="glass-card rounded-xl p-3 lg:max-h-[calc(100vh-220px)] overflow-hidden flex flex-col">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search players…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 text-xs bg-background/40"
            />
          </div>
          <div className="overflow-y-auto -mr-1 pr-1 space-y-1">
            {filteredPlayers.map((p) => {
              const active = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSwitchPlayer(p.id)}
                  className={cn(
                    'w-full text-left rounded-lg px-2.5 py-2 transition-colors flex items-center gap-2',
                    active ? 'bg-primary/15 ring-1 ring-primary/40' : 'hover:bg-muted/40',
                  )}
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 grid place-items-center text-[10px] font-bold text-primary-foreground/90 shrink-0">
                    {p.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-foreground truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{p.position} · {p.team}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating area */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4">
          <Tabs value={activeCat} onValueChange={(v) => setActiveCat(v as Cat)}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <TabsList className="bg-muted/30">
                {CATS.map(({ key, label, icon: Icon, tint }) => (
                  <TabsTrigger key={key} value={key} className="gap-1.5 text-xs">
                    <Icon className={cn('h-3.5 w-3.5', tint)} />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">Avg</span>
                <span className="text-sm font-display font-bold text-primary">{avg.toFixed(1)}</span>
                <div className="w-px h-4 bg-border mx-1" />
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => bumpAll(activeCat, -1)} title="−1 all">
                  <Minus className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => bumpAll(activeCat, 1)} title="+1 all">
                  <Plus className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 gap-1 text-[11px]" onClick={() => resetCat(activeCat)}>
                  <RotateCcw className="h-3 w-3" /> Reset
                </Button>
              </div>
            </div>

            {CATS.map(({ key }) => (
              <TabsContent key={key} value={key} className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="divide-y divide-border/40"
                  >
                    {Object.entries(ratings[key]).map(([metric, value]) => (
                      <div key={metric} className="py-2">
                        <RatingPills
                          label={metric}
                          value={value as number}
                          onChange={(v) => handleRate(key, metric, v)}
                        />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Live preview */}
        <div className="space-y-4 lg:sticky lg:top-4 self-start">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground text-center mb-2">Live · {activeCat}</div>
            <PlayerRadarChart player={tempPlayer} category={activeCat} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-xl p-4 flex justify-center">
            <CPIScoreDisplay player={tempPlayer} size="sm" />
          </motion.div>
        </div>
      </div>

      {/* Sticky save bar */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-card border border-primary/30 rounded-full px-4 py-2 flex items-center gap-3 shadow-xl"
          >
            <span className="text-xs text-foreground">Unsaved changes for <span className="font-semibold text-primary">{player.name}</span></span>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setRatings(baseline); }}>
              Discard
            </Button>
            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => save(false)} disabled={updatePlayer.isPending}>
              <Save className="h-3 w-3" /> Save now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
