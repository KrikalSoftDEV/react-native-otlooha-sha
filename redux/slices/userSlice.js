// redux/userSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { createNetworkAwareAPI } from '../utils/apiUtils';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';

// Async thunk to changeLanguageApi
export const changeLanguageApi = createAsyncThunk(
  'user/changeLanguageApi',
  async ({language}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.post(
          `${BASE_URL}${ENDPOINTS.UPDATE_USER_LANG}`,
        {
          language: language,
        },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      // Check if it's a network error
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || {message: 'Something went wrong'},
      );
    }
  },
);

// Async thunk to pushNotificationUpdateAPI
export const pushNotificationUpdateAPI = createAsyncThunk(
  'user/pushNotificationUpdateAPI',
  async ({isNotificationEnable}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.post(
         `${BASE_URL}${ENDPOINTS.UPDATE_PUSH_FLAG}`,
        {
          isPushNotificationEnabled: isNotificationEnable,
        },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      // Check if it's a network error
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || {message: 'Something went wrong'},
      );
    }
  },
);
// Async thunk to aboutUsConfigurationAPI
export const aboutUsConfigurationAPI = createAsyncThunk(
  'user/aboutUsConfigurationAPI',
  async ({}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.get(
                          `${BASE_URL}${ENDPOINTS.GET_CONFIG}?OrgId=4`,
        
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      // Check if it's a network error
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || {message: 'Something went wrong'},
      );
    }
  },
);
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async ({}, {getState, rejectWithValue, extra}) => {

    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;

      const response = await api.get(
        `${BASE_URL}${ENDPOINTS.USER_DETAILS}`,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response?.data;
    } catch (err) {
      // Check if it's a network error
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || {message: 'Something went wrong'},
      );
    }
  },
);
export const editUserProfile = createAsyncThunk(
  'signup/editUserProfile',
  async (
    {
      fullName,
      companyName
    },
    {getState, rejectWithValue, extra},
  ) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      const token = await getState().app.globalToken;
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      const requestBody={
          orgId: 4,
          fullName: fullName,
          companyName: companyName,
        }
      console.log("🚀 ~ requestBody: editUserProfile ", requestBody)
      
      const response = await api.post(
         `${BASE_URL}${ENDPOINTS.EDIT_USER_DETAILS}`,
          requestBody,  {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
          console.log("🚀 ~ response: editUserProfile ", response.data)
      return response.data;
    } catch (err) {
      // Check if it's a network error
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || {message: 'Something went wrong'},
      );
    }
  },
);
const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    data: null,
    profileData: null,
    error: null,
    verifyOtpResult: null,
  },
  reducers: {
    resetLoginState: state => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(changeLanguageApi.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeLanguageApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(changeLanguageApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(pushNotificationUpdateAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pushNotificationUpdateAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyOtpResult = action.payload;
      })
      .addCase(pushNotificationUpdateAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'OTP verification failed';
      })
      .addCase(aboutUsConfigurationAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(aboutUsConfigurationAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(aboutUsConfigurationAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload.data.result
        state.data = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(editUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const {resetLoginState} = userSlice.actions;
// export { generateOTP, verifyOTP };
export default userSlice.reducer;
