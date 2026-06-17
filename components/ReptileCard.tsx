import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { Reptile } from '@/lib/types';

const AVATAR_SIZE = 72;

interface ReptileCardProps {
  reptile: Reptile;
}

export default function ReptileCard({ reptile }: ReptileCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <Link href={`/reptile/${reptile.id}`} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${reptile.name}`}
          style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.85 : 1 }]}>
          <View style={[styles.avatar, { backgroundColor: colors.tint, borderColor: colors.card }]}>
            <Text style={styles.avatarText}>{reptile.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {reptile.name}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 20,
  },
  pressable: {
    width: AVATAR_SIZE,
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    width: AVATAR_SIZE,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 17,
  },
});
