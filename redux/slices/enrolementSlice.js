// redux/signUpSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {Platform} from 'react-native';
import {createNetworkAwareAPI} from '../utils/apiUtils';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';



// Async thunk to generate OTP
export const userEnrolementFunction = createAsyncThunk(
  'Donation/enrollUser',
  async (
    {
      name,
      email,
      phoneNumber,
      uniqueId,
      transactionNumber,
      companyName,
      isIndividualUser,
    },
    {rejectWithValue, extra},
  ) => {
    try {
      // Get setConnectivity from context if available
      const {setConnectivity} = extra || {};

      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);

      const response = await api.post(
        `${BASE_URL}${ENDPOINTS.ENROLE_USER}`,
        {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          uniqueId: uniqueId,
          transactionNumber:transactionNumber,
          companyName: companyName,
          isIndividualUser: isIndividualUser,
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

const enrolementSlice = createSlice({
  name: 'enrolement',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    userEnrolementState: state => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userEnrolementFunction.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userEnrolementFunction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(userEnrolementFunction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'User enrolement failed';
      });
  },
});

export const {userEnrolementState} = enrolementSlice.actions;

export default enrolementSlice.reducer;
