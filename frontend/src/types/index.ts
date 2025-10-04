export interface ContentRequest {
  query: string;
  platform: string;
  content_type: string;
  content_length: string;
  image_prompt?: string;
}

export interface ContentResponse {
  content: string;
  hashtags: string[];
  seo_keywords: string[];
  carousel_slides?: string[];
  image_prompt?: string;
  optimal_posting_times: string[];
}

export interface GeneratedContent {
  content: string;
  hashtags: string[];
  seo_keywords: string[];
  carousel_slides?: string[];
  image_prompt?: string;
  optimal_posting_times: string[];
  approved: boolean;
}

export type Platform = 'LinkedIn' | 'Medium' | 'Facebook' | 'Instagram';
export type ContentType = 'Text' | 'Article' | 'Carousel' | 'Image';
export type ContentLength = 'Short' | 'Medium' | 'Long';
