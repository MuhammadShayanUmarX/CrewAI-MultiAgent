# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone and Navigate
```bash
# If you haven't already, navigate to the project directory
cd "CrewAi Major Project"
```

### Step 2: Set Up API Keys
1. Copy `env_template.txt` to `backend/.env`
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Step 3: Start Development Servers

#### Option A: Automatic (Recommended)
**Windows:**
```bash
start_dev.bat
```

**macOS/Linux:**
```bash
./start_dev.sh
```

#### Option B: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm start
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 Getting OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

## 🎯 First Test

1. Open http://localhost:3000
2. Enter a topic like "AI in Healthcare"
3. Select content type and length
4. Click "Generate Content"
5. Review the generated content and hashtags

## 🆘 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Change port in `backend/run.py`
- **Missing dependencies**: Run `pip install -r requirements.txt`
- **API key error**: Check your `.env` file

### Frontend Issues
- **Port 3000 in use**: React will suggest port 3001
- **Dependencies error**: Delete `node_modules` and run `npm install`
- **API connection**: Ensure backend is running on port 8000

### Common Issues
- **CORS errors**: Backend includes CORS middleware for localhost:3000
- **Slow generation**: OpenAI API calls can take 5-15 seconds
- **Rate limits**: OpenAI has rate limits for free accounts

## 📞 Need Help?

Check the main README.md for detailed documentation and troubleshooting.
