import { useState } from 'react';
import { VideoAnnotation, useCreateVideoAnnotation, useDeleteVideoAnnotation } from '@/hooks/useVideoAnnotations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  videoId: string;
  currentTime: number;
  annotations: VideoAnnotation[];
  onSeek: (time: number) => void;
}

export default function AnnotationsPanel({ videoId, currentTime, annotations, onSeek }: Props) {
  const [content, setContent] = useState('');
  const createAnnotation = useCreateVideoAnnotation();
  const deleteAnnotation = useDeleteVideoAnnotation();

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  const handleAdd = async () => {
    if (!content.trim()) return;
    try {
      await createAnnotation.mutateAsync({ video_id: videoId, timestamp_seconds: currentTime, content: content.trim() });
      setContent('');
      toast.success('Note added');
    } catch { toast.error('Failed to add note'); }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex gap-2 p-3 border-b border-border">
        <Input value={content} onChange={e => setContent(e.target.value)} placeholder={`Add note at ${fmt(currentTime)}...`} className="h-8 text-xs" onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleAdd} disabled={!content.trim()}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {annotations.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No notes yet</p>}
          {annotations.map(a => (
            <div key={a.id} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-secondary/50 cursor-pointer group" onClick={() => onSeek(a.timestamp_seconds)}>
              <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-muted-foreground">{fmt(a.timestamp_seconds)}</span>
                <p className="text-xs text-foreground">{a.content}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0" onClick={e => { e.stopPropagation(); deleteAnnotation.mutate({ id: a.id, videoId: a.video_id }); }}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
