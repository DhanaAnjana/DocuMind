import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_upload_endpoint():
    # Test file upload endpoint
    with open("tests/data/sample.pdf", "rb") as f:
        response = client.post(
            "/upload",
            files={"file": ("sample.pdf", f, "application/pdf")}
        )
    assert response.status_code == 200
    assert "document_id" in response.json()

def test_document_status():
    # Test document status endpoint
    response = client.get("/status/1")
    assert response.status_code == 200
    assert "status" in response.json()

def test_search_endpoint():
    # Test search functionality
    response = client.get("/documents/search", params={
        "query": "test query",
        "entity_type": "Person"
    })
    assert response.status_code == 200

def test_document_entities():
    # Test entity extraction endpoint
    response = client.get("/documents/1/entities")
    assert response.status_code == 200