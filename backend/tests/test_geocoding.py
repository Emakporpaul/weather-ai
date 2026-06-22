"""
Tests for geocoding endpoints — converting city names <-> coordinates.
We mock httpx so we never make a real call to OpenWeatherMap.
"""
from unittest.mock import patch, AsyncMock
import httpx


def make_mock_response(json_data, status_code=200):
    """Build a fake httpx.Response-like object for mocking"""
    request = httpx.Request("GET", "http://test")
    return httpx.Response(status_code, json=json_data, request=request)


def test_geocode_success(client, mock_geocode_response):
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = make_mock_response(mock_geocode_response)
        res = client.get("/api/geocode?city=Lagos")

    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Lagos"
    assert data["country"] == "NG"
    assert "lat" in data and "lon" in data


def test_geocode_not_found_returns_404(client):
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = make_mock_response([])  # OWM returns empty list when not found
        res = client.get("/api/geocode?city=NotARealPlaceXYZ")

    assert res.status_code == 404


def test_geocode_requires_city_param(client):
    res = client.get("/api/geocode")
    assert res.status_code == 422  # FastAPI validation error for missing required param


def test_reverse_geocode_success(client, mock_geocode_response):
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = make_mock_response(mock_geocode_response)
        res = client.get("/api/reverse-geocode?lat=6.45&lon=3.38")

    assert res.status_code == 200
    assert res.json()["name"] == "Lagos"
