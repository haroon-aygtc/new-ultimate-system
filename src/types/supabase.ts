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
      auth_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      branding_settings: {
        Row: {
          accent_color: string
          brand_name: string
          corner_radius: number
          created_at: string | null
          enable_code_highlighting: boolean
          enable_emojis: boolean
          enable_link_preview: boolean
          enable_markdown: boolean
          error_message: string
          header_opacity: number
          id: string
          input_placeholder: string
          logo_url: string
          offline_message: string
          primary_color: string
          secondary_color: string
          show_avatar: boolean
          tagline: string
          timeout_message: string
          updated_at: string | null
          welcome_message: string
          widget_position: string
          widget_title: string
        }
        Insert: {
          accent_color: string
          brand_name: string
          corner_radius: number
          created_at?: string | null
          enable_code_highlighting: boolean
          enable_emojis: boolean
          enable_link_preview: boolean
          enable_markdown: boolean
          error_message: string
          header_opacity: number
          id?: string
          input_placeholder: string
          logo_url: string
          offline_message: string
          primary_color: string
          secondary_color: string
          show_avatar: boolean
          tagline: string
          timeout_message: string
          updated_at?: string | null
          welcome_message: string
          widget_position: string
          widget_title: string
        }
        Update: {
          accent_color?: string
          brand_name?: string
          corner_radius?: number
          created_at?: string | null
          enable_code_highlighting?: boolean
          enable_emojis?: boolean
          enable_link_preview?: boolean
          enable_markdown?: boolean
          error_message?: string
          header_opacity?: number
          id?: string
          input_placeholder?: string
          logo_url?: string
          offline_message?: string
          primary_color?: string
          secondary_color?: string
          show_avatar?: boolean
          tagline?: string
          timeout_message?: string
          updated_at?: string | null
          welcome_message?: string
          widget_position?: string
          widget_title?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender_type: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id: string
          sender_type: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "guest_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_sessions: {
        Row: {
          created_at: string | null
          id: string
          last_active_at: string | null
          metadata: Json | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id: string
          last_active_at?: string | null
          metadata?: Json | null
          status: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_active_at?: string | null
          metadata?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "guest_users"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_users: {
        Row: {
          converted_to_user_id: string | null
          created_at: string | null
          id: string
          last_active_at: string | null
          name: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          converted_to_user_id?: string | null
          created_at?: string | null
          id: string
          last_active_at?: string | null
          name: string
          phone: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          converted_to_user_id?: string | null
          created_at?: string | null
          id?: string
          last_active_at?: string | null
          name?: string
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      response_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          template: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template?: string
          updated_at?: string | null
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
      user_role: "guest" | "user" | "admin"
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
    Enums: {
      user_role: ["guest", "user", "admin"],
    },
  },
} as const
