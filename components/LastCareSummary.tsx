import { StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { formatLastCareLine } from '@/lib/care';
import type { ReptileCareSummary } from '@/lib/types';

interface LastCareSummaryProps {
  summary: ReptileCareSummary;
  compact?: boolean;
}

export default function LastCareSummary({ summary, compact = false }: LastCareSummaryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Text
      style={[
        compact ? styles.compact : styles.full,
        { color: colors.textSecondary },
      ]}
      numberOfLines={compact ? 2 : undefined}>
      {formatLastCareLine(summary, compact)}
    </Text>
  );
}

const styles = StyleSheet.create({
  full: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  compact: {
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  },
});
