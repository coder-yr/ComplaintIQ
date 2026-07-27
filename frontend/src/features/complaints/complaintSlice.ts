import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { startSSEExtraction } from '../ai/aiExtractionSlice';

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
  metadataInfo: null
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
      
      saveDraftToLocal(state);
    });
  }
});

export const { updateField, updateSummary, resetComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;
