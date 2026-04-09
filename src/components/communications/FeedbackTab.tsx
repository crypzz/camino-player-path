import { useState } from 'react';
import { usePlayerFeedback, useCreateFeedback, useAllProfiles } from '@/hooks/useCommunications';
import { usePlayers } from '@/hooks/usePlayers';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Plus, ThumbsUp, ArrowUpRight, StickyNote } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function FeedbackTab() {
  const { role } = useAppContext();
  const { data: players = [] } = usePlayers();
  const { data: profiles = [] } = useAllProfiles();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const { data: feedback = [] } = usePlayerFeedback(selectedPlayerId || undefined);
  const createMutation = useCreateFeedback();
  const [open, setOpen] = useState(false);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [notes, setNotes] = useState('');
  const [feedbackPlayer, setFeedbackPlayer] = useState('');

  const canCreate = role === 'coach' || role === 'director';

  const handleCreate = async () => {
    if (!feedbackPlayer || (!strengths.trim() && !improvements.trim())) return;
    try {
      await createMutation.mutateAsync({
        player_id: feedbackPlayer,
        strengths: strengths.trim(),
        improvements: improvements.trim(),
        notes: notes.trim(),
      });
      toast.success('Feedback submitted');
      setOpen(false);
      setStrengths(''); setImprovements(''); setNotes(''); setFeedbackPlayer('');
      if (feedbackPlayer === selectedPlayerId) {
        // Will auto-refresh via query
      }
    } catch { toast.error('Failed to submit feedback'); }
  };

  const getCoachName = (coachId: string) => {
    return profiles.find((p: any) => p.user_id === coachId)?.display_name || 'Coach';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Select a player to view feedback" /></SelectTrigger>
          <SelectContent>
            {players.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> New Feedback</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Player Feedback</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <Select value={feedbackPlayer} onValueChange={setFeedbackPlayer}>
                  <SelectTrigger><SelectValue placeholder="Select player" /></SelectTrigger>
                  <SelectContent>
                    {players.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1.5"><ThumbsUp className="h-3.5 w-3.5 text-emerald-400" /> Strengths</label>
                  <Textarea value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="What they're doing well..." rows={3} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1.5"><ArrowUpRight className="h-3.5 w-3.5 text-amber-400" /> Areas to Improve</label>
                  <Textarea value={improvements} onChange={e => setImprovements(e.target.value)} placeholder="What to focus on..." rows={3} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1.5"><StickyNote className="h-3.5 w-3.5 text-blue-400" /> Additional Notes</label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any other notes..." rows={2} />
                </div>
                <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                  {createMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!selectedPlayerId ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><ClipboardCheck className="h-8 w-8 mx-auto mb-3 opacity-40" /><p className="text-sm">Select a player to view their development feedback</p></CardContent></Card>
      ) : feedback.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><p className="text-sm">No feedback yet for this player</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {feedback.map((f: any) => (
            <Card key={f.id} className="border-l-2 border-l-primary/40">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[11px]">{getCoachName(f.coach_id)}</Badge>
                  <span className="text-[11px] text-muted-foreground/50">{format(new Date(f.created_at), 'MMM d, yyyy')}</span>
                </div>
                {f.strengths && (
                  <div>
                    <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 mb-1"><ThumbsUp className="h-3 w-3" /> Strengths</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{f.strengths}</p>
                  </div>
                )}
                {f.improvements && (
                  <div>
                    <p className="text-[11px] font-medium text-amber-400 flex items-center gap-1 mb-1"><ArrowUpRight className="h-3 w-3" /> Areas to Improve</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{f.improvements}</p>
                  </div>
                )}
                {f.notes && (
                  <div>
                    <p className="text-[11px] font-medium text-blue-400 flex items-center gap-1 mb-1"><StickyNote className="h-3 w-3" /> Notes</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{f.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
