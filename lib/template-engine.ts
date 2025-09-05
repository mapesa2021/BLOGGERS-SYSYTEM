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

    // BLOGGERS Template
    this.addTemplate({
      id: 'modern',
      name: 'BLOGGERS',
      description: 'Professional business-focused design',
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
    html = html.replace(/\{\{creatorPrice\}\}/g, (data.creatorPrice || 0).toString());
    html = html.replace(/\{\{creatorCurrency\}\}/g, data.creatorCurrency || 'TZS');

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
    return `<div class="app">
  <nav class="navbar">
    <div class="logo">Clubzila Creator</div>
  </nav>
  
  <header class="hero">
    <div class="hero-bg">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAVXizNz-j3efqxTqoFLMoIOsCZawMMMWYAw&s" alt="Business background" class="hero-bg-img">
    </div>
    <div class="hero-content">
      <img src="{{creatorImage}}" alt="{{creatorName}}" class="hero-image">
      <div class="hero-text">
        <h1>{{creatorName}}</h1>
        <p>{{creatorBio}}</p>
        <div class="subscription-form">
          <div class="form-step" id="step1">
            <p class="form-description">Enter your User ID, Creator ID, and phone number to subscribe</p>
            <input type="text" id="userId" placeholder="Enter your User ID" class="form-input" required>
            <input type="text" id="creatorId" placeholder="Enter Creator ID" class="form-input" required>
            <input type="tel" id="phoneNumber" placeholder="Enter your mobile money phone number" class="form-input" required>
            <button onclick="subscribe()" class="cta-btn">Subscribe Now</button>
          </div>
          
          <div class="form-step" id="step2" style="display: none;">
            <div class="success-message">
              <h3>Subscription Initiated! 📱</h3>
              <p>Check your phone for a USSD prompt to complete the payment.</p>
              <p class="ussd-info">You'll receive a mobile money prompt on <strong id="userPhone"></strong></p>
              <div class="payment-steps">
                <p><strong>Next steps:</strong></p>
                <ol>
                  <li>Check your phone for USSD prompt</li>
                  <li>Enter your mobile money PIN</li>
                  <li>Confirm the payment amount</li>
                  <li>You'll get access to {{creatorName}}'s content!</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div class="form-step" id="step3" style="display: none;">
            <div class="error-message">
              <h3>Something went wrong</h3>
              <p id="errorText">Please try again.</p>
              <button onclick="backToStep1()" class="cta-btn">Try Again</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <main class="main-content">
    <section class="features">
      <h2>What You'll Get</h2>
      <div class="feature-grid">
        <div class="feature">
          <h3>Exclusive Content</h3>
          <p>Access to premium content only available to subscribers</p>
        </div>
        <div class="feature">
          <h3>Direct Access</h3>
          <p>Connect directly with {{creatorName}} through Clubzila</p>
        </div>
        <div class="feature">
          <h3>Premium Support</h3>
          <p>Get priority support and faster response times</p>
        </div>
      </div>
    </section>
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
</script>`;
  }

  private getModernCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.app { min-height: 100vh; display: flex; flex-direction: column; }
.navbar { background: white; padding: 1rem 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.logo { font-size: 1.5rem; font-weight: bold; color: #3b82f6; }
.hero { position: relative; padding: 4rem 2rem; flex: 1; overflow: hidden; }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
.hero-bg-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); }
.hero-content { position: relative; z-index: 2; max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.hero-image { width: 100%; max-width: 400px; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.hero-text h1 { font-size: 3rem; margin-bottom: 1rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.7); }
.hero-text p { font-size: 1.2rem; color: white; margin-bottom: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
.subscription-form { margin-top: 2rem; }
.form-step { margin-bottom: 1rem; }
.form-description { color: rgba(255,255,255,0.9); margin-bottom: 1rem; font-size: 0.9rem; }
.form-input { width: 100%; padding: 1rem; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 1rem; margin-bottom: 1rem; background: rgba(255,255,255,0.1); color: white; }
.form-input::placeholder { color: rgba(255,255,255,0.7); }
.form-input:focus { outline: none; border-color: white; background: rgba(255,255,255,0.2); }
.cta-btn { background: #3b82f6; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1.1rem; cursor: pointer; margin: 0.5rem; }
.cta-btn:hover { background: #2563eb; }
.success-message { color: #28a745; text-align: center; }
.ussd-info { background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0; color: white; }
.payment-steps { text-align: left; margin-top: 1rem; }
.payment-steps ol { margin-left: 1.5rem; }
.payment-steps li { margin: 0.5rem 0; color: rgba(255,255,255,0.9); }
.error-message { color: #dc3545; text-align: center; }
.main-content { flex: 1; padding: 4rem 2rem; background: white; }
.features h2 { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #1f2937; }
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.feature { text-align: center; padding: 2rem; }
.feature h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #3b82f6; }
.feature p { color: #6b7280; line-height: 1.6; }
.footer { background: #1f2937; color: white; text-align: center; padding: 2rem; }
.footer a { color: #3b82f6; text-decoration: none; }
.processing-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.processing-content { background: white; padding: 2rem; border-radius: 15px; text-align: center; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
.processing-spinner { width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
.processing-content h3 { color: #1f2937; margin-bottom: 0.5rem; }
.processing-content p { color: #6b7280; margin-bottom: 1.5rem; }
.processing-steps { text-align: left; }
.processing-steps .step { display: flex; align-items: center; margin: 0.5rem 0; padding: 0.5rem; border-radius: 8px; transition: all 0.3s ease; }
.processing-steps .step.active { background: #f0f9ff; color: #3b82f6; }
.processing-steps .step-icon { font-size: 1.2rem; margin-right: 0.5rem; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; }
  .hero-text h1 { font-size: 2rem; }
  .hero-text p { font-size: 1rem; }
  .features h2 { font-size: 2rem; }
  .feature-grid { grid-template-columns: 1fr; }
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
  
  // Extract pageId from URL path
  const pathParts = window.location.pathname.split('/');
  const pageId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  console.log('Subscribe data:', { pageId, phoneNumber, templateType: 'business-services' });
  
  // Make API call
  fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageId: pageId,
      phoneNumber: phoneNumber,
      templateType: 'business-services'
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
}

export const templateEngine = new TemplateEngine();
