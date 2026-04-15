import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { User, Crosshair, Sparkles, Trash2, Eye, EyeOff, Flame, MapPin, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useCreatePlayerTracking, useDeletePlayerTracking, PlayerTracking } from '@/hooks/usePlayerTracking';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  heatmapPlayerId: string | null;
  onSetHeatmapPlayer: (id: string | null) => void;
}

const BBOX_SIZE = 8;

interface TrackedPlayerStats {
  trackingId: string;
  playerId: string | null;
  playerName: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  timeSpan: number;
  avgX: number;
  avgY: number;
  zone: string;
  source: string;
  movementSpread: number;
}

function getZone(x: number, y: number): string {
  const row = y < 33 ? 'Defensive' : y < 66 ? 'Midfield' : 'Attacking';
  const col = x < 33 ? 'Left' : x < 66 ? 'Central' : 'Right';
  return `${row} ${col}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

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
  showHeatmap,
  onToggleHeatmap,
  heatmapPlayerId,
  onSetHeatmapPlayer,
}: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const createTracking = useCreatePlayerTracking();
  const deleteTracking = useDeletePlayerTracking();

  const trackedPlayers = useMemo(() => {
    const map = new Map<string, TrackedPlayerStats>();
    for (const t of tracking) {
      if (!map.has(t.tracking_id)) {
        const p = t.player_id ? players.find(pl => pl.id === t.player_id) : null;
        map.set(t.tracking_id, {
          trackingId: t.tracking_id,
          playerId: t.player_id,
          playerName: p?.name || 'Unassigned',
          count: 0,
          firstSeen: t.timestamp_seconds,
          lastSeen: t.timestamp_seconds,
          timeSpan: 0,
          avgX: 0,
          avgY: 0,
          zone: '',
          source: t.source,
          movementSpread: 0,
        });
      }
      const entry = map.get(t.tracking_id)!;
      entry.count++;
      entry.firstSeen = Math.min(entry.firstSeen, t.timestamp_seconds);
      entry.lastSeen = Math.max(entry.lastSeen, t.timestamp_seconds);
      entry.avgX += t.bbox_x + t.bbox_width / 2;
      entry.avgY += t.bbox_y + t.bbox_height / 2;
    }

    // Finalize averages and compute zones
    for (const [, entry] of map) {
      if (entry.count > 0) {
        entry.avgX /= entry.count;
        entry.avgY /= entry.count;
        entry.zone = getZone(entry.avgX, entry.avgY);
        entry.timeSpan = entry.lastSeen - entry.firstSeen;
      }
    }

    // Compute movement spread (std dev of positions)
    for (const t of tracking) {
      const entry = map.get(t.tracking_id)!;
      const dx = (t.bbox_x + t.bbox_width / 2) - entry.avgX;
      const dy = (t.bbox_y + t.bbox_height / 2) - entry.avgY;
      entry.movementSpread += dx * dx + dy * dy;
    }
    for (const [, entry] of map) {
      if (entry.count > 1) {
        entry.movementSpread = Math.sqrt(entry.movementSpread / entry.count);
      }
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [tracking, players]);

  // Summary stats
  const totalPoints = tracking.length;
  const aiPoints = tracking.filter(t => t.source === 'ai').length;
  const manualPoints = totalPoints - aiPoints;
  const timeRange = trackedPlayers.length > 0
    ? Math.max(...trackedPlayers.map(t => t.lastSeen)) - Math.min(...trackedPlayers.map(t => t.firstSeen))
    : 0;

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
        frame_number: Math.round(currentTime * 30),
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
        <Button size="sm" variant={isTagging ? 'default' : 'outline'} className="gap-1.5 text-xs flex-1" onClick={onToggleTagging}>
          <Crosshair className="h-3.5 w-3.5" />
          {isTagging ? 'Tagging ON' : 'Tag Player'}
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onToggleOverlays}>
          {showOverlays ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </Button>
        <Button
          size="sm"
          variant={showHeatmap ? 'default' : 'outline'}
          className="gap-1.5 text-xs"
          onClick={onToggleHeatmap}
        >
          <Flame className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Heatmap player filter */}
      {showHeatmap && trackedPlayers.length > 0 && (
        <Select value={heatmapPlayerId || 'all'} onValueChange={v => onSetHeatmapPlayer(v === 'all' ? null : v)}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Heatmap: All players" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Players</SelectItem>
            {trackedPlayers.map(tp => (
              <SelectItem key={tp.trackingId} value={tp.playerId || tp.trackingId}>
                {tp.playerName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Pending tag confirmation */}
      {pendingTag && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
          <p className="text-xs text-primary font-medium">Tag at ({Math.round(pendingTag.x)}%, {Math.round(pendingTag.y)}%)</p>
          <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select player..." /></SelectTrigger>
            <SelectContent>
              {players.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 text-xs h-7" onClick={handleConfirmTag} disabled={!selectedPlayer}>Confirm</Button>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={onClearPendingTag}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Tracking Summary */}
      {totalPoints > 0 && (
        <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2">
          <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Tracking Summary</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-display font-bold text-primary">{trackedPlayers.length}</p>
              <p className="text-[10px] text-muted-foreground">Players</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display font-bold text-foreground">{totalPoints}</p>
              <p className="text-[10px] text-muted-foreground">Positions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display font-bold text-foreground">{formatTime(timeRange)}</p>
              <p className="text-[10px] text-muted-foreground">Duration</p>
            </div>
          </div>
          <div className="flex gap-2">
            {aiPoints > 0 && (
              <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary gap-1">
                <Sparkles className="h-2.5 w-2.5" /> {aiPoints} AI
              </Badge>
            )}
            {manualPoints > 0 && (
              <Badge variant="outline" className="text-[10px] h-5 gap-1">
                <Crosshair className="h-2.5 w-2.5" /> {manualPoints} Manual
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* AI Info (only when no tracking) */}
      {totalPoints === 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
          <Sparkles className="h-4 w-4 mx-auto mb-1 text-primary" />
          <p className="text-[10px] text-muted-foreground">Use the <span className="text-primary font-medium">AI Analyze</span> button above to auto-detect players</p>
        </div>
      )}

      {/* Tracked players list */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" /> Tracked Players ({trackedPlayers.length})
        </h4>
        <ScrollArea className="max-h-[340px]">
          {trackedPlayers.length === 0 ? (
            <p className="text-[11px] text-muted-foreground text-center py-4">
              Click "Tag Player" then click on a player in the video
            </p>
          ) : (
            <div className="space-y-1.5">
              {trackedPlayers.map(tp => {
                const isExpanded = expandedId === tp.trackingId;
                const coveragePercent = tp.timeSpan > 0 ? Math.min(100, Math.round((tp.count / (tp.timeSpan * 2)) * 100)) : 0;
                return (
                  <div key={tp.trackingId} className="rounded-lg bg-secondary/50 border border-border/50 overflow-hidden">
                    <div
                      className="flex items-center gap-2 p-2.5 cursor-pointer group hover:bg-secondary/80 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : tp.trackingId)}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{tp.playerName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {tp.count} pts · {formatTime(tp.firstSeen)}–{formatTime(tp.lastSeen)}
                        </p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] h-5 ${tp.source === 'ai' ? 'border-primary/30 text-primary' : 'border-muted-foreground/30'}`}>
                        {tp.source === 'ai' ? 'AI' : 'Manual'}
                      </Badge>
                      {isExpanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 space-y-2 border-t border-border/30 pt-2">
                            {/* Zone & Position */}
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <MapPin className="h-3 w-3 text-primary" />
                              <span>Primary zone: <span className="text-foreground font-medium">{tp.zone}</span></span>
                            </div>

                            {/* Time on field */}
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Time tracked: <span className="text-foreground font-medium">{formatTime(tp.timeSpan)}</span></span>
                            </div>

                            {/* Movement spread */}
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <Zap className="h-3 w-3" />
                              <span>Movement spread: <span className="text-foreground font-medium">{tp.movementSpread.toFixed(1)}</span></span>
                            </div>

                            {/* Coverage bar */}
                            <div>
                              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                <span>Tracking density</span>
                                <span className="text-foreground font-medium">{coveragePercent}%</span>
                              </div>
                              <Progress value={coveragePercent} className="h-1.5" />
                            </div>

                            {/* Mini pitch position */}
                            <div className="relative w-full h-16 rounded bg-muted/50 border border-border/30 overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-[9px] text-muted-foreground/30 uppercase">Pitch</div>
                              {/* Center line */}
                              <div className="absolute left-0 right-0 top-1/2 h-px bg-border/30" />
                              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border/30" />
                              {/* Average position dot */}
                              <div
                                className="absolute w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/30 -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${tp.avgX}%`, top: `${tp.avgY}%` }}
                              />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-[10px] h-6 gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSetHeatmapPlayer(tp.playerId || tp.trackingId);
                                  if (!showHeatmap) onToggleHeatmap();
                                }}
                              >
                                <Flame className="h-2.5 w-2.5" /> Show Heatmap
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[10px] h-6 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTracking(tp.trackingId);
                                }}
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
