import React, { useState, useEffect } from 'react';
import { GeneratedContent } from '../types';
import { contentService } from '../services/api';

interface ContentPreviewProps {
  content: GeneratedContent;
  onApprove: () => void;
  onEdit: (editedContent: string) => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content, onApprove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(content.content);
  const [activeTab, setActiveTab] = useState<'content' | 'carousel'>('content');
  const [linkedInStatus, setLinkedInStatus] = useState<{ configured: boolean; message: string } | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleSaveEdit = () => {
    onEdit(editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(content.content);
    setIsEditing(false);
  };

  useEffect(() => {
    // Check LinkedIn API status when component mounts
    const checkLinkedInStatus = async () => {
      try {
        const status = await contentService.getLinkedInStatus();
        setLinkedInStatus(status);
      } catch (error) {
        console.error('Error checking LinkedIn status:', error);
      }
    };

    checkLinkedInStatus();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleLinkedInPost = async () => {
    setIsPosting(true);
    try {
      const result = await contentService.postToLinkedIn(content.content, content.hashtags);
      
      if (result.success) {
        alert('Successfully posted to LinkedIn!');
      } else {
        alert(result.message || 'LinkedIn posting is coming soon! Please copy and post manually.');
      }
    } catch (error) {
      alert('LinkedIn API integration is coming soon! For now, please copy the content and post manually.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Content Preview</h2>
        <div className="flex space-x-2">
          {content.carousel_slides && (
            <>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'bg-linkedin-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Single Post
              </button>
              <button
                onClick={() => setActiveTab('carousel')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'carousel'
                    ? 'bg-linkedin-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Carousel ({content.carousel_slides.length} slides)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      {activeTab === 'content' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Main Content</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(content.content)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1 text-sm bg-linkedin-100 text-linkedin-700 rounded hover:bg-linkedin-200 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-800 whitespace-pre-wrap">{content.content}</p>
            </div>
          )}
        </div>
      )}

      {/* Carousel Section */}
      {activeTab === 'carousel' && content.carousel_slides && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Carousel Slides</h3>
            <button
              onClick={() => copyToClipboard(content.carousel_slides!.join('\n\n---\n\n'))}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Copy All Slides
            </button>
          </div>

          <div className="grid gap-4">
            {content.carousel_slides.map((slide, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Slide {index + 1}</span>
                  <button
                    onClick={() => copyToClipboard(slide)}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-gray-800">{slide}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Prompt Section */}
      {content.image_prompt && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Image Prompt
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Coming Soon
            </span>
          </h3>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-gray-800">{content.image_prompt}</p>
            <p className="text-sm text-yellow-700 mt-2">
              Image generation feature will be available soon!
            </p>
          </div>
        </div>
      )}

      {/* Hashtags Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Hashtags</h3>
          <button
            onClick={() => copyToClipboard(content.hashtags.join(' '))}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Copy All
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((hashtag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-linkedin-100 text-linkedin-700 rounded-full text-sm cursor-pointer hover:bg-linkedin-200 transition-colors"
              onClick={() => copyToClipboard(hashtag)}
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>

      {/* SEO Keywords Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">SEO Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {content.seo_keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Optimal Posting Times */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Optimal Posting Times
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            Scheduling Coming Soon
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {content.optimal_posting_times.map((time, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm text-center"
            >
              {time}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onApprove}
          className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          ✓ Approve Content
        </button>
        
        <button
          className="flex-1 bg-linkedin-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-linkedin-600 focus:ring-2 focus:ring-linkedin-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLinkedInPost}
          disabled={isPosting}
        >
          {isPosting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Posting...
            </div>
          ) : (
            <>
              📤 Post to LinkedIn
              {linkedInStatus?.configured ? (
                <span className="ml-2 text-xs opacity-75">(Ready)</span>
              ) : (
                <span className="ml-2 text-xs opacity-75">(Coming Soon)</span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Manual Posting Instructions */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Manual Posting Instructions:</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Copy the content and hashtags above</li>
          <li>2. Go to LinkedIn and create a new post</li>
          <li>3. Paste the content and add the hashtags</li>
          <li>4. Consider posting at one of the optimal times suggested</li>
        </ol>
      </div>
    </div>
  );
};

export default ContentPreview;
