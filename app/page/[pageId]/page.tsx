'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { templateEngine } from '../../../lib/template-engine';

interface PageData {
  pageId: string;
  template: 'minimal' | 'modern-business' | 'creative' | 'professional';
  creatorName: string;
  creatorIdDisplay: string; // What users see/enter
  authorId: string; // Author ID for Clubzila API calls
  successRedirectUrl: string; // Where users go after payment
  failureRedirectUrl: string; // Where users go if payment fails
  subscriptionAmount: number;
  currency: string;
}

export default function DynamicPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (pageId) {
      fetchPageData(pageId);
    }
  }, [pageId]);

  useEffect(() => {
    if (pageData) {
      // Add event listeners to subscription buttons after HTML is rendered
      const addSubscriptionHandlers = () => {
        const subscribeButtons = document.querySelectorAll('button[onclick*="subscribe"], .subscribe-btn, .cta-btn');
        
        subscribeButtons.forEach(button => {
          button.removeAttribute('onclick'); // Remove the onclick attribute
          button.addEventListener('click', handleSubscriptionClick);
        });
      };

      // Wait for HTML to be rendered, then add handlers
      setTimeout(addSubscriptionHandlers, 100);
    }
  }, [pageData]);

  const handleSubscriptionClick = async () => {
    const phoneInput = document.querySelector('#phoneNumber') as HTMLInputElement;
    if (!phoneInput) {
      setError('Phone number input not found');
      setSubscriptionStatus('error');
      return;
    }

    const phoneNumber = phoneInput.value.trim();
    if (!phoneNumber) {
      setError('Please enter your mobile money phone number');
      setSubscriptionStatus('error');
      return;
    }

    await handleSubscription(phoneNumber);
  };

  const fetchPageData = async (id: string) => {
    try {
      console.log('🔍 Fetching page data for ID:', id);
      
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        console.log('⚠️ Running on server side, using fallback data');
        const fallbackData: PageData = {
          pageId: id,
          template: 'minimal',
          creatorName: 'Demo Creator',
          creatorIdDisplay: 'DEMO001',
          authorId: '107',
          successRedirectUrl: '',
          failureRedirectUrl: '',
          subscriptionAmount: 500,
          currency: 'TZS'
        };
        setPageData(fallbackData);
        setLoading(false);
        return;
      }
      
      // Try to get page data from localStorage (this is where the data is stored during page creation)
      const storedData = localStorage.getItem(`page_${id}`);
      console.log('📋 localStorage key:', `page_${id}`);
      console.log('📋 Stored data found:', !!storedData);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('📋 Found stored page data:', parsedData);
        
        // Map template ID to the correct template type
        let templateType: 'minimal' | 'modern-business' | 'creative' | 'professional';
        switch (parsedData.templateId) {
          case 'minimal':
            templateType = 'minimal';
            break;
          case 'modern':
            templateType = 'modern-business';
            break;
          default:
            templateType = 'minimal'; // fallback
        }
        
        const pageData: PageData = {
          pageId: id,
          template: templateType,
          creatorName: parsedData.creatorName || 'Creator',
          creatorIdDisplay: parsedData.creatorId, // Use the actual creator ID from storage
          authorId: parsedData.authorId || '107', // Use stored author ID or fallback
          successRedirectUrl: parsedData.successRedirectUrl || '',
          failureRedirectUrl: parsedData.failureRedirectUrl || '',
          subscriptionAmount: parsedData.creatorPrice || 500,
          currency: parsedData.creatorCurrency || 'TZS'
        };
        
        console.log('📋 Processed page data:', pageData);
        setPageData(pageData);
        setLoading(false);
      } else {
        // Fallback to extracting data from URL if nothing is stored
        console.log('⚠️ No stored data found for page:', id);
        console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
        
        // Try to extract userId and creatorId from the URL
        // Format: userId-creatorId-template-timestamp
        const urlParts = id.split('-');
        let extractedUserId = 'DEMO001';
        let extractedCreatorId = '107';
        
        if (urlParts.length >= 2) {
          extractedUserId = urlParts[0]; // First part is user ID (who is subscribing)
          extractedCreatorId = urlParts[1]; // Second part is creator ID (who they're subscribing to)
          console.log('🔍 Extracted from URL:', { userId: extractedUserId, creatorId: extractedCreatorId });
        }
        
        const mockPageData: PageData = {
          pageId: id,
          template: 'minimal',
          creatorName: extractedCreatorId, // Use creator ID as the name
          creatorIdDisplay: extractedCreatorId,
          authorId: extractedUserId, // Store user ID in authorId field for compatibility
          successRedirectUrl: '',
          failureRedirectUrl: '',
          subscriptionAmount: 500,
          currency: 'TZS'
        };
        
        setPageData(mockPageData);
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Error fetching page data:', err);
      setError('Failed to load page data');
      setLoading(false);
    }
  };

  const handleSubscription = async (phoneNumber: string, userName?: string) => {
    try {
      setSubscriptionStatus('processing');

      // No need to ask for creator ID - it's already built into the page
      // No need to ask for price - subscription API handles it
      // Just use the phone number from the existing landing page field

      // Process subscription with built-in creator data
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: pageData?.pageId,
          phoneNumber,
          userName
          // creatorId, authorId and amount are extracted from the URL
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscriptionStatus('success');
        
        // Redirect to success URL after a short delay
        setTimeout(() => {
          if (pageData?.successRedirectUrl) {
            window.location.href = pageData.successRedirectUrl;
          }
        }, 2000);
        
      } else {
        setSubscriptionStatus('error');
        setError(result.message || 'Subscription failed');
        
        // Redirect to failure URL after a short delay
        setTimeout(() => {
          if (pageData?.failureRedirectUrl) {
            window.location.href = pageData.failureRedirectUrl;
          }
        }, 3000);
      }

    } catch (err) {
      setSubscriptionStatus('error');
      setError('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading landing page...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
          <p className="text-gray-600">{error || 'The requested page could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  // Generate the actual HTML content using the template engine
  const html = templateEngine.generatePage(pageData.template, {
    creatorId: pageData.creatorIdDisplay,
    authorId: pageData.authorId,
    creatorName: pageData.creatorName,
    creatorPrice: pageData.subscriptionAmount,
    creatorCurrency: pageData.currency
  });

  return (
    <div className="min-h-screen">
      {/* Success/Error Messages */}
      {subscriptionStatus === 'success' && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <strong>Success!</strong> Subscription processed. Redirecting...
        </div>
      )}

      {subscriptionStatus === 'error' && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Landing Page Content */}
      <div dangerouslySetInnerHTML={{ __html: html }} />

      {/* Subscription Status Messages */}
      {subscriptionStatus === 'success' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Subscription Initiated!</h3>
            <p className="text-gray-600 mb-6">
              Check your phone for a USSD prompt to complete the payment.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-800 font-medium mb-2">Next steps:</p>
              <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                <li>Check your phone for USSD prompt</li>
                <li>Enter your mobile money PIN</li>
                <li>Confirm the payment amount</li>
                <li>You'll get access to {pageData?.creatorName}'s content!</li>
              </ol>
            </div>
            <button
              onClick={() => setSubscriptionStatus('idle')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {subscriptionStatus === 'error' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => setSubscriptionStatus('idle')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
