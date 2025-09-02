// initPrayerNotifications.js
// Orchestrates notification setup, fetch, and scheduling for prayer times
import { AppState } from 'react-native';
import React from 'react';
import { setupNotifications } from './NotificationSetup';
import { fetchPrayerTimes } from './prayerTimes';
import { schedulePrayerNotifications } from './notificationScheduler';

let appState = AppState.currentState;
let initialized = false;

/**
 * Initializes and schedules prayer notifications.
 * Should be called on app launch and when app comes to foreground.
 */
export async function initPrayerNotifications() {
  await setupNotifications();
  const prayerTimes = await fetchPrayerTimes();
  await schedulePrayerNotifications(prayerTimes);
}

/**
 * Hooks into AppState to run initPrayerNotifications on launch/foreground only.
 * Call usePrayerNotificationInit() in your App.js or App.tsx.
 */
export function usePrayerNotificationInit() {
  React.useEffect(() => {
    // On mount, run once
    if (!initialized) {
      initPrayerNotifications();
      initialized = true;
    }
    // Listen for app foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        initPrayerNotifications();
      }
      appState = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);
} 