import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import CareHealthSection from '@/components/CareHealthSection';
import LastCareSummary from '@/components/LastCareSummary';
import ReptileAvatar from '@/components/ReptileAvatar';
import WeightDashboard from '@/components/WeightDashboard';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import { getFeedingDueStatus } from '@/lib/care';
import type { LogEntry, Reptile, ReptileCareSummary } from '@/lib/types';

export default function ReptileDashboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReptileLogs } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [reptile, setReptile] = useState<Reptile | null>(null);
  const [careSummary, setCareSummary] = useState<ReptileCareSummary | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);

  const loadData = useCallback(async () => {
    if (!id) return;

    if (isFirstLoad.current) {
      setLoading(true);
    }

    const { getCareSummaries, getReptile } = await import('@/lib/db');
    const [nextReptile, nextLogs, summaries] = await Promise.all([
      getReptile(id),
      getReptileLogs(id),
      getCareSummaries(),
    ]);

    setReptile(nextReptile);
    setLogs(nextLogs);
    setCareSummary(
      summaries[id] ?? {
        reptileId: id,
        lastFed: null,
        lastShed: null,
        lastPoop: null,
      }
    );
    setLoading(false);
    isFirstLoad.current = false;
  }, [id, getReptileLogs]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

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

  const dueStatus = getFeedingDueStatus(reptile, careSummary?.lastFed ?? null);
  const dueLabel =
    dueStatus === 'overdue' ? 'Feeding overdue' : dueStatus === 'due_soon' ? 'Feeding due soon' : null;
  const dueColor =
    dueStatus === 'overdue' ? colors.danger : dueStatus === 'due_soon' ? colors.warning : colors.tint;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: `${reptile.name} — Dashboard` }} />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.overviewCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}>
          <ReptileAvatar reptile={reptile} size={56} style={{ marginRight: 14 }} />
          <View style={styles.overviewInfo}>
            <Text style={styles.name}>{reptile.name}</Text>
            <Text style={[styles.species, { color: colors.textSecondary }]}>{reptile.species}</Text>
            {dueLabel ? (
              <Text style={[styles.dueBadge, { color: dueColor }]}>{dueLabel}</Text>
            ) : null}
            {careSummary ? <LastCareSummary summary={careSummary} /> : null}
          </View>
        </View>

        <WeightDashboard reptileId={id} logs={logs} />
        <CareHealthSection reptileId={id} logs={logs} />
      </ScrollView>
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
  content: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  overviewInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  species: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  dueBadge: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
});
