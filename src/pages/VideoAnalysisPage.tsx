import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Plus, Play, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatchVideos, MatchVideo } from '@/hooks/useMatchVideos';
import VideoUploadDialog from '@/components/video/VideoUploadDialog';
import VideoWorkspace from '@/components/video/VideoWorkspace';
import ProcessingStatusBadge from '@/components/video/ProcessingStatusBadge';
import { getVideoDisplayStatus } from '@/lib/videoProcessing';

const typeColors: Record<string, string> = {
  match: 'bg-primary/20 text-primary border-primary/30',
  training: 'bg-info/20 text-info border-info/30',
  highlight: 'bg-success/20 text-success border-success/30',
};

export default function VideoAnalysisPage() {
  const [filter, setFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<MatchVideo | null>(null);
  const { data: videos = [], isLoading } = useMatchVideos(filter);

  if (activeVideo) {
    return <VideoWorkspace video={activeVideo} onBack={() => setActiveVideo(null)} />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" /> Video Intelligence
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Upload, track players, generate stats, and analyze match footage</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Upload Video
        </Button>
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : videos.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-1">No videos yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Upload your first match video to start analyzing</p>
          <Button onClick={() => setUploadOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Upload Video</Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => setActiveVideo(v)}
            >
              <div className="h-40 bg-secondary relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors z-10">
                  <Play className="h-6 w-6 text-primary ml-1" />
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <ProcessingStatusBadge status={getVideoDisplayStatus(v)} />
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                  <Badge variant="outline" className={typeColors[v.type] || typeColors.match}>{v.type}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground text-sm mb-1 truncate">{v.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {v.match_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(v.match_date).toLocaleDateString()}</span>}
                  {v.team && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{v.team}{v.opponent ? ` vs ${v.opponent}` : ''}</span>}
                </div>
                {v.notes && <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{v.notes}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <VideoUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
