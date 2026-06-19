import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, Trash2, Plus, X, UserPlus, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import {
  TrainingSession, useCreateSession, useUpdateSession, useDeleteSession,
  useAddSessionPlayer, useRemoveSessionPlayer, useAddSessionDrill, useRemoveSessionDrill, useToggleSessionDrill,
} from '@/hooks/useTrainingSessions';
import { useDrills } from '@/hooks/useDrills';
import { Player } from '@/types/player';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  session: TrainingSession | null;
  players: Player[];
}

const DIFF_COLORS: Record<string, string> = {
  Beginner: 'bg-success/20 text-success border-success/30',
  Intermediate: 'bg-primary/20 text-primary border-primary/30',
  Advanced: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function SessionDialog({ open, onOpenChange, session, players }: Props) {
  const isEdit = !!session;
  const [name, setName] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [description, setDescription] = useState('');

  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();
  const addPlayer = useAddSessionPlayer();
  const removePlayer = useRemoveSessionPlayer();
  const addDrill = useAddSessionDrill();
  const removeDrill = useRemoveSessionDrill();
  const toggleDrill = useToggleSessionDrill();
  const { data: drills = [] } = useDrills();

  useEffect(() => {
    if (open) {
      setName(session?.name ?? '');
      setFocusArea(session?.focus_area ?? '');
      setSessionDate(session?.session_date ? session.session_date.slice(0, 16) : '');
      setDescription(session?.description ?? '');
    }
  }, [open, session]);

  const assignedPlayerIds = new Set(session?.session_players?.map(sp => sp.player_id) ?? []);
  const assignedDrillIds = new Set(session?.session_drills?.map(sd => sd.drill_id) ?? []);

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Session name is required'); return; }
    try {
      if (isEdit) {
        await updateSession.mutateAsync({
          id: session!.id, name: name.trim(), focus_area: focusArea.trim() || null,
          session_date: sessionDate ? new Date(sessionDate).toISOString() : null,
          description: description.trim() || null,
        });
        toast.success('Session updated');
      } else {
        await createSession.mutateAsync({
          name: name.trim(), focus_area: focusArea.trim() || null,
          session_date: sessionDate ? new Date(sessionDate).toISOString() : null,
          description: description.trim() || null,
        });
        toast.success('Session created');
        onOpenChange(false);
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!session) return;
    try {
      await deleteSession.mutateAsync(session.id);
      toast.success('Session deleted');
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  const togglePlayer = async (playerId: string) => {
    if (!session) { toast.info('Save the session first to add players'); return; }
    const existing = session.session_players?.find(sp => sp.player_id === playerId);
    if (existing) await removePlayer.mutateAsync(existing.id);
    else await addPlayer.mutateAsync({ session_id: session.id, player_id: playerId });
  };

  const toggleDrillAssign = async (drillId: string) => {
    if (!session) { toast.info('Save the session first to assign drills'); return; }
    const existing = session.session_drills?.find(sd => sd.drill_id === drillId);
    if (existing) await removeDrill.mutateAsync(existing.id);
    else await addDrill.mutateAsync({ session_id: session.id, drill_id: drillId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Session' : 'New Training Session'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Session Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tuesday Evening Training" maxLength={120} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="datetime-local" value={sessionDate} onChange={e => setSessionDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Focus Area</Label>
              <Input value={focusArea} onChange={e => setFocusArea(e.target.value)} placeholder="Passing Drills" maxLength={80} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Notes about this session..." rows={2} maxLength={500} />
          </div>

          {/* Players */}
          {isEdit && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Players ({assignedPlayerIds.size})</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs"><UserPlus className="h-3.5 w-3.5" /> Add Players</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Search players..." />
                      <CommandList>
                        <CommandEmpty>No players found.</CommandEmpty>
                        <CommandGroup>
                          {players.map(p => (
                            <CommandItem key={p.id} value={p.name} onSelect={() => togglePlayer(p.id)} className="gap-2">
                              <Check className={cn('h-4 w-4', assignedPlayerIds.has(p.id) ? 'opacity-100 text-primary' : 'opacity-0')} />
                              {p.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {assignedPlayerIds.size === 0 && <p className="text-xs text-muted-foreground">No players assigned yet.</p>}
                {session?.session_players?.map(sp => {
                  const p = players.find(pl => pl.id === sp.player_id);
                  return (
                    <Badge key={sp.id} variant="secondary" className="gap-1 pr-1">
                      {p?.name ?? 'Unknown'}
                      <button onClick={() => removePlayer.mutate(sp.id)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drills */}
          {isEdit && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Drills ({assignedDrillIds.size})</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs"><Dumbbell className="h-3.5 w-3.5" /> Assign Drills</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Search drills..." />
                      <CommandList>
                        <CommandEmpty>No drills. Create some in the Drills Library.</CommandEmpty>
                        <CommandGroup>
                          {drills.map(d => (
                            <CommandItem key={d.id} value={d.name} onSelect={() => toggleDrillAssign(d.id)} className="gap-2">
                              <Check className={cn('h-4 w-4', assignedDrillIds.has(d.id) ? 'opacity-100 text-primary' : 'opacity-0')} />
                              {d.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                {assignedDrillIds.size === 0 && <p className="text-xs text-muted-foreground">No drills assigned yet.</p>}
                {session?.session_drills?.map(sd => {
                  const d = drills.find(dr => dr.id === sd.drill_id);
                  return (
                    <div key={sd.id} className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-2.5 py-1.5">
                      <Checkbox checked={sd.completed} onCheckedChange={(c) => toggleDrill.mutate({ id: sd.id, completed: !!c })} />
                      <span className={cn('text-xs flex-1', sd.completed && 'line-through text-muted-foreground')}>{d?.name ?? 'Unknown'}</span>
                      {d?.difficulty_level && <Badge variant="outline" className={cn('text-[9px]', DIFF_COLORS[d.difficulty_level])}>{d.difficulty_level}</Badge>}
                      <button onClick={() => removeDrill.mutate(sd.id)} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {isEdit && (
            <Button variant="ghost" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10 mr-auto gap-1.5">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={createSession.isPending || updateSession.isPending} className="gap-1.5">
            {!isEdit && <Plus className="h-4 w-4" />}
            {isEdit ? 'Save Changes' : 'Create Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
