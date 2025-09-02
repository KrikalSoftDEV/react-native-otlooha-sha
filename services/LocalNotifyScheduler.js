import notifee, {
  AndroidImportance,
  TriggerType,
  RepeatFrequency,
  TimestampTrigger,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { prayerNotificationData } from '../screens/prayer/PryerHelper';


const STORAGE_KEY = 'lastScheduledDate';

// Helper to calculate future date
export function getFutureDateFromTime(timeString, dayOffset = 0) {
  const [hour, minute, second] = timeString.split(':').map(Number);
  const now = new Date();
  const date = new Date();

  date.setDate(now.getDate() + dayOffset);
  date.setHours(hour, minute, second || 0, 0);

  if (date <= now) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

export async function schedule7DaysNotifications(customData = null) {
  // console.log("Scheduling notifications...",customData);
  await notifee.requestPermission();

  // Create ONE channel without sound — we will override sound per-notification
  const baseChannelId = await notifee.createChannel({
    id: 'prayer_channel_v1',
    name: 'Prayer Notifications',
    importance: AndroidImportance.HIGH,
    sound: undefined, // system default if no override
  });

  const dataToUse = await customData;

  for (let day = 0; day < 7; day++) {
    for (let prayer of dataToUse) {
      // Skip if no alarm or silent
      if (prayer.alarm === 'None' || prayer.alarm === 'Silent') {
        continue;
      }

      const triggerDate = getFutureDateFromTime(prayer.alarmTime, day);
      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
      };

      // Decide which sound to use
      let soundToUse;
      if (prayer.alarm === 'Azan tone1') {
        soundToUse = 'azan1'; // file name in res/raw without extension
      } else if (prayer.alarm === 'Azan tone2') {
        soundToUse = 'azan2';
      } else if (prayer.alarm === 'Default') {
        soundToUse = undefined; // system default tone
      }

      await notifee.createTriggerNotification(
        {
          id: `${prayer.id}-${day}`,
          title: `🕌 ${prayer.name} Prayer Reminder`,
          body: `✨ Pause and connect with Allah. It's time for ${prayer.name} prayer at ${prayer.time}.`,
          android: {
            color: '#1976D2',
            channelId: baseChannelId,
            smallIcon: 'ic_launcher',
            pressAction: { id: 'default' },
            sound: soundToUse, // custom or default
          },
        },
        trigger
      );
    }
  }

  await AsyncStorage.setItem(STORAGE_KEY, new Date().toISOString());
}

// Re-schedule logic
export async function rescheduleIfDue() {
  const lastScheduled = await AsyncStorage.getItem(STORAGE_KEY);
  const now = new Date();

  if (!lastScheduled || new Date(lastScheduled).getTime() + 7 * 86400000 < now.getTime()) {
    await schedule7DaysNotifications();
  }
}
