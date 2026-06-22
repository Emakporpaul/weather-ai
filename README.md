# Weather AI — Real-time AI-powered weather forecast

A full-stack AI engineering project combining live weather data
with Google Gemini AI to generate intelligent natural language forecasts.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Backend**: FastAPI (Python) with streaming support
- **Weather data**: OpenWeatherMap API
- **AI layer**: Anthropic Claude API (claude-sonnet-4-6)
- **Deploy**: Vercel (frontend) + Railway (backend)

## Project Structure
```
weather-ai/
├── frontend/          # React app
│   └── src/
│       ├── components/    # UI components
│       ├── hooks/         # Custom React hooks
│       ├── services/      # API calls
│       ├── utils/         # Helper functions
│       └── styles/        # Global CSS
├── backend/           # FastAPI server
└── docs/              # Notes and API docs
```

## Quick Start
See docs/SETUP.md for step-by-step instructions.
