import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const TAB_CONFIG: Record<string, { label: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  index: { label: 'My Reptiles', icon: 'pets' },
  activity: { label: 'Activity', icon: 'history' },
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_CONFIG[route.name] ?? { label: route.name, icon: 'circle' as const };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={`${config.label} tab`}
              onPress={() => navigation.navigate(route.name)}
              style={[
                styles.tabBlock,
                {
                  backgroundColor: focused ? colors.tint : colors.card,
                  borderColor: focused ? colors.tint : colors.border,
                },
              ]}>
              <MaterialIcons
                name={config.icon}
                size={26}
                color={focused ? '#fff' : colors.tint}
              />
              <Text
                style={[styles.tabLabel, { color: focused ? '#fff' : colors.text }]}
                numberOfLines={2}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
  },
  tabBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 72,
    gap: 6,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
});
