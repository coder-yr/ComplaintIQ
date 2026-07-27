import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Complaint {
  id: string;
  complaint_number: string;
  customer_name: string | null;
  product_name: string | null;
  batch_number: string | null;
  incident_date: string | null;
  description: string;
  severity: string;
  priority: string;
  status: string;
  created_at: string;
}

interface ComplaintsState {
  list: Complaint[];
  currentComplaint: Complaint | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ComplaintsState = {
  list: [],
  currentComplaint: null,
  status: 'idle',
  error: null,
};

export const fetchComplaints = createAsyncThunk('complaints/fetchComplaints', async () => {
  const response = await api.get('/complaints');
  return response.data.items || [];
});

export const saveComplaint = createAsyncThunk('complaints/saveComplaint', async (complaintData: Partial<Complaint>) => {
  const response = await api.post('/complaints', complaintData);
  return response.data.data;
});

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearCurrentComplaint(state) {
      state.currentComplaint = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch complaints';
      })
      .addCase(saveComplaint.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { clearCurrentComplaint } = complaintsSlice.actions;
export default complaintsSlice.reducer;
