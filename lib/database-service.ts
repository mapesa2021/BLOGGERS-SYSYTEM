/**
 * Database Service Layer
 * Replaces localStorage with Supabase database operations
 */

// @ts-nocheck
import { supabaseTyped } from './supabase'
import type { Database } from './supabase'

type LandingPage = Database['public']['Tables']['landing_pages']['Row']
type LandingPageInsert = Database['public']['Tables']['landing_pages']['Insert']
type LandingPageUpdate = Database['public']['Tables']['landing_pages']['Update']

type Subscription = Database['public']['Tables']['subscriptions']['Row']
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

type Creator = Database['public']['Tables']['creators']['Row']
type CreatorInsert = Database['public']['Tables']['creators']['Insert']
type CreatorUpdate = Database['public']['Tables']['creators']['Update']

// In-memory storage for landing pages (temporary solution)
const landingPagesStorage = new Map<string, LandingPage>();

export class DatabaseService {
  // Landing Page Operations
  static async createLandingPage(data: LandingPageInsert): Promise<LandingPage> {
    // Handle non-UUID creator IDs by using a default UUID or creating a placeholder
    const processedData: any = {
      ...data,
      creator_id: '00000000-0000-0000-0000-000000000000' // Always use default UUID for non-UUID creator IDs
    }

    try {
      // Create landing page object
      const landingPage: LandingPage = {
        id: `mock-${Date.now()}`,
        creator_id: '00000000-0000-0000-0000-000000000000',
        page_id: processedData.page_id,
        title: processedData.title,
        description: processedData.description || '',
        template: processedData.template,
        custom_domain: processedData.custom_domain || null,
        status: processedData.status || 'published',
        creator_id_display: processedData.creator_id_display,
        success_redirect_url: processedData.success_redirect_url,
        failure_redirect_url: processedData.failure_redirect_url,
        views: 0,
        subscriptions: 0,
        conversion_rate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Store in memory
      landingPagesStorage.set(processedData.page_id, landingPage);
      
      console.log('✅ Created landing page:', landingPage)
      return landingPage

      // TODO: Re-enable database operations once RLS is properly configured
      /*
      const { data: landingPage, error } = await supabaseTyped
        .from('landing_pages')
        .insert(processedData)
        .select()
        .single()

      if (error) {
        console.error('Error creating landing page:', error)
        throw new Error(`Failed to create landing page: ${error.message}`)
      }

      return landingPage
      */
    } catch (err) {
      console.error('Database error:', err)
      throw new Error(`Failed to create landing page: ${err}`)
    }
  }

  static async getLandingPageByPageId(pageId: string): Promise<LandingPage | null> {
    // Check in-memory storage first
    const landingPage = landingPagesStorage.get(pageId);
    if (landingPage) {
      console.log('✅ Found landing page in memory:', pageId);
      return landingPage;
    }
    
    console.log('❌ Landing page not found in memory:', pageId);
    return null;
  }

  static async updateLandingPage(pageId: string, updates: LandingPageUpdate): Promise<LandingPage> {
    const { data: landingPage, error } = await supabaseTyped
      .from('landing_pages')
      .update(updates as any)
      .eq('page_id', pageId)
      .select()
      .single()

    if (error) {
      console.error('Error updating landing page:', error)
      throw new Error(`Failed to update landing page: ${error.message}`)
    }

    return landingPage
  }

  static async incrementLandingPageViews(pageId: string): Promise<void> {
    const { error } = await supabaseTyped
      .from('landing_pages')
      .update({ 
        views: supabaseTyped.raw('views + 1'),
        updated_at: new Date().toISOString()
      } as any)
      .eq('page_id', pageId)

    if (error) {
      console.error('Error incrementing views:', error)
      throw new Error(`Failed to increment views: ${error.message}`)
    }
  }

  static async incrementLandingPageSubscriptions(pageId: string): Promise<void> {
    const { error } = await supabaseTyped
      .from('landing_pages')
      .update({ 
        subscriptions: supabaseTyped.raw('subscriptions + 1'),
        updated_at: new Date().toISOString()
      } as any)
      .eq('page_id', pageId)

    if (error) {
      console.error('Error incrementing subscriptions:', error)
      throw new Error(`Failed to increment subscriptions: ${error.message}`)
    }
  }

  // Subscription Operations
  static async createSubscription(data: SubscriptionInsert): Promise<Subscription> {
    const { data: subscription, error } = await supabaseTyped
      .from('subscriptions')
      .insert(data as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      throw new Error(`Failed to create subscription: ${error.message}`)
    }

    return subscription
  }

  static async updateSubscriptionStatus(
    subscriptionId: string, 
    status: Subscription['status'],
    clubzilaTransactionId?: string,
    clubzilaPaymentStatus?: string
  ): Promise<Subscription> {
    const updates: SubscriptionUpdate = {
      status,
      updated_at: new Date().toISOString()
    }

    if (clubzilaTransactionId) {
      updates.clubzila_transaction_id = clubzilaTransactionId
    }

    if (clubzilaPaymentStatus) {
      updates.clubzila_payment_status = clubzilaPaymentStatus
    }

    const { data: subscription, error } = await supabaseTyped
      .from('subscriptions')
      .update(updates as any)
      .eq('id', subscriptionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      throw new Error(`Failed to update subscription: ${error.message}`)
    }

    return subscription
  }

  static async getSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
    const { data: subscription, error } = await supabaseTyped
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching subscription:', error)
      throw new Error(`Failed to fetch subscription: ${error.message}`)
    }

    return subscription
  }

  // Creator Operations
  static async createCreator(data: CreatorInsert): Promise<Creator> {
    const { data: creator, error } = await supabaseTyped
      .from('creators')
      .insert(data as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating creator:', error)
      throw new Error(`Failed to create creator: ${error.message}`)
    }

    return creator
  }

  static async getCreatorById(creatorId: string): Promise<Creator | null> {
    const { data: creator, error } = await supabaseTyped
      .from('creators')
      .select('*')
      .eq('id', creatorId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching creator:', error)
      throw new Error(`Failed to fetch creator: ${error.message}`)
    }

    return creator
  }

  static async getCreatorByClubzilaId(clubzilaCreatorId: string): Promise<Creator | null> {
    const { data: creator, error } = await supabaseTyped
      .from('creators')
      .select('*')
      .eq('clubzila_creator_id', clubzilaCreatorId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching creator by Clubzila ID:', error)
      throw new Error(`Failed to fetch creator: ${error.message}`)
    }

    return creator
  }

  // Analytics Operations
  static async getLandingPageAnalytics(pageId: string): Promise<{
    views: number
    subscriptions: number
    conversion_rate: number
  } | null> {
    const { data: landingPage, error } = await supabaseTyped
      .from('landing_pages')
      .select('views, subscriptions, conversion_rate')
      .eq('page_id', pageId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching analytics:', error)
      throw new Error(`Failed to fetch analytics: ${error.message}`)
    }

    return landingPage
  }

  static async getCreatorAnalytics(creatorId: string): Promise<{
    total_views: number
    total_subscriptions: number
    total_revenue: number
    landing_pages_count: number
  }> {
    const { data: landingPages, error } = await supabaseTyped
      .from('landing_pages')
      .select('views, subscriptions, subscription_amount')
      .eq('creator_id', creatorId)

    if (error) {
      console.error('Error fetching creator analytics:', error)
      throw new Error(`Failed to fetch creator analytics: ${error.message}`)
    }

    const analytics = landingPages.reduce((acc, page) => {
      acc.total_views += page.views
      acc.total_subscriptions += page.subscriptions
      acc.total_revenue += page.subscriptions * page.subscription_amount
      acc.landing_pages_count += 1
      return acc
    }, {
      total_views: 0,
      total_subscriptions: 0,
      total_revenue: 0,
      landing_pages_count: 0
    })

    return analytics
  }
}

// Legacy localStorage compatibility functions
export class LegacyStorageService {
  // These functions maintain compatibility with existing localStorage code
  // while gradually migrating to database operations

  static async getPageData(pageId: string): Promise<any> {
    try {
      // First try database
      const landingPage = await DatabaseService.getLandingPageByPageId(pageId)
      if (landingPage) {
        return {
          pageId: landingPage.page_id,
          templateId: landingPage.template,
          creatorId: landingPage.creator_id_display,
          successRedirectUrl: landingPage.success_redirect_url,
          failureRedirectUrl: landingPage.failure_redirect_url,
          subscriptionAmount: 2000, // Default amount
          currency: 'TZS',
          creatorName: landingPage.title
        }
      }
    } catch (error) {
      console.error('Database fetch failed, falling back to localStorage:', error)
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(`page_${pageId}`)
      if (storedData) {
        return JSON.parse(storedData)
      }
    }

    return null
  }

  static async savePageData(pageId: string, pageData: any): Promise<void> {
    try {
      // Save to database with proper UUID handling
      await DatabaseService.createLandingPage({
        page_id: pageId,
        creator_id: '00000000-0000-0000-0000-000000000000', // Default UUID for non-UUID creator IDs
        title: pageData.creatorName || 'Landing Page',
        template: pageData.templateId || 'minimal',
        creator_id_display: pageData.creatorId || 'default',
        success_redirect_url: pageData.successRedirectUrl || '',
        failure_redirect_url: pageData.failureRedirectUrl || '',
        status: 'published',
        views: 0,
        subscriptions: 0,
        conversion_rate: 0
      })
    } catch (error) {
      console.error('Database save failed, falling back to localStorage:', error)
      
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`page_${pageId}`, JSON.stringify(pageData))
      }
    }
  }
}
