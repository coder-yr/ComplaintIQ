# Implementation Milestones

## Milestone 1: Documentation (Done)
- [x] Create core documentation, specs, and ADRs.
- [x] Document AI Strategy and Constraints.

## Milestone 2: Project Setup (Done)
- [x] Initialize Git repository.
- [x] Setup FastAPI backend (`requirements.txt`).
- [x] Setup React frontend (Vite/Tailwind).
- [x] Configure Neon DB and Alembic.

## Milestone 3: Backend CRUD & Database
- [ ] Create SQLAlchemy models (Normalized Schema).
- [ ] Implement `POST /complaints` and `GET /complaints`.
- [ ] Add Pytest unit tests.

## Milestone 4: LangGraph AI Pipeline
- [ ] Build the 9-node LangGraph workflow.
- [ ] Implement Prompt Strategy & JSON Validation.
- [ ] Expose `POST /complaints/analyze`.

## Milestone 5: Frontend Interface
- [ ] Setup Redux slices.
- [ ] Build Dashboard and Ingestion views.
- [ ] Build Complaint Review Form and Copilot sidebar.

## Milestone 6: Integration
- [ ] Connect Frontend Thunks to FastAPI.
- [ ] Test End-to-End data flow (Upload -> Extract -> Save).

## Milestone 7: Demo & QA
- [ ] Run the AI Evaluation Plan.
- [ ] Fix edge cases and hallucinations.
- [ ] Record demo GIFs for README.

## Milestone 8: Deployment
- [ ] Deploy DB, Backend, and Frontend.
- [ ] Finalize production environment variables.
