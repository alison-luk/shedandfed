import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

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
            borderColor: isBar ? colors.tint : colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        <MaterialIcons name="add" size={22} color={isBar ? '#fff' : colors.tint} />
        <Text style={[styles.buttonText, { color: isBar ? '#fff' : colors.tint }]}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 16,
    borderRadius: 14,
    minHeight: 52,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
