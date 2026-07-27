import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface AIProcessingState {
  isProcessing: boolean;
  progressMessage: string;
  extractedData: any | null;
  riskData: any | null;
  summary: string;
  confidenceScore: number;
  missingFields: string[];
  warnings: string[];
  error: string | null;
}

const initialState: AIProcessingState = {
  isProcessing: false,
  progressMessage: '',
  extractedData: null,
  riskData: null,
  summary: '',
  confidenceScore: 0,
  missingFields: [],
  warnings: [],
  error: null,
};

// We create an async thunk that we can manually dispatch and listen to updates
// To support progress messages, we will dispatch regular reducers from the component while this runs,
// OR since it's a single HTTP request, the component will handle the fake progress sequence while this is pending.

export const analyzeDocument = createAsyncThunk('ai/analyzeDocument', async (raw_text: string) => {
  const response = await api.post('/complaints/analyze', { raw_text });
  return response.data.data;
});

const aiProcessingSlice = createSlice({
  name: 'aiProcessing',
  initialState,
  reducers: {
    resetAIState() {
      return initialState;
    },
    setProgressMessage(state, action: PayloadAction<string>) {
      state.progressMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeDocument.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(analyzeDocument.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.extractedData = action.payload.extracted_data;
        state.riskData = action.payload.risk_assessment;
        state.summary = action.payload.summary;
        state.confidenceScore = action.payload.confidence_score;
        state.missingFields = action.payload.missing_fields;
        state.warnings = action.payload.warnings;
        state.progressMessage = 'Done';
      })
      .addCase(analyzeDocument.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.error.message || 'Failed to analyze document';
      });
  },
});

export const { resetAIState, setProgressMessage } = aiProcessingSlice.actions;
export default aiProcessingSlice.reducer;
