import axios from 'axios';
import { ContentRequest, ContentResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentService = {
  generateContent: async (request: ContentRequest): Promise<ContentResponse> => {
    try {
      const response = await api.post<ContentResponse>('/generate-content', request);
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  },

  postToLinkedIn: async (content: string, hashtags: string[]): Promise<{ success: boolean; message: string; status: string }> => {
    try {
      const response = await api.post('/post-to-linkedin', { content, hashtags });
      return response.data;
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
      throw new Error('Failed to post to LinkedIn. Please try again.');
    }
  },

  getLinkedInStatus: async (): Promise<{ configured: boolean; status: string; message: string }> => {
    try {
      const response = await api.get('/linkedin-status');
      return response.data;
    } catch (error) {
      console.error('Error checking LinkedIn status:', error);
      return { configured: false, status: 'error', message: 'Could not check LinkedIn status' };
    }
  },

  healthCheck: async (): Promise<{ status: string; timestamp: string; openai_configured: boolean; linkedin_configured: boolean }> => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('API is not available');
    }
  },
};

export default api;
