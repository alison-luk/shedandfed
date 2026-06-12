import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

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
  if (filter === 'all') return 'All entries';
  return LOG_TYPE_LABELS[filter];
}

export default function LogFilterBar({ value, onChange, counts, totalLogs }: LogFilterBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [open, setOpen] = useState(false);

  if (totalLogs === 0) {
    return null;
  }

  function selectFilter(filter: LogFilter) {
    onChange(filter);
    setOpen(false);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Filter</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Filter care log, currently ${filterLabel(value)}`}
        accessibilityHint="Opens filter options"
        onPress={() => setOpen(true)}
        style={[styles.trigger, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.triggerText}>{filterLabel(value)}</Text>
        <View style={styles.triggerRight}>
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {counts[value]} {counts[value] === 1 ? 'entry' : 'entries'}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={28} color={colors.textSecondary} />
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.menuTitle, { color: colors.textSecondary }]}>Show entries</Text>
            <ScrollView style={styles.menuList}>
              {ALL_FILTERS.map((filter) => {
                const selected = value === filter;
                const count = counts[filter];
                const disabled = filter !== 'all' && count === 0;

                return (
                  <Pressable
                    key={filter}
                    disabled={disabled}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected, disabled }}
                    onPress={() => selectFilter(filter)}
                    style={[
                      styles.option,
                      {
                        backgroundColor: selected ? `${colors.tint}18` : 'transparent',
                        opacity: disabled ? 0.4 : 1,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.optionText,
                        { color: selected ? colors.tint : colors.text, fontWeight: selected ? '700' : '500' },
                      ]}>
                      {filterLabel(filter)}
                    </Text>
                    <Text style={[styles.optionCount, { color: colors.textSecondary }]}>{count}</Text>
                    {selected ? (
                      <MaterialIcons name="check" size={22} color={colors.tint} />
                    ) : (
                      <View style={styles.checkPlaceholder} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 52,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  triggerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  count: {
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  menu: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuList: {
    paddingBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  optionCount: {
    fontSize: 14,
    minWidth: 24,
    textAlign: 'right',
  },
  checkPlaceholder: {
    width: 22,
  },
});
