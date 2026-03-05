import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';

const initialState = {
  contents: [], 
  content: null, 
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// -----------------------------------------------------
// Async Thunk: Yeni İçerik Ekleme (Admin)
// -----------------------------------------------------
export const createContent = createAsyncThunk(
  'content/create',
  async (contentData, thunkAPI) => {
    try {
      return await contentService.createContent(contentData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    reset: (state) => {
      // Başlangıç durumuna temiz bir kopyalama yapıyoruz
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contents.push(action.payload);
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = contentSlice.actions;
export default contentSlice.reducer;