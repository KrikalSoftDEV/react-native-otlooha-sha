import NetInfo from '@react-native-community/netinfo';
import { storeData, getData } from '../constants/Storage';

class NetworkService {
  static listeners = [];
  static isConnected = true;
  static unsubscribe = null;
  static lastKnownState = null;

  /**
   * Initialize network monitoring
   */
  static init() {
    if (this.unsubscribe) return;
    
    this.unsubscribe = NetInfo.addEventListener(async state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected;
      
      // If network is lost, store the current state
      if (wasConnected && !this.isConnected) {
        try {
          // Store critical state data
          const userData = await getData('userDetail');
          const token = await getData('access_token');
          
          if (userData && token) {
            this.lastKnownState = {
              userData,
              token
            };
          }
        } catch (error) {
          console.error('Error storing state during network loss:', error);
        }
      }
      
      // Only notify listeners if connection state has changed
      if (wasConnected !== this.isConnected) {
        this.notifyListeners(this.isConnected);
      }
    });
  }

  /**
   * Add a listener for network state changes
   * @param {Function} listener - Callback function that receives isConnected boolean
   * @returns {Function} Function to remove the listener
   */
  static addListener(listener) {
    if (typeof listener !== 'function') return () => {};
    
    this.listeners.push(listener);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of network state change
   * @param {boolean} isConnected - Current connection state
   */
  static notifyListeners(isConnected) {
    this.listeners.forEach(listener => {
      try {
        listener(isConnected);
      } catch (error) {
        console.error('Error in network listener:', error);
      }
    });
  }

  /**
   * Check current network state
   * @returns {Promise<boolean>} Promise resolving to current connection state
   */
  static async checkConnection() {
    try {
      const state = await NetInfo.fetch();
      this.isConnected = state.isConnected;
      return this.isConnected;
    } catch (error) {
      console.error('Error checking network connection:', error);
      return false;
    }
  }

  /**
   * Get the last known state before network loss
   * @returns {Object|null} Last known state or null if not available
   */
  static getLastKnownState() {
    return this.lastKnownState;
  }

  /**
   * Clean up network monitoring
   */
  static cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners = [];
    this.lastKnownState = null;
  }
}

export default NetworkService;