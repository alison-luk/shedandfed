import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import LogTypeIcon from '@/components/LogTypeIcon';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LOG_TYPE_LABELS, type LogType } from '@/lib/types';

const QUICK_LOG_TYPES: LogType[] = [
  'feeding',
  'poop',
  'shedding',
  'temperature',
  'weight',
  'note',
];

interface LogQuickActionsProps {
  reptileId: string;
}

export default function LogQuickActions({ reptileId }: LogQuickActionsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Quick Log</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {QUICK_LOG_TYPES.map((logType) => (
          <Link key={logType} href={`/reptile/${reptileId}/add-log?type=${logType}`} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Log ${LOG_TYPE_LABELS[logType].toLowerCase()}`}
              style={({ pressed }) => [styles.action, { opacity: pressed ? 0.75 : 1 }]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.tint }]}>
                <LogTypeIcon type={logType} size={24} color="#fff" />
              </View>
              <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
                {LOG_TYPE_LABELS[logType]}
              </Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
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
  row: {
    paddingHorizontal: 12,
    gap: 4,
  },
  action: {
    alignItems: 'center',
    width: 72,
    minHeight: 88,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
});
