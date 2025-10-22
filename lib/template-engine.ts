/**
 * Template Engine for Landing Page Generation
 */

export interface TemplateData {
  creatorId: string;
  authorId?: string;
  creatorName: string;
  creatorBio?: string;
  creatorImage?: string;
  creatorPrice?: number;
  creatorCurrency?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
}

export class TemplateEngine {
  private templates: Map<string, Template> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Minimal Creator Template
    this.addTemplate({
      id: 'minimal',
      name: 'Minimal Creator',
      description: 'Clean, simple design focused on content',
      html: this.getMinimalHTML(),
      css: this.getMinimalCSS(),
    });

    // Premium Video Feed Template
    this.addTemplate({
      id: 'modern',
      name: 'Premium Video Feed',
      description: 'YouTube-like video feed with subscription gating',
      html: this.getModernHTML(),
      css: this.getModernCSS(),
    });

    // Video Feed Template
    this.addTemplate({
      id: 'video-feed',
      name: 'Video Feed',
      description: 'Grid-style video feed optimized for mobile',
      html: this.getVideoFeedHTML(),
      css: this.getVideoFeedCSS(),
    });

    // JOSE Template
    this.addTemplate({
      id: 'jose',
      name: 'JOSE Dating',
      description: 'Dating profiles with payment integration',
      html: this.getJoseHTML(),
      css: this.getJoseCSS(),
    });

    // Business Services Template
    this.addTemplate({
      id: 'business-services',
      name: 'Business Services',
      description: 'Professional business services in Swahili',
      html: this.getBusinessServicesHTML(),
      css: this.getBusinessServicesCSS(),
    });

    // Betting Template
    this.addTemplate({
      id: 'betting',
      name: 'Football Betting',
      description: 'Modern football betting platform with live matches',
      html: this.getBettingHTML(),
      css: this.getBettingCSS(),
    });

    // Business Services Pro Template (Duplicate of Business Services)
    this.addTemplate({
      id: 'business-services-pro',
      name: 'Business Services Pro',
      description: 'Enhanced professional business services in Swahili',
      html: this.getBusinessServicesProHTML(),
      css: this.getBusinessServicesProCSS(),
    });
  }

  addTemplate(template: Template): void {
    this.templates.set(template.id, template);
  }

  getTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  getTemplate(templateId: string): Template | undefined {
    return this.templates.get(templateId);
  }

  generatePage(templateId: string, data: TemplateData): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let html = template.html;
    let css = template.css;

    // Replace variables with fallbacks - escape for JavaScript
    const escapedCreatorId = (data.creatorId || 'Creator').replace(/'/g, "\\'");
    html = html.replace(/\{\{creatorId\}\}/g, escapedCreatorId);
    // No longer need authorId replacement - using dynamic signup
    html = html.replace(/\{\{creatorName\}\}/g, data.creatorName || data.creatorId || 'Creator');
    html = html.replace(/\{\{creatorBio\}\}/g, data.creatorBio || 'Welcome to my creator page!');
    html = html.replace(/\{\{creatorImage\}\}/g, data.creatorImage || 'https://via.placeholder.com/150x150/667eea/ffffff?text=Creator');
    html = html.replace(/\{\{creatorPrice\}\}/g, (data.creatorPrice || 2000).toString());
    html = html.replace(/\{\{creatorCurrency\}\}/g, data.creatorCurrency || 'Tsh');

    return this.combineHTML(html, css, data);
  }

  private combineHTML(html: string, css: string, data: TemplateData): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.creatorName} - Clubzila Creator</title>
    <style>${css}</style>
</head>
<body>
    ${html}
</body>
</html>`;
  }

  private getMinimalHTML(): string {
    return `<div class="dating-app">
  <!-- Profile Header -->
  <div class="profile-header">
    <div class="profile-bg">
      <img src="https://i.postimg.cc/C104cH8G/Screenshot-2025-08-21-at-17-12-53.png" alt="Background" class="profile-bg-img">
    </div>
    <div class="profile-info">
      <div class="profile-avatar">
        <img src="{{creatorImage}}" alt="{{creatorName}}" class="avatar-img">
        <div class="online-status"></div>
      </div>
      <div class="profile-details">
        <h1 class="profile-name">{{creatorName}}</h1>
        <div class="profile-stats">
          <span class="stat">
            <span class="stat-number">25</span>
            <span class="stat-label">Age</span>
          </span>
          <span class="stat">
            <span class="stat-number">5km</span>
            <span class="stat-label">Away</span>
          </span>
          <span class="stat">
            <span class="stat-number">Online</span>
            <span class="stat-label">Now</span>
          </span>
        </div>
        <p class="profile-bio">Hey there! I'm {{creatorName}} and I love connecting with new people. Let's chat and get to know each other better! 💕</p>
      </div>
  </div>
  </div>

  <!-- Subscription Section -->
  <div class="subscription-section">
    <div class="subscription-card">
      <div class="subscription-header">
        <h3>💎 Premium Access</h3>
        <p>Unlock exclusive content and chat with me directly</p>
  </div>
    
    <div class="subscription-form">
      <div class="form-step" id="step1">
          <div class="form-description">Enter your mobile money number to start chatting</div>
          <input type="tel" id="phoneNumber" placeholder="Enter your phone number" class="form-input" required>
          <button onclick="subscribe()" class="subscribe-btn">
            <span class="btn-text">Start Chatting</span>
            <span class="btn-price">{{creatorPrice}} {{creatorCurrency}}</span>
          </button>
      </div>
      
      <div class="form-step" id="step2" style="display: none;">
        <div class="success-message">
            <div class="success-icon">💕</div>
            <h3>Welcome to my world!</h3>
            <p>Your subscription to <strong>{{creatorName}}</strong> is now active!</p>
            <div class="ussd-info">
              <h4>📱 Complete Your Payment</h4>
              <p>You will receive a USSD prompt on your phone <strong id="userPhone"></strong></p>
          <div class="payment-steps">
            <ol>
                  <li>Check your phone for the USSD prompt</li>
              <li>Enter your mobile money PIN</li>
                  <li>Confirm the payment of <strong>{{creatorPrice}} {{creatorCurrency}}</strong></li>
                  <li>Wait for confirmation message</li>
            </ol>
              </div>
          </div>
        </div>
      </div>
      
      <div class="form-step" id="step3" style="display: none;">
        <div class="error-message">
            <div class="error-icon">😔</div>
            <h3>Oops! Something went wrong</h3>
            <p id="errorText">Subscription failed</p>
          <button onclick="backToStep1()" class="subscribe-btn">Try Again</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div class="features-section">
    <h3>What you'll get with premium access:</h3>
    <div class="features-grid">
      <div class="feature-item">
        <div class="feature-icon">💬</div>
        <div class="feature-text">
          <h4>Direct Messages</h4>
          <p>Chat with me personally</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">📸</div>
        <div class="feature-text">
          <h4>Exclusive Photos</h4>
          <p>Private photo collection</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🎥</div>
        <div class="feature-text">
          <h4>Premium Videos</h4>
          <p>Exclusive video content</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">❤️</div>
        <div class="feature-text">
          <h4>Personal Updates</h4>
          <p>Daily life updates</p>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let currentCreatorId = '{{creatorId}}';

async function subscribe() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  
  if (!phoneNumber) {
    alert('Please enter your mobile money phone number');
    return;
  }
  
  // Extract pageId from URL path
  const pathParts = window.location.pathname.split('/');
  const pageId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  console.log('Subscribe data:', { pageId, phoneNumber, templateType: 'minimal' });
  
  // Show processing popup
  showProcessingState();
  
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: pageId,
        phoneNumber: phoneNumber,
        templateType: 'minimal'
      })
    });
    
    const result = await response.json();
    
    // Hide processing popup
    hideProcessingState();
    
    if (result.success) {
      // Show success step with USSD instructions
      document.getElementById('userPhone').textContent = phoneNumber;
      showStep(2);
    } else {
      showError(result.message || 'Subscription failed');
    }
  } catch (error) {
    // Hide processing popup
    hideProcessingState();
    showError('Network error. Please try again.');
  }
}

function showProcessingState() {
  const subscribeBtn = document.querySelector('.subscribe-btn, .cta-btn');
  
  if (subscribeBtn) {
    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Processing...';
    subscribeBtn.style.opacity = '0.7';
  }
  
  // Create processing popup
  const processingPopup = document.createElement('div');
  processingPopup.id = 'processing-popup';
  processingPopup.className = 'processing-popup';
  processingPopup.innerHTML = 
    '<div class="processing-content">' +
      '<div class="processing-spinner"></div>' +
      '<h3>Processing Your Request</h3>' +
      '<p>Please wait while we set up your subscription...</p>' +
      '<div class="processing-steps">' +
        '<div class="step" id="step-signup">' +
          '<span class="step-icon">⏳</span>' +
          '<span>Checking user account...</span>' +
        '</div>' +
        '<div class="step" id="step-payment">' +
          '<span class="step-icon">⏳</span>' +
          '<span>Initiating payment...</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  
  document.body.appendChild(processingPopup);
  
  // Simulate step progression
  setTimeout(() => {
    const signupStep = document.getElementById('step-signup');
    if (signupStep) {
      signupStep.classList.add('active');
      signupStep.querySelector('.step-icon').textContent = '✅';
    }
  }, 2000);
  
  setTimeout(() => {
    const paymentStep = document.getElementById('step-payment');
    if (paymentStep) {
      paymentStep.classList.add('active');
      paymentStep.querySelector('.step-icon').textContent = '✅';
    }
  }, 4000);
}

function hideProcessingState() {
  const subscribeBtn = document.querySelector('.subscribe-btn, .cta-btn');
  const processingPopup = document.getElementById('processing-popup');
  
  if (subscribeBtn) {
    subscribeBtn.disabled = false;
    subscribeBtn.textContent = 'Subscribe Now';
    subscribeBtn.style.opacity = '1';
  }
  
  if (processingPopup) {
    processingPopup.remove();
  }
}

function showStep(stepNumber) {
  // Hide all steps
  for (let i = 1; i <= 3; i++) {
    document.getElementById('step' + i).style.display = 'none';
  }
  
  // Show the specified step
  document.getElementById('step' + stepNumber).style.display = 'block';
}

function showError(message) {
  document.getElementById('errorText').textContent = message;
  showStep(3);
}

function backToStep1() {
  showStep(1);
  document.getElementById('phoneNumber').value = '';
}
</script>`;
  }

  private getMinimalCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; min-height: 100vh; }
.dating-app { max-width: 400px; margin: 0 auto; background: white; min-height: 100vh; position: relative; }

/* Profile Header */
.profile-header { position: relative; height: 500px; overflow: hidden; }
.profile-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
.profile-bg-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); }
.profile-info { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
.profile-avatar { position: relative; display: inline-block; margin-bottom: 1rem; }
.avatar-img { width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; object-fit: cover; }
.online-status { position: absolute; bottom: 5px; right: 5px; width: 20px; height: 20px; background: #4ade80; border: 3px solid white; border-radius: 50%; }
.profile-details { text-align: center; color: white; }
.profile-name { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.7); }
.profile-stats { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; }
.stat { text-align: center; }
.stat-number { display: block; font-size: 1.2rem; font-weight: bold; }
.stat-label { display: block; font-size: 0.8rem; opacity: 0.9; }
.profile-bio { font-size: 1rem; line-height: 1.4; opacity: 0.95; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }

/* Subscription Section */
.subscription-section { padding: 1.5rem; }
.subscription-card { background: white; border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 1rem; }
.subscription-header { text-align: center; margin-bottom: 1.5rem; }
.subscription-header h3 { font-size: 1.5rem; color: #1f2937; margin-bottom: 0.5rem; }
.subscription-header p { color: #6b7280; font-size: 0.9rem; }
.form-description { color: #6b7280; margin-bottom: 1rem; font-size: 0.9rem; text-align: center; }
.form-input { width: 100%; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; margin-bottom: 1rem; background: #f9fafb; }
.form-input:focus { outline: none; border-color: #ec4899; background: white; }
.subscribe-btn { width: 100%; background: linear-gradient(135deg, #ec4899, #be185d); color: white; border: none; padding: 1rem; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.subscribe-btn:hover { background: linear-gradient(135deg, #db2777, #9d174d); }
.subscribe-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-text { font-size: 1.1rem; }
.btn-price { font-size: 0.9rem; opacity: 0.9; }

/* Success/Error Messages */
.success-message { text-align: center; }
.success-icon { font-size: 3rem; margin-bottom: 1rem; }
.success-message h3 { color: #1f2937; margin-bottom: 0.5rem; }
.success-message p { color: #6b7280; margin-bottom: 1rem; }
.ussd-info { background: #f0f9ff; padding: 1rem; border-radius: 12px; margin: 1rem 0; border-left: 4px solid #3b82f6; }
.ussd-info h4 { color: #1e40af; margin-bottom: 0.5rem; }
.ussd-info p { color: #1e40af; font-size: 0.9rem; }
.payment-steps { text-align: left; margin-top: 1rem; }
.payment-steps ol { margin-left: 1.5rem; }
.payment-steps li { margin: 0.5rem 0; color: #1e40af; font-size: 0.9rem; }
.error-message { text-align: center; }
.error-icon { font-size: 3rem; margin-bottom: 1rem; }
.error-message h3 { color: #dc2626; margin-bottom: 0.5rem; }
.error-message p { color: #6b7280; margin-bottom: 1rem; }

/* Features Section */
.features-section { padding: 1.5rem; background: #f8f9fa; }
.features-section h3 { text-align: center; color: #1f2937; margin-bottom: 1.5rem; font-size: 1.2rem; }
.features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.feature-item { background: white; padding: 1rem; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.feature-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.feature-text h4 { font-size: 0.9rem; color: #1f2937; margin-bottom: 0.25rem; }
.feature-text p { font-size: 0.8rem; color: #6b7280; }

/* Processing Popup */
.processing-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.processing-content { background: white; padding: 2rem; border-radius: 20px; text-align: center; max-width: 300px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
.processing-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #ec4899; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
.processing-content h3 { color: #1f2937; margin-bottom: 0.5rem; }
.processing-content p { color: #6b7280; margin-bottom: 1.5rem; font-size: 0.9rem; }
.processing-steps { text-align: left; }
.processing-steps .step { display: flex; align-items: center; margin: 0.5rem 0; padding: 0.5rem; border-radius: 8px; transition: all 0.3s ease; }
.processing-steps .step.active { background: #f0f9ff; color: #1e40af; }
.processing-steps .step-icon { font-size: 1.2rem; margin-right: 0.5rem; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Mobile Optimizations */
@media (max-width: 480px) {
  .dating-app { max-width: 100%; }
  .profile-header { height: 450px; }
  .profile-info { padding: 1.5rem; }
  .avatar-img { width: 100px; height: 100px; }
  .profile-name { font-size: 1.8rem; }
  .profile-stats { gap: 1rem; }
  .subscription-section { padding: 1rem; }
  .features-section { padding: 1rem; }
  .features-grid { grid-template-columns: 1fr; }
}`;
  }

  private getModernHTML(): string {
    return `<div class="video-platform">
  <!-- Video Feed Section -->
  <main class="video-feed">
    <div class="feed-header">
      <h2>JIUNGE NA GROUP LANGU UPATE XVIDEOS 10 KILA SIKU🍆💦🍑🔞</h2>
      <p class="feed-subtitle">NJOO UPATE CONNECTION ZOTE ZA MASTAA🍆👙💦</p>
    </div>

    <!-- Video Grid -->
    <div class="video-grid">
      <!-- Preview Video 1 -->
      <div class="video-card preview" onclick="openSubscriptionPopup()">
        <div class="video-thumbnail">
          <img src="https://i.postimg.cc/02Jympy5/download-42.jpg" alt="Premium Video 1">
          <div class="video-overlay">
            <div class="play-button">▶️</div>
            <div class="video-duration">8:42</div>
            <div class="premium-badge">PREMIUM</div>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">VIDEO ZA MASTAA ZOTE ZILIZOVUJA ZIPO HAPA JIUNGE UZIPATE</h3>
          <p class="video-description">🔥 Hot content - Subscribe to watch full video</p>
          <div class="video-meta">
            <span class="views">👀 45.2K views</span>
            <span class="likes">❤️ 2.8K likes</span>
          </div>
          <button class="whatsapp-btn" onclick="event.stopPropagation(); openSubscriptionPopup();">Jiunge na whatsapp Group</button>
        </div>
      </div>

      <!-- Preview Video 2 -->
      <div class="video-card preview" onclick="openSubscriptionPopup()">
        <div class="video-thumbnail">
          <img src="https://i.postimg.cc/s2tr3L5p/download-43.jpg" alt="Premium Video 2">
          <div class="video-overlay">
            <div class="play-button">▶️</div>
            <div class="video-duration">12:18</div>
            <div class="premium-badge">PREMIUM</div>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">VIDEO CALL WHATSAPP MPAKA UNAKOJOA</h3>
          <p class="video-description">💎 Premium content - Unlock with subscription</p>
          <div class="video-meta">
            <span class="views">👀 78.5K views</span>
            <span class="likes">❤️ 5.1K likes</span>
          </div>
          <button class="whatsapp-btn" onclick="event.stopPropagation(); openSubscriptionPopup();">Jiunge na whatsapp Group</button>
        </div>
      </div>

      <!-- Preview Video 3 -->
      <div class="video-card preview" onclick="openSubscriptionPopup()">
        <div class="video-thumbnail">
          <img src="https://i.postimg.cc/C50pqfP5/download-44.jpg" alt="Premium Video 3">
          <div class="video-overlay">
            <div class="play-button">▶️</div>
            <div class="video-duration">15:33</div>
            <div class="premium-badge">PREMIUM</div>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">WATOTO WA CHUO MIKOA YOTE 🍆👙💦</h3>
          <p class="video-description">⭐ New upload - Subscribe to watch</p>
          <div class="video-meta">
            <span class="views">👀 92.7K views</span>
            <span class="likes">❤️ 6.3K likes</span>
          </div>
          <button class="whatsapp-btn" onclick="event.stopPropagation(); openSubscriptionPopup();">Jiunge na whatsapp Group</button>
        </div>
      </div>

      <!-- Locked Video 4 -->
      <div class="video-card locked" onclick="openSubscriptionPopup()">
        <div class="video-thumbnail">
          <img src="https://i.postimg.cc/GtjwJhVQ/download-45.jpg" alt="Locked Video">
          <div class="video-overlay">
            <div class="play-button">▶️</div>
            <div class="video-duration">18:56</div>
            <div class="locked-badge">PREMIUM</div>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">GROUP LA VIDEO ZA WAJAWAZITO WAKITOMBANA 10 KILA SIKU</h3>
          <p class="video-description">▶️ Subscribe to unlock this exclusive video</p>
          <div class="video-meta">
            <span class="views">👀 134.8K views</span>
            <span class="likes">❤️ 8.9K likes</span>
          </div>
          <button class="whatsapp-btn" onclick="event.stopPropagation(); openSubscriptionPopup();">Jiunge na whatsapp Group</button>
        </div>
      </div>

      <!-- Locked Video 5 -->
      <div class="video-card locked" onclick="openSubscriptionPopup()">
        <div class="video-thumbnail">
          <img src="https://i.postimg.cc/Ghc13GTS/download-46.jpg" alt="Locked Video">
          <div class="video-overlay">
            <div class="play-button">▶️</div>
            <div class="video-duration">22:14</div>
            <div class="locked-badge">PREMIUM</div>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">GROUP LA MALAYA KUTOMBANA NA KUFIRANA DAR NA DODOMA</h3>
          <p class="video-description">▶️ Premium subscribers only</p>
          <div class="video-meta">
            <span class="views">👀 187.3K views</span>
            <span class="likes">❤️ 12.4K likes</span>
          </div>
          <button class="whatsapp-btn" onclick="event.stopPropagation(); openSubscriptionPopup();">Jiunge na whatsapp Group</button>
        </div>
      </div>

      <!-- Locked Video 6 -->
      <div class="video-card locked" onclick="openSubscriptionPopup()">
        <div class="video-thumbnail">
          <img src="https://i.postimg.cc/rFQ2DsSy/download-47.jpg" alt="Locked Video">
          <div class="video-overlay">
            <div class="play-button">▶️</div>
            <div class="video-duration">25:07</div>
            <div class="locked-badge">PREMIUM</div>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">VIDEO ZA WANAFUNZI WA CHUO WAKIJAMIIANA</h3>
          <p class="video-description">▶️ New content - Subscribe to access</p>
          <div class="video-meta">
            <span class="views">👀 256.1K views</span>
            <span class="likes">❤️ 17.2K likes</span>
          </div>
          <button class="whatsapp-btn" onclick="event.stopPropagation(); openSubscriptionPopup();">Jiunge na whatsapp Group</button>
        </div>
      </div>
    </div>

    <!-- Subscription Popup -->
    <div id="subscriptionPopup" class="popup-overlay" style="display: none;">
      <div class="popup-content">
        <div class="popup-header">
          <h3>JIUNGE NA GROUP LANGU UPATE XVIDEOS 10 KILA SIKU🍆💦🍑🔞</h3>
          <button class="close-popup" onclick="closeSubscriptionPopup()">&times;</button>
        </div>
        
        <div class="popup-body">
          <p class="popup-subtitle">NJOO UPATE CONNECTION ZOTE ZA MASTAA🍆👙💦</p>
          <div class="pricing-info">
            <span class="price">{{creatorPrice}} {{creatorCurrency}}</span>
            <span class="period">/month</span>
          </div>
          
          <div class="subscription-form">
            <div class="form-step" id="step1">
              <div class="form-description">Enter your mobile money number to unlock all videos</div>
              <input type="tel" id="phoneNumber" placeholder="Enter your phone number" class="form-input" required>
              <button onclick="subscribe()" class="subscribe-btn">
                <span class="btn-text">🔓 Unlock All Videos</span>
                <span class="btn-price">{{creatorPrice}} {{creatorCurrency}}</span>
              </button>
            </div>
            
            <div class="form-step" id="step2" style="display: none;">
              <div class="success-message">
                <div class="success-icon">🎉</div>
                <h3>Welcome to the VIP club!</h3>
                <p>Your subscription to <strong>{{creatorName}}</strong> is now active!</p>
                <div class="ussd-info">
                  <h4>📱 Complete Your Payment</h4>
                  <p>You will receive a USSD prompt on your phone <strong id="userPhone"></strong></p>
                <div class="payment-steps">
                  <ol>
                      <li>Check your phone for the USSD prompt</li>
                    <li>Enter your mobile money PIN</li>
                      <li>Confirm the payment of <strong>{{creatorPrice}} {{creatorCurrency}}</strong></li>
                      <li>Wait for confirmation message</li>
                  </ol>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-step" id="step3" style="display: none;">
              <div class="error-message">
                <div class="error-icon">😔</div>
                <h3>Oops! Something went wrong</h3>
                <p id="errorText">Subscription failed</p>
                <button onclick="backToStep1()" class="subscribe-btn">Try Again</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h3>What you'll get with premium access:</h3>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">🎬</div>
          <div class="feature-text">
            <h4>Unlimited Videos</h4>
            <p>Access to all premium content</p>
        </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <div class="feature-text">
            <h4>Mobile Optimized</h4>
            <p>Perfect viewing on your phone</p>
        </div>
      </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <div class="feature-text">
            <h4>Instant Access</h4>
            <p>Watch immediately after payment</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🆕</div>
          <div class="feature-text">
            <h4>New Content</h4>
            <p>Fresh videos added regularly</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 {{creatorName}}. Powered by <a href="https://clubzila.com" target="_blank">Clubzila</a></p>
  </footer>
</div>

<script>
let currentCreatorId = '{{creatorId}}';

async function subscribe() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  
  if (!phoneNumber) {
    alert('Please enter your mobile money phone number');
    return;
  }
  
  // Extract pageId from URL path
  const pathParts = window.location.pathname.split('/');
  const pageId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  console.log('Subscribe data:', { pageId, phoneNumber, templateType: 'modern' });
  
  // Show processing popup
  showProcessingState();
  
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: pageId,
        phoneNumber: phoneNumber,
        templateType: 'modern'
      })
    });
    
    const result = await response.json();
    
    // Hide processing popup
    hideProcessingState();
    
    if (result.success) {
      // Show success step with USSD instructions
      document.getElementById('userPhone').textContent = phoneNumber;
      showStep(2);
    } else {
      showError(result.message || 'Subscription failed');
    }
  } catch (error) {
    // Hide processing popup
    hideProcessingState();
    showError('Network error. Please try again.');
  }
}

function showProcessingState() {
  const subscribeBtn = document.querySelector('.subscribe-btn, .cta-btn');
  
  if (subscribeBtn) {
    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Processing...';
    subscribeBtn.style.opacity = '0.7';
  }
  
  // Create processing popup
  const processingPopup = document.createElement('div');
  processingPopup.id = 'processing-popup';
  processingPopup.className = 'processing-popup';
  processingPopup.innerHTML = 
    '<div class="processing-content">' +
      '<div class="processing-spinner"></div>' +
      '<h3>Processing Your Request</h3>' +
      '<p>Please wait while we set up your subscription...</p>' +
      '<div class="processing-steps">' +
        '<div class="step" id="step-signup">' +
          '<span class="step-icon">⏳</span>' +
          '<span>Checking user account...</span>' +
        '</div>' +
        '<div class="step" id="step-payment">' +
          '<span class="step-icon">⏳</span>' +
          '<span>Initiating payment...</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  
  document.body.appendChild(processingPopup);
  
  // Simulate step progression
  setTimeout(() => {
    const signupStep = document.getElementById('step-signup');
    if (signupStep) {
      signupStep.classList.add('active');
      signupStep.querySelector('.step-icon').textContent = '✅';
    }
  }, 2000);
  
  setTimeout(() => {
    const paymentStep = document.getElementById('step-payment');
    if (paymentStep) {
      paymentStep.classList.add('active');
      paymentStep.querySelector('.step-icon').textContent = '✅';
    }
  }, 4000);
}

function hideProcessingState() {
  const subscribeBtn = document.querySelector('.subscribe-btn, .cta-btn');
  const processingPopup = document.getElementById('processing-popup');
  
  if (subscribeBtn) {
    subscribeBtn.disabled = false;
    subscribeBtn.textContent = 'Subscribe Now';
    subscribeBtn.style.opacity = '1';
  }
  
  if (processingPopup) {
    processingPopup.remove();
  }
}

function showStep(stepNumber) {
  // Hide all steps
  for (let i = 1; i <= 3; i++) {
    document.getElementById('step' + i).style.display = 'none';
  }
  
  // Show the specified step
  document.getElementById('step' + stepNumber).style.display = 'block';
}

function showError(message) {
  document.getElementById('errorText').textContent = message;
  showStep(3);
}

function backToStep1() {
  showStep(1);
  document.getElementById('phoneNumber').value = '';
}

// Popup Functions
function openSubscriptionPopup() {
  const popup = document.getElementById('subscriptionPopup');
  if (popup) {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeSubscriptionPopup() {
  const popup = document.getElementById('subscriptionPopup');
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Close popup when clicking outside or pressing escape
document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('subscriptionPopup');
  if (popup) {
    // Close on outside click
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        closeSubscriptionPopup();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && popup.style.display !== 'none') {
        closeSubscriptionPopup();
      }
    });
  }
});
</script>`;
  }

  private getModernCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f0f; color: #ffffff; }
.video-platform { min-height: 100vh; background: #0f0f0f; }

/* Header Styles */
.platform-header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); padding: 2rem 1rem; border-bottom: 1px solid #333; }
.header-content { max-width: 1200px; margin: 0 auto; }
.creator-channel { display: flex; align-items: center; gap: 1.5rem; }
.channel-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #ff0040; }
.channel-info { flex: 1; }
.channel-name { font-size: 2rem; font-weight: bold; color: #ffffff; margin-bottom: 0.5rem; }
.channel-subtitle { color: #aaaaaa; font-size: 1rem; margin-bottom: 1rem; }
.channel-stats { display: flex; gap: 1rem; }
.subscriber-count, .video-count { background: #ff0040; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }

/* Video Feed Styles */
.video-feed { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
.feed-header { text-align: center; margin-bottom: 3rem; }
.feed-header h2 { font-size: 2.5rem; color: #ffffff; margin-bottom: 0.5rem; }
.feed-subtitle { color: #aaaaaa; font-size: 1.1rem; }

/* Video Grid */
.video-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
.video-card { background: #1a1a1a; border-radius: 12px; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
.video-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(255, 0, 64, 0.3); }
.video-thumbnail { position: relative; aspect-ratio: 16/9; overflow: hidden; }
.video-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.video-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; }
.play-button { font-size: 3rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
.video-duration { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
.premium-badge { position: absolute; top: 8px; left: 8px; background: linear-gradient(135deg, #ff0040, #ff4081); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
.locked-badge { position: absolute; top: 8px; left: 8px; background: linear-gradient(135deg, #666, #999); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }

/* Video Info */
.video-info { padding: 1rem; }
.video-title { font-size: 1.1rem; font-weight: 600; color: #ffffff; margin-bottom: 0.5rem; line-height: 1.3; }
.video-description { color: #aaaaaa; font-size: 0.9rem; margin-bottom: 0.75rem; }
.video-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #888; margin-bottom: 1rem; }
.views, .likes { display: flex; align-items: center; gap: 0.25rem; }

/* WhatsApp Button */
.whatsapp-btn { width: 100%; background: #25D366; color: white; border: none; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease, transform 0.2s ease; }
.whatsapp-btn:hover { background: #1DA851; transform: translateY(-1px); }
.whatsapp-btn:active { transform: translateY(0); }

/* Popup Styles */
.popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.popup-content { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 20px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; border: 1px solid #333; }
.popup-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 2rem 2rem 1rem; border-bottom: 1px solid #333; }
.popup-header h3 { color: #ffffff; font-size: 1.5rem; margin: 0; line-height: 1.3; flex: 1; }
.close-popup { background: none; border: none; color: #aaaaaa; font-size: 2rem; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background-color 0.3s ease; }
.close-popup:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
.popup-body { padding: 1rem 2rem 2rem; }
.popup-subtitle { color: #aaaaaa; text-align: center; margin-bottom: 1.5rem; font-size: 1rem; }

/* Subscription Section */
.subscription-section { margin: 3rem 0; }
.subscription-card { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 20px; padding: 2rem; border: 1px solid #333; }
.subscription-header { text-align: center; margin-bottom: 2rem; }
.subscription-header h3 { font-size: 2rem; color: #ffffff; margin-bottom: 0.5rem; }
.subscription-header p { color: #aaaaaa; font-size: 1rem; margin-bottom: 1rem; }
.pricing-info { display: flex; align-items: baseline; justify-content: center; gap: 0.5rem; }
.price { font-size: 2.5rem; font-weight: bold; color: #ff0040; }
.period { color: #aaaaaa; font-size: 1rem; }

/* Form Styles */
.subscription-form { max-width: 400px; margin: 0 auto; }
.form-step { margin-bottom: 1rem; }
.form-description { color: #aaaaaa; text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; }
.form-input { width: 100%; padding: 1rem; border: 2px solid #333; border-radius: 12px; font-size: 1rem; margin-bottom: 1rem; background: #1a1a1a; color: white; }
.form-input::placeholder { color: #666; }
.form-input:focus { outline: none; border-color: #ff0040; background: #2d2d2d; }
.subscribe-btn { width: 100%; background: linear-gradient(135deg, #ff0040, #ff4081); color: white; border: none; padding: 1rem; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: transform 0.3s ease; }
.subscribe-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 0, 64, 0.4); }
.subscribe-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.btn-text { font-size: 1.1rem; }
.btn-price { font-size: 0.9rem; opacity: 0.9; }

/* Success/Error Messages */
.success-message { text-align: center; }
.success-icon { font-size: 3rem; margin-bottom: 1rem; }
.success-message h3 { color: #ffffff; margin-bottom: 0.5rem; }
.success-message p { color: #aaaaaa; margin-bottom: 1rem; }
.ussd-info { background: rgba(255, 0, 64, 0.1); padding: 1rem; border-radius: 12px; margin: 1rem 0; border-left: 4px solid #ff0040; }
.ussd-info h4 { color: #ff0040; margin-bottom: 0.5rem; }
.ussd-info p { color: #aaaaaa; font-size: 0.9rem; }
.payment-steps { text-align: left; margin-top: 1rem; }
.payment-steps ol { margin-left: 1.5rem; }
.payment-steps li { margin: 0.5rem 0; color: #aaaaaa; font-size: 0.9rem; }
.error-message { text-align: center; }
.error-icon { font-size: 3rem; margin-bottom: 1rem; }
.error-message h3 { color: #ff0040; margin-bottom: 0.5rem; }
.error-message p { color: #aaaaaa; margin-bottom: 1rem; }

/* Features Section */
.features-section { margin: 3rem 0; }
.features-section h3 { text-align: center; color: #ffffff; margin-bottom: 2rem; font-size: 1.5rem; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
.feature-item { background: #1a1a1a; padding: 1.5rem; border-radius: 12px; text-align: center; border: 1px solid #333; }
.feature-icon { font-size: 2rem; margin-bottom: 1rem; }
.feature-text h4 { font-size: 1rem; color: #ffffff; margin-bottom: 0.5rem; }
.feature-text p { color: #aaaaaa; font-size: 0.9rem; }

/* Footer */
.footer { background: #1a1a1a; color: #aaaaaa; text-align: center; padding: 2rem; border-top: 1px solid #333; }
.footer a { color: #ff0040; text-decoration: none; }

/* Processing Popup */
.processing-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.processing-content { background: #1a1a1a; padding: 2rem; border-radius: 20px; text-align: center; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #333; }
.processing-spinner { width: 50px; height: 50px; border: 4px solid #333; border-top: 4px solid #ff0040; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
.processing-content h3 { color: #ffffff; margin-bottom: 0.5rem; }
.processing-content p { color: #aaaaaa; margin-bottom: 1.5rem; }
.processing-steps { text-align: left; }
.processing-steps .step { display: flex; align-items: center; margin: 0.5rem 0; padding: 0.5rem; border-radius: 8px; transition: all 0.3s ease; }
.processing-steps .step.active { background: rgba(255, 0, 64, 0.1); color: #ff0040; }
.processing-steps .step-icon { font-size: 1.2rem; margin-right: 0.5rem; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Mobile Responsive */
@media (max-width: 768px) {
  .creator-channel { flex-direction: column; text-align: center; }
  .channel-avatar { width: 100px; height: 100px; }
  .channel-name { font-size: 1.5rem; }
  .feed-header h2 { font-size: 2rem; }
  .video-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .subscription-card { padding: 1.5rem; }
  .features-grid { grid-template-columns: 1fr; }
  .channel-stats { justify-content: center; }
}

@media (max-width: 480px) {
  .platform-header { padding: 1rem; }
  .video-feed { padding: 1rem; }
  .subscription-card { padding: 1rem; }
  .price { font-size: 2rem; }
}`;
  }

  private getVideoFeedHTML(): string {
    return `<div class="video-feed-app">
  <!-- Header -->
  <div class="feed-header">
    <div class="creator-info">
      <img src="{{creatorImage}}" alt="{{creatorName}}" class="creator-avatar">
      <div class="creator-details">
        <h1 class="creator-name">{{creatorName}}</h1>
        <p class="creator-bio">Exclusive video content • Premium access</p>
      </div>
    </div>
  </div>
  
  <!-- Video Grid Preview -->
  <div class="video-grid-section">
    <h3>🔥 Hot Videos</h3>
    <div class="video-grid">
      <div class="video-item">
        <div class="video-thumbnail">
          <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop" alt="Video 1">
          <div class="play-overlay">▶️</div>
          <div class="video-duration">2:45</div>
        </div>
        <div class="video-info">
          <h4>Exclusive Content</h4>
          <p>🔥 Hot</p>
        </div>
      </div>
      
      <div class="video-item">
        <div class="video-thumbnail">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop" alt="Video 2">
          <div class="play-overlay">▶️</div>
          <div class="video-duration">1:30</div>
        </div>
        <div class="video-info">
          <h4>Premium Video</h4>
          <p>💎 VIP</p>
        </div>
      </div>
      
      <div class="video-item">
        <div class="video-thumbnail">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop" alt="Video 3">
          <div class="play-overlay">▶️</div>
          <div class="video-duration">3:15</div>
        </div>
        <div class="video-info">
          <h4>Special Content</h4>
          <p>⭐ New</p>
        </div>
      </div>
      
      <div class="video-item locked">
        <div class="video-thumbnail">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop" alt="Video 4">
          <div class="lock-overlay">🔒</div>
          <div class="video-duration">4:20</div>
        </div>
        <div class="video-info">
          <h4>Premium Only</h4>
          <p>🔒 Locked</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Subscription Section -->
  <div class="subscription-section">
    <div class="subscription-card">
      <div class="subscription-header">
        <h3>🎬 Unlock All Videos</h3>
        <p>Get instant access to {{creatorName}}'s exclusive video collection</p>
      </div>
      
      <div class="subscription-form">
        <div class="form-step" id="step1">
          <div class="form-description">Enter your mobile money number to unlock all videos</div>
          <input type="tel" id="phoneNumber" placeholder="Enter your phone number" class="form-input" required>
          <button onclick="subscribe()" class="subscribe-btn">
            <span class="btn-text">Unlock Videos</span>
            <span class="btn-price">{{creatorPrice}} {{creatorCurrency}}</span>
          </button>
        </div>
        
        <div class="form-step" id="step2" style="display: none;">
          <div class="success-message">
            <div class="success-icon">🎉</div>
            <h3>Welcome to the VIP club!</h3>
            <p>Your subscription to <strong>{{creatorName}}</strong> is now active!</p>
            <div class="ussd-info">
              <h4>📱 Complete Your Payment</h4>
              <p>You will receive a USSD prompt on your phone <strong id="userPhone"></strong></p>
              <div class="payment-steps">
                <ol>
                  <li>Check your phone for the USSD prompt</li>
                  <li>Enter your mobile money PIN</li>
                  <li>Confirm the payment of <strong>{{creatorPrice}} {{creatorCurrency}}</strong></li>
                  <li>Wait for confirmation message</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-step" id="step3" style="display: none;">
          <div class="error-message">
            <div class="error-icon">😔</div>
            <h3>Oops! Something went wrong</h3>
            <p id="errorText">Subscription failed</p>
            <button onclick="backToStep1()" class="subscribe-btn">Try Again</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Features Section -->
  <div class="features-section">
    <h3>What you'll get with premium access:</h3>
    <div class="features-grid">
      <div class="feature-item">
        <div class="feature-icon">🎬</div>
        <div class="feature-text">
          <h4>Exclusive Videos</h4>
          <p>Unlimited access to all videos</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">📱</div>
        <div class="feature-text">
          <h4>Mobile Optimized</h4>
          <p>Perfect viewing on your phone</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">⚡</div>
        <div class="feature-text">
          <h4>Instant Access</h4>
          <p>Watch immediately after payment</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🆕</div>
        <div class="feature-text">
          <h4>New Content</h4>
          <p>Fresh videos added regularly</p>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let currentCreatorId = '{{creatorId}}';

async function subscribe() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  
  if (!phoneNumber) {
    alert('Please enter your mobile money phone number');
    return;
  }
  
  // Extract pageId from URL path
  const pathParts = window.location.pathname.split('/');
  const pageId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  console.log('Subscribe data:', { pageId, phoneNumber, templateType: 'video-feed' });
  
  // Show processing popup
  showProcessingState();
  
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: pageId,
        phoneNumber: phoneNumber,
        templateType: 'video-feed'
      })
    });
    
    const result = await response.json();
    
    // Hide processing popup
    hideProcessingState();
    
    if (result.success) {
      // Show success step with USSD instructions
      document.getElementById('userPhone').textContent = phoneNumber;
      showStep(2);
    } else {
      showError(result.message || 'Subscription failed');
    }
  } catch (error) {
    // Hide processing popup
    hideProcessingState();
    showError('Network error. Please try again.');
  }
}

function showProcessingState() {
  const subscribeBtn = document.querySelector('.subscribe-btn, .cta-btn');
  
  if (subscribeBtn) {
    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Processing...';
    subscribeBtn.style.opacity = '0.7';
  }
  
  // Create processing popup
  const processingPopup = document.createElement('div');
  processingPopup.id = 'processing-popup';
  processingPopup.className = 'processing-popup';
  processingPopup.innerHTML = 
    '<div class="processing-content">' +
      '<div class="processing-spinner"></div>' +
      '<h3>Processing Your Request</h3>' +
      '<p>Please wait while we set up your subscription...</p>' +
      '<div class="processing-steps">' +
        '<div class="step" id="step-signup">' +
          '<span class="step-icon">⏳</span>' +
          '<span>Checking user account...</span>' +
        '</div>' +
        '<div class="step" id="step-payment">' +
          '<span class="step-icon">⏳</span>' +
          '<span>Initiating payment...</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  
  document.body.appendChild(processingPopup);
  
  // Simulate step progression
  setTimeout(() => {
    const signupStep = document.getElementById('step-signup');
    if (signupStep) {
      signupStep.classList.add('active');
      signupStep.querySelector('.step-icon').textContent = '✅';
    }
  }, 2000);
  
  setTimeout(() => {
    const paymentStep = document.getElementById('step-payment');
    if (paymentStep) {
      paymentStep.classList.add('active');
      paymentStep.querySelector('.step-icon').textContent = '✅';
    }
  }, 4000);
}

function hideProcessingState() {
  const subscribeBtn = document.querySelector('.subscribe-btn, .cta-btn');
  const processingPopup = document.getElementById('processing-popup');
  
  if (subscribeBtn) {
    subscribeBtn.disabled = false;
    subscribeBtn.textContent = 'Unlock Videos';
    subscribeBtn.style.opacity = '1';
  }
  
  if (processingPopup) {
    processingPopup.remove();
  }
}

function showStep(stepNumber) {
  // Hide all steps
  for (let i = 1; i <= 3; i++) {
    document.getElementById('step' + i).style.display = 'none';
  }
  
  // Show the specified step
  document.getElementById('step' + stepNumber).style.display = 'block';
}

function showError(message) {
  document.getElementById('errorText').textContent = message;
  showStep(3);
}

function backToStep1() {
  showStep(1);
  document.getElementById('phoneNumber').value = '';
}

// Popup Functions
function openSubscriptionPopup() {
  const popup = document.getElementById('subscriptionPopup');
  if (popup) {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeSubscriptionPopup() {
  const popup = document.getElementById('subscriptionPopup');
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Close popup when clicking outside or pressing escape
document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('subscriptionPopup');
  if (popup) {
    // Close on outside click
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        closeSubscriptionPopup();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && popup.style.display !== 'none') {
        closeSubscriptionPopup();
      }
    });
  }
});
</script>`;
  }

  private getVideoFeedCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000; min-height: 100vh; }
.video-feed-app { max-width: 400px; margin: 0 auto; background: #000; min-height: 100vh; color: white; }

/* Header */
.feed-header { padding: 1rem; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-bottom: 1px solid #333; }
.creator-info { display: flex; align-items: center; gap: 1rem; }
.creator-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #ff6b6b; }
.creator-details h1 { font-size: 1.3rem; margin-bottom: 0.25rem; color: white; }
.creator-bio { font-size: 0.9rem; color: #ccc; }

/* Video Grid */
.video-grid-section { padding: 1.5rem 1rem; }
.video-grid-section h3 { font-size: 1.2rem; margin-bottom: 1rem; color: #ff6b6b; }
.video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.video-item { background: #1a1a1a; border-radius: 12px; overflow: hidden; position: relative; }
.video-thumbnail { position: relative; aspect-ratio: 3/4; overflow: hidden; }
.video-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.play-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.lock-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.video-duration { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
.video-info { padding: 0.75rem; }
.video-info h4 { font-size: 0.9rem; margin-bottom: 0.25rem; color: white; }
.video-info p { font-size: 0.8rem; color: #ff6b6b; }
.video-item.locked { opacity: 0.6; }

/* Subscription Section */
.subscription-section { padding: 1.5rem; }
.subscription-card { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 20px; padding: 1.5rem; border: 1px solid #333; }
.subscription-header { text-align: center; margin-bottom: 1.5rem; }
.subscription-header h3 { font-size: 1.5rem; color: #ff6b6b; margin-bottom: 0.5rem; }
.subscription-header p { color: #ccc; font-size: 0.9rem; }
.form-description { color: #ccc; margin-bottom: 1rem; font-size: 0.9rem; text-align: center; }
.form-input { width: 100%; padding: 1rem; border: 2px solid #333; border-radius: 12px; font-size: 1rem; margin-bottom: 1rem; background: #1a1a1a; color: white; }
.form-input:focus { outline: none; border-color: #ff6b6b; background: #2d2d2d; }
.subscribe-btn { width: 100%; background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; border: none; padding: 1rem; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.subscribe-btn:hover { background: linear-gradient(135deg, #ee5a52, #e74c3c); }
.subscribe-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-text { font-size: 1.1rem; }
.btn-price { font-size: 0.9rem; opacity: 0.9; }

/* Success/Error Messages */
.success-message { text-align: center; }
.success-icon { font-size: 3rem; margin-bottom: 1rem; }
.success-message h3 { color: #ff6b6b; margin-bottom: 0.5rem; }
.success-message p { color: #ccc; margin-bottom: 1rem; }
.ussd-info { background: #1a1a1a; padding: 1rem; border-radius: 12px; margin: 1rem 0; border-left: 4px solid #ff6b6b; }
.ussd-info h4 { color: #ff6b6b; margin-bottom: 0.5rem; }
.ussd-info p { color: #ccc; font-size: 0.9rem; }
.payment-steps { text-align: left; margin-top: 1rem; }
.payment-steps ol { margin-left: 1.5rem; }
.payment-steps li { margin: 0.5rem 0; color: #ccc; font-size: 0.9rem; }
.error-message { text-align: center; }
.error-icon { font-size: 3rem; margin-bottom: 1rem; }
.error-message h3 { color: #e74c3c; margin-bottom: 0.5rem; }
.error-message p { color: #ccc; margin-bottom: 1rem; }

/* Features Section */
.features-section { padding: 1.5rem; background: #1a1a1a; }
.features-section h3 { text-align: center; color: #ff6b6b; margin-bottom: 1.5rem; font-size: 1.2rem; }
.features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.feature-item { background: #2d2d2d; padding: 1rem; border-radius: 12px; text-align: center; border: 1px solid #333; }
.feature-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.feature-text h4 { font-size: 0.9rem; color: white; margin-bottom: 0.25rem; }
.feature-text p { font-size: 0.8rem; color: #ccc; }

/* Processing Popup */
.processing-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.processing-content { background: #1a1a1a; padding: 2rem; border-radius: 20px; text-align: center; max-width: 300px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #333; }
.processing-spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #ff6b6b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
.processing-content h3 { color: white; margin-bottom: 0.5rem; }
.processing-content p { color: #ccc; margin-bottom: 1.5rem; font-size: 0.9rem; }
.processing-steps { text-align: left; }
.processing-steps .step { display: flex; align-items: center; margin: 0.5rem 0; padding: 0.5rem; border-radius: 8px; transition: all 0.3s ease; }
.processing-steps .step.active { background: #2d2d2d; color: #ff6b6b; }
.processing-steps .step-icon { font-size: 1.2rem; margin-right: 0.5rem; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Mobile Optimizations */
@media (max-width: 480px) {
  .video-feed-app { max-width: 100%; }
  .feed-header { padding: 1rem; }
  .creator-avatar { width: 50px; height: 50px; }
  .creator-details h1 { font-size: 1.2rem; }
  .video-grid-section { padding: 1rem; }
  .subscription-section { padding: 1rem; }
  .features-section { padding: 1rem; }
  .features-grid { grid-template-columns: 1fr; }
}`;
  }

  private getJoseHTML(): string {
    return `<div class="jose-app">
  <!-- Dating Profiles Section -->
  <div class="section dating-profiles-section">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">JIUNGE NA GROUP LANGU UPATE XVIDEOS 10 KILA SIKU🍆💦🍑🔞</h2>
        <p class="text-xl">NJOO UPATE CONNECTION ZOTE ZA MASTAA🍆👙💦</p>
      </div>
      
      <div class="profiles-grid">
        <div class="profile-card">
          <img src="{{creatorImage}}" alt="{{creatorName}}">
          <div class="profile-info">
            <h3>{{creatorName}}</h3>
            <p>Premium Content Creator</p>
          </div>
        </div>
        
        <div class="profile-card">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop" alt="Profile 2">
          <div class="profile-info">
            <h3>VIDEO CALL WHATSAPP MPAKA UNAKOJOA</h3>
            <p>19 • DAR ES SALAAM</p>
          </div>
        </div>
        
        <div class="profile-card">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop" alt="Profile 3">
          <div class="profile-info">
            <h3>WATOTO WA CHUO MIKOA YOTE 🍆👙💦</h3>
            <p>19 • TANZANIA</p>
          </div>
        </div>
      </div>
      
      <div class="cta-buttons">
        <a href="#" class="cta-btn" onclick="openPopup(); return false;">
          <span>🔥</span>
          <span>JIUNGE SASA</span>
        </a>
        <a href="#" class="cta-btn" onclick="openPopup(); return false;">
          <span>💎</span>
          <span>PREMIUM ACCESS</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Payment Popup Modal -->
  <div id="popup" class="popup-overlay">
    <div class="popup-modal">
      <button class="close-btn" onclick="closePopup()">&times;</button>
      
      <div class="popup-header">
        <h2>Lipia {{creatorPrice}} {{creatorCurrency}} Kuendelea</h2>
        <div class="benefits">
          <div class="benefit">
            <div class="benefit-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span>Jipatie access ya full video</span>
          </div>
          
          <div class="benefit">
            <div class="benefit-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span>Video call mpaka unakojoa</span>
          </div>
          
          <div class="benefit">
            <div class="benefit-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span>Connection zote za mastaa</span>
          </div>
        </div>
      </div>
      
      <div class="payment-amount">
        <div class="amount">{{creatorPrice}}</div>
        <div class="amount-label">{{creatorCurrency}}</div>
      </div>
      
      <div class="popup-content">
        <div class="form-group">
          <label for="phone">Namba ya simu:</label>
          <input type="tel" id="phone" placeholder="+255 123 456 789" required>
        </div>
        
        <div class="providers">
          <div class="provider" onclick="selectProvider('Tigo Pesa')">
            <div class="provider-name">Tigo Pesa</div>
            <div class="provider-subtext">Tanzania</div>
          </div>
          
          <div class="provider" onclick="selectProvider('Vodacom')">
            <div class="provider-name">Vodacom</div>
            <div class="provider-subtext">M-Pesa</div>
          </div>
          
          <div class="provider" onclick="selectProvider('Airtel Money')">
            <div class="provider-name">Airtel Money</div>
            <div class="provider-subtext">Tanzania</div>
          </div>
          
          <div class="provider" onclick="selectProvider('Halo Pesa')">
            <div class="provider-name">Halo Pesa</div>
            <div class="provider-subtext">Tanzania</div>
          </div>
        </div>
        
        <button id="payBtn" class="pay-btn" onclick="initiatePayment()">LIPIA SASA</button>
        
        <div id="error" class="error" style="display: none;"></div>
      </div>
    </div>
  </div>
</div>

<script>
let showPopup = false;
let selectedProvider = null;
let paymentStatus = 'idle';

function openPopup() {
  showPopup = true;
  document.getElementById('popup').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  if (paymentStatus === 'processing') return;
  showPopup = false;
  document.getElementById('popup').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function selectProvider(providerName) {
  selectedProvider = providerName;
  document.querySelectorAll('.provider').forEach(p => p.classList.remove('selected'));
  event.target.closest('.provider').classList.add('selected');
}

async function initiatePayment() {
  const phone = document.getElementById('phone').value;
  if (!phone) {
    showError('Please enter your phone number');
    return;
  }
  if (!selectedProvider) {
    showError('Please select a payment provider');
    return;
  }
  
  paymentStatus = 'processing';
  document.getElementById('payBtn').disabled = true;
  document.getElementById('payBtn').textContent = 'Processing...';
  hideError();
  
  try {
    // Extract pageId from URL path
    const pathParts = window.location.pathname.split('/');
    const pageId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    
    console.log('Subscribe data:', { pageId, phoneNumber: phone, templateType: 'jose' });
    
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: pageId,
        phoneNumber: phone,
        templateType: 'jose'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      paymentStatus = 'success';
      document.getElementById('payBtn').textContent = 'Payment Successful!';
      document.getElementById('payBtn').style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      // Show success message
      setTimeout(() => {
        alert('Payment successful! Check your phone for USSD prompt.');
        closePopup();
      }, 2000);
    } else {
      throw new Error(result.message || 'Payment failed');
    }
  } catch (error) {
    paymentStatus = 'failed';
    document.getElementById('payBtn').disabled = false;
    document.getElementById('payBtn').textContent = 'LIPIA SASA';
    showError('Payment failed. Please try again.');
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function hideError() {
  document.getElementById('error').style.display = 'none';
}

// Close popup when clicking outside
document.getElementById('popup').addEventListener('click', function(e) {
  if (e.target === this) {
    closePopup();
  }
});

// Add click handler to page
document.addEventListener('click', function(e) {
  if (!e.target.closest('.popup-modal') && !e.target.closest('.close-btn') && !e.target.closest('.cta-btn')) {
    openPopup();
  }
});
</script>`;
  }

  private getJoseCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
.jose-app { min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Dating Profiles Section */
.dating-profiles-section { background: #000000; color: white; padding: 64px 20px; }
.text-center { text-align: center; }
.mb-12 { margin-bottom: 3rem; }
.mb-4 { margin-bottom: 1rem; }
.text-4xl { font-size: 2.25rem; }
.text-xl { font-size: 1.25rem; }
.font-bold { font-weight: bold; }

.profiles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
.profile-card { background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 2px solid #fbbf24; }
.profile-card img { width: 100%; height: 6rem; object-fit: cover; }
.profile-info { padding: 0.75rem; text-align: center; }
.profile-info h3 { font-weight: 600; color: #1f2937; font-size: 1.125rem; margin: 0; }
.profile-info p { font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0 0 0; }

.cta-buttons { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
.cta-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 500; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); text-decoration: none; transition: transform 0.2s; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; }
.cta-btn:hover { transform: scale(1.05); }

/* Popup Modal Styles */
.popup-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.popup-modal { background: white; border-radius: 12px; max-width: 400px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; }
.popup-header { background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 24px; text-align: center; color: white; }
.popup-header h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 8px; }
.benefits { margin-top: 12px; }
.benefit { display: flex; align-items: center; justify-content: center; margin-bottom: 8px; font-size: 0.875rem; }
.benefit-icon { background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 4px; margin-right: 8px; }
.payment-amount { background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 24px; text-align: center; border-bottom: 1px solid #e5e7eb; }
.amount { font-size: 2rem; font-weight: bold; color: #1f2937; }
.amount-label { font-size: 0.875rem; color: #6b7280; }
.popup-content { padding: 24px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.form-group input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; }
.pay-btn { width: 100%; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px; border: none; border-radius: 8px; font-size: 1.125rem; font-weight: bold; cursor: pointer; }
.pay-btn:hover { background: linear-gradient(135deg, #059669, #047857); }
.pay-btn:disabled { background: #9ca3af; cursor: not-allowed; }
.providers { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 20px; }
.provider { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; cursor: pointer; transition: all 0.2s; }
.provider:hover { border-color: #3b82f6; background: #f8fafc; }
.provider.selected { border-color: #3b82f6; background: #eff6ff; }
.provider-name { font-weight: 500; }
.provider-subtext { font-size: 0.875rem; color: #6b7280; }
.error { color: #dc2626; font-size: 0.875rem; margin-top: 8px; }
.success { color: #059669; font-size: 0.875rem; margin-top: 8px; }
.close-btn { position: absolute; top: 16px; right: 16px; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }

@media (max-width: 640px) {
  .text-4xl { font-size: 1.5rem; }
  .text-xl { font-size: 1rem; }
  .profiles-grid { grid-template-columns: 1fr; }
  .popup-modal { margin: 10px; }
  .providers { grid-template-columns: 1fr; }
  .cta-buttons { flex-direction: column; align-items: center; }
}`;
  }

  private getBusinessServicesHTML(): string {
    return `<div class="business-services-app">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-3xl mx-auto px-4 py-4">
      <!-- Navigation removed as requested -->
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-3xl mx-auto px-4 py-6">
    <div class="prose prose-lg max-w-none">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Usikose Tenda kwasababu huna vitu hivi;</h1>
      
      <!-- Hero Image -->
      <div class="my-8">
        <img src="{{creatorImage}}" alt="{{creatorName}}" class="w-full h-64 object-cover rounded-lg shadow-lg">
      </div>
      
      <p class="mb-4">Mfanya-Biashara alitupigia simu AKIWA AMEJAA MASIKITIKO MAKUBWA baada ya kukosa TENDA YA TSH MILIONI 45.</p>
      
      <p class="mb-4">Kisa Hakuwa na business email.</p>
      
      <!-- Problem Illustration -->
      <div class="my-8 bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
        <div class="flex items-center mb-4">
          <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Gmail icon" class="w-12 h-12 rounded mr-4">
          <div>
            <h3 class="font-semibold text-red-800">❌Alituma quotation kwa kutumia email ya Gmail account na hakua na webiste</h3>
          </div>
        </div>
        <p class="text-red-700">Mteja akaona jamaa hayuko serious,na hajui anachokifanya, Badala yake, wakampatia tenda  mtu mwenye bei kubwa zaidi lakini aliyetuma quote yake kwa kutumia professional business email na alikua na proffesional website</p>
      </div>
      
      <!-- Warning Section -->
      <div class="my-8 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
        <div class="flex items-center mb-4">
          <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Warning" class="w-12 h-12 rounded mr-4">
          <h3 class="font-semibold text-yellow-800">⚠️JANGA HILI LINAWEZA KUKUPATA NA WEWE PIA KAMA HUNA MUONGOZO SAHIHI WA KUENDESHA BIASHARA YAKO KISASA KATIKA SOKO LENYE USHINDANI NA KUKUFANYA UPOTEZE TENDA NA BIASHARA BILA HATA KUJUA</h3>
        </div>
      </div>
      
      <!-- Solution Section -->
      <div class="my-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
        <h3 class="font-semibold text-green-800 mb-4">✅ SULUHISHO LETU:</h3>
        <p class="text-green-700 mb-4">Tunakupa Professional Business Email na Website ili uweze kushindana kwa usawa na wafanya biashara wengine na kupata tenda za kutosha.</p>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">📧 Professional Business Email</h4>
            <p class="text-gray-600 text-sm">Email ya biashara yako kama: info@biasharayako.co.tz</p>
          </div>
          <div class="bg-white p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">🌐 Professional Website</h4>
            <p class="text-gray-600 text-sm">Website ya biashara yako ili mteja aweze kukujua zaidi</p>
          </div>
        </div>
      </div>
      
      <!-- CTA Buttons -->
      <div class="my-8 text-center">
        <button onclick="openPaymentModal()" class="bg-green-600 text-white px-8 py-4 rounded-lg text-center font-semibold hover:bg-green-700 transition-colors text-lg">
          Pata Professional Business Email na Website - {{creatorPrice}} {{creatorCurrency}}
        </button>
      </div>
    </div>
  </main>

  <!-- Payment Modal -->
  <div id="paymentModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Lipia kwa Mobile Money</h3>
        <p class="text-gray-600 mb-4">Ingiza namba ya simu yako ya Mobile Money:</p>
        
        <form id="paymentForm">
          <div class="mb-4">
            <input type="tel" id="phoneNumber" placeholder="07XXXXXXXX" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
          </div>
          
          <div class="flex gap-3">
            <button type="button" onclick="closePaymentModal()" class="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Ghairi
            </button>
            <button type="submit" id="payButton" class="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Lipia {{creatorPrice}}
            </button>
          </div>
        </form>
        
        <!-- Payment Success Section (Hidden initially) -->
        <div id="paymentSuccessSection" class="hidden mt-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-center mb-2">
              <span class="text-green-600 text-2xl mr-2">✅</span>
              <h4 class="text-green-800 font-semibold">Malipo yameanzishwa!</h4>
            </div>
            <p class="text-green-700 text-sm">Tafadhali thibitisha malipo kwenye simu yako.</p>
          </div>
          
          <div class="text-center">
            <button onclick="redirectToWhatsApp()" class="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Nenda WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sticky CTA Buttons for Mobile -->
  <div class="sticky-bottom bg-white border-t p-4 md:hidden">
    <button onclick="openPaymentModal()" class="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
      Pata Professional Business Email na Website - {{creatorPrice}} {{creatorCurrency}}
    </button>
  </div>
</div>

<script>
// Payment Modal Functions
function openPaymentModal() {
  document.getElementById('paymentModal').classList.remove('hidden');
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.add('hidden');
  document.getElementById('paymentForm').reset();
  document.getElementById('paymentForm').style.display = 'block';
  document.getElementById('paymentSuccessSection').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('paymentModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closePaymentModal();
  }
});

// Handle payment form submission
document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const phoneNumber = document.getElementById('phoneNumber').value;
  
  if (!phoneNumber) {
    alert('Tafadhali ingiza namba ya simu yako');
    return;
  }
  
  // Show processing state
  const payButton = document.getElementById('payButton');
  payButton.disabled = true;
  payButton.textContent = 'Inaendelea...';
  
  // Hardcoded creator ID and user ID for fixed links
  const creatorId = '1757';
  const userId = '107';
  
  console.log('Subscribe data:', { creatorId, userId, phoneNumber, templateType: 'business-services-pro' });
  
  // Make API call with hardcoded IDs
  fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creatorId: creatorId,
      userId: userId,
      phoneNumber: phoneNumber,
      templateType: 'business-services-pro'
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      // Show success section
      document.getElementById('paymentForm').style.display = 'none';
      document.getElementById('paymentSuccessSection').classList.remove('hidden');
    } else {
      throw new Error(result.message || 'Payment failed');
    }
  })
  .catch(error => {
    console.error('Payment error:', error);
    alert('Kuna tatizo na malipo. Tafadhali jaribu tena.');
    payButton.disabled = false;
    payButton.textContent = 'Lipia {{creatorPrice}}';
  });
});

function redirectToWhatsApp() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const message = 'Hujambo! Nimefanya malipo ya Professional Business Email na Website. Tafadhali nisaidie kuendelea.';
  const whatsappUrl = 'https://wa.me/255' + phoneNumber.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(message);
  window.open(whatsappUrl, '_blank');
}
</script>`;
  }

  private getBusinessServicesCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
.business-services-app { min-height: 100vh; background: white; color: #111827; }

/* Header */
.bg-white { background-color: white; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.border-b { border-bottom: 1px solid #e5e7eb; }
.max-w-3xl { max-width: 48rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

/* Main Content */
main { max-width: 48rem; margin: 0 auto; padding: 1.5rem 1rem; }
.prose { color: #374151; max-width: none; }
.prose-lg { font-size: 1.125rem; line-height: 1.7777778; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.font-bold { font-weight: 700; }
.text-gray-900 { color: #111827; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.my-8 { margin-top: 2rem; margin-bottom: 2rem; }

/* Images */
.w-full { width: 100%; }
.h-64 { height: 16rem; }
.object-cover { object-fit: cover; }
.rounded-lg { border-radius: 0.5rem; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }

/* Problem/Solution Sections */
.bg-red-50 { background-color: #fef2f2; }
.bg-yellow-50 { background-color: #fffbeb; }
.bg-green-50 { background-color: #f0fdf4; }
.p-6 { padding: 1.5rem; }
.border-l-4 { border-left-width: 4px; }
.border-red-500 { border-color: #ef4444; }
.border-yellow-500 { border-color: #eab308; }
.border-green-500 { border-color: #22c55e; }

/* Flexbox */
.flex { display: flex; }
.items-center { align-items: center; }
.mr-4 { margin-right: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }

/* Text Colors */
.text-red-800 { color: #991b1b; }
.text-yellow-800 { color: #92400e; }
.text-green-800 { color: #166534; }
.text-red-700 { color: #b91c1c; }
.text-green-700 { color: #15803d; }
.text-gray-600 { color: #4b5563; }
.text-gray-800 { color: #1f2937; }
.font-semibold { font-weight: 600; }

/* Grid */
.grid { display: grid; }
.md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }

/* Buttons */
.bg-green-600 { background-color: #16a34a; }
.text-white { color: white; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.rounded-lg { border-radius: 0.5rem; }
.text-center { text-align: center; }
.font-semibold { font-weight: 600; }
.hover\\:bg-green-700:hover { background-color: #15803d; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }

/* Payment Modal */
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.bg-black { background-color: black; }
.bg-opacity-50 { background-color: rgba(0, 0, 0, 0.5); }
.hidden { display: none; }
.z-50 { z-index: 50; }
.min-h-screen { min-height: 100vh; }
.justify-center { justify-content: center; }
.max-w-md { max-width: 28rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.mb-4 { margin-bottom: 1rem; }

/* Form Elements */
.w-full { width: 100%; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.border { border-width: 1px; }
.border-gray-300 { border-color: #d1d5db; }
.focus\\:ring-2:focus { box-shadow: 0 0 0 2px var(--tw-ring-color); }
.focus\\:ring-green-500:focus { --tw-ring-color: #22c55e; }
.focus\\:border-transparent:focus { border-color: transparent; }
.required { }

/* Button Groups */
.flex { display: flex; }
.gap-3 { gap: 0.75rem; }
.flex-1 { flex: 1 1 0%; }
.bg-gray-500 { background-color: #6b7280; }
.hover\\:bg-gray-600:hover { background-color: #4b5563; }

/* Success Section */
.mt-4 { margin-top: 1rem; }
.border-green-200 { border-color: #bbf7d0; }
.text-green-600 { color: #16a34a; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }

/* Sticky Bottom */
.sticky-bottom { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: white; border-top: 1px solid #e5e7eb; padding: 1rem; }
@media (min-width: 768px) { .sticky-bottom { position: static; } }

/* Responsive */
@media (max-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .text-3xl { font-size: 1.5rem; line-height: 2rem; }
  .px-8 { padding-left: 1rem; padding-right: 1rem; }
  .py-4 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
}`;
  }

  private getBettingHTML(): string {
    return `<div class="betting-app">
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="logo">
                <i class="fas fa-futbol"></i>
                <h1>{{creatorName}}</h1>
            </div>
            <div class="header-stats">
                <div class="stat">
                    <span class="stat-number">1,247</span>
                    <span class="stat-label">Active Bets</span>
                </div>
                <div class="stat">
                    <span class="stat-number">TSH 2,234,800</span>
                    <span class="stat-label">Total Winnings</span>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Live Matches Section -->
            <section class="matches-section">
                <h2 class="section-title">
                    <i class="fas fa-play-circle"></i>
                    Live Matches
                </h2>
                
                <div class="matches-grid">
                    <!-- Match 1 -->
                    <div class="match-card" data-match="1">
                        <div class="match-header">
                            <div class="league">Championship</div>
                            <div class="match-time">LIVE 67'</div>
                        </div>
                        <div class="teams">
                            <div class="team">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRou2OiEkjargTJ3Wr6FT2INGd8h4DUmtr82w&s" alt="Bristol City" class="team-logo">
                                <span class="team-name">Bristol City</span>
                                <span class="team-score">2</span>
                            </div>
                            <div class="vs">VS</div>
                            <div class="team">
                                <span class="team-score">1</span>
                                <span class="team-name">Preston North End</span>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRou2OiEkjargTJ3Wr6FT2INGd8h4DUmtr82w&s" alt="Preston North End" class="team-logo">
                            </div>
                        </div>
                        <div class="odds-section">
                            <h4>Match Result</h4>
                            <div class="odds-grid">
                                <button class="odds-btn" data-odds="18.50" data-bet="home">
                                    <span class="bet-type">1</span>
                                    <span class="odds">18.50</span>
                                </button>
                                <button class="odds-btn" data-odds="22.00" data-bet="draw">
                                    <span class="bet-type">X</span>
                                    <span class="odds">22.00</span>
                                </button>
                                <button class="odds-btn" data-odds="19.75" data-bet="away">
                                    <span class="bet-type">2</span>
                                    <span class="odds">19.75</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Match 2 -->
                    <div class="match-card" data-match="2">
                        <div class="match-header">
                            <div class="league">Segunda División</div>
                            <div class="match-time">Today 20:00</div>
                        </div>
                        <div class="teams">
                            <div class="team">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRou2OiEkjargTJ3Wr6FT2INGd8h4DUmtr82w&s" alt="Real Oviedo" class="team-logo">
                                <span class="team-name">Real Oviedo</span>
                                <span class="team-score">-</span>
                            </div>
                            <div class="vs">VS</div>
                            <div class="team">
                                <span class="team-score">-</span>
                                <span class="team-name">CD Mirandés</span>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRou2OiEkjargTJ3Wr6FT2INGd8h4DUmtr82w&s" alt="CD Mirandés" class="team-logo">
                            </div>
                        </div>
                        <div class="odds-section">
                            <h4>Match Result</h4>
                            <div class="odds-grid">
                                <button class="odds-btn" data-odds="16.25" data-bet="home">
                                    <span class="bet-type">1</span>
                                    <span class="odds">16.25</span>
                                </button>
                                <button class="odds-btn" data-odds="24.50" data-bet="draw">
                                    <span class="bet-type">X</span>
                                    <span class="odds">24.50</span>
                                </button>
                                <button class="odds-btn" data-odds="17.80" data-bet="away">
                                    <span class="bet-type">2</span>
                                    <span class="odds">17.80</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Match 3 -->
                    <div class="match-card" data-match="3">
                        <div class="match-header">
                            <div class="league">Serie B</div>
                            <div class="match-time">Tomorrow 18:30</div>
                        </div>
                        <div class="teams">
                            <div class="team">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRou2OiEkjargTJ3Wr6FT2INGd8h4DUmtr82w&s" alt="Pisa SC" class="team-logo">
                                <span class="team-name">Pisa SC</span>
                                <span class="team-score">-</span>
                            </div>
                            <div class="vs">VS</div>
                            <div class="team">
                                <span class="team-score">-</span>
                                <span class="team-name">Cosenza Calcio</span>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRou2OiEkjargTJ3Wr6FT2INGd8h4DUmtr82w&s" alt="Cosenza Calcio" class="team-logo">
                            </div>
                        </div>
                        <div class="odds-section">
                            <h4>Match Result</h4>
                            <div class="odds-grid">
                                <button class="odds-btn" data-odds="20.00" data-bet="home">
                                    <span class="bet-type">1</span>
                                    <span class="odds">20.00</span>
                                </button>
                                <button class="odds-btn" data-odds="25.00" data-bet="draw">
                                    <span class="bet-type">X</span>
                                    <span class="odds">25.00</span>
                                </button>
                                <button class="odds-btn" data-odds="21.50" data-bet="away">
                                    <span class="bet-type">2</span>
                                    <span class="odds">21.50</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Betting Slip -->
            <aside class="betting-slip">
                <div class="slip-header">
                    <h3><i class="fas fa-receipt"></i> Betting Slip</h3>
                    <button class="clear-btn" id="clearSlip">Clear All</button>
                </div>
                
                <div class="slip-content" id="slipContent">
                    <div class="empty-slip">
                        <i class="fas fa-plus-circle"></i>
                        <p>Select odds to add bets</p>
                    </div>
                </div>

                <div class="slip-footer" id="slipFooter" style="display: none;">
                    <div class="total-section">
                        <div class="stake-input">
                            <label for="stake">Stake (TSH)</label>
                            <input type="number" id="stake" placeholder="0" min="1000" step="100">
                        </div>
                        <div class="potential-win">
                            <span class="label">Potential Win:</span>
                            <span class="amount" id="potentialWin">TSH 0</span>
                        </div>
                    </div>
                    
                    <div class="payment-section">
                        <h4>Payment Details</h4>
                        <div class="input-group">
                            <label for="mobile">Mobile Number</label>
                            <input type="tel" id="mobile" placeholder="07 1234 5678" required>
                        </div>
                        <div class="payment-methods">
                            <div class="payment-method active">
                                <i class="fas fa-mobile-alt"></i>
                                <span>SMS Payment</span>
                            </div>
                        </div>
                    </div>
                    
                    <button class="place-bet-btn" id="placeBetBtn">
                        <i class="fas fa-check"></i>
                        Place Bet
                    </button>
                </div>
            </aside>
        </main>

        <!-- Success Modal -->
        <div class="modal" id="successModal">
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fas fa-check-circle success-icon"></i>
                    <h3>Bet Placed Successfully!</h3>
                </div>
                <div class="modal-body">
                    <p>Your bet has been placed and payment will be processed via SMS.</p>
                    <div class="bet-details" id="betDetails"></div>
                </div>
                <button class="modal-btn" onclick="closeModal()">Continue Betting</button>
            </div>
        </div>
    </div>
</div>

<script>
// Global variables
let bettingSlip = [];
let currentStake = 0;

// DOM elements
const slipContent = document.getElementById('slipContent');
const slipFooter = document.getElementById('slipFooter');
const stakeInput = document.getElementById('stake');
const potentialWin = document.getElementById('potentialWin');
const mobileInput = document.getElementById('mobile');
const placeBetBtn = document.getElementById('placeBetBtn');
const clearBtn = document.getElementById('clearSlip');
const successModal = document.getElementById('successModal');
const betDetails = document.getElementById('betDetails');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateBettingSlip();
});

// Event Listeners
function initializeEventListeners() {
    // Odds button clicks
    document.querySelectorAll('.odds-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            handleOddsSelection(this);
        });
    });

    // Stake input
    stakeInput.addEventListener('input', function() {
        currentStake = parseFloat(this.value) || 0;
        updatePotentialWin();
        updatePlaceBetButton();
    });

    // Mobile input validation
    mobileInput.addEventListener('input', function() {
        validateMobileNumber();
        updatePlaceBetButton();
    });

    // Place bet button
    placeBetBtn.addEventListener('click', function() {
        placeBet();
    });

    // Clear slip button
    clearBtn.addEventListener('click', function() {
        clearBettingSlip();
    });
}

// Handle odds selection
function handleOddsSelection(button) {
    const matchCard = button.closest('.match-card');
    const matchId = matchCard.dataset.match;
    const odds = parseFloat(button.dataset.odds);
    const betType = button.dataset.bet;
    
    // Get match details
    const teams = matchCard.querySelectorAll('.team-name');
    const homeTeam = teams[0].textContent;
    const awayTeam = teams[1].textContent;
    const league = matchCard.querySelector('.league').textContent;
    
    // Create bet object
    const bet = {
        id: matchId + '-' + betType,
        matchId: matchId,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        league: league,
        betType: betType,
        odds: odds,
        betTypeText: getBetTypeText(betType)
    };

    // Check if bet already exists
    const existingBetIndex = bettingSlip.findIndex(b => b.id === bet.id);
    
    if (existingBetIndex !== -1) {
        // Remove existing bet
        bettingSlip.splice(existingBetIndex, 1);
        button.classList.remove('selected');
    } else {
        // Add new bet
        bettingSlip.push(bet);
        button.classList.add('selected');
    }

    updateBettingSlip();
}

// Get bet type text
function getBetTypeText(betType) {
    const betTypes = {
        'home': 'Home Win',
        'draw': 'Draw',
        'away': 'Away Win'
    };
    return betTypes[betType] || betType;
}

// Update betting slip display
function updateBettingSlip() {
    if (bettingSlip.length === 0) {
        slipContent.innerHTML = '<div class="empty-slip"><i class="fas fa-plus-circle"></i><p>Select odds to add bets</p></div>';
        slipFooter.style.display = 'none';
    } else {
        slipContent.innerHTML = bettingSlip.map(bet => '<div class="bet-item"><div class="bet-item-header"><span class="bet-match">' + bet.homeTeam + ' vs ' + bet.awayTeam + '</span><button class="remove-bet" onclick="removeBet(\'' + bet.id + '\')"><i class="fas fa-times"></i></button></div><div class="bet-details">' + bet.league + ' - ' + bet.betTypeText + '</div><div class="bet-odds">Odds: ' + bet.odds + '</div></div>').join('');
        slipFooter.style.display = 'block';
    }
    
    updatePotentialWin();
    updatePlaceBetButton();
}

// Remove bet from slip
function removeBet(betId) {
    bettingSlip = bettingSlip.filter(bet => bet.id !== betId);
    
    // Remove selected class from corresponding button
    const matchId = betId.split('-')[0];
    const betType = betId.split('-')[1];
    const matchCard = document.querySelector('[data-match="' + matchId + '"]');
    const button = matchCard.querySelector('[data-bet="' + betType + '"]');
    if (button) {
        button.classList.remove('selected');
    }
    
    updateBettingSlip();
}

// Clear all bets
function clearBettingSlip() {
    bettingSlip = [];
    
    // Remove all selected classes
    document.querySelectorAll('.odds-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset form
    stakeInput.value = '';
    mobileInput.value = '';
    currentStake = 0;
    
    updateBettingSlip();
}

// Update potential win calculation
function updatePotentialWin() {
    if (bettingSlip.length === 0 || currentStake === 0) {
        potentialWin.textContent = 'TSH 0';
        return;
    }

    // Calculate total odds (multiply all odds together)
    const totalOdds = bettingSlip.reduce((acc, bet) => acc * bet.odds, 1);
    const potentialWinAmount = currentStake * totalOdds;
    
    potentialWin.textContent = 'TSH ' + Math.round(potentialWinAmount).toLocaleString();
}

// Validate mobile number
function validateMobileNumber() {
    const mobile = mobileInput.value.trim();
    // Tanzanian mobile number format: 07xxxxxxxx (10 digits starting with 07)
    const mobileRegex = /^07[0-9]{8}$/;
    
    if (mobile && !mobileRegex.test(mobile.replace(/\s/g, ''))) {
        mobileInput.style.borderColor = '#e74c3c';
        return false;
    } else {
        mobileInput.style.borderColor = '#e9ecef';
        return true;
    }
}

// Update place bet button state
function updatePlaceBetButton() {
    const isValidMobile = validateMobileNumber();
    const hasBets = bettingSlip.length > 0;
    const hasStake = currentStake > 0;
    const isValidStake = currentStake >= 1000;
    
    const canPlaceBet = hasBets && hasStake && isValidStake && isValidMobile && mobileInput.value.trim() !== '';
    
    placeBetBtn.disabled = !canPlaceBet;
    
    if (canPlaceBet) {
        placeBetBtn.style.opacity = '1';
        placeBetBtn.style.cursor = 'pointer';
    } else {
        placeBetBtn.style.opacity = '0.6';
        placeBetBtn.style.cursor = 'not-allowed';
    }
}

// Place bet function
function placeBet() {
    if (bettingSlip.length === 0 || currentStake === 0) {
        alert('Please add bets and enter a stake amount.');
        return;
    }

    if (!validateMobileNumber() || mobileInput.value.trim() === '') {
        alert('Please enter a valid mobile number.');
        return;
    }

    if (currentStake < 1000) {
        alert('Minimum stake is TSH 1,000');
        return;
    }

    // Extract pageId from URL path
    const pathParts = window.location.pathname.split('/');
    const pageId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    
    console.log('Subscribe data:', { pageId, phoneNumber: mobileInput.value, templateType: 'betting' });
    
    // Make API call
    fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            pageId: pageId,
            phoneNumber: mobileInput.value,
            templateType: 'betting'
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Show success modal
            showSuccessModal();
        } else {
            throw new Error(result.message || 'Bet placement failed');
        }
    })
    .catch(error => {
        console.error('Bet placement error:', error);
        alert('Kuna tatizo na kuweka bet. Tafadhali jaribu tena.');
    });
}

// Show success modal
function showSuccessModal() {
    // Calculate total odds and potential win
    const totalOdds = bettingSlip.reduce((acc, bet) => acc * bet.odds, 1);
    const potentialWinAmount = currentStake * totalOdds;

    // Create bet summary for modal
    const betSummary = bettingSlip.map(bet => '<div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px;"><strong>' + bet.homeTeam + ' vs ' + bet.awayTeam + '</strong><br><span style="color: #666;">' + bet.league + ' - ' + bet.betTypeText + '</span><br><span style="color: #667eea; font-weight: 600;">Odds: ' + bet.odds + '</span></div>').join('');

    betDetails.innerHTML = '<div style="margin-bottom: 15px;"><strong>Bet Details:</strong></div>' + betSummary + '<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;"><div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Stake:</span><span>TSH ' + currentStake.toLocaleString() + '</span></div><div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Total Odds:</span><span>' + totalOdds.toFixed(2) + '</span></div><div style="display: flex; justify-content: space-between; font-weight: 600; color: #667eea;"><span>Potential Win:</span><span>TSH ' + Math.round(potentialWinAmount).toLocaleString() + '</span></div><div style="display: flex; justify-content: space-between; margin-top: 10px;"><span>Mobile:</span><span>' + mobileInput.value + '</span></div></div>';

    // Show success modal
    successModal.classList.add('show');
}

// Close modal
function closeModal() {
    successModal.classList.remove('show');
    
    // Clear the betting slip after successful bet
    clearBettingSlip();
}

// Close modal when clicking outside
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

// Add some interactive animations
document.querySelectorAll('.odds-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        if (!this.classList.contains('selected')) {
            this.style.transform = 'translateY(-2px)';
        }
    });
    
    btn.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to place bet when form is valid
    if (e.key === 'Enter' && !placeBetBtn.disabled) {
        placeBet();
    }
    
    // Escape key to close modal
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModal();
    }
});

// Add loading animation for place bet button
placeBetBtn.addEventListener('click', function() {
    if (!this.disabled) {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.disabled = true;
        
        // Reset after modal shows
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    }
});

// Add real-time odds updates simulation (optional)
function simulateOddsUpdate() {
    const oddsButtons = document.querySelectorAll('.odds-btn');
    oddsButtons.forEach(btn => {
        if (!btn.classList.contains('selected')) {
            const currentOdds = parseFloat(btn.dataset.odds);
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const newOdds = Math.max(1.01, currentOdds + variation);
            btn.dataset.odds = newOdds.toFixed(2);
            btn.querySelector('.odds').textContent = newOdds.toFixed(2);
        }
    });
}

// Update odds every 30 seconds (simulation)
setInterval(simulateOddsUpdate, 30000);

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
</script>`;
  }

  private getBusinessServicesProHTML(): string {
    return `<div class="business-services-app">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-3xl mx-auto px-4 py-4">
      <!-- Navigation removed as requested -->
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-3xl mx-auto px-4 py-6">
    <div class="prose prose-lg max-w-none">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Ukitaka kujua kama umeanza kupiga hatua maishani angalia umri wako then ndo kiwango cha pesa unapaswa uwe nacho benki.</h1>
      
      <!-- Hero Image -->
      <div class="my-8">
        <img src="{{creatorImage}}" alt="{{creatorName}}" class="w-full h-64 object-cover rounded-lg shadow-lg">
      </div>
      
      <p class="mb-4">Mfano kama una miaka 25 basi unapaswa kuwa na Tshs 25 Million benki.</p>
      
      <p class="mb-4">Kuna tajiri mmoja nilionana naye zamani sana nikaomba ushauri wa mafanikio akaniuliza nina shilingi ngapi nikamwambia milioni 2.</p>
      
      <!-- Story Section -->
      <div class="my-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
        <p class="text-blue-700 mb-4">Akaniuliza una miaka mingapi nikamwambia. Akasema sasa mbona unamiliki pesa sawa na mtoto wa miaka 2 ambaye amewekewa akiba na mzazi wake kwa kuwa hawezi kujitafutia mwenyewe.</p>
        
        <p class="text-blue-700 mb-4">Hapo tulikuwa kwenye gari lake kwa sababu mwanaye mmoja alikuwa akinikubali sana ndo alifanya nikafika kwao. Nakumbuka wakati anasema hivyo na yuko na watoto wake kwenye gari. Nilisikia kama kupigwa baridi.</p>
        
        <p class="text-blue-700 mb-4">Yani huyu mzee anaelewa nilikotoka mpaka nina hii milioni 2 (mawazo ya kimasikini yalinijaa na hasira za kijinga).</p>
      </div>
      
      <!-- Wisdom Section -->
      <div class="my-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
        <h3 class="font-semibold text-green-800 mb-4">But kitu kikaniambia tulia wewe upewe elimu bure usife maskini.</h3>
        
        <p class="text-green-700 mb-4">Nikamuuliza Can you please explain?</p>
        
        <p class="text-green-700 mb-4">Akasema tu siku ukiwa na pesa sawa na umri wako nitafute. Yani kama uko 23 una milioni mbili ukifika siku uko labda 25 na una 25 million nitafute. Hata ukifika 30M ndo una 30M ilimradi pesa zako zilingane na umri wako hapo nitafute maana utakuwa na akili timamu?</p>
        
        <p class="text-green-700 mb-4">My friends. Imagine mtu anakwambia tu kiutu uzima kwamba sasa hivi huna akili timamu.</p>
      </div>
      
      <!-- Realization Section -->
      <div class="my-8 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
        <p class="text-yellow-700 mb-4">Lakini baadaye nilijua alikuwa ananitenga na watoto wake ili nisiwaambukize malalamiko ya ooh mimi nimetoka familia duni.. oh mi sina hiki... oh mimi nilikosa kile.</p>
        
        <p class="text-yellow-700 mb-4">Na kweli. Ilinichukua miaka 7 kuwa na AKIBA BENKI sawa na umri wangu. Yani pesa ambayo hiyo ipo. Kwamba ukipewa bness idea inahitaji milioni 5 unakuwa huna stress chap chap na kilichobaki benki bado kikubwa na unaki replace chap chap ili at any point in your life uwe na pesa sawa na umri wako minimum.</p>
        
        <p class="text-yellow-700 mb-4">Na kweli nilipata akili timamu.. so napowaambia acha kufuatilia sijui Champions League namaanisha. Sijui Msanii kazaa na nani? Ulitaka uzae naye wewe au? It's crazy how you waste your time with the trivialities of life!</p>
      </div>
      
      <!-- Key Principle -->
      <div class="my-8 bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
        <h3 class="font-semibold text-red-800 mb-4">So tafuta kwanza pesa sawa na umri wako.</h3>
        
        <p class="text-red-700 mb-4">Then una double hiyo amount. Then unatriple.</p>
        
        <p class="text-red-700 mb-4">Kwa mnaoelewa maana ya neno LIQUIDITY inabidi uwe walau na liquidity x3 of your age unapokuwa mtu mzima.</p>
        
        <ul class="text-red-700 mb-4 list-disc pl-6">
          <li>Kama una miaka 25 uwe na 25M katika pesa au shares au bond au precious metals.. (liquid assests)</li>
          <li>Ukifika 35 uwe na double yani 70M</li>
          <li>Umri unavyoenda inabidi liquidity yako iwe x5. Una miaka 50 uwe na minimum liquid assets ya Tshs 250M</li>
          <li>Una miaka 70 (the Golden years) uwe 7 times. Tshs milioni 490M in liquid assets.</li>
        </ul>
      </div>
      
      <!-- Call to Action -->
      <div class="my-8 bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
        <h3 class="font-semibold text-purple-800 mb-4">So fundishika mapema... ukikosa hizi fursa nani atakutafuta ulipo akuweke karibu ili akukonnect na kukupa hizi takwimu na kushare na wewe story yako</h3>
        
        <p class="text-purple-700 mb-4">But kwa vijana hasa 20s and 30s this is your time. Be wise.</p>
        
        <p class="text-purple-700 mb-4 font-bold">You'll thank yourself later.</p>
      </div>
      
      <!-- Additional Content -->
      <div class="my-8 bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
        <p class="text-indigo-700 mb-4">Kama unataka kujifunza jinsi ya kujikwamua kiuchumi mapema ,na kuishi maisha ya ndoto zako, hakikisha unajiunga na GROUP LANGU LA WHATSAAP" hapo chini..</p>
        
        <p class="text-indigo-700 mb-4 font-bold">Lakini kama unaona wewe bado bado unajipanga endelea kujipanga iko siku utajielewa</p>
      </div>
      
      <!-- CTA Buttons -->
      <div class="my-8 text-center">
        <button onclick="openPaymentModal()" class="bg-purple-600 text-white px-8 py-4 rounded-lg text-center font-semibold hover:bg-purple-700 transition-colors text-lg">
          NDIO, NIUNGANISHE NA GROUP
        </button>
      </div>
    </div>
  </main>

  <!-- Payment Modal -->
  <div id="paymentModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Lipia kwa Mobile Money</h3>
        <p class="text-gray-600 mb-4">Ingiza namba ya simu yako ya Mobile Money:</p>
        
        <form id="paymentForm">
          <div class="mb-4">
            <input type="tel" id="phoneNumber" placeholder="07XXXXXXXX" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required>
          </div>
          
          <div class="flex gap-3">
            <button type="button" onclick="closePaymentModal()" class="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              Ghairi
            </button>
            <button type="submit" id="payButton" class="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Lipia {{creatorPrice}}
            </button>
          </div>
        </form>
        
        <!-- Payment Success Section (Hidden initially) -->
        <div id="paymentSuccessSection" class="hidden mt-4">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <div class="flex items-center mb-2">
              <span class="text-purple-600 text-2xl mr-2">✅</span>
              <h4 class="text-purple-800 font-semibold">Malipo yameanzishwa!</h4>
            </div>
            <p class="text-purple-700 text-sm">Tafadhali thibitisha malipo kwenye simu yako.</p>
          </div>
          
          <div class="text-center">
            <button onclick="redirectToWhatsApp()" class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Nenda WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sticky CTA Buttons for Mobile -->
  <div class="sticky-bottom bg-white border-t p-4 md:hidden">
    <button onclick="openPaymentModal()" class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
      NDIO, NIUNGANISHE NA GROUP
    </button>
  </div>
</div>

<script>
// Payment Modal Functions
function openPaymentModal() {
  document.getElementById('paymentModal').classList.remove('hidden');
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.add('hidden');
  document.getElementById('paymentForm').reset();
  document.getElementById('paymentForm').style.display = 'block';
  document.getElementById('paymentSuccessSection').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('paymentModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closePaymentModal();
  }
});

// Handle payment form submission
document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const phoneNumber = document.getElementById('phoneNumber').value;
  
  if (!phoneNumber) {
    alert('Tafadhali ingiza namba ya simu yako');
    return;
  }
  
  // Show processing state
  const payButton = document.getElementById('payButton');
  payButton.disabled = true;
  payButton.textContent = 'Inaendelea...';
  
  // Extract pageId from URL path
  const pathParts = window.location.pathname.split('/');
  const pageId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  console.log('Subscribe data:', { pageId, phoneNumber, templateType: 'business-services-pro' });
  
  // Make API call
  fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageId: pageId,
      phoneNumber: phoneNumber,
      templateType: 'business-services-pro'
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      // Show success section
      document.getElementById('paymentForm').style.display = 'none';
      document.getElementById('paymentSuccessSection').classList.remove('hidden');
    } else {
      throw new Error(result.message || 'Payment failed');
    }
  })
  .catch(error => {
    console.error('Payment error:', error);
    alert('Kuna tatizo na malipo. Tafadhali jaribu tena.');
    payButton.disabled = false;
    payButton.textContent = 'Lipia {{creatorPrice}}';
  });
});

function redirectToWhatsApp() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const message = 'Hujambo! Nimefanya malipo ya Kujenga Uwezo Wangu wa Kifedha. Tafadhali nisaidie kuendelea.';
  const whatsappUrl = 'https://wa.me/255' + phoneNumber.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(message);
  window.open(whatsappUrl, '_blank');
}
</script>`;
  }

  private getBusinessServicesProCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
.business-services-app { min-height: 100vh; background: white; color: #111827; }

/* Header */
.bg-white { background-color: white; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.border-b { border-bottom: 1px solid #e5e7eb; }
.max-w-3xl { max-width: 48rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

/* Main Content */
main { max-width: 48rem; margin: 0 auto; padding: 1.5rem 1rem; }
.prose { color: #374151; max-width: none; }
.prose-lg { font-size: 1.125rem; line-height: 1.7777778; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.font-bold { font-weight: 700; }
.text-gray-900 { color: #111827; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.my-8 { margin-top: 2rem; margin-bottom: 2rem; }

/* Images */
.w-full { width: 100%; }
.h-64 { height: 16rem; }
.object-cover { object-fit: cover; }
.rounded-lg { border-radius: 0.5rem; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }

/* Story Sections */
.bg-blue-50 { background-color: #eff6ff; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-yellow-50 { background-color: #fffbeb; }
.bg-red-50 { background-color: #fef2f2; }
.bg-purple-50 { background-color: #f5f3ff; }
.p-6 { padding: 1.5rem; }
.border-l-4 { border-left-width: 4px; }
.border-blue-500 { border-color: #3b82f6; }
.border-green-500 { border-color: #22c55e; }
.border-yellow-500 { border-color: #eab308; }
.border-red-500 { border-color: #ef4444; }
.border-purple-500 { border-color: #8b5cf6; }

/* Flexbox */
.flex { display: flex; }
.items-center { align-items: center; }
.mr-4 { margin-right: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }

/* Text Colors */
.text-blue-800 { color: #1e40af; }
.text-green-800 { color: #166534; }
.text-yellow-800 { color: #92400e; }
.text-red-800 { color: #991b1b; }
.text-purple-800 { color: #6b21a8; }
.text-blue-700 { color: #1d4ed8; }
.text-green-700 { color: #15803d; }
.text-yellow-700 { color: #a16207; }
.text-red-700 { color: #b91c1c; }
.text-purple-700 { color: #7c3aed; }
.text-gray-600 { color: #4b5563; }
.text-gray-800 { color: #1f2937; }
.font-semibold { font-weight: 600; }

/* Lists */
.list-disc { list-style-type: disc; }
.pl-6 { padding-left: 1.5rem; }

/* Buttons */
.bg-purple-600 { background-color: #7c3aed; }
.text-white { color: white; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.rounded-lg { border-radius: 0.5rem; }
.text-center { text-align: center; }
.font-semibold { font-weight: 600; }
.hover\\:bg-purple-700:hover { background-color: #6d28d9; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }

/* Payment Modal */
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.bg-black { background-color: black; }
.bg-opacity-50 { background-color: rgba(0, 0, 0, 0.5); }
.hidden { display: none; }
.z-50 { z-index: 50; }
.min-h-screen { min-height: 100vh; }
.justify-center { justify-content: center; }
.max-w-md { max-width: 28rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.mb-4 { margin-bottom: 1rem; }

/* Form Elements */
.w-full { width: 100%; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.border { border-width: 1px; }
.border-gray-300 { border-color: #d1d5db; }
.focus\\:ring-2:focus { box-shadow: 0 0 0 2px var(--tw-ring-color); }
.focus\\:ring-purple-500:focus { --tw-ring-color: #8b5cf6; }
.focus\\:border-transparent:focus { border-color: transparent; }
.required { }

/* Button Groups */
.flex { display: flex; }
.gap-3 { gap: 0.75rem; }
.flex-1 { flex: 1 1 0%; }
.bg-gray-500 { background-color: #6b7280; }
.hover\\:bg-gray-600:hover { background-color: #4b5563; }

/* Success Section */
.mt-4 { margin-top: 1rem; }
.border-purple-200 { border-color: #ddd6fe; }
.text-purple-600 { color: #7c3aed; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }

/* Sticky Bottom */
.sticky-bottom { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: white; border-top: 1px solid #e5e7eb; padding: 1rem; }
@media (min-width: 768px) { .sticky-bottom { position: static; } }

/* Responsive */
@media (max-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .text-3xl { font-size: 1.5rem; line-height: 2rem; }
  .px-8 { padding-left: 1rem; padding-right: 1rem; }
  .py-4 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
}`;
  }

  private getBettingCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: #333; line-height: 1.6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
.betting-app { min-height: 100vh; }
.container { max-width: 1400px; margin: 0 auto; padding: 10px; }
@media (min-width: 768px) { .container { padding: 20px; } }

/* Header Styles */
.header { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 15px; padding: 15px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }
@media (min-width: 768px) { .header { border-radius: 20px; padding: 20px 30px; margin-bottom: 30px; } }
.logo { display: flex; align-items: center; gap: 15px; }
.logo i { font-size: 2rem; color: #667eea; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.logo h1 { font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
@media (min-width: 768px) { .logo i { font-size: 2.5rem; } .logo h1 { font-size: 2rem; } }
.header-stats { display: flex; gap: 15px; }
.stat { text-align: center; }
.stat-number { display: block; font-size: 1.2rem; font-weight: 700; color: #667eea; }
.stat-label { font-size: 0.8rem; color: #666; font-weight: 500; }
@media (min-width: 768px) { .header-stats { gap: 30px; } .stat-number { font-size: 1.5rem; } .stat-label { font-size: 0.9rem; } }

/* Main Content */
.main-content { display: flex; flex-direction: column; gap: 20px; align-items: stretch; }
@media (min-width: 1024px) { .main-content { display: grid; grid-template-columns: 1fr 400px; gap: 30px; align-items: start; } }

/* Matches Section */
.matches-section { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); order: 2; }
@media (min-width: 1024px) { .matches-section { border-radius: 20px; padding: 30px; order: 1; } }
.section-title { display: flex; align-items: center; gap: 10px; font-size: 1.3rem; font-weight: 600; margin-bottom: 20px; color: #333; }
@media (min-width: 768px) { .section-title { font-size: 1.5rem; margin-bottom: 25px; } }
.section-title i { color: #667eea; }
.matches-grid { display: flex; flex-direction: column; gap: 15px; }
@media (min-width: 768px) { .matches-grid { gap: 20px; } }

/* Match Card */
.match-card { background: #fff; border-radius: 12px; padding: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #f0f0f0; transition: all 0.3s ease; }
@media (min-width: 768px) { .match-card { border-radius: 15px; padding: 20px; } }
.match-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); }
.match-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
@media (min-width: 768px) { .match-header { margin-bottom: 15px; } }
.league { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 4px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 600; }
@media (min-width: 768px) { .league { padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; } }
.match-time { color: #e74c3c; font-weight: 600; font-size: 0.8rem; }
@media (min-width: 768px) { .match-time { font-size: 0.9rem; } }
.teams { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
@media (min-width: 768px) { .teams { margin-bottom: 20px; } }
.team { display: flex; align-items: center; gap: 8px; flex: 1; }
.team:last-child { flex-direction: row-reverse; }
.team-logo { width: 35px; height: 35px; border-radius: 50%; object-fit: cover; }
.team-name { font-weight: 600; font-size: 0.9rem; }
.team-score { font-size: 1.3rem; font-weight: 700; color: #667eea; min-width: 25px; text-align: center; }
.vs { font-weight: 700; color: #999; font-size: 0.8rem; margin: 0 15px; }
@media (min-width: 768px) { .team { gap: 10px; } .team-logo { width: 40px; height: 40px; } .team-name { font-size: 1rem; } .team-score { font-size: 1.5rem; min-width: 30px; } .vs { font-size: 0.9rem; margin: 0 20px; } }

/* Odds Section */
.odds-section h4 { font-size: 0.85rem; color: #666; margin-bottom: 8px; font-weight: 600; }
.odds-grid { display: flex; gap: 8px; }
.odds-btn { flex: 1; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 10px 6px; cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; gap: 4px; min-height: 60px; touch-action: manipulation; }
@media (min-width: 768px) { .odds-section h4 { font-size: 0.9rem; margin-bottom: 10px; } .odds-grid { gap: 10px; } .odds-btn { border-radius: 10px; padding: 12px 8px; gap: 5px; min-height: auto; } }
.odds-btn:hover { background: #667eea; border-color: #667eea; color: white; transform: translateY(-1px); }
.odds-btn.selected { background: linear-gradient(135deg, #667eea, #764ba2); border-color: #667eea; color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
.bet-type { font-weight: 700; font-size: 0.9rem; }
.odds { font-weight: 600; font-size: 0.8rem; }
@media (min-width: 768px) { .bet-type { font-size: 1rem; } .odds { font-size: 0.9rem; } }

/* Betting Slip */
.betting-slip { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); order: 1; max-height: none; overflow-y: visible; }
@media (min-width: 1024px) { .betting-slip { border-radius: 20px; padding: 25px; position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow-y: auto; order: 2; } }
.slip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 2px solid #f0f0f0; }
.slip-header h3 { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; font-weight: 600; color: #333; }
@media (min-width: 768px) { .slip-header { margin-bottom: 20px; padding-bottom: 15px; } .slip-header h3 { gap: 10px; font-size: 1.2rem; } }
.slip-header i { color: #667eea; }
.clear-btn { background: none; border: none; color: #e74c3c; font-weight: 600; cursor: pointer; padding: 5px 10px; border-radius: 5px; transition: background 0.3s ease; }
.clear-btn:hover { background: rgba(231, 76, 60, 0.1); }
.empty-slip { text-align: center; padding: 40px 20px; color: #999; }
.empty-slip i { font-size: 3rem; margin-bottom: 15px; color: #ddd; }

/* Bet Items */
.bet-item { background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #667eea; }
.bet-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.bet-match { font-weight: 600; font-size: 0.9rem; color: #333; }
.remove-bet { background: none; border: none; color: #e74c3c; cursor: pointer; padding: 2px 6px; border-radius: 3px; transition: background 0.3s ease; }
.remove-bet:hover { background: rgba(231, 76, 60, 0.1); }
.bet-details { font-size: 0.8rem; color: #666; margin-bottom: 5px; }
.bet-odds { font-weight: 600; color: #667eea; }

/* Slip Footer */
.slip-footer { border-top: 2px solid #f0f0f0; padding-top: 20px; }
.total-section { margin-bottom: 20px; }
.stake-input { margin-bottom: 15px; }
.stake-input label { display: block; font-weight: 600; margin-bottom: 5px; color: #333; }
.stake-input input { width: 100%; padding: 14px; border: 2px solid #e9ecef; border-radius: 10px; font-size: 1rem; transition: border-color 0.3s ease; -webkit-appearance: none; -moz-appearance: textfield; }
.stake-input input::-webkit-outer-spin-button, .stake-input input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.stake-input input:focus { outline: none; border-color: #667eea; }
.potential-win { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 10px; font-weight: 600; }
.payment-section { margin-bottom: 20px; }
.payment-section h4 { font-size: 1rem; font-weight: 600; margin-bottom: 15px; color: #333; }
.input-group { margin-bottom: 15px; }
.input-group label { display: block; font-weight: 600; margin-bottom: 5px; color: #333; }
.input-group input { width: 100%; padding: 14px; border: 2px solid #e9ecef; border-radius: 10px; font-size: 1rem; transition: border-color 0.3s ease; -webkit-appearance: none; }
.input-group input:focus { outline: none; border-color: #667eea; }
.payment-methods { display: flex; gap: 10px; }
.payment-method { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; border: 2px solid #e9ecef; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; font-weight: 600; color: #666; }
.payment-method.active { border-color: #667eea; background: rgba(102, 126, 234, 0.1); color: #667eea; }
.place-bet-btn { width: 100%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 15px; border-radius: 10px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 10px; }
.place-bet-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }
.place-bet-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }

/* Modal */
.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px); z-index: 1000; align-items: center; justify-content: center; }
.modal.show { display: flex; }
.modal-content { background: white; border-radius: 20px; padding: 30px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); animation: modalSlideIn 0.3s ease; }
@keyframes modalSlideIn { from { opacity: 0; transform: translateY(-50px); } to { opacity: 1; transform: translateY(0); } }
.modal-header { margin-bottom: 20px; }
.success-icon { font-size: 4rem; color: #27ae60; margin-bottom: 15px; }
.modal-header h3 { font-size: 1.5rem; font-weight: 600; color: #333; }
.modal-body { margin-bottom: 25px; color: #666; }
.bet-details { background: #f8f9fa; border-radius: 10px; padding: 15px; margin-top: 15px; text-align: left; }
.modal-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 30px; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.modal-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }

/* Responsive Design */
@media (max-width: 1200px) { .main-content { grid-template-columns: 1fr; gap: 20px; } .betting-slip { position: static; max-height: none; } }
@media (max-width: 768px) { .container { padding: 15px; } .header { flex-direction: column; gap: 20px; text-align: center; } .header-stats { gap: 20px; } .matches-section { padding: 20px; } .betting-slip { padding: 20px; } .teams { flex-direction: column; gap: 10px; } .team { flex-direction: row !important; } .vs { margin: 0; } .odds-grid { flex-direction: column; } .odds-btn { flex-direction: row; justify-content: space-between; padding: 15px; } }
@media (max-width: 480px) { .logo h1 { font-size: 1.5rem; } .logo i { font-size: 2rem; } .section-title { font-size: 1.2rem; } .match-card { padding: 15px; } .betting-slip { padding: 15px; } }`;
  }
}

export const templateEngine = new TemplateEngine();
