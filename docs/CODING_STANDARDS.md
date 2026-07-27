# Coding Standards

## 1. General Principles
- **DRY (Don't Repeat Yourself):** Extract reusable logic into functions or components.
- **Single Source of Truth:** Rely on the `docs/` folder for architectural decisions.

## 2. Naming Conventions
- **Python (FastAPI):** `snake_case` for variables, functions, and file names. `PascalCase` for classes (Models, Pydantic Schemas).
- **JavaScript/React:** `camelCase` for variables and functions. `PascalCase` for React components and their file names (e.g., `ComplaintForm.jsx`).
- **Database (PostgreSQL):** `snake_case` for table names and column names. Table names should be plural (e.g., `complaints`).

## 3. Folder Structure
### Frontend (React)
```text
src/
  components/   # Reusable UI components (Buttons, Inputs)
  features/     # Redux slices and feature-specific components
  pages/        # Route components (Dashboard, Review)
  services/     # API client (Axios config)
  utils/        # Helper functions
```

### Backend (FastAPI)
```text
app/
  api/          # Route definitions
  core/         # Config, security, database setup
  models/       # SQLAlchemy models
  schemas/      # Pydantic models
  services/     # Business logic
  ai/           # LangGraph workflows and prompts
```

## 4. React / Redux Standards
- Use Functional Components and Hooks. Do not use Class components.
- Use Redux Toolkit (`createSlice`, `createAsyncThunk`).
- Avoid prop drilling; use Redux for deeply nested data.

## 5. Python / FastAPI Standards
- Use Type Hints extensively for Pydantic validation and IDE support.
- Keep route handlers (in `api/`) thin. Move business logic to `services/`.
- Format code using `black`.
- Sort imports using `isort`.

## 6. Documentation Standards
- Write docstrings for complex Python functions.
- Comment "WHY" not "WHAT" in the code.
- Update `CHANGELOG.md` when completing a significant feature.

## 7. Commit Message Standards
Use Conventional Commits format:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `style:` Changes that do not affect the meaning of the code (white-space, formatting)
- `test:` Adding missing tests
