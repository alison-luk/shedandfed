import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import EmptyState from '@/components/EmptyState';
import LogEntryCard from '@/components/LogEntryCard';
import LogFilterBar, { type LogFilter } from '@/components/LogFilterBar';
import LogQuickActions from '@/components/LogQuickActions';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import type { LogEntry, Reptile } from '@/lib/types';

function buildFilterCounts(logs: LogEntry[]): Record<LogFilter, number> {
  const counts: Record<LogFilter, number> = {
    all: logs.length,
    feeding: 0,
    shedding: 0,
    temperature: 0,
    weight: 0,
    note: 0,
  };

  for (const log of logs) {
    counts[log.type] += 1;
  }

  return counts;
}

export default function ReptileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getReptileLogs, removeReptile, removeLog } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [reptile, setReptile] = useState<Reptile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LogFilter>('all');
  const isFirstLoad = useRef(true);

  const loadData = useCallback(async () => {
    if (!id) return;

    if (isFirstLoad.current) {
      setLoading(true);
    }

    const { getReptile } = await import('@/lib/db');
    const [nextReptile, nextLogs] = await Promise.all([getReptile(id), getReptileLogs(id)]);
    setReptile(nextReptile);
    setLogs(nextLogs);
    setLoading(false);
    isFirstLoad.current = false;
  }, [id, getReptileLogs]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const filterCounts = useMemo(() => buildFilterCounts(logs), [logs]);

  const filteredLogs = useMemo(
    () => (filter === 'all' ? logs : logs.filter((log) => log.type === filter)),
    [logs, filter]
  );

  function handleDeleteReptile() {
    Alert.alert(
      'Delete reptile?',
      'This will permanently remove this reptile and all its log entries.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            await removeReptile(id);
            router.back();
          },
        },
      ]
    );
  }

  function handleDeleteLog(logId: string) {
    Alert.alert('Delete log entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeLog(logId);
          await loadData();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  if (!reptile || !id) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text>Reptile not found.</Text>
      </View>
    );
  }

  const listHeader = (
    <>
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <Text style={styles.avatarText}>{reptile.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.species}>{reptile.species}</Text>
          {reptile.notes ? (
            <Text style={[styles.notes, { color: colors.textSecondary }]}>{reptile.notes}</Text>
          ) : null}
        </View>
      </View>

      <LogQuickActions reptileId={id} />

      <View style={styles.logHeader}>
        <Text style={styles.logTitle}>Care Log</Text>
        <Text style={[styles.logCount, { color: colors.textSecondary }]}>
          {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {logs.length > 0 ? (
        <LogFilterBar value={filter} onChange={setFilter} counts={filterCounts} />
      ) : null}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: reptile.name,
          headerRight: () => (
            <Pressable onPress={handleDeleteReptile} style={styles.headerButton}>
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' } as never}
                tintColor={colors.danger}
                size={22}
              />
            </Pressable>
          ),
        }}
      />

      {logs.length === 0 ? (
        <FlatList
          data={[]}
          ListHeaderComponent={listHeader}
          renderItem={() => null}
          ListEmptyComponent={
            <EmptyState
              title="No logs yet"
              message="Tap a quick log icon above to record feedings, sheds, temperatures, weight, or notes."
            />
          }
        />
      ) : filteredLogs.length === 0 ? (
        <FlatList
          data={[]}
          ListHeaderComponent={listHeader}
          renderItem={() => null}
          ListEmptyComponent={
            <EmptyState
              title="No matching entries"
              message="Try a different filter to see more of this reptile's care log."
            />
          }
        />
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <LogEntryCard entry={item} onDelete={() => handleDeleteLog(item.id)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    marginRight: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  species: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  logCount: {
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
