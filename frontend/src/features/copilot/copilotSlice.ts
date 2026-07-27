import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '../../store';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface CopilotState {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  error: string | null;
}

const initialState: CopilotState = {
  isOpen: false,
  messages: [],
  isTyping: false,
  error: null,
};

export const askCopilot = createAsyncThunk(
  'copilot/ask',
  async (message: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { extractedData, riskData, summary, warnings } = state.aiProcessing;
    
    const complaintContext = {
      summary: summary || "",
      severity: riskData?.severity || "",
      priority: riskData?.priority || "",
      customer_name: extractedData?.customer_name || "",
      product: extractedData?.product_name || "",
      batch_number: extractedData?.batch_number || "",
      risk_reason: riskData?.rationale || "",
      warnings: warnings || []
    };

    const recentHistory = state.copilot.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.text
    }));

    try {
      const response = await api.post('/complaints/copilot', {
        complaint: complaintContext,
        history: recentHistory,
        message: message
      });
      return response.data.data.reply;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to connect to Copilot.");
    }
  }
);

const copilotSlice = createSlice({
  name: 'copilot',
  initialState,
  reducers: {
    toggleCopilot(state) {
      state.isOpen = !state.isOpen;
    },
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        role: 'user',
        text: action.payload,
        timestamp: new Date().toISOString()
      });
    },
    clearChatHistory(state) {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(askCopilot.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(askCopilot.fulfilled, (state, action) => {
        state.isTyping = false;
        state.messages.push({
          role: 'assistant',
          text: action.payload,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(askCopilot.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload as string;
        state.messages.push({
          role: 'assistant',
          text: `Error: ${action.payload}`,
          timestamp: new Date().toISOString()
        });
      });
  }
});

export const { toggleCopilot, addUserMessage, clearChatHistory } = copilotSlice.actions;
export default copilotSlice.reducer;
