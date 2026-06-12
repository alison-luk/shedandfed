import type { LogType } from './types';

export interface LogFormFields {
  type: LogType;
  notes: string;
  food: string;
  amount: string;
  hotSide: string;
  coolSide: string;
  ambient: string;
  weight: string;
}

export function validateLogForm(fields: LogFormFields): string | null {
  switch (fields.type) {
    case 'feeding':
      if (!fields.food.trim() && !fields.amount.trim()) {
        return 'Enter what was fed, an amount, or both.';
      }
      return null;

    case 'weight': {
      const value = fields.weight.trim();
      if (!value) {
        return 'Enter a weight value.';
      }
      if (Number.isNaN(Number(value)) || Number(value) <= 0) {
        return 'Enter a valid weight greater than zero.';
      }
      return null;
    }

    case 'temperature':
      if (!fields.hotSide.trim() && !fields.coolSide.trim() && !fields.ambient.trim()) {
        return 'Enter at least one temperature reading.';
      }
      return null;

    case 'note':
      if (!fields.notes.trim()) {
        return 'Write a note before saving.';
      }
      return null;

    case 'health':
      if (!fields.notes.trim()) {
        return 'Add health details before saving.';
      }
      return null;

    case 'shedding':
    case 'poop':
      return null;

    default:
      return null;
  }
}
