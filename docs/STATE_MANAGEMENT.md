# State Management

## Redux Architecture
The frontend uses Redux Toolkit for centralized state management.

## Slices

### 1. `complaintsSlice`
Manages the state of complaints data, including the dashboard list and the currently viewed/edited complaint.

- **State Shape:**
  ```javascript
  {
    list: [], // Array of complaint objects
    currentComplaint: null, // Data for the currently active complaint
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null
  }
  ```
- **Actions:**
  - `fetchComplaints` (AsyncThunk)
  - `saveComplaint` (AsyncThunk)
  - `updateCurrentComplaintField` (Synchronous reducer for local form edits)
  - `clearCurrentComplaint`

### 2. `aiProcessingSlice`
Manages the state of the AI ingestion and analysis workflow.

- **State Shape:**
  ```javascript
  {
    isProcessing: boolean,
    progressMessage: string, // e.g., 'Extracting text...', 'Assessing risk...'
    extractedData: null,
    riskData: null,
    error: null
  }
  ```
- **Actions:**
  - `analyzeDocument` (AsyncThunk - posts to `/api/complaints/analyze`)
  - `resetAIState`

### 3. `copilotSlice`
Manages the conversational state of the AI Copilot.

- **State Shape:**
  ```javascript
  {
    isOpen: boolean,
    messages: [
      { role: 'user' | 'assistant', text: string, timestamp: string }
    ],
    isTyping: boolean
  }
  ```
- **Actions:**
  - `toggleCopilot`
  - `sendMessage` (AsyncThunk)
  - `clearChatHistory`

## Selectors
- `selectAllComplaints(state)`
- `selectCurrentComplaint(state)`
- `selectAIProcessingStatus(state)`
- `selectCopilotMessages(state)`

## Data Flow
1. User triggers an action (e.g., upload PDF).
2. Component dispatches `analyzeDocument`.
3. `aiProcessingSlice` enters 'loading' state, updating the UI with a spinner.
4. API responds; Thunk resolves.
5. Reducer updates `extractedData` and `riskData`.
6. Component maps this data to local form state or updates `currentComplaint` in `complaintsSlice`.
