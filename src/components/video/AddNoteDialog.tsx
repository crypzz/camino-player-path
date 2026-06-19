import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import { CoachingNote, NoteVisibility, useCreateNote, useUpdateNote } from '@/hooks/useCoachingNotes';

const MAX = 500;

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  matchId: string;
  currentTime: number;
  players: { id: string; name: string }[];
  editNote?: CoachingNote | null;
}

export default function AddNoteDialog({ open, onOpenChange, matchId, currentTime, players, editNote }: Props) {
  const isEdit = !!editNote;
  const [text, setText] = useState('');
  const [playerId, setPlayerId] = useState<string>('');
  const [visibility, setVisibility] = useState<NoteVisibility>('private');

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  useEffect(() => {
    if (open) {
      setText(editNote?.note ?? '');
      setPlayerId(editNote?.player_id ?? '');
      setVisibility(editNote?.visibility ?? 'private');
    }
  }, [open, editNote]);

  const timestamp = isEdit ? editNote!.timestamp_seconds ?? 0 : currentTime;

  const handleSave = async () => {
    if (!text.trim()) { toast.error('Note cannot be empty'); return; }
    if (text.length > MAX) { toast.error(`Note must be under ${MAX} characters`); return; }
    try {
      if (isEdit) {
        await updateNote.mutateAsync({ id: editNote!.id, note: text.trim(), visibility, player_id: playerId || null });
        toast.success('Note updated');
      } else {
        await createNote.mutateAsync({
          match_id: matchId, player_id: playerId || null,
          timestamp_seconds: currentTime, note: text.trim(), visibility,
        });
        toast.success('Note added');
      }
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save note');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? 'Edit Note' : 'Add Coaching Note'}
            <span className="inline-flex items-center gap-1 text-xs font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" /> {fmt(timestamp)}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Note</Label>
            <Textarea value={text} onChange={e => setText(e.target.value.slice(0, MAX))} rows={4} placeholder="What did you observe at this moment?" />
            <p className={`text-[11px] text-right ${text.length >= MAX ? 'text-destructive' : 'text-muted-foreground'}`}>{text.length}/{MAX}</p>
          </div>
          <div className="space-y-1.5">
            <Label>About Player</Label>
            <Select value={playerId} onValueChange={setPlayerId}>
              <SelectTrigger><SelectValue placeholder="Select a player (optional)" /></SelectTrigger>
              <SelectContent>
                {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as NoteVisibility)} className="gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <RadioGroupItem value="private" /> Private (only you)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <RadioGroupItem value="player" /> Shared with Player
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <RadioGroupItem value="parent" /> Shared with Parent
              </label>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={createNote.isPending || updateNote.isPending}>
            {isEdit ? 'Save Changes' : 'Add Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
