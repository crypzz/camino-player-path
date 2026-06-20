import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, UploadCloud, Film, Loader2, X } from "lucide-react";
import { API_URL } from "@/lib/videoApi";

export default function AnalysisUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [team, setTeam] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) {
      toast.error("Match name and date are required");
      return;
    }
    if (!file) {
      toast.error("Please add a video file");
      return;
    }

    setSubmitting(true);
    setProgress(0);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const ext = file.name.split(".").pop() || "mp4";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Simulated progress (Supabase JS upload has no native progress callback)
      const timer = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 5 : p));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from("match-videos")
        .upload(path, file, { contentType: file.type, upsert: false });

      clearInterval(timer);
      if (uploadError) throw uploadError;
      setProgress(100);

      const { data: inserted, error: insertError } = await supabase
        .from("matches")
        .insert({
          name: name.trim(),
          date,
          team: team.trim() || null,
          notes: notes.trim() || null,
          video_url: path,
          status: "pending",
          created_by: userData.user?.id ?? null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Kick off backend processing — non-fatal if it fails
      try {
        const res = await fetch(`${API_URL}/api/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ match_id: inserted.id, video_url: path }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
      } catch (apiErr) {
        console.error(apiErr);
        toast.warning("Match saved, but the processing server could not be reached.");
      }

      toast.success("Match uploaded");
      navigate("/dashboard/analysis");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/dashboard/analysis")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to matches
      </button>

      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Upload Match</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add match details and footage to begin analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Match Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. U16 vs Riverside FC" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input id="team" value={team} onChange={(e) => setTeam(e.target.value)}
              placeholder="e.g. Camino U16" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything to remember about this match..." rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Video File *</Label>
          {file ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Film className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              {!submitting && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pickFile(e.dataTransfer.files?.[0] ?? null);
              }}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Drag & drop a video here</p>
              <p className="text-xs text-muted-foreground">or click to browse</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {submitting && (
          <div className="space-y-1.5">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/analysis")}
            disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Upload & Analyze
          </Button>
        </div>
      </form>
    </div>
  );
}
