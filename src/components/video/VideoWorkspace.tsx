import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MatchVideo } from '@/hooks/useMatchVideos';
import { useVideoEvents } from '@/hooks/useVideoEvents';
import { useVideoAnnotations } from '@/hooks/useVideoAnnotations';
import { useVideoStats } from '@/hooks/useVideoStats';
import { usePlayers } from '@/hooks/usePlayers';
import VideoPlayer, { VideoPlayerHandle } from './VideoPlayer';
import VideoTimeline from './VideoTimeline';
import EventTagger from './EventTagger';
import EventsList from './EventsList';
import VideoStatsPanel from './VideoStatsPanel';
import AnnotationsPanel from './AnnotationsPanel';

interface Props {
  video: MatchVideo;
  onBack: () => void;
}

export default function VideoWorkspace({ video, onBack }: Props) {
  const playerRef = useRef<VideoPlayerHandle>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoSrc, setVideoSrc] = useState('');

  const { data: events = [] } = useVideoEvents(video.id);
  const { data: annotations = [] } = useVideoAnnotations(video.id);
  const { data: playersRaw = [] } = usePlayers();
  const players = playersRaw.map(p => ({ id: p.id, name: p.name }));
  const stats = useVideoStats(events, players);

  useEffect(() => {
    supabase.storage.from('match-videos').createSignedUrl(video.video_url, 3600).then(({ data, error }) => {
      if (data?.signedUrl) {
        setVideoSrc(data.signedUrl);
      } else {
        // Fallback to public URL
        const { data: pub } = supabase.storage.from('match-videos').getPublicUrl(video.video_url);
        if (pub?.publicUrl) setVideoSrc(pub.publicUrl);
      }
    });
  }, [video.video_url]);

  const seekTo = (t: number) => playerRef.current?.seekTo(t);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h2 className="text-lg font-display font-bold">{video.title}</h2>
          <p className="text-xs text-muted-foreground">
            {video.team}{video.opponent ? ` vs ${video.opponent}` : ''} · {video.match_date ? new Date(video.match_date).toLocaleDateString() : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Left: Video + Timeline + Tagger */}
        <div className="space-y-3">
          {videoSrc && <VideoPlayer ref={playerRef} src={videoSrc} onTimeUpdate={setCurrentTime} onDurationChange={setDuration} />}
          <VideoTimeline duration={duration} currentTime={currentTime} events={events} onSeek={seekTo} />
          <EventTagger videoId={video.id} currentTime={currentTime} players={players} />
        </div>

        {/* Right: Tabs */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Tabs defaultValue="events">
            <TabsList className="w-full rounded-none border-b border-border bg-secondary/30">
              <TabsTrigger value="events" className="flex-1 text-xs">Events ({events.length})</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 text-xs">Stats</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1 text-xs">Notes ({annotations.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="m-0">
              <EventsList events={events} players={players} onSeek={seekTo} />
            </TabsContent>
            <TabsContent value="stats" className="m-0">
              <VideoStatsPanel stats={stats} />
            </TabsContent>
            <TabsContent value="notes" className="m-0">
              <AnnotationsPanel videoId={video.id} currentTime={currentTime} annotations={annotations} onSeek={seekTo} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
