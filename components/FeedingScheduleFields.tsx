import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FEEDING_INTERVAL_PRESETS } from '@/lib/care';

interface FeedingScheduleFieldsProps {
  intervalDays: number | null;
  remindersEnabled: boolean;
  onIntervalChange: (days: number | null) => void;
  onRemindersChange: (enabled: boolean) => void;
}

export default function FeedingScheduleFields({
  intervalDays,
  remindersEnabled,
  onIntervalChange,
  onRemindersChange,
}: FeedingScheduleFieldsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Feeding schedule</Text>
      <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
        Set how often this reptile is fed to see due badges and optional reminders.
      </Text>

      <Text style={[styles.label, { color: colors.textSecondary }]}>Feed every</Text>
      <View style={styles.presets}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: intervalDays === null }}
          onPress={() => onIntervalChange(null)}
          style={[
            styles.preset,
            {
              backgroundColor: intervalDays === null ? colors.tint : colors.card,
              borderColor: intervalDays === null ? colors.tint : colors.border,
            },
          ]}>
          <Text style={{ color: intervalDays === null ? '#fff' : colors.text, fontWeight: '600' }}>
            None
          </Text>
        </Pressable>
        {FEEDING_INTERVAL_PRESETS.map((days) => {
          const selected = intervalDays === days;
          return (
            <Pressable
              key={days}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onIntervalChange(days)}
              style={[
                styles.preset,
                {
                  backgroundColor: selected ? colors.tint : colors.card,
                  borderColor: selected ? colors.tint : colors.border,
                },
              ]}>
              <Text style={{ color: selected ? '#fff' : colors.text, fontWeight: '600' }}>
                {days}d
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.reminderRow, { borderColor: colors.border }]}>
        <View style={styles.reminderCopy}>
          <Text style={[styles.reminderTitle, { color: colors.text }]}>Feeding reminders</Text>
          <Text style={[styles.reminderHint, { color: colors.textSecondary }]}>
            Local notification when feeding is due
          </Text>
        </View>
        <Switch
          value={remindersEnabled}
          onValueChange={onRemindersChange}
          disabled={!intervalDays}
          trackColor={{ false: colors.border, true: colors.tint }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  preset: {
    minWidth: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  reminderCopy: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  reminderHint: {
    fontSize: 13,
    lineHeight: 18,
  },
});
