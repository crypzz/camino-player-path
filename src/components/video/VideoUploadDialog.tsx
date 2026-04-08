import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Film } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCreateMatchVideo } from '@/hooks/useMatchVideos';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VideoUploadDialog({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const createVideo = useCreateMatchVideo();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('match');
  const [matchDate, setMatchDate] = useState('');
  const [team, setTeam] = useState('');
  const [opponent, setOpponent] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setFile(null); setTitle(''); setType('match'); setMatchDate(''); setTeam(''); setOpponent(''); setNotes('');
    setProgress(0); setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('video/')) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^.]+$/, '')); }
    else toast.error('Please upload a video file');
  }, [title]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^.]+$/, '')); }
  };

  const handleUpload = async () => {
    if (!file || !user || !title.trim()) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;

      // Simulate progress since supabase-js v2 doesn't expose onUploadProgress for standard upload
      const interval = setInterval(() => setProgress(p => Math.min(p + 8, 90)), 200);

      const { error: uploadError } = await supabase.storage.from('match-videos').upload(path, file);
      clearInterval(interval);
      if (uploadError) throw uploadError;
      setProgress(100);

      await createVideo.mutateAsync({
        title: title.trim(),
        type,
        video_url: path,
        match_date: matchDate || undefined,
        team: team || undefined,
        opponent: opponent || undefined,
        notes: notes || undefined,
      });

      toast.success('Video uploaded successfully');
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Film className="h-5 w-5 text-primary" /> Upload Match Video</DialogTitle>
        </DialogHeader>

        {!file ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}
            onClick={() => document.getElementById('video-file-input')?.click()}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag & drop a video file or <span className="text-primary font-medium">browse</span></p>
            <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WebM supported</p>
            <input id="video-file-input" type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <Film className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              {!uploading && <Button variant="ghost" size="icon" onClick={() => setFile(null)}><X className="h-4 w-4" /></Button>}
            </div>

            {uploading && <Progress value={progress} className="h-2" />}

            <div className="grid gap-3">
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Match title" disabled={uploading} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType} disabled={uploading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Match</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="highlight">Highlight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} disabled={uploading} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Team</Label><Input value={team} onChange={e => setTeam(e.target.value)} placeholder="Your team" disabled={uploading} /></div>
                <div><Label>Opponent</Label><Input value={opponent} onChange={e => setOpponent(e.target.value)} placeholder="Opponent" disabled={uploading} /></div>
              </div>
            </div>

            <Button onClick={handleUpload} disabled={uploading || !title.trim()} className="w-full">
              {uploading ? `Uploading... ${progress}%` : 'Upload Video'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
