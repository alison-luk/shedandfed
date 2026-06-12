export type LogType = 'feeding' | 'shedding' | 'temperature' | 'weight' | 'poop' | 'note';

export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

export interface Reptile {
  id: string;
  name: string;
  species: string;
  notes: string | null;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  reptileId: string;
  type: LogType;
  date: string;
  notes: string | null;
  food: string | null;
  amount: string | null;
  shedQuality: string | null;
  poopQuality: string | null;
  hotSide: number | null;
  coolSide: number | null;
  ambient: number | null;
  weight: number | null;
  weightUnit: WeightUnit | null;
}

export interface CreateReptileInput {
  name: string;
  species: string;
  notes?: string;
}

export interface UpdateReptileInput {
  id: string;
  name: string;
  species: string;
  notes?: string;
}

export interface CreateLogInput {
  reptileId: string;
  type: LogType;
  date: string;
  notes?: string;
  food?: string;
  amount?: string;
  shedQuality?: string;
  poopQuality?: string;
  hotSide?: number;
  coolSide?: number;
  ambient?: number;
  weight?: number;
  weightUnit?: WeightUnit;
}

export interface UpdateLogInput extends CreateLogInput {
  id: string;
}

export const LOG_TYPE_LABELS: Record<LogType, string> = {
  feeding: 'Feeding',
  shedding: 'Shedding',
  temperature: 'Temperature',
  weight: 'Weight',
  poop: 'Poop',
  note: 'Note',
};

export const LOG_TYPE_ICONS = {
  feeding: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  shedding: { ios: 'leaf', android: 'eco', web: 'eco' },
  temperature: { ios: 'thermometer.medium', android: 'thermostat', web: 'thermostat' },
  weight: { ios: 'scalemass', android: 'scale', web: 'scale' },
  poop: { ios: 'drop.fill', android: 'water-drop', web: 'water-drop' },
  note: { ios: 'note.text', android: 'note', web: 'note' },
} as const satisfies Record<LogType, { ios: string; android: string; web: string }>;
