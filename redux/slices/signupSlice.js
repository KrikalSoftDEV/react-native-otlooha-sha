// redux/signUpSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {Platform} from 'react-native';
import { createNetworkAwareAPI } from '../utils/apiUtils';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';
import DeviceInfo from 'react-native-device-info';
import FirebaseService from '../../services/FirebaseService';

const initialState = {
  userType: 0,
  fullName: '',
  email: '',
  phone: '',
  myKadId: '',
};

// Async thunk to generate OTP
export const userRegistration = createAsyncThunk(
  'signup/userRegistration',
  async (
    {
      email,
      mobileNumber,
      countryCode = '+91',
      fullName,
      loginType,
      selectedLanguage,
      otp,
      icNo,
      companyName,
      isIndividualUser,
      isGuestUser,
    },
    {rejectWithValue, extra},
  ) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
              // Get FCM token
      const fcmToken = await FirebaseService.getFcmToken();
      // Get device unique ID and device name
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceName = await DeviceInfo.getDeviceName();

      const response = await api.post(
         `${BASE_URL}${ENDPOINTS.USER_REGISTRATION}`,
        {
          orgId: 4,
          fullName: fullName,
          uniqueId: isGuestUser?"":icNo,
          companyName: companyName,
          email: email,
          countryCode: countryCode,
          mobileNumber: mobileNumber,
          selectedLanguage: selectedLanguage,
          password:isGuestUser?"": '12341',
          loginType: isGuestUser?4:0,
          fcmToken:fcmToken||"",
          deviceId: deviceId||"",
          platformOS: Platform.OS,
          deviceName: deviceName||"",
          otp: isGuestUser?"":otp,
          // loginType: 0,
          isIndividualUser:isIndividualUser,
          isGuestUser:isGuestUser?true:false,
        },
      );
      console.log('-=-=----=-=-userRegistration_body', 
        {
          orgId: 4,
          fullName: fullName,
          uniqueId: isGuestUser?"":icNo,
          companyName: companyName,
          email: email,
          countryCode: countryCode,
          mobileNumber: mobileNumber,
          selectedLanguage: selectedLanguage,
          password:isGuestUser?"": '12341',
          loginType: isGuestUser?4:0,
          fcmToken:fcmToken||"",
          deviceId: deviceId||"",
          platformOS: Platform.OS,
          deviceName: deviceName||"",
          otp: isGuestUser?"":otp,
          // loginType: 0,
          isIndividualUser:isIndividualUser,
          isGuestUser:isGuestUser?true:false,
        },
      )
      console.log("-=-=--=-=-=userRegistration", response);
      
      return response.data;
    } catch (err) {
      console.log("-=-=--=-=-=userRegistration_err", err);
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



export const userEnrolement = createAsyncThunk(
  'login/logoutApi',
  async ({}, { getState, rejectWithValue, extra }) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
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
      });      
      return response.data;
    } catch (err) {
      // Check if it's a network error
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(err.response?.data || { message: 'Logout failed' });
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    resetSignupState: state => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userRegistration.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(userRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Signup failed';
      }).addCase(userEnrolement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userEnrolement.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(userEnrolement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'User enrollement failed';
      });
  },
});

export const {resetSignupState} = signupSlice.actions;

export default signupSlice.reducer;

