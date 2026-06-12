import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { getCareSummaryItems } from '@/lib/care';
import type { ReptileCareSummary } from '@/lib/types';

interface LastCareSummaryProps {
  summary: ReptileCareSummary;
}

export default function LastCareSummary({ summary }: LastCareSummaryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const items = getCareSummaryItems(summary);

  return (
    <View style={styles.row}>
      {items.map((item) => {
        const isEmpty = !item.date;

        return (
          <View
            key={item.key}
            style={[styles.chip, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <MaterialIcons
              name={item.icon}
              size={14}
              color={isEmpty ? colors.textSecondary : colors.tint}
            />
            <Text style={[styles.label, { color: colors.textSecondary }]}>{item.label}</Text>
            <Text
              style={[
                styles.value,
                { color: isEmpty ? colors.textSecondary : colors.text },
                isEmpty && styles.valueMuted,
              ]}
              numberOfLines={1}>
              {item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  valueMuted: {
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
