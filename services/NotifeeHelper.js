import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
import { Platform } from 'react-native';

export async function showLocalNotification() {
    console.log("-==-=---=-=-=-=shivam");
    
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    lights: true,
    vibration: true,
  });
  await notifee.displayNotification({
    title: ':bell: Local Notification',
    body: 'This is a test notification!',
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      color: AndroidColor.RED,
      pressAction: {
        id: 'default',
      },
    },
  });
}





