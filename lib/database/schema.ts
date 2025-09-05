/**
 * Database Schema for Creator Management System
 * Supports 100+ creators with full self-service capabilities
 */

export interface Creator {
  id: string;
  email: string;
  phone_number: string;
  name: string;
  business_name?: string;
  avatar_url?: string;
  status: 'pending' | 'active' | 'suspended';
  clubzila_creator_id: string; // Clubzila's creator ID
  clubzila_auth_id: string;    // Clubzila's auth ID
  subscription_amount: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface LandingPage {
  id: string;
  creator_id: string;
  page_id: string; // Unique URL identifier
  title: string;
  description?: string;
  template: 'minimal' | 'modern' | 'creative' | 'professional';
  custom_domain?: string;
  status: 'draft' | 'published' | 'archived';
  
  // Customization settings
  creator_id_display: string; // What users see/enter
  success_redirect_url: string; // Where users go after payment
  failure_redirect_url: string; // Where users go if payment fails
  
  // Analytics tracking
  views: number;
  subscriptions: number;
  conversion_rate: number;
  
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface Subscription {
  id: string;
  landing_page_id: string;
  creator_id: string;
  user_phone_number: string;
  user_name?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  clubzila_transaction_id?: string;
  clubzila_payment_status?: string;
  
  // Success tracking
  success_redirect_url: string;
  redirect_completed: boolean;
  redirect_timestamp?: Date;
  
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface CreatorAnalytics {
  id: string;
  creator_id: string;
  date: Date;
  
  // Page performance
  total_views: number;
  total_subscriptions: number;
  total_revenue: number;
  conversion_rate: number;
  
  // User engagement
  unique_visitors: number;
  returning_visitors: number;
  average_session_duration: number;
  
  // Payment metrics
  successful_payments: number;
  failed_payments: number;
  payment_success_rate: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'support';
  permissions: string[];
  created_at: Date;
  last_login_at?: Date;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  updated_at: Date;
  updated_by: string;
}
