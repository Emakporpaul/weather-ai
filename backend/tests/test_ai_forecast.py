"""
Tests for the AI forecast endpoint — the one genuinely "AI engineering"
piece of this backend. We mock Gemini's response so tests never burn API
quota or depend on the model being available. We focus on the contract:
does our endpoint correctly build a prompt and stream a response, rather
than asserting on the model's actual creative output (which we can't
control or predict).
"""
from unittest.mock import patch, MagicMock


def make_fake_gemini_stream(chunks):
    """Build a fake object mimicking Gemini's streaming response shape"""
    fake_chunks = []
    for text in chunks:
        chunk = MagicMock()
        chunk.text = text
        fake_chunks.append(chunk)
    return iter(fake_chunks)


SAMPLE_WEATHER_PAYLOAD = {
    "weather": {
        "location": {"name": "Lagos", "country": "NG", "lat": 6.45, "lon": 3.38},
        "current": {
            "temp": 29, "feels_like": 32, "condition": "scattered clouds",
            "humidity": 78, "wind_speed": 10, "visibility": 10.0,
        },
        "forecast": [
            {"dt": 1718870400 + i * 10800, "temp": 28 + i, "condition": "clear sky", "pop": 10}
            for i in range(8)
        ],
    }
}


def test_ai_forecast_streams_response_text(client):
    """The endpoint should stream back whatever text Gemini generates"""
    fake_json_response = '{"summary": "Warm day ahead", "structured": {"current": "Mild", "next24h": "Stable", "outlook": "Clear"}, "tips": ["Stay hydrated"]}'

    with patch("main.gemini_client.models.generate_content_stream") as mock_generate:
        mock_generate.return_value = make_fake_gemini_stream([fake_json_response])
        res = client.post("/api/ai-forecast", json=SAMPLE_WEATHER_PAYLOAD)

    assert res.status_code == 200
    assert "summary" in res.text


def test_ai_forecast_missing_weather_field_returns_422(client):
    """Request body must include the 'weather' field per our Pydantic model"""
    res = client.post("/api/ai-forecast", json={})
    assert res.status_code == 422


def test_ai_forecast_builds_prompt_with_location_and_temp(client):
    """
    The prompt sent to Gemini should reference the actual location and
    temperature — this catches regressions where someone edits the prompt
    template and accidentally drops real data.
    """
    captured_prompt = {}

    def capture_and_stream(model, contents):
        captured_prompt["text"] = contents
        return make_fake_gemini_stream(['{"summary": "test"}'])

    with patch("main.gemini_client.models.generate_content_stream", side_effect=capture_and_stream):
        client.post("/api/ai-forecast", json=SAMPLE_WEATHER_PAYLOAD)

    assert "Lagos" in captured_prompt["text"]
    assert "29" in captured_prompt["text"]
