# Deployment Plan

## Development Environment
- **Frontend:** Localhost (Vite dev server)
- **Backend:** Localhost (Uvicorn with `--reload`)
- **Database:** Neon DB (Development Branch)

## Production Environment
- **Frontend Hosting:** Vercel (or Netlify)
- **Backend Hosting:** Render, Heroku, or AWS App Runner
- **Database Hosting:** Neon DB (Main Branch)

## Environment Variables
Ensure all variables listed in [ENVIRONMENT.md](./ENVIRONMENT.md) are securely added to the hosting platforms. Do not commit `.env` files.

## Deployment Flow
1. **Push to GitHub:** Developer pushes code to `main` branch.
2. **CI Pipeline:** GitHub Actions runs Pytest and Jest tests.
3. **Frontend CD:** Vercel automatically builds and deploys the React app.
4. **Backend CD:** Render automatically pulls the latest `main` branch, installs requirements, and runs the FastAPI server.
5. **Database Migrations:** An automated script runs `alembic upgrade head` during the backend deployment phase to ensure the DB schema is up-to-date.
