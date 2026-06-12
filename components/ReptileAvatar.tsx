import { Image, StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { Reptile } from '@/lib/types';

interface ReptileAvatarProps {
  reptile: Pick<Reptile, 'name' | 'imageUri'>;
  size: number;
  style?: ViewStyle;
}

export default function ReptileAvatar({ reptile, size, style }: ReptileAvatarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const fontSize = Math.round(size * 0.38);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.tint,
        },
        style,
      ]}>
      {reptile.imageUri ? (
        <Image source={{ uri: reptile.imageUri }} style={styles.image} />
      ) : (
        <Text style={[styles.initial, { fontSize }]}>
          {reptile.name.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initial: {
    color: '#fff',
    fontWeight: '700',
  },
});
