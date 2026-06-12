import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import ReptileCard from '@/components/ReptileCard';
import SearchField from '@/components/SearchField';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import { useBottomTabOffset } from '@/lib/layout';

export default function ReptilesScreen() {
  const { reptiles, loading } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const tabOffset = useBottomTabOffset(16);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReptiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return reptiles;
    return reptiles.filter((reptile) => reptile.name.toLowerCase().includes(query));
  }, [reptiles, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/reptile/add" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add reptile"
                style={styles.headerAdd}>
                {({ pressed }) => (
                  <>
                    <MaterialIcons
                      name="add"
                      size={22}
                      color={colors.tint}
                      style={{ opacity: pressed ? 0.6 : 1 }}
                    />
                    <Text
                      style={[
                        styles.headerAddText,
                        { color: colors.tint, opacity: pressed ? 0.6 : 1 },
                      ]}>
                      Add
                    </Text>
                  </>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.tint} />
      ) : reptiles.length === 0 ? (
        <View style={[styles.emptyWrap, { paddingBottom: tabOffset }]}>
          <EmptyState
            title="No reptiles yet"
            message="Tap Add in the top right to add your first reptile and start tracking care."
          />
        </View>
      ) : (
        <FlatList
          data={filteredReptiles}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={[styles.list, { paddingBottom: tabOffset }]}
          ListHeaderComponent={
            <SearchField value={searchQuery} onChangeText={setSearchQuery} />
          }
          renderItem={({ item }) => <ReptileCard reptile={item} />}
          ListEmptyComponent={
            <EmptyState
              title="No matches"
              message={`No reptiles found for "${searchQuery.trim()}".`}
            />
          }
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
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  list: {
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  headerAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
    minHeight: 44,
    paddingHorizontal: 4,
  },
  headerAddText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
