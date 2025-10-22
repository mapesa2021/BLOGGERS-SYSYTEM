/**
 * Supabase Configuration for Production Database
 * Handles all database operations for the landing page system
 */

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ysvjirsmfvxnvzxsqoui.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzdmppcnNtZnZ4bnZ6eHNxb3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzgxNjUsImV4cCI6MjA3MjY1NDE2NX0.VYpWhiUp-JRZ53yJRYeDx0XUOW5DDJpOoNTnv2N5W28'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create Supabase client for server-side operations (bypasses RLS)
export const supabaseTyped = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string
          email: string
          phone_number: string
          name: string
          business_name?: string
          avatar_url?: string
          status: 'pending' | 'active' | 'suspended'
          clubzila_creator_id: string
          clubzila_auth_id: string
          subscription_amount: number
          currency: string
          created_at: string
          updated_at: string
          last_login_at?: string
        }
        Insert: {
          id?: string
          email: string
          phone_number: string
          name: string
          business_name?: string
          avatar_url?: string
          status?: 'pending' | 'active' | 'suspended'
          clubzila_creator_id: string
          clubzila_auth_id: string
          subscription_amount: number
          currency: string
          created_at?: string
          updated_at?: string
          last_login_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone_number?: string
          name?: string
          business_name?: string
          avatar_url?: string
          status?: 'pending' | 'active' | 'suspended'
          clubzila_creator_id?: string
          clubzila_auth_id?: string
          subscription_amount?: number
          currency?: string
          created_at?: string
          updated_at?: string
          last_login_at?: string
        }
      }
      landing_pages: {
        Row: {
          id: string
          creator_id: string
          page_id: string
          title: string
          description?: string
          template: 'minimal' | 'modern' | 'creative' | 'professional'
          custom_domain?: string
          status: 'draft' | 'published' | 'archived'
          creator_id_display: string
          success_redirect_url: string
          failure_redirect_url: string
          views: number
          subscriptions: number
          conversion_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          page_id: string
          title: string
          description?: string
          template: 'minimal' | 'modern' | 'creative' | 'professional'
          custom_domain?: string
          status?: 'draft' | 'published' | 'archived'
          creator_id_display: string
          success_redirect_url: string
          failure_redirect_url: string
          views?: number
          subscriptions?: number
          conversion_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          page_id?: string
          title?: string
          description?: string
          template?: 'minimal' | 'modern' | 'creative' | 'professional'
          custom_domain?: string
          status?: 'draft' | 'published' | 'archived'
          creator_id_display?: string
          success_redirect_url?: string
          failure_redirect_url?: string
          views?: number
          subscriptions?: number
          conversion_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          landing_page_id: string
          creator_id: string
          user_phone_number: string
          user_name?: string
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          clubzila_transaction_id?: string
          clubzila_payment_status?: string
          success_redirect_url: string
          redirect_completed: boolean
          redirect_timestamp?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          landing_page_id: string
          creator_id: string
          user_phone_number: string
          user_name?: string
          amount: number
          currency: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          clubzila_transaction_id?: string
          clubzila_payment_status?: string
          success_redirect_url: string
          redirect_completed?: boolean
          redirect_timestamp?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          landing_page_id?: string
          creator_id?: string
          user_phone_number?: string
          user_name?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          clubzila_transaction_id?: string
          clubzila_payment_status?: string
          success_redirect_url?: string
          redirect_completed?: boolean
          redirect_timestamp?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

