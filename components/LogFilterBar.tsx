import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LOG_TYPE_LABELS, type LogType } from '@/lib/types';

export type LogFilter = 'all' | LogType;

const ALL_FILTERS: LogFilter[] = ['all', 'feeding', 'shedding', 'temperature', 'weight', 'note'];

interface LogFilterBarProps {
  value: LogFilter;
  onChange: (filter: LogFilter) => void;
  counts: Record<LogFilter, number>;
  totalLogs: number;
}

function filterLabel(filter: LogFilter): string {
  if (filter === 'all') return 'All';
  if (filter === 'temperature') return 'Temp';
  return LOG_TYPE_LABELS[filter];
}

export default function LogFilterBar({ value, onChange, counts, totalLogs }: LogFilterBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const visibleFilters = ALL_FILTERS.filter(
    (filter) => filter === 'all' || filter === value || counts[filter] > 0
  );

  if (totalLogs === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Showing {value === 'all' ? 'all entries' : `${LOG_TYPE_LABELS[value as LogType].toLowerCase()} only`}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityRole="tablist">
        {visibleFilters.map((filter) => {
          const selected = value === filter;
          const label = filterLabel(filter);
          const count = counts[filter];

          return (
            <Pressable
              key={filter}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={
                filter === 'all'
                  ? `Show all entries, ${count} total`
                  : `Show ${LOG_TYPE_LABELS[filter as LogType]} only, ${count} entries`
              }
              onPress={() => onChange(filter)}
              style={[
                styles.pill,
                {
                  backgroundColor: selected ? colors.tint : colors.card,
                  borderColor: selected ? colors.tint : colors.border,
                },
              ]}>
              <Text style={[styles.pillText, { color: selected ? '#fff' : colors.text }]}>
                {label}
                {count > 0 ? ` (${count})` : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 12,
  },
  hint: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  row: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
