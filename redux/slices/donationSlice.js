// redux/donationSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {createNetworkAwareAPI} from '../utils/apiUtils';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';
import moment from 'moment';

// Async thunk to aboutUsConfigurationAPI
export const getDonationTypeMainPage = createAsyncThunk(
  'user/getDonationTypeMainPage',
  async ({}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.get(
          `${BASE_URL}${ENDPOINTS.GET_DONATION_CONFIG}?OrgId=4`,
        {
          headers: {
            // Authorization: `${token}`,
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
// Async thunk to getAppealDetails
export const getAppealDetails = createAsyncThunk(
  'user/getAppealDetails',
  async ({appealId, orgId}, {getState, rejectWithValue, extra}) => {
    try {
      const {setConnectivity} = extra || {};
      const api = createNetworkAwareAPI(setConnectivity);

      const token = await getState().app.globalToken;
      const response = await api.post(
               `${BASE_URL}${ENDPOINTS.VIEW_APP_DETAILS}`,
        {
          appealId: appealId,
          orgId: orgId,
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
// Async thunk to getdonationWidget
export const getdonationWidget = createAsyncThunk(
  'user/getdonationWidget',
  async ({appealId, orgId}, {getState, rejectWithValue, extra}) => {
    try {
      const {setConnectivity} = extra || {};
      const api = createNetworkAwareAPI(setConnectivity);

      const token = await getState().app.globalToken;
      const response = await api.post(
       `${BASE_URL}${ENDPOINTS.DONATION_WIDGET}`,
        {
          appealId: appealId,
          orgId: orgId,
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
// Async thunk to getTransactionList
export const getTransactionList = createAsyncThunk(
  'user/getTransactionList',
  async ({filterItem}, {getState, rejectWithValue, extra}) => {
    try {
      const {setConnectivity} = extra || {};
      const api = createNetworkAwareAPI(setConnectivity);
      const token = await getState().app.globalToken;
      const response = await api.post(
          `${BASE_URL}${ENDPOINTS.TRANSACTION_LIST_BY_MOBILEAND_EMAIL}`,
        {
          "pageNumber": 1,
          "pageSize": 10,
          "sortBy": "",
          "sortExpression": "",
          "searchBy": 0,
          "searchValue": "",
          "donationType": 0,
          "recurringType": filterItem?.frequency ? filterItem?.frequency : [],
          "donationTo": filterItem?.donationCategory ? filterItem?.donationCategory : [],
          "startDate": filterItem?.dateRange?.startDate ? moment(filterItem?.dateRange?.startDate, 'DD/MM/YYYY').format("YYYY-MM-DD") + "T18:29:59.999Z": "" ,
          "endDate": filterItem?.dateRange?.endDate ? moment(filterItem?.dateRange?.endDate, 'DD/MM/YYYY').format("YYYY-MM-DD") + "T18:29:59.999Z": "" , // filterItem?.dateRange?.endDate,
          "minimumAmount": 0,
          "maximumAmount": 0,
          "paymentMethod": filterItem?.paymentMethod ? filterItem?.paymentMethod : [],
          "donationToValues": []
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

// Async thunk to getTransactionFilterData
export const getTransactionFilterData = createAsyncThunk(
  'user/getTransactionFilterData',
  async ({}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.get(
      `${BASE_URL}${ENDPOINTS.GET_ORG_WISE_FILTER}`,       
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
const donationSlice = createSlice({
  name: 'user',
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
      .addCase(getAppealDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppealDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAppealDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getdonationWidget.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getdonationWidget.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getdonationWidget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getDonationTypeMainPage.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDonationTypeMainPage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getDonationTypeMainPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getTransactionList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTransactionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getTransactionFilterData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionFilterData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTransactionFilterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const {resetLoginState} = donationSlice.actions;
// export { generateOTP, verifyOTP };
export default donationSlice.reducer;
