import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import LogTypeIcon from '@/components/LogTypeIcon';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { formatLogDetails, formatTime } from '@/lib/format';
import { LOG_TYPE_COLORS } from '@/lib/logColors';
import { LOG_TYPE_LABELS, type LogEntry } from '@/lib/types';

interface LogEntryCardProps {
  entry: LogEntry;
  reptileName?: string;
  onDelete?: () => void;
}

export default function LogEntryCard({ entry, reptileName, onDelete }: LogEntryCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const accent = LOG_TYPE_COLORS[entry.type];
  const details = formatLogDetails(entry);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: accent,
        },
      ]}>
      <View style={styles.topRow}>
        <View style={styles.typeRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
            <LogTypeIcon type={entry.type} size={20} color={accent} />
          </View>
          <Text style={[styles.type, { color: accent }]}>{LOG_TYPE_LABELS[entry.type]}</Text>
        </View>
        <Text style={[styles.time, { color: colors.textSecondary }]}>{formatTime(entry.date)}</Text>
      </View>

      {reptileName ? (
        <Text style={[styles.reptileName, { color: colors.tint }]}>{reptileName}</Text>
      ) : null}

      <View style={styles.details}>
        {details.map((line) => (
          <View key={`${line.label}-${line.value}`} style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{line.label}</Text>
            <Text style={styles.detailValue}>{line.value}</Text>
          </View>
        ))}
      </View>

      {onDelete ? (
        <Pressable
          onPress={onDelete}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Delete log entry"
          style={styles.deleteButton}>
          <MaterialIcons name="delete-outline" size={20} color={colors.danger} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingLeft: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  type: {
    fontSize: 16,
    fontWeight: '700',
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
  },
  reptileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  details: {
    gap: 6,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});
