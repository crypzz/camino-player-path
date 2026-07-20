import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAnalyticsMatch } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AnalyticsUploadPage() {
  const nav = useNavigate();
  const create = useCreateAnalyticsMatch();
  const [f, setF] = useState({ title: "", video_url: "", match_date: "", home_team: "", away_team: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title || !f.video_url) return toast.error("Title and video URL required");
    const m = await create.mutateAsync({
      title: f.title, video_url: f.video_url,
      match_date: f.match_date || undefined,
      home_team: f.home_team || undefined,
      away_team: f.away_team || undefined,
    });
    toast.success("Match queued for analysis");
    nav(`/dashboard/analytics/${m.id}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Match</h1>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="U15 vs Riverside" />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input value={f.video_url} onChange={(e) => setF({ ...f, video_url: e.target.value })} placeholder="https://…/match.mp4" />
            <p className="text-xs text-muted-foreground mt-1">Public MP4 URL the worker can fetch.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Home</Label><Input value={f.home_team} onChange={(e) => setF({ ...f, home_team: e.target.value })} /></div>
            <div><Label>Away</Label><Input value={f.away_team} onChange={(e) => setF({ ...f, away_team: e.target.value })} /></div>
          </div>
          <div>
            <Label>Match date</Label>
            <Input type="date" value={f.match_date} onChange={(e) => setF({ ...f, match_date: e.target.value })} />
          </div>
          <Button type="submit" disabled={create.isPending} className="w-full">
            {create.isPending ? "Queuing…" : "Queue for AI analysis"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
