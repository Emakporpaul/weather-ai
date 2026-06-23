"""
Weather AI — FastAPI Backend
Real OpenWeatherMap data + Gemini AI forecast with streaming
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
from google import genai
import os
import json
import asyncio
import math
from datetime import datetime, timezone

load_dotenv()

OWM_KEY = os.getenv("OWM_API_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini using the current, supported google-genai SDK
# (the older google-generativeai package is deprecated as of 2026)
gemini_client = genai.Client(api_key=GEMINI_KEY)
GEMINI_MODEL = "gemini-2.5-flash-lite"  # Fast + free tier, current as of 2026

app = FastAPI(title="Weather AI API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://weather-ai-mocha.vercel.app",
        "https://weather-ai-mocha.vercel.app/",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health

@app.get("/")
def root():
    return {"status": "Weather AI backend is running", "version": "0.2.0"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Geocoding

@app.get("/api/geocode")
async def geocode(city: str):
    """
    Convert city/country name → lat/lon using OWM Geocoding API.
    Returns the top match but also includes the full name with country
    so the frontend can show the user exactly what was matched —
    preventing silent wrong-country results (e.g. Ghana → India).
    """
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.openweathermap.org/geo/1.0/direct",
            params={"q": city, "limit": 5, "appid": OWM_KEY}
        )
        data = res.json()
        if not data:
            raise HTTPException(status_code=404, detail="Location not found")
        place = data[0]
        name = place["name"]
        country = place.get("country", "")
        state = place.get("state", "")
        # Build a full display name so the user always sees what was matched
        display_parts = [name]
        if state and state != name:
            display_parts.append(state)
        if country:
            display_parts.append(country)
        return {
            "lat": place["lat"],
            "lon": place["lon"],
            "name": name,
            "country": country,
            "state": state,
            "display_name": ", ".join(display_parts),
        }


@app.get("/api/reverse-geocode")
async def reverse_geocode(lat: float, lon: float):
    """Convert lat/lon → city name (used after GPS detection)"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.openweathermap.org/geo/1.0/reverse",
            params={"lat": lat, "lon": lon, "limit": 1, "appid": OWM_KEY}
        )
        data = res.json()
        if not data:
            raise HTTPException(status_code=404, detail="Location not found")
        place = data[0]
        return {
            "name": place["name"],
            "country": place.get("country", ""),
            "state": place.get("state", ""),
        }


# Weather Data

@app.get("/api/weather")
async def get_weather(lat: float, lon: float):
    """
    Fetch current weather + 5-day forecast from OWM.
    Returns a clean normalized object ready for the frontend + AI.
    """
    async with httpx.AsyncClient() as client:
        # Run both API calls in parallel for speed
        current_req = client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"lat": lat, "lon": lon, "appid": OWM_KEY, "units": "metric"}
        )
        forecast_req = client.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={"lat": lat, "lon": lon, "appid": OWM_KEY, "units": "metric", "cnt": 16}
        )
        current_res, forecast_res = await asyncio.gather(current_req, forecast_req)

    current = current_res.json()
    forecast = forecast_res.json()

    # Normalize into a clean structure
    return {
        "location": {
            "name": current.get("name"),
            "country": current.get("sys", {}).get("country"),
            "lat": lat,
            "lon": lon,
        },
        "current": {
            "temp": round(current["main"]["temp"]),
            "feels_like": round(current["main"]["feels_like"]),
            "temp_min": round(current["main"]["temp_min"]),
            "temp_max": round(current["main"]["temp_max"]),
            "humidity": current["main"]["humidity"],
            "pressure": current["main"]["pressure"],
            "wind_speed": round(current["wind"]["speed"] * 3.6),  # m/s → km/h
            "wind_deg": current["wind"].get("deg", 0),
            "visibility": current.get("visibility", 0) / 1000,    # m → km
            "condition": current["weather"][0]["description"],
            "condition_code": current["weather"][0]["id"],
            "icon": current["weather"][0]["icon"],
            "sunrise": current["sys"]["sunrise"],
            "sunset": current["sys"]["sunset"],
            "dt": current["dt"],
        },
        "forecast": [
            {
                "dt": item["dt"],
                "temp": round(item["main"]["temp"]),
                "feels_like": round(item["main"]["feels_like"]),
                "humidity": item["main"]["humidity"],
                "wind_speed": round(item["wind"]["speed"] * 3.6),
                "condition": item["weather"][0]["description"],
                "condition_code": item["weather"][0]["id"],
                "icon": item["weather"][0]["icon"],
                "pop": round(item.get("pop", 0) * 100),  # Probability of precipitation %
            }
            for item in forecast["list"]
        ]
    }


# Air Quality

AQI_LABELS = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}


@app.get("/api/air-quality")
async def get_air_quality(lat: float, lon: float):
    """Fetch current air quality index from OWM's Air Pollution API (free)"""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.openweathermap.org/data/2.5/air_pollution",
            params={"lat": lat, "lon": lon, "appid": OWM_KEY}
        )
        data = res.json()
        if "list" not in data or not data["list"]:
            raise HTTPException(status_code=404, detail="Air quality data unavailable")
        item = data["list"][0]
        aqi = item["main"]["aqi"]  # OWM scale: 1-5
        return {
            "aqi": aqi,
            "label": AQI_LABELS.get(aqi, "Unknown"),
            "components": item["components"],  # co, no2, o3, pm2_5, pm10, etc.
        }


# UV Index (estimated)
#
# OWM's free UV endpoint was retired in 2021; live UV now requires a paid
# One Call 3.0 subscription (credit card required), which we're avoiding.
# Instead we estimate UV using latitude, time of day, and season — a
# well-known simplified model. It's an approximation, not measured data,
# and the frontend labels it as "Estimated".


@app.get("/api/uv-index")
async def get_uv_index(lat: float, lon: float):
    """Estimate UV index from solar elevation angle (free, no external call needed)"""
    now = datetime.now(timezone.utc)
    day_of_year = now.timetuple().tm_yday
    hour_decimal = now.hour + now.minute / 60 + lon / 15  # rough local solar time

    # Solar declination angle (simplified)
    declination = 23.45 * math.sin(math.radians(360 / 365 * (day_of_year - 81)))

    # Hour angle: how far the sun is from solar noon
    hour_angle = 15 * (hour_decimal - 12)

    # Solar elevation angle
    lat_rad = math.radians(lat)
    decl_rad = math.radians(declination)
    hour_rad = math.radians(hour_angle)

    elevation = math.asin(
        math.sin(lat_rad) * math.sin(decl_rad) +
        math.cos(lat_rad) * math.cos(decl_rad) * math.cos(hour_rad)
    )
    elevation_deg = math.degrees(elevation)

    if elevation_deg <= 0:
        uvi = 0
    else:
        # Rough scaling: UV index peaks ~10-12 at solar elevation 90° near equator
        uvi = max(0, round((elevation_deg / 90) * 11, 1))

    return {"uvi": uvi, "available": True, "estimated": True}


# Daily Forecast (derived from free 5-day/3hr data)

@app.get("/api/daily-forecast")
async def get_daily_forecast(lat: float, lon: float):
    """
    Build a 5-day daily hi/lo forecast from the free 5-day/3-hour endpoint.
    We avoid OWM's One Call 3.0 'daily' field since that requires a paid
    subscription — this approach stays fully on the free tier.
    """
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={"lat": lat, "lon": lon, "appid": OWM_KEY, "units": "metric"}
        )
        data = res.json()

    # Group the 3-hour entries by calendar day
    days = {}
    for item in data["list"]:
        day_key = item["dt_txt"][:10]  # "YYYY-MM-DD"
        if day_key not in days:
            days[day_key] = {"temps": [], "conditions": [], "codes": [], "dt": item["dt"]}
        days[day_key]["temps"].append(item["main"]["temp"])
        days[day_key]["conditions"].append(item["weather"][0]["description"])
        days[day_key]["codes"].append(item["weather"][0]["id"])

    daily = []
    for day_key, vals in list(days.items())[:5]:
        # Most common condition of the day (simple mode)
        most_common_code = max(set(vals["codes"]), key=vals["codes"].count)
        most_common_idx = vals["codes"].index(most_common_code)
        daily.append({
            "date": day_key,
            "dt": vals["dt"],
            "temp_max": round(max(vals["temps"])),
            "temp_min": round(min(vals["temps"])),
            "condition": vals["conditions"][most_common_idx],
            "condition_code": most_common_code,
        })

    return {"daily": daily}


# AI Forecast (Streaming)

class ForecastRequest(BaseModel):
    weather: dict


@app.post("/api/ai-forecast")
async def ai_forecast(body: ForecastRequest):
    """
    Stream a Gemini-generated forecast based on live weather data.
    Uses Server-Sent Events so text appears word-by-word in the browser.
    """
    w = body.weather
    loc = f"{w['location']['name']}, {w['location']['country']}"
    cur = w['current']
    fc = w['forecast']

    # Build a rich prompt with all the weather context
    next_24h_temps = [f"{f['temp']}°C" for f in fc[:8]]
    next_24h_conditions = [f["condition"] for f in fc[:8]]
    rain_chances = [f"{f['pop']}%" for f in fc[:8]]

    prompt = f"""You are a friendly, expert meteorologist providing a weather forecast for {loc}.

Current conditions:
- Temperature: {cur['temp']}°C (feels like {cur['feels_like']}°C)
- Condition: {cur['condition']}
- Humidity: {cur['humidity']}%
- Wind: {cur['wind_speed']} km/h
- Visibility: {cur['visibility']} km

Next 24 hours (every 3hrs): {', '.join(next_24h_temps)}
Conditions: {', '.join(next_24h_conditions)}
Rain chances: {', '.join(rain_chances)}

Respond ONLY with a valid JSON object (no markdown, no backticks, no extra text):
{{
  "summary": "A warm, conversational 2-3 sentence overview of today's weather",
  "structured": {{
    "current": "One sentence describing right now",
    "next24h": "1-2 sentences on what to expect in the next 24 hours",
    "outlook": "One sentence overall outlook"
  }},
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"]
}}"""

    def stream_gemini():
        response = gemini_client.models.generate_content_stream(
            model=GEMINI_MODEL, contents=prompt
        )
        for chunk in response:
            if chunk.text:
                yield chunk.text

    return StreamingResponse(stream_gemini(), media_type="text/plain")
