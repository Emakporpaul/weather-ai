"""
Shared pytest fixtures.
We mock all external API calls (OpenWeatherMap, Gemini) so tests:
  - run instantly, with no network dependency
  - never burn API quota
  - still pass if your free-tier keys expire or rate-limit
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_geocode_response():
    """Sample OWM geocoding API response shape"""
    return [{
        "name": "Lagos",
        "lat": 6.4550,
        "lon": 3.3841,
        "country": "NG",
        "state": ""
    }]


@pytest.fixture
def mock_current_weather_response():
    """Sample OWM current weather API response shape"""
    return {
        "name": "Lagos",
        "sys": {"country": "NG", "sunrise": 1718841600, "sunset": 1718886000},
        "main": {
            "temp": 28.5, "feels_like": 31.2, "temp_min": 27.0,
            "temp_max": 30.0, "humidity": 78, "pressure": 1013
        },
        "wind": {"speed": 2.8, "deg": 210},
        "visibility": 10000,
        "weather": [{"description": "scattered clouds", "id": 802, "icon": "03d"}],
        "dt": 1718870400,
    }


@pytest.fixture
def mock_forecast_response():
    """Sample OWM 5-day/3-hour forecast API response shape"""
    return {
        "list": [
            {
                "dt": 1718870400 + i * 10800,
                "dt_txt": f"2026-06-2{i % 5} 0{i % 9}:00:00",
                "main": {"temp": 27 + i, "feels_like": 29 + i, "humidity": 70 + i},
                "wind": {"speed": 2.5},
                "weather": [{"description": "clear sky", "id": 800, "icon": "01d"}],
                "pop": 0.1,
            }
            for i in range(16)
        ]
    }


@pytest.fixture
def mock_air_quality_response():
    """Sample OWM air pollution API response shape"""
    return {
        "list": [{
            "main": {"aqi": 2},
            "components": {"co": 200.1, "no2": 10.2, "o3": 60.5, "pm2_5": 8.3, "pm10": 12.1}
        }]
    }
