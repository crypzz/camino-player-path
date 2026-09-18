import { useParams, Link } from 'react-router-dom';
import {
  useDiscoverPlayer,
  usePlayerFollowers,
  useToggleFollow,
  usePlayerAttributes,
  usePlayerCoachComments,
  usePlayerPublishedCV,
} from '@/hooks/usePlayerDiscovery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ExternalLink, Share2, ShieldCheck, ArrowLeftRight, MapPin, Star, Trophy, Heart, Users,
  MessageSquareQuote, FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

function initials(name: string | null) {
  if (!name) return 'CP';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function AttributeBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground/70">{label}</span>
        <span className="text-sm font-semibold text-foreground tabular-nums">{value.toFixed(1)}</span>
      </div>
      <Progress value={value * 10} className="h-1.5" />
    </div>
  );
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading } = useDiscoverPlayer(id);
  const { data: followers } = usePlayerFollowers(id);
  const { data: attributes } = usePlayerAttributes(id);
  const { data: comments } = usePlayerCoachComments(id, 3);
  const { data: cv } = usePlayerPublishedCV(id);
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

  const commentCards = (comments ?? [])
    .map((c) => ({
      id: c.id,
      created_at: c.created_at as string,
      text: (c.strengths || c.notes || c.improvements || '') as string,
      tag: c.strengths ? 'Strength' : c.improvements ? 'Focus area' : 'Note',
    }))
    .filter((c) => c.text.trim().length > 0)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 max-w-3xl mx-auto px-4 py-6 pb-20">
        <Link to="/discover" className="text-[11px] text-muted-foreground hover:text-foreground">← Browse players</Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-border/60">
            <div className="relative bg-gradient-to-br from-primary/30 via-primary/10 to-transparent h-32">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]" />
            </div>
            <CardContent className="relative -mt-16 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                  {player.avatar && <AvatarImage src={player.avatar} alt={player.name ?? ''} />}
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                    {initials(player.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-3xl font-display font-bold tracking-tight text-foreground truncate">
                      {player.name ?? 'Player'}
                    </h1>
                    {player.verification_badge && <ShieldCheck className="h-5 w-5 text-success shrink-0" />}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-[13px] text-muted-foreground">
                    {player.position && <Badge variant="secondary">{player.position}</Badge>}
                    {player.team && <span>{player.team}</span>}
                    {player.age_group && <span>· {player.age_group}</span>}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-[11px] text-muted-foreground">
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

              <div className="flex items-center gap-2 mt-6">
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

        {/* Main attributes */}
        {attributes && (
          <Card>
            <CardContent className="py-5">
              <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-4 inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-primary" />Main attributes
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {attributes.technical != null && <AttributeBar label="Technical" value={attributes.technical} />}
                {attributes.tactical != null && <AttributeBar label="Tactical" value={attributes.tactical} />}
                {attributes.physical != null && <AttributeBar label="Physical" value={attributes.physical} />}
                {attributes.mental != null && <AttributeBar label="Mental" value={attributes.mental} />}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coach comments */}
        {commentCards.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-[10px] uppercase tracking-widest text-muted-foreground/70 inline-flex items-center gap-1">
              <MessageSquareQuote className="h-3 w-3 text-primary" />Coach comments
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {commentCards.map((c) => (
                <Card key={c.id} className="bg-secondary/30 border-border/60">
                  <CardContent className="py-4 space-y-2">
                    <Badge variant="outline" className="text-[10px]">{c.tag}</Badge>
                    <p className="text-[13px] leading-relaxed text-foreground/90 line-clamp-5">"{c.text}"</p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Player CV */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Player CV</p>
                <p className="text-[12px] text-muted-foreground">
                  {cv?.slug
                    ? 'Full football CV with history, achievements and highlights.'
                    : 'This player hasn’t published a CV yet.'}
                </p>
              </div>
            </div>
            <Button asChild={!!cv?.slug} size="sm" disabled={!cv?.slug} className="gap-1.5 shrink-0">
              {cv?.slug ? (
                <Link to={`/cv/${cv.slug}`}>
                  View CV<ExternalLink className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span>View CV</span>
              )}
            </Button>
          </CardContent>
        </Card>

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
