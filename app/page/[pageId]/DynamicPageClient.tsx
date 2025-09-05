'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { templateEngine } from '../../../lib/template-engine';

interface PageData {
  pageId: string;
  template: 'minimal' | 'modern' | 'creative' | 'professional';
  creatorName: string;
  creatorIdDisplay: string; // What users see/enter
  successRedirectUrl: string; // Where users go after payment
  failureRedirectUrl: string; // Where users go if payment fails
  subscriptionAmount: number;
  currency: string;
}

export default function DynamicPageClient() {
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

  const fetchPageData = async (pageId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages?pageId=${pageId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📄 Received page data:', data);
      setPageData(data);
    } catch (err) {
      console.error('Error fetching page data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (phoneNumber: string) => {
    if (!pageData) return;
    
    setSubscriptionStatus('processing');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: pageData.pageId,
          phoneNumber: phoneNumber,
          templateType: pageData.template,
          userId: pageData.creatorIdDisplay,
          creatorId: pageData.creatorIdDisplay,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubscriptionStatus('success');
      } else {
        setSubscriptionStatus('error');
        console.error('Subscription failed:', result.message);
      }
    } catch (err) {
      setSubscriptionStatus('error');
      console.error('Subscription error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => fetchPageData(pageId)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  // Generate the actual HTML content using the template engine
  const html = templateEngine.generatePage(pageData.template, {
    creatorId: pageData.creatorIdDisplay,
    creatorName: pageData.creatorName,
    creatorPrice: pageData.subscriptionAmount,
    creatorCurrency: pageData.currency
  });

  return (
    <div className="min-h-screen">
      {/* Landing Page Content */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
