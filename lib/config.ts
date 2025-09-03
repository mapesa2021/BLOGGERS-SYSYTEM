/**
 * Clubzila API Configuration
 * 
 * Update these values with your actual Clubzila API credentials
 */

export const clubzilaConfig = {
  // API Base URL - Update this to your Clubzila API endpoint
  apiUrl: process.env.NEXT_PUBLIC_CLUBZILA_API_URL || 'https://clubzila.com/api',
  
  // API Key - Get this from your Clubzila dashboard
  apiKey: process.env.CLUBZILA_API_KEY || 'your_api_key_here',
  
  // Webhook Secret - For webhook verification
  webhookSecret: process.env.CLUBZILA_WEBHOOK_SECRET || 'your_webhook_secret_here',
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Number of retry attempts
  retryAttempts: 3
};

/**
 * Environment Variables to set in your .env.local file:
 * 
 * NEXT_PUBLIC_CLUBZILA_API_URL=https://clubzila.com/api
 * CLUBZILA_API_KEY=your_actual_api_key
 * CLUBZILA_WEBHOOK_SECRET=your_actual_webhook_secret
 * 
 * Note: Variables starting with NEXT_PUBLIC_ are exposed to the browser
 */

