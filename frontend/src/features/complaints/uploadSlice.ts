import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UploadState {
  isUploading: boolean;
  rawText: string | null;
  fileName: string | null;
}

const initialState: UploadState = {
  isUploading: false,
  rawText: null,
  fileName: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploading(state, action: PayloadAction<boolean>) {
      state.isUploading = action.payload;
    },
    setUploadData(state, action: PayloadAction<{ rawText: string; fileName: string | null }>) {
      state.rawText = action.payload.rawText;
      state.fileName = action.payload.fileName;
      state.isUploading = false;
    },
    clearUpload(state) {
      state.rawText = null;
      state.fileName = null;
      state.isUploading = false;
    }
  }
});

export const { setUploading, setUploadData, clearUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
