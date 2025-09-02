// FirebaseService.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onTokenRefresh,
  getToken,
  requestPermission,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

const FCM_PERMISSION_KEY = 'fcm_permission_asked';
const app = getApp();
const messaging = getMessaging(app);

console.log('All Firebase apps:', getApp());


class FirebaseService {
  static async requestUserPermissionOnce() {
    const alreadyAsked = await AsyncStorage.getItem(FCM_PERMISSION_KEY);
    if (alreadyAsked) return false;
    let authStatus;
    if (Platform.OS === 'ios') {
      authStatus = await requestPermission(messaging);
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
      authStatus = await requestPermission(messaging);
    }
    await AsyncStorage.setItem(FCM_PERMISSION_KEY, 'true');
    return (
      authStatus === 1 || // AUTHORIZED
      authStatus === 2    // PROVISIONAL
    );
  }

  static async getFcmToken() {
    try {
      const fcmToken = await getToken(messaging);
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    } catch (error) {
      console.log('Error getting FCM token:', error);
      return null;
    }
  }

  static listenForTokenRefresh(callback) {
    return onTokenRefresh(messaging, token => {
      console.log('FCM Token refreshed:', token);
      if (callback) callback(token);
    });
  }

  static onMessage(callback) {
    return onMessage(messaging, async remoteMessage => {
      console.log('FCM Foreground message:', remoteMessage);
      // Handle foreground notification here (show custom UI or alert if needed)
      if (callback) callback(remoteMessage);
    });
  }

  static setBackgroundMessageHandler(callback) {
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log('FCM Background message:', remoteMessage);
      // Handle background notification here (show custom UI or alert if needed)
      if (callback) callback(remoteMessage);
    });
  }

  static onNotificationOpenedApp(callback) {
    return onNotificationOpenedApp(messaging, remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      if (callback) callback(remoteMessage);
    });
  }

  static async checkInitialNotification(callback) {
    const remoteMessage = await getInitialNotification(messaging);
    if (remoteMessage) {
      console.log('Notification caused app to open from quit state:', remoteMessage);
      if (callback) callback(remoteMessage);
    }
  }

  static initFCM(onNotification) {
    // Foreground
    this.onMessage(onNotification);
    // Background
    this.setBackgroundMessageHandler(onNotification);
    // App opened from background
    this.onNotificationOpenedApp(onNotification);
    // App opened from quit/terminated
    this.checkInitialNotification(onNotification);
    // Token refresh
    this.listenForTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
    });
  }
}

export default FirebaseService; 