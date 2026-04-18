import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Sparkles, Copy, Check, TrendingUp, TrendingDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { usePlayers } from '@/hooks/usePlayers';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type Report = {
  player_name: string;
  cpi: number;
  cpi_trend: number;
  headline: string;
  coach_report: string;
  parent_report: string;
  highlights: string[];
  focus_next_week: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WeeklyReportDialog({ open, onOpenChange }: Props) {
  const { data: players = [] } = usePlayers();
  const [playerId, setPlayerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [copied, setCopied] = useState<'coach' | 'parent' | null>(null);

  async function generate() {
    if (!playerId) return;
    setLoading(true);
    setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-weekly-report', {
        body: { player_id: playerId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data as Report);
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  }

  async function copy(which: 'coach' | 'parent') {
    if (!report) return;
    const text = which === 'coach' ? report.coach_report : report.parent_report;
    await navigator.clipboard.writeText(text);
    setCopied(which);
    toast.success(`${which === 'coach' ? 'Coach' : 'Parent'} report copied`);
    setTimeout(() => setCopied(null), 2000);
  }

  function reset() {
    setReport(null);
    setPlayerId('');
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <FileText className="h-5 w-5 text-primary" />
            Generate Weekly Report
          </DialogTitle>
        </DialogHeader>

        {!report ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select a player</label>
              <Select value={playerId} onValueChange={setPlayerId} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a player..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.position} · {p.team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              The assistant will analyze CPI, recent evaluations, this week's attendance, latest fitness test, and active goals — then produce a coach version and a parent version.
            </div>

            <Button onClick={generate} disabled={!playerId || loading} className="w-full">
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Generate Report</>
              )}
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Header card */}
            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-lg text-foreground truncate">{report.player_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.headline}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-display font-bold text-primary">{report.cpi}</div>
                  <div className={`text-xs flex items-center gap-1 justify-end ${report.cpi_trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {report.cpi_trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {report.cpi_trend > 0 ? '+' : ''}{report.cpi_trend} CPI
                  </div>
                </div>
              </div>

              {report.highlights?.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {report.highlights.map((h, i) => (
                    <div key={i} className="text-[11px] bg-card/60 border border-border rounded px-2 py-1.5 text-foreground">
                      ✦ {h}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="coach">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="coach">Coach Version</TabsTrigger>
                <TabsTrigger value="parent">Parent Version</TabsTrigger>
              </TabsList>

              <TabsContent value="coach" className="mt-3">
                <div className="rounded-lg border border-border bg-card p-4 max-h-[40vh] overflow-y-auto">
                  <div className="prose prose-sm max-w-none text-foreground [&_strong]:text-primary [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm">
                    <ReactMarkdown>{report.coach_report}</ReactMarkdown>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => copy('coach')}>
                  {copied === 'coach' ? <><Check className="h-4 w-4 mr-2" /> Copied</> : <><Copy className="h-4 w-4 mr-2" /> Copy coach report</>}
                </Button>
              </TabsContent>

              <TabsContent value="parent" className="mt-3">
                <div className="rounded-lg border border-border bg-card p-4 max-h-[40vh] overflow-y-auto">
                  <div className="prose prose-sm max-w-none text-foreground [&_strong]:text-primary [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm">
                    <ReactMarkdown>{report.parent_report}</ReactMarkdown>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => copy('parent')}>
                  {copied === 'parent' ? <><Check className="h-4 w-4 mr-2" /> Copied</> : <><Copy className="h-4 w-4 mr-2" /> Copy parent report</>}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="rounded-lg bg-muted/40 border border-border p-3">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-1">Focus next week</div>
              <p className="text-sm text-foreground">{report.focus_next_week}</p>
            </div>

            <Button variant="ghost" size="sm" onClick={reset} className="w-full">
              ← Generate for another player
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
