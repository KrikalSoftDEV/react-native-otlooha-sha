import NetworkService from '../services/NetworkService';

/**
 * Wrapper for API calls that checks network connectivity before making the request
 * @param {Function} apiCall - The API call function to execute
 * @param {Object} params - Parameters to pass to the API call
 * @param {Function} onOffline - Optional callback to execute when offline
 * @returns {Promise} - Promise that resolves with API response or rejects with error
 */
export const withNetworkCheck = async (apiCall, params = {}, onOffline = null) => {
  // Check if network is connected
  const isConnected = await NetworkService.checkConnection();
  
  if (!isConnected) {
    // Execute offline callback if provided
    if (onOffline && typeof onOffline === 'function') {
      onOffline();
    }
    
    // Reject with network error
    return Promise.reject({
      message: 'No internet connection. Please check your network settings.',
      isNetworkError: true
    });
  }
  
  // Network is connected, proceed with API call
  try {
    return await apiCall(params);
  } catch (error) {
    // Check if error is due to network connectivity
    if (!await NetworkService.checkConnection()) {
      if (onOffline && typeof onOffline === 'function') {
        onOffline();
      }
      
      return Promise.reject({
        message: 'Connection lost during request. Please check your network settings.',
        isNetworkError: true,
        originalError: error
      });
    }
    
    // Not a network error, pass through
    return Promise.reject(error);
  }
};

/**
 * Example usage:
 * 
 * import { withNetworkCheck } from '../utils/apiUtils';
 * import { useLoading } from '../context/LoadingContext';
 * 
 * const { setConnectivity } = useLoading();
 * 
 * // In your component
 * const fetchData = async () => {
 *   try {
 *     const result = await withNetworkCheck(
 *       (params) => api.getData(params),
 *       { id: 123 },
 *       () => setConnectivity(true) // This runs when offline
 *     );
 *     // Handle success
 *   } catch (error) {
 *     if (error.isNetworkError) {
 *       // Already handled by the onOffline callback
 *     } else {
 *       // Handle other errors
 *     }
 *   }
 * };
 */