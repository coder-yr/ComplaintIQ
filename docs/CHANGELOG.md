# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- **Phase 3B:** Successfully integrated LangGraph and Groq LLM (gemma2-9b-it) AI workflow.
- Developed centralized `groq_client.py` for API retry logic, metrics gathering, and clean error handling.
- Added Prompts Manager (`app/ai/prompts/`) modularizing instructions into distinct semantic blocks.
- Constructed a 7-node sequential StateGraph containing Parser, Cleaner, Extractor, Validator, Risk, Summary, and Copilot Nodes.
- Implemented robust Dual-Validation Node checking structural integrity with Pydantic and Business Rules checking logic/validity.
- Built Hybrid Risk Engine utilizing keyword detection followed by LLM justification.
- Created `/api/v1/complaints/analyze` endpoint matching API specs for structured frontend consumption.
- Setup extensive unit tests utilizing `unittest.mock.AsyncMock` verifying workflow nodes cleanly.
- **Phase 3A:** Built foundational backend components using FastAPI and SQLAlchemy (Async).
- Implemented core domain models: `Product`, `Complaint`, `Attachment`, `AuditLog`.
- Configured Pydantic v2 schemas for APIs and mapped domain entities.
- Built Repository layer abstracting standard CRUD operations using async DB sessions.
- Developed Service layer implementing domain logic and automated complaint number generation (`CMP-YYYY-XXXXXX`).
- Unified error handling via FastAPI exception handlers and StandardResponse formats.
- Setup Alembic for handling asynchronous PostgreSQL migrations (`alembic revision --autogenerate`).
- Developed comprehensive test suite using `pytest-asyncio` with tests passing successfully.
- Implemented strict static analysis via `mypy` and `ruff`.

## [0.2.0] - Phase 2 Project Setup
### Added
- Created professional repository structure and root config files (`.gitignore`, `.editorconfig`, `.prettierrc`).
- Scaffolded Frontend (React, Vite, TS) with TailwindCSS v3 and shadcn/ui.
- Scaffolded Backend (FastAPI, Python 3.12) with Async SQLAlchemy and Alembic.
- Configured CI pipeline with GitHub actions for ESLint, TS Check, Black, Isort, Ruff, Mypy, and Pytest.
- Added `docker-compose.yml` and `Dockerfile`s for dev and prod environments.
- Defined AI folder structure and stubs (`state.py`, `types.py`, `constants.py`).

## [0.1.0] - Initial Documentation Phase
### Added
- Created `README.md` and `CONTEXT.md`.
- Created project specifications (`PROJECT_SPEC.md`, `REQUIREMENTS.md`, `FUNCTIONAL_REQUIREMENTS.md`, `NON_FUNCTIONAL_REQUIREMENTS.md`).
- Defined architecture (`SYSTEM_ARCHITECTURE.md`, `COMPONENT_TREE.md`, `STATE_MANAGEMENT.md`, `DATABASE.md`, `API_SPEC.md`).
- Defined AI workflow and prompts (`AI_WORKFLOW.md`, `PROMPTS.md`).
- Created project planning documents (`TASKS.md`, `ROADMAP.md`, `DEVELOPMENT_GUIDE.md`, `CODING_STANDARDS.md`, `DESIGN_DECISIONS.md`).
- Added testing, deployment, and environment guidelines (`TESTING_PLAN.md`, `DEPLOYMENT_PLAN.md`, `ENVIRONMENT.md`, `ASSUMPTIONS.md`, `CHANGELOG.md`).
