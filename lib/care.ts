import type { Reptile, ReptileCareSummary } from './types';

export type FeedingDueStatus = 'ok' | 'due_soon' | 'overdue';

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function daysSinceDate(iso: string): number {
  const then = startOfDay(new Date(iso));
  const now = startOfDay(new Date());
  return Math.floor((now.getTime() - then.getTime()) / 86_400_000);
}

export function formatRelativeTime(iso: string): string {
  const days = daysSinceDate(iso);

  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  const months = Math.round(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

export function getFeedingDueStatus(
  reptile: Pick<Reptile, 'feedingIntervalDays'>,
  lastFed: string | null
): FeedingDueStatus | null {
  if (!reptile.feedingIntervalDays) return null;

  if (!lastFed) return 'overdue';

  const daysSince = daysSinceDate(lastFed);
  if (daysSince >= reptile.feedingIntervalDays) return 'overdue';
  if (daysSince >= reptile.feedingIntervalDays - 1) return 'due_soon';
  return 'ok';
}

export function getNextFeedingDueDate(lastFed: string | null, intervalDays: number): Date {
  const due = lastFed ? new Date(lastFed) : new Date();
  if (lastFed) {
    due.setDate(due.getDate() + intervalDays);
  }
  due.setHours(9, 0, 0, 0);

  if (due.getTime() <= Date.now()) {
    const soon = new Date();
    soon.setMinutes(0, 0, 0);
    soon.setHours(soon.getHours() + 1);
    return soon;
  }

  return due;
}

export interface CareSummaryItem {
  key: 'fed' | 'shed' | 'poop';
  label: string;
  icon: 'restaurant' | 'eco' | 'water-drop';
  date: string | null;
  value: string;
}

/** Short, scannable label for last-care chips (e.g. Today, 3d ago, Never). */
export function formatCareWhen(iso: string | null): string {
  if (!iso) return 'Never';

  const days = daysSinceDate(iso);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? '1w ago' : `${weeks}w ago`;
  }

  const months = Math.round(days / 30);
  return months === 1 ? '1mo ago' : `${months}mo ago`;
}

export function getCareSummaryItems(summary: ReptileCareSummary): CareSummaryItem[] {
  return [
    {
      key: 'fed',
      label: 'Fed',
      icon: 'restaurant',
      date: summary.lastFed,
      value: formatCareWhen(summary.lastFed),
    },
    {
      key: 'shed',
      label: 'Shed',
      icon: 'eco',
      date: summary.lastShed,
      value: formatCareWhen(summary.lastShed),
    },
    {
      key: 'poop',
      label: 'Poop',
      icon: 'water-drop',
      date: summary.lastPoop,
      value: formatCareWhen(summary.lastPoop),
    },
  ];
}

export const FEEDING_INTERVAL_PRESETS = [3, 7, 14, 21, 30] as const;
