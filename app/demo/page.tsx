export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo Landing Pages
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Preview the available templates and see how your landing page will look.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Minimal Template Demo */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Minimal Creator Template</h3>
              <p className="text-gray-600 mb-4">Clean, simple design focused on content</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
              <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">John Doe</h2>
              <p className="text-blue-100 mb-4">Digital creator and content specialist</p>
              <div className="text-white text-3xl font-bold mb-4">$9.99 USD/month</div>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Subscribe Now
              </button>
            </div>
            <div className="p-6 bg-gray-50">
              <p className="text-sm text-gray-600 text-center">Powered by Clubzila</p>
            </div>
          </div>

          {/* Modern Template Demo */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Modern Business Template</h3>
              <p className="text-gray-600 mb-4">Professional business-focused design</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Sarah Johnson</h2>
                  <p className="text-gray-600 mb-6">Business consultant and strategy expert</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Start Subscription
                  </button>
                </div>
                <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$19.99</div>
                <div className="text-gray-600">USD/month</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Your Own Landing Page
          </a>
        </div>
      </div>
    </div>
  )
}





