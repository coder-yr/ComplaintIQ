# Security Guidelines

## 1. API Key Management
- Never commit API keys (Groq, Neon) to version control.
- Use `.env` files locally and secure environment variables in production.

## 2. Prompt Injection Prevention
- All user inputs sent to the LLM are treated as untrusted.
- System prompts are strictly separated from user inputs.
- We do not allow the LLM to execute code or directly query the database.

## 3. Input Validation
- FastAPI/Pydantic strictly validates all incoming API requests.
- File uploads are restricted to `.pdf` and size-limited (10MB) to prevent DoS.

## 4. Rate Limiting
- Implement rate limiting on the FastAPI `/analyze` endpoint to prevent API abuse and Groq budget exhaustion.

## 5. Web Security
- **CORS:** Restrict CORS origins to the known frontend domains.
- **XSS Protection:** React automatically escapes variables in JSX. Avoid `dangerouslySetInnerHTML`.
- **SQL Injection:** SQLAlchemy ORM parameterizes all queries, preventing SQL injection.
