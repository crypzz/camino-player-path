import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { PlayerTracking } from '@/hooks/usePlayerTracking';

interface Props {
  tracking: PlayerTracking[];
  currentTime: number;
  players: { id: string; name: string }[];
  videoWidth: number;
  videoHeight: number;
  showOverlays: boolean;
  showHeatmap?: boolean;
  heatmapPlayerId?: string | null;
  onCanvasClick?: (x: number, y: number) => void;
  isTagging?: boolean;
}

const TRACKING_COLORS = [
  'hsl(45, 100%, 58%)',
  'hsl(215, 95%, 58%)',
  'hsl(160, 72%, 42%)',
  'hsl(0, 72%, 51%)',
  'hsl(280, 70%, 60%)',
  'hsl(30, 95%, 52%)',
  'hsl(180, 70%, 50%)',
  'hsl(340, 80%, 55%)',
];

function getColorForTrackingId(trackingId: string, allIds: string[]): string {
  const idx = allIds.indexOf(trackingId);
  return TRACKING_COLORS[idx % TRACKING_COLORS.length];
}

export default function VideoOverlayCanvas({
  tracking,
  currentTime,
  players,
  showOverlays,
  showHeatmap,
  heatmapPlayerId,
  onCanvasClick,
  isTagging,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  // Memoize expensive computations
  const allTrackingIds = useMemo(
    () => [...new Set(tracking.map(t => t.tracking_id))],
    [tracking]
  );

  const playerMap = useMemo(
    () => new Map(players.map(p => [p.id, p.name])),
    [players]
  );

  // Memoize current boxes based on rounded time (reduce recalculations)
  const currentBoxes = useMemo(() => {
    const map = new Map<string, PlayerTracking>();
    for (const t of tracking) {
      if (Math.abs(t.timestamp_seconds - currentTime) >= 0.5) continue;
      const existing = map.get(t.tracking_id);
      if (!existing || Math.abs(t.timestamp_seconds - currentTime) < Math.abs(existing.timestamp_seconds - currentTime)) {
        map.set(t.tracking_id, t);
      }
    }
    return map;
  }, [tracking, currentTime]);

  // Heatmap points: aggregate all positions for the selected player (or all)
  const heatmapPoints = useMemo(() => {
    if (!showHeatmap) return [];
    return tracking
      .filter(t => !heatmapPlayerId || t.player_id === heatmapPlayerId || t.tracking_id === heatmapPlayerId)
      .map(t => ({ x: t.bbox_x + t.bbox_width / 2, y: t.bbox_y + t.bbox_height / 2 }));
  }, [tracking, showHeatmap, heatmapPlayerId]);

  const drawHeatmap = useCallback((ctx: CanvasRenderingContext2D) => {
    if (heatmapPoints.length === 0) return;
    const scaleX = canvasSize.w / 100;
    const scaleY = canvasSize.h / 100;
    const radius = Math.max(20, canvasSize.w / 15);

    // Draw each point as a radial gradient blob
    for (const pt of heatmapPoints) {
      const x = pt.x * scaleX;
      const y = pt.y * scaleY;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, 'rgba(255, 200, 0, 0.12)');
      grad.addColorStop(0.5, 'rgba(255, 100, 0, 0.06)');
      grad.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
  }, [heatmapPoints, canvasSize]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap first (underneath boxes)
    if (showHeatmap) {
      drawHeatmap(ctx);
    }

    if (!showOverlays || currentBoxes.size === 0) return;

    const scaleX = canvasSize.w / 100;
    const scaleY = canvasSize.h / 100;

    for (const [, t] of currentBoxes) {
      const color = getColorForTrackingId(t.tracking_id, allTrackingIds);
      const x = t.bbox_x * scaleX;
      const y = t.bbox_y * scaleY;
      const w = t.bbox_width * scaleX;
      const h = t.bbox_height * scaleY;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = color.replace(')', ', 0.1)').replace('hsl', 'hsla');
      ctx.fillRect(x, y, w, h);

      const name = t.player_id ? playerMap.get(t.player_id) : null;
      const label = name || `Track ${t.tracking_id.slice(0, 4)}`;

      ctx.font = `bold ${Math.max(11, canvas.width / 80)}px Inter, sans-serif`;
      const textWidth = ctx.measureText(label).width;
      const labelH = 18;

      ctx.fillStyle = color;
      ctx.fillRect(x, y - labelH - 2, textWidth + 10, labelH);
      ctx.fillStyle = '#000';
      ctx.fillText(label, x + 5, y - 6);
    }

    if (isTagging) {
      ctx.strokeStyle = 'hsla(45, 100%, 58%, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
    }
  }, [currentBoxes, showOverlays, showHeatmap, drawHeatmap, playerMap, allTrackingIds, isTagging, canvasSize]);

  useEffect(() => { draw(); }, [draw]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        setCanvasSize({ w: width, h: height });
      }
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { draw(); }, [canvasSize, draw]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCanvasClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onCanvasClick(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${isTagging ? 'cursor-crosshair' : 'pointer-events-none'}`}
      onClick={handleClick}
    />
  );
}
