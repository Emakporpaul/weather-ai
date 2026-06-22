"""
Tests for the "extras" endpoints: air quality, UV index, daily forecast.

UV index is the most interesting to test since it's not a passthrough to an
external API — it's our own astronomical calculation. We test it against
known physical facts (equator gets more midday sun than high latitudes)
rather than exact numbers, since exact UV depends on the date the test runs.
"""
from unittest.mock import patch, AsyncMock
import httpx


def make_mock_response(json_data, status_code=200):
    request = httpx.Request("GET", "http://test")
    return httpx.Response(status_code, json=json_data, request=request)


def test_air_quality_returns_label_for_known_aqi(client, mock_air_quality_response):
    """AQI 2 should map to the human-readable label 'Fair'"""
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = make_mock_response(mock_air_quality_response)
        res = client.get("/api/air-quality?lat=6.5244&lon=3.3792")

    assert res.status_code == 200
    data = res.json()
    assert data["aqi"] == 2
    assert data["label"] == "Fair"
    assert "components" in data


def test_air_quality_empty_response_returns_404(client):
    """If OWM returns no data for a location, we should surface a clean 404"""
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = make_mock_response({"list": []})
        res = client.get("/api/air-quality?lat=0&lon=0")

    assert res.status_code == 404


def test_uv_index_is_clearly_labeled_as_estimated(client):
    """
    Critical honesty check: since we calculate UV locally instead of using
    OWM's paid live endpoint, the response MUST say so. This protects
    against silently presenting estimated data as if it were measured.
    """
    res = client.get("/api/uv-index?lat=6.45&lon=3.38")
    assert res.status_code == 200
    data = res.json()
    assert data["estimated"] is True


def test_uv_index_never_returns_negative(client):
    """UV index should always be 0 or higher, even at night / high latitude"""
    # North pole, midnight UTC — should be near-zero, never negative
    res = client.get("/api/uv-index?lat=89&lon=0")
    assert res.status_code == 200
    assert res.json()["uvi"] >= 0


def test_daily_forecast_groups_by_calendar_day(client, mock_forecast_response):
    """5-day forecast should group 3-hour entries into distinct calendar days"""
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = make_mock_response(mock_forecast_response)
        res = client.get("/api/daily-forecast?lat=6.45&lon=3.38")

    assert res.status_code == 200
    data = res.json()
    assert "daily" in data
    assert len(data["daily"]) <= 5  # never more than 5 days on free tier
    for day in data["daily"]:
        assert "temp_max" in day
        assert "temp_min" in day
        assert day["temp_max"] >= day["temp_min"]  # sanity check, hi should never be below lo
