'use client';

import { useState, useEffect } from 'react';

export default function TestDebugPage() {
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [testPageId, setTestPageId] = useState('108-minimal-test');

  useEffect(() => {
    // Check what's in localStorage
    const keys = Object.keys(localStorage);
    const pageKeys = keys.filter(key => key.startsWith('page_'));
    
    console.log('🔍 All localStorage keys:', keys);
    console.log('🔍 Page keys:', pageKeys);
    
    // Try to get data for a specific page
    const testData = localStorage.getItem(`page_${testPageId}`);
    console.log('🔍 Test page data:', testData);
    
    if (testData) {
      try {
        const parsed = JSON.parse(testData);
        setLocalStorageData(parsed);
        console.log('🔍 Parsed test data:', parsed);
      } catch (e) {
        console.error('❌ Error parsing test data:', e);
      }
    }
  }, [testPageId]);

  const createTestPage = () => {
    const pageId = `${testPageId}-${Date.now()}`;
    const testData = {
      templateId: 'minimal',
      creatorId: testPageId.split('-')[0], // Extract creator ID from testPageId
      creatorName: 'Test Creator',
      creatorPrice: 500,
      creatorCurrency: 'TZS'
    };
    
    console.log('💾 Creating test page:', pageId, testData);
    localStorage.setItem(`page_${pageId}`, JSON.stringify(testData));
    
    // Verify it was stored
    const stored = localStorage.getItem(`page_${pageId}`);
    console.log('💾 Stored data verification:', stored);
    
    alert(`Test page created with ID: ${pageId}\nCheck console for details.`);
  };

  const clearAllPages = () => {
    const keys = Object.keys(localStorage);
    const pageKeys = keys.filter(key => key.startsWith('page_'));
    
    pageKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ Removed:', key);
    });
    
    alert(`Cleared ${pageKeys.length} page entries.\nCheck console for details.`);
    setLocalStorageData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Landing Page System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Page ID:</label>
                <input
                  type="text"
                  value={testPageId}
                  onChange={(e) => setTestPageId(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="108-minimal-test"
                />
              </div>
              
              <button
                onClick={createTestPage}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Create Test Page
              </button>
              
              <button
                onClick={clearAllPages}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Clear All Pages
              </button>
            </div>
          </div>
          
          {/* Debug Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">LocalStorage Keys:</h3>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  {Object.keys(localStorage).filter(key => key.startsWith('page_')).length} page entries found
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Test Page Data:</h3>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  {localStorageData ? (
                    <pre>{JSON.stringify(localStorageData, null, 2)}</pre>
                  ) : (
                    'No test page data found'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Open browser console (F12 → Console)</li>
            <li>Click "Create Test Page" to create a test landing page</li>
            <li>Check console logs for data flow</li>
            <li>Try accessing the generated page URL</li>
            <li>Report any errors you see in console</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
