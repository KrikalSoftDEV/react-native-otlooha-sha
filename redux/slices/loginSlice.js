// redux/loginSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {createNetworkAwareAPI} from '../utils/apiUtils';
import {storeData} from '../../constants/Storage';
import FirebaseService from '../../services/FirebaseService';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';
// Remove unused import
// import { useLoading } from '../../context/LoadingContext';
// Async thunk to generate OTP
export const generateOTP = createAsyncThunk(
  'login/generateOTP',
  async (
    {email, mobileNumber, countryCode, isRegisteredUser, userName, uniqueId, isIndividualUser},
    {rejectWithValue, extra},
  ) => {
    try {
      // Get setConnectivity from context if available
      const {setConnectivity} = extra || {};

      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);

      const requestBody = {
        orgId: 4,
        email: email,
        mobileNumber: mobileNumber,
        countryCode: countryCode,
        fcmToken: '',
        deviceId: '',
        platformOS: '',
        deviceName: '',
        userName: userName,
        isRegisteredUser: isRegisteredUser,
         uniqueId: uniqueId,
         isIndividualUser: isIndividualUser
      };
      const response = await api.post(
       `${BASE_URL}${ENDPOINTS.GENERATE_OTP}`,
        requestBody,
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

// Async thunk to verify OTP
export const verifyOTP = createAsyncThunk(
  'login/verifyOTP',
  async ({mobileNumber, countryCode, otp, email}, {rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const {setConnectivity} = extra || {};

      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      const requestBody = {
        orgId: 4,
        email: email,
        countryCode: countryCode,
        mobileNumber: mobileNumber,
        otp: otp,
      };
      const response = await api.post(
     `${BASE_URL}${ENDPOINTS.VERIFY_OTP}`,
        requestBody,
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
// Async thunk to generate OTP

export const login = createAsyncThunk(
  'login/login',
  async (
    {email, mobileNumber, countryCode = '+91', otp, isManualLogin},
    {rejectWithValue, extra},
  ) => {
    try {
      // Get setConnectivity from context if available
      const {setConnectivity} = extra || {};

      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);

      // Get FCM token
      const fcmToken = await FirebaseService.getFcmToken();
      // Get device unique ID and device name
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceName = await DeviceInfo.getDeviceName();

      const requestBody = {
        email: email,
        countryCode: countryCode,
        mobileNumber: mobileNumber,
        password: '',
        otp: otp,
        fcmToken: fcmToken || '',
        deviceId: deviceId || '',
        platformOS: Platform.OS,
        deviceName: deviceName || '',
        isManualLogin: isManualLogin
      };

      const response = await api.post(
        `${BASE_URL}${ENDPOINTS.USER_LOGIN}`,
        requestBody,
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
// Async thunk to Logout
export const logoutApi = createAsyncThunk(
  'login/logoutApi',
  async ({}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const {setConnectivity} = extra || {};

      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);

      const token = await getState().app.globalToken;
      const response = await api.post(
              `${BASE_URL}${ENDPOINTS.USER_LOGOUT}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      await storeData('userData', response.data);
      return response.data;
    } catch (err) {
      // Check if it's a network error
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(err.response?.data || {message: 'Logout failed'});
    }
  },
);
const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    data: null,
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
      .addCase(generateOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(generateOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(verifyOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyOtpResult = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'OTP verification failed';
      })
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(logoutApi.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutApi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(logoutApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const {resetLoginState} = loginSlice.actions;
// export { generateOTP, verifyOTP };
export default loginSlice.reducer;
