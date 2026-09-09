import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DRILL_CATEGORIES, DRILL_TEMPLATES, DrillCategory } from '@/lib/drillTemplates';
import { useCreateDrill, useDrills } from '@/hooks/useDrills';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const DIFF_COLORS: Record<string, string> = {
  Beginner: 'bg-success/20 text-success border-success/30',
  Intermediate: 'bg-primary/20 text-primary border-primary/30',
  Advanced: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function DrillTemplatesDialog({ open, onOpenChange }: Props) {
  const [category, setCategory] = useState<DrillCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const createDrill = useCreateDrill();
  const { data: existing = [] } = useDrills();
  const existingNames = useMemo(() => new Set(existing.map(d => d.name.toLowerCase())), [existing]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DRILL_TEMPLATES.filter(t =>
      (category === 'All' || t.category === category) &&
      (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  }, [category, query]);

  const toggle = (name: string) =>
    setSelected(s => (s.includes(name) ? s.filter(n => n !== name) : [...s, name]));

  const handleAdd = async () => {
    const picks = DRILL_TEMPLATES.filter(t => selected.includes(t.name));
    if (picks.length === 0) { toast.error('Select at least one drill'); return; }
    setSaving(true);
    try {
      for (const t of picks) {
        await createDrill.mutateAsync({
          name: t.name,
          description: t.description,
          difficulty_level: t.difficulty_level,
        });
      }
      toast.success(`Added ${picks.length} drill${picks.length === 1 ? '' : 's'} to your library`);
      setSelected([]);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to add drills');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setSelected([]); onOpenChange(o); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Drill Library</DialogTitle>
          <DialogDescription>Pick ready-made drills and add them to your own library. You can edit them after.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search drills..." className="pl-8" />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(['All', ...DRILL_CATEGORIES] as const).map(c => (
              <button
                key={c}
                onClick={() => setCategory(c as DrillCategory | 'All')}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors border',
                  category === c ? 'bg-primary/15 text-primary border-primary/30' : 'text-muted-foreground border-border hover:bg-secondary'
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <ScrollArea className="h-[46vh] pr-3">
            <div className="space-y-2">
              {list.map(t => {
                const isSelected = selected.includes(t.name);
                const already = existingNames.has(t.name.toLowerCase());
                return (
                  <button
                    key={t.name}
                    disabled={already}
                    onClick={() => toggle(t.name)}
                    className={cn(
                      'w-full text-left rounded-lg border p-3 transition-colors',
                      already ? 'opacity-50 cursor-not-allowed border-border' :
                        isSelected ? 'border-primary/50 bg-primary/10' : 'border-border hover:bg-secondary/60'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground flex items-center gap-1.5">
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                        {t.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {already && <Badge variant="outline" className="text-[10px]">Added</Badge>}
                        <Badge variant="outline" className={cn('text-[10px]', DIFF_COLORS[t.difficulty_level])}>{t.difficulty_level}</Badge>
                      </div>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{t.description}</p>
                    <span className="text-[11px] text-primary/80 mt-1 inline-block">{t.category}</span>
                  </button>
                );
              })}
              {list.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">No drills match your search.</p>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={saving || selected.length === 0} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add {selected.length > 0 ? `${selected.length} ` : ''}to My Drills
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
