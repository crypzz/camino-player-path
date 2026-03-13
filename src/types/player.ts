export type UserRole = 'coach' | 'player' | 'parent';

export interface Player {
  id: string;
  name: string;
  age: number;
  position: string;
  team: string;
  avatar: string;
  joinDate: string;
  technical: PlayerMetrics;
  tactical: PlayerMetrics;
  physical: PlayerMetrics;
  mental: PlayerMetrics;
  attendance: number;
  goals: DevelopmentGoal[];
  overallRating: number;
}

export interface PlayerMetrics {
  [key: string]: number;
}

export interface DevelopmentGoal {
  id: string;
  title: string;
  status: 'in-progress' | 'completed' | 'not-started';
  dueDate: string;
}

export interface ProgressReport {
  id: string;
  playerId: string;
  date: string;
  summary: string;
  rating: number;
  coach: string;
}
