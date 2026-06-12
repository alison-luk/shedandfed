import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LOG_TYPE_ICONS, LOG_TYPE_LABELS, type LogType } from '@/lib/types';

export type LogFilter = 'all' | LogType;

const FILTERS: LogFilter[] = ['all', 'feeding', 'shedding', 'temperature', 'weight', 'note'];

interface LogFilterBarProps {
  value: LogFilter;
  onChange: (filter: LogFilter) => void;
  counts: Record<LogFilter, number>;
}

export default function LogFilterBar({ value, onChange, counts }: LogFilterBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.container}>
      {FILTERS.map((filter) => {
        const selected = value === filter;
        const label = filter === 'all' ? 'All' : LOG_TYPE_LABELS[filter];
        const count = counts[filter];

        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.tint : colors.card,
                borderColor: selected ? colors.tint : colors.border,
              },
            ]}>
            {filter !== 'all' ? (
              <SymbolView
                name={LOG_TYPE_ICONS[filter] as never}
                tintColor={selected ? '#fff' : colors.tint}
                size={14}
              />
            ) : null}
            <Text style={[styles.chipText, { color: selected ? '#fff' : colors.text }]}>
              {label}
            </Text>
            {count > 0 ? (
              <Text style={[styles.count, { color: selected ? '#fff' : colors.textSecondary }]}>
                {count}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  count: {
    fontSize: 12,
    fontWeight: '500',
  },
});
