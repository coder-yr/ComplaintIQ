import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { startSSEExtraction } from '../ai/aiExtractionSlice';
import api from '../../services/api';
import { RootState } from '../../store';

export interface FieldMetadata {
  value: any;
  source: string;
  confidence: number;
  userEdited: boolean;
}

export interface ComplaintFormState {
  complaint_source: FieldMetadata;
  customer_name: FieldMetadata;
  product_name: FieldMetadata;
  product_strength: FieldMetadata;
  batch_number: FieldMetadata;
  manufacturing_date: FieldMetadata;
  expiry_date: FieldMetadata;
  quantity_affected: FieldMetadata;
  complaint_type: FieldMetadata;
  complaint_date: FieldMetadata;
  incident_date: FieldMetadata;
  description: FieldMetadata;
  severity: FieldMetadata;
  priority: FieldMetadata;
}

const emptyField = (): FieldMetadata => ({
  value: null,
  source: 'Manual',
  confidence: 0,
  userEdited: false
});

interface ComplaintState {
  form: ComplaintFormState;
  riskAssessment: any | null;
  summary: string;
  globalConfidenceScore: number;
  missingFields: string[];
  warnings: string[];
  errors: string[];
  metadataInfo: any | null;
  saveStatus: 'idle' | 'loading' | 'success' | 'error';
  saveError: string | null;
}

const getInitialForm = (): ComplaintFormState => ({
  complaint_source: emptyField(),
  customer_name: emptyField(),
  product_name: emptyField(),
  product_strength: emptyField(),
  batch_number: emptyField(),
  manufacturing_date: emptyField(),
  expiry_date: emptyField(),
  quantity_affected: emptyField(),
  complaint_type: emptyField(),
  complaint_date: emptyField(),
  incident_date: emptyField(),
  description: emptyField(),
  severity: emptyField(),
  priority: emptyField()
});

const initialState: ComplaintState = {
  form: getInitialForm(),
  riskAssessment: null,
  summary: '',
  globalConfidenceScore: 0,
  missingFields: [],
  warnings: [],
  errors: [],
  metadataInfo: null,
  saveStatus: 'idle',
  saveError: null
};

// Draft Auto-Save Helpers
const DRAFT_KEY = 'complaintIQ_draft';
export const saveDraftToLocal = (state: ComplaintState) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
};
export const loadDraftFromLocal = (): ComplaintState | null => {
  const data = localStorage.getItem(DRAFT_KEY);
  return data ? JSON.parse(data) : null;
};
export const clearDraftFromLocal = () => {
  localStorage.removeItem(DRAFT_KEY);
};

export const saveComplaint = createAsyncThunk(
  'complaint/save',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const form = state.complaintDraft.form;
    
    // Map form state to backend API request format
    const payload = {
      source: form.complaint_source.value || "Unknown",
      customer_name: form.customer_name.value || "Unknown",
      product_name: form.product_name.value || "Unknown",
      product_strength: form.product_strength.value,
      batch_number: form.batch_number.value,
      manufacturing_date: form.manufacturing_date.value,
      expiry_date: form.expiry_date.value,
      quantity_affected: form.quantity_affected.value ? parseInt(form.quantity_affected.value) : undefined,
      complaint_type: form.complaint_type.value || "General",
      complaint_date: form.complaint_date.value || new Date().toISOString().split('T')[0],
      incident_date: form.incident_date.value,
      description: form.description.value || "No description provided.",
      severity: form.severity.value || "LOW",
      priority: form.priority.value || "LOW",
      status: "OPEN"
    };

    try {
      const response = await api.post('/complaints', payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to save complaint");
    }
  }
);

const complaintSlice = createSlice({
  name: 'complaint',
  initialState: loadDraftFromLocal() || initialState,
  reducers: {
    updateField(state, action: PayloadAction<{ field: keyof ComplaintFormState; value: any }>) {
      const { field, value } = action.payload;
      if (state.form[field]) {
        state.form[field].value = value;
        state.form[field].userEdited = true;
        state.form[field].source = 'Manual';
        state.saveStatus = 'idle';
        saveDraftToLocal(state);
      }
    },
    updateSummary(state, action: PayloadAction<string>) {
      state.summary = action.payload;
      saveDraftToLocal(state);
    },
    resetComplaint() {
      clearDraftFromLocal();
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(startSSEExtraction.fulfilled, (state, action) => {
      const payload = action.payload;
      const extracted = payload.extracted_data || {};
      
      // Merge AI extraction only if user hasn't edited the field
      for (const [key, fieldData] of Object.entries(extracted)) {
        const k = key as keyof ComplaintFormState;
        if (state.form[k] && !state.form[k].userEdited) {
          state.form[k] = fieldData as FieldMetadata;
        }
      }

      state.riskAssessment = payload.risk_assessment;
      state.summary = payload.summary;
      state.globalConfidenceScore = payload.confidence_score;
      state.missingFields = payload.missing_fields || [];
      state.warnings = payload.warnings || [];
      state.errors = payload.errors || [];
      state.metadataInfo = payload.metadata || {};
      state.saveStatus = 'idle';
      
      saveDraftToLocal(state);
    });
    
    // Save Complaint Cases
    builder.addCase(saveComplaint.pending, (state) => {
      state.saveStatus = 'loading';
      state.saveError = null;
    });
    builder.addCase(saveComplaint.fulfilled, (state) => {
      state.saveStatus = 'success';
      clearDraftFromLocal();
    });
    builder.addCase(saveComplaint.rejected, (state, action) => {
      state.saveStatus = 'error';
      state.saveError = action.payload as string;
    });
  }
});

export const { updateField, updateSummary, resetComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;
