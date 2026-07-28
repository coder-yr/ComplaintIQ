<div align="center">
  
  # 💊 ComplaintIQ
  
  **AI-Powered Pharmaceutical Customer Complaint Management System**
  
  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://python.langchain.com/docs/langgraph"><img src="https://img.shields.io/badge/LangGraph-000000?style=for-the-badge&logo=python&logoColor=white" alt="LangGraph" /></a>
    <a href="https://groq.com/"><img src="https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>
  
  <p align="center">
    <a href="https://github.com/coder-yr/ComplaintIQ/blob/main/LICENSE"><img src="https://img.shields.io/github/license/coder-yr/ComplaintIQ?style=flat-square" alt="License" /></a>
    <a href="https://github.com/coder-yr/ComplaintIQ/stargazers"><img src="https://img.shields.io/github/stars/coder-yr/ComplaintIQ?style=flat-square" alt="GitHub stars" /></a>
  </p>

  <p align="center">
    <a href="#demo">View Demo</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a>
  </p>
</div>

---

## 📖 Project Overview

ComplaintIQ is an enterprise-grade AI-powered pharmaceutical complaint management system that automates the traditionally manual process of customer complaint handling. 

Quality Assurance (QA) teams can upload raw, unstructured data (like a PDF letter or an angry customer email). ComplaintIQ leverages a modular **LangGraph** AI workflow to automatically extract structured data, validate missing fields deterministically, calculate risk severity, and assist agents via a RAG-powered Copilot. The goal is to drastically reduce manual data entry while improving consistency, speed, and regulatory compliance.

---

## 📸 Screenshots

| Dashboard | Complaint Workspace |
| :---: | :---: |
| <img src="docs/assets/placeholder-dashboard.png" width="400" alt="Dashboard" /> | <img src="docs/assets/placeholder-workspace.png" width="400" alt="Workspace" /> |

| AI Extraction & Timeline | QA Copilot |
| :---: | :---: |
| <img src="docs/assets/placeholder-extraction.png" width="400" alt="AI Extraction" /> | <img src="docs/assets/placeholder-copilot.png" width="400" alt="AI Copilot" /> |

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **PDF Upload** | Extract text directly from customer uploaded PDFs or documents. |
| ✉️ **Email Parsing** | Paste raw, unstructured emails or call transcripts for instant parsing. |
| 🤖 **AI Extraction** | Pydantic-enforced LLM extraction of critical fields (Product, Batch, Dates). |
| ⚠️ **Risk Assessment** | Automated severity scoring based on pharmaceutical compliance rules. |
| ✅ **Validation Engine** | Deterministic Python rules to catch missing fields or AI hallucinations. |
| 📝 **AI Summary** | Instantly generates a concise executive brief of the complaint. |
| 💬 **AI Copilot** | Context-aware RAG assistant to answer questions about the specific complaint. |
| ⚡ **Real-Time Timeline** | Live UI updates powered by Server-Sent Events (SSE) streaming. |
| 🗄️ **Redux State** | Robust frontend state management preventing accidental data overwrites. |
| 📱 **Responsive UI** | Beautiful, accessible enterprise interface built with Tailwind & shadcn/ui. |

---

## 🏗️ Architecture

### System Flow
```mermaid
flowchart TD
    User([User]) -->|Uploads PDF/Text| React[React Frontend]
    React -->|HTTP POST| FastAPI[FastAPI Backend]
    FastAPI -->|Initializes| LangGraph[LangGraph StateGraph]
    LangGraph -->|Prompts & Schemas| Groq[Groq LLM API]
    Groq -->|Structured JSON| LangGraph
    LangGraph -->|SSE Stream| React
    React -->|Verifies & Saves| FastAPI
    FastAPI -->|SQLAlchemy| DB[(PostgreSQL)]
```

### Folder Architecture High-Level
```mermaid
graph LR
    Root[ComplaintIQ] --> Frontend[frontend/]
    Root --> Backend[backend/]
    Root --> Docs[docs/]
    Root --> Tests[tests/]
    
    Frontend --> React(React + Vite)
    Frontend --> Redux(Redux Toolkit)
    Frontend --> Tailwind(TailwindCSS)
    
    Backend --> FastAPI(FastAPI)
    Backend --> AI(LangGraph AI Nodes)
    Backend --> Models(SQLAlchemy)
```

---

## 🧠 AI Workflow (LangGraph)

Instead of relying on a single, massive LLM prompt, ComplaintIQ breaks the NLP task into a deterministic, modular pipeline using LangGraph. Every node has a **single responsibility**:

1. 🧹 **Cleaner**: Standardizes medical terminology and redacts Personally Identifiable Information (PII).
2. 🔍 **Extractor**: Uses strict Pydantic schemas to force the LLM to output a predictable JSON structure mapping raw text to exact complaint fields.
3. ⚖️ **Validator**: A deterministic Python script (no LLM). Runs strict business logic to flag missing mandatory fields (e.g., missing Batch Number) to prevent hallucinations.
4. 🚨 **Risk**: Assesses the severity of the complaint (Low, Medium, High, Critical) based on compliance standards.
5. 📝 **Summary**: Generates a 2-3 sentence executive brief.
6. 💬 **Copilot Context**: Packages the verified state for the Retrieval-Augmented Generation (RAG) assistant.

---

## 🔄 How It Works

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AI Pipeline
    participant Database

    User->>Frontend: 1. Upload PDF / Paste Text
    Frontend->>API: 2. Request AI Analysis
    API->>AI Pipeline: 3. Start LangGraph Workflow
    Note right of AI Pipeline: 4. AI Extraction<br/>5. Validation<br/>6. Risk<br/>7. Summary
    AI Pipeline-->>Frontend: SSE Stream (Real-Time Updates)
    Frontend-->>User: Populate Form & UI
    User->>Frontend: 8. Chat with QA Copilot (Resolve Missing Info)
    User->>Frontend: 9. Save Complaint
    Frontend->>API: HTTP POST
    API->>Database: Store Verified Record
```

---

## 📂 Folder Structure

```text
ComplaintIQ/
├── backend/                  # FastAPI Application
│   ├── alembic/              # Database Migrations
│   ├── app/
│   │   ├── ai/               # LangGraph Workflow & Nodes
│   │   ├── api/              # API Endpoints (Routers)
│   │   ├── core/             # Config & Security
│   │   ├── db/               # SQLAlchemy Setup
│   │   ├── models/           # DB Models
│   │   ├── schemas/          # Pydantic Schemas
│   │   └── services/         # Business Logic
│   └── tests/                # Pytest Suite
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/       # Shared UI (shadcn)
│   │   ├── features/         # Redux Slices (State)
│   │   ├── pages/            # View Components
│   │   └── services/         # API Clients
│   └── tailwind.config.js
├── docs/                     # Documentation & Assets
└── docker-compose.yml        # Container Orchestration
```

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/coder-yr/ComplaintIQ.git
cd ComplaintIQ
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
Ensure PostgreSQL is running, then run migrations:
```bash
cd ../backend
alembic upgrade head
```

### 5. Running the Application
**Backend (FastAPI):**
```bash
uvicorn app.main:app --reload
```
**Frontend (Vite):**
```bash
cd ../frontend
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` files in both the frontend and backend directories.

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

**Backend (`backend/.env`)**
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/complaintiq
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_secure_secret_key
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/ai/analyze` | Initiates LangGraph pipeline via SSE stream. |
| `POST` | `/api/v1/ai/copilot` | RAG-based context-aware Q&A for specific complaints. |
| `GET`  | `/api/v1/complaints` | Fetch paginated list of all saved complaints. |
| `POST` | `/api/v1/complaints` | Save a verified complaint to PostgreSQL. |
| `PUT`  | `/api/v1/complaints/{id}` | Update an existing complaint. |
| `DELETE`| `/api/v1/complaints/{id}`| Delete a complaint. |

---

## 🛠️ Technologies Used

| Category | Technologies |
|---|---|
| **Frontend Core** | React 18, TypeScript, Vite |
| **State & Data** | Redux Toolkit, React Query |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Framer Motion, Recharts |
| **Backend Core** | FastAPI, Python 3.10+, Uvicorn |
| **Database** | PostgreSQL, SQLAlchemy (Async), Alembic |
| **AI / NLP** | LangGraph, Groq API (Gemma 2 9B IT), Pydantic |
| **Infrastructure** | Server-Sent Events (SSE), Docker |

---

## 🧪 Testing

The platform ensures reliability through comprehensive testing:
- **Pytest:** Backend unit and integration testing.
- **React Testing Library:** Frontend component testing.
- **Type Checking:** Strict TypeScript enforcement.
- **Build Validation:** CI/CD pipeline readiness.

---

## 🔮 Future Improvements

- [ ] **Authentication & Authorization:** Implement JWT and Role-Based Access Control (RBAC).
- [ ] **Email Integration:** Automatically ingest complaints from a designated support inbox.
- [ ] **Advanced OCR:** Integrate Tesseract or AWS Textract for scanned handwritten documents.
- [ ] **Multi-language Support:** Automatic translation of international complaints.
- [ ] **Vector Database:** Add Pinecone or Milvus to search historical complaints for similar issues.
- [ ] **Audit Logs:** Track detailed modification history for regulatory compliance (21 CFR Part 11).
- [ ] **Notifications:** Email/Slack alerts for Critical severity complaints.

---

## 💡 Why ComplaintIQ? (Design Decisions)

* **Why LangGraph instead of one large prompt?** 
  Breaking the extraction into a directed state graph allows for isolated testing, easier debugging, and single-responsibility nodes. It prevents the LLM from becoming confused by too many instructions at once.
* **Why deterministic validation?** 
  In pharmaceuticals, AI hallucinations are dangerous. The Validator Node is written in pure Python to enforce rigid business rules, ensuring that the AI cannot invent a missing batch number.
* **Why Server-Sent Events (SSE)?** 
  AI pipelines take time (often 10-15 seconds). HTTP polling is inefficient. SSE provides a responsive, real-time UI that keeps the user engaged without freezing the browser.
* **Enterprise Focus:** 
  The app moves beyond a simple "chatbot" interface, focusing on structured data extraction, referential integrity (PostgreSQL), and complex state hydration (Redux).

---

## 🎥 Demo

* **Demo Video:** [Link to YouTube/Loom Demo]
* **Live Demo:** [Link to Hosted Application]
* *Note: Insert demo links when deployed.*

---

## 👨‍💻 Author

**Yash Ram**
* **LinkedIn:** [Insert LinkedIn URL]
* **GitHub:** [coder-yr](https://github.com/coder-yr)
* **Portfolio:** [Insert Portfolio URL]
* **Email:** [Insert Email Address]

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
