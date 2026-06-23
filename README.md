# Paulo Weather Forecast

> Real-time AI-powered weather dashboard for anywhere on earth.

**🌐 Live app → [weather-ai-mocha.vercel.app](https://weather-ai-mocha.vercel.app)**

---

## What it does

Search any city, state, or country and get:
- Current conditions (temp, humidity, wind, visibility, pressure)
- Air quality index
- Estimated UV index
- 24-hour temperature chart with Overview / Wind / Humidity tabs
- 5-day forecast strip
- AI-generated forecast (summary + Now / Next 24h / Outlook breakdown + actionable tips like "keep an umbrella handy")
- Hourly, Details, Monthly, and Trends views via the sidebar

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts |
| Backend | Python + FastAPI (streaming responses) |
| Weather data | OpenWeatherMap API (free tier) |
| AI layer | Google Gemini API (`gemini-2.5-flash-lite`) |
| Testing | pytest (backend) + Vitest + React Testing Library (frontend) |
| Deploy | Vercel (frontend) + Railway (backend) |

## Running locally

### Prerequisites
- Node.js 20+
- Python 3.11+
- OpenWeatherMap API key → [openweathermap.org](https://openweathermap.org/api)
- Google Gemini API key → [aistudio.google.com](https://aistudio.google.com)

### Setup

```bash
# Clone
git clone https://github.com/Emakporpaul/weather-ai.git
cd weather-ai

# Backend
cd backend
cp .env.example .env        # add your API keys
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Running tests

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

## Project structure

```
weather-ai/
├── frontend/
│   └── src/
│       ├── components/    # UI components (dashboard, charts, pages)
│       ├── hooks/         # React Query data hooks
│       ├── services/      # API call layer
│       └── utils/         # Formatters and helpers
└── backend/
    ├── main.py            # FastAPI routes + Gemini streaming
    └── tests/             # pytest test suite
```

---

Built by [Emakpor Paul](https://github.com/Emakporpaul) — born from a rainy morning and wet clothes.
