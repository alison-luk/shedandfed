import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { Reptile } from '@/lib/types';

interface ReptileCardProps {
  reptile: Reptile;
}

export default function ReptileCard({ reptile }: ReptileCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Link href={`/reptile/${reptile.id}`} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${reptile.name}`}
          style={({ pressed }) => [
            styles.avatar,
            { backgroundColor: colors.tint, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={styles.avatarText}>{reptile.name.charAt(0).toUpperCase()}</Text>
        </Pressable>
      </Link>
      <Text style={styles.name}>{reptile.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
});
