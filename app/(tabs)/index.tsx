import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, Stack } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import AddReptileButton from '@/components/AddReptileButton';
import EmptyState from '@/components/EmptyState';
import ReptileCard from '@/components/ReptileCard';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import { useBottomTabOffset } from '@/lib/layout';

export default function ReptilesScreen() {
  const { reptiles, loading } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const tabOffset = useBottomTabOffset(8);

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
        <View style={[styles.emptyWrap, { paddingBottom: tabOffset + 80 }]}>
          <EmptyState
            title="No reptiles yet"
            message="Add your first reptile to start tracking feedings, sheds, temperatures, and more."
          />
          <AddReptileButton label="Add your first reptile" variant="inline" />
        </View>
      ) : (
        <FlatList
          data={reptiles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: tabOffset + 80 }]}
          renderItem={({ item }) => <ReptileCard reptile={item} />}
          ListFooterComponent={
            <View style={styles.footer}>
              <AddReptileButton label="Add another reptile" variant="inline" />
            </View>
          }
        />
      )}

      {!loading ? (
        <View
          style={[
            styles.stickyBar,
            { bottom: tabOffset, backgroundColor: colors.background, borderTopColor: colors.border },
          ]}>
          <AddReptileButton label="Add Reptile" variant="bar" />
        </View>
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
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  footer: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
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
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
