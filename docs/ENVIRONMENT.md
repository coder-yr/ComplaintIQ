# Environment Variables

The following environment variables must be configured in a `.env` file at the root of the backend directory (and frontend, if applicable).

## Backend (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for PostgreSQL (Neon). | `postgresql+asyncpg://user:password@ep-name.region.aws.neon.tech/dbname` |
| `GROQ_API_KEY` | API Key for Groq (used by LangGraph). | `gsk_...` |
| `CORS_ORIGINS` | Allowed origins for CORS. | `http://localhost:3000,https://production-url.com` |
| `ENVIRONMENT` | Running environment. | `development` or `production` |

## Frontend (`frontend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | The base URL for the FastAPI backend. | `http://localhost:8000/api/v1` |
