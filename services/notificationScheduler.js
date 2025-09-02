// notificationScheduler.js
// Schedules local notifications for prayer times using Notifee and date-fns
import notifee from '@notifee/react-native';
import { isAfter, set } from 'date-fns';

/**
 * Schedules notifications for the given prayer times (24h format, e.g. '03:21').
 * Only schedules notifications for times later than now (prevents past notifications).
 * @param {Object} prayerTimes - { Fajr, Dhuhr, Asr, Maghrib, Isha }
 * @param {Date} [baseDate=new Date()] - The date to schedule for (default: today)
 */
export async function schedulePrayerNotifications(prayerTimes, baseDate = new Date()) {
  const prayers = [
    { key: 'Fajr', title: 'Fajr', body: 'Time for Fajr prayer' },
    { key: 'Dhuhr', title: 'Dhuhr', body: 'Time for Dhuhr prayer' },
    { key: 'Asr', title: 'Asr', body: 'Time for Asr prayer' },
    { key: 'Maghrib', title: 'Maghrib', body: 'Time for Maghrib prayer' },
    { key: 'Isha', title: 'Isha', body: 'Time for Isha prayer' },
  ];

  // Cancel previous notifications for this channel
  await notifee.cancelAllNotifications();

  const now = new Date();

  for (const prayer of prayers) {
    const timeStr = prayerTimes[prayer.key]; // e.g. '03:21'
    if (!timeStr) { continue; }
    // Parse time string to Date object for today
    const [hour, minute] = timeStr.split(':').map(Number);
    const fireDate = set(baseDate, { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 });
    if (isAfter(fireDate, now)) {
      await notifee.createTriggerNotification(
        {
          title: prayer.title,
          body: prayer.body,
          android: {
            channelId: 'prayer-times',
            smallIcon: 'ic_launcher', // Ensure this icon exists in your project
          },
        },
        {
          type: notifee.TriggerType.TIMESTAMP,
          timestamp: fireDate.getTime(),
        }
      );
    }
  }
}

/**
 * Helper to manually reschedule notifications (e.g. after settings change)
 * @param {Object} prayerTimes
 * @param {Date} [baseDate]
 */
export async function reschedulePrayerNotifications(prayerTimes, baseDate) {
  await schedulePrayerNotifications(prayerTimes, baseDate);
} 