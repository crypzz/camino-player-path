import { useRef, useEffect, useCallback, useState } from 'react';
import { PlayerTracking } from '@/hooks/usePlayerTracking';

interface Props {
  tracking: PlayerTracking[];
  currentTime: number;
  players: { id: string; name: string }[];
  videoWidth: number;
  videoHeight: number;
  showOverlays: boolean;
  onCanvasClick?: (x: number, y: number) => void;
  isTagging?: boolean;
}

const TRACKING_COLORS = [
  'hsl(45, 100%, 58%)',   // gold
  'hsl(215, 95%, 58%)',   // blue
  'hsl(160, 72%, 42%)',   // green
  'hsl(0, 72%, 51%)',     // red
  'hsl(280, 70%, 60%)',   // purple
  'hsl(30, 95%, 52%)',    // orange
  'hsl(180, 70%, 50%)',   // cyan
  'hsl(340, 80%, 55%)',   // pink
];

function getColorForTrackingId(trackingId: string, allIds: string[]): string {
  const idx = allIds.indexOf(trackingId);
  return TRACKING_COLORS[idx % TRACKING_COLORS.length];
}

export default function VideoOverlayCanvas({
  tracking,
  currentTime,
  players,
  videoWidth,
  videoHeight,
  showOverlays,
  onCanvasClick,
  isTagging,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  // Get all unique tracking IDs for color assignment
  const allTrackingIds = [...new Set(tracking.map(t => t.tracking_id))];

  // Find tracking entries near current time (within 0.5s window)
  const visibleTracks = tracking.filter(
    t => Math.abs(t.timestamp_seconds - currentTime) < 0.5
  );

  // Group by tracking_id, pick closest frame
  const currentBoxes = new Map<string, PlayerTracking>();
  for (const t of visibleTracks) {
    const existing = currentBoxes.get(t.tracking_id);
    if (!existing || Math.abs(t.timestamp_seconds - currentTime) < Math.abs(existing.timestamp_seconds - currentTime)) {
      currentBoxes.set(t.tracking_id, t);
    }
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!showOverlays) return;

    const scaleX = canvas.width / 100;
    const scaleY = canvas.height / 100;

    for (const [, t] of currentBoxes) {
      const color = getColorForTrackingId(t.tracking_id, allTrackingIds);
      const x = t.bbox_x * scaleX;
      const y = t.bbox_y * scaleY;
      const w = t.bbox_width * scaleX;
      const h = t.bbox_height * scaleY;

      // Bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Semi-transparent fill
      ctx.fillStyle = color.replace(')', ', 0.1)').replace('hsl', 'hsla');
      ctx.fillRect(x, y, w, h);

      // Label
      const player = t.player_id ? players.find(p => p.id === t.player_id) : null;
      const label = player?.name || `Track ${t.tracking_id.slice(0, 4)}`;

      ctx.font = `bold ${Math.max(11, canvas.width / 80)}px Inter, sans-serif`;
      const textWidth = ctx.measureText(label).width;
      const labelH = 18;

      // Label background
      ctx.fillStyle = color;
      ctx.fillRect(x, y - labelH - 2, textWidth + 10, labelH);

      // Label text
      ctx.fillStyle = '#000';
      ctx.fillText(label, x + 5, y - 6);
    }

    // Tagging crosshair
    if (isTagging) {
      ctx.strokeStyle = 'hsla(45, 100%, 58%, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
    }
  }, [currentBoxes, showOverlays, players, allTrackingIds, isTagging]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        setCanvasSize({ w: width, h: height });
      }
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  // Redraw when canvasSize changes
  useEffect(() => {
    draw();
  }, [canvasSize, draw]);

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
