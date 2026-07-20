export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics_coaching_insights: {
        Row: {
          analytics_player_id: string | null
          comparison_delta: Json | null
          created_at: string
          id: string
          match_id: string
          model_used: string | null
          player_id: string | null
          strengths: Json | null
          summary: string | null
          training_priorities: Json | null
          trend: string | null
          weaknesses: Json | null
        }
        Insert: {
          analytics_player_id?: string | null
          comparison_delta?: Json | null
          created_at?: string
          id?: string
          match_id: string
          model_used?: string | null
          player_id?: string | null
          strengths?: Json | null
          summary?: string | null
          training_priorities?: Json | null
          trend?: string | null
          weaknesses?: Json | null
        }
        Update: {
          analytics_player_id?: string | null
          comparison_delta?: Json | null
          created_at?: string
          id?: string
          match_id?: string
          model_used?: string | null
          player_id?: string | null
          strengths?: Json | null
          summary?: string | null
          training_priorities?: Json | null
          trend?: string | null
          weaknesses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_coaching_insights_analytics_player_id_fkey"
            columns: ["analytics_player_id"]
            isOneToOne: false
            referencedRelation: "analytics_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_coaching_insights_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "analytics_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_coaching_insights_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_coaching_insights_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          analytics_player_id: string | null
          confidence: number | null
          created_at: string
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id: string
          match_id: string
          meta: Json | null
          outcome: string | null
          t_end: number | null
          t_start: number
          target_player_id: string | null
          track_id: number | null
          x: number | null
          xg: number | null
          y: number | null
        }
        Insert: {
          analytics_player_id?: string | null
          confidence?: number | null
          created_at?: string
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          match_id: string
          meta?: Json | null
          outcome?: string | null
          t_end?: number | null
          t_start: number
          target_player_id?: string | null
          track_id?: number | null
          x?: number | null
          xg?: number | null
          y?: number | null
        }
        Update: {
          analytics_player_id?: string | null
          confidence?: number | null
          created_at?: string
          event_type?: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          match_id?: string
          meta?: Json | null
          outcome?: string | null
          t_end?: number | null
          t_start?: number
          target_player_id?: string | null
          track_id?: number | null
          x?: number | null
          xg?: number | null
          y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_analytics_player_id_fkey"
            columns: ["analytics_player_id"]
            isOneToOne: false
            referencedRelation: "analytics_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "analytics_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_target_player_id_fkey"
            columns: ["target_player_id"]
            isOneToOne: false
            referencedRelation: "analytics_players"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_frames: {
        Row: {
          frame_number: number
          has_ball: boolean
          id: number
          match_id: string
          t_seconds: number
          track_id: number
          x: number
          y: number
        }
        Insert: {
          frame_number: number
          has_ball?: boolean
          id?: number
          match_id: string
          t_seconds: number
          track_id: number
          x: number
          y: number
        }
        Update: {
          frame_number?: number
          has_ball?: boolean
          id?: number
          match_id?: string
          t_seconds?: number
          track_id?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_frames_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "analytics_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_highlight_clips: {
        Row: {
          analytics_player_id: string | null
          created_at: string
          event_id: string | null
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id: string
          match_id: string
          player_id: string | null
          storage_path: string
          t_end: number
          t_start: number
          thumbnail_path: string | null
        }
        Insert: {
          analytics_player_id?: string | null
          created_at?: string
          event_id?: string | null
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          match_id: string
          player_id?: string | null
          storage_path: string
          t_end: number
          t_start: number
          thumbnail_path?: string | null
        }
        Update: {
          analytics_player_id?: string | null
          created_at?: string
          event_id?: string | null
          event_type?: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          match_id?: string
          player_id?: string | null
          storage_path?: string
          t_end?: number
          t_start?: number
          thumbnail_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_highlight_clips_analytics_player_id_fkey"
            columns: ["analytics_player_id"]
            isOneToOne: false
            referencedRelation: "analytics_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_highlight_clips_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "analytics_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_highlight_clips_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "analytics_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_highlight_clips_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_highlight_clips_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_matches: {
        Row: {
          away_team: string | null
          club_id: string | null
          created_at: string
          created_by: string
          duration_seconds: number | null
          error_message: string | null
          fps: number | null
          home_team: string | null
          id: string
          match_date: string | null
          model_version: string | null
          status: Database["public"]["Enums"]["analytics_match_status"]
          title: string
          updated_at: string
          video_url: string
          worker_job_id: string | null
        }
        Insert: {
          away_team?: string | null
          club_id?: string | null
          created_at?: string
          created_by: string
          duration_seconds?: number | null
          error_message?: string | null
          fps?: number | null
          home_team?: string | null
          id?: string
          match_date?: string | null
          model_version?: string | null
          status?: Database["public"]["Enums"]["analytics_match_status"]
          title: string
          updated_at?: string
          video_url: string
          worker_job_id?: string | null
        }
        Update: {
          away_team?: string | null
          club_id?: string | null
          created_at?: string
          created_by?: string
          duration_seconds?: number | null
          error_message?: string | null
          fps?: number | null
          home_team?: string | null
          id?: string
          match_date?: string | null
          model_version?: string | null
          status?: Database["public"]["Enums"]["analytics_match_status"]
          title?: string
          updated_at?: string
          video_url?: string
          worker_job_id?: string | null
        }
        Relationships: []
      }
      analytics_player_match_stats: {
        Row: {
          aerials: number | null
          aerials_won: number | null
          analytics_player_id: string
          assists: number | null
          clearances: number | null
          corners: number | null
          created_at: string
          crosses: number | null
          distance_m: number | null
          dribbles: number | null
          duels: number | null
          duels_won: number | null
          fouls: number | null
          goals: number | null
          heatmap: Json | null
          id: string
          interceptions: number | null
          key_passes: number | null
          match_id: string
          minutes_played: number | null
          offsides: number | null
          pass_accuracy: number | null
          passes: number | null
          passes_completed: number | null
          player_id: string | null
          rating: number | null
          recoveries: number | null
          saves: number | null
          shot_accuracy: number | null
          shots: number | null
          shots_on_target: number | null
          sprint_count: number | null
          tackles: number | null
          throw_ins: number | null
          touches: number | null
          touchmap: Json | null
          updated_at: string
        }
        Insert: {
          aerials?: number | null
          aerials_won?: number | null
          analytics_player_id: string
          assists?: number | null
          clearances?: number | null
          corners?: number | null
          created_at?: string
          crosses?: number | null
          distance_m?: number | null
          dribbles?: number | null
          duels?: number | null
          duels_won?: number | null
          fouls?: number | null
          goals?: number | null
          heatmap?: Json | null
          id?: string
          interceptions?: number | null
          key_passes?: number | null
          match_id: string
          minutes_played?: number | null
          offsides?: number | null
          pass_accuracy?: number | null
          passes?: number | null
          passes_completed?: number | null
          player_id?: string | null
          rating?: number | null
          recoveries?: number | null
          saves?: number | null
          shot_accuracy?: number | null
          shots?: number | null
          shots_on_target?: number | null
          sprint_count?: number | null
          tackles?: number | null
          throw_ins?: number | null
          touches?: number | null
          touchmap?: Json | null
          updated_at?: string
        }
        Update: {
          aerials?: number | null
          aerials_won?: number | null
          analytics_player_id?: string
          assists?: number | null
          clearances?: number | null
          corners?: number | null
          created_at?: string
          crosses?: number | null
          distance_m?: number | null
          dribbles?: number | null
          duels?: number | null
          duels_won?: number | null
          fouls?: number | null
          goals?: number | null
          heatmap?: Json | null
          id?: string
          interceptions?: number | null
          key_passes?: number | null
          match_id?: string
          minutes_played?: number | null
          offsides?: number | null
          pass_accuracy?: number | null
          passes?: number | null
          passes_completed?: number | null
          player_id?: string | null
          rating?: number | null
          recoveries?: number | null
          saves?: number | null
          shot_accuracy?: number | null
          shots?: number | null
          shots_on_target?: number | null
          sprint_count?: number | null
          tackles?: number | null
          throw_ins?: number | null
          touches?: number | null
          touchmap?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_player_match_stats_analytics_player_id_fkey"
            columns: ["analytics_player_id"]
            isOneToOne: false
            referencedRelation: "analytics_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_player_match_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "analytics_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_player_match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_player_season_stats: {
        Row: {
          aerials_won: number | null
          assists: number | null
          avg_rating: number | null
          clearances: number | null
          crosses: number | null
          distance_m: number | null
          dribbles: number | null
          duels_won: number | null
          fouls: number | null
          goals: number | null
          id: string
          interceptions: number | null
          key_passes: number | null
          matches_played: number | null
          passes: number | null
          passes_completed: number | null
          player_id: string
          recoveries: number | null
          saves: number | null
          season: string
          shots: number | null
          tackles: number | null
          touches: number | null
          updated_at: string
        }
        Insert: {
          aerials_won?: number | null
          assists?: number | null
          avg_rating?: number | null
          clearances?: number | null
          crosses?: number | null
          distance_m?: number | null
          dribbles?: number | null
          duels_won?: number | null
          fouls?: number | null
          goals?: number | null
          id?: string
          interceptions?: number | null
          key_passes?: number | null
          matches_played?: number | null
          passes?: number | null
          passes_completed?: number | null
          player_id: string
          recoveries?: number | null
          saves?: number | null
          season: string
          shots?: number | null
          tackles?: number | null
          touches?: number | null
          updated_at?: string
        }
        Update: {
          aerials_won?: number | null
          assists?: number | null
          avg_rating?: number | null
          clearances?: number | null
          crosses?: number | null
          distance_m?: number | null
          dribbles?: number | null
          duels_won?: number | null
          fouls?: number | null
          goals?: number | null
          id?: string
          interceptions?: number | null
          key_passes?: number | null
          matches_played?: number | null
          passes?: number | null
          passes_completed?: number | null
          player_id?: string
          recoveries?: number | null
          saves?: number | null
          season?: string
          shots?: number | null
          tackles?: number | null
          touches?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_player_season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_player_season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_players: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          jersey_number: number | null
          match_id: string
          player_id: string | null
          position: string | null
          team_side: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          jersey_number?: number | null
          match_id: string
          player_id?: string | null
          position?: string | null
          team_side?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          jersey_number?: number | null
          match_id?: string
          player_id?: string | null
          position?: string | null
          team_side?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "analytics_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_tracks: {
        Row: {
          analytics_player_id: string | null
          created_at: string
          first_frame: number | null
          frame_count: number | null
          id: string
          last_frame: number | null
          match_id: string
          track_id: number
        }
        Insert: {
          analytics_player_id?: string | null
          created_at?: string
          first_frame?: number | null
          frame_count?: number | null
          id?: string
          last_frame?: number | null
          match_id: string
          track_id: number
        }
        Update: {
          analytics_player_id?: string | null
          created_at?: string
          first_frame?: number | null
          frame_count?: number | null
          id?: string
          last_frame?: number | null
          match_id?: string
          track_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_tracks_analytics_player_id_fkey"
            columns: ["analytics_player_id"]
            isOneToOne: false
            referencedRelation: "analytics_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_tracks_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "analytics_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_reads: {
        Row: {
          announcement_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          pinned: boolean
          target_team_id: string | null
          target_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          pinned?: boolean
          target_team_id?: string | null
          target_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          pinned?: boolean
          target_team_id?: string | null
          target_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_target_team_id_fkey"
            columns: ["target_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          created_at: string
          id: string
          player_id: string
          present: boolean
          recorded_by: string
          session_date: string
          session_id: string | null
          session_title: string
          session_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          player_id: string
          present?: boolean
          recorded_by: string
          session_date: string
          session_id?: string | null
          session_title?: string
          session_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          player_id?: string
          present?: boolean
          recorded_by?: string
          session_date?: string
          session_id?: string | null
          session_title?: string
          session_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "schedule_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      cmsa_age_groups: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label: string
          source_url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id: string
          label: string
          source_url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          source_url?: string
        }
        Relationships: []
      }
      cmsa_match_goals: {
        Row: {
          age_group_id: string
          assists: number
          created_at: string
          goals: number
          id: string
          logged_by: string
          match_date: string
          notes: string | null
          opponent: string | null
          played: boolean
          player_name: string
          team_id: string
          tier: string
        }
        Insert: {
          age_group_id: string
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          logged_by: string
          match_date?: string
          notes?: string | null
          opponent?: string | null
          played?: boolean
          player_name: string
          team_id: string
          tier: string
        }
        Update: {
          age_group_id?: string
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          logged_by?: string
          match_date?: string
          notes?: string | null
          opponent?: string | null
          played?: boolean
          player_name?: string
          team_id?: string
          tier?: string
        }
        Relationships: []
      }
      cmsa_match_results: {
        Row: {
          age_group_id: string | null
          away_score: number | null
          away_team_external_id: string | null
          away_team_id: string | null
          game_key: string
          home_score: number | null
          home_team_external_id: string | null
          home_team_id: string | null
          id: string
          match_date: string | null
          played: boolean
          scraped_at: string
          tier: string | null
        }
        Insert: {
          age_group_id?: string | null
          away_score?: number | null
          away_team_external_id?: string | null
          away_team_id?: string | null
          game_key: string
          home_score?: number | null
          home_team_external_id?: string | null
          home_team_id?: string | null
          id?: string
          match_date?: string | null
          played?: boolean
          scraped_at?: string
          tier?: string | null
        }
        Update: {
          age_group_id?: string | null
          away_score?: number | null
          away_team_external_id?: string | null
          away_team_id?: string | null
          game_key?: string
          home_score?: number | null
          home_team_external_id?: string | null
          home_team_id?: string | null
          id?: string
          match_date?: string | null
          played?: boolean
          scraped_at?: string
          tier?: string | null
        }
        Relationships: []
      }
      cmsa_player_stats: {
        Row: {
          age_group_id: string
          assists: number
          created_at: string
          games_played: number
          goals: number
          id: string
          player_name: string
          team_id: string
          tier: string
          updated_at: string
        }
        Insert: {
          age_group_id: string
          assists?: number
          created_at?: string
          games_played?: number
          goals?: number
          id?: string
          player_name: string
          team_id: string
          tier: string
          updated_at?: string
        }
        Update: {
          age_group_id?: string
          assists?: number
          created_at?: string
          games_played?: number
          goals?: number
          id?: string
          player_name?: string
          team_id?: string
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      cmsa_scrape_runs: {
        Row: {
          age_group_id: string | null
          error_message: string | null
          id: string
          ran_at: string
          rows_upserted: number | null
          status: string
        }
        Insert: {
          age_group_id?: string | null
          error_message?: string | null
          id?: string
          ran_at?: string
          rows_upserted?: number | null
          status: string
        }
        Update: {
          age_group_id?: string | null
          error_message?: string | null
          id?: string
          ran_at?: string
          rows_upserted?: number | null
          status?: string
        }
        Relationships: []
      }
      cmsa_standings: {
        Row: {
          age_group_id: string
          ga: number | null
          gd: number | null
          gf: number | null
          gp: number | null
          id: string
          l: number | null
          pts: number | null
          rank: number | null
          scraped_at: string
          t: number | null
          team_id: string
          tier: string
          w: number | null
        }
        Insert: {
          age_group_id: string
          ga?: number | null
          gd?: number | null
          gf?: number | null
          gp?: number | null
          id?: string
          l?: number | null
          pts?: number | null
          rank?: number | null
          scraped_at?: string
          t?: number | null
          team_id: string
          tier: string
          w?: number | null
        }
        Update: {
          age_group_id?: string
          ga?: number | null
          gd?: number | null
          gf?: number | null
          gp?: number | null
          id?: string
          l?: number | null
          pts?: number | null
          rank?: number | null
          scraped_at?: string
          t?: number | null
          team_id?: string
          tier?: string
          w?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cmsa_standings_age_group_id_fkey"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "cmsa_age_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmsa_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "cmsa_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      cmsa_teams: {
        Row: {
          age_group_id: string | null
          created_at: string
          external_id: string
          id: string
          name: string
          tier: string | null
          updated_at: string
        }
        Insert: {
          age_group_id?: string | null
          created_at?: string
          external_id: string
          id?: string
          name: string
          tier?: string | null
          updated_at?: string
        }
        Update: {
          age_group_id?: string | null
          created_at?: string
          external_id?: string
          id?: string
          name?: string
          tier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cmsa_teams_age_group_id_fkey"
            columns: ["age_group_id"]
            isOneToOne: false
            referencedRelation: "cmsa_age_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_assignments: {
        Row: {
          assigned_at: string
          coach_user_id: string
          id: string
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          coach_user_id: string
          id?: string
          status?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          coach_user_id?: string
          id?: string
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_assignments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_notes: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          match_id: string | null
          note: string
          player_id: string | null
          timestamp_seconds: number | null
          updated_at: string
          visibility: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          match_id?: string | null
          note: string
          player_id?: string | null
          timestamp_seconds?: number | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          match_id?: string | null
          note?: string
          player_id?: string | null
          timestamp_seconds?: number | null
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_notes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_notes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_notes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          team_id: string | null
          title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          team_id?: string | null
          title?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          team_id?: string | null
          title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      development_goals: {
        Row: {
          category: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          player_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          player_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          player_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "development_goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      drills: {
        Row: {
          coach_id: string
          created_at: string
          description: string | null
          difficulty_level: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      evaluations: {
        Row: {
          created_at: string
          date: string
          evaluated_by: string
          id: string
          mental: number
          notes: string | null
          physical: number
          player_id: string
          score: number
          tactical: number
          technical: number
        }
        Insert: {
          created_at?: string
          date?: string
          evaluated_by: string
          id?: string
          mental: number
          notes?: string | null
          physical: number
          player_id: string
          score: number
          tactical: number
          technical: number
        }
        Update: {
          created_at?: string
          date?: string
          evaluated_by?: string
          id?: string
          mental?: number
          notes?: string | null
          physical?: number
          player_id?: string
          score?: number
          tactical?: number
          technical?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      fitness_tests: {
        Row: {
          agility_time: number | null
          beep_test_level: number | null
          beep_test_shuttles: number | null
          created_at: string
          endurance_distance: number | null
          id: string
          notes: string | null
          player_id: string
          sprint_10m: number | null
          sprint_30m: number | null
          test_date: string
          tested_by: string
          vertical_jump: number | null
        }
        Insert: {
          agility_time?: number | null
          beep_test_level?: number | null
          beep_test_shuttles?: number | null
          created_at?: string
          endurance_distance?: number | null
          id?: string
          notes?: string | null
          player_id: string
          sprint_10m?: number | null
          sprint_30m?: number | null
          test_date?: string
          tested_by: string
          vertical_jump?: number | null
        }
        Update: {
          agility_time?: number | null
          beep_test_level?: number | null
          beep_test_shuttles?: number | null
          created_at?: string
          endurance_distance?: number | null
          id?: string
          notes?: string | null
          player_id?: string
          sprint_10m?: number | null
          sprint_30m?: number | null
          test_date?: string
          tested_by?: string
          vertical_jump?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fitness_tests_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fitness_tests_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      match_player_stats: {
        Row: {
          activity_score: number | null
          avg_speed: number | null
          created_at: string
          created_by: string
          distance_covered: number | null
          estimated_touches: number | null
          heatmap_data: Json | null
          id: string
          integrated: boolean
          movement_intensity: number | null
          player_id: string
          positions_tracked: number | null
          sprint_count: number | null
          time_on_field: number | null
          updated_at: string
          video_id: string
        }
        Insert: {
          activity_score?: number | null
          avg_speed?: number | null
          created_at?: string
          created_by: string
          distance_covered?: number | null
          estimated_touches?: number | null
          heatmap_data?: Json | null
          id?: string
          integrated?: boolean
          movement_intensity?: number | null
          player_id: string
          positions_tracked?: number | null
          sprint_count?: number | null
          time_on_field?: number | null
          updated_at?: string
          video_id: string
        }
        Update: {
          activity_score?: number | null
          avg_speed?: number | null
          created_at?: string
          created_by?: string
          distance_covered?: number | null
          estimated_touches?: number | null
          heatmap_data?: Json | null
          id?: string
          integrated?: boolean
          movement_intensity?: number | null
          player_id?: string
          positions_tracked?: number | null
          sprint_count?: number | null
          time_on_field?: number | null
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_player_stats_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "match_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      match_videos: {
        Row: {
          age_group: string | null
          ai_processing_error: string | null
          ai_processing_started_at: string | null
          created_at: string
          created_by: string
          duration_seconds: number | null
          id: string
          match_date: string | null
          notes: string | null
          opponent: string | null
          status: string
          team: string | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string
          video_url: string
        }
        Insert: {
          age_group?: string | null
          ai_processing_error?: string | null
          ai_processing_started_at?: string | null
          created_at?: string
          created_by: string
          duration_seconds?: number | null
          id?: string
          match_date?: string | null
          notes?: string | null
          opponent?: string | null
          status?: string
          team?: string | null
          thumbnail_url?: string | null
          title: string
          type?: string
          updated_at?: string
          video_url: string
        }
        Update: {
          age_group?: string | null
          ai_processing_error?: string | null
          ai_processing_started_at?: string | null
          created_at?: string
          created_by?: string
          duration_seconds?: number | null
          id?: string
          match_date?: string | null
          notes?: string | null
          opponent?: string | null
          status?: string
          team?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          id: string
          name: string
          notes: string | null
          status: string | null
          team: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          id?: string
          name: string
          notes?: string | null
          status?: string | null
          team?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          id?: string
          name?: string
          notes?: string | null
          status?: string | null
          team?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          reference_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      player_cvs: {
        Row: {
          achievements: string[] | null
          age: number | null
          bio: string | null
          created_at: string
          current_team: string | null
          date_of_birth: string | null
          full_name: string
          height: number | null
          highlight_video_url: string | null
          id: string
          is_published: boolean
          player_id: string
          position: string
          preferred_foot: string | null
          previous_teams: string[] | null
          slug: string
          template: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          achievements?: string[] | null
          age?: number | null
          bio?: string | null
          created_at?: string
          current_team?: string | null
          date_of_birth?: string | null
          full_name: string
          height?: number | null
          highlight_video_url?: string | null
          id?: string
          is_published?: boolean
          player_id: string
          position?: string
          preferred_foot?: string | null
          previous_teams?: string[] | null
          slug: string
          template?: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          achievements?: string[] | null
          age?: number | null
          bio?: string | null
          created_at?: string
          current_team?: string | null
          date_of_birth?: string | null
          full_name?: string
          height?: number | null
          highlight_video_url?: string | null
          id?: string
          is_published?: boolean
          player_id?: string
          position?: string
          preferred_foot?: string | null
          previous_teams?: string[] | null
          slug?: string
          template?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_cvs_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_cvs_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      player_feedback: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          improvements: string | null
          notes: string | null
          player_id: string
          strengths: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          improvements?: string | null
          notes?: string | null
          player_id: string
          strengths?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          improvements?: string | null
          notes?: string | null
          player_id?: string
          strengths?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_feedback_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_feedback_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      player_follows: {
        Row: {
          created_at: string
          follower_id: string
          id: string
          player_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          id?: string
          player_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_follows_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_follows_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      player_tracking: {
        Row: {
          bbox_height: number
          bbox_width: number
          bbox_x: number
          bbox_y: number
          confidence: number | null
          created_at: string
          created_by: string
          frame_number: number
          id: string
          player_id: string | null
          source: string
          timestamp_seconds: number
          tracking_id: string
          video_id: string
        }
        Insert: {
          bbox_height?: number
          bbox_width?: number
          bbox_x?: number
          bbox_y?: number
          confidence?: number | null
          created_at?: string
          created_by: string
          frame_number: number
          id?: string
          player_id?: string | null
          source?: string
          timestamp_seconds: number
          tracking_id: string
          video_id: string
        }
        Update: {
          bbox_height?: number
          bbox_width?: number
          bbox_x?: number
          bbox_y?: number
          confidence?: number | null
          created_at?: string
          created_by?: string
          frame_number?: number
          id?: string
          player_id?: string | null
          source?: string
          timestamp_seconds?: number
          tracking_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_tracking_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_tracking_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_tracking_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "match_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          achievements: string[]
          age: number
          age_group: string | null
          attendance: number | null
          available_for_transfer: boolean
          avatar: string | null
          bio: string | null
          created_at: string
          created_by: string
          height: number | null
          id: string
          is_public: boolean | null
          jersey_number: number | null
          join_date: string
          location: string | null
          mental: Json
          name: string
          nationality: string | null
          overall_rating: number | null
          physical: Json
          position: string
          preferred_foot: string | null
          strengths: string[]
          tactical: Json
          team: string
          team_id: string | null
          technical: Json
          updated_at: string
          verification_badge: boolean
          weight: number | null
        }
        Insert: {
          achievements?: string[]
          age: number
          age_group?: string | null
          attendance?: number | null
          available_for_transfer?: boolean
          avatar?: string | null
          bio?: string | null
          created_at?: string
          created_by: string
          height?: number | null
          id?: string
          is_public?: boolean | null
          jersey_number?: number | null
          join_date?: string
          location?: string | null
          mental?: Json
          name: string
          nationality?: string | null
          overall_rating?: number | null
          physical?: Json
          position: string
          preferred_foot?: string | null
          strengths?: string[]
          tactical?: Json
          team: string
          team_id?: string | null
          technical?: Json
          updated_at?: string
          verification_badge?: boolean
          weight?: number | null
        }
        Update: {
          achievements?: string[]
          age?: number
          age_group?: string | null
          attendance?: number | null
          available_for_transfer?: boolean
          avatar?: string | null
          bio?: string | null
          created_at?: string
          created_by?: string
          height?: number | null
          id?: string
          is_public?: boolean | null
          jersey_number?: number | null
          join_date?: string
          location?: string | null
          mental?: Json
          name?: string
          nationality?: string | null
          overall_rating?: number | null
          physical?: Json
          position?: string
          preferred_foot?: string | null
          strengths?: string[]
          tactical?: Json
          team?: string
          team_id?: string | null
          technical?: Json
          updated_at?: string
          verification_badge?: boolean
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players_video: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          position: string | null
          team: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name: string
          position?: string | null
          team?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          position?: string | null
          team?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          player_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          player_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          player_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          club_name: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          club_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          club_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schedule_sessions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          location: string
          notes: string | null
          session_date: string
          session_time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          location?: string
          notes?: string | null
          session_date?: string
          session_time?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          location?: string
          notes?: string | null
          session_date?: string
          session_time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_drills: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          drill_id: string
          id: string
          session_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          drill_id: string
          id?: string
          session_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          drill_id?: string
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_drills_drill_id_fkey"
            columns: ["drill_id"]
            isOneToOne: false
            referencedRelation: "drills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_drills_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_players: {
        Row: {
          created_at: string
          id: string
          player_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          player_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          player_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_players_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          age_group: string | null
          club_name: string
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          club_name?: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          club_name?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          created_at: string | null
          id: string
          match_id: string | null
          player_id: string | null
          track_id: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          player_id?: string | null
          track_id: number
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          player_id?: string | null
          track_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tracks_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_video"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          coach_id: string
          created_at: string
          description: string | null
          focus_area: string | null
          id: string
          name: string
          session_date: string | null
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          description?: string | null
          focus_area?: string | null
          id?: string
          name: string
          session_date?: string | null
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          description?: string | null
          focus_area?: string | null
          id?: string
          name?: string
          session_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_annotations: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          timestamp_seconds: number
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          timestamp_seconds: number
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          timestamp_seconds?: number
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_annotations_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "match_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          notes: string | null
          player_id: string | null
          tagged_by: string
          timestamp_seconds: number
          video_id: string
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          notes?: string | null
          player_id?: string | null
          tagged_by: string
          timestamp_seconds: number
          video_id: string
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          notes?: string | null
          player_id?: string | null
          tagged_by?: string
          timestamp_seconds?: number
          video_id?: string
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "public_player_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_events_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "match_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_stats: {
        Row: {
          created_at: string | null
          distance_m: number | null
          id: string
          match_id: string | null
          player_id: string | null
          possession_seconds: number | null
          touches: number | null
          track_id: number | null
        }
        Insert: {
          created_at?: string | null
          distance_m?: number | null
          id?: string
          match_id?: string | null
          player_id?: string | null
          possession_seconds?: number | null
          touches?: number | null
          track_id?: number | null
        }
        Update: {
          created_at?: string | null
          distance_m?: number | null
          id?: string
          match_id?: string | null
          player_id?: string | null
          possession_seconds?: number | null
          touches?: number | null
          track_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_video"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          club_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          source: string | null
        }
        Insert: {
          club_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
          source?: string | null
        }
        Update: {
          club_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_player_cards: {
        Row: {
          achievements: string[] | null
          age: number | null
          age_group: string | null
          available_for_transfer: boolean | null
          avatar: string | null
          bio: string | null
          id: string | null
          is_public: boolean | null
          location: string | null
          name: string | null
          nationality: string | null
          overall_rating: number | null
          position: string | null
          preferred_foot: string | null
          strengths: string[] | null
          team: string | null
          verification_badge: boolean | null
        }
        Insert: {
          achievements?: string[] | null
          age?: number | null
          age_group?: string | null
          available_for_transfer?: boolean | null
          avatar?: string | null
          bio?: string | null
          id?: string | null
          is_public?: boolean | null
          location?: string | null
          name?: string | null
          nationality?: string | null
          overall_rating?: number | null
          position?: string | null
          preferred_foot?: string | null
          strengths?: string[] | null
          team?: string | null
          verification_badge?: boolean | null
        }
        Update: {
          achievements?: string[] | null
          age?: number | null
          age_group?: string | null
          available_for_transfer?: boolean | null
          avatar?: string | null
          bio?: string | null
          id?: string | null
          is_public?: boolean | null
          location?: string | null
          name?: string | null
          nationality?: string | null
          overall_rating?: number | null
          position?: string | null
          preferred_foot?: string | null
          strengths?: string[] | null
          team?: string | null
          verification_badge?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_waitlist_this_week: { Args: never; Returns: number }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_signup_email_status: {
        Args: { _email: string }
        Returns: {
          created_at: string
          error_message: string
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      analytics_event_type:
        | "touch"
        | "pass"
        | "completed_pass"
        | "key_pass"
        | "shot"
        | "shot_on_target"
        | "goal"
        | "assist"
        | "dribble"
        | "tackle"
        | "interception"
        | "clearance"
        | "duel"
        | "aerial_duel"
        | "recovery"
        | "foul"
        | "offside"
        | "save"
        | "cross"
        | "corner"
        | "throw_in"
      analytics_match_status: "queued" | "processing" | "done" | "error"
      app_role: "coach" | "player" | "parent" | "director" | "scout"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      analytics_event_type: [
        "touch",
        "pass",
        "completed_pass",
        "key_pass",
        "shot",
        "shot_on_target",
        "goal",
        "assist",
        "dribble",
        "tackle",
        "interception",
        "clearance",
        "duel",
        "aerial_duel",
        "recovery",
        "foul",
        "offside",
        "save",
        "cross",
        "corner",
        "throw_in",
      ],
      analytics_match_status: ["queued", "processing", "done", "error"],
      app_role: ["coach", "player", "parent", "director", "scout"],
    },
  },
} as const
