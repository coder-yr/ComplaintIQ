# Functional Requirements

## 1. Complaint Ingestion
**Description:** Users must be able to upload complaint documents or paste raw text.
**Inputs:** PDF files (max 10MB) or Text strings.
**Outputs:** Raw text extracted and sent to the AI processing pipeline.
**Validation:** Only `.pdf` extensions allowed for files. Text must be at least 10 characters long.
**Failure Cases:** Unsupported file types trigger an error message. Corrupt PDFs trigger a parsing error.

## 2. AI Data Extraction
**Description:** The system uses LangGraph and Groq API to extract specific fields from the raw text.
**Inputs:** Raw text string.
**Outputs:** Structured JSON containing: Customer Name, Product, Batch Number, Incident Date, Description.
**Validation:** JSON must conform to the expected schema (Pydantic validation).
**Failure Cases:** If the AI model fails to extract essential fields, it returns `null` for those fields, prompting the user for manual entry.

## 3. Auto-Population of Complaint Form
**Description:** The React frontend automatically populates the complaint form fields based on the AI's JSON output.
**Inputs:** Structured JSON from backend.
**Outputs:** Updated Redux state and populated form UI.
**Validation:** Data types must match form inputs.
**Failure Cases:** If network fails, the user is notified and can manually fill the form.

## 4. AI Risk Assessment
**Description:** The system analyzes the complaint description to determine severity and priority.
**Inputs:** Extracted Complaint Description, Product, Batch Number.
**Outputs:** JSON containing Severity (Low/Medium/High/Critical), Priority (Low/Medium/High), and a brief Rationale.
**Validation:** Severity and Priority must be within predefined enums.
**Failure Cases:** If the AI API times out, the system defaults to "Unassessed" and prompts for manual risk evaluation.

## 5. Complaint Copilot
**Description:** A chat interface where users can ask questions about the uploaded complaint (e.g., "Summarize the patient's reaction").
**Inputs:** User chat messages.
**Outputs:** AI-generated text responses based on the complaint context.
**Validation:** Chat inputs must not be empty.
**Failure Cases:** If context size exceeds model limits, the system returns an error asking the user to shorten the query.

## 6. Complaint Storage
**Description:** Save the reviewed complaint into the database.
**Inputs:** Finalized complaint form data (JSON).
**Outputs:** 201 Created response with Complaint ID.
**Validation:** Required fields must not be empty (Product, Batch, Description, Severity).
**Failure Cases:** Database connection errors return a 500 status code with a standard error message. Duplicate constraint violation on (Batch, Description) returns a 409 Conflict.
