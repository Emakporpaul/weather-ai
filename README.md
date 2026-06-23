# Paulo Weather Forecast

> Real-time AI-powered weather dashboard for any city, state, or country on earth.

** Live app → [weather-ai-mocha.vercel.app](https://weather-ai-mocha.vercel.app)**
** Repository → [github.com/Emakporpaul/weather-ai](https://github.com/Emakporpaul/weather-ai)**

---

## What it does

Search any city worldwide and get:

- **Current conditions** — temperature (°C/°F), feels like, humidity, wind, visibility, pressure
- **Air quality index** — 1–5 scale with human-readable label (Good, Fair, Moderate, Poor, Very Poor)
- **UV index** — estimated from sun angle and season
- **24-hour chart** — temperature, wind, or humidity curve with tab switcher
- **AI forecast** — Gemini-generated summary with Now / Next 24h / Outlook breakdown and practical daily tips (umbrella, sunscreen, etc.)
- **5-day forecast** — daily high/low strip with animated weather icons
- **Sidebar pages** — Hourly (chart + list toggle), Details grid, Monthly calendar, Trends chart

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts |
| Backend | Python + FastAPI with streaming responses |
| Weather data | OpenWeatherMap API (free tier) |
| AI layer | Google Gemini API (`gemini-2.5-flash-lite`) |
| Testing | pytest (backend) · Vitest + React Testing Library (frontend) |
| Deploy | Vercel (frontend) · Render (backend) |

---

## Architecture

```
User
 ↓
React frontend (Vercel)
 ↓
FastAPI backend (Render)
 ├── OpenWeatherMap API  →  current weather, forecast, geocoding, air quality
 └── Google Gemini API   →  streaming AI forecast + actionable tips
```

---

## Running locally

### Prerequisites
- Node.js 20+
- Python 3.11+
- Free API keys:
  - OpenWeatherMap → [openweathermap.org/api](https://openweathermap.org/api)
  - Google Gemini → [aistudio.google.com](https://aistudio.google.com)

### Setup

```bash
# 1. Clone
git clone https://github.com/Emakporpaul/weather-ai.git
cd weather-ai

# 2. Backend
cd backend
cp .env.example .env        # fill in your API keys
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload   # runs on http://localhost:8000

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev                 # runs on http://localhost:5173
```

### Running tests

```bash
# Backend (16 tests)
cd backend && pytest

# Frontend (20 tests)
cd frontend && npm test
```

---

## Project structure

```
weather-ai/
├── frontend/
│   └── src/
│       ├── components/    # Dashboard, charts, sidebar pages
│       ├── hooks/         # React Query data hooks
│       ├── services/      # API call layer
│       └── utils/         # Temperature conversion, formatters, error messages
└── backend/
    ├── main.py            # FastAPI routes + Gemini streaming
    └── tests/             # pytest test suite (16 tests)
```

---

## Engineering notes

A few deliberate decisions made during the build:

- **UV index is estimated**, not live-measured. OpenWeatherMap's live UV endpoint requires a paid subscription — rather than silently presenting estimated data as real, the UI labels it clearly as an estimate calculated from sun angle, season, and latitude.
- **Monthly data is limited to 5 days**. OWM's free tier only provides a 5-day forecast. Days beyond that are shown as unavailable rather than fabricated.
- **Gemini SDK migration**. Midway through the build, Google deprecated the `google-generativeai` package. Caught via a deprecation warning in the test suite and migrated to `google-genai` before it could silently break in production.
- **Render keep-alive**. The frontend pings the backend's `/api/health` endpoint every 10 minutes to prevent Render's free tier from sleeping between visits.

---

Built by [Paul Emakpor](https://github.com/Emakporpaul) — ML/AI Engineer.
