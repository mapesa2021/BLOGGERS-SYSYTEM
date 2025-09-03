# 🚀 Clubzila Subscription Integration Guide

This guide explains how to set up and use the Clubzila subscription API integration in your landing pages.

## 📋 What's Included

✅ **Functional Subscribe Buttons** - Real subscription forms with phone number input  
✅ **OTP Verification** - Secure phone number verification via SMS  
✅ **Clubzila API Integration** - Direct integration with Clubzila platform  
✅ **User Authentication** - Automatic user registration and login  
✅ **Subscription Management** - Check existing subscriptions and process payments  
✅ **Error Handling** - Comprehensive error handling and user feedback  

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```bash
# Clubzila API Configuration
NEXT_PUBLIC_CLUBZILA_API_URL=https://clubzila.com/api
CLUBZILA_API_KEY=your_actual_api_key_here
CLUBZILA_WEBHOOK_SECRET=your_actual_webhook_secret_here
```

### 2. Get Your Clubzila API Credentials

1. **Login to Clubzila Dashboard** at https://clubzila.com
2. **Navigate to API Settings** or Developer section
3. **Generate API Key** for your application
4. **Copy Webhook Secret** for webhook verification
5. **Update the environment variables** with your actual credentials

### 3. Test the Integration

Visit `/api/subscribe` in your browser to test the Clubzila API connectivity:

```bash
curl http://localhost:3000/api/subscribe
```

## 🔄 How It Works

### Subscription Flow

1. **User enters phone number** on landing page
2. **System requests OTP** from Clubzila API
3. **User receives SMS** with verification code
4. **User enters OTP** to verify phone number
5. **System processes subscription** through Clubzila
6. **User gets access** to creator's content

### API Endpoints Used

- `POST /funnel/request-otp` - Request OTP for phone number
- `POST /funnel/verify-otp` - Verify OTP and authenticate user
- `POST /funnel/get-user` - Get user information
- `POST /funnel/signup` - Register new user
- `POST /funnel/check-subscription` - Check subscription status
- `POST /funnel/pay-subscription` - Process payment/subscription

## 📱 Landing Page Integration

### Minimal Template

The minimal template now includes:
- Phone number input field
- OTP verification step
- Success/error messages
- Responsive design

### Modern Business Template

The modern business template includes:
- Hero section with subscription form
- Feature highlights
- Professional styling
- Mobile-responsive layout

## 🧪 Testing

### Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Create a landing page** with any creator ID

3. **Test the subscription flow:**
   - Enter a phone number
   - Check if OTP is requested
   - Verify the API responses

### Test API Endpoints

```bash
# Test Clubzila connectivity
curl http://localhost:3000/api/subscribe

# Test subscription (replace with actual values)
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+255123456789","creatorId":"test-creator"}'
```

## 🔧 Customization

### Modify API Endpoints

Edit `lib/config.ts` to change API endpoints:

```typescript
export const clubzilaConfig = {
  apiUrl: 'https://your-custom-domain.com/api',
  apiKey: 'your_api_key',
  // ... other settings
};
```

### Customize Templates

Modify the subscription forms in `lib/template-engine.ts`:

- Change form styling
- Add additional fields
- Modify success/error messages
- Customize the user experience

### Add Features

Extend the integration by:

- Adding payment amount input
- Implementing subscription tiers
- Adding user profile management
- Integrating with other Clubzila features

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if Clubzila API is accessible
   - Verify API URL in configuration
   - Check network connectivity

2. **OTP Not Received**
   - Verify phone number format
   - Check Clubzila SMS service status
   - Verify API key permissions

3. **Subscription Failed**
   - Check user authentication
   - Verify creator ID exists
   - Check payment processing status

### Debug Mode

Enable debug logging by checking the browser console for detailed API request/response information.

## 📚 API Reference

### ClubzilaIntegration Class

```typescript
// Initialize
const clubzila = new ClubzilaIntegration();

// Request OTP
const otpResult = await clubzila.requestOtp(phoneNumber);

// Verify OTP
const authResult = await clubzila.verifyOtp(phoneNumber, otp);

// Check subscription
const subResult = await clubzila.checkSubscription(userId, creatorId);

// Process payment
const paymentResult = await clubzila.processPayment(authId, creatorId, phoneNumber);
```

### Response Format

All API responses follow this format:

```typescript
{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}
```

## 🔒 Security Considerations

- **API Keys** are stored server-side only
- **Phone numbers** are validated before processing
- **OTP verification** prevents unauthorized access
- **Error messages** don't expose sensitive information
- **Webhook verification** ensures data integrity

## 📞 Support

For Clubzila API support:
- **Documentation**: https://clubzila.com/docs
- **API Status**: https://status.clubzila.com
- **Support**: support@clubzila.com

For integration support:
- Check the browser console for error messages
- Verify environment variable configuration
- Test API endpoints individually
- Review the Clubzila API documentation

## 🎉 What's Next?

Your landing pages now have:
- ✅ **Real subscription functionality**
- ✅ **Clubzila platform integration**
- ✅ **Professional user experience**
- ✅ **Secure authentication flow**

Users can now:
- Subscribe to creators through your landing pages
- Get verified via SMS OTP
- Access content through Clubzila platform
- Manage their subscriptions

The integration is production-ready and can handle real users and payments! 🚀

