import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
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
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import type { LogEntry, Reptile } from '@/lib/types';

export default function ReptileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getReptileLogs, removeReptile, removeLog } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [reptile, setReptile] = useState<Reptile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { getReptile } = await import('@/lib/db');
    const [nextReptile, nextLogs] = await Promise.all([getReptile(id), getReptileLogs(id)]);
    setReptile(nextReptile);
    setLogs(nextLogs);
    setLoading(false);
  }, [id, getReptileLogs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  if (!reptile) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text>Reptile not found.</Text>
      </View>
    );
  }

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

      <View style={styles.logHeader}>
        <Text style={styles.logTitle}>Care Log</Text>
        <Link href={`/reptile/${id}/add-log`} asChild>
          <Pressable style={[styles.logButton, { backgroundColor: colors.tint }]}>
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' } as never}
              tintColor="#fff"
              size={18}
            />
            <Text style={styles.logButtonText}>Add Entry</Text>
          </Pressable>
        </Link>
      </View>

      {logs.length === 0 ? (
        <EmptyState
          title="No logs yet"
          message="Track feedings, shedding, temperatures, weight, and notes for this reptile."
        />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
});
