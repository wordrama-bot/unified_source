export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      wordleResults: {
        Row: {
          created_at: string
          game_id: number | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          game_id?: number | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          game_id?: number | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wordleResults_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wordleResults_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wordleStats: {
        Row: {
          best_streak: number | null
          created_at: string
          current_streak: number | null
          game_id: number | null
          games_failed: number | null
          id: number
          success_rate: number | null
          total_games: number | null
          user_id: string | null
          win_distribution: Json | null
        }
        Insert: {
          best_streak?: number | null
          created_at?: string
          current_streak?: number | null
          game_id?: number | null
          games_failed?: number | null
          id?: number
          success_rate?: number | null
          total_games?: number | null
          user_id?: string | null
          win_distribution?: Json | null
        }
        Update: {
          best_streak?: number | null
          created_at?: string
          current_streak?: number | null
          game_id?: number | null
          games_failed?: number | null
          id?: number
          success_rate?: number | null
          total_games?: number | null
          user_id?: string | null
          win_distribution?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "wordleStats_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wordleStats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
