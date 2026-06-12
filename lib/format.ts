import type { LogEntry } from './types';
import { LOG_TYPE_LABELS, TEMPERATURE_UNIT } from './types';

export function formatTemperature(value: number): string {
  return `${value}${TEMPERATURE_UNIT}`;
}

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

export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatSectionDate(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export interface LogDetailLine {
  label: string;
  value: string;
}

export function formatLogDetails(entry: LogEntry): LogDetailLine[] {
  const lines: LogDetailLine[] = [];

  switch (entry.type) {
    case 'feeding':
      if (entry.food) lines.push({ label: 'Food', value: entry.food });
      if (entry.amount) lines.push({ label: 'Amount', value: entry.amount });
      break;
    case 'shedding':
      if (entry.shedQuality) lines.push({ label: 'Quality', value: entry.shedQuality });
      break;
    case 'poop':
      if (entry.poopQuality) lines.push({ label: 'Quality', value: entry.poopQuality });
      break;
    case 'temperature':
      if (entry.hotSide != null) lines.push({ label: 'Hot side', value: formatTemperature(entry.hotSide) });
      if (entry.coolSide != null) lines.push({ label: 'Cool side', value: formatTemperature(entry.coolSide) });
      if (entry.ambient != null) lines.push({ label: 'Ambient', value: formatTemperature(entry.ambient) });
      break;
    case 'weight':
      if (entry.weight != null) {
        lines.push({ label: 'Weight', value: `${entry.weight} ${entry.weightUnit ?? 'g'}` });
      }
      break;
    case 'note':
      if (entry.notes) lines.push({ label: 'Note', value: entry.notes });
      break;
    case 'health':
      if (entry.healthCategory) lines.push({ label: 'Category', value: entry.healthCategory });
      break;
  }

  if (entry.notes && entry.type !== 'note' && entry.type !== 'health') {
    lines.push({ label: 'Notes', value: entry.notes });
  }

  if (entry.notes && entry.type === 'health') {
    lines.push({ label: 'Details', value: entry.notes });
  }

  if (lines.length === 0) {
    lines.push({ label: 'Entry', value: LOG_TYPE_LABELS[entry.type] });
  }

  return lines;
}

export function formatLogSummary(entry: LogEntry): string {
  return formatLogDetails(entry)
    .map((line) => `${line.label}: ${line.value}`)
    .join(' · ');
}

export interface LogSection {
  title: string;
  data: LogEntry[];
}

export function groupLogsByDate(logs: LogEntry[]): LogSection[] {
  const groups = new Map<string, LogEntry[]>();

  for (const log of logs) {
    const title = formatSectionDate(log.date);
    const existing = groups.get(title);
    if (existing) {
      existing.push(log);
    } else {
      groups.set(title, [log]);
    }
  }

  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}
