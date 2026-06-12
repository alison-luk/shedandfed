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
    flex: 1,
    maxWidth: '33.33%',
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  pressable: {
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 17,
  },
});
