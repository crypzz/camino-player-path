// Simple SVG top-down pitch with position density + touch map.
// Expects normalized 0-100 coordinates.

type Pt = { x: number; y: number };

export function PlayerHeatmap({ points, touches }: { points: Pt[]; touches: Pt[] }) {
  return (
    <svg viewBox="0 0 100 60" className="w-full rounded-md bg-emerald-900/30 border border-emerald-600/30">
      {/* pitch lines */}
      <rect x="0.5" y="0.5" width="99" height="59" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
      <line x1="50" y1="0.5" x2="50" y2="59.5" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
      <circle cx="50" cy="30" r="7" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
      <rect x="0.5" y="15" width="14" height="30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
      <rect x="85.5" y="15" width="14" height="30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />

      {/* heatmap dots */}
      {points?.map((p, i) => (
        <circle key={`h${i}`} cx={p.x} cy={p.y} r="1.6" fill="hsl(45 100% 60%)" opacity="0.15" />
      ))}
      {/* touches */}
      {touches?.map((p, i) => (
        <circle key={`t${i}`} cx={p.x} cy={p.y} r="0.9" fill="hsl(215 95% 60%)" opacity="0.9" />
      ))}
    </svg>
  );
}
