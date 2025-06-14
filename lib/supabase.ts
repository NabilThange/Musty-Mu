import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "X-Client-Info": "studgem-platform",
    },
  },
})

// Type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          prn: string | null
          full_name: string
          college_id: string | null
          program_id: string | null
          batch_id: string | null
          current_semester: number | null
          roll_number: string | null
          phone_number: string | null
          date_of_birth: string | null
          gender: string | null
          address: any | null
          guardian_info: any | null
          is_active: boolean | null
          profile_completed: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          prn?: string | null
          full_name: string
          college_id?: string | null
          program_id?: string | null
          batch_id?: string | null
          current_semester?: number | null
          roll_number?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: any | null
          guardian_info?: any | null
          is_active?: boolean | null
          profile_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          prn?: string | null
          full_name?: string
          college_id?: string | null
          program_id?: string | null
          batch_id?: string | null
          current_semester?: number | null
          roll_number?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: any | null
          guardian_info?: any | null
          is_active?: boolean | null
          profile_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      subjects: {
        Row: {
          id: string
          code: string
          name: string
          credits: number | null
          subject_type: string | null
          semester: number
          year_level: string
          description: string | null
          syllabus_url: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          credits?: number | null
          subject_type?: string | null
          semester: number
          year_level: string
          description?: string | null
          syllabus_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          name?: string
          credits?: number | null
          subject_type?: string | null
          semester?: number
          year_level?: string
          description?: string | null
          syllabus_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      user_topic_progress: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          is_completed: boolean | null
          completion_percentage: number | null
          time_spent_minutes: number | null
          completed_at: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          is_completed?: boolean | null
          completion_percentage?: number | null
          time_spent_minutes?: number | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          is_completed?: boolean | null
          completion_percentage?: number | null
          time_spent_minutes?: number | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      assignments: {
        Row: {
          id: string
          subject_id: string
          title: string
          description: string | null
          assignment_type: string | null
          total_marks: number | null
          due_date: string | null
          submission_format: string[] | null
          instructions: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          description?: string | null
          assignment_type?: string | null
          total_marks?: number | null
          due_date?: string | null
          submission_format?: string[] | null
          instructions?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          description?: string | null
          assignment_type?: string | null
          total_marks?: number | null
          due_date?: string | null
          submission_format?: string[] | null
          instructions?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      assignment_submissions: {
        Row: {
          id: string
          user_id: string
          assignment_id: string
          submission_url: string | null
          submission_text: string | null
          submitted_at: string | null
          marks_obtained: number | null
          feedback: string | null
          status: string | null
        }
        Insert: {
          id?: string
          user_id: string
          assignment_id: string
          submission_url?: string | null
          submission_text?: string | null
          submitted_at?: string | null
          marks_obtained?: number | null
          feedback?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          assignment_id?: string
          submission_url?: string | null
          submission_text?: string | null
          submitted_at?: string | null
          marks_obtained?: number | null
          feedback?: string | null
          status?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          notification_type: string | null
          is_read: boolean | null
          action_url: string | null
          priority: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          notification_type?: string | null
          is_read?: boolean | null
          action_url?: string | null
          priority?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          notification_type?: string | null
          is_read?: boolean | null
          action_url?: string | null
          priority?: string | null
          created_at?: string | null
        }
      }
      study_streaks: {
        Row: {
          id: string
          user_id: string
          study_date: string
          minutes_studied: number | null
          topics_completed: number | null
          assignments_submitted: number | null
          streak_count: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          study_date: string
          minutes_studied?: number | null
          topics_completed?: number | null
          assignments_submitted?: number | null
          streak_count?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          study_date?: string
          minutes_studied?: number | null
          topics_completed?: number | null
          assignments_submitted?: number | null
          streak_count?: number | null
          created_at?: string | null
        }
      }
      study_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          subject_id: string | null
          created_by: string
          max_members: number | null
          is_private: boolean | null
          invite_code: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          subject_id?: string | null
          created_by: string
          max_members?: number | null
          is_private?: boolean | null
          invite_code?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          subject_id?: string | null
          created_by?: string
          max_members?: number | null
          is_private?: boolean | null
          invite_code?: string | null
          created_at?: string | null
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string | null
          joined_at?: string | null
        }
      }
      resources: {
        Row: {
          id: string
          topic_id: string
          title: string
          description: string | null
          resource_type: string | null
          url: string | null
          file_size_mb: number | null
          duration_minutes: number | null
          uploaded_by: string | null
          is_verified: boolean | null
          download_count: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          topic_id: string
          title: string
          description?: string | null
          resource_type?: string | null
          url?: string | null
          file_size_mb?: number | null
          duration_minutes?: number | null
          uploaded_by?: string | null
          is_verified?: boolean | null
          download_count?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          topic_id?: string
          title?: string
          description?: string | null
          resource_type?: string | null
          url?: string | null
          file_size_mb?: number | null
          duration_minutes?: number | null
          uploaded_by?: string | null
          is_verified?: boolean | null
          download_count?: number | null
          created_at?: string | null
        }
      }
      resource_ratings: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          rating: number | null
          review_text: string | null
          is_helpful: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          rating?: number | null
          review_text?: string | null
          is_helpful?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          rating?: number | null
          review_text?: string | null
          is_helpful?: boolean | null
          created_at?: string | null
        }
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
  }
}
