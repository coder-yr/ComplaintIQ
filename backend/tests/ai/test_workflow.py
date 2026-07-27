import pytest
from unittest.mock import patch, AsyncMock
from app.ai.workflow import complaint_pipeline
from app.ai.state import ComplaintWorkflowState
from app.ai.clients.groq_client import groq_client

@pytest.mark.asyncio
@patch.object(groq_client, 'invoke_json', new_callable=AsyncMock)
@patch.object(groq_client, 'invoke_text', new_callable=AsyncMock)
async def test_full_pipeline_success(mock_invoke_text, mock_invoke_json):
    mock_invoke_json.side_effect = [
        (
            {
                "customer_name": "Test User",
                "product_name": "Test Product",
                "batch_number": "123",
                "incident_date": "2023-01-01",
                "description": "It broke",
                "severity": "MODERATE",
                "priority": "MEDIUM"
            },
            {"total_tokens": 100}
        ),
        (
            {"rationale": "Because it broke."},
            {"total_tokens": 50}
        )
    ]
    
    mock_invoke_text.return_value = ("This is a summary.", {"total_tokens": 20})
    
    initial_state = ComplaintWorkflowState(raw_text="Test User said Test Product broke.")
    
    result = await complaint_pipeline.ainvoke(initial_state.model_dump())
    
    assert result["validation_status"] is True
    assert result["confidence_score"] == 1.0
    assert result["summary"] == "This is a summary."
    assert result["risk_assessment"]["severity"] == "MODERATE"
    assert "This is a summary." in result["copilot_context"]

@pytest.mark.asyncio
@patch.object(groq_client, 'invoke_json', new_callable=AsyncMock)
@patch.object(groq_client, 'invoke_text', new_callable=AsyncMock)
async def test_pipeline_missing_mandatory(mock_invoke_text, mock_invoke_json):
    mock_invoke_json.side_effect = [
        (
            {
                "customer_name": "", # Missing mandatory
                "product_name": "Test Product",
                "batch_number": "123",
                "incident_date": "invalid-date",
                "description": "", # Empty description should fail validator
                "severity": "MODERATE",
                "priority": "MEDIUM"
            },
            {"total_tokens": 100}
        ),
        (
            {"rationale": "Because it broke."},
            {"total_tokens": 50}
        )
    ]
    
    mock_invoke_text.return_value = ("Summary", {"total_tokens": 20})
    
    initial_state = ComplaintWorkflowState(raw_text="Test Product broke.")
    result = await complaint_pipeline.ainvoke(initial_state.model_dump())
    
    # Should flag missing customer_name
    assert "customer_name" in result["missing_fields"]
    # Should flag date
    assert any("Incident date" in w for w in result["warnings"])
    # Should fail validation because description is empty
    assert result["validation_status"] is False
    assert any("completely empty" in e for e in result["errors"])

@pytest.mark.asyncio
@patch.object(groq_client, 'invoke_json', new_callable=AsyncMock)
async def test_pipeline_extractor_error(mock_invoke_json):
    mock_invoke_json.return_value = (None, {"error": "API failed"})
    
    initial_state = ComplaintWorkflowState(raw_text="Test Product broke.")
    result = await complaint_pipeline.ainvoke(initial_state.model_dump())
    
    # Extractor error should be in errors
    assert any("Extraction Error" in e for e in result["errors"])
    assert result["validation_status"] is False

@pytest.mark.asyncio
@patch.object(groq_client, 'invoke_text', new_callable=AsyncMock)
@patch.object(groq_client, 'invoke_json', new_callable=AsyncMock)
async def test_pipeline_risk_error(mock_invoke_json, mock_invoke_text):
    mock_invoke_json.side_effect = [
        (
            {
                "customer_name": "Jane",
                "description": "Valid text"
            },
            {"total_tokens": 100}
        ),
        (
            None,
            {"error": "API Timeout on risk"}
        )
    ]
    
    mock_invoke_text.return_value = ("Summary string", {"total_tokens": 10})
    
    initial_state = ComplaintWorkflowState(raw_text="Jane said hi.")
    result = await complaint_pipeline.ainvoke(initial_state.model_dump())
    
    # Risk API failure gracefully degrades rationale
    assert result["risk_assessment"]["rationale"] == "No rationale provided."
    # But validation is still true
    assert result["validation_status"] is True

@pytest.mark.asyncio
@patch.object(groq_client, 'invoke_text', new_callable=AsyncMock)
@patch.object(groq_client, 'invoke_json', new_callable=AsyncMock)
async def test_pipeline_risk_keywords(mock_invoke_json, mock_invoke_text):
    mock_invoke_json.side_effect = [
        (
            {
                "customer_name": "Jane",
                "description": "Patient death occurred."
            },
            {"total_tokens": 100}
        ),
        (
            {"rationale": "High severity event."},
            {"total_tokens": 20}
        )
    ]
    
    mock_invoke_text.return_value = ("Summary string", {"total_tokens": 10})
    
    initial_state = ComplaintWorkflowState(raw_text="Jane said someone died.")
    result = await complaint_pipeline.ainvoke(initial_state.model_dump())
    
    # Should be upgraded to SEVERE / CRITICAL
    assert result["risk_assessment"]["severity"] == "SEVERE"
    assert result["risk_assessment"]["priority"] == "CRITICAL"
    assert any("upgraded risk to SEVERE/CRITICAL" in w for w in result["warnings"])
