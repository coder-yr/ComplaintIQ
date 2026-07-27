import asyncio
import json
import logging
import time
from json.decoder import JSONDecodeError
from typing import Any, Dict, Optional, Tuple

from groq import AsyncGroq, APIError, APIConnectionError, RateLimitError
from app.config.settings import settings

logger = logging.getLogger(__name__)

class GroqClient:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.primary_model = "gemma2-9b-it"
        self.fallback_model = "llama-3.3-70b-versatile"
        self.max_retries = 3

    async def invoke_json(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.1,
        max_tokens: int = 1024,
    ) -> Tuple[Optional[Dict[str, Any]], Dict[str, Any]]:
        return await self._invoke_with_retry(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            require_json=True,
        )

    async def invoke_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 512,
    ) -> Tuple[Optional[str], Dict[str, Any]]:
        return await self._invoke_with_retry(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            require_json=False,
        )

    async def invoke_chat(
        self,
        system_prompt: str,
        chat_history: list,
        new_message: str,
        temperature: float = 0.5,
        max_tokens: int = 512,
    ) -> Tuple[Optional[str], Dict[str, Any]]:
        retries = 0
        last_error = None

        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(chat_history)
        messages.append({"role": "user", "content": new_message})

        while retries <= self.max_retries:
            start_time = time.time()
            try:
                response = await self.client.chat.completions.create(
                    model=self.primary_model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )

                latency = time.time() - start_time
                usage = response.usage
                metadata = {
                    "latency": latency,
                    "prompt_tokens": usage.prompt_tokens if usage else 0,
                    "completion_tokens": usage.completion_tokens if usage else 0,
                    "total_tokens": usage.total_tokens if usage else 0,
                    "retry_count": retries,
                    "model_used": self.primary_model,
                }

                content = response.choices[0].message.content
                return content, metadata

            except (APIError, APIConnectionError, RateLimitError) as e:
                last_error = e
                retries += 1
                logger.warning(
                    f"Groq API Error in chat (Retry {retries}/{self.max_retries}): {e.__class__.__name__}"
                )
                
                if isinstance(e, RateLimitError):
                    await asyncio.sleep(2**retries)
                else:
                    await asyncio.sleep(1)

        logger.error(f"Failed after {self.max_retries} retries. Last error: {last_error}")
        metadata = {
            "latency": time.time() - start_time,
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
            "retry_count": retries,
            "model_used": self.primary_model,
            "error": str(last_error),
        }
        return None, metadata

    async def _invoke_with_retry(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        max_tokens: int,
        require_json: bool,
    ) -> Tuple[Any, Dict[str, Any]]:
        retries = 0
        last_error = None

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        while retries <= self.max_retries:
            start_time = time.time()
            try:
                kwargs = {
                    "model": self.primary_model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                if require_json:
                    kwargs["response_format"] = {"type": "json_object"}

                response = await self.client.chat.completions.create(**kwargs)

                latency = time.time() - start_time
                usage = response.usage
                metadata = {
                    "latency": latency,
                    "prompt_tokens": usage.prompt_tokens if usage else 0,
                    "completion_tokens": usage.completion_tokens if usage else 0,
                    "total_tokens": usage.total_tokens if usage else 0,
                    "retry_count": retries,
                    "model_used": self.primary_model,
                }

                content = response.choices[0].message.content
                if require_json:
                    try:
                        parsed_content = json.loads(content)
                        return parsed_content, metadata
                    except JSONDecodeError as e:
                        logger.warning(f"JSON Decode Error from LLM: {e}")
                        messages.append({"role": "assistant", "content": content})
                        messages.append(
                            {
                                "role": "user",
                                "content": "You did not return valid JSON. Please return strictly valid JSON.",
                            }
                        )
                        raise e  # trigger retry logic
                else:
                    return content, metadata

            except (APIError, APIConnectionError, RateLimitError, JSONDecodeError) as e:
                last_error = e
                retries += 1
                logger.warning(
                    f"Groq API Error or JSON error (Retry {retries}/{self.max_retries}): {e.__class__.__name__}"
                )
                
                # Check for model not found / token rate limits etc that might need fallback
                if isinstance(e, RateLimitError):
                    await asyncio.sleep(2**retries)
                elif isinstance(e, JSONDecodeError):
                    pass  # Handled immediately, just retry
                else:
                    await asyncio.sleep(1)

        logger.error(f"Failed after {self.max_retries} retries. Last error: {last_error}")
        metadata = {
            "latency": time.time() - start_time,
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
            "retry_count": retries,
            "model_used": self.primary_model,
            "error": str(last_error),
        }
        return None, metadata

groq_client = GroqClient()
