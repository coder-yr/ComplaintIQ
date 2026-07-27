import { configureStore } from '@reduxjs/toolkit';
import complaintsReducer from '../features/complaints/complaintsSlice';
import complaintDraftReducer from '../features/complaints/complaintSlice';
import uploadReducer from '../features/complaints/uploadSlice';
import aiExtractionReducer from '../features/ai/aiExtractionSlice';
import copilotReducer from '../features/copilot/copilotSlice';

export const store = configureStore({
  reducer: {
    complaints: complaintsReducer, // the list of existing complaints
    complaintDraft: complaintDraftReducer, // the current active complaint draft
    upload: uploadReducer,
    aiExtraction: aiExtractionReducer,
    copilot: copilotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
