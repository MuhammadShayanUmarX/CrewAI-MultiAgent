# LinkedIn Content Generator

A dynamic multi-agent system for automating LinkedIn social media content creation using AI. Generate SEO-optimized content, trending hashtags, and carousel posts with ease.

## 🚀 Features

### ✅ Current Features
- **AI-Powered Content Generation**: Create engaging, SEO-optimized content for LinkedIn
- **Multiple Content Types**: Support for Text, Article, Carousel, and Image posts
- **Content Length Options**: Short (~50 words), Medium (~150 words), Long (~300 words)
- **Trending Hashtags**: Automatically generate relevant and trending hashtags
- **SEO Optimization**: Built-in SEO keyword optimization for better reach
- **Carousel Splitting**: Automatically split content into engaging carousel slides
- **Content Preview & Editing**: Preview and edit generated content before posting
- **Optimal Posting Times**: Get suggestions for the best times to post on LinkedIn

### 🔄 Coming Soon
- **Image Generation**: AI-powered image and infographic creation
- **Auto Scheduling**: Automatic posting at optimal times
- **LinkedIn API Integration**: Direct posting to LinkedIn
- **Multi-Platform Support**: Extended support for Medium, Facebook, Instagram

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.8+**: Core programming language
- **OpenAI GPT**: AI content generation
- **Pydantic**: Data validation and settings management

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication

## 📦 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   # Copy the template and add your API keys
   cp ../env_template.txt .env
   ```
   
   Edit `.env` file and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   # Add other API keys as needed
   ```

5. **Start the backend server:**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:3000`

## 🔧 Configuration

### Required API Keys

1. **OpenAI API Key** (Required)
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key in your dashboard
   - Add to `.env` file as `OPENAI_API_KEY`

2. **LinkedIn API** (Coming Soon)
   - Will be required for direct posting functionality
   - Currently in development

### Optional API Keys

- **Google API Key**: For enhanced SEO optimization
- **SEMrush API**: For advanced keyword research
- **Hashtag APIs**: For trending hashtag data

## 📖 Usage

### Basic Workflow

1. **Enter Your Topic**: Input a topic or query (e.g., "AI in Healthcare")

2. **Select Platform**: Choose your target platform (currently optimized for LinkedIn)

3. **Choose Content Type**:
   - **Text**: Standard social media post
   - **Article**: Long-form content
   - **Carousel**: Multi-slide presentation
   - **Image**: Content with image description (Coming Soon)

4. **Set Content Length**: Choose between Short, Medium, or Long content

5. **Generate Content**: Click "Generate Content" to create your post

6. **Review & Edit**: Preview the generated content, hashtags, and SEO keywords

7. **Approve & Post**: Approve the content and copy it to LinkedIn

### Content Types Explained

#### Text Post
- Standard LinkedIn post format
- Optimized for engagement and SEO
- Includes relevant hashtags

#### Article
- Long-form content suitable for LinkedIn articles
- Structured with clear paragraphs
- Professional tone with actionable insights

#### Carousel
- Content split into multiple slides (5-8 slides)
- Each slide optimized for standalone value
- Perfect for step-by-step guides or tips

#### Image (Coming Soon)
- AI-generated images and infographics
- Custom prompts for specific visual content
- Integrated with content generation

## 🎯 Best Practices

### Content Creation
- Use specific, relevant topics for better results
- Choose appropriate content length for your audience
- Review and edit generated content to match your voice

### Hashtag Usage
- Use a mix of specific and general hashtags
- Limit to 10-15 hashtags per post
- Include trending hashtags for better reach

### Posting Times
- Follow the suggested optimal posting times
- Consider your audience's time zone
- Test different times to find what works best

## 🔍 API Documentation

### Endpoints

#### `POST /generate-content`
Generate content based on user input.

**Request Body:**
```json
{
  "query": "AI in Healthcare",
  "platform": "LinkedIn",
  "content_type": "Text",
  "content_length": "Medium",
  "image_prompt": "Optional image description"
}
```

**Response:**
```json
{
  "content": "Generated content text...",
  "hashtags": ["#AI", "#Healthcare", "#Innovation"],
  "seo_keywords": ["artificial intelligence", "healthcare technology"],
  "carousel_slides": ["Slide 1 content", "Slide 2 content"],
  "optimal_posting_times": ["Tuesday 10:00 AM", "Wednesday 11:00 AM"]
}
```

#### `GET /health`
Check API health status.

## 🚧 Development

### Project Structure
```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main application
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind configuration
└── README.md
```

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Create new components in `src/components/`
3. **Types**: Update TypeScript types in `src/types/`
4. **Styling**: Use Tailwind CSS classes for consistent design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic content generation
- ✅ Hashtag optimization
- ✅ Carousel support
- ✅ Content preview and editing

### Phase 2 (Coming Soon)
- 🔄 Image generation with AI
- 🔄 LinkedIn API integration
- 🔄 Auto-scheduling functionality
- 🔄 Analytics and performance tracking

### Phase 3 (Future)
- 🔄 Multi-platform support (Medium, Facebook, Instagram)
- 🔄 Team collaboration features
- 🔄 Content calendar management
- 🔄 A/B testing for content optimization

## 📊 Performance

The system is optimized for:
- Fast content generation (< 10 seconds)
- Responsive UI with real-time updates
- Scalable backend architecture
- Mobile-friendly design

---

**Built with ❤️ by XtarzLab**
#   C r e w A I - M u l t i A g e n t  
 