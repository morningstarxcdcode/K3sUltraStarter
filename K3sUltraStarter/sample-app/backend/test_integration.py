import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

# Example integration test simulating frontend-backend interaction
def test_frontend_backend_integration():
    # Simulate frontend fetching backend root message
    response = client.get("/")
    data = response.json()
    assert "message" in data
    assert data["message"] == "Hello from FastAPI backend!"
