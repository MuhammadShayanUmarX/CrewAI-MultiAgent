import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ContentForm from './components/ContentForm';
import ContentPreview from './components/ContentPreview';
import LoadingSpinner from './components/LoadingSpinner';
import { ContentRequest, GeneratedContent } from './types';
import { contentService } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [linkedInConfigured, setLinkedInConfigured] = useState(false);

  useEffect(() => {
    // Check API health on component mount
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await contentService.healthCheck();
      setApiStatus('online');
      setLinkedInConfigured(health.linkedin_configured || false);
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const handleContentGeneration = async (request: ContentRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await contentService.generateContent(request);
      
      const content: GeneratedContent = {
        ...response,
        approved: false,
      };
      
      setGeneratedContent(content);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContentApproval = () => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        approved: true,
      });
      
      // Here you could save to localStorage, send to backend, etc.
      console.log('Content approved:', generatedContent);
    }
  };

  const handleContentEdit = (editedContent: string) => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        content: editedContent,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Status Banner */}
        {apiStatus === 'offline' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
              <p className="text-red-700">
                API is currently offline. Please check your backend server and try again.
              </p>
              <button
                onClick={checkApiHealth}
                className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <ContentForm 
              onSubmit={handleContentGeneration} 
              loading={loading}
            />
            
            {/* Features Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">SEO-Optimized Content Generation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Trending Hashtag Suggestions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Carousel Content Splitting</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Image Generation (Coming Soon)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Auto Scheduling (Coming Soon)</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${linkedInConfigured ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-gray-700">
                    LinkedIn API Integration {linkedInConfigured ? '(Configured)' : '(Coming Soon)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div>
            {loading && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <LoadingSpinner message="Generating your content..." />
              </div>
            )}

            {!loading && generatedContent && (
              <ContentPreview
                content={generatedContent}
                onApprove={handleContentApproval}
                onEdit={handleContentEdit}
              />
            )}

            {!loading && !generatedContent && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Generate Content</h3>
                <p className="text-gray-500">
                  Fill out the form on the left to generate SEO-optimized content with trending hashtags for your LinkedIn posts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {generatedContent?.approved && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Content Approved!</h3>
            <p className="text-green-700">
              Your content is ready to post. Copy it from the preview above and share it on LinkedIn.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>LinkedIn Content Generator - Powered by AI for Professional Social Media</p>
            <p className="mt-1">© 2024 XtarzLab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
