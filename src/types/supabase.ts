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
      items: {
        Row: {
          id: string
          created_at: string
          person_name: string
          description: string
          category: 'urgent' | 'medium' | 'small'
          resolved: boolean
          resolved_at: string | null
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          person_name: string
          description: string
          category: 'urgent' | 'medium' | 'small'
          resolved?: boolean
          resolved_at?: string | null
          created_by: string
        }
        Update: {
          id?: string
          created_at?: string
          person_name?: string
          description?: string
          category?: 'urgent' | 'medium' | 'small'
          resolved?: boolean
          resolved_at?: string | null
          created_by?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          role: 'admin' | 'user'
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          role?: 'admin' | 'user'
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          role?: 'admin' | 'user'
        }
      }
    }
  }
}

export type Item = Database['public']['Tables']['items']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']