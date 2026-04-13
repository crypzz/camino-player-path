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
          age: number
          age_group: string | null
          attendance: number | null
          avatar: string | null
          created_at: string
          created_by: string
          height: number | null
          id: string
          is_public: boolean | null
          join_date: string
          location: string | null
          mental: Json
          name: string
          nationality: string | null
          overall_rating: number | null
          physical: Json
          position: string
          preferred_foot: string | null
          tactical: Json
          team: string
          team_id: string | null
          technical: Json
          updated_at: string
          weight: number | null
        }
        Insert: {
          age: number
          age_group?: string | null
          attendance?: number | null
          avatar?: string | null
          created_at?: string
          created_by: string
          height?: number | null
          id?: string
          is_public?: boolean | null
          join_date?: string
          location?: string | null
          mental?: Json
          name: string
          nationality?: string | null
          overall_rating?: number | null
          physical?: Json
          position: string
          preferred_foot?: string | null
          tactical?: Json
          team: string
          team_id?: string | null
          technical?: Json
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number
          age_group?: string | null
          attendance?: number | null
          avatar?: string | null
          created_at?: string
          created_by?: string
          height?: number | null
          id?: string
          is_public?: boolean | null
          join_date?: string
          location?: string | null
          mental?: Json
          name?: string
          nationality?: string | null
          overall_rating?: number | null
          physical?: Json
          position?: string
          preferred_foot?: string | null
          tactical?: Json
          team?: string
          team_id?: string | null
          technical?: Json
          updated_at?: string
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
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
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
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_player_cards: {
        Row: {
          age_group: string | null
          avatar: string | null
          id: string | null
          is_public: boolean | null
          overall_rating: number | null
          position: string | null
          preferred_foot: string | null
          team: string | null
        }
        Insert: {
          age_group?: string | null
          avatar?: string | null
          id?: string | null
          is_public?: boolean | null
          overall_rating?: number | null
          position?: string | null
          preferred_foot?: string | null
          team?: string | null
        }
        Update: {
          age_group?: string | null
          avatar?: string | null
          id?: string | null
          is_public?: boolean | null
          overall_rating?: number | null
          position?: string | null
          preferred_foot?: string | null
          team?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
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
    }
    Enums: {
      app_role: "coach" | "player" | "parent" | "director"
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
      app_role: ["coach", "player", "parent", "director"],
    },
  },
} as const
