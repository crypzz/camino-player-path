import { Player } from '@/types/player';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlayerDetailPanel } from '@/components/PlayerDetailPanel';

interface Props {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlayerDetailDialog({ player, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-transparent border-0 shadow-none max-h-[92vh] overflow-hidden">
        {player && (
          <PlayerDetailPanel player={player} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
