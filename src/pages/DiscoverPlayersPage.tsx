import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDiscoverPlayers, DiscoveryFilters } from '@/hooks/usePlayerDiscovery';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShieldCheck, ArrowLeftRight, MapPin, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const POSITIONS = ['all', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker'];

function initials(name: string | null) {
  if (!name) return 'CP';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function DiscoverPlayersPage() {
  const [filters, setFilters] = useState<DiscoveryFilters>({ sort: 'rating' });
  const [transferOnly, setTransferOnly] = useState(false);
  const { data: players = [], isLoading } = useDiscoverPlayers({ ...filters, transferOnly });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link to="/" className="text-[11px] text-muted-foreground hover:text-foreground">← Camino</Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground mt-3">
            Discover <span className="text-primary">Players</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg">
            Verified performance data. Real talent. Every player deserves to be seen and understood.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, team, location..."
              value={filters.search ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="pl-9 h-9"
            />
          </div>
          <Select value={filters.position ?? 'all'} onValueChange={(v) => setFilters((f) => ({ ...f, position: v }))}>
            <SelectTrigger className="w-full sm:w-40 h-9 text-[13px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p}>{p === 'all' ? 'All positions' : p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.sort} onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as 'rating' | 'name' }))}>
            <SelectTrigger className="w-full sm:w-36 h-9 text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top rated</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={transferOnly ? 'default' : 'outline'}
            className="h-9 gap-1.5 text-[13px]"
            onClick={() => setTransferOnly((v) => !v)}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Transfer
          </Button>
        </div>

        <p className="text-[12px] text-muted-foreground">{players.length} players</p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : players.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-20">No players match your filters yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
              >
                <Link
                  to={`/player/${p.id}`}
                  className="group block rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border">
                      {p.avatar && <AvatarImage src={p.avatar} alt={p.name ?? ''} />}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials(p.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {p.name ?? 'Player'}
                        </h3>
                        {p.verification_badge && <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {[p.position, p.team].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                    {p.overall_rating != null && p.overall_rating > 0 && (
                      <div className="text-center shrink-0">
                        <div className="text-lg font-bold text-primary leading-none">{Math.round(p.overall_rating)}</div>
                        <div className="text-[8px] uppercase tracking-wider text-muted-foreground">OVR</div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {p.age_group && <Badge variant="secondary" className="text-[10px]">{p.age_group}</Badge>}
                    {p.location && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5" />{p.location}
                      </span>
                    )}
                    {p.available_for_transfer && (
                      <Badge className="text-[10px] gap-0.5 bg-primary/15 text-primary border-0">
                        <ArrowLeftRight className="h-2.5 w-2.5" />Available
                      </Badge>
                    )}
                  </div>

                  {p.strengths && p.strengths.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.strengths.slice(0, 3).map((s, j) => (
                        <span key={j} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/80">
                          <Star className="h-2.5 w-2.5 text-primary/60" />{s}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center pt-6">
          <a href="/" className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-muted-foreground">
            <span className="font-display font-bold tracking-tight">CAMINO</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
