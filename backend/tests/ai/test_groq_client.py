import pytest
from unittest.mock import patch, AsyncMock
from groq import APIError, APITimeoutError
from app.ai.clients.groq_client import GroqClient

@pytest.fixture
def groq_client():
    return GroqClient()

@pytest.mark.asyncio
async def test_invoke_json_success(groq_client):
    with patch("app.ai.clients.groq_client.AsyncGroq") as MockGroq:
        mock_instance = AsyncMock()
        mock_chat_completion = AsyncMock()
        mock_chat_completion.choices = [
            AsyncMock(message=AsyncMock(content='{"test": "value"}'))
        ]
        mock_chat_completion.usage = AsyncMock(total_tokens=10)
        mock_instance.chat.completions.create.return_value = mock_chat_completion
        groq_client.client = mock_instance
        
        result, usage = await groq_client.invoke_json(system_prompt="system", user_prompt="hello")
        assert result == {"test": "value"}
        assert usage["total_tokens"] == 10

@pytest.mark.asyncio
async def test_invoke_json_invalid_json(groq_client):
    with patch("app.ai.clients.groq_client.AsyncGroq") as MockGroq:
        mock_instance = AsyncMock()
        mock_chat_completion = AsyncMock()
        mock_chat_completion.choices = [
            AsyncMock(message=AsyncMock(content='Not JSON'))
        ]
        mock_chat_completion.usage = AsyncMock(total_tokens=10)
        mock_instance.chat.completions.create.return_value = mock_chat_completion
        groq_client.client = mock_instance
        
        # It should retry and fail, or we can patch the 2nd return to be valid JSON
        mock_chat_completion_retry = AsyncMock()
        mock_chat_completion_retry.choices = [
            AsyncMock(message=AsyncMock(content='{"recovered": true}'))
        ]
        mock_chat_completion_retry.usage = AsyncMock(total_tokens=10)
        
        mock_instance.chat.completions.create.side_effect = [
            mock_chat_completion, # Fails JSON parsing
            mock_chat_completion_retry # Succeeds
        ]
        
        result, usage = await groq_client.invoke_json(system_prompt="system", user_prompt="hello")
        assert result == {"recovered": True}
        assert mock_instance.chat.completions.create.call_count == 2

@pytest.mark.asyncio
async def test_invoke_json_api_error(groq_client):
    from groq import APIError
    import httpx
    with patch("app.ai.clients.groq_client.AsyncGroq") as MockGroq:
        mock_instance = AsyncMock()
        mock_instance.chat.completions.create.side_effect = APIError("API failed", request=httpx.Request("GET", "url"), body={})
        groq_client.client = mock_instance
        
        result, usage = await groq_client.invoke_json(system_prompt="system", user_prompt="hello")
        assert result is None
        assert usage["error"] is not None

@pytest.mark.asyncio
async def test_invoke_text_success(groq_client):
    with patch("app.ai.clients.groq_client.AsyncGroq") as MockGroq:
        mock_instance = AsyncMock()
        mock_chat_completion = AsyncMock()
        mock_chat_completion.choices = [
            AsyncMock(message=AsyncMock(content='Text response'))
        ]
        mock_chat_completion.usage = AsyncMock(total_tokens=5)
        mock_instance.chat.completions.create.return_value = mock_chat_completion
        groq_client.client = mock_instance
        
        result, usage = await groq_client.invoke_text(system_prompt="sys", user_prompt="hello")
        assert result == "Text response"
        assert usage["total_tokens"] == 5

@pytest.mark.asyncio
async def test_invoke_chat_success(groq_client):
    with patch("app.ai.clients.groq_client.AsyncGroq") as MockGroq:
        mock_instance = AsyncMock()
        mock_chat_completion = AsyncMock()
        mock_chat_completion.choices = [
            AsyncMock(message=AsyncMock(content='Chat response'))
        ]
        mock_chat_completion.usage = AsyncMock(total_tokens=5)
        mock_instance.chat.completions.create.return_value = mock_chat_completion
        groq_client.client = mock_instance
        
        result, usage = await groq_client.invoke_chat(system_prompt="sys", chat_history=[], new_message="hello")
        assert result == "Chat response"

@pytest.mark.asyncio
async def test_invoke_text_timeout(groq_client):
    from groq import APITimeoutError
    import httpx
    with patch("app.ai.clients.groq_client.AsyncGroq") as MockGroq:
        mock_instance = AsyncMock()
        mock_instance.chat.completions.create.side_effect = APITimeoutError(request=httpx.Request("GET", "url"))
        groq_client.client = mock_instance
        
        # It has retry logic. Let's make it fail all retries
        result, usage = await groq_client.invoke_text(system_prompt="sys", user_prompt="hello")
        assert result is None
        assert usage["error"] is not None
