'use client';

import { useState } from 'react';

export default function TestTemplatesPage() {
  const [testResults, setTestResults] = useState<any[]>([]);

  const testMinimalTemplate = async () => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: '1821-minimal-test',
          phoneNumber: '0754546567',
          templateType: 'minimal'
        })
      });
      
      const result = await response.json();
      setTestResults(prev => [...prev, {
        template: 'Minimal',
        success: result.success,
        message: result.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        template: 'Minimal',
        success: false,
        message: 'Test failed',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const testBusinessTemplate = async () => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: '1821-business-test',
          userId: '19260',
          creatorId: '1821',
          phoneNumber: '0754546567',
          templateType: 'business'
        })
      });
      
      const result = await response.json();
      setTestResults(prev => [...prev, {
        template: 'Business',
        success: result.success,
        message: result.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        template: 'Business',
        success: false,
        message: 'Test failed',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Template Testing Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Minimal Template</h2>
            <p className="text-gray-600 mb-4">
              Uses dynamic user signup flow - only requires phone number
            </p>
            <button
              onClick={testMinimalTemplate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Minimal Template
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Business Template</h2>
            <p className="text-gray-600 mb-4">
              Uses manual User ID + Creator ID flow - requires all fields
            </p>
            <button
              onClick={testBusinessTemplate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Business Template
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{result.template} Template</span>
                    <span className="text-sm">{result.timestamp}</span>
                  </div>
                  <p className="text-sm mt-1">{result.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
