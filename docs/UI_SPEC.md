# UI Specification

## Global Styles
- **Font:** Inter (Sans-serif)
- **Primary Color:** Tailwind `blue-600` (for primary actions)
- **Background:** Tailwind `gray-50`
- **Surface:** Tailwind `white` (for cards and modals)
- **Text:** Tailwind `gray-900` (headings), `gray-600` (body)

## Screens

### 1. Dashboard (`/`)
- **Header:** Logo, Page Title ("Complaint Dashboard"), User Profile icon.
- **KPI Cards:** Total Complaints, High Severity Complaints, Pending Review.
- **Action Button:** "New Complaint" (Primary, top right).
- **Data Table:** Columns for ID, Date, Product, Batch, Severity (Color coded badges), Status.

### 2. New Complaint (Ingestion) (`/complaints/new`)
- **Layout:** Two-column or centered card.
- **Tabs:** "Upload PDF" | "Paste Text".
- **Upload Area:** Drag-and-drop zone with a file icon.
- **Text Area:** Large textarea for raw text input.
- **Action Button:** "Analyze with AI" (Primary).
- **Loading State:** Spinner with dynamic text (e.g., "Extracting entities...", "Assessing risk...").

### 3. Complaint Review (`/complaints/review`)
- **Layout:** Two-column split screen.
  - **Left Column:** Original Document Viewer (PDF viewer or read-only text block).
  - **Right Column:** Editable Form & AI Insights.
- **Form Fields:** 
  - Customer Name (Input)
  - Product Name (Input)
  - Batch Number (Input)
  - Incident Date (Date Picker)
  - Description (Textarea)
- **Risk Assessment Card:**
  - Severity Badge (Red for Critical, Orange for High, Yellow for Medium, Green for Low).
  - Priority Badge.
  - Rationale Text Block.
- **Floating Action Button (FAB):** "Ask AI Copilot" (opens sidebar).
- **Action Buttons:** "Save Complaint" (Primary), "Cancel" (Secondary).

### 4. Copilot Sidebar
- **Header:** "Complaint Copilot" with a close (X) button.
- **Chat History:** Scrollable area showing User and AI messages.
- **Input Area:** Text input and a Send icon button.
- **Empty State:** "Ask me anything about this complaint, e.g., 'What is the main issue reported?'"

## States
- **Loading:** Skeletons for table rows, spinners for buttons.
- **Empty States:** "No complaints found. Click 'New Complaint' to start." in the dashboard.
- **Error States:** Red toast notifications for API failures. Form field validation errors highlighted with red borders and helper text.
