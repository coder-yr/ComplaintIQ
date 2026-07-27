import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export type ExtractionStatus = 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Retry';

export interface TimelineStage {
  id: string;
  label: string;
  status: ExtractionStatus;
  message?: string;
}

interface AIExtractionState {
  isProcessing: boolean;
  timeline: TimelineStage[];
  error: string | null;
}

const initialTimeline: TimelineStage[] = [
  { id: 'parser', label: 'Cleaning Text', status: 'Pending' },
  { id: 'cleaner', label: 'Extracting Fields', status: 'Pending' },
  { id: 'extractor', label: 'Validating', status: 'Pending' },
  { id: 'validator', label: 'Assessing Risk', status: 'Pending' },
  { id: 'risk', label: 'Generating Summary', status: 'Pending' },
  { id: 'summary', label: 'Preparing Copilot', status: 'Pending' },
  { id: 'copilot', label: 'Completed', status: 'Pending' }
];

const initialState: AIExtractionState = {
  isProcessing: false,
  timeline: initialTimeline,
  error: null,
};

export const startSSEExtraction = createAsyncThunk(
  'ai/startSSEExtraction',
  async (raw_text: string, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/complaints/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ raw_text })
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis stream');
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported by the browser');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let finalPayload: any = null;

      // Ensure timeline starts clean
      dispatch(resetExtraction());
      dispatch(updateStage({ id: 'parser', status: 'Running', message: 'Parsing document...' }));

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n'); // Correctly split by newline
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr) {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.status === 'Final') {
                    finalPayload = parsed.data;
                  } else if (parsed.status === 'Failed') {
                    throw new Error(parsed.message);
                  } else {
                    // Find which stage this maps to
                    const stageMatch = initialTimeline.find(t => t.label === parsed.status);
                    if (stageMatch) {
                      // Mark previous as completed, this one as running
                      dispatch(markPreviousCompleted(stageMatch.id));
                      dispatch(updateStage({ id: stageMatch.id, status: 'Running', message: parsed.message }));
                    }
                  }
                } catch (e: any) {
                  // Only catch JSON parse errors, rethrow others
                  if (e instanceof SyntaxError) {
                    console.error('Failed to parse SSE data', dataStr);
                  } else {
                    throw e;
                  }
                }
              }
            }
          }
        }
      }

      if (!finalPayload) {
        throw new Error('Analysis stream completed without returning final data');
      }

      // Mark the very last stage as completed
      dispatch(markAllCompleted());

      // We return the final payload so other slices can listen to this fulfilled action
      return finalPayload;
    } catch (err: any) {
      dispatch(markFailed());
      return rejectWithValue(err.message || 'Extraction failed');
    }
  }
);

const aiExtractionSlice = createSlice({
  name: 'aiExtraction',
  initialState,
  reducers: {
    resetExtraction(state) {
      state.isProcessing = true;
      state.error = null;
      state.timeline = initialTimeline.map(t => ({ ...t, status: 'Pending' }));
    },
    updateStage(state, action: PayloadAction<{ id: string; status: ExtractionStatus; message?: string }>) {
      const stage = state.timeline.find(t => t.id === action.payload.id);
      if (stage) {
        stage.status = action.payload.status;
        if (action.payload.message) stage.message = action.payload.message;
      }
    },
    markPreviousCompleted(state, action: PayloadAction<string>) {
      const idx = state.timeline.findIndex(t => t.id === action.payload);
      if (idx > 0) {
        state.timeline[idx - 1].status = 'Completed';
      }
    },
    markAllCompleted(state) {
      state.timeline.forEach(t => {
        t.status = 'Completed';
      });
      state.isProcessing = false;
    },
    markFailed(state) {
      // Find the first running stage and mark it failed
      const runningIdx = state.timeline.findIndex(t => t.status === 'Running');
      if (runningIdx !== -1) {
        state.timeline[runningIdx].status = 'Failed';
      }
      state.isProcessing = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSSEExtraction.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetExtraction, updateStage, markPreviousCompleted, markAllCompleted, markFailed } = aiExtractionSlice.actions;
export default aiExtractionSlice.reducer;
