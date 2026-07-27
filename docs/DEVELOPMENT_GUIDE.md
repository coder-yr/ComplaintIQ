# Development Guide

This document outlines how to execute the project implementation. **Always refer to the `docs/` folder before writing code.**

## 1. Strictly Follow Documentation
Do not invent features or APIs on the fly. If a change is needed, update the documentation first (especially `API_SPEC.md` or `DATABASE.md`), then implement the code.

## 2. Recommended Development Order
It is highly recommended to follow the order defined in [ROADMAP.md](./ROADMAP.md):
1. **Database:** Define the schema. It dictates the API.
2. **Backend (CRUD):** Build standard API endpoints first.
3. **Backend (AI):** Implement LangGraph independently and test it via Swagger UI.
4. **Frontend (Static):** Build the UI components without API integration.
5. **Frontend (Integration):** Connect Redux to the completed backend APIs.

## 3. Working with AI (Groq + LangGraph)
- **Rate Limits:** Groq is very fast but has rate limits. Ensure the backend handles `429 Too Many Requests` gracefully.
- **JSON Parsing:** The `gemma2-9b-it` model is generally good at JSON, but always wrap parsing in try/except blocks and handle `JSONDecodeError`. Use Pydantic to validate the LLM's output.

## 4. Working with PostgreSQL (Neon)
- Use connection pooling provided by Neon.
- Always use Alembic for schema changes. Do not manually alter tables in the database GUI.

## 5. Working with React & Tailwind
- Keep components small and pure.
- Use Redux for global state (Complaints list, AI processing status). Use local state (`useState`) for simple UI toggles (e.g., dropdown open/close).
- Use Tailwind utility classes directly. Avoid writing custom CSS unless absolutely necessary.
