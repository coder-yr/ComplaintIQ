# Non-Functional Requirements

## Performance
- **API Response Time:** All non-AI API endpoints must respond within 200ms.
- **AI Processing Time:** The LangGraph extraction and risk assessment workflow should complete within 5 seconds.
- **Frontend Rendering:** The UI must render within 1.5 seconds on average devices.

## Scalability
- **Database:** PostgreSQL on Neon must be configured to auto-scale compute resources based on load.
- **Backend:** FastAPI application must be stateless to allow horizontal scaling (multiple instances behind a load balancer).

## Maintainability
- **Code Quality:** Adhere strictly to the guidelines in [CODING_STANDARDS.md](./CODING_STANDARDS.md).
- **Documentation:** Inline documentation and API specs (Swagger/OpenAPI provided by FastAPI) must always be up-to-date.

## Security
- **Data Protection:** All API communication must use HTTPS (TLS 1.2+).
- **Authentication:** (If implemented) JWT tokens with short expiration (1 hour) and HTTP-only refresh tokens.
- **Injection Prevention:** SQLAlchemy ORM must be used for all queries to prevent SQL injection.

## Accessibility
- **Standards:** The React UI must comply with WCAG 2.1 AA standards.
- **Keyboard Navigation:** All interactive elements must be accessible via keyboard.
- **Screen Readers:** Appropriate ARIA labels must be used.

## Responsiveness
- **Devices:** The web application must be fully responsive, supporting desktop (1024px+) and tablet (768px - 1023px) views. Mobile views are supported but not primary.

## Reliability
- **Uptime:** Target 99.9% uptime during business hours.
- **Retries:** LangGraph workflows must implement automatic retries (max 3 attempts) for Groq API timeouts or 5xx errors.

## Logging
- **Format:** JSON formatted logs for machine readability.
- **Content:** Log all API requests (method, path, status, duration), excluding sensitive PII. Log all AI interactions and their latency.

## Monitoring
- **Health Checks:** Provide a `/health` endpoint in FastAPI checking DB connectivity and Groq API status.
