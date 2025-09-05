'use client'

import { useState } from 'react'
import { templateEngine } from '@/lib/template-engine'
import { Palette, User, Download, CheckCircle } from 'lucide-react'

export default function Home() {
  const [step, setStep] = useState<'template' | 'customize' | 'generate'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [creatorData, setCreatorData] = useState({
    userId: '107', // Default user ID for testing
    creatorId: '1821', // Default creator ID for testing
    successRedirectUrl: ''
  })
  const [generatedUrl, setGeneratedUrl] = useState('')
  // Debug: Monitor state changes
  console.log('🔍 Component render - creatorData:', creatorData);

  const templates = templateEngine.getTemplates()
  console.log('🔍 Available templates:', templates);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Clubzila Landing Pages
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create beautiful, fast-loading landing pages for your Clubzila creator profile. 
            Choose from our templates and get a unique URL in seconds.
          </p>
          <div className="mt-6 flex space-x-4 justify-center">
            <a
              href="/demo"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              View Demo Templates
            </a>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: 'template', label: 'Choose Template', icon: Palette },
              { key: 'customize', label: 'Customize', icon: User },
              { key: 'generate', label: 'Generate', icon: Download }
            ].map((stepInfo, index) => {
              const Icon = stepInfo.icon
              const isActive = step === stepInfo.key
              const isCompleted = ['customize', 'generate'].indexOf(step) > ['customize', 'generate'].indexOf(stepInfo.key)
              
              return (
                <div key={stepInfo.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-blue-600 bg-blue-600 text-white' :
                    isCompleted ? 'border-green-600 bg-green-600 text-white' :
                    'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {stepInfo.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {/* Template Selection Step */}
          {step === 'template' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Choose Your Template
              </h2>
              
              <div className="grid gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => { 
                      console.log('🔍 Template clicked:', template.id);
                      setSelectedTemplate(template.id); 
                      setStep('customize'); 
                      console.log('🔍 Step changed to customize');
                    }}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {template.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Template ID: {template.id}
                      </span>
                      {selectedTemplate === template.id && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customization Step */}
          {step === 'customize' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Customize Your Landing Page
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); setStep('generate'); }} className="space-y-6">
                {selectedTemplate === 'modern' ? (
                  // Business template: User ID + Creator ID
                  <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                        User & Creator IDs *
                  </label>
                  <input
                    type="text"
                        defaultValue="107-1821"
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('🔍 Combined IDs onChange - value:', value);
                          const parts = value.split('-');
                          const newCreatorData = {
                            ...creatorData,
                            userId: parts[0] || '107',
                            creatorId: parts[1] || '1821'
                          };
                          console.log('🔍 Combined IDs onChange - setting new data:', newCreatorData);
                          setCreatorData(newCreatorData);
                        }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        placeholder="107-1821 (User ID-Creator ID)"
                    required
                  />
                      <p className="mt-2 text-sm text-gray-500">
                        Enter User ID and Creator ID in format: UserID-CreatorID
                      </p>
                      <p className="mt-1 text-xs text-blue-600">
                        Current: User ID: {creatorData.userId}, Creator ID: {creatorData.creatorId}
                      </p>
                </div>
                  </>
                ) : (
                  // Minimal template: Creator ID only
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Creator ID *
                  </label>
                    <input
                      type="text"
                      defaultValue="1821"
                      onChange={(e) => {
                        const value = e.target.value;
                        console.log('🔍 Creator ID onChange - value:', value);
                        const newCreatorData = {
                          ...creatorData,
                          creatorId: value
                        };
                        console.log('🔍 Creator ID onChange - setting new data:', newCreatorData);
                        setCreatorData(newCreatorData);
                      }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="1821 (Creator ID)"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter the Creator ID that users will subscribe to
                    </p>
                    <p className="mt-1 text-xs text-blue-600">
                      Current Creator ID: {creatorData.creatorId}
                    </p>
                </div>
                )}
                

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Redirect URL
                  </label>
                  <input
                    type="url"
                    value={creatorData.successRedirectUrl}
                    onChange={(e) => setCreatorData(prev => ({ ...prev, successRedirectUrl: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="https://yoursite.com/success"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Where customers go after successful payment (optional)
                  </p>
                </div>
                



                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('template')}
                    className="px-6 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Generation Step */}
          {step === 'generate' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Generate Your Landing Page
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Page Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Template:</strong> {templates.find(t => t.id === selectedTemplate)?.name}</p>
                    {selectedTemplate === 'modern' ? (
                      <>
                        <p><strong>User ID:</strong> {creatorData.userId}</p>
                        <p><strong>Creator ID:</strong> {creatorData.creatorId}</p>
                        <p><strong>Note:</strong> Business template uses manual User ID + Creator ID</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Creator ID:</strong> {creatorData.creatorId}</p>
                        <p><strong>Note:</strong> User ID will be generated dynamically from phone number</p>
                      </>
                    )}
                    <p><strong>Success Redirect:</strong> {creatorData.successRedirectUrl || 'Default'}</p>
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    console.log('🔍 Current creatorData state:', creatorData);
                    console.log('🔍 Selected template:', selectedTemplate);
                    
                    const pageId = selectedTemplate === 'modern' 
                      ? `${creatorData.userId}-${creatorData.creatorId}-${selectedTemplate}-${Date.now()}`
                      : `${creatorData.creatorId}-${selectedTemplate}-${Date.now()}`
                    const url = `${window.location.origin}/page/${pageId}`
                    setGeneratedUrl(url)
                    
                    // Store the page data for later retrieval
                    const pageData = {
                      templateId: selectedTemplate,
                      creatorId: creatorData.creatorId,
                      creatorName: creatorData.creatorId, // Use Creator ID as name
                      creatorBio: 'Welcome to my creator page!',
                      creatorImage: 'https://via.placeholder.com/150x150/667eea/ffffff?text=Creator',
                      creatorPrice: 500, // Default amount
                      creatorCurrency: 'TZS', // Default currency
                      successRedirectUrl: creatorData.successRedirectUrl,
                      failureRedirectUrl: creatorData.successRedirectUrl // Same as success redirect
                    };
                    
                    console.log('💾 Storing page data:', pageData);
                    console.log('🔍 Generated pageId:', pageId);
                    console.log('🔍 Generated URL:', url);
                    // Save to database instead of localStorage
                    try {
                      const response = await fetch('/api/landing-pages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          pageId: pageId,
                          creatorId: creatorData.creatorId,
                          title: `Landing Page - ${creatorData.creatorId}`,
                          template: selectedTemplate,
                          creatorIdDisplay: creatorData.creatorId,
                          successRedirectUrl: creatorData.successRedirectUrl,
                          failureRedirectUrl: creatorData.successRedirectUrl || '',
                          description: `${selectedTemplate} template for creator ${creatorData.creatorId}`
                        })
                      });
                      
                      if (response.ok) {
                        console.log('✅ Landing page saved to database');
                      } else {
                        console.error('❌ Failed to save to database, falling back to localStorage');
                        localStorage.setItem(`page_${pageId}`, JSON.stringify(pageData));
                      }
                    } catch (error) {
                      console.error('❌ Database save failed, falling back to localStorage:', error);
                      localStorage.setItem(`page_${pageId}`, JSON.stringify(pageData));
                    }
                    
                    // Also log what's in localStorage for debugging
                    console.log('🔍 localStorage after storing:', {
                      key: `page_${pageId}`,
                      value: localStorage.getItem(`page_${pageId}`)
                    });
                  }}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Generate Landing Page
                </button>
                
                {generatedUrl && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Success! 🎉</h3>
                    <p className="text-green-700 mb-3">
                      Your landing page has been generated successfully!
                    </p>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={generatedUrl}
                        readOnly
                        className="flex-1 px-3 py-3 border border-green-300 rounded bg-white text-green-900"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedUrl)}
                        className="px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="mt-3 flex space-x-3">
                      <a
                        href={generatedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
                      >
                        View Page
                      </a>
                      <button
                        onClick={() => setStep('template')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        Create Another
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep('customize')}
                    className="px-6 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
