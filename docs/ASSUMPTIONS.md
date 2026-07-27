# Assumptions & Open Questions

This document records the assumptions made during the architectural design phase.

## Confirmed Requirements
- Must use React, FastAPI, Neon (PostgreSQL), and LangGraph with Groq API (gemma2-9b-it).
- Primary function is to extract data, auto-fill forms, and perform risk assessment.

## Assumptions
- **PDF Parsing:** Assuming the PDFs are text-based and can be parsed using standard Python libraries (e.g., `PyPDF2` or `pdfplumber`). Scanned PDFs requiring OCR (like Tesseract) are assumed to be out of scope for the MVP unless specified otherwise.
- **Email Integration:** Assuming users will manually copy/paste email text into the system rather than the system directly hooking into an IMAP server for MVP.
- **User Authentication:** Assuming basic JWT authentication is sufficient, or that it is entirely out of scope for the MVP if the app is run on an internal, secured network. (Currently placed in 'Nice to Have').
- **Volume:** Assuming the volume of complaints per day is within the rate limits of the standard Groq API tier.

## Open Questions
1. Do we need 21 CFR Part 11 Compliance (Audit trails, Electronic Signatures) for this specific MVP?
2. What should happen if the AI completely fails to extract the required fields? (Currently assuming it falls back to manual entry).
3. Is there a specific taxonomy or predefined list for "Products" and "Batch Numbers" we should validate against, or are they free-text?
