import { Pressable, StyleSheet, View } from 'react-native';

import LogTypeIcon from '@/components/LogTypeIcon';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LOG_TYPE_LABELS, type LogType } from '@/lib/types';

export type LogFilter = 'all' | LogType;

const FILTERS: LogFilter[] = ['all', 'feeding', 'shedding', 'temperature', 'weight', 'note'];

interface LogFilterBarProps {
  value: LogFilter;
  onChange: (filter: LogFilter) => void;
  counts: Record<LogFilter, number>;
}

function filterLabel(filter: LogFilter): string {
  return filter === 'all' ? 'All' : LOG_TYPE_LABELS[filter];
}

function filterAccessibilityLabel(filter: LogFilter, count: number, selected: boolean): string {
  const name = filterLabel(filter);
  const countText = count === 1 ? '1 entry' : `${count} entries`;
  return selected ? `${name}, selected, ${countText}` : `${name}, ${countText}`;
}

export default function LogFilterBar({ value, onChange, counts }: LogFilterBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Filter by type</Text>
      <View style={styles.grid}>
        {FILTERS.map((filter) => {
          const selected = value === filter;
          const label = filterLabel(filter);
          const count = counts[filter];

          return (
            <Pressable
              key={filter}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={filterAccessibilityLabel(filter, count, selected)}
              onPress={() => onChange(filter)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.tint : colors.card,
                  borderColor: selected ? colors.tint : colors.border,
                },
              ]}>
              {filter !== 'all' ? (
                <LogTypeIcon
                  type={filter}
                  size={18}
                  color={selected ? '#fff' : colors.tint}
                />
              ) : null}
              <Text style={[styles.chipText, { color: selected ? '#fff' : colors.text }]}>
                {label}
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: selected ? 'rgba(255,255,255,0.25)' : colors.background,
                  },
                ]}>
                <Text
                  style={[
                    styles.count,
                    { color: selected ? '#fff' : colors.textSecondary },
                  ]}>
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    minWidth: '47%',
    flexGrow: 1,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
  },
});
