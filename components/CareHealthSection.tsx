import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { formatDate } from '@/lib/format';
import type { LogEntry } from '@/lib/types';

interface CareHealthSectionProps {
  reptileId: string;
  logs: LogEntry[];
}

export default function CareHealthSection({ reptileId, logs }: CareHealthSectionProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const healthLogs = logs.filter((log) => log.type === 'health').slice(0, 3);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialIcons name="medical-services" size={20} color={colors.tint} />
          <Text style={styles.title}>Care & health</Text>
        </View>
        <Pressable onPress={() => router.push(`/reptile/${reptileId}/add-log?type=health`)}>
          <Text style={{ color: colors.tint, fontWeight: '600' }}>Log</Text>
        </Pressable>
      </View>

      {healthLogs.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          Track vet visits, medication, illnesses, and checkups.
        </Text>
      ) : (
        healthLogs.map((entry) => (
          <Pressable
            key={entry.id}
            onPress={() => router.push(`/reptile/${reptileId}/add-log?logId=${entry.id}`)}
            style={[styles.entry, { borderColor: colors.border }]}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryCategory}>{entry.healthCategory ?? 'Health'}</Text>
              <Text style={[styles.entryDate, { color: colors.textSecondary }]}>
                {formatDate(entry.date)}
              </Text>
            </View>
            {entry.notes ? (
              <Text style={[styles.entryNotes, { color: colors.textSecondary }]} numberOfLines={2}>
                {entry.notes}
              </Text>
            ) : null}
          </Pressable>
        ))
      )}

      <Pressable
        onPress={() => router.push(`/reptile/${reptileId}/add-log?type=health`)}
        style={[styles.addButton, { borderColor: colors.border }]}>
        <MaterialIcons name="add" size={20} color={colors.tint} />
        <Text style={{ color: colors.tint, fontWeight: '600' }}>Log health entry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  empty: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  entry: {
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  entryCategory: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  entryDate: {
    fontSize: 12,
  },
  entryNotes: {
    fontSize: 13,
    lineHeight: 18,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
