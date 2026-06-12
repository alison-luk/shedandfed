import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Reptiles',
          tabBarLabel: 'My Reptiles',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'lizard', android: 'pets', web: 'pets' } as never}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarLabel: 'Activity',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' } as never}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
