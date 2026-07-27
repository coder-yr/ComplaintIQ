import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_complaint(client: AsyncClient):
    payload = {
        "customer_name": "John Doe",
        "description": "The product was damaged.",
        "severity": "HIGH",
        "priority": "MEDIUM"
    }
    response = await client.post("/api/v1/complaints", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Complaint saved successfully"
    assert "CMP-" in data["data"]["complaint_number"]
    assert data["data"]["customer_name"] == "John Doe"

@pytest.mark.asyncio
async def test_list_complaints(client: AsyncClient):
    payload = {
        "customer_name": "Jane Doe",
        "description": "The product was damaged.",
        "severity": "HIGH",
        "priority": "MEDIUM"
    }
    await client.post("/api/v1/complaints", json=payload)
    response = await client.get("/api/v1/complaints")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "size" in data
    assert "pages" in data
    assert len(data["items"]) >= 1

@pytest.mark.asyncio
async def test_get_complaint(client: AsyncClient):
    # Create
    payload = {"customer_name": "Test User", "description": "Test Get", "severity": "LOW", "priority": "LOW"}
    create_resp = await client.post("/api/v1/complaints", json=payload)
    comp_id = create_resp.json()["data"]["id"]
    
    # Get
    response = await client.get(f"/api/v1/complaints/{comp_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == comp_id

@pytest.mark.asyncio
async def test_update_complaint(client: AsyncClient):
    # Create
    payload = {"customer_name": "Test User", "description": "Test Update", "severity": "LOW", "priority": "LOW"}
    create_resp = await client.post("/api/v1/complaints", json=payload)
    comp_id = create_resp.json()["data"]["id"]
    
    # Update
    update_payload = {"description": "Updated Desc", "severity": "MODERATE", "priority": "HIGH"}
    response = await client.put(f"/api/v1/complaints/{comp_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["description"] == "Updated Desc"
    assert data["data"]["severity"] == "MODERATE"

@pytest.mark.asyncio
async def test_update_complaint_status(client: AsyncClient):
    # Create
    payload = {"customer_name": "Test User", "description": "Test Status", "severity": "LOW", "priority": "LOW"}
    create_resp = await client.post("/api/v1/complaints", json=payload)
    comp_id = create_resp.json()["data"]["id"]
    
    # Update Status
    update_payload = {"status": "IN_PROGRESS"}
    response = await client.patch(f"/api/v1/complaints/{comp_id}/status", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["status"] == "IN_PROGRESS"

@pytest.mark.asyncio
async def test_search_complaints(client: AsyncClient):
    # Create
    payload = {"customer_name": "UniqueSearchTerm123", "description": "Search me", "severity": "LOW", "priority": "LOW"}
    await client.post("/api/v1/complaints", json=payload)
    
    # Search
    response = await client.get("/api/v1/complaints/search?query=UniqueSearchTerm")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("UniqueSearchTerm" in item["customer_name"] for item in data["items"])

@pytest.mark.asyncio
async def test_delete_complaint(client: AsyncClient):
    # Create
    payload = {"customer_name": "Test User", "description": "Test Delete", "severity": "LOW", "priority": "LOW"}
    create_resp = await client.post("/api/v1/complaints", json=payload)
    comp_id = create_resp.json()["data"]["id"]
    
    # Delete
    response = await client.delete(f"/api/v1/complaints/{comp_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Complaint deleted successfully"
    
    # Verify Get fails with 404
    get_response = await client.get(f"/api/v1/complaints/{comp_id}")
    assert get_response.status_code == 404
