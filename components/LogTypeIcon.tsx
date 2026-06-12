import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { LogType } from '@/lib/types';

const ICON_NAMES: Record<LogType, keyof typeof MaterialIcons.glyphMap> = {
  feeding: 'restaurant',
  shedding: 'eco',
  temperature: 'thermostat',
  weight: 'monitor-weight',
  note: 'sticky-note-2',
};

interface LogTypeIconProps {
  type: LogType;
  size?: number;
  color: string;
}

export default function LogTypeIcon({ type, size = 24, color }: LogTypeIconProps) {
  return <MaterialIcons name={ICON_NAMES[type]} size={size} color={color} />;
}
