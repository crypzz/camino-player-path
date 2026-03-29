import { useRef, useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RankedPlayer } from '@/hooks/useRankings';
import { toast } from 'sonner';

interface Props {
  player: RankedPlayer;
  cpiScore: number;
}

export function ShareCardDialog({ player, cpiScore }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const shareText = `🏆 #${player.localRank || player.globalRank} Ranked ${player.age_group || ''} Player${player.location ? ` in ${player.location}` : ''}\n⚽ ${player.name} | CPI: ${cpiScore}\n\nTracking my development on Camino 🔥`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Ranking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Share Card Preview */}
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-[#0D0F14] via-[#151820] to-[#1a1f2e] rounded-xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-medium">Camino Rankings</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                  {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">{player.name}</p>
                  <p className="text-xs text-white/60">{player.position} · {player.team}</p>
                </div>
              </div>
              <div className="mt-5 flex items-end gap-4">
                <div>
                  <p className="text-3xl font-black text-primary">{cpiScore}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">CPI Score</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xl font-bold">#{player.localRank || player.globalRank}</p>
                  <p className="text-[10px] text-white/50">
                    {player.age_group}{player.location ? ` · ${player.location}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
            <Button onClick={handleShare} className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
