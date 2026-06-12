import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import FeedingScheduleFields from '@/components/FeedingScheduleFields';
import FormField from '@/components/FormField';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/contexts/DataContext';
import { requestNotificationPermissions } from '@/lib/notifications';

export default function EditReptileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { editReptile } = useData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [notes, setNotes] = useState('');
  const [feedingIntervalDays, setFeedingIntervalDays] = useState<number | null>(null);
  const [feedingRemindersEnabled, setFeedingRemindersEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleRemindersChange(enabled: boolean) {
    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Notifications disabled',
          'Enable notifications in your device settings to get feeding reminders.'
        );
        return;
      }
    }
    setFeedingRemindersEnabled(enabled);
  }

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { getReptile } = await import('@/lib/db');
      const reptile = await getReptile(id);
      if (!reptile) {
        Alert.alert('Error', 'Reptile not found.');
        router.back();
        return;
      }

      setName(reptile.name);
      setSpecies(reptile.species);
      setNotes(reptile.notes ?? '');
      setFeedingIntervalDays(reptile.feedingIntervalDays);
      setFeedingRemindersEnabled(reptile.feedingRemindersEnabled);
      setLoading(false);
    })();
  }, [id]);

  async function handleSave() {
    if (!id) return;

    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your reptile.');
      return;
    }
    if (!species.trim()) {
      Alert.alert('Species required', 'Please enter the species.');
      return;
    }

    setSaving(true);
    try {
      await editReptile({
        id,
        name,
        species,
        notes,
        feedingIntervalDays,
        feedingRemindersEnabled,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          title: 'Edit Reptile',
          headerRight: () => (
            <Pressable onPress={handleSave} disabled={saving} style={styles.saveButton}>
              <Text style={[styles.saveText, { color: colors.tint, opacity: saving ? 0.5 : 1 }]}>
                Save
              </Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <FormField label="Name" value={name} onChangeText={setName} placeholder="e.g. Rex" />
        <FormField
          label="Species"
          value={species}
          onChangeText={setSpecies}
          placeholder="e.g. Ball Python"
        />
        <FormField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Morph, enclosure setup, vet info..."
          multiline
        />
        <FeedingScheduleFields
          intervalDays={feedingIntervalDays}
          remindersEnabled={feedingRemindersEnabled}
          onIntervalChange={(days) => {
            setFeedingIntervalDays(days);
            if (!days) {
              setFeedingRemindersEnabled(false);
            }
          }}
          onRemindersChange={handleRemindersChange}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 16,
  },
  saveButton: {
    marginRight: 16,
    paddingVertical: 4,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
