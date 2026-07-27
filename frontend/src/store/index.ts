import { configureStore } from '@reduxjs/toolkit';
import complaintsReducer from '../features/complaints/complaintsSlice';
import aiProcessingReducer from '../features/ai/aiProcessingSlice';
import copilotReducer from '../features/copilot/copilotSlice';

export const store = configureStore({
  reducer: {
    complaints: complaintsReducer,
    aiProcessing: aiProcessingReducer,
    copilot: copilotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
