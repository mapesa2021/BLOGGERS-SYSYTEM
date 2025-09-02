/**
 * Clubzila Integration Service
 * 
 * A standalone, reusable service for Clubzila platform integration.
 * Handles user authentication, subscription management, and payment processing.
 * 
 * Usage:
 * const clubzila = new ClubzilaIntegration();
 * const user = await clubzila.authenticateUser(phoneNumber, otp);
 * const subscription = await clubzila.checkSubscription(userId, creatorId);
 * const payment = await clubzila.processPayment(userId, creatorId, amount);
 */

export interface ClubzilaConfig {
  apiUrl: string;
  apiKey?: string;
  webhookSecret?: string;
  timeout: number;
  retryAttempts: number;
}

export interface UserData {
  name?: string;
  phone_number: string;
  password?: string;
  countryCode?: string;
  agree_gdpr?: boolean;
  'g-recaptcha-response'?: string;
  referred_by?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user_id?: string;
    auth_id?: string;
    is_new_user?: boolean;
    requires_otp?: boolean;
    user_data?: any;
    user?: any;
    status?: string;
    exists?: boolean;
  };
  error?: any;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    has_active_subscription?: boolean;
    subscription_details?: any;
    subscription_id?: string;
    expires_at?: string;
  };
  error?: any;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    transaction_id?: string;
    payment_status?: string;
    payment_data?: any;
  };
  error?: any;
}

export interface CreatorResponse {
  success: boolean;
  message: string;
  data?: {
    creator?: any;
    creator_id?: string;
    name?: string;
    price?: number;
    currency?: string;
  };
  error?: any;
}

export class ClubzilaIntegration {
  private config: ClubzilaConfig;

  constructor(config?: Partial<ClubzilaConfig>) {
    this.config = {
      apiUrl: 'https://clubzila.com/api',
      apiKey: '',
      webhookSecret: '',
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      ...config,
    };
    
    console.log('Clubzila Integration initialized with:', {
      apiUrl: this.config.apiUrl,
      hasApiKey: !!this.config.apiKey,
      hasWebhookSecret: !!this.config.webhookSecret
    });
  }

  /**
   * Make HTTP request to Clubzila API
   */
  private async makeRequest(endpoint: string, data: any, method: 'GET' | 'POST' = 'POST'): Promise<Response> {
    const url = `${this.config.apiUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined,
    };

    console.log('Making request to:', url);
    console.log('Request options:', {
      method,
      headers: options.headers,
      body: options.body
    });

    try {
      const response = await fetch(url, options);
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      return response;
    } catch (error) {
      console.error('Fetch request failed:', error);
      throw error;
    }
  }

  /**
   * Request OTP for phone number
   */
  async requestOtp(phoneNumber: string): Promise<AuthResponse> {
    console.log('Requesting OTP for phone number:', phoneNumber);
    console.log('API URL:', this.config.apiUrl);
    
    try {
      const response = await this.makeRequest('/funnel/request-otp', {
        phone_number: phoneNumber,
      });

      console.log('OTP request response status:', response.status);
      console.log('OTP request response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('OTP request successful:', data);
        return {
          success: true,
          message: 'OTP sent successfully',
          data: data,
        };
      }

      const errorData = await response.json();
      console.error('OTP request failed with status:', response.status, errorData);
      return {
        success: false,
        message: `Failed to send OTP: ${response.status} ${response.statusText}`,
        error: errorData,
      };
    } catch (error) {
      console.error('Clubzila OTP request failed:', error);
      return {
        success: false,
        message: 'OTP request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify OTP and authenticate user
   */
  async verifyOtp(phoneNumber: string, otp: string): Promise<AuthResponse> {
    console.log('Verifying OTP for phone number:', phoneNumber);
    console.log('OTP provided:', otp);
    
    try {
      const response = await this.makeRequest('/funnel/verify-otp', {
        phone_number: phoneNumber,
        otp: otp,
      });

      console.log('OTP verification response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('OTP verification successful:', data);
        return {
          success: true,
          message: 'OTP verified successfully',
          data: {
            user_id: data.user_id || undefined,
            auth_id: data.auth_id || undefined,
            user_data: data.user || undefined,
            is_new_user: data.is_new_user || false,
          },
        };
      }

      const errorData = await response.json();
      console.error('OTP verification failed with status:', response.status, errorData);
      return {
        success: false,
        message: `Invalid OTP: ${response.status} ${response.statusText}`,
        error: errorData,
      };
    } catch (error) {
      console.error('Clubzila OTP verification failed:', error);
      return {
        success: false,
        message: 'OTP verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get user information from Clubzila
   */
  async getUser(phoneNumber: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/funnel/get-user', {
        phone_number: phoneNumber,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'User retrieved successfully',
          data: {
            user: data.user || undefined,
            user_id: data.user?.id || undefined,
            status: data.user?.status || undefined,
            exists: !!(data.user),
          },
        };
      }

      return {
        success: false,
        message: 'User not found',
        data: { exists: false },
      };
    } catch (error) {
      console.error('Clubzila get user failed:', error);
      return {
        success: false,
        message: 'Failed to get user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Register new user with Clubzila
   */
  async registerUser(userData: UserData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/funnel/signup', {
        name: userData.name || userData.phone_number,
        phone_number: userData.phone_number,
        password: userData.password || userData.phone_number,
        countryCode: userData.countryCode || '255',
        agree_gdpr: userData.agree_gdpr ?? true,
        'g-recaptcha-response': userData['g-recaptcha-response'] || 'true',
        referred_by: userData.referred_by || undefined,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'User registered successfully',
          data: {
            user_id: data.data?.id || data.user?.id || undefined,
            auth_id: data.data?.id || data.user?.id || undefined,
            user_data: data.data || data.user || undefined,
          },
        };
      }

      const errorData = await response.json();
      return {
        success: false,
        message: 'User registration failed',
        error: errorData,
      };
    } catch (error) {
      console.error('Clubzila user registration failed:', error);
      return {
        success: false,
        message: 'User registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check subscription status
   */
  async checkSubscription(userId: string, creatorId: string): Promise<SubscriptionResponse> {
    try {
      const response = await this.makeRequest('/funnel/check-subscription', {
        user_id: userId,
        creator_id: creatorId,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Subscription status retrieved',
          data: {
            has_active_subscription: data.has_active_subscription || false,
            subscription_details: data.subscription_details || undefined,
            subscription_id: data.subscription_id || undefined,
            expires_at: data.expires_at || undefined,
          },
        };
      }

      const errorData = await response.json();
      return {
        success: false,
        message: 'Failed to check subscription',
        error: errorData,
      };
    } catch (error) {
      console.error('Clubzila subscription check failed:', error);
      return {
        success: false,
        message: 'Subscription check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process payment/subscription
   */
  async processPayment(authId: string, creatorId: string, phoneNumber: string, amount?: number): Promise<PaymentResponse> {
    try {
      const payload: any = {
        auth_id: authId,
        creator_id: creatorId,
        phone_number: phoneNumber,
      };

      if (amount) {
        payload.amount = amount;
      }

      const response = await this.makeRequest('/funnel/pay-subscription', payload);

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Payment initiated successfully',
          data: {
            transaction_id: data.transaction_id || undefined,
            payment_status: data.status || 'pending',
            payment_data: data,
          },
        };
      }

      const errorData = await response.json();
      return {
        success: false,
        message: 'Payment failed',
        error: errorData,
      };
    } catch (error) {
      console.error('Clubzila payment processing failed:', error);
      return {
        success: false,
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get creator information
   */
  async getCreator(creatorId: string): Promise<CreatorResponse> {
    try {
      const response = await this.makeRequest('/funnel/get-creator', {
        creator_id: creatorId,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Creator information retrieved',
          data: {
            creator: data.creator || undefined,
            creator_id: data.creator?.id || undefined,
            name: data.creator?.name || undefined,
            price: data.creator?.price || undefined,
            currency: data.creator?.currency || 'TZS',
          },
        };
      }

      const errorData = await response.json();
      return {
        success: false,
        message: 'Creator not found',
        error: errorData,
      };
    } catch (error) {
      console.error('Clubzila get creator failed:', error);
      return {
        success: false,
        message: 'Failed to get creator',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Complete authentication flow (OTP request + verification)
   */
  async authenticateUser(phoneNumber: string, otp?: string): Promise<AuthResponse> {
    console.log('Authenticating user:', phoneNumber, otp ? 'with OTP' : 'without OTP');
    
    // Step 1: Check if user exists
    const userCheck = await this.getUser(phoneNumber);

    if (!userCheck.success) {
      return userCheck;
    }

    const userExists = userCheck.data?.exists || false;
    const userId = userCheck.data?.user_id || undefined;
    const userStatus = userCheck.data?.status || undefined;

    // If user exists and is active, no OTP needed
    if (userExists && userStatus === 'active') {
      return {
        success: true,
        message: 'User authenticated successfully',
        data: {
          user_id: userId,
          auth_id: userId,
          is_new_user: false,
          requires_otp: false,
          user_data: userCheck.data?.user,
        },
      };
    }

    // If user doesn't exist, register them
    if (!userExists) {
      const registration = await this.registerUser({
        name: phoneNumber,
        phone_number: phoneNumber,
        password: phoneNumber,
      });

      if (!registration.success) {
        return registration;
      }

      const newUserId = registration.data?.user_id;
      if (!newUserId) {
        return {
          success: false,
          message: 'Failed to get user ID after registration',
        };
      }
    }

    // If OTP is provided, verify it
    if (otp) {
      const otpVerification = await this.verifyOtp(phoneNumber, otp);
      
      if (!otpVerification.success) {
        return otpVerification;
      }

      return {
        success: true,
        message: 'User authenticated successfully',
        data: {
          user_id: userId,
          auth_id: otpVerification.data?.auth_id || userId,
          is_new_user: otpVerification.data?.is_new_user || false,
          requires_otp: false,
          user_data: otpVerification.data?.user_data,
        },
      };
    }

    // OTP required
    return {
      success: true,
        message: 'OTP required for authentication',
        data: {
          user_id: userId,
          auth_id: userId,
          is_new_user: !userExists,
          requires_otp: true,
        },
    };
  }

  /**
   * Complete subscription flow (check + process payment if needed)
   */
  async handleSubscription(userId: string, creatorId: string, phoneNumber: string, autoPay: boolean = false): Promise<SubscriptionResponse> {
    // Step 1: Check current subscription
    const subscriptionCheck = await this.checkSubscription(userId, creatorId);
    
    if (!subscriptionCheck.success) {
      return subscriptionCheck;
    }

    const hasSubscription = subscriptionCheck.data?.has_active_subscription || false;

    // If user has active subscription, return success
    if (hasSubscription) {
      return {
        success: true,
        message: 'User has active subscription',
        data: {
          has_active_subscription: true,
          subscription_details: subscriptionCheck.data?.subscription_details,
        },
      };
    }

    // If auto-pay is enabled, process payment
    if (autoPay) {
      const payment = await this.processPayment(userId, creatorId, phoneNumber);
      
      if (!payment.success) {
        return {
          success: false,
          message: payment.message,
          error: payment.error,
        };
      }

      return {
        success: true,
        message: 'Payment initiated for subscription',
        data: {
          has_active_subscription: false,
        },
      };
    }

    // Payment required but not auto-processed
    return {
      success: true,
      message: 'Payment required for subscription',
      data: {
        has_active_subscription: false,
      },
    };
  }

  /**
   * Test Clubzila integration
   */
  async testIntegration(): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
    console.log('Testing Clubzila integration...');
    console.log('API URL:', this.config.apiUrl);
    console.log('Environment check:', {
      hasApiKey: !!this.config.apiKey,
      hasWebhookSecret: !!this.config.webhookSecret
    });
    
    // Test 1: Basic connectivity to the domain
    try {
      console.log('Test 1: Testing basic connectivity...');
      const testUrl = this.config.apiUrl.replace('/api', '');
      console.log('Testing domain:', testUrl);
      
      const response = await fetch(testUrl, { 
        method: 'GET',
        mode: 'cors'
      });
      
      console.log('Domain test response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      if (response.ok) {
        console.log('✅ Domain is accessible');
      } else {
        console.log('⚠️ Domain accessible but returned status:', response.status);
      }
    } catch (error) {
      console.log('❌ Domain test failed:', error);
    }
    
    // Test 2: Try the actual API endpoint with different modes
    try {
      console.log('Test 2: Testing API endpoint...');
      console.log('Testing API URL:', this.config.apiUrl);
      
      // Try with no-cors mode first
      try {
        console.log('Test 2a: Trying with no-cors mode...');
        const noCorsResponse = await fetch(this.config.apiUrl, { 
          method: 'GET',
          mode: 'no-cors'
        });
        console.log('no-cors response:', noCorsResponse);
      } catch (noCorsError) {
        console.log('no-cors failed:', noCorsError);
      }
      
      // Try with cors mode
      console.log('Test 2b: Trying with cors mode...');
      const response = await fetch(this.config.apiUrl, { 
        method: 'GET',
        mode: 'cors'
      });
      
      console.log('API test response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        return {
          success: true,
          message: 'Clubzila integration test successful',
          data: {
            api_url: this.config.apiUrl,
            connectivity: 'OK',
            status: response.status,
          },
        };
      }

      return {
        success: false,
        message: `Clubzila API returned status: ${response.status} ${response.statusText}`,
        data: {
          api_url: this.config.apiUrl,
          status_code: response.status,
          status_text: response.statusText
        },
      };
    } catch (error) {
      console.error('❌ API test failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error - check if the API URL is correct';
      } else if (error instanceof TypeError && error.message.includes('CORS')) {
        errorMessage = 'CORS error - API server needs to allow cross-origin requests';
      } else {
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
      }
      
      return {
        success: false,
        message: `Clubzila integration test failed: ${errorMessage}`,
        error: errorMessage,
      };
    }
  }
}

// Export a default instance
export const clubzila = new ClubzilaIntegration();
