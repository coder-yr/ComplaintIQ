# Testing Plan

## Testing Strategy
The testing strategy involves a combination of automated backend tests, automated frontend component tests, and manual end-to-end testing to ensure AI stability.

## Unit Tests
### Backend (Pytest)
- Test FastAPI routes with mocked DB sessions.
- Test Pydantic schemas for correct validation.
- Mock the LangGraph/Groq API calls to ensure the AI pipeline handles mock JSON correctly and triggers retries on mock timeouts.

### Frontend (Jest & React Testing Library)
- Test Redux reducers (especially `aiProcessingSlice` and `complaintsSlice`).
- Test that the Complaint Form populates correctly when provided with mock `extractedData`.
- Test UI component rendering (Buttons, Badges, Modals).

## Integration Tests
- Verify the connection between FastAPI and PostgreSQL (using a test database).
- Verify the LangGraph workflow can successfully parse a predefined set of text inputs using the live Groq API (run sparingly to avoid rate limits).

## Manual Testing
- **File Upload:** Upload various PDF formats (text-based and scanned if OCR is added).
- **Text Paste:** Paste messy, unstructured emails to see how well the AI extracts fields.
- **Risk Assessment:** Input complaints with varying degrees of severity (e.g., a typo on a label vs. a contaminated pill) to verify AI scoring consistency.

## Acceptance Testing
- Conducted by the QA lead or Product Owner.
- Review against the Success Criteria defined in [PROJECT_SPEC.md](./PROJECT_SPEC.md).
- Ensure UI matches the [UI_SPEC.md](./UI_SPEC.md).
