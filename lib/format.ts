import type { LogEntry } from './types';
import { LOG_TYPE_LABELS } from './types';

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatLogSummary(entry: LogEntry): string {
  switch (entry.type) {
    case 'feeding':
      return [entry.food, entry.amount].filter(Boolean).join(' · ') || 'Feeding logged';
    case 'shedding':
      return entry.shedQuality ? `${entry.shedQuality} shed` : 'Shedding logged';
    case 'temperature': {
      const parts: string[] = [];
      if (entry.hotSide != null) parts.push(`Hot ${entry.hotSide}°`);
      if (entry.coolSide != null) parts.push(`Cool ${entry.coolSide}°`);
      if (entry.ambient != null) parts.push(`Ambient ${entry.ambient}°`);
      return parts.join(' · ') || 'Temperature logged';
    }
    case 'weight':
      return entry.weight != null
        ? `${entry.weight} ${entry.weightUnit ?? 'g'}`
        : 'Weight logged';
    case 'note':
      return entry.notes?.slice(0, 80) || 'Note added';
    default:
      return LOG_TYPE_LABELS[entry.type];
  }
}
