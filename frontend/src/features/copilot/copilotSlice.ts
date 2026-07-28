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
    const { form, riskAssessment, summary, warnings } = state.complaintDraft;
    
    const complaintContext = {
      summary: summary || "",
      severity: riskAssessment?.severity || form?.severity?.value || "",
      priority: riskAssessment?.priority || form?.priority?.value || "",
      customer_name: form?.customer_name?.value || "",
      product: form?.product_name?.value || "",
      batch_number: form?.batch_number?.value || "",
      risk_reason: riskAssessment?.rationale || "",
      warnings: warnings || [],
      missing_fields: state.complaintDraft.missingFields || []
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

import { resetComplaint } from '../complaints/complaintSlice';

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
    addCopilotMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        role: 'assistant',
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
      .addCase(resetComplaint, (state) => {
        state.messages = [];
      })
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

export const { toggleCopilot, addUserMessage, addCopilotMessage, clearChatHistory } = copilotSlice.actions;
export default copilotSlice.reducer;
