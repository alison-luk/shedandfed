import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { formatDate } from '@/lib/format';

interface DateFieldProps {
  value: Date;
  onChange: (date: Date) => void;
}

function normalizeDateOnly(date: Date): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

function openAndroidDatePicker(current: Date, onChange: (date: Date) => void) {
  DateTimePickerAndroid.open({
    value: current,
    mode: 'date',
    onChange: (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === 'set' && selectedDate) {
        onChange(normalizeDateOnly(selectedDate));
      }
    },
  });
}

export default function DateField({ value, onChange }: DateFieldProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [showIosPicker, setShowIosPicker] = useState(false);

  function handlePress() {
    if (Platform.OS === 'android') {
      openAndroidDatePicker(value, onChange);
      return;
    }

    setShowIosPicker(true);
  }

  return (
    <>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Choose date"
        style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialIcons name="event" size={22} color={colors.tint} />
        <Text style={styles.buttonText}>{formatDate(value.toISOString())}</Text>
      </Pressable>

      {showIosPicker ? (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          onChange={(event: DateTimePickerEvent, selected) => {
            if (event.type === 'dismissed') {
              setShowIosPicker(false);
              return;
            }

            if (selected) {
              onChange(normalizeDateOnly(selected));
            }
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
  },
});
