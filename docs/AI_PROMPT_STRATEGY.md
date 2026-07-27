# AI Prompt Strategy

## Overview
This document outlines the systematic approach to interacting with the LLM (gemma2-9b-it via Groq) to ensure reliable, structured, and accurate outputs.

## Prompt Components
- **System Prompt:** Sets the role, constraints, and exact output format (e.g., "You are a QA assistant. Output ONLY valid JSON.").
- **User Prompt:** Contains the specific task and the injected context/data.

## JSON Schema Enforcement
We enforce JSON output by:
1. Explicitly instructing the model in the system prompt.
2. Providing a JSON template in the prompt.
3. Setting temperature to `0.0` or `0.1` to reduce variability.

## Configuration
- **Temperature:** `0.1` for extraction and classification (deterministic). `0.7` for Copilot chat (creative).
- **Max Tokens:** `1024` for extraction. `512` for chat responses.

## Validation & Fallback Strategy
- **Schema Validation:** All LLM outputs are validated against Pydantic models.
- **Retry Strategy:** If JSON decoding or validation fails, LangGraph retries the node up to 3 times, appending the previous error to the prompt.
- **Failure Fallback:** If all retries fail, the system returns `null` fields, prompting the user for manual entry rather than crashing.

## Hallucination Mitigation
- Instructing the model to output `null` if a field is not found in the text.
- Limiting the Copilot context strictly to the current complaint and explicitly instructing it to say "I don't know" if the information is missing.
