/**
 * Template Engine for Landing Page Generation
 */

export interface TemplateData {
  creatorId: string;
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

    // Modern Business Template
    this.addTemplate({
      id: 'modern',
      name: 'Modern Business',
      description: 'Professional business-focused design',
      html: this.getModernHTML(),
      css: this.getModernCSS(),
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

    // Replace variables with fallbacks
    html = html.replace(/\{\{creatorId\}\}/g, data.creatorId || 'Creator');
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
    <script>
        // Clubzila subscription handler
        document.addEventListener('DOMContentLoaded', function() {
            const subscribeBtn = document.querySelector('[data-clubzila-subscribe]');
            if (subscribeBtn) {
                subscribeBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    const phoneNumber = prompt('Enter your phone number:');
                    if (!phoneNumber) return;
                    
                    try {
                        this.disabled = true;
                        this.textContent = 'Processing...';
                        
                        const response = await fetch('/api/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                creatorId: '${data.creatorId}',
                                phoneNumber: phoneNumber,
                            }),
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                            alert('Subscription initiated! Check your phone for payment.');
                        } else {
                            alert('Error: ' + result.message);
                        }
                    } catch (error) {
                        alert('Error: ' + error.message);
                    } finally {
                        this.disabled = false;
                        this.textContent = 'Subscribe';
                    }
                });
            }
        });
    </script>
</body>
</html>`;
  }

  private getMinimalHTML(): string {
    return `<div class="container">
  <div class="hero-image">
    <img src="https://images.pexels.com/photos/40784/drops-of-water-water-nature-liquid-40784.jpeg?cs=srgb&dl=pexels-pixabay-40784.jpg&fm=jpg" alt="Water drops" class="hero-img">
  </div>
  
  <div class="profile">
    <img src="{{creatorImage}}" alt="{{creatorName}}" class="avatar">
    <h1>{{creatorName}}</h1>
    <p class="bio">{{creatorBio}}</p>
  </div>
  
  <div class="subscription">
    <h2>Subscribe to {{creatorName}}</h2>
    <div class="price">{{creatorPrice}} {{creatorCurrency}}/month</div>
    <button class="subscribe-btn" data-clubzila-subscribe>Subscribe Now</button>
  </div>
  
  <footer>Powered by <a href="https://clubzila.com">Clubzila</a></footer>
</div>`;
  }

  private getMinimalCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; }
.container { max-width: 600px; margin: 0 auto; padding: 0; text-align: center; }
.hero-image { width: 100%; height: 300px; overflow: hidden; border-radius: 0 0 20px 20px; }
.hero-img { width: 100%; height: 100%; object-fit: cover; }
.profile { background: white; padding: 2rem; margin: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.avatar { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 1rem; }
.bio { color: #666; margin-bottom: 1rem; }
.subscription { background: white; padding: 2rem; margin: 0 2rem 2rem 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.price { font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0; }
.subscribe-btn { background: #667eea; color: white; border: none; padding: 1rem 2rem; border-radius: 25px; font-size: 1.1rem; cursor: pointer; }
.subscribe-btn:hover { background: #5a6fd8; }
.subscribe-btn:disabled { opacity: 0.7; cursor: not-allowed; }
footer { margin: 0 2rem 2rem 2rem; color: white; }
footer a { color: white; text-decoration: none; }`;
  }

  private getModernHTML(): string {
    return `<div class="container">
  <nav class="navbar">
    <div class="logo">Clubzila</div>
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
        <button class="cta-btn" data-clubzila-subscribe>Start Subscription</button>
      </div>
    </div>
  </header>
  
  <main class="main">
    <section class="pricing">
      <h2>Monthly Subscription</h2>
      <div class="price-card">
        <div class="price">{{creatorPrice}} {{creatorCurrency}}</div>
        <ul class="features">
          <li>✓ Exclusive content</li>
          <li>✓ Direct updates</li>
          <li>✓ Community access</li>
        </ul>
        <button class="subscribe-btn" data-clubzila-subscribe>Subscribe Now</button>
      </div>
    </section>
  </main>
  
  <footer>Powered by <a href="https://clubzila.com">Clubzila</a></footer>
</div>`;
  }

  private getModernCSS(): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
.container { min-height: 100vh; display: flex; flex-direction: column; }
.navbar { background: white; padding: 1rem 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.logo { font-size: 1.5rem; font-weight: bold; color: #3b82f6; }
.hero { position: relative; padding: 4rem 2rem; flex: 1; overflow: hidden; }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
.hero-bg-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); }
.hero-content { position: relative; z-index: 2; max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.hero-image { width: 100%; max-width: 400px; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.hero-text h1 { font-size: 3rem; margin-bottom: 1rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.7); }
.hero-text p { font-size: 1.2rem; color: white; margin-bottom: 2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
.cta-btn { background: #3b82f6; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1.1rem; cursor: pointer; }
.cta-btn:hover { background: #2563eb; }
.main { flex: 1; padding: 4rem 2rem; }
.pricing { max-width: 600px; margin: 0 auto; text-align: center; }
.pricing h2 { font-size: 2.5rem; margin-bottom: 2rem; color: #1f2937; }
.price-card { background: white; padding: 3rem; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.price { font-size: 3rem; font-weight: bold; color: #3b82f6; margin-bottom: 2rem; }
.features { list-style: none; margin-bottom: 2rem; text-align: left; }
.features li { padding: 0.5rem 0; color: #6b7280; }
.subscribe-btn { background: #3b82f6; color: white; border: none; padding: 1rem 3rem; border-radius: 8px; font-size: 1.1rem; cursor: pointer; width: 100%; }
.subscribe-btn:hover { background: #2563eb; }
.subscribe-btn:disabled { opacity: 0.7; cursor: not-allowed; }
footer { background: #1f2937; color: #d1d5db; padding: 2rem; text-align: center; margin-top: auto; }
footer a { color: #3b82f6; text-decoration: none; }
@media (max-width: 768px) { .hero-content { grid-template-columns: 1fr; text-align: center; } .hero-text h1 { font-size: 2rem; } }`;
  }
}

export const templateEngine = new TemplateEngine();
