import { useParams } from 'react-router-dom';
import { usePublicPlayer } from '@/hooks/usePublicPlayer';
import { useRankings } from '@/hooks/useRankings';
import { usePlayerLevel } from '@/hooks/usePlayerLevel';
import { calculateCPI, getCategoryAverage } from '@/types/player';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { RankingBadge } from '@/components/RankingBadge';
import { PlayerLevelBadge } from '@/components/PlayerLevelBadge';
import { ShareableStatCard } from '@/components/ShareableStatCard';
import { PlayerPostsGrid } from '@/components/PlayerPostsGrid';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Ruler, Weight, Footprints, Lock, Share2, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading } = usePublicPlayer(id);
  const { data: rankings = [] } = useRankings();
  const { data: level } = usePlayerLevel(player);

  const rank = rankings.find(r => r.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-muted-foreground text-sm">This profile is private or doesn't exist.</p>
        <a href="/" className="text-xs text-primary hover:underline">← Back to Camino</a>
      </div>
    );
  }

  const cpi = calculateCPI(player);
  const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const stats = [
    { label: 'Technical', value: getCategoryAverage(player.technical) },
    { label: 'Tactical', value: getCategoryAverage(player.tactical) },
    { label: 'Physical', value: getCategoryAverage(player.physical) },
    { label: 'Mental', value: getCategoryAverage(player.mental) },
  ];

  // CPI trend
  const history = player.cpiHistory || [];
  const latestCpi = history.length > 0 ? history[history.length - 1].score : cpi;
  const prevCpi = history.length > 1 ? history[history.length - 2].score : null;
  const cpiDelta = prevCpi !== null ? latestCpi - prevCpi : 0;

  const handleShareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${player.name} — Camino Player Profile`,
          text: `Check out ${player.name}'s performance profile on Camino`,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-6 pb-12">
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
                    {!player.isPublic && (
                      <Badge variant="outline" className="text-[10px]"><Lock className="h-2.5 w-2.5 mr-1" />Private</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[13px] text-muted-foreground flex-wrap">
                    <span>{player.position}</span>
                    <span>·</span>
                    <span>{player.team}</span>
                    <span>·</span>
                    <span>Age {player.age}</span>
                    {player.location && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{player.location}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {rank && (
                      <RankingBadge
                        globalRank={rank.globalRank}
                        localRank={rank.localRank}
                        ageGroup={rank.age_group}
                        location={rank.location}
                      />
                    )}
                    {level && <PlayerLevelBadge level={level} size="sm" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleShareProfile} variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-3.5 w-3.5" />
                    Share Profile
                  </Button>
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

        {/* CPI + Trend + Level */}
        <div className="grid gap-5 md:grid-cols-[240px_1fr]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="space-y-4">
            <Card className="p-4">
              <CPIScoreDisplay player={player} size="md" />
            </Card>
            {level && (
              <Card className="p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Player Level</p>
                <PlayerLevelBadge level={level} size="md" showProgress />
                <p className="text-[10px] text-muted-foreground mt-2">
                  {level.level < 10 ? `${level.progress}% to next level` : 'Max level reached'}
                </p>
              </Card>
            )}
          </motion.div>
          <div className="space-y-4">
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
            {/* Trend indicator */}
            {history.length >= 2 && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">CPI Trend</p>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${cpiDelta > 0 ? 'text-success' : cpiDelta < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {cpiDelta > 0 ? <TrendingUp className="h-4 w-4" /> : cpiDelta < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    {cpiDelta > 0 ? '+' : ''}{cpiDelta.toFixed(1)} pts
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="skills">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="card">Share Card</TabsTrigger>
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

          <TabsContent value="card" className="mt-4">
            <div className="flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-4">Screenshot or share this card on social media</p>
              {level && (
                <ShareableStatCard
                  player={player}
                  level={level}
                  globalRank={rank?.globalRank}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="posts" className="mt-4">
            <PlayerPostsGrid playerId={player.id} />
          </TabsContent>
        </Tabs>

        {/* Built on Camino footer */}
        <div className="text-center pt-4 border-t border-border/50">
          <a href="/" className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            <span className="font-display font-bold tracking-tight">CAMINO</span>
            <span>· The Pathway to Elite Football</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
