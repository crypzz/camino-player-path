import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, X, ShieldCheck, Globe, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  playerId: string;
}

interface DiscoveryRow {
  bio: string | null;
  jersey_number: number | null;
  strengths: string[] | null;
  achievements: string[] | null;
  available_for_transfer: boolean | null;
  is_public: boolean | null;
  verification_badge: boolean | null;
}

function TagEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft('');
  };
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <Badge key={i} variant="secondary" className="gap-1 text-[11px]">
            {it}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {items.length === 0 && <span className="text-[11px] text-muted-foreground/50">None yet</span>}
      </div>
      <div className="flex gap-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="h-8 text-[12px]"
          maxLength={60}
        />
        <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function PlayerDiscoveryEditor({ playerId }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<DiscoveryRow | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['player-discovery', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('bio, jersey_number, strengths, achievements, available_for_transfer, is_public, verification_badge')
        .eq('id', playerId)
        .single();
      if (error) throw error;
      return data as DiscoveryRow;
    },
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('players')
      .update({
        bio: form.bio?.trim() || null,
        jersey_number: form.jersey_number ?? null,
        strengths: form.strengths ?? [],
        achievements: form.achievements ?? [],
        available_for_transfer: !!form.available_for_transfer,
        is_public: !!form.is_public,
      })
      .eq('id', playerId);
    setSaving(false);
    if (error) {
      toast.error('Could not save profile');
      return;
    }
    qc.invalidateQueries({ queryKey: ['player-discovery', playerId] });
    qc.invalidateQueries({ queryKey: ['discover-players'] });
    qc.invalidateQueries({ queryKey: ['discover-player', playerId] });
    qc.invalidateQueries({ queryKey: ['public-player', playerId] });
    toast.success('Profile updated');
  };

  const set = <K extends keyof DiscoveryRow>(k: K, v: DiscoveryRow[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2.5 rounded-md bg-secondary/40 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <div>
              <p className="text-[12px] font-medium text-foreground">Public profile</p>
              <p className="text-[10px] text-muted-foreground">Discoverable by clubs &amp; scouts</p>
            </div>
          </div>
          <Switch checked={!!form.is_public} onCheckedChange={(v) => set('is_public', v)} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
            <div>
              <p className="text-[12px] font-medium text-foreground">Available for transfer</p>
              <p className="text-[10px] text-muted-foreground">Show in the transfer marketplace</p>
            </div>
          </div>
          <Switch
            checked={!!form.available_for_transfer}
            onCheckedChange={(v) => set('available_for_transfer', v)}
          />
        </div>
        {form.verification_badge && (
          <div className="flex items-center gap-2 text-[11px] text-success">
            <ShieldCheck className="h-3.5 w-3.5" />
            Camino verified performance data
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Bio</Label>
        <Textarea
          value={form.bio ?? ''}
          onChange={(e) => set('bio', e.target.value)}
          placeholder="Tell scouts about your playing style, ambitions, and journey..."
          className="text-[12px] min-h-[80px]"
          maxLength={500}
        />
      </div>

      <div className="space-y-1.5 max-w-[140px]">
        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Jersey #</Label>
        <Input
          type="number"
          value={form.jersey_number ?? ''}
          onChange={(e) => set('jersey_number', e.target.value ? parseInt(e.target.value) : null)}
          className="h-8 text-[12px]"
          min={1}
          max={99}
        />
      </div>

      <TagEditor label="Strengths" items={form.strengths ?? []} onChange={(v) => set('strengths', v)} />
      <TagEditor label="Achievements" items={form.achievements ?? []} onChange={(v) => set('achievements', v)} />

      <Button onClick={save} disabled={saving} className="w-full gap-2">
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save profile
      </Button>
    </div>
  );
}
