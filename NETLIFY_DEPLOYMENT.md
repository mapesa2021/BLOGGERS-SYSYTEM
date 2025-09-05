# Netlify Deployment Guide

## Issues Fixed

### 1. UUID Validation Error
- **Problem**: Database expected UUID format for creator IDs, but simple numbers like "1821" were being used
- **Solution**: Updated database service to handle non-UUID creator IDs with a default UUID placeholder

### 2. Netlify Routing Issues
- **Problem**: Dynamic routes like `/page/[pageId]` weren't working on Netlify
- **Solution**: Added `netlify.toml` and `_redirects` files for proper routing

### 3. API Routes Configuration
- **Problem**: API routes weren't being handled correctly
- **Solution**: Configured Netlify to properly handle Next.js API routes

## Environment Variables Required

Set these in your Netlify dashboard under Site Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
CLUBZILA_API_URL=https://api.clubzila.com
CLUBZILA_API_KEY=your_clubzila_api_key_here
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
NODE_ENV=production
```

## Build Settings

- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Node Version**: 18

## Files Added

1. `netlify.toml` - Main Netlify configuration
2. `public/_redirects` - Additional routing rules
3. Updated `lib/database-service.ts` - Fixed UUID handling
4. Updated `next.config.js` - Optimized for deployment

## Testing

After deployment, test these URLs:
- Main site: `https://your-app.netlify.app`
- Dynamic page: `https://your-app.netlify.app/page/test-page`
- API endpoint: `https://your-app.netlify.app/api/landing-pages`

## Troubleshooting

If you still see "Page not found" errors:
1. Check that environment variables are set correctly
2. Verify Supabase connection is working
3. Check Netlify function logs for API errors
4. Ensure database schema is properly set up
