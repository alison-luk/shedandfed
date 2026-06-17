import { Link, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type PlatformIcon = { ios: string; android: string; web: string };

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: PlatformIcon;
  actionLabel?: string;
  actionHref?: Href;
}

export default function EmptyState({
  title,
  message,
  icon = { ios: 'leaf', android: 'eco', web: 'eco' },
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.border }]}>
        <SymbolView name={icon as never} tintColor={colors.tint} size={36} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {actionLabel && actionHref ? (
        <Link href={actionHref} asChild>
          <Pressable style={[styles.actionButton, { backgroundColor: colors.tint }]}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
