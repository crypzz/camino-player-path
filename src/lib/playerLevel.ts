export interface PlayerLevel {
  level: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Elite';
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  progress: number; // 0-100 progress to next level
}

const TIERS = [
  { name: 'Bronze' as const, minLevel: 1, maxLevel: 2, color: 'hsl(30, 60%, 50%)' },
  { name: 'Silver' as const, minLevel: 3, maxLevel: 4, color: 'hsl(220, 10%, 65%)' },
  { name: 'Gold' as const, minLevel: 5, maxLevel: 6, color: 'hsl(45, 100%, 58%)' },
  { name: 'Platinum' as const, minLevel: 7, maxLevel: 8, color: 'hsl(200, 40%, 70%)' },
  { name: 'Elite' as const, minLevel: 9, maxLevel: 10, color: 'hsl(275, 65%, 55%)' },
];

const TIER_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  Bronze: { bg: 'bg-orange-900/20', border: 'border-orange-700/40', text: 'text-orange-400' },
  Silver: { bg: 'bg-slate-500/15', border: 'border-slate-400/30', text: 'text-slate-300' },
  Gold: { bg: 'bg-primary/15', border: 'border-primary/40', text: 'text-primary' },
  Platinum: { bg: 'bg-cyan-500/15', border: 'border-cyan-400/30', text: 'text-cyan-300' },
  Elite: { bg: 'bg-purple-500/15', border: 'border-purple-400/30', text: 'text-purple-400' },
};

/**
 * Calculate player level (1-10) based on:
 * - CPI score (0-100) → 50% weight
 * - Total evaluations → 25% weight
 * - Total fitness tests → 25% weight
 */
export function calculatePlayerLevel(
  cpi: number,
  evaluationCount: number,
  fitnessTestCount: number
): PlayerLevel {
  // CPI component: 0-100 → 0-5 points
  const cpiPoints = Math.min(cpi / 20, 5);

  // Activity component: evaluations (0-2.5 points, max at 10 evals)
  const evalPoints = Math.min(evaluationCount / 4, 2.5);

  // Fitness component: fitness tests (0-2.5 points, max at 8 tests)
  const fitnessPoints = Math.min(fitnessTestCount / 3.2, 2.5);

  const rawScore = cpiPoints + evalPoints + fitnessPoints; // 0-10
  const level = Math.max(1, Math.min(10, Math.ceil(rawScore)));

  const tier = TIERS.find(t => level >= t.minLevel && level <= t.maxLevel) || TIERS[0];
  const styles = TIER_STYLES[tier.name];

  // Progress within current level
  const progress = Math.round((rawScore - Math.floor(rawScore)) * 100);

  return {
    level,
    tier: tier.name,
    label: `${tier.name} ${level <= tier.maxLevel && level > tier.minLevel ? 'II' : 'I'}`,
    color: tier.color,
    bgClass: styles.bg,
    borderClass: styles.border,
    textClass: styles.text,
    progress,
  };
}
