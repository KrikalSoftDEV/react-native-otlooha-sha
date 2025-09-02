// redux/loginSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {createNetworkAwareAPI} from '../utils/apiUtils';
import {storeData} from '../../constants/Storage';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';
// Remove unused import
// import { useLoading } from '../../context/LoadingContext';
// Async thunk to generate OTP
export const announcementList = createAsyncThunk(
  'Mobile/getAnnouncementsList',
  async (
    requestBody,
    {rejectWithValue, extra},
  ) => {
    try {
      // Get setConnectivity from context if available
      const {setConnectivity} = extra || {};

      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);

    
      console.log('🚀 ~ requestBody:  getAnnouncementsList', requestBody);
      const response = await api.post(
      `${BASE_URL}${ENDPOINTS.ANNOUNCEMENT_LIST}`,   
        requestBody,
      );
      console.log('🚀 ~ response : getAnnouncementsList', response.data);

      return response.data;
    } catch (err) {
      console.log('🚀 ~ err : getAnnouncementsList ', err);
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

export const announcementDetailsList = createAsyncThunk(
  'Mobile/getAnnouncementDetailsById',
  async (requestBody, {getState, rejectWithValue, extra}) => {
    console.log(requestBody,'check the body')
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;

      const response = await api.get(
        `${BASE_URL}${ENDPOINTS.ANNOUNCEMENT_LIST_BY_ID}?AnnouncementId=${requestBody}`,
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






const announcementSlice = createSlice({
  name: 'announcement',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(announcementList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(announcementList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(announcementList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Announcement list failed';
      }).addCase(announcementDetailsList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(announcementDetailsList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(announcementDetailsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'announcementDetailsList  failed';
      })
  },
});

// export { generateOTP, verifyOTP };
export default announcementSlice.reducer;
