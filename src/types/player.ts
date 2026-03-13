export type UserRole = 'coach' | 'player' | 'parent';

export interface TechnicalMetrics {
  'First Touch': number;
  'Ball Control': number;
  'Passing Accuracy': number;
  'Dribbling': number;
  'Shooting Technique': number;
  'Weak Foot': number;
  '1v1 Attacking': number;
  '1v1 Defending': number;
}

export interface TacticalMetrics {
  'Positioning': number;
  'Decision Making': number;
  'Off-Ball Movement': number;
  'Defensive Awareness': number;
  'Game Understanding': number;
}

export interface PhysicalMetrics {
  '10m Sprint': number;
  '30m Sprint': number;
  'Agility': number;
  'Vertical Jump': number;
  'Endurance': number;
}

export interface MentalMetrics {
  'Confidence': number;
  'Work Ethic': number;
  'Coachability': number;
  'Leadership': number;
  'Resilience': number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: string;
  team: string;
  avatar: string;
  joinDate: string;
  nationality: string;
  preferredFoot: 'Left' | 'Right' | 'Both';
  height: number; // cm
  weight: number; // kg
  technical: TechnicalMetrics;
  tactical: TacticalMetrics;
  physical: PhysicalMetrics;
  mental: MentalMetrics;
  attendance: number;
  goals: DevelopmentGoal[];
  overallRating: number;
  cpiHistory: CPIEntry[];
  videos: VideoClip[];
  reports: ProgressReport[];
}

export interface CPIEntry {
  date: string;
  score: number;
  technical: number;
  tactical: number;
  physical: number;
  mental: number;
}

export interface DevelopmentGoal {
  id: string;
  title: string;
  description?: string;
  status: 'in-progress' | 'completed' | 'not-started';
  dueDate: string;
  category: 'technical' | 'tactical' | 'physical' | 'mental';
}

export interface VideoClip {
  id: string;
  title: string;
  type: 'match' | 'training' | 'highlight';
  date: string;
  duration: string;
  thumbnailUrl?: string;
  tags: string[];
  coachComment?: string;
}

export interface ProgressReport {
  id: string;
  playerId: string;
  date: string;
  quarter: string;
  summary: string;
  cpiScore: number;
  technicalRating: number;
  tacticalRating: number;
  physicalRating: number;
  mentalRating: number;
  improvementAreas: string[];
  coachFeedback: string;
  recommendations: string[];
  coach: string;
}

export interface TrainingSession {
  id: string;
  date: string;
  type: 'training' | 'match' | 'fitness';
  title: string;
  time: string;
  location: string;
}

export interface AttendanceRecord {
  sessionId: string;
  playerId: string;
  present: boolean;
}

export function calculateCPI(player: Player): number {
  const techValues = Object.values(player.technical);
  const tacValues = Object.values(player.tactical);
  const phyValues = Object.values(player.physical);
  const menValues = Object.values(player.mental);

  const techAvg = techValues.reduce((a, b) => a + b, 0) / techValues.length;
  const tacAvg = tacValues.reduce((a, b) => a + b, 0) / tacValues.length;
  const phyAvg = phyValues.reduce((a, b) => a + b, 0) / phyValues.length;
  const menAvg = menValues.reduce((a, b) => a + b, 0) / menValues.length;

  // CPI: 40% technical, 30% tactical, 20% physical, 10% mental
  // Scale from 1-10 avg to 0-100
  const cpi = (techAvg * 0.4 + tacAvg * 0.3 + phyAvg * 0.2 + menAvg * 0.1) * 10;
  return Math.round(cpi * 10) / 10;
}

export function getCategoryAverage(metrics: Record<string, number>): number {
  const values = Object.values(metrics);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
