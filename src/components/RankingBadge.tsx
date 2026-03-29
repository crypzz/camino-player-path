import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  globalRank: number;
  localRank?: number;
  ageGroup?: string;
  location?: string;
  size?: 'sm' | 'md';
}

export function RankingBadge({ globalRank, localRank, ageGroup, location, size = 'md' }: Props) {
  const localLabel = localRank && ageGroup && location
    ? `#${localRank} ${ageGroup} in ${location}`
    : null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant="outline" className={`bg-primary/10 border-primary/30 text-primary ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'}`}>
        <Trophy className={`${size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} mr-1`} />
        #{globalRank} Global
      </Badge>
      {localLabel && (
        <Badge variant="outline" className={`bg-accent/50 border-accent text-accent-foreground ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'}`}>
          {localLabel}
        </Badge>
      )}
    </div>
  );
}
