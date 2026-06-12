import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { formatDate } from '@/lib/format';
import type { LogEntry } from '@/lib/types';
import { formatWeight, getWeightChange, getWeightPoints } from '@/lib/weight';

interface WeightDashboardProps {
  reptileId: string;
  logs: LogEntry[];
}

const CHART_HEIGHT = 120;

export default function WeightDashboard({ reptileId, logs }: WeightDashboardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const points = getWeightPoints(logs);

  if (points.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.title}>Weight dashboard</Text>
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          Log weight entries to see trends and track growth over time.
        </Text>
        <Pressable
          onPress={() => router.push(`/reptile/${reptileId}/add-log?type=weight`)}
          style={[styles.action, { backgroundColor: colors.tint }]}>
          <Text style={styles.actionText}>Log weight</Text>
        </Pressable>
      </View>
    );
  }

  const latest = points[points.length - 1];
  const change = getWeightChange(points);
  const minGrams = Math.min(...points.map((p) => p.grams));
  const maxGrams = Math.max(...points.map((p) => p.grams));
  const range = maxGrams - minGrams || 1;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Weight dashboard</Text>
        <Pressable onPress={() => router.push(`/reptile/${reptileId}/add-log?type=weight`)}>
          <Text style={{ color: colors.tint, fontWeight: '600' }}>Log</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Current</Text>
          <Text style={styles.statValue}>{formatWeight(latest.weight, latest.unit)}</Text>
        </View>
        {change != null ? (
          <View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Change</Text>
            <Text
              style={[
                styles.statValue,
                { color: change > 0 ? colors.success : change < 0 ? colors.danger : colors.text },
              ]}>
              {change > 0 ? '+' : ''}
              {Math.round(change)} g
            </Text>
          </View>
        ) : null}
        <View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Entries</Text>
          <Text style={styles.statValue}>{points.length}</Text>
        </View>
      </View>

      <View style={[styles.chart, { borderColor: colors.border }]}>
        {points.map((point, index) => {
          const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
          const y = ((maxGrams - point.grams) / range) * 100;

          return (
            <View
              key={`${point.date}-${index}`}
              style={[
                styles.dot,
                {
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: colors.tint,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>
          {formatDate(points[0].date)} — {formatDate(latest.date)}
        </Text>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>
          Range: {Math.round(minGrams)}–{Math.round(maxGrams)} g
        </Text>
      </View>
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
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  empty: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  action: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chart: {
    height: CHART_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    position: 'relative',
    marginBottom: 8,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: -5,
    marginTop: -5,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  legendText: {
    fontSize: 12,
  },
});
