import axios from 'axios';
import NetworkService from '../../services/NetworkService';

/**
 * Create an axios instance with network connectivity check
 * @param {Function} setConnectivity - Function to update connectivity state
 * @returns {Object} - Axios instance with interceptors
 */
export const createNetworkAwareAPI = (setConnectivity) => {
  const api = axios.create();

  // Request interceptor
  api.interceptors.request.use(
    async (config) => {
      // Check network connectivity before making request
      const isConnected = await NetworkService.checkConnection();
      
      if (!isConnected) {
        // Update app state to show we're offline
        if (setConnectivity) {
          setConnectivity(true);
        }
        
        // Reject the request with a network error
        return Promise.reject({
          message: 'No internet connection. Please check your network settings.',
          isNetworkError: true
        });
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      // If we get a response, we're online
      if (setConnectivity) {
        setConnectivity(false);
      }
      return response;
    },
    async (error) => {
      // Check if error is due to network connectivity
      if (error.message === 'Network Error' || !await NetworkService.checkConnection()) {
        if (setConnectivity) {
          setConnectivity(true);
        }
        
        return Promise.reject({
          message: 'Connection lost during request. Please check your network settings.',
          isNetworkError: true,
          originalError: error
        });
      }
      
      return Promise.reject(error);
    }
  );

  return api;
};

/**
 * Example usage in Redux slice:
 * 
 * import { createNetworkAwareAPI } from '../utils/apiUtils';
 * 
 * export const someApiCall = createAsyncThunk(
 *   'slice/someApiCall',
 *   async (params, thunkAPI) => {
 *     try {
 *       const { setConnectivity } = thunkAPI.extra;
 *       const api = createNetworkAwareAPI(setConnectivity);
 *       
 *       const response = await api.post('https://api.example.com/endpoint', params);
 *       return response.data;
 *     } catch (error) {
 *       if (error.isNetworkError) {
 *         // Network error already handled by interceptor
 *         return thunkAPI.rejectWithValue(error.message);
 *       }
 *       return thunkAPI.rejectWithValue('An error occurred');
 *     }
 *   }
 * );
 */