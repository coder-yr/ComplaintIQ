# Development Roadmap

## Phase 1: Documentation (Done)
- Fully specify the project scope, architecture, and design decisions.
- **Outcome:** A comprehensive `docs/` directory acting as the source of truth.

## Phase 2: Project Setup (Done)
- Initialize repositories, install dependencies, and setup the fundamental structural bones for React, FastAPI, and PostgreSQL (Neon).

## Phase 3: Frontend (UI/UX Foundation)
- Build static components using TailwindCSS.
- Setup Redux state management.
- Implement React Router navigation.

## Phase 4: Backend (API Foundation & Database)
- Configure SQLAlchemy and Alembic.
- Build standard CRUD endpoints for Complaints.
- Validate inputs using Pydantic.

## Phase 5: Database Schema
- Finalize schema implementation.
- Setup Neon environments (dev/prod).

## Phase 6: LangGraph & Groq AI
- Implement the stateful AI pipeline.
- Write and test prompts.
- Ensure strict JSON parsing from the LLM.

## Phase 7: AI Integration (End-to-End)
- Connect frontend Redux Thunks to FastAPI.
- Pass AI extracted data seamlessly to the UI form.
- Implement the Copilot chat functionality.

## Phase 8: Testing
- Unit testing (Pytest for backend, Jest/RTL for frontend).
- E2E testing.
- Manual QA focusing on AI edge cases.

## Phase 9: Deployment
- CI/CD pipeline setup.
- Deploy DB, Backend, and Frontend to cloud providers.
- Production readiness review.
