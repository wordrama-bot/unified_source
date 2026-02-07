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
      daily_spin: {
        Row: {
          created_at: string
          id: number
          is_claimed: boolean | null
          is_coin_prize: boolean | null
          last_spin: number | null
          prize_coin_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_claimed?: boolean | null
          is_coin_prize?: boolean | null
          last_spin?: number | null
          prize_coin_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_claimed?: boolean | null
          is_coin_prize?: boolean | null
          last_spin?: number | null
          prize_coin_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_spin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_spin_prizes: {
        Row: {
          coin_count: number | null
          created_at: string
          id: number
          is_coin_prize: boolean | null
          prize_name: string | null
        }
        Insert: {
          coin_count?: number | null
          created_at?: string
          id?: number
          is_coin_prize?: boolean | null
          prize_name?: string | null
        }
        Update: {
          coin_count?: number | null
          created_at?: string
          id?: number
          is_coin_prize?: boolean | null
          prize_name?: string | null
        }
        Relationships: []
      }
      game_modes: {
        Row: {
          created_at: string
          game_id: number | null
          gamemode_id: number | null
          id: number
          mode_name: string | null
        }
        Insert: {
          created_at?: string
          game_id?: number | null
          gamemode_id?: number | null
          id?: number
          mode_name?: string | null
        }
        Update: {
          created_at?: string
          game_id?: number | null
          gamemode_id?: number | null
          id?: number
          mode_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_modes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          created_at: string
          id: number
          maintenance_mode: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          maintenance_mode?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          maintenance_mode?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      ledger: {
        Row: {
          coin_count: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          coin_count?: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          coin_count?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          discord_link_code: string | null
          discord_user_id: string | null
          discord_username: string | null
          firstname: string | null
          id: number
          lastname: string | null
          level: number | null
          profile_image: string | null
          rank: number | null
          sanitized_username: string | null
          user_id: string
          username: string | null
          xp: number | null
        }
        Insert: {
          created_at?: string
          discord_link_code?: string | null
          discord_user_id?: string | null
          discord_username?: string | null
          firstname?: string | null
          id?: number
          lastname?: string | null
          level?: number | null
          profile_image?: string | null
          rank?: number | null
          sanitized_username?: string | null
          user_id: string
          username?: string | null
          xp?: number | null
        }
        Update: {
          created_at?: string
          discord_link_code?: string | null
          discord_user_id?: string | null
          discord_username?: string | null
          firstname?: string | null
          id?: number
          lastname?: string | null
          level?: number | null
          profile_image?: string | null
          rank?: number | null
          sanitized_username?: string | null
          user_id?: string
          username?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wordle_settings: {
        Row: {
          colour_blind: boolean | null
          confetti_enabled: boolean | null
          created_at: string
          dark_mode: boolean | null
          hard_mode: boolean | null
          id: number
          user_id: string
          word_length: string | null
        }
        Insert: {
          colour_blind?: boolean | null
          confetti_enabled?: boolean | null
          created_at?: string
          dark_mode?: boolean | null
          hard_mode?: boolean | null
          id?: number
          user_id: string
          word_length?: string | null
        }
        Update: {
          colour_blind?: boolean | null
          confetti_enabled?: boolean | null
          created_at?: string
          dark_mode?: boolean | null
          hard_mode?: boolean | null
          id?: number
          user_id?: string
          word_length?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wordle_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wordle_stats: {
        Row: {
          best_streak: number | null
          created_at: string
          current_streak: number | null
          gamemode_id: number | null
          games_failed: number | null
          id: number
          success_rate: number | null
          total_games: number | null
          user_id: string
          win_distribution: Json | null
          word_length: string | null
        }
        Insert: {
          best_streak?: number | null
          created_at?: string
          current_streak?: number | null
          gamemode_id?: number | null
          games_failed?: number | null
          id?: number
          success_rate?: number | null
          total_games?: number | null
          user_id: string
          win_distribution?: Json | null
          word_length?: string | null
        }
        Update: {
          best_streak?: number | null
          created_at?: string
          current_streak?: number | null
          gamemode_id?: number | null
          games_failed?: number | null
          id?: number
          success_rate?: number | null
          total_games?: number | null
          user_id?: string
          win_distribution?: Json | null
          word_length?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wordle_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
