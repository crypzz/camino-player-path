import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Drill, DifficultyLevel, useCreateDrill, useUpdateDrill, useDeleteDrill } from '@/hooks/useDrills';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  drill: Drill | null;
}

export default function DrillDialog({ open, onOpenChange, drill }: Props) {
  const isEdit = !!drill;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | ''>('');

  const createDrill = useCreateDrill();
  const updateDrill = useUpdateDrill();
  const deleteDrill = useDeleteDrill();

  useEffect(() => {
    if (open) {
      setName(drill?.name ?? '');
      setDescription(drill?.description ?? '');
      setDifficulty(drill?.difficulty_level ?? '');
    }
  }, [open, drill]);

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Drill name is required'); return; }
    try {
      if (isEdit) {
        await updateDrill.mutateAsync({ id: drill!.id, name: name.trim(), description: description.trim() || null, difficulty_level: difficulty || null });
        toast.success('Drill updated');
      } else {
        await createDrill.mutateAsync({ name: name.trim(), description: description.trim() || null, difficulty_level: difficulty || null });
        toast.success('Drill created');
      }
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!drill) return;
    try {
      await deleteDrill.mutateAsync(drill.id);
      toast.success('Drill deleted');
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Drill' : 'New Drill'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Drill Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rondo 5v2" maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label>Difficulty Level</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as DifficultyLevel)}>
              <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="How the drill works, objectives..." rows={4} maxLength={1000} />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          {isEdit && (
            <Button variant="ghost" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10 mr-auto gap-1.5">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={createDrill.isPending || updateDrill.isPending} className="gap-1.5">
            {!isEdit && <Plus className="h-4 w-4" />}{isEdit ? 'Save Changes' : 'Create Drill'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
