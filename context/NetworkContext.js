import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import NetworkService from '../services/NetworkService';
import { useDispatch } from 'react-redux';
import { setGlobalToken, setUserInfo } from '../redux/slices/appSlice';
import { storeData } from '../constants/Storage';

// Create context
const NetworkContext = createContext();

/**
 * NetworkProvider component that manages network connectivity state
 * and provides a snackbar notification when offline
 */
export const NetworkProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const dispatch = useDispatch();

  // Function to update connectivity state
  const setConnectivity = (offline) => {
    setIsOffline(offline);
  };

  // Function to restore state from last known state
  const restoreState = async () => {
    const lastKnownState = NetworkService.getLastKnownState();
    if (lastKnownState) {
      try {
        // Restore user data and token
        await storeData('userDetail', lastKnownState.userData);
        await storeData('access_token', lastKnownState.token);
        
        // Update Redux store
        dispatch(setGlobalToken(lastKnownState.token));
        dispatch(setUserInfo(lastKnownState.userData));
      } catch (error) {
        console.error('Error restoring state:', error);
      }
    }
  };

  useEffect(() => {
    // Initial check
    const checkConnection = async () => {
      const connected = await NetworkService.checkConnection();
      setIsOffline(!connected);
      
      // If offline, restore state
      if (!connected) {
        await restoreState();
      }
    };
    
    checkConnection();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(async state => {
      const wasOffline = isOffline;
      const isNowOffline = !state.isConnected;
      setIsOffline(isNowOffline);

      // If network was lost and is now regained, restore state
      if (wasOffline && !isNowOffline) {
        await restoreState();
      }
    });

    return () => {
      // Clean up subscription
      unsubscribe();
    };
  }, [isOffline]);

  return (
    <NetworkContext.Provider value={{ isOffline, setConnectivity }}>
      {children}
      {/* {isOffline && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No internet connection</Text>
        </View>
      )} */}
    </NetworkContext.Provider>
  );
};

// Custom hook to use the network context
export const useNetwork = () => useContext(NetworkContext);

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NetworkContext;