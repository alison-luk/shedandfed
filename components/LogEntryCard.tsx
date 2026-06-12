import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { formatDateTime, formatLogSummary } from '@/lib/format';
import { LOG_TYPE_ICONS, LOG_TYPE_LABELS, type LogEntry } from '@/lib/types';

interface LogEntryCardProps {
  entry: LogEntry;
  reptileName?: string;
  onDelete?: () => void;
}

export default function LogEntryCard({ entry, reptileName, onDelete }: LogEntryCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
        <SymbolView name={LOG_TYPE_ICONS[entry.type] as never} tintColor={colors.tint} size={22} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.type}>{LOG_TYPE_LABELS[entry.type]}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDateTime(entry.date)}
          </Text>
        </View>
        {reptileName ? (
          <Text style={[styles.reptileName, { color: colors.tint }]}>{reptileName}</Text>
        ) : null}
        <Text style={styles.summary}>{formatLogSummary(entry)}</Text>
        {entry.notes && entry.type !== 'note' ? (
          <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={2}>
            {entry.notes}
          </Text>
        ) : null}
      </View>
      {onDelete ? (
        <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteButton}>
          <SymbolView
            name={{ ios: 'trash', android: 'delete', web: 'delete' } as never}
            tintColor={colors.danger}
            size={18}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    flexShrink: 1,
    textAlign: 'right',
  },
  reptileName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
  },
  notes: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 4,
  },
});
