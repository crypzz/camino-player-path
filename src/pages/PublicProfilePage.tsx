import { useParams } from 'react-router-dom';
import { usePublicPlayer } from '@/hooks/usePublicPlayer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading } = usePublicPlayer(id);

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
        <a href="/" className="text-xs text-primary hover:underline">← Back to Camino</a>
      </div>
    );
  }

  const initials = (player.team || 'CP').slice(0, 2).toUpperCase();

  const handleShareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Camino Player Profile', text: 'Check out this player profile on Camino', url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 max-w-2xl mx-auto px-4 py-6 pb-12">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent h-24" />
            <CardContent className="relative -mt-12 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <Avatar className="h-20 w-20 border-4 border-card">
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    {player.position && <Badge variant="secondary">{player.position}</Badge>}
                    {player.team && <span>{player.team}</span>}
                    {player.age_group && (
                      <>
                        <span>·</span>
                        <span>{player.age_group}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {player.preferred_foot && (
                      <Badge variant="outline" className="text-[10px]">{player.preferred_foot} foot</Badge>
                    )}
                  </div>
                </div>
                <Button onClick={handleShareProfile} variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
              </div>

              {/* Rating */}
              {player.overall_rating != null && player.overall_rating > 0 && (
                <div className="mt-6 text-center">
                  <p className="text-4xl font-bold text-primary">{Math.round(player.overall_rating)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Overall Rating</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground">
          Sign in to view the full player profile including skills, progress, and more.
        </p>

        {/* Footer */}
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
