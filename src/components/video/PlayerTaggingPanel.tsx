import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Crosshair, Sparkles, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCreatePlayerTracking, useDeletePlayerTracking, PlayerTracking } from '@/hooks/usePlayerTracking';
import { toast } from 'sonner';

interface Props {
  videoId: string;
  currentTime: number;
  players: { id: string; name: string }[];
  tracking: PlayerTracking[];
  showOverlays: boolean;
  onToggleOverlays: () => void;
  isTagging: boolean;
  onToggleTagging: () => void;
  pendingTag: { x: number; y: number } | null;
  onClearPendingTag: () => void;
}

const BBOX_SIZE = 8; // default bbox size in %

export default function PlayerTaggingPanel({
  videoId,
  currentTime,
  players,
  tracking,
  showOverlays,
  onToggleOverlays,
  isTagging,
  onToggleTagging,
  pendingTag,
  onClearPendingTag,
}: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const createTracking = useCreatePlayerTracking();
  const deleteTracking = useDeletePlayerTracking();

  // Get unique tracked players
  const trackedMap = new Map<string, { trackingId: string; playerId: string | null; count: number; playerName: string }>();
  for (const t of tracking) {
    if (!trackedMap.has(t.tracking_id)) {
      const p = t.player_id ? players.find(pl => pl.id === t.player_id) : null;
      trackedMap.set(t.tracking_id, {
        trackingId: t.tracking_id,
        playerId: t.player_id,
        count: 0,
        playerName: p?.name || 'Unassigned',
      });
    }
    trackedMap.get(t.tracking_id)!.count++;
  }
  const trackedPlayers = Array.from(trackedMap.values());

  const handleConfirmTag = async () => {
    if (!pendingTag || !selectedPlayer) {
      toast.error('Select a player first');
      return;
    }

    const trackingId = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    try {
      await createTracking.mutateAsync({
        video_id: videoId,
        player_id: selectedPlayer,
        tracking_id: trackingId,
        frame_number: Math.round(currentTime * 30), // assume 30fps
        timestamp_seconds: currentTime,
        bbox_x: pendingTag.x - BBOX_SIZE / 2,
        bbox_y: pendingTag.y - BBOX_SIZE / 2,
        bbox_width: BBOX_SIZE,
        bbox_height: BBOX_SIZE * 1.5,
        source: 'manual',
      });
      toast.success('Player tagged');
      onClearPendingTag();
    } catch (err: any) {
      toast.error(err.message || 'Failed to tag player');
    }
  };

  const handleDeleteTracking = async (trackingId: string) => {
    const entries = tracking.filter(t => t.tracking_id === trackingId);
    try {
      for (const e of entries) {
        await deleteTracking.mutateAsync({ id: e.id, videoId });
      }
      toast.success('Tracking removed');
    } catch {
      toast.error('Failed to remove tracking');
    }
  };

  return (
    <div className="space-y-3 p-3">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isTagging ? 'default' : 'outline'}
          className="gap-1.5 text-xs flex-1"
          onClick={onToggleTagging}
        >
          <Crosshair className="h-3.5 w-3.5" />
          {isTagging ? 'Tagging Mode ON' : 'Tag Player'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs"
          onClick={onToggleOverlays}
        >
          {showOverlays ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Pending tag confirmation */}
      {pendingTag && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
          <p className="text-xs text-primary font-medium">Tag at position ({Math.round(pendingTag.x)}%, {Math.round(pendingTag.y)}%)</p>
          <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select player..." />
            </SelectTrigger>
            <SelectContent>
              {players.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 text-xs h-7" onClick={handleConfirmTag} disabled={!selectedPlayer}>
              Confirm
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={onClearPendingTag}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* AI Info */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
        <Sparkles className="h-4 w-4 mx-auto mb-1 text-primary" />
        <p className="text-[10px] text-muted-foreground">Use the <span className="text-primary font-medium">AI Analyze</span> button above to auto-detect players</p>
      </div>

      {/* Tracked players list */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" /> Tracked Players ({trackedPlayers.length})
        </h4>
        <ScrollArea className="max-h-[240px]">
          {trackedPlayers.length === 0 ? (
            <p className="text-[11px] text-muted-foreground text-center py-4">
              Click "Tag Player" then click on a player in the video
            </p>
          ) : (
            <div className="space-y-1.5">
              {trackedPlayers.map(tp => (
                <div key={tp.trackingId} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 group">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{tp.playerName}</p>
                    <p className="text-[10px] text-muted-foreground">{tp.count} tracking points</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5">
                    {tp.playerId ? 'linked' : 'unlinked'}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteTracking(tp.trackingId)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
