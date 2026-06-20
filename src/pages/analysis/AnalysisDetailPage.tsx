import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft, RefreshCw, Tag, Loader2, UserPlus, BarChart3, Users, Video,
} from "lucide-react";
import {
  MatchRow, TrackRow, PlayerVideoRow, VideoStatRow, statusStyles, API_URL,
} from "@/lib/videoApi";

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [match, setMatch] = useState<MatchRow | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackRow[]>([]);
  const [players, setPlayers] = useState<PlayerVideoRow[]>([]);
  const [stats, setStats] = useState<VideoStatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingTracks, setRefreshingTracks] = useState(false);
  const [refreshingStats, setRefreshingStats] = useState(false);

  // tag modal
  const [tagTrack, setTagTrack] = useState<TrackRow | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [savingTag, setSavingTag] = useState(false);

  const playerName = useCallback(
    (pid: string | null) => players.find((p) => p.id === pid)?.name ?? null,
    [players]
  );

  const loadAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [matchRes, tracksRes, playersRes, statsRes] = await Promise.all([
      supabase.from("matches").select("*").eq("id", id).single(),
      supabase.from("tracks").select("*").eq("match_id", id).order("track_id"),
      supabase.from("players_video").select("*").order("name"),
      supabase.from("video_stats").select("*").eq("match_id", id),
    ]);

    if (matchRes.error || !matchRes.data) {
      toast.error("Match not found");
      navigate("/dashboard/analysis");
      return;
    }
    const m = matchRes.data as MatchRow;
    setMatch(m);
    setTracks((tracksRes.data as TrackRow[]) ?? []);
    setPlayers((playersRes.data as PlayerVideoRow[]) ?? []);
    setStats((statsRes.data as VideoStatRow[]) ?? []);

    if (m.video_url) {
      const { data: signed } = await supabase.storage
        .from("match-videos")
        .createSignedUrl(m.video_url, 3600);
      setVideoSrc(signed?.signedUrl ?? null);
    }
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const refreshTracks = async () => {
    if (!id) return;
    setRefreshingTracks(true);
    try {
      const res = await fetch(`${API_URL}/api/matches/${id}/tracks`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const rows = (Array.isArray(data) ? data : data.tracks ?? []) as Array<{
        track_id: number; player_id?: string | null;
      }>;
      if (rows.length) {
        const upserts = rows.map((r) => ({
          match_id: id, track_id: r.track_id, player_id: r.player_id ?? null,
        }));
        const { error } = await supabase
          .from("tracks")
          .upsert(upserts, { onConflict: "match_id,track_id" });
        if (error) throw error;
      }
      toast.success("Tracks refreshed");
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Could not refresh tracks from the analysis server.");
    } finally {
      setRefreshingTracks(false);
    }
  };

  const refreshStats = async () => {
    if (!id) return;
    setRefreshingStats(true);
    try {
      const res = await fetch(`${API_URL}/api/matches/${id}/stats`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const rows = (Array.isArray(data) ? data : data.stats ?? []) as Array<Partial<VideoStatRow>>;
      if (rows.length) {
        const upserts = rows.map((r) => ({
          match_id: id,
          player_id: r.player_id ?? null,
          track_id: r.track_id ?? null,
          touches: r.touches ?? 0,
          distance_m: r.distance_m ?? 0,
          possession_seconds: r.possession_seconds ?? 0,
        }));
        // clear & reinsert for a clean refresh
        await supabase.from("video_stats").delete().eq("match_id", id);
        const { error } = await supabase.from("video_stats").insert(upserts);
        if (error) throw error;
      }
      toast.success("Stats refreshed");
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Could not refresh stats from the analysis server.");
    } finally {
      setRefreshingStats(false);
    }
  };

  const openTag = (t: TrackRow) => {
    setTagTrack(t);
    setSelectedPlayer(t.player_id);
    setSearch("");
    setNewName("");
    setNewPosition("");
  };

  const confirmTag = async () => {
    if (!tagTrack) return;
    setSavingTag(true);
    try {
      let pid = selectedPlayer;
      if (newName.trim()) {
        const { data: created, error: createErr } = await supabase
          .from("players_video")
          .insert({ name: newName.trim(), position: newPosition.trim() || null })
          .select()
          .single();
        if (createErr) throw createErr;
        pid = created.id;
      }
      if (!pid) {
        toast.error("Select or create a player");
        setSavingTag(false);
        return;
      }
      const { error } = await supabase
        .from("tracks")
        .update({ player_id: pid })
        .eq("id", tagTrack.id);
      if (error) throw error;
      toast.success("Player tagged");
      setTagTrack(null);
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to tag player");
    } finally {
      setSavingTag(false);
    }
  };

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!match) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/dashboard/analysis")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to matches
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Video Preview */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Video className="h-4 w-4 text-primary" /> Preview
          </div>
          <div className="rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
            {videoSrc ? (
              <video src={videoSrc} controls className="w-full h-full" />
            ) : (
              <p className="text-xs text-muted-foreground">No video uploaded</p>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-foreground">{match.name}</h2>
            <p className="text-sm text-muted-foreground">
              {match.date}{match.team ? ` · ${match.team}` : ""}
            </p>
            <Badge variant="outline" className={`capitalize ${statusStyles[match.status]}`}>
              {match.status}
            </Badge>
            {match.notes && (
              <p className="text-sm text-muted-foreground pt-2">{match.notes}</p>
            )}
          </div>
        </div>

        {/* Middle: Tracks */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-primary" /> Tracks
            </div>
            <Button variant="outline" size="sm" onClick={refreshTracks} disabled={refreshingTracks}>
              {refreshingTracks ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Refresh
            </Button>
          </div>
          {tracks.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No tracks yet. Run analysis, then refresh.
            </div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {tracks.map((t) => (
                <div key={t.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Track #{t.track_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {playerName(t.player_id) ?? "Untagged"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openTag(t)}>
                    <Tag className="h-3.5 w-3.5" /> Tag
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Stats */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" /> Stats
            </div>
            <Button variant="outline" size="sm" onClick={refreshStats} disabled={refreshingStats}>
              {refreshingStats ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Refresh
            </Button>
          </div>
          {stats.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No stats yet. Run analysis, then refresh.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Touches</TableHead>
                  <TableHead className="text-right">Dist (m)</TableHead>
                  <TableHead className="text-right">Poss (s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-foreground">
                      {playerName(s.player_id) ?? (s.track_id != null ? `#${s.track_id}` : "—")}
                    </TableCell>
                    <TableCell className="text-right">{s.touches}</TableCell>
                    <TableCell className="text-right">{Math.round(s.distance_m)}</TableCell>
                    <TableCell className="text-right">{Math.round(s.possession_seconds)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Tag Player Modal */}
      <Dialog open={!!tagTrack} onOpenChange={(o) => !o && setTagTrack(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag Player {tagTrack ? `· Track #${tagTrack.track_id}` : ""}</DialogTitle>
            <DialogDescription>Assign this track to a player.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search players</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a name..." />
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-border">
                {filteredPlayers.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground text-center">No players found</p>
                ) : (
                  filteredPlayers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedPlayer(p.id); setNewName(""); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        selectedPlayer === p.id && !newName ? "bg-primary/10 text-primary" : "hover:bg-accent/60 text-foreground"
                      }`}
                    >
                      <span>{p.name}</span>
                      {p.position && <span className="text-xs text-muted-foreground">{p.position}</span>}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <UserPlus className="h-4 w-4 text-primary" /> Create new player
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={newName} placeholder="Name"
                  onChange={(e) => { setNewName(e.target.value); if (e.target.value) setSelectedPlayer(null); }} />
                <Input value={newPosition} placeholder="Position"
                  onChange={(e) => setNewPosition(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTagTrack(null)} disabled={savingTag}>Cancel</Button>
            <Button onClick={confirmTag} disabled={savingTag}>
              {savingTag && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
