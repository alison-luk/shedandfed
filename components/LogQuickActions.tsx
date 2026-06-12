import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import LogTypeIcon from '@/components/LogTypeIcon';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import { LOG_TYPE_LABELS, type LogType } from '@/lib/types';

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

interface LogQuickActionsProps {
  reptileId: string;
  onLogAdded?: () => void | Promise<void>;
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
          const isInstant = INSTANT_LOG_TYPES.has(logType);
          const isSaving = savingType === logType;

          if (isInstant) {
            return (
              <View key={logType} style={styles.cell}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Log ${LOG_TYPE_LABELS[logType].toLowerCase()} now`}
                  accessibilityHint="Long press for more options"
                  disabled={Boolean(savingType)}
                  onPress={() => handleInstantLog(logType)}
                  onLongPress={() => openLogForm(logType)}
                  delayLongPress={400}
                  style={({ pressed }) => [styles.action, { opacity: pressed ? 0.75 : 1 }]}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.tint }]}>
                    {isSaving ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <LogTypeIcon type={logType} size={22} color="#fff" />
                    )}
                  </View>
                  <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
                    {LOG_TYPE_LABELS[logType]}
                  </Text>
                </Pressable>
              </View>
            );
          }

          return (
            <View key={logType} style={styles.cell}>
              <Link href={`/reptile/${reptileId}/add-log?type=${logType}`} asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Log ${LOG_TYPE_LABELS[logType].toLowerCase()}`}
                  style={({ pressed }) => [styles.action, { opacity: pressed ? 0.75 : 1 }]}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.tint }]}>
                    <LogTypeIcon type={logType} size={22} color="#fff" />
                  </View>
                  <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
                    {LOG_TYPE_LABELS[logType]}
                  </Text>
                </Pressable>
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
    alignItems: 'center',
    width: 72,
    minHeight: 76,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: 72,
  },
});
