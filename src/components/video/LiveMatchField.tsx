import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, MapPin, Activity, Footprints, Clock, Flame } from 'lucide-react';
import { PlayerTracking } from '@/hooks/usePlayerTracking';
import { MatchPlayerStat } from '@/hooks/useMatchPlayerStats';
import { cn } from '@/lib/utils';

interface PlayerInfo {
  id: string;
  name: string;
  jersey?: number | null;
  position?: string | null;
}

interface Props {
  tracking: PlayerTracking[];
  stats: MatchPlayerStat[];
  players: PlayerInfo[];
  currentTime: number;
  duration: number;
}

const DOT_COLORS = [
  'hsl(45, 100%, 58%)',
  'hsl(215, 95%, 58%)',
  'hsl(160, 72%, 42%)',
  'hsl(0, 72%, 51%)',
  'hsl(280, 70%, 60%)',
  'hsl(30, 95%, 52%)',
  'hsl(180, 70%, 50%)',
  'hsl(340, 80%, 55%)',
  'hsl(100, 60%, 50%)',
  'hsl(255, 70%, 65%)',
];

type SortKey = 'touches' | 'distance' | 'possession';

function fieldColor(id: string, ids: string[]) {
  return DOT_COLORS[ids.indexOf(id) % DOT_COLORS.length];
}

export default function LiveMatchField({ tracking, stats, players, currentTime, duration }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [sortKey, setSortKey] = useState<SortKey>('touches');
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const playerMap = useMemo(() => new Map(players.map(p => [p.id, p])), [players]);
  const trackIds = useMemo(() => [...new Set(tracking.map(t => t.tracking_id))], [tracking]);

  // distinct frame timestamps
  const frameTimes = useMemo(
    () => [...new Set(tracking.map(t => t.timestamp_seconds))].sort((a, b) => a - b),
    [tracking]
  );

  // positions at current time (nearest frame)
  const livePositions = useMemo(() => {
    if (frameTimes.length === 0) return [];
    const nearest = frameTimes.reduce((best, t) =>
      Math.abs(t - currentTime) < Math.abs(best - currentTime) ? t : best, frameTimes[0]);
    const map = new Map<string, PlayerTracking>();
    for (const t of tracking) {
      if (Math.abs(t.timestamp_seconds - nearest) > 0.01) continue;
      const existing = map.get(t.tracking_id);
      if (!existing || t.confidence > existing.confidence) map.set(t.tracking_id, t);
    }
    return [...map.values()];
  }, [tracking, frameTimes, currentTime]);

  // movement path for highlighted player (up to current time)
  const highlightPath = useMemo(() => {
    if (!highlightId) return [];
    return tracking
      .filter(t => (t.player_id === highlightId || t.tracking_id === highlightId) && t.timestamp_seconds <= currentTime + 0.05)
      .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds)
      .map(t => ({ x: t.bbox_x + t.bbox_width / 2, y: t.bbox_y + t.bbox_height / 2 }));
  }, [tracking, highlightId, currentTime]);

  // progressive stats scaling — estimate based on video progress
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 1;

  const sortedStats = useMemo(() => {
    const rows = stats.map(s => ({
      ...s,
      liveTouches: Math.round(s.estimated_touches * progress),
      liveDistance: Math.round(s.distance_covered * progress),
      livePossession: s.time_on_field > 0 ? Math.round((s.time_on_field / Math.max(s.time_on_field, duration || s.time_on_field)) * 100) : 0,
    }));
    rows.sort((a, b) => {
      if (sortKey === 'touches') return b.liveTouches - a.liveTouches;
      if (sortKey === 'distance') return b.liveDistance - a.liveDistance;
      return b.livePossession - a.livePossession;
    });
    return rows;
  }, [stats, sortKey, progress, duration]);

  const drawPitch = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // grass
    ctx.fillStyle = 'hsl(150, 30%, 12%)';
    ctx.fillRect(0, 0, w, h);
    // stripes
    const stripes = 10;
    for (let i = 0; i < stripes; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = 'hsla(150, 30%, 16%, 0.6)';
        ctx.fillRect((i / stripes) * w, 0, w / stripes, h);
      }
    }
    const line = 'hsla(0, 0%, 100%, 0.35)';
    ctx.strokeStyle = line;
    ctx.lineWidth = 1.5;
    const pad = w * 0.02;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    // halfway line
    ctx.beginPath();
    ctx.moveTo(w / 2, pad);
    ctx.lineTo(w / 2, h - pad);
    ctx.stroke();
    // center circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, h * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = line;
    ctx.fill();
    // penalty boxes
    const boxH = h * 0.5;
    const boxW = w * 0.14;
    ctx.strokeRect(pad, (h - boxH) / 2, boxW, boxH);
    ctx.strokeRect(w - pad - boxW, (h - boxH) / 2, boxW, boxH);
    const sixH = h * 0.24;
    const sixW = w * 0.05;
    ctx.strokeRect(pad, (h - sixH) / 2, sixW, sixH);
    ctx.strokeRect(w - pad - sixW, (h - sixH) / 2, sixW, sixH);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h } = size;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);
    drawPitch(ctx, w, h);

    const sx = w / 100;
    const sy = h / 100;

    // highlight movement path
    if (highlightPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(highlightPath[0].x * sx, highlightPath[0].y * sy);
      for (const p of highlightPath.slice(1)) ctx.lineTo(p.x * sx, p.y * sy);
      ctx.strokeStyle = 'hsla(45, 100%, 58%, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // player dots
    for (const t of livePositions) {
      const info = t.player_id ? playerMap.get(t.player_id) : null;
      const color = fieldColor(t.tracking_id, trackIds);
      const cx = (t.bbox_x + t.bbox_width / 2) * sx;
      const cy = (t.bbox_y + t.bbox_height / 2) * sy;
      const isHi = highlightId && (t.player_id === highlightId || t.tracking_id === highlightId);
      const r = isHi ? 11 : 8;

      if (isHi) {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(45, 100%, 58%, 0.2)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // jersey number
      const num = info?.jersey != null ? String(info.jersey) : (t.player_id ? '' : '');
      if (num) {
        ctx.fillStyle = '#000';
        ctx.font = `bold ${r}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num, cx, cy + 0.5);
      }

      // name label
      if (info?.name) {
        ctx.font = `600 10px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const label = info.name.split(' ')[0];
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(cx - tw / 2 - 3, cy - r - 16, tw + 6, 13);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, cx, cy - r - 4);
      }
    }
  }, [size, drawPitch, livePositions, playerMap, trackIds, highlightId, highlightPath]);

  useEffect(() => { draw(); }, [draw]);

  // resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width } = e.contentRect;
        const height = width * 0.68; // 100x68 pitch ratio
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        setSize({ w: width, h: height });
      }
    });
    obs.observe(parent);
    return () => obs.disconnect();
  }, []);

  const hasData = tracking.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3">
          <MapPin className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-foreground text-sm mb-1">No live tracking data yet</h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          Run the AI Tracker or tag players in the Tracking tab. Their positions will animate on the pitch here as the video plays.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
      {/* Field */}
      <div className="space-y-2">
        <div className="rounded-xl overflow-hidden border border-border bg-black/40">
          <canvas ref={canvasRef} className="w-full block" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-primary" />
            {livePositions.length} players on pitch
          </span>
          <span>{currentTime.toFixed(1)}s / {duration.toFixed(0)}s</span>
        </div>
      </div>

      {/* Metrics panel */}
      <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
        <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
          <h4 className="font-display font-semibold text-foreground text-xs">Live Performance</h4>
          <span className="text-[10px] text-muted-foreground">{Math.round(progress * 100)}% played</span>
        </div>

        {/* sort controls */}
        <div className="flex gap-1 p-2 border-b border-border">
          {([
            { k: 'touches' as SortKey, label: 'Touches', icon: Footprints },
            { k: 'distance' as SortKey, label: 'Dist', icon: Flame },
            { k: 'possession' as SortKey, label: 'Poss%', icon: Clock },
          ]).map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1 text-[10px] font-medium py-1.5 rounded-md transition-colors',
                sortKey === k ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-secondary'
              )}
            >
              <Icon className="h-3 w-3" /> {label}
              {sortKey === k && <ArrowUpDown className="h-2.5 w-2.5" />}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[420px] divide-y divide-border/50">
          {sortedStats.length === 0 ? (
            <p className="text-[11px] text-muted-foreground p-4 text-center">
              Generate stats to see live performance metrics.
            </p>
          ) : sortedStats.map((s, i) => {
            const info = playerMap.get(s.player_id);
            const active = highlightId === s.player_id;
            return (
              <motion.button
                key={s.id}
                onClick={() => setHighlightId(active ? null : s.player_id)}
                className={cn(
                  'w-full text-left px-3 py-2 transition-colors',
                  active ? 'bg-primary/10' : 'hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground truncate">
                    <span className="text-[10px] text-muted-foreground w-4">{i + 1}</span>
                    {info?.name || 'Unknown'}
                  </span>
                  {active && <MapPin className="h-3 w-3 text-primary shrink-0" />}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground pl-5">
                  <span className={cn(sortKey === 'touches' && 'text-primary font-semibold')}>
                    {s.liveTouches} touch
                  </span>
                  <span className={cn(sortKey === 'distance' && 'text-primary font-semibold')}>
                    {s.liveDistance}m
                  </span>
                  <span className={cn(sortKey === 'possession' && 'text-primary font-semibold')}>
                    {s.livePossession}%
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {highlightId && (
          <div className="p-2 border-t border-border bg-secondary/30">
            <p className="text-[10px] text-muted-foreground text-center">
              Showing movement path on pitch · tap again to clear
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
