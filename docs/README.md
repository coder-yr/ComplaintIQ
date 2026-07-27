# AI-Powered Customer Complaint Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![LangGraph](https://img.shields.io/badge/LangGraph-AI-orange)

## Current Progress
**Phase 2: Project Setup & Foundation (Completed)**
The project's architectural scaffolding is established. Frontend (React/Vite/Tailwind) and Backend (FastAPI/SQLAlchemy) are fully configured with CI/CD and Docker support. We are now ready to begin **Phase 3: Frontend (UI/UX Foundation)**.

## Project Overview
An AI-powered Customer Complaint Management System designed for the Pharmaceutical Manufacturing industry. The system streamlines the process of receiving, analyzing, and resolving customer complaints.

## Architecture
![Architecture Diagram](./assets/architecture.png)
*(Demo Architecture Image Placeholder)*
Please refer to [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) for detailed diagrams.

## Tech Stack
- **Frontend:** React, Redux Toolkit, TailwindCSS
- **Backend:** Python FastAPI
- **AI:** LangGraph, Groq API, gemma2-9b-it
- **Database:** PostgreSQL (Neon)

## Features
- Upload complaint PDFs
- Accept complaint emails/text
- AI-based structured information extraction
- Auto-filling complaint forms
- AI Risk Assessment
- AI Copilot for complaint-specific questions

## Screenshots
*(Placeholder for Upload Screen GIF)*
*(Placeholder for Copilot Chat GIF)*

## Documentation
- [API Documentation](./API_SPEC.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)

## Installation & Setup
1. Define environment variables (See [ENVIRONMENT.md](./ENVIRONMENT.md))
2. Start the FastAPI backend (`cd backend && uvicorn main:app`)
3. Start the React frontend (`cd frontend && npm run dev`)

## Roadmap
- [ ] Phase 1: Core extraction and risk assessment MVP.
- [ ] Phase 2: Direct email integration.
- [ ] Phase 3: Automated CAPA tracking and QMS integration.

## License
MIT License
