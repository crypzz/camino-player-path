import { useMemo, useState } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { useFitnessTests, useCreateFitnessTest, useUpdateFitnessTest, useDeleteFitnessTest, FitnessTest } from '@/hooks/useFitnessTests';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Timer, Zap, ArrowUpFromLine, Wind, Save, Pencil, Trash2, X, Check, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { scoreFitness, scoreColor, FitnessMetric } from '@/lib/fitnessBenchmarks';
import { cn } from '@/lib/utils';

const FIELDS: { key: FitnessMetric; label: string; short: string; icon: any; unit: string; step: number; placeholder: string }[] = [
  { key: 'sprint_10m', label: '10m Sprint', short: '10m', icon: Timer, unit: 's', step: 0.01, placeholder: '1.85' },
  { key: 'sprint_30m', label: '30m Sprint', short: '30m', icon: Timer, unit: 's', step: 0.01, placeholder: '4.30' },
  { key: 'agility_time', label: 'Agility Drill', short: 'Agility', icon: Zap, unit: 's', step: 0.01, placeholder: '9.80' },
  { key: 'vertical_jump', label: 'Vertical Jump', short: 'Jump', icon: ArrowUpFromLine, unit: 'cm', step: 1, placeholder: '42' },
  { key: 'endurance_distance', label: 'Cooper Test', short: 'Cooper', icon: Wind, unit: 'm', step: 10, placeholder: '2400' },
  { key: 'beep_test_level', label: 'Beep Test', short: 'Beep', icon: Activity, unit: 'lv', step: 0.1, placeholder: '8.5' },
];

const PRESETS: { id: string; label: string; keys: FitnessMetric[] }[] = [
  { id: 'speed', label: 'Speed Day', keys: ['sprint_10m', 'sprint_30m', 'agility_time'] },
  { id: 'endurance', label: 'Endurance Day', keys: ['beep_test_level', 'endurance_distance'] },
  { id: 'power', label: 'Power Day', keys: ['vertical_jump'] },
  { id: 'combine', label: 'Full Combine', keys: FIELDS.map((f) => f.key) },
];

function deltaArrow(curr: number | null | undefined, prev: number | null | undefined, lowerIsBetter: boolean) {
  if (curr == null || prev == null) return null;
  const diff = curr - prev;
  if (Math.abs(diff) < 0.001) return { icon: Minus, color: 'text-muted-foreground', text: '0' };
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  return {
    icon: improved ? TrendingUp : TrendingDown,
    color: improved ? 'text-emerald-400' : 'text-red-400',
    text: `${diff > 0 ? '+' : ''}${diff.toFixed(2)}`,
  };
}

const LOWER_IS_BETTER: Record<FitnessMetric, boolean> = {
  sprint_10m: true,
  sprint_30m: true,
  agility_time: true,
  vertical_jump: false,
  endurance_distance: false,
  beep_test_level: false,
};

export default function FitnessTestPage() {
  const { data: players = [] } = usePlayers();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const { data: tests = [], isLoading: testsLoading } = useFitnessTests(selectedPlayerId || undefined);
  const createTest = useCreateFitnessTest();
  const updateTest = useUpdateFitnessTest();
  const deleteTest = useDeleteFitnessTest();

  const [activeKeys, setActiveKeys] = useState<Set<FitnessMetric>>(new Set(['sprint_10m', 'sprint_30m', 'agility_time']));
  const [values, setValues] = useState<Record<string, string>>({});
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
  const lastTest = tests[0];

  const togglePreset = (keys: FitnessMetric[]) => setActiveKeys(new Set(keys));
  const toggleKey = (k: FitnessMetric) =>
    setActiveKeys((s) => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  const bumpField = (k: FitnessMetric, delta: number) => {
    setValues((v) => {
      const curr = parseFloat(v[k] || '0') || 0;
      const next = Math.max(0, +(curr + delta).toFixed(2));
      return { ...v, [k]: String(next) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) return toast.error('Select a player first');
    const payload: any = { player_id: selectedPlayerId, test_date: testDate, notes: notes || null };
    let hasAny = false;
    FIELDS.forEach((f) => {
      const raw = values[f.key];
      const num = raw ? parseFloat(raw) : null;
      payload[f.key] = num;
      if (num !== null && !Number.isNaN(num)) hasAny = true;
    });
    if (!hasAny) return toast.error('Enter at least one test result');
    try {
      await createTest.mutateAsync(payload);
      toast.success('Test saved · Physical CPI updated');
      setValues({});
      setNotes('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const startEdit = (t: FitnessTest) => {
    setEditingId(t.id);
    setEditValues(
      Object.fromEntries(FIELDS.map((f) => [f.key, t[f.key] != null ? String(t[f.key]) : '']).concat([['notes', t.notes || '']])),
    );
  };

  const saveEdit = async (t: FitnessTest) => {
    const updates: any = { notes: editValues.notes || null };
    FIELDS.forEach((f) => {
      const raw = editValues[f.key];
      updates[f.key] = raw ? parseFloat(raw) : null;
    });
    try {
      await updateTest.mutateAsync({ id: t.id, player_id: t.player_id, ...updates });
      toast.success('Test updated');
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    }
  };

  const handleDelete = async (t: FitnessTest) => {
    if (!window.confirm('Delete this fitness test?')) return;
    try {
      await deleteTest.mutateAsync({ id: t.id, player_id: t.player_id });
      toast.success('Test deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, FitnessTest[]>();
    tests.forEach((t) => {
      const key = format(parseISO(t.test_date), 'MMMM yyyy');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries());
  }, [tests]);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Fitness Testing
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Log raw results — Physical CPI scores update automatically.
        </p>
      </motion.div>

      <div className="flex gap-3 items-center flex-wrap">
        <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
          <SelectTrigger className="w-[260px] h-9 text-xs">
            <SelectValue placeholder="Select Player" />
          </SelectTrigger>
          <SelectContent>
            {players.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name} — {p.position}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPlayer && lastTest && (
          <span className="text-[11px] text-muted-foreground">
            Last test: {format(parseISO(lastTest.test_date), 'MMM d, yyyy')}
          </span>
        )}
      </div>

      {selectedPlayerId && (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-xl p-4 space-y-4 border border-primary/15"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Quick preset:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePreset(p.keys)}
                  className="text-[11px] px-2 py-1 rounded-md bg-muted/30 hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="h-8 text-xs w-[160px]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FIELDS.map((f) => {
              const active = activeKeys.has(f.key);
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleKey(f.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-colors',
                    active
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40',
                  )}
                >
                  <Icon className="h-3 w-3" /> {f.short}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FIELDS.filter((f) => activeKeys.has(f.key)).map((f) => {
              const Icon = f.icon;
              const raw = values[f.key];
              const num = raw ? parseFloat(raw) : null;
              const score = num !== null && !Number.isNaN(num) ? scoreFitness(f.key, num) : null;
              const lastVal = lastTest?.[f.key];
              return (
                <div key={f.key} className="bg-background/40 rounded-lg p-3 border border-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {f.label}
                      <span className="text-muted-foreground/60 font-normal">({f.unit})</span>
                    </label>
                    {score !== null && (
                      <span className={cn('text-[11px] font-display font-bold', scoreColor(score))}>
                        {score}/10
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0" onClick={() => bumpField(f.key, -f.step)}>−</Button>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step={f.step}
                      placeholder={lastVal != null ? `last: ${lastVal}` : f.placeholder}
                      value={raw || ''}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="h-8 text-xs text-center"
                    />
                    <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0" onClick={() => bumpField(f.key, f.step)}>+</Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Textarea
            placeholder="Notes — conditions, surface, who tested…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-xs min-h-[50px]"
          />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={createTest.isPending} className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              {createTest.isPending ? 'Saving…' : 'Save & update CPI'}
            </Button>
          </div>
        </motion.form>
      )}

      {selectedPlayerId && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-foreground">Test history</h2>
          {testsLoading ? (
            <p className="text-muted-foreground text-xs py-8 text-center">Loading…</p>
          ) : tests.length === 0 ? (
            <p className="text-muted-foreground text-xs py-8 text-center">No fitness tests recorded yet</p>
          ) : (
            grouped.map(([month, monthTests]) => (
              <div key={month} className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{month}</div>
                <AnimatePresence>
                  {monthTests.map((test, i) => {
                    const prev = tests[tests.indexOf(test) + 1];
                    const isEditing = editingId === test.id;
                    return (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03 }}
                        className="glass-card rounded-lg p-3 border border-border/40"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-foreground">
                            {format(parseISO(test.test_date), 'EEE MMM d, yyyy')}
                          </span>
                          <div className="flex items-center gap-1">
                            {isEditing ? (
                              <>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => saveEdit(test)} disabled={updateTest.isPending}>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingId(null)}>
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(test)}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-red-400" onClick={() => handleDelete(test)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {FIELDS.map((f) => (
                              <div key={f.key}>
                                <label className="text-[10px] text-muted-foreground">{f.short} ({f.unit})</label>
                                <Input
                                  type="number"
                                  step={f.step}
                                  value={editValues[f.key] || ''}
                                  onChange={(e) => setEditValues((v) => ({ ...v, [f.key]: e.target.value }))}
                                  className="h-7 text-xs"
                                />
                              </div>
                            ))}
                            <div className="col-span-2 sm:col-span-3">
                              <Textarea
                                value={editValues.notes || ''}
                                onChange={(e) => setEditValues((v) => ({ ...v, notes: e.target.value }))}
                                placeholder="Notes"
                                className="text-xs min-h-[44px]"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap gap-1.5">
                              {FIELDS.map((f) => {
                                const v = test[f.key];
                                if (v == null) return null;
                                const delta = deltaArrow(
                                  v as number,
                                  prev?.[f.key] as number | undefined,
                                  LOWER_IS_BETTER[f.key],
                                );
                                const DIcon = delta?.icon;
                                return (
                                  <Badge key={f.key} variant="secondary" className="text-[10px] gap-1 px-2 py-0.5">
                                    <f.icon className="h-2.5 w-2.5" />
                                    {f.short}: {v}{f.unit}
                                    {delta && DIcon && (
                                      <span className={cn('flex items-center gap-0.5 ml-1', delta.color)}>
                                        <DIcon className="h-2.5 w-2.5" />
                                        {delta.text}
                                      </span>
                                    )}
                                  </Badge>
                                );
                              })}
                            </div>
                            {test.notes && (
                              <p className="text-[11px] text-muted-foreground mt-2 italic">{test.notes}</p>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
