import { Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CVTemplateProps {
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
}

export function CVTemplateClassic({
  form, cpi, techAvg, tacAvg, phyAvg, menAvg,
  globalRank, localRank, consistencyScore, improvementScore,
}: CVTemplateProps) {
  return (
    <div className="bg-card border rounded-xl overflow-hidden max-w-3xl mx-auto">
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

        {form.bio && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Profile</h3>
            <p className="text-sm leading-relaxed">{form.bio}</p>
          </div>
        )}

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

        {form.highlight_video_url && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Highlights</h3>
            <a href={form.highlight_video_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <Link2 className="h-3.5 w-3.5" /> Watch Highlight Reel
            </a>
          </div>
        )}

        <div className="text-center pt-4 border-t text-[10px] text-muted-foreground uppercase tracking-widest">
          Generated by Camino — Player Development Platform
        </div>
      </div>
    </div>
  );
}

export type { CVTemplateProps };
