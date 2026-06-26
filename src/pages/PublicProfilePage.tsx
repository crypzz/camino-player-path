import { useParams, Link } from 'react-router-dom';
import { useDiscoverPlayer, usePlayerFollowers, useToggleFollow } from '@/hooks/usePlayerDiscovery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink, Share2, ShieldCheck, ArrowLeftRight, MapPin, Star, Trophy, Heart, Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

function initials(name: string | null) {
  if (!name) return 'CP';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading } = useDiscoverPlayer(id);
  const { data: followers } = usePlayerFollowers(id);
  const toggleFollow = useToggleFollow(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!player || !player.is_public) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-muted-foreground text-sm">This profile is private or doesn't exist.</p>
        <Link to="/discover" className="text-xs text-primary hover:underline">← Browse players</Link>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${player.name} · Camino`, text: 'Check out this player on Camino', url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-5 max-w-2xl mx-auto px-4 py-6 pb-16">
        <Link to="/discover" className="text-[11px] text-muted-foreground hover:text-foreground">← Browse players</Link>

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/25 via-primary/5 to-transparent h-28" />
            <CardContent className="relative -mt-14 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-card">
                  {player.avatar && <AvatarImage src={player.avatar} alt={player.name ?? ''} />}
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials(player.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-display font-bold tracking-tight text-foreground truncate">
                      {player.name ?? 'Player'}
                    </h1>
                    {player.verification_badge && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-success font-medium">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground flex-wrap">
                    {player.position && <Badge variant="secondary">{player.position}</Badge>}
                    {player.team && <span className="text-[13px]">{player.team}</span>}
                    {player.age_group && <span className="text-[13px]">· {player.age_group}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] text-muted-foreground">
                    {player.location && (
                      <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{player.location}</span>
                    )}
                    {player.preferred_foot && (
                      <Badge variant="outline" className="text-[10px]">{player.preferred_foot} foot</Badge>
                    )}
                    {player.available_for_transfer && (
                      <Badge className="text-[10px] gap-0.5 bg-primary/15 text-primary border-0">
                        <ArrowLeftRight className="h-3 w-3" />Available for transfer
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-5">
                <Button
                  onClick={() => toggleFollow.mutate(!!followers?.isFollowing)}
                  disabled={toggleFollow.isPending}
                  variant={followers?.isFollowing ? 'secondary' : 'default'}
                  size="sm"
                  className="gap-1.5 flex-1"
                >
                  <Heart className={`h-3.5 w-3.5 ${followers?.isFollowing ? 'fill-current' : ''}`} />
                  {followers?.isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button onClick={handleShare} variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="h-3.5 w-3.5" />Share
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="rounded-lg bg-secondary/50 py-3 text-center">
                  <p className="text-2xl font-bold text-primary leading-none">
                    {player.overall_rating != null && player.overall_rating > 0 ? Math.round(player.overall_rating) : '—'}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Overall</p>
                </div>
                <div className="rounded-lg bg-secondary/50 py-3 text-center">
                  <p className="text-2xl font-bold text-foreground leading-none">{followers?.count ?? 0}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 inline-flex items-center gap-0.5 justify-center">
                    <Users className="h-2.5 w-2.5" />Followers
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/50 py-3 text-center">
                  <p className="text-2xl font-bold text-foreground leading-none">{player.age ?? '—'}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Age</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {player.bio && (
          <Card>
            <CardContent className="py-4">
              <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-2">About</h2>
              <p className="text-sm text-foreground/90 leading-relaxed">{player.bio}</p>
            </CardContent>
          </Card>
        )}

        {player.strengths && player.strengths.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-3 inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-primary" />Strengths
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {player.strengths.map((s, i) => (
                  <Badge key={i} variant="secondary">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {player.achievements && player.achievements.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-3 inline-flex items-center gap-1">
                <Trophy className="h-3 w-3 text-primary" />Achievements
              </h2>
              <ul className="space-y-1.5">
                {player.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Trophy className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {player.verification_badge && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-success">
            <ShieldCheck className="h-4 w-4" />Performance data verified by Camino
          </div>
        )}

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
