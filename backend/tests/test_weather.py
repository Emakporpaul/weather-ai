"""
Tests for the core weather endpoint — this is the most important test file,
since /api/weather is the backbone of the whole app. We verify the response
is correctly normalized (units converted, fields renamed) regardless of
what OWM's raw response looks like.
"""
from unittest.mock import patch, AsyncMock
import httpx


def make_mock_response(json_data, status_code=200):
    request = httpx.Request("GET", "http://test")
    return httpx.Response(status_code, json=json_data, request=request)


def test_weather_endpoint_normalizes_data(client, mock_current_weather_response, mock_forecast_response):
    """The critical-path test: does /api/weather return clean, correctly-shaped data?"""
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        # First call returns current weather, second returns forecast
        mock_get.side_effect = [
            make_mock_response(mock_current_weather_response),
            make_mock_response(mock_forecast_response),
        ]
        res = client.get("/api/weather?lat=6.45&lon=3.38")

    assert res.status_code == 200
    data = res.json()

    # Location data present
    assert data["location"]["name"] == "Lagos"
    assert data["location"]["country"] == "NG"

    # Current weather correctly normalized
    assert data["current"]["temp"] == 28  # round(28.5) == 28 (Python banker's rounding)
    assert data["current"]["condition"] == "scattered clouds"
    assert data["current"]["wind_speed"] == 10  # 2.8 m/s * 3.6 = ~10 km/h
    assert data["current"]["visibility"] == 10.0  # 10000m -> 10km

    # Forecast list present and correctly shaped
    assert len(data["forecast"]) == 16
    assert "temp" in data["forecast"][0]
    assert "pop" in data["forecast"][0]


def test_weather_requires_lat_lon(client):
    res = client.get("/api/weather")
    assert res.status_code == 422
