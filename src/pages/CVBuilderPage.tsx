import { useState, useEffect } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { usePlayerCV, useCreatePlayerCV, useUpdatePlayerCV } from '@/hooks/usePlayerCV';
import { useRankings } from '@/hooks/useRankings';
import { useAuth } from '@/hooks/useAuth';
import { calculateCPI, getCategoryAverage } from '@/types/player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, ChevronRight, ChevronLeft,
  Sparkles, Plus, X, Link2, Check, Copy, Globe, Palette
} from 'lucide-react';
import { CVTemplateClassic } from '@/components/cv/CVTemplateClassic';
import { CVTemplateDark } from '@/components/cv/CVTemplateDark';
import { CVTemplateMinimal } from '@/components/cv/CVTemplateMinimal';

const TEMPLATES = [
  { key: 'classic', label: 'Classic', desc: 'Clean professional layout' },
  { key: 'dark', label: 'Dark Pro', desc: 'Modern dark theme' },
  { key: 'minimal', label: 'Minimal Gold', desc: 'White with gold accents' },
] as const;

type Step = 'generate' | 'edit' | 'preview' | 'export';

export default function CVBuilderPage() {
  const { data: players } = usePlayers();
  const { data: rankings } = useRankings();
  useAuth();
  const player = players?.[0];

  const { data: existingCV, isLoading: cvLoading } = usePlayerCV(player?.id || null);
  const createCV = useCreatePlayerCV();
  const updateCV = useUpdatePlayerCV();

  const [step, setStep] = useState<Step>('generate');
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    position: '',
    preferred_foot: 'Right',
    height: 170,
    weight: 65,
    age: 0,
    date_of_birth: '',
    current_team: '',
    previous_teams: [] as string[],
    achievements: [] as string[],
    bio: '',
    highlight_video_url: '',
    template: 'classic',
    is_published: false,
  });
  const [newTeam, setNewTeam] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // Auto-fill from player data
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (existingCV) {
      setForm({
        full_name: existingCV.full_name,
        position: existingCV.position,
        preferred_foot: existingCV.preferred_foot || 'Right',
        height: existingCV.height || 170,
        weight: existingCV.weight || 65,
        age: existingCV.age || 0,
        date_of_birth: existingCV.date_of_birth || '',
        current_team: existingCV.current_team || '',
        previous_teams: existingCV.previous_teams || [],
        achievements: existingCV.achievements || [],
        bio: existingCV.bio || '',
        highlight_video_url: existingCV.highlight_video_url || '',
        template: existingCV.template,
        is_published: existingCV.is_published,
      });
      if (!initialized) {
        setStep('edit');
        setInitialized(true);
      }
    } else if (player) {
      setForm(f => ({
        ...f,
        full_name: player.name,
        position: player.position,
        preferred_foot: player.preferredFoot,
        height: player.height,
        weight: player.weight,
        age: player.age,
        current_team: player.team,
      }));
    }
  }, [player, existingCV]);

  const playerRank = rankings?.find(r => r.id === player?.id);
  const cpi = player ? calculateCPI(player) : 0;
  const techAvg = player ? getCategoryAverage(player.technical) : 0;
  const tacAvg = player ? getCategoryAverage(player.tactical) : 0;
  const phyAvg = player ? getCategoryAverage(player.physical) : 0;
  const menAvg = player ? getCategoryAverage(player.mental) : 0;

  const templateProps = {
    form, cpi, techAvg, tacAvg, phyAvg, menAvg,
    globalRank: playerRank?.globalRank,
    localRank: playerRank?.localRank,
    consistencyScore: playerRank?.consistencyScore,
    improvementScore: playerRank?.improvementScore,
  };

  const renderTemplate = () => {
    switch (form.template) {
      case 'dark': return <CVTemplateDark {...templateProps} />;
      case 'minimal': return <CVTemplateMinimal {...templateProps} />;
      default: return <CVTemplateClassic {...templateProps} />;
    }
  };

  const handleGenerate = () => setStep('edit');

  const handleSave = async () => {
    if (!player) return;
    const payload = {
      ...form,
      date_of_birth: form.date_of_birth || null,
      highlight_video_url: form.highlight_video_url || null,
      bio: form.bio || null,
      current_team: form.current_team || null,
      preferred_foot: form.preferred_foot || null,
    };
    try {
      if (existingCV) {
        await updateCV.mutateAsync({ id: existingCV.id, ...payload });
      } else {
        await createCV.mutateAsync({ ...payload, player_id: player.id });
      }
      toast.success('CV saved successfully');
      setStep('preview');
    } catch {
      toast.error('Failed to save CV');
    }
  };

  const handlePublish = async () => {
    if (!existingCV) return;
    try {
      await updateCV.mutateAsync({ id: existingCV.id, is_published: !existingCV.is_published });
      toast.success(existingCV.is_published ? 'CV unpublished' : 'CV published & shareable!');
    } catch {
      toast.error('Failed to update publish status');
    }
  };

  const shareUrl = existingCV ? `${window.location.origin}/cv/${existingCV.slug}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  const handleDownloadPDF = () => {
    // Open printable CV page in new tab
    if (existingCV) {
      window.open(`/cv/${existingCV.slug}?print=1`, '_blank');
    }
  };

  if (!player && !cvLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Add a player profile first to build your CV.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'generate', label: 'Generate' },
    { key: 'edit', label: 'Edit' },
    { key: 'preview', label: 'Preview' },
    { key: 'export', label: 'Export' },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Player CV Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate a professional, agent-ready football CV</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              onClick={() => (i <= stepIndex || existingCV) ? setStep(s.key) : null}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step === s.key
                  ? 'bg-primary text-primary-foreground'
                  : i < stepIndex
                  ? 'bg-primary/20 text-primary cursor-pointer'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">
                {i < stepIndex ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {s.label}
            </button>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Generate */}
        {step === 'generate' && (
          <motion.div key="generate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="max-w-xl mx-auto">
              <CardContent className="pt-8 pb-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Generate Your CV</h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    We'll auto-fill your CV using your Camino profile data — stats, rankings, and performance metrics.
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-center text-sm text-muted-foreground">
                  <Badge variant="secondary">{player?.name}</Badge>
                  <Badge variant="secondary">{player?.position}</Badge>
                  <Badge variant="secondary">CPI: {cpi}</Badge>
                </div>
                <Button size="lg" onClick={handleGenerate} className="px-8">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate CV
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Edit */}
        {step === 'edit' && (
          <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Full Name</Label>
                      <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs">Position</Label>
                      <Input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Preferred Foot</Label>
                      <Input value={form.preferred_foot} onChange={e => setForm(f => ({ ...f, preferred_foot: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs">Height (cm)</Label>
                      <Input type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: +e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs">Weight (kg)</Label>
                      <Input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: +e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Age</Label>
                      <Input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs">Date of Birth</Label>
                      <Input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Current Team</Label>
                    <Input value={form.current_team} onChange={e => setForm(f => ({ ...f, current_team: e.target.value }))} />
                  </div>
                </CardContent>
              </Card>

              {/* Bio & Media */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Bio & Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs">Personal Bio</Label>
                    <Textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="A short professional summary..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Highlight Video URL</Label>
                    <Input
                      value={form.highlight_video_url}
                      onChange={e => setForm(f => ({ ...f, highlight_video_url: e.target.value }))}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  {/* Template selector */}
                  <div>
                    <Label className="text-xs flex items-center gap-1.5 mb-2"><Palette className="h-3 w-3" /> Template</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {TEMPLATES.map(t => (
                        <button
                          key={t.key}
                          onClick={() => setForm(f => ({ ...f, template: t.key }))}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            form.template === t.key
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <p className="text-xs font-semibold">{t.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Teams */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Previous Teams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {form.previous_teams.map((t, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        {t}
                        <button onClick={() => setForm(f => ({ ...f, previous_teams: f.previous_teams.filter((_, idx) => idx !== i) }))}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={newTeam} onChange={e => setNewTeam(e.target.value)} placeholder="Add team" className="flex-1" />
                    <Button size="sm" variant="secondary" onClick={() => { if (newTeam.trim()) { setForm(f => ({ ...f, previous_teams: [...f.previous_teams, newTeam.trim()] })); setNewTeam(''); } }}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {form.achievements.map((a, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        {a}
                        <button onClick={() => setForm(f => ({ ...f, achievements: f.achievements.filter((_, idx) => idx !== i) }))}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={newAchievement} onChange={e => setNewAchievement(e.target.value)} placeholder="Add achievement" className="flex-1" />
                    <Button size="sm" variant="secondary" onClick={() => { if (newAchievement.trim()) { setForm(f => ({ ...f, achievements: [...f.achievements, newAchievement.trim()] })); setNewAchievement(''); } }}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep('generate')}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={handleSave} disabled={createCV.isPending || updateCV.isPending}>
                Save & Preview <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && player && (
          <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {renderTemplate()}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep('edit')}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button onClick={() => setStep('export')}>
                Export & Share <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Export */}
        {step === 'export' && (
          <motion.div key="export" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="max-w-lg mx-auto space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-5">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-bold">Export & Share</h2>
                    <p className="text-muted-foreground text-sm">Download your CV or share it with scouts</p>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Public Link</span>
                      </div>
                      <Button size="sm" variant={existingCV?.is_published ? "destructive" : "default"} onClick={handlePublish}>
                        {existingCV?.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                    </div>
                    {existingCV?.is_published && (
                      <div className="flex gap-2">
                        <Input value={shareUrl} readOnly className="text-xs" />
                        <Button size="sm" variant="secondary" onClick={handleCopyLink}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => setStep('preview')}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back to Preview
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CV Preview Component ───
function CVPreview({
  form, cpi, techAvg, tacAvg, phyAvg, menAvg,
  globalRank, localRank, consistencyScore, improvementScore,
}: {
  form: any;
  cpi: number;
  techAvg: number;
  tacAvg: number;
  phyAvg: number;
  menAvg: number;
  globalRank?: number;
  localRank?: number;
  consistencyScore?: number;
  improvementScore?: number;
}) {
  return (
    <div className="bg-card border rounded-xl overflow-hidden max-w-3xl mx-auto">
      {/* CV Header */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent p-8 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{form.full_name}</h1>
            <p className="text-primary font-semibold mt-1">{form.position}</p>
            <p className="text-sm text-muted-foreground mt-1">{form.current_team}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-4xl font-black text-primary">{cpi}</div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">CPI Score</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Profile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Age', value: form.age },
            { label: 'Height', value: `${form.height}cm` },
            { label: 'Weight', value: `${form.weight}kg` },
            { label: 'Foot', value: form.preferred_foot },
          ].map(item => (
            <div key={item.label} className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="font-semibold mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        {form.bio && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Profile</h3>
            <p className="text-sm leading-relaxed">{form.bio}</p>
          </div>
        )}

        {/* Performance Metrics */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Performance Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Technical', value: techAvg, weight: '40%' },
              { label: 'Tactical', value: tacAvg, weight: '30%' },
              { label: 'Physical', value: phyAvg, weight: '20%' },
              { label: 'Mental', value: menAvg, weight: '10%' },
            ].map(m => (
              <div key={m.label} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold">{m.value}/10</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${m.value * 10}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-right">{m.weight} weight</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rankings */}
        {(globalRank || localRank) && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Rankings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {globalRank && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">#{globalRank}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Global Rank</p>
                </div>
              )}
              {localRank && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">#{localRank}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Local Rank</p>
                </div>
              )}
              {consistencyScore != null && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{Math.round(consistencyScore)}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Consistency</p>
                </div>
              )}
              {improvementScore != null && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{Math.round(improvementScore)}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Improvement</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {form.previous_teams.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Previous Teams</h3>
            <div className="flex flex-wrap gap-2">
              {form.previous_teams.map((t: string, i: number) => (
                <Badge key={i} variant="secondary">{t}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {form.achievements.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Achievements</h3>
            <ul className="space-y-1">
              {form.achievements.map((a: string, i: number) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlight Video */}
        {form.highlight_video_url && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Highlights</h3>
            <a href={form.highlight_video_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <Link2 className="h-3.5 w-3.5" /> Watch Highlight Reel
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t text-[10px] text-muted-foreground uppercase tracking-widest">
          Generated by Camino — Player Development Platform
        </div>
      </div>
    </div>
  );
}
