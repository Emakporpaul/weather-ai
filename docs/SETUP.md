# Setup Guide

## API Keys needed (both free)
1. OpenWeatherMap → https://openweathermap.org/api
2. Google Gemini  → https://aistudio.google.com

## Your .env file (at project root)
```
OWM_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
VITE_API_URL=http://localhost:8000
```

## Run the app (Windows)

### Terminal 1 — Backend
```bash
cd "C:\Users\HP\Documents\Portfolio projects\weather-ai\backend"
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Terminal 2 — Frontend
```bash
cd "C:\Users\HP\Documents\Portfolio projects\weather-ai\frontend"
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.
