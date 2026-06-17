import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { getNextFeedingDueDate } from './care';
import type { Reptile, ReptileCareSummary } from './types';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null = null;
let handlerInitialized = false;

/**
 * Scheduled/push notifications are not available in Expo Go on Android (SDK 53+).
 * Due/overdue badges still work; only device notifications need a development build.
 */
export function areNotificationsAvailable(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }

  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return Platform.OS === 'ios';
  }

  return true;
}

export function getNotificationsUnavailableMessage(): string {
  if (Platform.OS === 'android' && Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return 'Push and local notifications are not supported in Expo Go on Android. Use a development build to enable feeding reminders, or rely on due/overdue badges in the app.';
  }

  return 'Notifications are not available on this device.';
}

async function getNotifications(): Promise<NotificationsModule | null> {
  if (!areNotificationsAvailable()) {
    return null;
  }

  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');

    if (!handlerInitialized) {
      notificationsModule.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      handlerInitialized = true;
    }
  }

  return notificationsModule;
}

function feedingNotificationId(reptileId: string): string {
  return `feeding-${reptileId}`;
}

async function ensureAndroidChannel(Notifications: NotificationsModule): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('feeding-reminders', {
    name: 'Feeding reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) {
    return false;
  }

  await ensureAndroidChannel(Notifications);

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function syncFeedingReminders(
  reptiles: Reptile[],
  summaries: Record<string, ReptileCareSummary>
): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) {
    return;
  }

  try {
    for (const reptile of reptiles) {
      const notificationId = feedingNotificationId(reptile.id);
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      if (!reptile.feedingRemindersEnabled || !reptile.feedingIntervalDays) {
        continue;
      }

      const lastFed = summaries[reptile.id]?.lastFed ?? null;
      const dueDate = getNextFeedingDueDate(lastFed, reptile.feedingIntervalDays);

      await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
          title: `Time to feed ${reptile.name}`,
          body: lastFed
            ? `${reptile.name} is due for feeding on your every-${reptile.feedingIntervalDays}-day schedule.`
            : `Set up feeding for ${reptile.name}.`,
          data: { reptileId: reptile.id },
          ...(Platform.OS === 'android' ? { channelId: 'feeding-reminders' } : {}),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: dueDate,
          ...(Platform.OS === 'android' ? { channelId: 'feeding-reminders' } : {}),
        },
      });
    }
  } catch (error) {
    console.warn('Could not sync feeding reminders', error);
  }
}

export async function cancelFeedingReminder(reptileId: string): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(feedingNotificationId(reptileId));
  } catch (error) {
    console.warn('Could not cancel feeding reminder', error);
  }
}
