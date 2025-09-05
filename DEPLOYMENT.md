# Clubzila Landing Page Platform - Deployment Guide

## 🚀 Quick Start

### 1. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### 2. Production Build
```bash
# Build for production
npm run build
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
1. **Connect Repository**
   - Push code to GitHub/GitLab
   - Connect repository to Vercel
   - Vercel auto-detects Next.js

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_CLUBZILA_API_URL=https://clubzila.com/api
   CLUBZILA_API_KEY=your_api_key_here
   CLUBZILA_WEBHOOK_SECRET=your_webhook_secret
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Vercel automatically builds and deploys

### Option 2: Netlify
1. **Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   - Add in Netlify dashboard
   - Same variables as Vercel

3. **Deploy**
   - Connect Git repository
   - Netlify builds on push

### Option 3: AWS S3 + CloudFront
1. **Build**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync .next/ s3://your-bucket-name
   ```

3. **Configure CloudFront**
   - Set S3 as origin
   - Enable HTTPS
   - Configure caching

### Option 4: Cloudflare Pages
1. **Build Settings**
   ```bash
   Build command: npm run build
   Build output directory: .next
   ```

2. **Environment Variables**
   - Add in Cloudflare dashboard

3. **Deploy**
   - Connect Git repository
   - Cloudflare builds automatically

## 🔧 Configuration

### Environment Variables
Create `.env.local` for local development:

```env
# Clubzila API Configuration
NEXT_PUBLIC_CLUBZILA_API_URL=https://clubzila.com/api
CLUBZILA_API_KEY=your_clubzila_api_key_here
CLUBZILA_WEBHOOK_SECRET=your_webhook_secret_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://pages.clubzila.com
```

### Next.js Configuration
The platform is configured for dynamic rendering:

```js
// next.config.js
module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
```

## 📱 Performance Optimization

### CDN Configuration
1. **Cache Headers**
   ```nginx
   # Static assets
   location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   
   # HTML pages
   location ~* \.html$ {
     expires 1h;
     add_header Cache-Control "public, must-revalidate";
   }
   ```

2. **Compression**
   - Enable gzip/brotli compression
   - Compress HTML, CSS, JS files

3. **Edge Locations**
   - Choose CDN regions strategically
   - Consider your target audience

### Bundle Optimization
- **Tree Shaking**: Automatic with Next.js
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Disabled for static export
- **Font Loading**: Optimized with Inter font

## 🔒 Security

### Production Checklist
- [ ] HTTPS enabled everywhere
- [ ] Environment variables secured
- [ ] API keys not exposed to client
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured

### API Security
```typescript
// All Clubzila API calls are server-side only
// Client never sees API keys
const clubzila = new ClubzilaIntegration({
  apiKey: process.env.CLUBZILA_API_KEY // Server-side only
})
```

## 📊 Monitoring

### Performance Monitoring
1. **Web Vitals**
   - Core Web Vitals tracking
   - Lighthouse CI integration
   - Performance budgets

2. **Error Tracking**
   - Sentry integration
   - Error boundary implementation
   - Log aggregation

3. **Analytics**
   - Vercel Analytics
   - Google Analytics
   - Custom event tracking

### Health Checks
```bash
# Test Clubzila integration
curl -X POST https://your-domain.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"creatorId":"test","phoneNumber":"+1234567890"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache
   rm -rf .next out
   npm run build
   ```

2. **Dynamic Route Issues**
   - Ensure proper API route configuration
   - Check Netlify function setup
   - Verify environment variables

3. **API Errors**
   - Check environment variables
   - Verify Clubzila API access
   - Check network connectivity

4. **Performance Issues**
   - Optimize images
   - Minimize JavaScript
   - Use CDN caching

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check build output
npm run build --verbose
```

## 🔄 Updates & Maintenance

### Regular Updates
1. **Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

2. **Security Patches**
   ```bash
   npm audit
   npm audit fix --force
   ```

3. **Next.js Updates**
   ```bash
   npm install next@latest
   ```

### Backup Strategy
1. **Code Repository**
   - Git backup with remote
   - Branch protection rules

2. **Environment Variables**
   - Secure storage in deployment platform
   - Document all variables

3. **Generated Pages**
   - Database backup (production)
   - File system backup (development)

## 📈 Scaling

### Horizontal Scaling
- **CDN**: Global edge deployment
- **Load Balancing**: Multiple regions
- **Database**: Read replicas

### Vertical Scaling
- **Memory**: Increase Node.js heap
- **CPU**: Optimize build process
- **Storage**: CDN storage limits

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CDN configured
- [ ] Monitoring enabled
- [ ] Error tracking active
- [ ] Performance monitoring active
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] Documentation updated

---

For additional support, check the main README.md or create an issue in the repository.





