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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          asset_id: string | null
          confidence: number | null
          created_at: string | null
          data: Json
          end_time: number | null
          id: string
          insight_type: string
          start_time: number | null
        }
        Insert: {
          asset_id?: string | null
          confidence?: number | null
          created_at?: string | null
          data: Json
          end_time?: number | null
          id?: string
          insight_type: string
          start_time?: number | null
        }
        Update: {
          asset_id?: string | null
          confidence?: number | null
          created_at?: string | null
          data?: Json
          end_time?: number | null
          id?: string
          insight_type?: string
          start_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          asset_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          asset_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          asset_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          asset_count: number | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          asset_count?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_count?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      face_library: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string | null
          face_encoding: string | null
          id: string
          name: string
          photo_url: string | null
          region: string | null
          role_title: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          face_encoding?: string | null
          id?: string
          name: string
          photo_url?: string | null
          region?: string | null
          role_title?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          face_encoding?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          region?: string | null
          role_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          checksum_sha256: string | null
          classification:
            | Database["public"]["Enums"]["classification_level"]
            | null
          collection_id: string | null
          created_at: string | null
          duration: number | null
          file_size: number | null
          file_url: string | null
          height: number | null
          id: string
          indexed_at: string | null
          indexed_path: string | null
          original_path: string | null
          proxy_url: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          checksum_sha256?: string | null
          classification?:
            | Database["public"]["Enums"]["classification_level"]
            | null
          collection_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          file_url?: string | null
          height?: number | null
          id?: string
          indexed_at?: string | null
          indexed_path?: string | null
          original_path?: string | null
          proxy_url?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          checksum_sha256?: string | null
          classification?:
            | Database["public"]["Enums"]["classification_level"]
            | null
          collection_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          file_url?: string | null
          height?: number | null
          id?: string
          indexed_at?: string | null
          indexed_path?: string | null
          original_path?: string | null
          proxy_url?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      node_metrics: {
        Row: {
          active_jobs: number | null
          cpu_usage: number | null
          gpu_usage: number | null
          id: string
          memory_usage: number | null
          node_id: string
          node_name: string
          recorded_at: string | null
          throughput: number | null
        }
        Insert: {
          active_jobs?: number | null
          cpu_usage?: number | null
          gpu_usage?: number | null
          id?: string
          memory_usage?: number | null
          node_id: string
          node_name: string
          recorded_at?: string | null
          throughput?: number | null
        }
        Update: {
          active_jobs?: number | null
          cpu_usage?: number | null
          gpu_usage?: number | null
          id?: string
          memory_usage?: number | null
          node_id?: string
          node_name?: string
          recorded_at?: string | null
          throughput?: number | null
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          asset_id: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          job_type: string
          metadata: Json | null
          node_id: string | null
          progress: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
        }
        Insert: {
          asset_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          metadata?: Json | null
          node_id?: string | null
          progress?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Update: {
          asset_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          metadata?: Json | null
          node_id?: string | null
          progress?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_library: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          image_url: string | null
          make: string
          model: string
          specifications: Json | null
          updated_at: string | null
          variant: string | null
          year: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          make: string
          model: string
          specifications?: Json | null
          updated_at?: string | null
          variant?: string | null
          year?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          make?: string
          model?: string
          specifications?: Json | null
          updated_at?: string | null
          variant?: string | null
          year?: number | null
        }
        Relationships: []
      }
      viewer_requests: {
        Row: {
          approved_by: string | null
          asset_id: string | null
          created_at: string | null
          end_time: number | null
          id: string
          purpose: string | null
          requester_id: string | null
          reviewed_at: string | null
          start_time: number | null
          status: Database["public"]["Enums"]["request_status"] | null
        }
        Insert: {
          approved_by?: string | null
          asset_id?: string | null
          created_at?: string | null
          end_time?: number | null
          id?: string
          purpose?: string | null
          requester_id?: string | null
          reviewed_at?: string | null
          start_time?: number | null
          status?: Database["public"]["Enums"]["request_status"] | null
        }
        Update: {
          approved_by?: string | null
          asset_id?: string | null
          created_at?: string | null
          end_time?: number | null
          id?: string
          purpose?: string | null
          requester_id?: string | null
          reviewed_at?: string | null
          start_time?: number | null
          status?: Database["public"]["Enums"]["request_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "viewer_requests_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      asset_type: "video" | "photo" | "audio" | "document"
      classification_level: "public" | "internal" | "confidential" | "code_red"
      job_status: "queued" | "processing" | "complete" | "failed"
      request_status: "pending" | "approved" | "rejected"
      user_role: "super_admin" | "admin" | "user" | "viewer"
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
      asset_type: ["video", "photo", "audio", "document"],
      classification_level: ["public", "internal", "confidential", "code_red"],
      job_status: ["queued", "processing", "complete", "failed"],
      request_status: ["pending", "approved", "rejected"],
      user_role: ["super_admin", "admin", "user", "viewer"],
    },
  },
} as const
