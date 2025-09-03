import { templateEngine } from '@/lib/template-engine'

interface PageData {
  templateId: string
  creatorId: string
  creatorName: string // Required since we always provide it
  creatorBio?: string
  creatorImage?: string
  creatorPrice?: number
  creatorCurrency?: string
}

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  // Return an empty array since we don't know all possible pageIds in advance
  // This allows the page to be generated dynamically at runtime
  return []
}

export default function LandingPage({ params }: { params: { pageId: string } }) {
  // Parse the pageId to extract template and creator info
  const parts = params.pageId.split('-')
  let pageData: PageData | null = null
  
  if (parts.length >= 3) {
    // Find the template ID by looking for known template names
    const knownTemplates = ['minimal', 'modern']
    let templateId = ''
    let creatorId = ''
    
    // Look for a known template in the parts
    for (let i = 0; i < parts.length - 1; i++) {
      if (knownTemplates.includes(parts[i])) {
        templateId = parts[i]
        // Everything before the template is the creator ID
        creatorId = parts.slice(0, i).join('-')
        break
      }
    }
    
    // If no template found, try the original logic as fallback
    if (!templateId && parts.length >= 3) {
      creatorId = parts[0]
      templateId = parts[1]
    }
    
    if (templateId && creatorId) {
      pageData = {
        templateId,
        creatorId,
        creatorName: creatorId, // This is always a string since creatorId is required
        creatorBio: 'Welcome to my creator page!',
        creatorImage: 'https://via.placeholder.com/150x150/667eea/ffffff?text=Creator',
        creatorPrice: 0,
        creatorCurrency: 'TZS'
      }
    }
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested landing page could not be found.</p>
        </div>
      </div>
    )
  }

  // Generate the actual HTML content using the template engine
  const html = templateEngine.generatePage(pageData.templateId, pageData)

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: html }}
      className="landing-page"
    />
  )
}
