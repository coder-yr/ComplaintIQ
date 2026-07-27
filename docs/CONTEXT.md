# Project Context & Memory

## Business Context
The pharmaceutical industry (API & FDF Quality Management) requires strict compliance and rapid response to customer complaints. Manual processing is inefficient and risky. An AI-powered solution is needed to automate extraction, assess risk, and guide users through resolution.

## Assignment Summary
Build a full-stack AI-Powered Customer Complaint Management System using React, FastAPI, PostgreSQL (Neon), and LangGraph (with Groq API and gemma2-9b-it).

## Objectives
- Automate complaint data entry.
- Standardize risk assessment using AI.
- Enable conversational AI assistance for complaint resolution.

## Workflow
1. User uploads a complaint (PDF/Email/Text).
2. AI extracts structured information.
3. System auto-fills the complaint form.
4. AI performs a risk assessment.
5. User reviews, interacts with AI Copilot, and saves the complaint.
*(See [USER_FLOW.md](./USER_FLOW.md))*

## Architecture
- React Frontend (Redux, Tailwind)
- FastAPI Backend
- LangGraph AI Orchestration
- PostgreSQL (Neon) Database
*(See [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md))*

## Current Progress
- [x] Initial Documentation Created
- [ ] Project Setup
- [ ] Frontend Development
- [ ] Backend Development
- [ ] AI Integration

## Completed Milestones
- Phase 1: Documentation completed.

## Pending Milestones
- Phases 2-9 (Setup, Frontend, Backend, Database, LangGraph, AI, Testing, Deployment).

## Constraints
- Must strictly use the defined Tech Stack.
- Must use `gemma2-9b-it` via Groq API.
- All documents must act as the single source of truth.

## Important Decisions
- **LangGraph for AI:** Chosen for robust agentic workflows and state management.
- **Neon for PostgreSQL:** Chosen for serverless scalability.
- *(See [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md))*

## Tech Stack
- Frontend: React, Redux Toolkit, TailwindCSS, React Router, Axios, Inter Font
- Backend: Python FastAPI
- AI: LangGraph, Groq API, gemma2-9b-it
- Database: PostgreSQL (Neon)

## Folder Structure
```text
docs/           # Documentation (Source of Truth)
frontend/       # Client-side React app
backend/        # API services
ai/             # LangGraph workflows
```

## Design Philosophy
- **AI-First:** The system should assist the user at every step, minimizing manual data entry.
- **Clean UI:** Professional, intuitive, and accessible interface.
- **Robust API:** Fast, documented, and secure backend.

## Coding Standards
*(See [CODING_STANDARDS.md](./CODING_STANDARDS.md))*

## Open Questions
- What is the expected volume of complaints per day?
- Are there specific regulatory compliance standards (e.g., 21 CFR Part 11) required for the MVP?
*(See [ASSUMPTIONS.md](./ASSUMPTIONS.md))*

## Known Risks
- AI Hallucinations during extraction or Copilot chat.
- Rate limits on the Groq API.
- Parsing complex, unstructured, or scanned PDFs.

## Future Scope
- Integration with SAP or other ERP/QMS systems.
- Automated email responses to customers.
