import { useRef } from 'react';
import { Player, calculateCPI, getCategoryAverage } from '@/types/player';
import { PlayerLevel } from '@/lib/playerLevel';
import { TrendingUp, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  player: Player;
  level: PlayerLevel;
  globalRank?: number;
}

export function ShareableStatCard({ player, level, globalRank }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cpi = calculateCPI(player);

  const stats = [
    { label: 'Technical', value: getCategoryAverage(player.technical) },
    { label: 'Tactical', value: getCategoryAverage(player.tactical) },
    { label: 'Physical', value: getCategoryAverage(player.physical) },
    { label: 'Mental', value: getCategoryAverage(player.mental) },
  ];

  const handleCopy = async () => {
    const text = `⚡ ${player.name} | CPI: ${cpi}${globalRank ? ` | #${globalRank} Ranked` : ''}\n${level.tier} (Level ${level.level})\n\n📊 Tech ${stats[0].value} · Tac ${stats[1].value} · Phy ${stats[2].value} · Men ${stats[3].value}\n\nTracked on Camino 🏆`;
    await navigator.clipboard.writeText(text);
    toast.success('Stat card copied!');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/player/${player.id}`;
    const text = `Check out ${player.name}'s profile on Camino — CPI: ${cpi}, ${level.tier} tier`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${player.name} on Camino`, text, url });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-3">
      {/* The card — optimized for screenshots */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-[hsl(225,30%,6%)] via-[hsl(225,25%,10%)] to-[hsl(225,20%,14%)] rounded-xl p-5 relative overflow-hidden aspect-[4/5] max-w-[320px] flex flex-col justify-between"
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl" style={{ background: `${level.color}15` }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl bg-primary/5" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] uppercase tracking-[0.25em] text-primary/60 font-semibold">Camino · Player Card</p>
            {globalRank && (
              <span className="text-[10px] font-bold text-primary/80">#{globalRank}</span>
            )}
          </div>

          {/* Player info */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: `${level.color}25`, color: level.color }}>
              {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-base text-foreground leading-tight">{player.name}</p>
              <p className="text-[11px] text-muted-foreground">{player.position} · {player.team}</p>
            </div>
          </div>

          {/* Level badge */}
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${level.bgClass} ${level.borderClass} ${level.textClass}`}>
            Lvl {level.level} · {level.tier}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10">
          {/* CPI */}
          <div className="mb-4">
            <p className="text-4xl font-black text-primary leading-none">{cpi}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">CPI Score</p>
          </div>

          {/* Category stats */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-[8px] text-muted-foreground uppercase tracking-wide">{s.label.slice(0, 4)}</p>
              </div>
            ))}
          </div>

          {/* Branding */}
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
            <p className="text-[8px] text-muted-foreground/50 uppercase tracking-[0.2em]">Built on Camino</p>
            <div className="flex items-center gap-1 text-[8px] text-success">
              <TrendingUp className="h-2.5 w-2.5" />
              <span className="font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 max-w-[320px]">
        <Button onClick={handleCopy} variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
          <Copy className="h-3 w-3" />
          Copy
        </Button>
        <Button onClick={handleShare} size="sm" className="flex-1 gap-1.5 text-xs">
          <Share2 className="h-3 w-3" />
          Share
        </Button>
      </div>
    </div>
  );
}
