import { motion } from 'framer-motion';
import { Clock, Trash2, PencilLine, Lock, User, Users, Plus, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CoachingNote, useDeleteNote } from '@/hooks/useCoachingNotes';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function fmt(t: number | null) {
  if (t == null) return '--:--';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const VIS = {
  private: { label: 'Private', icon: Lock, cls: 'bg-secondary text-muted-foreground border-border' },
  player: { label: 'Player', icon: User, cls: 'bg-info/20 text-info border-info/30' },
  parent: { label: 'Parent', icon: Users, cls: 'bg-success/20 text-success border-success/30' },
};

interface Props {
  matchId: string;
  notes: CoachingNote[];
  players: { id: string; name: string }[];
  onSeek: (t: number) => void;
  onAdd: () => void;
  onEdit: (note: CoachingNote) => void;
}

export default function CoachingNotesPanel({ matchId, notes, players, onSeek, onAdd, onEdit }: Props) {
  const deleteNote = useDeleteNote();
  const playerName = (id: string | null) => players.find(p => p.id === id)?.name;

  const handleDelete = async (id: string) => {
    try {
      await deleteNote.mutateAsync({ id, matchId });
      toast.success('Note deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-3 space-y-3">
      <Button onClick={onAdd} size="sm" className="w-full gap-1.5"><Plus className="h-4 w-4" /> Add Note</Button>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-2">
            <MessageSquareText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground max-w-[220px]">No coaching notes yet. Pause at a key moment and add a timestamped note.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((n, i) => {
            const vis = VIS[n.visibility] ?? VIS.private;
            const VisIcon = vis.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-lg border border-border bg-secondary/30 p-2.5"
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <button
                    onClick={() => n.timestamp_seconds != null && onSeek(n.timestamp_seconds)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    <Clock className="h-3 w-3" /> {fmt(n.timestamp_seconds)}
                  </button>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className={cn('text-[9px] gap-1', vis.cls)}><VisIcon className="h-2.5 w-2.5" />{vis.label}</Badge>
                    <button onClick={() => onEdit(n)} className="text-muted-foreground hover:text-foreground p-1"><PencilLine className="h-3 w-3" /></button>
                    <button onClick={() => handleDelete(n.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
                {n.player_id && <p className="text-[10px] text-muted-foreground mb-0.5">About: {playerName(n.player_id) ?? 'Unknown'}</p>}
                <p className="text-xs text-foreground leading-relaxed">{n.note}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
