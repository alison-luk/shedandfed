import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getNextFeedingDueDate } from './care';
import type { Reptile, ReptileCareSummary } from './types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function feedingNotificationId(reptileId: string): string {
  return `feeding-${reptileId}`;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('feeding-reminders', {
    name: 'Feeding reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  await ensureAndroidChannel();

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
  if (Platform.OS === 'web') {
    return;
  }

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
}

export async function cancelFeedingReminder(reptileId: string): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(feedingNotificationId(reptileId));
}
