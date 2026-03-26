import { usePlayers } from '@/hooks/usePlayers';
import { motion } from 'framer-motion';
import { Video, Play, MessageSquare, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const typeColors: Record<string, string> = {
  match: 'bg-primary/20 text-primary border-primary/30',
  training: 'bg-info/20 text-info border-info/30',
  highlight: 'bg-success/20 text-success border-success/30',
};

export default function VideoAnalysisPage() {
  const { data: players = [], isLoading } = usePlayers();
  const [filter, setFilter] = useState<string>('all');

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  const allVideos = players.flatMap(p => p.videos.map(v => ({ ...v, playerName: p.name, playerId: p.id })));
  const filtered = filter === 'all' ? allVideos : allVideos.filter(v => v.type === filter);

  if (allVideos.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground">Video Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">No video clips available yet.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Video Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">Match footage, training clips, and player highlights</p>
      </motion.div>

      <div className="flex gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Videos</SelectItem>
            <SelectItem value="match">Match Footage</SelectItem>
            <SelectItem value="training">Training Clips</SelectItem>
            <SelectItem value="highlight">Highlights</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
          >
            <div className="h-40 bg-secondary relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors z-10">
                <Play className="h-6 w-6 text-primary ml-1" />
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                <Badge variant="outline" className={typeColors[video.type]}>{video.type}</Badge>
                <span className="text-xs text-foreground/80 bg-background/50 px-2 py-0.5 rounded">{video.duration}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1 truncate">{video.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{video.playerName} · {new Date(video.date).toLocaleDateString()}</p>
              
              <div className="flex items-center gap-1 mb-2 flex-wrap">
                <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                {video.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{tag}</span>
                ))}
              </div>

              {video.coachComment && (
                <div className="flex items-start gap-2 mt-2 pt-2 border-t border-border/50">
                  <MessageSquare className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground italic">"{video.coachComment}"</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
