import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNetworkAwareAPI } from '../utils/apiUtils';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';

export const getEventList = createAsyncThunk(
  'event/getEventList',
  async (params = {}, { getState, rejectWithValue, extra }) => {
    try {
      const { setConnectivity } = extra || {};
      const api = createNetworkAwareAPI(setConnectivity);
      const token = await getState().app.globalToken;
      const response = await api.post(
        `${BASE_URL}${ENDPOINTS.GET_EVENT_LIST}`,
        {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 20,
          sortBy: params.sortBy || '',
          sortExpression: params.sortExpression || '',
          searchBy: '',
          searchValue: params.searchValue || '',
          orgId: params.orgId || 4,
          startDate: params.startDate || '',
          endDate: params.endDate || '',
        },
        {
          headers: {
            Authorization: token ? `${token}` : undefined,
            'Content-Type': 'application/json',
          },
        }
      );
      return response?.data?.data?.eventList;
    } catch (err) {
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

export const getEventDetails = createAsyncThunk(
  'event/getEventDetails',
  async (params = {}, { getState, rejectWithValue, extra }) => {
    try {
      const { setConnectivity } = extra || {};
      const api = createNetworkAwareAPI(setConnectivity);
      const token = await getState().app.globalToken;
      const response = await api.post(
         `${BASE_URL}${ENDPOINTS.GET_EVENT_DETAILS}`,
        {
          eventId: params.eventId,
          orgId: params.orgId || 4,
        },
        {
          headers: {
            Authorization: token ? `${token}` : undefined,
            'Content-Type': 'application/json',
          },
        }
      );
      return response?.data?.data;
    } catch (err) {
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

export const participateInEvent = createAsyncThunk(
  'event/participateInEvent',
  async (params = {}, { getState, rejectWithValue, extra }) => {
    try {
      const { setConnectivity } = extra || {};
      const api = createNetworkAwareAPI(setConnectivity);
      const token = await getState().app.globalToken;
      const response = await api.post(
       `${BASE_URL}${ENDPOINTS.PARTICIPENT_EVENT}`,
        {
          eventId: params.eventId,
          orgId: params.orgId || 4,
          isUserParticipated: true,
        },
        {
          headers: {
            Authorization: token ? `${token}` : undefined,
            'Content-Type': 'application/json',
          },
        }
      );
      return response?.data;
    } catch (err) {
      if (err.isNetworkError) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(
        err.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    loading: false,
    paginating: false,
    eventList: [],
    error: null,
    hasMore: true,
    eventDetails: null,
    eventDetailsLoading: false,
    eventDetailsError: null,
    participateInEventLoading: false,
    participateInEventError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEventList.pending, (state, action) => {
        state.error = null;
        if (action.meta.arg.pageNumber > 1) {
          state.paginating = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(getEventList.fulfilled, (state, action) => {
        state.loading = false;
        state.paginating = false;
        if (action.meta.arg.pageNumber === 1) {
          state.eventList = action.payload;
        } else {
          state.eventList.push(...action.payload);
        }
        if (action.payload.length < (action.meta.arg.pageSize || 20)) {
          state.hasMore = false;
        } else {
          state.hasMore = true;
        }
      })
      .addCase(getEventList.rejected, (state, action) => {
        state.loading = false;
        state.paginating = false;
        state.error = action.payload?.message || 'Failed to fetch events';
      })
      // Event Details
      .addCase(getEventDetails.pending, (state) => {
        state.eventDetailsLoading = true;
        state.eventDetailsError = null;
        state.eventDetails = null;
      })
      .addCase(getEventDetails.fulfilled, (state, action) => {
        state.eventDetailsLoading = false;
        state.eventDetails = action.payload;
      })
      .addCase(getEventDetails.rejected, (state, action) => {
        state.eventDetailsLoading = false;
        state.eventDetailsError = action.payload?.message || 'Failed to fetch event details';
        state.eventDetails = null;
      })
      .addCase(participateInEvent.pending, (state) => {
        state.participateInEventLoading = true;
        state.participateInEventError = null;
      })
      .addCase(participateInEvent.fulfilled, (state, action) => {
        state.participateInEventLoading = false;
        // Optionally, you can update eventDetails here if needed
      })
      .addCase(participateInEvent.rejected, (state, action) => {
        state.participateInEventLoading = false;
        state.participateInEventError = action.payload?.message || 'Failed to participate in event';
      });
  },
});

export default eventSlice.reducer; 