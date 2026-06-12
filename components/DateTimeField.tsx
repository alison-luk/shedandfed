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

interface DateTimeFieldProps {
  value: Date;
  onChange: (date: Date) => void;
}

function openAndroidDateTimePicker(current: Date, onChange: (date: Date) => void) {
  DateTimePickerAndroid.open({
    value: current,
    mode: 'date',
    onChange: (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type !== 'set' || !selectedDate) {
        return;
      }

      const withDate = new Date(current);
      withDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      DateTimePickerAndroid.open({
        value: withDate,
        mode: 'time',
        is24Hour: false,
        onChange: (timeEvent: DateTimePickerEvent, selectedTime?: Date) => {
          if (timeEvent.type !== 'set' || !selectedTime) {
            return;
          }

          const next = new Date(withDate);
          next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
          onChange(next);
        },
      });
    },
  });
}

export default function DateTimeField({ value, onChange }: DateTimeFieldProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [showIosPicker, setShowIosPicker] = useState(false);

  function handlePress() {
    if (Platform.OS === 'android') {
      openAndroidDateTimePicker(value, onChange);
      return;
    }

    setShowIosPicker(true);
  }

  return (
    <>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Date & Time</Text>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Choose date and time"
        style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialIcons name="event" size={22} color={colors.tint} />
        <Text style={styles.buttonText}>
          {value.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </Pressable>

      {showIosPicker ? (
        <DateTimePicker
          value={value}
          mode="datetime"
          display="spinner"
          onChange={(event: DateTimePickerEvent, selected) => {
            if (event.type === 'dismissed') {
              setShowIosPicker(false);
              return;
            }

            if (selected) {
              onChange(selected);
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
