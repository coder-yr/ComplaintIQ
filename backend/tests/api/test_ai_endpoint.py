import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.ai.complaint_pipeline.ainvoke", new_callable=AsyncMock)
async def test_analyze_endpoint(mock_ainvoke, client: AsyncClient):
    mock_ainvoke.return_value = {
        "extracted_data": {"customer_name": "Jane"},
        "risk_assessment": {"severity": "LOW", "priority": "LOW", "rationale": "None"},
        "summary": "Summary text",
        "confidence_score": 0.5,
        "missing_fields": ["product_name"],
        "warnings": [],
        "errors": [],
        "metadata": {"total_tokens": 10}
    }
    
    response = await client.post("/api/v1/complaints/analyze", json={"raw_text": "Jane said hi."})
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["summary"] == "Summary text"
    assert data["data"]["extracted_data"]["customer_name"] == "Jane"

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.ai.complaint_pipeline.ainvoke", new_callable=AsyncMock)
async def test_analyze_endpoint_error(mock_ainvoke, client: AsyncClient):
    mock_ainvoke.side_effect = Exception("Workflow crashed")
    response = await client.post("/api/v1/complaints/analyze", json={"raw_text": "Jane said hi."})
    
    assert response.status_code == 500
    assert response.json()["success"] is False
    assert "error" in response.json()["message"].lower()

@pytest.mark.asyncio
@patch("app.ai.clients.groq_client.GroqClient.invoke_chat", new_callable=AsyncMock)
async def test_copilot_endpoint_success(mock_invoke_chat, client: AsyncClient):
    mock_invoke_chat.return_value = ("I am an AI.", {"total_tokens": 5})
    
    payload = {
        "complaint": {"summary": "A complaint"},
        "history": [{"role": "user", "content": "hello"}],
        "message": "Who are you?"
    }
    
    response = await client.post("/api/v1/complaints/copilot", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["reply"] == "I am an AI."
    
    # Verify the context and prompt structure
    call_args = mock_invoke_chat.call_args[1]
    assert "A complaint" in call_args["system_prompt"]
    assert len(call_args["chat_history"]) == 1
    assert call_args["chat_history"][0]["content"] == "hello"
    assert call_args["new_message"] == "Who are you?"

@pytest.mark.asyncio
@patch("app.ai.clients.groq_client.GroqClient.invoke_chat", new_callable=AsyncMock)
async def test_copilot_endpoint_error(mock_invoke_chat, client: AsyncClient):
    mock_invoke_chat.return_value = (None, {"error": "API Timeout"})
    
    payload = {
        "complaint": {"summary": "A complaint"},
        "history": [],
        "message": "Hello?"
    }
    
    response = await client.post("/api/v1/complaints/copilot", json=payload)
    
    assert response.status_code == 500
    assert response.json()["success"] is False
