import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import LastCareSummary from '@/components/LastCareSummary';
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
  const badgeColor =
    dueStatus === 'overdue' ? colors.danger : dueStatus === 'due_soon' ? colors.warning : null;
  const badgeLabel =
    dueStatus === 'overdue' ? 'Overdue' : dueStatus === 'due_soon' ? 'Due soon' : null;

  const careSummary: ReptileCareSummary = summary ?? {
    reptileId: reptile.id,
    lastFed: null,
    lastShed: null,
    lastPoop: null,
  };

  return (
    <View style={styles.wrapper}>
      <Link href={`/reptile/${reptile.id}`} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${reptile.name}`}
          style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.85 : 1 }]}>
          <View style={styles.avatarWrap}>
            {badgeLabel ? (
              <View style={[styles.badge, { backgroundColor: badgeColor ?? colors.tint }]}>
                <Text style={styles.badgeText}>{badgeLabel}</Text>
              </View>
            ) : null}
            <View style={[styles.avatar, { backgroundColor: colors.tint, borderColor: colors.card }]}>
              <Text style={styles.avatarText}>{reptile.name.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {reptile.name}
          </Text>
          <LastCareSummary summary={careSummary} compact />
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
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -4,
    zIndex: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: AVATAR_SIZE,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  name: {
    width: '100%',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 17,
  },
});
