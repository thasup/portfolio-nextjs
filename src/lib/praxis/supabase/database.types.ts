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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      praxis_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          learner_id: string
          summary: string | null
          surface: string
          topic_id: string
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          learner_id: string
          summary?: string | null
          surface: string
          topic_id: string
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          learner_id?: string
          summary?: string | null
          surface?: string
          topic_id?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "praxis_conversations_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "praxis_learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praxis_conversations_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "praxis_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praxis_conversations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "praxis_units"
            referencedColumns: ["id"]
          },
        ]
      }
      praxis_curriculum_cache: {
        Row: {
          created_at: string
          fingerprint: string
          hit_count: number
          id: string
          locale: string
          model_version: string
          units: Json
        }
        Insert: {
          created_at?: string
          fingerprint: string
          hit_count?: number
          id?: string
          locale?: string
          model_version: string
          units: Json
        }
        Update: {
          created_at?: string
          fingerprint?: string
          hit_count?: number
          id?: string
          locale?: string
          model_version?: string
          units?: Json
        }
        Relationships: []
      }
      praxis_invitations: {
        Row: {
          email: string
          id: string
          invited_at: string
          invited_by: string
          note: string | null
          revoked_at: string | null
        }
        Insert: {
          email: string
          id?: string
          invited_at?: string
          invited_by: string
          note?: string | null
          revoked_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          invited_at?: string
          invited_by?: string
          note?: string | null
          revoked_at?: string | null
        }
        Relationships: []
      }
      praxis_learners: {
        Row: {
          can_generate_topics: boolean
          created_at: string
          default_locale: string
          display_name: string | null
          email: string
          id: string
          last_active_at: string
          model_preferences: Json | null
        }
        Insert: {
          can_generate_topics?: boolean
          created_at?: string
          default_locale?: string
          display_name?: string | null
          email: string
          id: string
          last_active_at?: string
          model_preferences?: Json | null
        }
        Update: {
          can_generate_topics?: boolean
          created_at?: string
          default_locale?: string
          display_name?: string | null
          email?: string
          id?: string
          last_active_at?: string
          model_preferences?: Json | null
        }
        Relationships: []
      }
      praxis_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          token_count_input: number | null
          token_count_output: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          token_count_input?: number | null
          token_count_output?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          token_count_input?: number | null
          token_count_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "praxis_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "praxis_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      praxis_onboarding: {
        Row: {
          answers: Json
          created_at: string
          id: string
          learner_id: string
          topic_id: string
          updated_at: string
          version: number
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          learner_id: string
          topic_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          learner_id?: string
          topic_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "praxis_onboarding_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "praxis_learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praxis_onboarding_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "praxis_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      praxis_spend_ledger: {
        Row: {
          endpoint: string
          estimated_cents: number
          id: string
          input_tokens: number
          model: string
          output_tokens: number
          timestamp: string
        }
        Insert: {
          endpoint: string
          estimated_cents: number
          id?: string
          input_tokens: number
          model: string
          output_tokens: number
          timestamp?: string
        }
        Update: {
          endpoint?: string
          estimated_cents?: number
          id?: string
          input_tokens?: number
          model?: string
          output_tokens?: number
          timestamp?: string
        }
        Relationships: []
      }
      praxis_templates: {
        Row: {
          created_at: string
          id: string
          kind: string
          learner_id: string
          regenerate_note: string | null
          spec_json: Json
          title: string
          topic_id: string
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          learner_id: string
          regenerate_note?: string | null
          spec_json: Json
          title: string
          topic_id: string
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          learner_id?: string
          regenerate_note?: string | null
          spec_json?: Json
          title?: string
          topic_id?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "praxis_templates_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "praxis_learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praxis_templates_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "praxis_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praxis_templates_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "praxis_units"
            referencedColumns: ["id"]
          },
        ]
      }
      praxis_topics: {
        Row: {
          created_at: string
          curriculum_id: string | null
          fingerprint: string
          id: string
          last_active_at: string
          learner_id: string
          locale: string
          raw_input: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          curriculum_id?: string | null
          fingerprint: string
          id?: string
          last_active_at?: string
          learner_id: string
          locale?: string
          raw_input: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          curriculum_id?: string | null
          fingerprint?: string
          id?: string
          last_active_at?: string
          learner_id?: string
          locale?: string
          raw_input?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "praxis_topics_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "praxis_curriculum_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praxis_topics_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "praxis_learners"
            referencedColumns: ["id"]
          },
        ]
      }
      praxis_unit_cache: {
        Row: {
          blocks: Json
          created_at: string
          fingerprint: string
          id: string
          locale: string
          model_version: string
          unit_index: number
        }
        Insert: {
          blocks: Json
          created_at?: string
          fingerprint: string
          id?: string
          locale?: string
          model_version: string
          unit_index: number
        }
        Update: {
          blocks?: Json
          created_at?: string
          fingerprint?: string
          id?: string
          locale?: string
          model_version?: string
          unit_index?: number
        }
        Relationships: []
      }
      praxis_units: {
        Row: {
          blocks: Json
          cache_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          index: number
          objective: string
          status: string
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          cache_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          index: number
          objective: string
          status?: string
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          cache_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          index?: number
          objective?: string
          status?: string
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "praxis_units_cache_id_fkey"
            columns: ["cache_id"]
            isOneToOne: false
            referencedRelation: "praxis_unit_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praxis_units_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "praxis_topics"
            referencedColumns: ["id"]
          },
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
    Enums: {},
  },
} as const
