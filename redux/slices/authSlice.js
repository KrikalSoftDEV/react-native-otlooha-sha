// redux/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for normal login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://31.97.206.49:3001/api/user/login/email',
        { email, password, role },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return response.data; // should include token + user info
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Login failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    user: null,
    token: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    loginAsGuest: (state) => {
      state.user = {
        name: 'Guest User',
        role: 'guest',
      };
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token || action.payload.data?.token || null;
        state.user = action.payload.data || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout, loginAsGuest } = authSlice.actions;
export default authSlice.reducer;
