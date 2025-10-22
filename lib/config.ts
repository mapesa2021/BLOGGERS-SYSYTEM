/**
 * Clubzila API Configuration
 * 
 * Update these values with your actual Clubzila API credentials
 */

export const clubzilaConfig = {
  // API Base URL - Update this to your Clubzila API endpoint
  apiUrl: process.env.CLUBZILA_API_URL || 'https://clubzila.com/api',
  
  // API Key - Get this from your Clubzila dashboard
  apiKey: process.env.CLUBZILA_API_KEY || 'your_api_key_here',
  
  // Webhook Secret - For webhook verification
  webhookSecret: process.env.CLUBZILA_WEBHOOK_SECRET || 'your_webhook_secret_here',
  
  // Request timeout in milliseconds
  timeout: Number(process.env.CLUBZILA_TIMEOUT) || 30000,
  
  // Number of retry attempts
  retryAttempts: Number(process.env.CLUBZILA_RETRY_ATTEMPTS) || 3,

  // Creator IDs (from environment variables)
  creators: {
    creator1: process.env.CLUBZILA_CREATOR_ID_1 || '110',
    creator2: process.env.CLUBZILA_CREATOR_ID_2 || '107',
  },

  // Default values for payments
  defaults: {
    phoneNumber: process.env.CLUBZILA_PHONE_NUMBER || '0754546567',
    amount: Number(process.env.CLUBZILA_AMOUNT) || 2000,
  }
};

/**
 * Environment Variables to set in your .env.local file:
 * 
 * CLUBZILA_API_URL=https://clubzila.com/api
 * CLUBZILA_API_KEY=your_actual_api_key
 * CLUBZILA_WEBHOOK_SECRET=your_actual_webhook_secret
 * CLUBZILA_CREATOR_ID_1=110
 * CLUBZILA_CREATOR_ID_2=107
 * CLUBZILA_PHONE_NUMBER=0754546567
 * CLUBZILA_AMOUNT=500
 * CLUBZILA_TIMEOUT=30000
 * CLUBZILA_RETRY_ATTEMPTS=3
 * 
 * Note: Variables starting with NEXT_PUBLIC_ are exposed to the browser
 */
