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
import * as tus from 'tus-js-client';
import { readVideoDuration, shouldTranscodeForBrowser, transcodeToBrowserMp4 } from '@/lib/browserVideoTranscode';

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB

async function resumableUpload(
  file: File,
  path: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const projectUrl = import.meta.env.VITE_SUPABASE_URL as string;

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${projectUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 1000, 3000, 5000],
      headers: {
        authorization: `Bearer ${token}`,
        'x-upsert': 'false',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: 'match-videos',
        objectName: path,
        contentType: file.type || 'video/mp4',
        cacheControl: '3600',
      },
      chunkSize: 6 * 1024 * 1024,
      onError: (err) => reject(err),
      onProgress: (sent, total) => onProgress(Math.round((sent / total) * 100)),
      onSuccess: () => resolve(),
    });
    upload.start();
  });
}

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
  const [uploadStage, setUploadStage] = useState('Uploading');
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setFile(null); setTitle(''); setType('match'); setMatchDate(''); setTeam(''); setOpponent(''); setNotes('');
    setProgress(0); setUploading(false); setUploadStage('Uploading');
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
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`File is ${(file.size / 1024 / 1024).toFixed(0)} MB — max is 500 MB`);
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      let uploadFile = file;
      let duration = await readVideoDuration(file);

      if (await shouldTranscodeForBrowser(file)) {
        setUploadStage('Converting for browser playback');
        toast.info('Converting this video so it plays correctly in the browser…');
        uploadFile = await transcodeToBrowserMp4(file, (pct) => setProgress(Math.round(pct * 0.45)));
        duration = await readVideoDuration(uploadFile) || duration;
      }

      const didConvert = uploadFile !== file;
      setUploadStage('Uploading');
      const ext = uploadFile.name.split('.').pop() || 'mp4';
      const path = `${user.id}/${Date.now()}.${ext}`;

      await resumableUpload(uploadFile, path, (pct) => setProgress(didConvert ? 45 + Math.round(pct * 0.55) : pct));
      setProgress(100);

      await createVideo.mutateAsync({
        title: title.trim(),
        type,
        video_url: path,
        duration_seconds: duration,
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
            <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WebM · up to 500 MB</p>
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

            {uploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground"><span>{uploadStage}</span><span>{progress}%</span></div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

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
              <div><Label>Notes</Label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." disabled={uploading} /></div>
            </div>

            <Button onClick={handleUpload} disabled={uploading || !title.trim()} className="w-full">
              {uploading ? `${uploadStage}... ${progress}%` : 'Upload Video'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
