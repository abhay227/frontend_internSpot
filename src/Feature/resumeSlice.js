
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks
export const downloadResume = createAsyncThunk('resume/downloadResume', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://backendinternspot.onrender.com/api/users/resumes/download/${userId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resume.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    return true;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const saveResume = createAsyncThunk('resume/saveResume', async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://backendinternspot.onrender.com/api/users/resumes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    alert('Resume saved Successfully');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchResume = createAsyncThunk('resume/fetchResume', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://backendinternspot.onrender.com/api/users/resumes/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Initial state
const initialState = {
  resume: null,
  loading: false,
  error: null,
};

// Resume slice
const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearResume: (state) => {
      state.resume = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resume = action.payload;
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resume = action.payload;
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(downloadResume.pending, (state) => {
        state.downloadStatus = 'loading';
      })
      .addCase(downloadResume.fulfilled, (state) => {
        state.downloadStatus = 'success';
      })
      .addCase(downloadResume.rejected, (state, action) => {
        state.downloadStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearResume } = resumeSlice.actions;
export default resumeSlice.reducer;

