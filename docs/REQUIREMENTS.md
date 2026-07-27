# Requirements

## Must Have
- User ability to upload PDF documents containing complaints.
- User ability to paste raw text or email content for a complaint.
- AI extraction of key fields (Customer Name, Product, Batch Number, Date, Issue Description).
- Auto-population of the frontend complaint form based on AI extraction.
- AI-driven Risk Assessment (Severity, Priority).
- Relational database storage (PostgreSQL) for all complaints.
- AI Copilot chat interface for querying the current complaint context.
- Responsive web UI using TailwindCSS and Inter font.

## Should Have
- Dashboard listing all processed complaints with their risk scores.
- Ability for users to manually override/edit AI-extracted data before saving.
- Error handling for unreadable PDFs or unclear text.
- Loading states and progress indicators during AI processing.

## Nice to Have
- Duplicate complaint detection based on Batch Number and Issue.
- AI-suggested CAPA (Corrective and Preventive Action) steps.
- AI-suggested Root Cause categories.
- User authentication (JWT based).

## Bonus Features
- Export complaint summary to PDF.
- Email notifications for high-severity complaints.
- Audit logging of who saved or modified a complaint.
