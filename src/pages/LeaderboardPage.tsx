import { useState } from 'react';
import { useRankings } from '@/hooks/useRankings';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { PlayerOfTheWeek } from '@/components/PlayerOfTheWeek';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CANADIAN_CITIES, AGE_GROUPS } from '@/lib/constants';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [ageGroup, setAgeGroup] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const { data: players = [], isLoading } = useRankings({
    ageGroup: ageGroup || undefined,
    location: location || undefined,
  });

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground text-[13px] mt-0.5">Player rankings by CPI score</p>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <Select value={ageGroup} onValueChange={v => setAgeGroup(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                {AGE_GROUPS.map(ag => (
                  <SelectItem key={ag} value={ag}>{ag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={v => setLocation(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {CANADIAN_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Leaderboard */}
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground text-sm">Loading rankings...</div>
          ) : (
            <LeaderboardTable players={players} />
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <PlayerOfTheWeek />
        </div>
      </div>
    </div>
  );
}
