// NotificationSetup.js
// Handles notification permissions and channel setup for Notifee
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

/**
 * Requests notification permissions and creates Android channel if needed.
 * Call this before scheduling notifications.
 */
export async function setupNotifications() {
  // Request permissions (iOS: alert, sound, badge; Android: always granted)
  await notifee.requestPermission();

  if (Platform.OS === 'android') {
    // Create a channel (required for Android 8.0+)
    await notifee.createChannel({
      id: 'prayer-times',
      name: 'Prayer Times',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }
} 