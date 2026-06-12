import { Link, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import ReptileCard from '@/components/ReptileCard';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';

export default function ReptilesScreen() {
  const { reptiles, loading } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/reptile/add" asChild>
              <Pressable style={styles.addButton}>
                {({ pressed }) => (
                  <SymbolView
                    name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' } as never}
                    tintColor={colors.tint}
                    size={28}
                    style={{ opacity: pressed ? 0.6 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.tint} />
      ) : reptiles.length === 0 ? (
        <EmptyState
          title="No reptiles yet"
          message="Add your first reptile to start tracking feedings, sheds, temperatures, and more."
          actionLabel="Add Reptile"
          actionHref="/reptile/add"
        />
      ) : (
        <FlatList
          data={reptiles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ReptileCard reptile={item} />}
        />
      )}

      {!loading ? (
        <Link href="/reptile/add" asChild>
          <Pressable style={[styles.fab, { backgroundColor: colors.tint }]}>
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' } as never}
              tintColor="#fff"
              size={28}
            />
          </Pressable>
        </Link>
      ) : null}
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
    paddingBottom: 88,
  },
  addButton: {
    marginRight: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
