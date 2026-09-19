import { useParams, useSearchParams } from 'react-router-dom';
import { usePlayerCVBySlug } from '@/hooks/usePlayerCV';
import { useEffect } from 'react';
import { Link2, Mail, Phone, MapPin, Flag, AtSign } from 'lucide-react';

type Theme = {
  page: string;
  card: string;
  accent: string;
  heading: string;
  body: string;
  muted: string;
  line: string;
  chip: string;
  track: string;
};

const THEMES: Record<string, Theme> = {
  classic: {
    page: '#ffffff',
    card: '#f7f7f8',
    accent: '#111827',
    heading: '#111827',
    body: '#374151',
    muted: '#9ca3af',
    line: '#e5e7eb',
    chip: '#f3f4f6',
    track: '#e5e7eb',
  },
  minimal: {
    page: '#ffffff',
    card: '#fbf8ee',
    accent: '#E8B400',
    heading: '#111827',
    body: '#4b5563',
    muted: '#9ca3af',
    line: '#f0f0f0',
    chip: '#faf5e4',
    track: '#f1f1f1',
  },
  dark: {
    page: '#0a0e1a',
    card: '#111628',
    accent: '#3b82f6',
    heading: '#ffffff',
    body: 'rgba(255,255,255,0.72)',
    muted: 'rgba(255,255,255,0.35)',
    line: '#1e2540',
    chip: '#151b30',
    track: '#1e2540',
  },
};

export default function PublicCVPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: cv, isLoading } = usePlayerCVBySlug(slug || null);
  const isPrint = searchParams.get('print') === '1';

  useEffect(() => {
    if (isPrint && cv) {
      setTimeout(() => window.print(), 600);
    }
  }, [isPrint, cv]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-gray-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        CV not found or not published.
      </div>
    );
  }

  const t = THEMES[cv.template as string] ?? THEMES.classic;
  return <CVDocument cv={cv} t={t} />;
}

function SectionTitle({ t, children }: { t: Theme; children: React.ReactNode }) {
  return (
    <h3
      className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-3"
      style={{ color: t.accent }}
    >
      {children}
    </h3>
  );
}

function StatBar({ t, label, value, weight }: { t: Theme; label: string; value: number; weight: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: t.muted }}>
          {label} <span style={{ opacity: 0.7 }}>({weight})</span>
        </span>
        <span className="font-bold tabular-nums" style={{ color: t.heading }}>
          {value.toFixed(1)}<span style={{ color: t.muted }}>/10</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.track }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, value * 10)}%`, background: t.accent }} />
      </div>
    </div>
  );
}

function Tile({ t, label, value }: { t: Theme; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ background: t.card, border: `1px solid ${t.line}` }}>
      <p className="text-[9px] uppercase tracking-widest" style={{ color: t.muted }}>{label}</p>
      <p className="font-bold mt-1 text-sm" style={{ color: t.heading }}>{value}</p>
    </div>
  );
}

function CVDocument({ cv, t }: { cv: any; t: Theme }) {
  const metrics = [
    { label: 'Technical', value: Number(cv.technical_score), weight: '40%' },
    { label: 'Tactical', value: Number(cv.tactical_score), weight: '30%' },
    { label: 'Physical', value: Number(cv.physical_score), weight: '20%' },
    { label: 'Mental', value: Number(cv.mental_score), weight: '10%' },
  ].filter((m) => Number.isFinite(m.value) && m.value > 0);

  const contact = [
    { icon: Mail, label: 'Email', value: cv.contact_email, href: `mailto:${cv.contact_email}` },
    { icon: Phone, label: 'Phone', value: cv.contact_phone, href: `tel:${cv.contact_phone}` },
    { icon: MapPin, label: 'Location', value: cv.location },
    { icon: Flag, label: 'Nationality', value: cv.nationality },
    { icon: AtSign, label: 'Social', value: cv.social_handle },
  ].filter((c) => !!c.value);

  const ranks = [
    { label: 'Global Rank', value: cv.global_rank ? `#${cv.global_rank}` : null },
    { label: 'Local Rank', value: cv.local_rank ? `#${cv.local_rank}` : null },
  ].filter((r) => r.value);

  return (
    <div className="min-h-screen print:bg-white" style={{ background: t.page }}>
      <div className="max-w-[820px] mx-auto p-6 sm:p-12">
        {/* Header */}
        <div className="pb-7 mb-8 flex items-start justify-between gap-6" style={{ borderBottom: `1px solid ${t.line}` }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: t.accent }}>Player CV</p>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: t.heading }}>{cv.full_name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
              <span className="font-semibold" style={{ color: t.accent }}>{cv.position}</span>
              {cv.current_team && (
                <>
                  <span className="w-1 h-1 rounded-full" style={{ background: t.muted }} />
                  <span style={{ color: t.muted }}>{cv.current_team}</span>
                </>
              )}
            </div>
          </div>
          {Number(cv.cpi) > 0 && (
            <div className="text-right shrink-0">
              <div className="text-4xl font-black" style={{ color: t.accent }}>{Math.round(Number(cv.cpi))}</div>
              <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: t.muted }}>CPI Score</p>
            </div>
          )}
        </div>

        {/* Vitals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Tile t={t} label="Age" value={cv.age || '—'} />
          <Tile t={t} label="Height" value={cv.height ? `${cv.height} cm` : '—'} />
          <Tile t={t} label="Weight" value={cv.weight ? `${cv.weight} kg` : '—'} />
          <Tile t={t} label="Foot" value={cv.preferred_foot || '—'} />
        </div>

        {cv.bio && (
          <div className="mb-8">
            <SectionTitle t={t}>Profile</SectionTitle>
            <p className="text-sm leading-relaxed" style={{ color: t.body }}>{cv.bio}</p>
          </div>
        )}

        {metrics.length > 0 && (
          <div className="mb-8">
            <SectionTitle t={t}>Performance Metrics</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {metrics.map((m) => (
                <StatBar key={m.label} t={t} label={m.label} value={m.value} weight={m.weight} />
              ))}
            </div>
          </div>
        )}

        {ranks.length > 0 && (
          <div className="mb-8">
            <SectionTitle t={t}>Rankings</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ranks.map((r) => (
                <Tile key={r.label} t={t} label={r.label} value={r.value!} />
              ))}
            </div>
          </div>
        )}

        {/* Career history */}
        {(cv.current_team || cv.previous_teams?.length > 0) && (
          <div className="mb-8">
            <SectionTitle t={t}>Career History</SectionTitle>
            <div className="space-y-0">
              {[
                ...(cv.current_team ? [{ team: cv.current_team, current: true }] : []),
                ...((cv.previous_teams ?? []) as string[]).map((team) => ({ team, current: false })),
              ].map((row, i) => (
                <div
                  key={`${row.team}-${i}`}
                  className="flex items-center gap-3 py-2.5"
                  style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.line}` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: row.current ? t.accent : t.muted }} />
                  <span className="text-sm flex-1" style={{ color: t.heading }}>{row.team}</span>
                  <span
                    className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{
                      color: row.current ? t.accent : t.muted,
                      background: row.current ? t.chip : 'transparent',
                    }}
                  >
                    {row.current ? 'Current' : 'Previous'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cv.achievements?.length > 0 && (
          <div className="mb-8">
            <SectionTitle t={t}>Achievements</SectionTitle>
            <ul className="space-y-1.5">
              {cv.achievements.map((a: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: t.body }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: t.accent }} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {cv.highlight_video_url && (
          <div className="mb-8">
            <SectionTitle t={t}>Highlights</SectionTitle>
            <a
              href={cv.highlight_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              style={{ color: t.accent }}
            >
              <Link2 className="h-3.5 w-3.5" /> Watch Highlight Reel
            </a>
          </div>
        )}

        {contact.length > 0 && (
          <div className="mb-8">
            <SectionTitle t={t}>Contact</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {contact.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                  style={{ background: t.card, border: `1px solid ${t.line}` }}
                >
                  <c.icon className="h-4 w-4 shrink-0" style={{ color: t.accent }} />
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-widest" style={{ color: t.muted }}>{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-medium hover:underline break-all" style={{ color: t.heading }}>
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium break-all" style={{ color: t.heading }}>{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-6 mt-10" style={{ borderTop: `1px solid ${t.line}` }}>
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: t.muted }}>
            Generated by Camino — Player Development Platform
          </p>
        </div>
      </div>
    </div>
  );
}
