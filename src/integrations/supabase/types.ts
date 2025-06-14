export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercise_attempts: {
        Row: {
          answer: string | null
          attempt_at: string
          correct: boolean
          exercise_id: number
          id: string
          lesson_id: number
          module_id: number
          user_id: string
        }
        Insert: {
          answer?: string | null
          attempt_at?: string
          correct: boolean
          exercise_id: number
          id?: string
          lesson_id: number
          module_id: number
          user_id: string
        }
        Update: {
          answer?: string | null
          attempt_at?: string
          correct?: boolean
          exercise_id?: number
          id?: string
          lesson_id?: number
          module_id?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          learning_style: string | null
          name: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          learning_style?: string | null
          name?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          learning_style?: string | null
          name?: string | null
          username?: string
        }
        Relationships: []
      }
      revision_modules: {
        Row: {
          assigned_at: string
          completed_at: string | null
          created_at: string
          id: string
          is_mandatory: boolean | null
          original_module_id: number
          performance_threshold: number | null
          revision_module_id: number
          user_id: string
        }
        Insert: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          original_module_id: number
          performance_threshold?: number | null
          revision_module_id: number
          user_id: string
        }
        Update: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          original_module_id?: number
          performance_threshold?: number | null
          revision_module_id?: number
          user_id?: string
        }
        Relationships: []
      }
      revision_requirements: {
        Row: {
          created_at: string
          failed_score: number
          id: string
          module_id: number
          required_passing_score: number
          revision_completed: boolean | null
          revision_completed_at: string | null
          test_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          failed_score: number
          id?: string
          module_id: number
          required_passing_score: number
          revision_completed?: boolean | null
          revision_completed_at?: string | null
          test_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          failed_score?: number
          id?: string
          module_id?: number
          required_passing_score?: number
          revision_completed?: boolean | null
          revision_completed_at?: string | null
          test_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          completed_at: string
          id: string
          module_id: number
          passed: boolean
          score: number
          test_id: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          module_id: number
          passed: boolean
          score: number
          test_id: number
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          module_id?: number
          passed?: boolean
          score?: number
          test_id?: number
          user_id?: string
        }
        Relationships: []
      }
      user_performance: {
        Row: {
          average_score: number | null
          created_at: string
          failed_attempts: number | null
          id: string
          module_id: number
          needs_revision: boolean | null
          revision_assigned_at: string | null
          revision_completed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_score?: number | null
          created_at?: string
          failed_attempts?: number | null
          id?: string
          module_id: number
          needs_revision?: boolean | null
          revision_assigned_at?: string | null
          revision_completed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_score?: number | null
          created_at?: string
          failed_attempts?: number | null
          id?: string
          module_id?: number
          needs_revision?: boolean | null
          revision_assigned_at?: string | null
          revision_completed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: number
          module_id: number
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: number
          module_id: number
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: number
          module_id?: number
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
