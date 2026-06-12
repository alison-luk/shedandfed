import { Link, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import LogTypeIcon from '@/components/LogTypeIcon';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import { QUICK_LOG_LABELS, type LogType } from '@/lib/types';

const QUICK_LOG_TYPES: LogType[] = [
  'feeding',
  'poop',
  'shedding',
  'temperature',
  'weight',
  'note',
];

/** One-tap log with sensible defaults; long-press opens the full form. */
const INSTANT_LOG_TYPES = new Set<LogType>(['poop']);

const ICON_SIZE = 48;
const COLUMN_WIDTH = 64;

interface LogQuickActionsProps {
  reptileId: string;
  onLogAdded?: () => void | Promise<void>;
}

interface QuickLogButtonProps {
  label: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  children: ReactNode;
}

function QuickLogButton({
  label,
  accessibilityLabel,
  accessibilityHint,
  disabled,
  onPress,
  onLongPress,
  children,
}: QuickLogButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={onLongPress ? 400 : undefined}
      style={({ pressed }) => [styles.action, { opacity: pressed ? 0.75 : 1 }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.tint }]}>{children}</View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function LogQuickActions({ reptileId, onLogAdded }: LogQuickActionsProps) {
  const router = useRouter();
  const { addLog } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [savingType, setSavingType] = useState<LogType | null>(null);

  async function handleInstantLog(type: LogType) {
    if (savingType) return;

    setSavingType(type);
    try {
      await addLog({
        reptileId,
        type,
        date: new Date().toISOString(),
        poopQuality: type === 'poop' ? 'Normal' : undefined,
      });
      await onLogAdded?.();
    } finally {
      setSavingType(null);
    }
  }

  function openLogForm(type: LogType) {
    router.push(`/reptile/${reptileId}/add-log?type=${type}`);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Quick Log</Text>
      <View style={styles.grid}>
        {QUICK_LOG_TYPES.map((logType) => {
          const label = QUICK_LOG_LABELS[logType];
          const isInstant = INSTANT_LOG_TYPES.has(logType);
          const isSaving = savingType === logType;
          const icon = isSaving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <LogTypeIcon type={logType} size={22} color="#fff" />
          );

          if (isInstant) {
            return (
              <View key={logType} style={styles.cell}>
                <QuickLogButton
                  label={label}
                  accessibilityLabel={`Log ${label.toLowerCase()} now`}
                  accessibilityHint="Long press for more options"
                  disabled={Boolean(savingType)}
                  onPress={() => handleInstantLog(logType)}
                  onLongPress={() => openLogForm(logType)}>
                  {icon}
                </QuickLogButton>
              </View>
            );
          }

          return (
            <View key={logType} style={styles.cell}>
              <Link href={`/reptile/${reptileId}/add-log?type=${logType}`} asChild>
                <QuickLogButton
                  label={label}
                  accessibilityLabel={`Log ${label.toLowerCase()}`}>
                  {icon}
                </QuickLogButton>
              </Link>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  cell: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 12,
  },
  action: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    width: COLUMN_WIDTH,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});
