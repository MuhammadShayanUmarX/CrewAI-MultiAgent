@echo off
echo Starting LinkedIn Content Generator Development Environment...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python run.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start cmd /k "cd frontend && npm install && npm start"

echo.
echo Development servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
pause
