export type LogType =
  | 'feeding'
  | 'shedding'
  | 'temperature'
  | 'weight'
  | 'poop'
  | 'note'
  | 'health';

export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';

export type HealthCategory =
  | 'Vet visit'
  | 'Medication'
  | 'Illness'
  | 'Checkup'
  | 'Injury'
  | 'Other';

export const HEALTH_CATEGORIES: HealthCategory[] = [
  'Vet visit',
  'Medication',
  'Illness',
  'Checkup',
  'Injury',
  'Other',
];

export interface Reptile {
  id: string;
  name: string;
  species: string;
  notes: string | null;
  imageUri: string | null;
  feedingIntervalDays: number | null;
  feedingRemindersEnabled: boolean;
  createdAt: string;
}

export interface ReptileCareSummary {
  reptileId: string;
  lastFed: string | null;
  lastShed: string | null;
  lastPoop: string | null;
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
  healthCategory: string | null;
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
  imageUri?: string | null;
  feedingIntervalDays?: number | null;
  feedingRemindersEnabled?: boolean;
}

export interface UpdateReptileInput {
  id: string;
  name: string;
  species: string;
  notes?: string;
  imageUri?: string | null;
  feedingIntervalDays?: number | null;
  feedingRemindersEnabled?: boolean;
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
  healthCategory?: string;
  hotSide?: number;
  coolSide?: number;
  ambient?: number;
  weight?: number;
  weightUnit?: WeightUnit;
}

export interface UpdateLogInput extends CreateLogInput {
  id: string;
}

export const TEMPERATURE_UNIT = '°C';

export const LOG_TYPE_LABELS: Record<LogType, string> = {
  feeding: 'Feeding',
  shedding: 'Shedding',
  temperature: 'Temperature',
  weight: 'Weight',
  poop: 'Poop',
  note: 'Note',
  health: 'Health',
};

/** Shorter labels for the quick-log grid so text stays centred under each icon. */
export const QUICK_LOG_LABELS: Record<LogType, string> = {
  feeding: 'Feeding',
  shedding: 'Shed',
  temperature: 'Temp',
  weight: 'Weight',
  poop: 'Poop',
  note: 'Note',
  health: 'Health',
};

export const LOG_TYPE_ICONS = {
  feeding: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  shedding: { ios: 'leaf', android: 'eco', web: 'eco' },
  temperature: { ios: 'thermometer.medium', android: 'thermostat', web: 'thermostat' },
  weight: { ios: 'scalemass', android: 'scale', web: 'scale' },
  poop: { ios: 'drop.fill', android: 'water-drop', web: 'water-drop' },
  note: { ios: 'note.text', android: 'note', web: 'note' },
  health: { ios: 'heart.text.square', android: 'medical-services', web: 'medical-services' },
} as const satisfies Record<LogType, { ios: string; android: string; web: string }>;
