import React, {createContext, useState, useContext, useCallback, useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import NetworkService from '../services/NetworkService';
import Snackbar from '../components/UI/Snackbar';

const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectivityIssue, setConnectivityIssue] = useState(false);
  const [showNetworkSnackbar, setShowNetworkSnackbar] = useState(false);
  const flickerAnimation = new Animated.Value(1);

  // Configuration for flickering effect
  const flickerConfig = {
    duration: 500,
    minOpacity: 0.3,
    maxOpacity: 1,
  };

  // const startFlickering = useCallback(() => {
  //   Animated.sequence([
  //     Animated.timing(flickerAnimation, {
  //       toValue: flickerConfig.minOpacity,
  //       duration: flickerConfig.duration,
  //       easing: Easing.ease,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(flickerAnimation, {
  //       toValue: flickerConfig.maxOpacity,
  //       duration: flickerConfig.duration,
  //       easing: Easing.ease,
  //       useNativeDriver: true,
  //     }),
  //   ]).start((finished) => {
  //     if (finished && connectivityIssue) {
  //       startFlickering();
  //     }
  //   });
  // }, [connectivityIssue]);

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const startProcessing = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  const setConnectivity = useCallback((hasIssue) => {
    setConnectivityIssue(hasIssue);
    if (hasIssue) {
      // startFlickering();
      //setShowNetworkSnackbar(true);
    } else {
      //setShowNetworkSnackbar(false);
    }
  }, []);

  // Initialize network monitoring when component mounts
  useEffect(() => {
    NetworkService.init();
    
    // Add listener for network state changes
    const unsubscribe = NetworkService.addListener(isConnected => {
      setConnectivity(!isConnected);
    });
    
    // Check connection on mount
    NetworkService.checkConnection().then(isConnected => {
      setConnectivity(!isConnected);
    });
    
    return () => {
      unsubscribe();
      NetworkService.cleanup();
    };
  }, []);

  const value = {
    isLoading,
    isProcessing,
    connectivityIssue,
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
    flickerAnimation,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {/* <Snackbar
        visible={showNetworkSnackbar}
        message="No internet connection. Please check your network settings."
        type="error"
        duration={5000}
        onDismiss={() => setShowNetworkSnackbar(false)}
      /> */}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};