import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GOOGLE_API_KEY } from '../../constants/Config';

const API_KEY = 'AIzaSyBGfHgV2LSC1uZcwpgGqA04N2ilT9kJGdQ';
const CHANNEL_ID = 'UCyTilH3FcwJkQt63BT2a3cg';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

// Fetch videos (with optional search query and pagination)
export const fetchEdutainmentVideos = createAsyncThunk(
  'edutainment/fetchVideos',
  async ({ pageToken = '', q = '' } = {}, { rejectWithValue }) => {
    try {
      const params = {
        key: API_KEY,
        channelId: CHANNEL_ID,
        part: 'snippet',
        maxResults: 20,
        order: 'date',
        type: 'video',
      };
      if (pageToken) params.pageToken = pageToken;
      if (q) params.q = q;
      const response = await axios.get(BASE_URL, { params });
      // Map items to required format
      
      const videos = response.data.items.map(item => ({
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        type: 'video',
      }));
      return {
        videos,
        nextPageToken: response.data.nextPageToken || null,
        prevPageToken: response.data.prevPageToken || null,
        q,
        pageToken,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

// Fetch podcasts (YouTube playlists with podcastStatus enabled)
export const fetchEdutainmentPodcasts = createAsyncThunk(
  'edutainment/fetchPodcasts',
  async ({ pageToken = '', q = '' } = {}, { rejectWithValue }) => {
    try {
      const params = {
        key: API_KEY,
        channelId: CHANNEL_ID,
        part: 'snippet,contentDetails,status',
        maxResults: 20,
      };
      if (pageToken) params.pageToken = pageToken;
      const BASE_PLAYLIST_URL = 'https://www.googleapis.com/youtube/v3/playlists';
      const response = await axios.get(BASE_PLAYLIST_URL, { params });
      // Filter for podcastStatus enabled
      const podcasts = response.data.items
        .filter(item => item.status?.podcastStatus === 'enabled')
        .filter(item => !q || item.snippet.title.toLowerCase().includes(q.toLowerCase()))
        .map(item => ({
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
          playlistId: item.id,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          type: 'podcast',
        }));
      return {
        podcasts,
        nextPageToken: response.data.nextPageToken || null,
        prevPageToken: response.data.prevPageToken || null,
        q,
        pageToken,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

const edutainmentSlice = createSlice({
  name: 'edutainment',
  initialState: {
    videos: [],
    podcasts: [],
    loading: false,
    error: null,
    nextPageToken: null,
    prevPageToken: null,
    searchQuery: '',
    podcastSearchQuery: '',
    pageToken: '',
    podcastPageToken: '',
  },
  reducers: {
    clearVideos(state) {
      state.videos = [];
      state.nextPageToken = null;
      state.prevPageToken = null;
      state.pageToken = '';
      state.error = null;
    },
    clearPodcasts(state) {
      state.podcasts = [];
      state.nextPageToken = null;
      state.prevPageToken = null;
      state.podcastPageToken = '';
      state.error = null;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setPodcastSearchQuery(state, action) {
      state.podcastSearchQuery = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEdutainmentVideos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEdutainmentVideos.fulfilled, (state, action) => {
        state.loading = false;
        // If new search, replace; if paginating, append
        if (action.payload.pageToken && action.payload.pageToken !== '') {
          state.videos = [...state.videos, ...action.payload.videos];
        } else {
          state.videos = action.payload.videos;
        }
        state.nextPageToken = action.payload.nextPageToken;
        state.prevPageToken = action.payload.prevPageToken;
        state.searchQuery = action.payload.q;
        state.pageToken = action.payload.pageToken;
      })
      .addCase(fetchEdutainmentVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch videos';
      })
      .addCase(fetchEdutainmentPodcasts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEdutainmentPodcasts.fulfilled, (state, action) => {
        state.loading = false;
        // If new search, replace; if paginating, append
        if (action.payload.pageToken && action.payload.pageToken !== '') {
          state.podcasts = [...state.podcasts, ...action.payload.podcasts];
        } else {
          state.podcasts = action.payload.podcasts;
        }
        state.nextPageToken = action.payload.nextPageToken;
        state.prevPageToken = action.payload.prevPageToken;
        state.podcastSearchQuery = action.payload.q;
        state.podcastPageToken = action.payload.pageToken;
      })
      .addCase(fetchEdutainmentPodcasts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch podcasts';
      });
  },
});

export const { clearVideos, clearPodcasts, setSearchQuery, setPodcastSearchQuery } = edutainmentSlice.actions;
// export { fetchEdutainmentVideos, fetchEdutainmentPodcasts };
export default edutainmentSlice.reducer; 