import React, { useState } from 'react';
import { ContentRequest, Platform, ContentType, ContentLength } from '../types';

interface ContentFormProps {
  onSubmit: (request: ContentRequest) => void;
  loading: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<ContentRequest>({
    query: '',
    platform: 'LinkedIn',
    content_type: 'Text',
    content_length: 'Medium',
    image_prompt: '',
  });

  const platforms: Platform[] = ['LinkedIn', 'Medium', 'Facebook', 'Instagram'];
  const contentTypes: ContentType[] = ['Text', 'Article', 'Carousel', 'Image'];
  const contentLengths: ContentLength[] = ['Short', 'Medium', 'Long'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.query.trim()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Generator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Query Input */}
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Topic/Query *
          </label>
          <input
            type="text"
            id="query"
            name="query"
            value={formData.query}
            onChange={handleInputChange}
            placeholder="e.g., AI in Healthcare, Digital Marketing Trends"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        {/* Platform Selection */}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent transition-colors"
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* Content Type */}
        <div>
          <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <select
            id="content_type"
            name="content_type"
            value={formData.content_type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent transition-colors"
          >
            {contentTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Content Length */}
        <div>
          <label htmlFor="content_length" className="block text-sm font-medium text-gray-700 mb-2">
            Content Length
          </label>
          <select
            id="content_length"
            name="content_length"
            value={formData.content_length}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent transition-colors"
          >
            {contentLengths.map(length => (
              <option key={length} value={length}>
                {length} ({length === 'Short' ? '~50 words' : length === 'Medium' ? '~150 words' : '~300 words'})
              </option>
            ))}
          </select>
        </div>

        {/* Image Prompt (only show if Image is selected) */}
        {formData.content_type === 'Image' && (
          <div>
            <label htmlFor="image_prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Image Description
              <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Coming Soon
              </span>
            </label>
            <textarea
              id="image_prompt"
              name="image_prompt"
              value={formData.image_prompt}
              onChange={handleInputChange}
              placeholder="e.g., Generate an infographic about AI in healthcare showing key statistics and benefits"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500 focus:border-transparent transition-colors"
            />
            <p className="mt-2 text-sm text-gray-500">
              Describe the image you want to generate. This feature will be available soon!
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.query.trim()}
          className="w-full bg-linkedin-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-linkedin-600 focus:ring-2 focus:ring-linkedin-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Content...
            </div>
          ) : (
            'Generate Content'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContentForm;
