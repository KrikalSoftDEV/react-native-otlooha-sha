/**
 * Waqaf An-Nur App with Network Connectivity Monitoring
 */
import 'react-native-gesture-handler'; // 👈 Must be at the top

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { createStore } from './redux/store';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import AppContent from './AppContent';
import { StripeService } from './services/StripeService';
import FirebaseService from './services/FirebaseService';
import { Alert, BackHandler, Platform, ToastAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePrayerNotificationInit } from './services/initPrayerNotifications';


/**
 * StoreProvider component that creates a Redux store with network context
 * This allows the network connectivity state to be shared with Redux thunks
 */
const StoreProvider = ({ children }) => {
  // Get network context to pass to Redux store
  const networkContext = useNetwork();
  
  // Create store with network context
  const store = createStore(networkContext);

  // Create notification channel (Android) ONCE
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        importance: 4, // HIGH importance

      },
      () => {}
    );
  }, []);
 // Initialize FCM listeners globally
FirebaseService.initFCM((remoteMessage) => {
  
  // Check if remoteMessage is valid and contains the notification payload
  if (remoteMessage && remoteMessage.notification) {
    // Optionally, check for other types of payloads like data
    const notificationTitle = remoteMessage.notification.title || 'New Notification';
    const notificationBody = remoteMessage.notification.body || 'You have a new message.';
    
    // Push notification for the foreground notification
    PushNotification.localNotification({
      channelId: 'default-channel-id', // Ensure you have created a channel before
      title: notificationTitle,
      message: notificationBody,
      // id: String(Date.now()) + Math.floor(Math.random() * 1000), // Optional: Unique ID
    });

    // If you want to navigate on notification click
    // Example (if you're using React Navigation):
    // if (remoteMessage.data && remoteMessage.data.screen) {
    //   navigation.navigate(remoteMessage.data.screen);
    // }
  }
});

// Ensure background and quit notifications are also handled
FirebaseService.setBackgroundMessageHandler((remoteMessage) => {
  // Similar handling for background notifications
  if (remoteMessage && remoteMessage.notification) {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: remoteMessage.notification.title || 'New Notification',
      message: remoteMessage.notification.body || 'You have a new message.',
    });
  }
});

FirebaseService.onNotificationOpenedApp((remoteMessage) => {
  // Handle notification when the app is opened from background
  if (remoteMessage && remoteMessage.data && remoteMessage.data.screen) {
    // Example: Navigate to a specific screen when a notification is clicked
    navigation.navigate(remoteMessage.data.screen);
  }
});

FirebaseService.checkInitialNotification((remoteMessage) => {
  // Handle notification when the app is launched from a quit state
  if (remoteMessage && remoteMessage.data && remoteMessage.data.screen) {
    navigation.navigate(remoteMessage.data.screen);
  }
})
    //  if (remoteMessage && remoteMessage.notification) {
    //     Alert.alert(
    //       remoteMessage.notification.title || 'Notification',
    //       remoteMessage.notification.body || ''
    //     );
    //   }
  // });

  // useEffect(() => {
  //   // Request notification permission once
  //   FirebaseService.requestUserPermissionOnce();

  //   // Handle foreground push notifications
  //   // const unsubscribe = FirebaseService.onMessage((remoteMessage) => {
  //   //   if (remoteMessage && remoteMessage.notification) {
  //   //     PushNotification.localNotification({
  //   //       channelId: 'default-channel-id',
  //   //       title: remoteMessage.notification.title || 'Notification',
  //   //       message: remoteMessage.notification.body || '',
  //   //     });
  //   //   }
  //   // });

  //   // Clean up the listener on unmount
  //   // return () => {
  //   //   if (unsubscribe) unsubscribe();
  //   // };
  // }, []);

  useEffect(() => {
    Orientation.lockToPortrait(); 

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

/**
 * Main App component that sets up providers
 * - NetworkProvider: Monitors network connectivity and shows offline notification
 * - StoreProvider: Creates Redux store with network context
 * - StripeService: Provides Stripe payment functionality
 * - AppContent: Contains the main app navigation and UI
 */
const App = () => {
  const backPressCount = useRef(0);

  // useEffect(() => {
  //   const backAction = () => {
  //     if (backPressCount.current === 0) {
  //       backPressCount.current += 1;
  //       if (Platform.OS === 'android') {
  //         ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
  //       }
  //       setTimeout(() => {
  //         backPressCount.current = 0;
  //       }, 2000);
  //       return true; // Prevent default behavior (do not exit)
  //     }
  //     BackHandler.exitApp(); // Exit app on second press
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   // Cleanup on unmount
  //   return () => backHandler.remove();
  // }, []);

  // Initialize prayer notifications on launch/foreground
  // usePrayerNotificationInit();
  return (
                 <GestureHandlerRootView style={{flex:1}}>
      <StoreProvider>
         <NetworkProvider>
        <StripeService>

          <AppContent />
       
        </StripeService>
        </NetworkProvider>
      </StoreProvider>
      </GestureHandlerRootView>
  
  );
};

export default App;