export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      partnerships: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          topic: string
          location: string | null
          contact_email: string | null
          website: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          topic: string
          location?: string | null
          contact_email?: string | null
          website?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          topic?: string
          location?: string | null
          contact_email?: string | null
          website?: string | null
          created_at?: string
          user_id?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string | null
          is_virtual: boolean
          topic: string
          website: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location?: string | null
          is_virtual?: boolean
          topic: string
          website?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string | null
          is_virtual?: boolean
          topic?: string
          website?: string | null
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}
