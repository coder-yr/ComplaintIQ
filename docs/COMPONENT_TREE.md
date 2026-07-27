# Component Tree

Below is the conceptual React component hierarchy for the application.

```text
App
 ├── AppRouter
 │    ├── NavigationBar
 │    │    ├── Logo
 │    │    └── UserProfileMenu
 │    │
 │    ├── DashboardPage
 │    │    ├── DashboardHeader
 │    │    ├── KPIGrid
 │    │    │    └── KPICard (x3)
 │    │    └── ComplaintsTable
 │    │         ├── TableHeader
 │    │         ├── TableRow (xN)
 │    │         └── SeverityBadge
 │    │
 │    ├── NewComplaintPage
 │    │    ├── IngestionCard
 │    │    │    ├── Tabs (Upload / Text)
 │    │    │    ├── PDFUploader
 │    │    │    └── TextInputArea
 │    │    └── SubmitButton
 │    │
 │    └── ReviewComplaintPage
 │         ├── SplitLayout
 │         │    ├── DocumentViewer (Left Pane)
 │         │    │    └── PDFViewer / TextViewer
 │         │    └── FormPane (Right Pane)
 │         │         ├── ExtractedDataForm
 │         │         │    ├── InputField (Customer, Product, Batch)
 │         │         │    └── DatePicker
 │         │         ├── RiskAssessmentCard
 │         │         │    ├── SeveritySelect
 │         │         │    ├── PrioritySelect
 │         │         │    └── RationaleText
 │         │         └── FormActions (Save, Cancel)
 │         │
 │         └── AICopilotSidebar
 │              ├── ChatHeader
 │              ├── ChatMessageList
 │              │    └── ChatBubble (User/AI)
 │              └── ChatInput
 │
 └── ToastProvider
      └── ToastNotification
```

## Shared UI Components
- `Button`: Standardized button with variants (primary, secondary, danger, ghost).
- `InputField`: Wrapper for text inputs with labels and error states.
- `Card`: Container with white background and subtle shadow.
- `Spinner`: Loading indicator.
- `Badge`: Small color-coded label for statuses and severities.
