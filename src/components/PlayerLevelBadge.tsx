import { PlayerLevel } from '@/lib/playerLevel';
import { Shield } from 'lucide-react';

interface Props {
  level: PlayerLevel;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function PlayerLevelBadge({ level, size = 'md', showProgress = false }: Props) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSize = { sm: 'h-2.5 w-2.5', md: 'h-3.5 w-3.5', lg: 'h-4 w-4' };

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center rounded-full border font-semibold ${level.bgClass} ${level.borderClass} ${level.textClass} ${sizeClasses[size]}`}
      >
        <Shield className={iconSize[size]} />
        <span>Lvl {level.level}</span>
        <span className="opacity-60">·</span>
        <span>{level.tier}</span>
      </div>
      {showProgress && level.level < 10 && (
        <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${level.progress}%`, backgroundColor: level.color }}
          />
        </div>
      )}
    </div>
  );
}
