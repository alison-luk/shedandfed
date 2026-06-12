import { Link } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import LogTypeIcon from '@/components/LogTypeIcon';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { QUICK_LOG_LABELS, type LogType } from '@/lib/types';

const QUICK_LOG_TYPES: LogType[] = [
  'feeding',
  'poop',
  'shedding',
  'temperature',
  'weight',
  'note',
];

const ICON_SIZE = 48;
const COLUMN_WIDTH = 64;

interface LogQuickActionsProps {
  reptileId: string;
}

interface QuickLogButtonProps {
  label: string;
  accessibilityLabel: string;
  children: ReactNode;
}

function QuickLogButton({ label, accessibilityLabel, children }: QuickLogButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.action, { opacity: pressed ? 0.75 : 1 }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.tint }]}>{children}</View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function LogQuickActions({ reptileId }: LogQuickActionsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Quick Log</Text>
      <View style={styles.grid}>
        {QUICK_LOG_TYPES.map((logType) => {
          const label = QUICK_LOG_LABELS[logType];

          return (
            <View key={logType} style={styles.cell}>
              <Link href={`/reptile/${reptileId}/add-log?type=${logType}`} asChild>
                <QuickLogButton
                  label={label}
                  accessibilityLabel={`Log ${label.toLowerCase()}`}>
                  <LogTypeIcon type={logType} size={22} color="#fff" />
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
