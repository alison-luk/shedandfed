import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import ReptileAvatar from '@/components/ReptileAvatar';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { getFeedingDueStatus } from '@/lib/care';
import type { Reptile, ReptileCareSummary } from '@/lib/types';

const AVATAR_SIZE = 72;

interface ReptileCardProps {
  reptile: Reptile;
  summary?: ReptileCareSummary;
}

export default function ReptileCard({ reptile, summary }: ReptileCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const dueStatus = getFeedingDueStatus(reptile, summary?.lastFed ?? null);
  const dotColor =
    dueStatus === 'overdue' ? colors.danger : dueStatus === 'due_soon' ? colors.warning : null;

  return (
    <View style={styles.wrapper}>
      <Link href={`/reptile/${reptile.id}`} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${reptile.name}`}
          style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.85 : 1 }]}>
          <View style={styles.avatarWrap}>
            {dotColor ? (
              <View
                style={[styles.statusDot, { backgroundColor: dotColor, borderColor: colors.card }]}
                accessibilityLabel={dueStatus === 'overdue' ? 'Feeding overdue' : 'Feeding due soon'}
              />
            ) : null}
            <ReptileAvatar
              reptile={reptile}
              size={AVATAR_SIZE}
              style={{ borderWidth: 3, borderColor: colors.card }}
            />
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
  avatarWrap: {
    marginBottom: 8,
  },
  statusDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    zIndex: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  name: {
    width: AVATAR_SIZE,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 17,
  },
});
