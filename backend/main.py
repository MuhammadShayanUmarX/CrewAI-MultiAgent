from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
import openai
import requests
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = FastAPI(title="LinkedIn Content Generator", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ContentRequest(BaseModel):
    query: str
    platform: str = "LinkedIn"
    content_type: str  # Text, Article, Carousel, Image
    content_length: str  # Short, Medium, Long
    image_prompt: Optional[str] = None

class ContentResponse(BaseModel):
    content: str
    hashtags: List[str]
    seo_keywords: List[str]
    carousel_slides: Optional[List[str]] = None
    image_prompt: Optional[str] = None
    optimal_posting_times: List[str]

class SEOOptimizer:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
    
    def generate_seo_keywords(self, query: str, platform: str) -> List[str]:
        """Generate SEO-optimized keywords for the given query"""
        try:
            if not self.openai_api_key:
                # Enhanced fallback keywords based on common LinkedIn patterns
                base_keywords = [
                    query.lower(),
                    f"{query.lower()} tips",
                    f"{query.lower()} trends", 
                    f"{query.lower()} insights",
                    "professional development",
                    "industry trends",
                    "business strategy"
                ]
                return base_keywords[:7]
            
            prompt = f"""
            Generate 7 SEO-optimized keywords for a {platform} post about "{query}".
            Focus on:
            - Professional and industry-specific terms
            - Trending and searchable keywords
            - LinkedIn-friendly hashtag potential
            - Business and career-focused terms
            
            Return only the keywords separated by commas, no hashtags.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=120,
                temperature=0.7
            )
            
            keywords = response.choices[0].message.content.strip().split(', ')
            # Clean and validate keywords
            clean_keywords = []
            for keyword in keywords:
                keyword = keyword.strip().lower()
                if keyword and not keyword.startswith('#'):
                    clean_keywords.append(keyword)
            
            return clean_keywords[:7] if clean_keywords else [query.lower(), "professional", "industry"]
        except Exception as e:
            print(f"Error generating SEO keywords: {e}")
            # Better fallback based on query analysis
            words = query.lower().split()
            fallback_keywords = [
                query.lower(),
                f"{words[0]} trends" if words else "trends",
                f"{words[0]} tips" if words else "tips", 
                "professional development",
                "industry insights"
            ]
            return fallback_keywords[:5]

class HashtagGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
    
    def generate_hashtags(self, query: str, platform: str) -> List[str]:
        """Generate relevant and trending hashtags using OpenAI"""
        try:
            if not self.openai_api_key:
                # Enhanced fallback hashtags based on LinkedIn best practices
                query_clean = query.replace(' ', '').lower()
                words = query.lower().split()
                
                base_hashtags = [
                    f"#{query_clean}",
                    "#LinkedIn",
                    "#Professional", 
                    "#CareerGrowth",
                    "#BusinessTips",
                    "#Industry",
                    "#Innovation",
                    "#Leadership"
                ]
                
                # Add word-specific hashtags
                if words:
                    for word in words[:2]:  # Take first 2 words
                        if len(word) > 3:  # Only meaningful words
                            base_hashtags.append(f"#{word.capitalize()}")
                
                return base_hashtags[:10]
            
            prompt = f"""
            Generate 10-12 relevant LinkedIn hashtags for a post about "{query}".
            
            Include a mix of:
            - Specific hashtags related to "{query}"
            - Popular LinkedIn professional hashtags
            - Industry and business hashtags
            - Career and growth hashtags
            
            Rules:
            - All hashtags must start with #
            - Use CamelCase for multi-word hashtags
            - Focus on LinkedIn-popular hashtags
            - No spaces in hashtags
            
            Return only hashtags separated by commas.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=180,
                temperature=0.7
            )
            
            hashtags = response.choices[0].message.content.strip().split(', ')
            # Clean and validate hashtags
            clean_hashtags = []
            for tag in hashtags:
                tag = tag.strip()
                if tag.startswith('#') and len(tag) > 1 and ' ' not in tag:
                    clean_hashtags.append(tag)
            
            # Ensure we have at least some hashtags
            if len(clean_hashtags) < 5:
                fallback = [f"#{query.replace(' ', '')}", "#LinkedIn", "#Professional", "#Business", "#Growth"]
                clean_hashtags.extend(fallback)
            
            return clean_hashtags[:12]
        except Exception as e:
            print(f"Error generating hashtags: {e}")
            # Better fallback with query analysis
            query_clean = query.replace(' ', '').lower()
            words = query.lower().split()
            
            fallback_hashtags = [
                f"#{query_clean}",
                "#LinkedIn", 
                "#Professional", 
                "#Business",
                "#CareerTips"
            ]
            
            # Add specific word hashtags
            for word in words[:2]:
                if len(word) > 3:
                    fallback_hashtags.append(f"#{word.capitalize()}")
            
            return fallback_hashtags[:8]

class ContentGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
        self.seo_optimizer = SEOOptimizer()
        self.hashtag_generator = HashtagGenerator()
    
    def get_content_length_words(self, length: str) -> int:
        """Get word count based on content length"""
        length_mapping = {
            "Short": 50,
            "Medium": 150,
            "Long": 300
        }
        return length_mapping.get(length, 150)
    
    def generate_content(self, query: str, platform: str, content_type: str, content_length: str) -> str:
        """Generate SEO-optimized content"""
        try:
            if not self.openai_api_key:
                # Fallback content
                return f"Exploring {query}: Key insights and trends in the industry. This topic is gaining significant attention and offers valuable opportunities for professionals."
            
            word_count = self.get_content_length_words(content_length)
            
            if content_type.lower() == "article":
                prompt = f"""
                Write a professional {platform} article about "{query}".
                Length: approximately {word_count} words.
                
                Requirements:
                - SEO-optimized content
                - Professional tone
                - Engaging and informative
                - Include key insights and actionable tips
                - Structure with clear paragraphs
                - End with a call-to-action or question for engagement
                """
            else:
                prompt = f"""
                Write a professional {platform} post about "{query}".
                Length: approximately {word_count} words.
                
                Requirements:
                - SEO-optimized content
                - Engaging and professional tone
                - Include key insights or tips
                - End with a question or call-to-action for engagement
                - Format suitable for social media
                """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=word_count * 2,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating content: {e}")
            return f"Exploring {query}: Key insights and trends that professionals should know about. This topic offers valuable opportunities for growth and innovation in the industry."
    
    def generate_carousel_slides(self, content: str, query: str) -> List[str]:
        """Split content into carousel slides"""
        try:
            if not self.openai_api_key:
                # Simple fallback splitting
                sentences = content.split('. ')
                slides = []
                current_slide = ""
                
                for sentence in sentences:
                    if len(current_slide + sentence) < 200:
                        current_slide += sentence + ". "
                    else:
                        if current_slide:
                            slides.append(current_slide.strip())
                        current_slide = sentence + ". "
                
                if current_slide:
                    slides.append(current_slide.strip())
                
                return slides[:10]  # Max 10 slides
            
            prompt = f"""
            Convert the following content about "{query}" into 5-8 carousel slides for LinkedIn.
            Each slide should:
            - Be concise (max 150 characters)
            - Have a clear point or tip
            - Be engaging and professional
            - Work as standalone content
            
            Content: {content}
            
            Return each slide on a new line, numbered (1., 2., etc.)
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            
            slides_text = response.choices[0].message.content.strip()
            slides = []
            
            for line in slides_text.split('\n'):
                line = line.strip()
                if line and (line[0].isdigit() or line.startswith('•')):
                    # Remove numbering
                    slide_content = line.split('.', 1)[-1].strip()
                    if slide_content:
                        slides.append(slide_content)
            
            return slides[:8]  # Max 8 slides
        except Exception as e:
            print(f"Error generating carousel slides: {e}")
            # Fallback: simple content splitting
            sentences = content.split('. ')
            return sentences[:5]

class LinkedInAPI:
    def __init__(self):
        self.client_id = os.getenv("LINKEDIN_CLIENT_ID")
        self.client_secret = os.getenv("LINKEDIN_CLIENT_SECRET") 
        self.access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
        self.is_configured = all([self.client_id, self.client_secret, self.access_token])
    
    def post_content(self, content: str, hashtags: List[str]) -> dict:
        """Post content to LinkedIn (Coming Soon)"""
        if not self.is_configured:
            return {
                "success": False,
                "message": "LinkedIn API not configured. Please add your LinkedIn API credentials to .env file.",
                "status": "coming_soon"
            }
        
        # TODO: Implement actual LinkedIn API posting
        # This will be implemented when LinkedIn API integration is ready
        return {
            "success": False,
            "message": "LinkedIn API integration is coming soon! For now, please copy and post manually.",
            "status": "coming_soon"
        }

# Initialize generators
content_generator = ContentGenerator()
linkedin_api = LinkedInAPI()

@app.get("/")
async def root():
    return {
        "message": "LinkedIn Content Generator API",
        "version": "1.0.0",
        "features": {
            "content_generation": "✅ Available",
            "seo_optimization": "✅ Available", 
            "hashtag_generation": "✅ Available",
            "carousel_support": "✅ Available",
            "linkedin_posting": "🔄 Coming Soon",
            "image_generation": "🔄 Coming Soon",
            "auto_scheduling": "🔄 Coming Soon"
        }
    }

@app.post("/generate-content", response_model=ContentResponse)
async def generate_content(request: ContentRequest):
    try:
        # Generate main content
        content = content_generator.generate_content(
            request.query, 
            request.platform, 
            request.content_type, 
            request.content_length
        )
        
        # Generate SEO keywords
        seo_keywords = content_generator.seo_optimizer.generate_seo_keywords(
            request.query, 
            request.platform
        )
        
        # Generate hashtags
        hashtags = content_generator.hashtag_generator.generate_hashtags(
            request.query, 
            request.platform
        )
        
        # Generate carousel slides if needed
        carousel_slides = None
        if request.content_type.lower() == "carousel":
            carousel_slides = content_generator.generate_carousel_slides(content, request.query)
        
        # Optimal posting times for LinkedIn (based on research)
        optimal_posting_times = [
            "Tuesday 10:00 AM",
            "Wednesday 11:00 AM", 
            "Thursday 1:00 PM",
            "Tuesday 2:00 PM",
            "Wednesday 3:00 PM"
        ]
        
        return ContentResponse(
            content=content,
            hashtags=hashtags,
            seo_keywords=seo_keywords,
            carousel_slides=carousel_slides,
            image_prompt=request.image_prompt,
            optimal_posting_times=optimal_posting_times
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@app.post("/post-to-linkedin")
async def post_to_linkedin(content: str, hashtags: List[str] = []):
    """Post content to LinkedIn (Coming Soon)"""
    try:
        result = linkedin_api.post_content(content, hashtags)
        return result
    except Exception as e:
        return {
            "success": False,
            "message": f"Error posting to LinkedIn: {str(e)}",
            "status": "error"
        }

@app.get("/linkedin-status")
async def linkedin_status():
    """Check LinkedIn API configuration status"""
    return {
        "configured": linkedin_api.is_configured,
        "status": "ready" if linkedin_api.is_configured else "not_configured",
        "message": "LinkedIn API is configured and ready" if linkedin_api.is_configured else "LinkedIn API credentials not found in .env file"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "linkedin_configured": linkedin_api.is_configured
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
