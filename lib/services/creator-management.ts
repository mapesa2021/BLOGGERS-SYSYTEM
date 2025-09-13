/**
 * Creator Management Service
 * Handles all creator-related operations including registration, landing pages, and analytics
 */

import { Creator, LandingPage, Subscription, CreatorAnalytics } from '../database/schema';
import { ClubzilaIntegration } from '../clubzila-integration';

export class CreatorManagementService {
  private clubzila: ClubzilaIntegration;

  constructor() {
    this.clubzila = new ClubzilaIntegration();
  }

  /**
   * Register a new creator
   */
  async registerCreator(creatorData: {
    email: string;
    phone_number: string;
    name: string;
    business_name?: string;
    clubzila_creator_id: string;
    clubzila_auth_id: string;
    subscription_amount: number;
    currency?: string;
  }): Promise<{ success: boolean; creator?: Creator; message?: string; error?: any }> {
    try {
      // For now, skip Clubzila credentials validation
      // In production, you would validate these credentials
      console.log('Registering creator with Clubzila IDs:', {
        creator_id: creatorData.clubzila_creator_id,
        auth_id: creatorData.clubzila_auth_id
      });

      // Create creator record (in real app, this would save to database)
      const creator: Creator = {
        id: this.generateId(),
        ...creatorData,
        status: 'pending',
        currency: creatorData.currency || 'USD',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Send welcome email and onboarding instructions
      await this.sendWelcomeEmail(creator);

      return {
        success: true,
        creator,
        message: 'Creator registered successfully! Check your email for onboarding instructions.'
      };

    } catch (error) {
      console.error('Creator registration failed:', error);
      return {
        success: false,
        message: 'Creator registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a new landing page for a creator
   */
  async createLandingPage(creatorId: string, pageData: {
    title: string;
    description?: string;
    template: LandingPage['template'];
    creator_id_display: string;
    success_redirect_url: string;
    failure_redirect_url?: string;
    custom_domain?: string;
  }): Promise<{ success: boolean; landingPage?: LandingPage; message?: string; error?: any }> {
    try {
      // Validate creator exists and is active
      const creator = await this.getCreator(creatorId);
      if (!creator || creator.status !== 'active') {
        return {
          success: false,
          message: 'Creator not found or account not active'
        };
      }

      // Generate unique page ID
      const pageId = this.generatePageId(pageData.title);

      // Create landing page record
      const landingPage: LandingPage = {
        id: this.generateId(),
        creator_id: creatorId,
        page_id: pageId,
        ...pageData,
        failure_redirect_url: pageData.failure_redirect_url || pageData.success_redirect_url, // Use success URL as fallback
        status: 'draft',
        views: 0,
        subscriptions: 0,
        conversion_rate: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Initialize analytics tracking
      await this.initializeAnalytics(creatorId, pageId);

      return {
        success: true,
        landingPage,
        message: 'Landing page created successfully! You can now customize and publish it.'
      };

    } catch (error) {
      console.error('Landing page creation failed:', error);
      return {
        success: false,
        message: 'Landing page creation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update landing page settings
   */
  async updateLandingPage(pageId: string, updates: Partial<LandingPage>): Promise<{ success: boolean; message?: string; error?: any }> {
    try {
      // In real app, this would update the database
      console.log(`Updating landing page ${pageId}:`, updates);
      
      return {
        success: true,
        message: 'Landing page updated successfully!'
      };

    } catch (error) {
      console.error('Landing page update failed:', error);
      return {
        success: false,
        message: 'Landing page update failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Publish landing page
   */
  async publishLandingPage(pageId: string): Promise<{ success: boolean; message?: string; error?: any }> {
    try {
      // Update status to published
      await this.updateLandingPage(pageId, {
        status: 'published',
        published_at: new Date()
      });

      // Generate public URL
      const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/page/${pageId}`;

      return {
        success: true,
        message: `Landing page published successfully! Public URL: ${publicUrl}`
      };

    } catch (error) {
      console.error('Landing page publication failed:', error);
      return {
        success: false,
        message: 'Landing page publication failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Track page view
   */
  async trackPageView(pageId: string, userData?: { ip?: string; userAgent?: string }): Promise<void> {
    try {
      // In real app, this would increment view count and log analytics
      console.log(`Page view tracked for ${pageId}:`, userData);
      
      // Update analytics
      await this.updateAnalytics(pageId, 'view');
      
    } catch (error) {
      console.error('Page view tracking failed:', error);
    }
  }

  /**
   * Process subscription with built-in creator data
   */
  async processSubscription(pageId: string, userData: {
    phone_number: string;
    name?: string;
  }): Promise<{ success: boolean; subscription?: Subscription; message?: string; error?: any }> {
    try {
      // Get landing page details
      const landingPage = await this.getLandingPage(pageId);
      if (!landingPage) {
        return {
          success: false,
          message: 'Landing page not found'
        };
      }

      // Get creator details
      const creator = await this.getCreator(landingPage.creator_id);
      if (!creator) {
        return {
          success: false,
          message: 'Creator not found'
        };
      }

      // No need to validate creator ID - it's already built into the page
      // The landing page already contains the correct creator information

      // Process payment with Clubzila using creator's credentials
      const paymentResult = await this.clubzila.processPayment(
        creator.clubzila_auth_id,      // Dynamic: Creator's Clubzila auth ID
        creator.clubzila_creator_id,    // Dynamic: Creator's Clubzila creator ID
        userData.phone_number,          // Dynamic: User's entered phone number
        creator.subscription_amount     // Dynamic: Creator's set amount
      );

      if (!paymentResult.success) {
        return {
          success: false,
          message: `Payment failed: ${paymentResult.message}`,
          error: paymentResult.error
        };
      }

      // Create subscription record
      const subscription: Subscription = {
        id: this.generateId(),
        landing_page_id: pageId,
        creator_id: creator.id,
        user_phone_number: userData.phone_number,
        user_name: userData.name,
        amount: creator.subscription_amount,
        currency: creator.currency,
        status: 'pending',
        clubzila_transaction_id: paymentResult.data?.transaction_id,
        clubzila_payment_status: paymentResult.data?.payment_status,
        success_redirect_url: landingPage.success_redirect_url,
        redirect_completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Update analytics
      await this.updateAnalytics(pageId, 'subscription');

      return {
        success: true,
        subscription,
        message: 'Subscription processed successfully! Check your phone for USSD prompt.'
      };

    } catch (error) {
      console.error('Subscription processing failed:', error);
      return {
        success: false,
        message: 'Subscription processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get creator analytics
   */
  async getCreatorAnalytics(creatorId: string, dateRange?: { start: Date; end: Date }): Promise<{ success: boolean; analytics?: CreatorAnalytics[]; message?: string; error?: any }> {
    try {
      // In real app, this would query the database
      const analytics: CreatorAnalytics[] = [
        {
          id: this.generateId(),
          creator_id: creatorId,
          date: new Date(),
          total_views: 150,
          total_subscriptions: 12,
          total_revenue: 6000,
          conversion_rate: 8.0,
          unique_visitors: 120,
          returning_visitors: 30,
          average_session_duration: 180,
          successful_payments: 12,
          failed_payments: 2,
          payment_success_rate: 85.7
        }
      ];

      return {
        success: true,
        analytics
      };

    } catch (error) {
      console.error('Analytics retrieval failed:', error);
      return {
        success: false,
        message: 'Analytics retrieval failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Helper methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generatePageId(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').substr(0, 20) + '-' + this.generateId();
  }

  private async getCreator(creatorId: string): Promise<Creator | null> {
    // In real app, this would query the database
    return null;
  }

  private async getLandingPage(pageId: string): Promise<LandingPage | null> {
    // In real app, this would query the database
    return null;
  }

  private async sendWelcomeEmail(creator: Creator): Promise<void> {
    // In real app, this would send actual email
    console.log(`Welcome email sent to ${creator.email}`);
  }

  private async initializeAnalytics(creatorId: string, pageId: string): Promise<void> {
    // In real app, this would create analytics records
    console.log(`Analytics initialized for creator ${creatorId}, page ${pageId}`);
  }

  private async updateAnalytics(pageId: string, event: 'view' | 'subscription'): Promise<void> {
    // In real app, this would update analytics records
    console.log(`Analytics updated for page ${pageId}, event: ${event}`);
  }
}
