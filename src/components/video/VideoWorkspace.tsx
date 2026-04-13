import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MatchVideo } from '@/hooks/useMatchVideos';
import { useVideoEvents } from '@/hooks/useVideoEvents';
import { useVideoAnnotations } from '@/hooks/useVideoAnnotations';
import { useVideoStats } from '@/hooks/useVideoStats';
import { usePlayerTracking } from '@/hooks/usePlayerTracking';
import { useMatchPlayerStats, useUpsertMatchPlayerStats } from '@/hooks/useMatchPlayerStats';
import { usePlayers } from '@/hooks/usePlayers';
import { computePlayerStats } from '@/lib/videoStatsEngine';
import VideoPlayer, { VideoPlayerHandle } from './VideoPlayer';
import VideoOverlayCanvas from './VideoOverlayCanvas';
import VideoTimeline from './VideoTimeline';
import EventTagger from './EventTagger';
import EventsList from './EventsList';
import VideoStatsPanel from './VideoStatsPanel';
import AnnotationsPanel from './AnnotationsPanel';
import PlayerTaggingPanel from './PlayerTaggingPanel';
import MatchAnalyticsDashboard from './MatchAnalyticsDashboard';
import ProcessingStatusBadge from './ProcessingStatusBadge';
import { toast } from 'sonner';

interface Props {
  video: MatchVideo;
  onBack: () => void;
}

export default function VideoWorkspace({ video, onBack }: Props) {
  const playerRef = useRef<VideoPlayerHandle>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoSrc, setVideoSrc] = useState('');
  const [showOverlays, setShowOverlays] = useState(true);
  const [isTagging, setIsTagging] = useState(false);
  const [pendingTag, setPendingTag] = useState<{ x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState('events');

  const { data: events = [] } = useVideoEvents(video.id);
  const { data: annotations = [] } = useVideoAnnotations(video.id);
  const { data: tracking = [] } = usePlayerTracking(video.id);
  const { data: matchStats = [] } = useMatchPlayerStats(video.id);
  const { data: playersRaw = [] } = usePlayers();

  const players = useMemo(
    () => playersRaw.map(p => ({ id: p.id, name: p.name })),
    [playersRaw]
  );

  const stats = useVideoStats(events, players);
  const upsertStats = useUpsertMatchPlayerStats();

  // Cache signed URL — only regenerate when video changes
  useEffect(() => {
    let cancelled = false;
    const getUrl = async () => {
      const { data } = await supabase.storage.from('match-videos').createSignedUrl(video.video_url, 7200);
      if (cancelled) return;
      if (data?.signedUrl) {
        setVideoSrc(data.signedUrl);
      } else {
        const { data: pub } = supabase.storage.from('match-videos').getPublicUrl(video.video_url);
        if (pub?.publicUrl && !cancelled) setVideoSrc(pub.publicUrl);
      }
    };
    getUrl();
    return () => { cancelled = true; };
  }, [video.video_url]);

  const handleTimeUpdate = useCallback((t: number) => setCurrentTime(t), []);
  const handleDurationChange = useCallback((d: number) => setDuration(d), []);
  const seekTo = useCallback((t: number) => playerRef.current?.seekTo(t), []);

  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (isTagging) {
      playerRef.current?.seekTo(currentTime);
      setPendingTag({ x, y });
    }
  }, [isTagging, currentTime]);

  const handleGenerateStats = async () => {
    if (tracking.length === 0 && events.length === 0) {
      toast.error('Tag some players or events first');
      return;
    }

    const computed = computePlayerStats(tracking, events, duration);

    try {
      for (const s of computed) {
        await upsertStats.mutateAsync({
          video_id: video.id,
          player_id: s.playerId,
          movement_intensity: s.movementIntensity,
          activity_score: s.activityScore,
          estimated_touches: s.estimatedTouches,
          time_on_field: s.timeOnField,
          positions_tracked: s.positionsTracked,
          sprint_count: s.sprintCount,
          avg_speed: s.avgSpeed,
          distance_covered: s.distanceCovered,
          heatmap_data: s.heatmapData,
        });
      }
      toast.success(`Stats generated for ${computed.length} players`);
      setActiveTab('analytics');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate stats');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            {video.title}
            <ProcessingStatusBadge status={(video as any).status || 'ready'} />
          </h2>
          <p className="text-xs text-muted-foreground">
            {video.team}{video.opponent ? ` vs ${video.opponent}` : ''} · {video.match_date ? new Date(video.match_date).toLocaleDateString() : ''}
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={handleGenerateStats} disabled={upsertStats.isPending}>
          <Wand2 className="h-3.5 w-3.5" />
          {upsertStats.isPending ? 'Generating...' : 'Generate Stats'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* Left: Video + Timeline + Tagger */}
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black">
            {videoSrc && (
              <VideoPlayer
                ref={playerRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
              />
            )}
            <VideoOverlayCanvas
              tracking={tracking}
              currentTime={currentTime}
              players={players}
              videoWidth={1920}
              videoHeight={1080}
              showOverlays={showOverlays}
              onCanvasClick={handleCanvasClick}
              isTagging={isTagging}
            />
          </div>
          <VideoTimeline duration={duration} currentTime={currentTime} events={events} onSeek={seekTo} />
          <EventTagger videoId={video.id} currentTime={currentTime} players={players} />
        </div>

        {/* Right: Tabs */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-none border-b border-border bg-secondary/30 h-auto flex-wrap">
              <TabsTrigger value="events" className="flex-1 text-[10px] py-2">Events ({events.length})</TabsTrigger>
              <TabsTrigger value="tracking" className="flex-1 text-[10px] py-2">Tracking</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 text-[10px] py-2">Stats</TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1 text-[10px] py-2">
                <BarChart3 className="h-3 w-3 mr-1" />Analytics
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1 text-[10px] py-2">Notes ({annotations.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="m-0">
              <EventsList events={events} players={players} onSeek={seekTo} />
            </TabsContent>
            <TabsContent value="tracking" className="m-0">
              <PlayerTaggingPanel
                videoId={video.id}
                currentTime={currentTime}
                players={players}
                tracking={tracking}
                showOverlays={showOverlays}
                onToggleOverlays={() => setShowOverlays(!showOverlays)}
                isTagging={isTagging}
                onToggleTagging={() => setIsTagging(!isTagging)}
                pendingTag={pendingTag}
                onClearPendingTag={() => setPendingTag(null)}
              />
            </TabsContent>
            <TabsContent value="stats" className="m-0">
              <VideoStatsPanel stats={stats} events={events} />
            </TabsContent>
            <TabsContent value="analytics" className="m-0">
              <MatchAnalyticsDashboard stats={matchStats} players={players} />
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
