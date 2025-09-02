// redux/donationSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {createNetworkAwareAPI} from '../utils/apiUtils';
import res from '../../constants/res';
import { ALQURAN_BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';

// Async thunk to getQuranSurahList
export const getQuranSurahList = createAsyncThunk(
  'user/getQuranSurahList',
  async ({}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.get(`${ALQURAN_BASE_URL}${ENDPOINTS.SURAH}`, {
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

// Async thunk to getQuranSurahAyahList
export const getQuranSurahAyahList = createAsyncThunk(
  'user/getQuranSurahAyahList',
  async ({ayahsNumber}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.get(`${ALQURAN_BASE_URL}${ENDPOINTS.SURAH}/${ayahsNumber}/ar.alafasy`, {
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
// Async thunk to getQuranJuzAyahList http://api.alquran.cloud/v1/juz/1/ar.alafasy
export const getQuranJuzAyahList = createAsyncThunk(
  'user/getQuranJuzAyahList',
  async ({juzNumber}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      const response = await api.get(`${ALQURAN_BASE_URL}${ENDPOINTS.JUZ}/${juzNumber}/ar.alafasy`, {
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

export const getCalendarList = createAsyncThunk(
  'user/getCalendarList',
  async ({getMonth, getYear}, {getState, rejectWithValue, extra}) => {
    try {
      // Get setConnectivity from context if available
      const { setConnectivity } = extra || {};
      // Create network-aware API instance
      const api = createNetworkAwareAPI(setConnectivity);
      
      const token = await getState().app.globalToken;
      // const response = await api.get(`https://api.aladhan.com/v1/gToHCalendar/${getMonth}/${getYear}?calendarMethod=UAQ`, {
      const responseGetYear = await api.get(`https://api.aladhan.com/v1/currentIslamicYear`, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      }, 
      );
      const responseGetMonth = await api.get(`https://api.aladhan.com/v1/currentIslamicMonth`, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      }, 
      );
      const responseGetspecialDays = await api.get(`https://api.aladhan.com/v1/specialDays`, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      }, 
      );
      const response = await api.get(`https://api.aladhan.com/v1/gToHCalendar/${ getMonth}/${getYear}?calendarMethod=UAQ`, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      }, 
      );
      
      return {
        calendar: response.data,
        islamicMonth: responseGetMonth?.data?.data,
        islamicYear: responseGetYear?.data?.data,
        responseGetspecialDays: responseGetspecialDays?.data?.data
      };
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
// http://api.alquran.cloud/v1/surah/114/ar.alafasy
const quranSlice = createSlice({
  name: 'quran',
  initialState: {
    loading: false,
    quranListData: null,
    data: null,
    calendarData:null,
    error: null,
    verifyOtpResult: null,
    islamicMonth: null,
    islamicYear: null,
  },
  reducers: {
    resetLoginState: state => {
      state.loading = false;
      state.data = null;
      state.calendarData = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getQuranSurahList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuranSurahList.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("action.payload Sura", action.payload.data)
        state.quranListData = action.payload.data
        state.data = action.payload;
      })
      .addCase(getQuranSurahList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getQuranSurahAyahList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuranSurahAyahList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getQuranSurahAyahList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getQuranJuzAyahList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuranJuzAyahList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getQuranJuzAyahList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(getCalendarList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalendarList.fulfilled, (state, action) => {
        state.loading = false;
  state.data = action.payload.calendar;
  state.calendarData=action.payload.calendar.data || null;
  state.islamicMonth = action.payload.islamicMonth;
  state.islamicYear = action.payload.islamicYear;
  state.responseGetspecialDays = action.payload.responseGetspecialDays;
      })
      .addCase(getCalendarList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const {resetLoginState} = quranSlice.actions;
// export { generateOTP, verifyOTP };
export default quranSlice.reducer;
