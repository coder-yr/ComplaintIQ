# ADR 005: Use Groq API and gemma2-9b-it

## Status
Accepted

## Context
The application requires near-real-time extraction and analysis of text to provide a seamless user experience. High latency degrades the perceived value of the AI Copilot.

## Decision
We will use the Groq API running the `gemma2-9b-it` model.

## Consequences
- **Positive:** Extremely low latency inference (LPU), reducing wait times significantly. The model is capable of strict JSON output.
- **Negative:** Subject to strict rate limits. Requires robust retry logic in the backend.
