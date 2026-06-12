import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface AddReptileButtonProps {
  label?: string;
  variant?: 'bar' | 'inline';
}

export default function AddReptileButton({
  label = 'Add Reptile',
  variant = 'bar',
}: AddReptileButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const isBar = variant === 'bar';

  return (
    <Link href="/reptile/add" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          isBar ? styles.bar : styles.inline,
          {
            backgroundColor: isBar ? colors.tint : colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isBar ? 'rgba(255,255,255,0.2)' : `${colors.tint}18` },
          ]}>
          <MaterialIcons name="add" size={isBar ? 24 : 26} color={isBar ? '#fff' : colors.tint} />
        </View>
        <Text style={[styles.buttonText, { color: isBar ? '#fff' : colors.text }]}>{label}</Text>
        {!isBar ? (
          <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
        ) : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    minHeight: 52,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 56,
    width: '100%',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});
