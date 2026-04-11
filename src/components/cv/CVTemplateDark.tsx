import { Link2, Trophy, TrendingUp, Target, Zap } from 'lucide-react';
import type { CVTemplateProps } from './CVTemplateClassic';

export function CVTemplateDark({
  form, cpi, techAvg, tacAvg, phyAvg, menAvg,
  globalRank, localRank, consistencyScore, improvementScore,
}: CVTemplateProps) {
  const metrics = [
    { label: 'Technical', value: techAvg, icon: Target, color: '#3b82f6' },
    { label: 'Tactical', value: tacAvg, icon: Zap, color: '#8b5cf6' },
    { label: 'Physical', value: phyAvg, icon: TrendingUp, color: '#10b981' },
    { label: 'Mental', value: menAvg, icon: Trophy, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-3xl mx-auto rounded-xl overflow-hidden" style={{ background: '#0a0e1a' }}>
      {/* Header — dramatic gradient */}
      <div className="relative px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0a0e1a 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, #3b82f6, transparent 60%)' }} />
        <div className="relative flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: '#3b82f6' }}>Player Profile</p>
            <h1 className="text-4xl font-black tracking-tight text-white">{form.full_name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-semibold" style={{ color: '#3b82f6' }}>{form.position}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-sm text-white/50">{form.current_team}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black" style={{ color: '#3b82f6' }}>{cpi}</div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mt-1">CPI Score</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Age', value: form.age },
            { label: 'Height', value: `${form.height}cm` },
            { label: 'Weight', value: `${form.weight}kg` },
            { label: 'Foot', value: form.preferred_foot },
          ].map(item => (
            <div key={item.label} className="rounded-lg p-3 text-center" style={{ background: '#111628', border: '1px solid #1e2540' }}>
              <p className="text-[9px] uppercase tracking-widest text-white/30">{item.label}</p>
              <p className="font-bold text-white mt-1 text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        {form.bio && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: '#3b82f6' }}>Profile</h3>
            <p className="text-sm leading-relaxed text-white/60">{form.bio}</p>
          </div>
        )}

        {/* Performance Metrics — visual bars */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: '#3b82f6' }}>Performance Metrics</h3>
          <div className="space-y-4">
            {metrics.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                    <Icon className="h-4 w-4" style={{ color: m.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/50">{m.label}</span>
                      <span className="font-bold text-white">{m.value}/10</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#111628' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.value * 10}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rankings */}
        {(globalRank || localRank) && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: '#3b82f6' }}>Rankings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {globalRank && (
                <div className="rounded-lg p-4 text-center" style={{ background: '#111628', border: '1px solid #1e2540' }}>
                  <p className="text-2xl font-black text-white">#{globalRank}</p>
                  <p className="text-[9px] uppercase text-white/30 mt-1">Global</p>
                </div>
              )}
              {localRank && (
                <div className="rounded-lg p-4 text-center" style={{ background: '#111628', border: '1px solid #1e2540' }}>
                  <p className="text-2xl font-black text-white">#{localRank}</p>
                  <p className="text-[9px] uppercase text-white/30 mt-1">Local</p>
                </div>
              )}
              {consistencyScore != null && (
                <div className="rounded-lg p-4 text-center" style={{ background: '#111628', border: '1px solid #1e2540' }}>
                  <p className="text-2xl font-black text-white">{Math.round(consistencyScore)}</p>
                  <p className="text-[9px] uppercase text-white/30 mt-1">Consistency</p>
                </div>
              )}
              {improvementScore != null && (
                <div className="rounded-lg p-4 text-center" style={{ background: '#111628', border: '1px solid #1e2540' }}>
                  <p className="text-2xl font-black text-white">{Math.round(improvementScore)}</p>
                  <p className="text-[9px] uppercase text-white/30 mt-1">Improvement</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Teams */}
        {form.previous_teams.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: '#3b82f6' }}>Previous Teams</h3>
            <div className="flex flex-wrap gap-2">
              {form.previous_teams.map((t: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-md text-xs font-medium text-white/70" style={{ background: '#111628', border: '1px solid #1e2540' }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {form.achievements.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: '#3b82f6' }}>Achievements</h3>
            <ul className="space-y-1.5">
              {form.achievements.map((a: string, i: number) => (
                <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlights */}
        {form.highlight_video_url && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: '#3b82f6' }}>Highlights</h3>
            <a href={form.highlight_video_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: '#3b82f6' }}>
              <Link2 className="h-3.5 w-3.5" /> Watch Highlight Reel
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 text-[9px] uppercase tracking-[0.3em]" style={{ borderTop: '1px solid #1e2540', color: '#ffffff20' }}>
          Generated by Camino — Player Development Platform
        </div>
      </div>
    </div>
  );
}
