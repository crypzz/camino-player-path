import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

const items = [
  { name: 'Marcus J.', cpi: 87, delta: '+2.4', up: true },
  { name: 'Liam K.', cpi: 82, delta: '+1.1', up: true },
  { name: 'Diego R.', cpi: 91, delta: '+0.8', up: true },
  { name: 'Tariq O.', cpi: 76, delta: '-0.5', up: false },
  { name: 'Sofia M.', cpi: 84, delta: '+3.2', up: true },
  { name: 'Noah P.', cpi: 79, delta: '+1.6', up: true },
  { name: 'Kai L.', cpi: 88, delta: '+0.4', up: true },
  { name: 'Ezra V.', cpi: 73, delta: '+2.9', up: true },
];

export function LiveTickerBar() {
  const loop = [...items, ...items, ...items];
  return (
    <div className="relative w-full overflow-hidden border-y border-border/50 bg-card/40 backdrop-blur-sm py-3">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex items-center gap-2 mb-2 px-6">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" /> Live CPI Updates
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
      </div>
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {loop.map((item, i) => (
          <div key={i} className="inline-flex items-center gap-2.5 text-sm">
            <span className="font-medium text-foreground">{item.name}</span>
            <span className="font-display font-bold text-primary">{item.cpi}</span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${item.up ? 'text-success' : 'text-destructive'}`}>
              {item.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {item.delta}
            </span>
            <span className="text-muted-foreground/40">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
