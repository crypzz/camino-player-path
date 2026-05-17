// Maps raw fitness test values to a 1-10 score using the same
// formulas as the `update_physical_from_fitness` DB trigger so the UI
// preview matches what's stored.

export type FitnessMetric =
  | 'sprint_10m'
  | 'sprint_30m'
  | 'agility_time'
  | 'vertical_jump'
  | 'endurance_distance'
  | 'beep_test_level';

const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)));

export function scoreFitness(metric: FitnessMetric, raw: number | null | undefined): number | null {
  if (raw === null || raw === undefined || Number.isNaN(raw)) return null;
  switch (metric) {
    case 'sprint_10m':
      return clamp(11 - (raw - 1.4) * 9);
    case 'sprint_30m':
      return clamp(11 - (raw - 3.6) * 5.3);
    case 'agility_time':
      return clamp(11 - (raw - 7.5) * 1.8);
    case 'vertical_jump':
      return clamp((raw - 15) / 5);
    case 'endurance_distance':
      return clamp((raw - 1400) / 180);
    case 'beep_test_level':
      // 5 -> ~3, 10 -> ~7, 13 -> 10
      return clamp((raw - 3) * 1);
  }
}

export function scoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground/50';
  if (score <= 3) return 'text-red-400';
  if (score <= 6) return 'text-amber-400';
  if (score <= 8) return 'text-emerald-400';
  return 'text-primary';
}
