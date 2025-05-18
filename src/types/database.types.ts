
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
      reel_examples: {
        Row: {
          id: string
          submission_id: string
          link: string
          comment: string
        }
        Insert: {
          id?: string
          submission_id: string
          link: string
          comment: string
        }
        Update: {
          id?: string
          submission_id?: string
          link?: string
          comment?: string
        }
        Relationships: [
          {
            foreignKeyName: "reel_examples_submission_id_fkey"
            columns: ["submission_id"]
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          }
        ]
      }
      submission_files: {
        Row: {
          id: string
          submission_id: string
          file_path: string
          file_name: string
          file_type: string
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          file_path: string
          file_name: string
          file_type: string
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          file_path?: string
          file_name?: string
          file_type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_submission_id_fkey"
            columns: ["submission_id"]
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          }
        ]
      }
      submission_notes: {
        Row: {
          id: string
          submission_id: string
          note: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          note: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          note?: string
          created_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_notes_submission_id_fkey"
            columns: ["submission_id"]
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          }
        ]
      }
      submissions: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          cell_phone: string
          website: string
          problem_solved: string
          tone: string[]
          other_tone: string | null
          duration: string
          other_duration: string | null
          footage_link: string
          footage_types: string[]
          other_footage_type: string | null
          script_structure: string
          non_negotiable_clips: string
          testimonials: string
          logo_folder_link: string
          credibility_markers: string[]
          other_credibility_marker: string | null
          speaker_bio: string
          additional_info: string
          status: 'new' | 'in-review' | 'complete'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          cell_phone: string
          website: string
          problem_solved: string
          tone: string[]
          other_tone?: string | null
          duration: string
          other_duration?: string | null
          footage_link: string
          footage_types: string[]
          other_footage_type?: string | null
          script_structure: string
          non_negotiable_clips: string
          testimonials: string
          logo_folder_link: string
          credibility_markers: string[]
          other_credibility_marker?: string | null
          speaker_bio: string
          additional_info: string
          status?: 'new' | 'in-review' | 'complete'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          cell_phone?: string
          website?: string
          problem_solved?: string
          tone?: string[]
          other_tone?: string | null
          duration?: string
          other_duration?: string | null
          footage_link?: string
          footage_types?: string[]
          other_footage_type?: string | null
          script_structure?: string
          non_negotiable_clips?: string
          testimonials?: string
          logo_folder_link?: string
          credibility_markers?: string[]
          other_credibility_marker?: string | null
          speaker_bio?: string
          additional_info?: string
          status?: 'new' | 'in-review' | 'complete'
          created_at?: string
          updated_at?: string
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
