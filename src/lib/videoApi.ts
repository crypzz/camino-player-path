export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:8000";

export type MatchStatus = "pending" | "processing" | "complete" | "error";

export interface MatchRow {
  id: string;
  name: string;
  date: string;
  team: string | null;
  notes: string | null;
  video_url: string | null;
  status: MatchStatus;
  created_by: string | null;
  created_at: string;
}

export interface TrackRow {
  id: string;
  match_id: string;
  track_id: number;
  player_id: string | null;
  created_at: string;
}

export interface PlayerVideoRow {
  id: string;
  name: string;
  position: string | null;
  avatar_url: string | null;
  team: string | null;
  created_at: string;
}

export interface VideoStatRow {
  id: string;
  match_id: string;
  player_id: string | null;
  track_id: number | null;
  touches: number;
  distance_m: number;
  possession_seconds: number;
  created_at: string;
}

export const statusStyles: Record<MatchStatus, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  processing: "bg-primary/15 text-primary border-primary/30",
  complete: "bg-success/15 text-success border-success/30",
  error: "bg-destructive/15 text-destructive border-destructive/30",
};
