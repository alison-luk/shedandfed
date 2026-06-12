import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import LogEntryCard from '@/components/LogEntryCard';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';

export default function ActivityScreen() {
  const { recentLogs, loading } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.tint} />
      ) : recentLogs.length === 0 ? (
        <EmptyState
          title="No activity yet"
          message="Log feedings, sheds, temperatures, and weights from a reptile's profile."
          icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
        />
      ) : (
        <FlatList
          data={recentLogs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <LogEntryCard entry={item} reptileName={item.reptileName} />
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
  loader: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
});
