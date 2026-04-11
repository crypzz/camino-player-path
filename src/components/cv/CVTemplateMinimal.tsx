import { Link2 } from 'lucide-react';
import type { CVTemplateProps } from './CVTemplateClassic';

export function CVTemplateMinimal({
  form, cpi, techAvg, tacAvg, phyAvg, menAvg,
  globalRank, localRank, consistencyScore, improvementScore,
}: CVTemplateProps) {
  const accent = '#E8B400'; // gold accent

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #e5e5e5' }}>
      {/* Header — left accent bar */}
      <div className="flex">
        <div className="w-1.5 shrink-0" style={{ background: accent }} />
        <div className="flex-1 px-8 py-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{form.full_name}</h1>
            <p className="text-sm font-semibold mt-1" style={{ color: accent }}>{form.position}</p>
            <p className="text-xs text-gray-400 mt-0.5">{form.current_team}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-4xl font-black" style={{ color: accent }}>{cpi}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-300">/100</span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Performance Index</p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-7">
        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Profile grid */}
        <div className="grid grid-cols-4 gap-6 text-center">
          {[
            { label: 'Age', value: form.age },
            { label: 'Height', value: `${form.height}cm` },
            { label: 'Weight', value: `${form.weight}kg` },
            { label: 'Foot', value: form.preferred_foot },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[9px] uppercase tracking-widest text-gray-300">{item.label}</p>
              <p className="font-semibold text-gray-900 mt-0.5 text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        {form.bio && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: accent }}>Profile</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{form.bio}</p>
          </div>
        )}

        {/* Performance — clean horizontal bars */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: accent }}>Performance Metrics</h3>
          <div className="space-y-3">
            {[
              { label: 'Technical', value: techAvg, weight: '40%' },
              { label: 'Tactical', value: tacAvg, weight: '30%' },
              { label: 'Physical', value: phyAvg, weight: '20%' },
              { label: 'Mental', value: menAvg, weight: '10%' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 font-medium">{m.label} <span className="text-gray-300">({m.weight})</span></span>
                  <span className="font-bold text-gray-900">{m.value}</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.value * 10}%`, background: accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rankings */}
        {(globalRank || localRank) && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: accent }}>Rankings</h3>
            <div className="flex gap-6">
              {globalRank && (
                <div>
                  <p className="text-2xl font-black text-gray-900">#{globalRank}</p>
                  <p className="text-[9px] uppercase text-gray-300">Global</p>
                </div>
              )}
              {localRank && (
                <div>
                  <p className="text-2xl font-black text-gray-900">#{localRank}</p>
                  <p className="text-[9px] uppercase text-gray-300">Local</p>
                </div>
              )}
              {consistencyScore != null && (
                <div>
                  <p className="text-2xl font-black text-gray-900">{Math.round(consistencyScore)}</p>
                  <p className="text-[9px] uppercase text-gray-300">Consistency</p>
                </div>
              )}
              {improvementScore != null && (
                <div>
                  <p className="text-2xl font-black text-gray-900">{Math.round(improvementScore)}</p>
                  <p className="text-[9px] uppercase text-gray-300">Improvement</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Teams */}
        {form.previous_teams.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: accent }}>Previous Teams</h3>
            <div className="flex flex-wrap gap-2">
              {form.previous_teams.map((t: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded text-xs font-medium text-gray-600" style={{ background: '#faf5e4', border: `1px solid ${accent}30` }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {form.achievements.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: accent }}>Achievements</h3>
            <ul className="space-y-1">
              {form.achievements.map((a: string, i: number) => (
                <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlights */}
        {form.highlight_video_url && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: accent }}>Highlights</h3>
            <a href={form.highlight_video_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: accent }}>
              <Link2 className="h-3.5 w-3.5" /> Watch Highlight Reel
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-5" style={{ borderTop: '1px solid #f0f0f0' }}>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-300">
            Generated by Camino — Player Development Platform
          </p>
        </div>
      </div>
    </div>
  );
}
