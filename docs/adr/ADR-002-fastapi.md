# ADR 002: Use FastAPI for Backend

## Status
Accepted

## Context
The backend needs to orchestrate multiple AI API calls, which are inherently I/O bound. A highly concurrent and fast framework is required.

## Decision
We will use FastAPI (Python) for the backend API.

## Consequences
- **Positive:** Native async/await support ensures the server isn't blocked during long AI inferences. Automatic OpenAPI/Swagger documentation generation via Pydantic.
- **Negative:** Developers must be careful to avoid blocking the event loop with synchronous tasks.
