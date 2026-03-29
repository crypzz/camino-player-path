import { useParams } from 'react-router-dom';
import { usePlayers } from '@/hooks/usePlayers';
import { useRankings } from '@/hooks/useRankings';
import { calculateCPI, getCategoryAverage } from '@/types/player';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { RankingBadge } from '@/components/RankingBadge';
import { ShareCardDialog } from '@/components/ShareCardDialog';
import { PlayerPostsGrid } from '@/components/PlayerPostsGrid';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Ruler, Weight, Footprints, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: players = [], isLoading } = usePlayers();
  const { data: rankings = [] } = useRankings();

  const player = players.find(p => p.id === id);
  const rank = rankings.find(r => r.id === id);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  if (!player) {
    return <div className="text-center py-20 text-muted-foreground">Player not found</div>;
  }

  const cpi = calculateCPI(player);
  const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const stats = [
    { label: 'Technical', value: getCategoryAverage(player.technical) },
    { label: 'Tactical', value: getCategoryAverage(player.tactical) },
    { label: 'Physical', value: getCategoryAverage(player.physical) },
    { label: 'Mental', value: getCategoryAverage(player.mental) },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent h-24" />
          <CardContent className="relative -mt-12 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-card">
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-display font-bold text-foreground">{player.name}</h1>
                  {!(player as any).is_public && (
                    <Badge variant="outline" className="text-[10px]"><Lock className="h-2.5 w-2.5 mr-1" />Private</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[13px] text-muted-foreground flex-wrap">
                  <span>{player.position}</span>
                  <span>·</span>
                  <span>{player.team}</span>
                  <span>·</span>
                  <span>Age {player.age}</span>
                  {(player as any).location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{(player as any).location}</span>
                    </>
                  )}
                </div>
                {rank && (
                  <div className="mt-2">
                    <RankingBadge
                      globalRank={rank.globalRank}
                      localRank={rank.localRank}
                      ageGroup={rank.age_group}
                      location={rank.location}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {rank && <ShareCardDialog player={rank} cpiScore={cpi} />}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Joined {player.joinDate}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Ruler className="h-3.5 w-3.5" />
                {player.height} cm
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Weight className="h-3.5 w-3.5" />
                {player.weight} kg
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Footprints className="h-3.5 w-3.5" />
                {player.preferredFoot} foot
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CPI + Ratings */}
      <div className="grid gap-5 md:grid-cols-[240px_1fr]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="p-4">
            <CPIScoreDisplay player={player} size="md" />
          </Card>
        </motion.div>
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="skills">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {(['technical', 'tactical', 'physical', 'mental'] as const).map(cat => (
              <Card key={cat} className="p-4">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 capitalize">{cat}</h3>
                <PlayerRadarChart player={player} category={cat} />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card className="p-4">
            <CPIProgressChart player={player} />
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <PlayerPostsGrid playerId={player.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
