"""
Tests for basic server health — the simplest possible smoke tests.
If these fail, nothing else matters; the server isn't even running correctly.
"""

def test_root_returns_status(client):
    res = client.get("/")
    assert res.status_code == 200
    assert "status" in res.json()


def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}
