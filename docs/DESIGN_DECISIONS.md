# Design Decisions

This document explains *WHY* specific technologies and patterns were chosen.

## Why React & Redux Toolkit?
React provides a robust component-based architecture suitable for dynamic UIs like a Complaint Form. Redux Toolkit was chosen over Context API because the application requires managing complex asynchronous state (AI processing phases, Copilot chat history) and caching API responses efficiently.

## Why TailwindCSS?
Tailwind allows for rapid UI development without context-switching between JS and CSS files. It ensures a consistent design system and makes it easy to build a modern, professional interface that matches the requested UI specs.

## Why FastAPI?
FastAPI is built on Starlette and supports asynchronous programming natively. Since interacting with the Groq API involves network I/O, `async/await` ensures the backend remains responsive and does not block other requests while waiting for AI responses. It also auto-generates Swagger documentation based on Pydantic models.

## Why PostgreSQL (Neon)?
PostgreSQL is a robust, ACID-compliant relational database perfect for structured complaint data. Neon provides a serverless PostgreSQL environment, which is highly scalable, supports branching, and reduces infrastructure management overhead.

## Why LangGraph?
LangGraph handles stateful, multi-actor LLM applications. Instead of a linear script, LangGraph allows us to define nodes (Extract, Assess Risk) and edges (including retry loops), maintaining a single state object throughout the AI ingestion process. This is crucial for complex, multi-step AI tasks.

## Why Groq API & gemma2-9b-it?
Groq provides ultra-fast inference (LPU technology), which is critical for a smooth user experience when analyzing text. The `gemma2-9b-it` model was explicitly requested as it offers a strong balance of performance, instruction following (crucial for JSON output), and speed.
