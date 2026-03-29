import { useState } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { useFitnessTests, useCreateFitnessTest } from '@/hooks/useFitnessTests';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Activity, Timer, Zap, ArrowUpFromLine, Wind, Plus } from 'lucide-react';
import { format } from 'date-fns';

const testFields = [
  { key: 'beep_test_level', label: 'Beep Test Level', icon: Activity, unit: 'level', placeholder: 'e.g. 8.5' },
  { key: 'beep_test_shuttles', label: 'Beep Test Shuttles', icon: Activity, unit: 'shuttles', placeholder: 'e.g. 42' },
  { key: 'sprint_10m', label: '10m Sprint', icon: Timer, unit: 'seconds', placeholder: 'e.g. 1.85' },
  { key: 'sprint_30m', label: '30m Sprint', icon: Timer, unit: 'seconds', placeholder: 'e.g. 4.3' },
  { key: 'agility_time', label: 'Agility Drill', icon: Zap, unit: 'seconds', placeholder: 'e.g. 9.8' },
  { key: 'vertical_jump', label: 'Vertical Jump', icon: ArrowUpFromLine, unit: 'cm', placeholder: 'e.g. 42' },
  { key: 'endurance_distance', label: 'Cooper Test', icon: Wind, unit: 'meters', placeholder: 'e.g. 2400' },
] as const;

export default function FitnessTestPage() {
  const { data: players = [], isLoading: playersLoading } = usePlayers();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const { data: tests = [], isLoading: testsLoading } = useFitnessTests(selectedPlayerId || undefined);
  const createTest = useCreateFitnessTest();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) { toast.error('Select a player first'); return; }

    const payload: any = {
      player_id: selectedPlayerId,
      test_date: formData.test_date || new Date().toISOString().split('T')[0],
      notes: formData.notes || null,
    };

    testFields.forEach(f => {
      const val = formData[f.key];
      payload[f.key] = val ? parseFloat(val) : null;
    });

    const hasAnyTest = testFields.some(f => payload[f.key] !== null);
    if (!hasAnyTest) { toast.error('Enter at least one test result'); return; }

    try {
      await createTest.mutateAsync(payload);
      toast.success('Fitness test recorded! Physical CPI updated automatically.');
      setFormData({});
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save test');
    }
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Fitness Testing
        </h1>
        <p className="text-muted-foreground text-[13px] mt-0.5">
          Record test results to automatically update Physical CPI scores
        </p>
      </motion.div>

      <div className="flex gap-3 items-center flex-wrap">
        <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
          <SelectTrigger className="w-[220px] h-9 text-xs">
            <SelectValue placeholder="Select Player" />
          </SelectTrigger>
          <SelectContent>
            {players.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name} — {p.position}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPlayerId && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="h-9 text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Test
          </Button>
        )}
      </div>

      {/* New Test Form */}
      {showForm && selectedPlayerId && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Record Fitness Test — {selectedPlayer?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Test Date</label>
                  <Input
                    type="date"
                    value={formData.test_date || new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData(d => ({ ...d, test_date: e.target.value }))}
                    className="mt-1 h-8 text-xs w-[180px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {testFields.map(field => {
                    const Icon = field.icon;
                    return (
                      <div key={field.key} className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {field.label}
                          <span className="text-muted-foreground/50">({field.unit})</span>
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={field.placeholder}
                          value={formData[field.key] || ''}
                          onChange={e => setFormData(d => ({ ...d, [field.key]: e.target.value }))}
                          className="h-8 text-xs"
                        />
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Notes</label>
                  <Textarea
                    placeholder="Observations, conditions, etc."
                    value={formData.notes || ''}
                    onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))}
                    className="mt-1 text-xs min-h-[60px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={createTest.isPending} className="text-xs">
                    {createTest.isPending ? 'Saving...' : 'Save & Update CPI'}
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)} className="text-xs">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Test History */}
      {selectedPlayerId && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Test History</h2>
          {testsLoading ? (
            <p className="text-muted-foreground text-xs py-8 text-center">Loading...</p>
          ) : tests.length === 0 ? (
            <p className="text-muted-foreground text-xs py-8 text-center">No fitness tests recorded yet</p>
          ) : (
            <div className="space-y-2">
              {tests.map((test, i) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-foreground">
                          {format(new Date(test.test_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {test.sprint_10m && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Timer className="h-2.5 w-2.5" /> 10m: {test.sprint_10m}s
                          </Badge>
                        )}
                        {test.sprint_30m && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Timer className="h-2.5 w-2.5" /> 30m: {test.sprint_30m}s
                          </Badge>
                        )}
                        {test.agility_time && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Zap className="h-2.5 w-2.5" /> Agility: {test.agility_time}s
                          </Badge>
                        )}
                        {test.vertical_jump && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <ArrowUpFromLine className="h-2.5 w-2.5" /> Jump: {test.vertical_jump}cm
                          </Badge>
                        )}
                        {test.endurance_distance && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Wind className="h-2.5 w-2.5" /> Cooper: {test.endurance_distance}m
                          </Badge>
                        )}
                        {test.beep_test_level && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Activity className="h-2.5 w-2.5" /> Beep: Lv {test.beep_test_level}
                          </Badge>
                        )}
                      </div>
                      {test.notes && (
                        <p className="text-[11px] text-muted-foreground mt-2 italic">{test.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
